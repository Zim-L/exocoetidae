// Cloudflare Worker for Exocoetidae. Env: TOKEN (shared secret), BRAVE_KEY (optional), KV binding "KV" + a cron trigger (* * * * *) for push reminders.
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'x-token,content-type,authorization,mcp-protocol-version,mcp-session-id,last-event-id', 'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS', 'access-control-expose-headers': 'mcp-session-id,mcp-protocol-version' };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, 'content-type': 'application/json' } });
const strip = h => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

const te = new TextEncoder();
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0));
const cat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; };
const EC = { name: 'ECDH', namedCurve: 'P-256' };
const hkdf = async (salt, ikm, info, len) => new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), len * 8));

async function encrypt(plain, p256dh, auth, eph, salt) {
  const recv = unb64u(p256dh), pub = await crypto.subtle.importKey('raw', recv, EC, false, []);
  eph = eph || await crypto.subtle.generateKey(EC, true, ['deriveBits']);
  const ephPub = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: pub }, eph.privateKey, 256));
  const ikm = await hkdf(unb64u(auth), shared, cat(te.encode('WebPush: info\0'), recv, ephPub), 32);
  salt = salt || crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, te.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, te.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(te.encode(plain), new Uint8Array([2]))));
  return cat(salt, new Uint8Array([0, 0, 16, 0, 65]), ephPub, ct);
}

async function vapid(env) {
  let v = await env.KV.get('vapid', 'json');
  if (!v) {
    const k = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign']);
    v = { pub: b64u(await crypto.subtle.exportKey('raw', k.publicKey)), priv: await crypto.subtle.exportKey('jwk', k.privateKey) };
    await env.KV.put('vapid', JSON.stringify(v));
  }
  return v;
}
async function vapidAuth(env, endpoint) {
  const v = await vapid(env), enc = o => b64u(te.encode(JSON.stringify(o)));
  const data = enc({ typ: 'JWT', alg: 'ES256' }) + '.' + enc({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 43200, sub: 'mailto:exocoetidae@example.com' });
  const key = await crypto.subtle.importKey('jwk', v.priv, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, te.encode(data));
  return `vapid t=${data}.${b64u(sig)}, k=${v.pub}`;
}
async function push(env, sub, payload) {
  const body = await encrypt(JSON.stringify(payload), sub.keys.p256dh, sub.keys.auth);
  return fetch(sub.endpoint, { method: 'POST', body, headers: { authorization: await vapidAuth(env, sub.endpoint), 'content-encoding': 'aes128gcm', 'content-type': 'application/octet-stream', ttl: '86400', urgency: 'high' } });
}

async function cron(env) {
  const now = Date.now(), list = await env.KV.list({ prefix: 'r:' });
  for (const { name } of list.keys) {
    const rec = await env.KV.get(name, 'json'); if (!rec) continue;
    let changed = false;
    for (const r of rec.reminders) {
      if (r.pushed || r.at > now) continue;
      const res = await push(env, rec.sub, { title: '⏰ ' + r.text, body: r.prompt ? '打开页面即执行' : '', id: r.id });
      if (res.status === 404 || res.status === 410) { await env.KV.delete(name); changed = false; break; }
      r.pushed = true; changed = true;
    }
    if (changed) await env.KV.put(name, JSON.stringify(rec));
  }
}

export default {
  scheduled: (_, env) => cron(env),
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (env.TOKEN && req.headers.get('x-token') !== env.TOKEN) return json({ error: 'bad token' }, 401);
    const u = new URL(req.url), q = u.searchParams.get('q') || '', count = +(u.searchParams.get('count') || 6);
    if (u.pathname === '/mcp') {
      if (!env.MCP_URL) return json({ error: 'MCP_URL is not configured' }, 501);
      const headers = new Headers(req.headers); headers.delete('host'); headers.delete('x-token'); headers.set('accept', req.headers.get('accept') || 'application/json, text/event-stream');
      if (env.MCP_TOKEN) headers.set('authorization', 'Bearer ' + env.MCP_TOKEN);
      const upstream = await fetch(env.MCP_URL, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body, redirect: 'manual' });
      const out = new Headers(upstream.headers); for (const [k, v] of Object.entries(CORS)) out.set(k, v);
      return new Response(upstream.body, { status: upstream.status, headers: out });
    }
    if (u.pathname.startsWith('/llm/kilo/')) {
      const target = 'https://api.kilo.ai/api/gateway/' + u.pathname.slice('/llm/kilo/'.length);
      const headers = new Headers(req.headers); headers.delete('host'); headers.delete('x-token');
      const upstream = await fetch(target, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body });
      const out = new Headers(upstream.headers); for (const [k, v] of Object.entries(CORS)) out.set(k, v);
      return new Response(upstream.body, { status: upstream.status, headers: out });
    }
    if (u.pathname === '/ping') return new Response('ok' + (env.BRAVE_KEY ? ' brave' : ' ddg') + (env.KV ? ' push' : ''), { headers: CORS });
    if (u.pathname === '/vapid') return env.KV ? json({ key: (await vapid(env)).pub }) : json({ error: '未绑定 KV' }, 501);
    if (u.pathname === '/reminders' && req.method === 'POST') {
      const { sub, reminders } = await req.json();
      const id = b64u(await crypto.subtle.digest('SHA-256', te.encode(sub.endpoint))).slice(0, 24);
      await env.KV.put('r:' + id, JSON.stringify({ sub, reminders: reminders.map(r => ({ id: r.id, at: r.at, text: r.text, prompt: !!r.prompt, pushed: !!r.pushed })) }));
      return json({ ok: true });
    }
    if (u.pathname === '/fetch') {
      const target = u.searchParams.get('url') || '';
      if (!/^https?:\/\//.test(target)) return json({ error: 'bad url' }, 400);
      const r = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Exocoetidae)' }, redirect: 'follow' });
      const t = await r.text();
      return new Response((r.headers.get('content-type') || '').includes('html') ? strip(t) : t, { status: r.status, headers: { ...CORS, 'content-type': 'text/plain; charset=utf-8' } });
    }
    if (u.pathname === '/search') {
      if (env.BRAVE_KEY) {
        const r = await fetch('https://api.search.brave.com/res/v1/web/search?q=' + encodeURIComponent(q) + '&count=' + count, { headers: { 'X-Subscription-Token': env.BRAVE_KEY, accept: 'application/json' } });
        if (!r.ok) return json({ error: 'brave ' + r.status }, 502);
        return json(((await r.json()).web?.results || []).map(x => ({ title: x.title, url: x.url, snippet: x.description })));
      }
      const r = await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q), { headers: { 'user-agent': 'Mozilla/5.0' } });
      const html = await r.text(), out = [], re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
      let m; while ((m = re.exec(html)) && out.length < count) out.push({ url: decodeURIComponent((m[1].match(/uddg=([^&]+)/) || [, m[1]])[1]), title: strip(m[2]), snippet: strip(m[3]) });
      return json(out);
    }
    return json({ error: 'not found' }, 404);
  },
};
export { encrypt };

// Browser notification support when this optional file is served beside the chat page.
if (typeof self !== 'undefined' && self.registration && self.clients) {
  self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
  self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
  self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: 'Exocoetidae' };
    event.waitUntil(self.registration.showNotification(data.title || '提醒', {
      body: data.body || '', tag: 'rem-' + (data.id || ''), data
    }));
  });
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = new URL('exocoetidae.html', self.registration.scope).href;
    event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
      const chat = windows.find(client => new URL(client.url).origin === new URL(url).origin && new URL(client.url).pathname === new URL(url).pathname);
      return chat ? chat.focus() : self.clients.openWindow(url);
    }));
  });
}
