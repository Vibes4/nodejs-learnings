// Run:  node system-design/notification-service/index.js
// Enqueue notifications, then a worker dispatches them with dedupe and
// retry-with-backoff. Models at-least-once delivery + flaky providers. No deps.

const queue = [];
const sentKeys = new Set(); // idempotency: dedupe by userId+eventId
const MAX_RETRIES = 3;

// Templating: render a template id + data into text.
const templates = { shipped: (d) => `Hi ${d.name}, order ${d.id} shipped!` };

function enqueue(notif) {
  queue.push(notif);
  console.log(`[enqueue] ${notif.userId}/${notif.eventId} via ${notif.channel}`);
}

// Fake provider: fails the first attempt of a key, then succeeds — so we see a
// retry-with-backoff AND a successful send (so dedupe can fire on the duplicate).
const seen = new Map();
function fakeSend(channel, text, key) {
  const n = (seen.get(key) || 0) + 1;
  seen.set(key, n);
  if (n === 1) throw new Error(`${channel} provider 503`); // first try is flaky
  return `OK(${text})`;
}

async function worker() {
  for (const n of queue) {
    const key = `${n.userId}:${n.eventId}`;
    if (sentKeys.has(key)) {            // dedupe: already delivered
      console.log(`[dedupe] skip ${key} (already sent)`);
      continue;
    }
    const text = templates[n.template](n.data);
    let attempt = 0, ok = false;
    while (attempt < MAX_RETRIES && !ok) {
      attempt++;
      try {
        const res = fakeSend(n.channel, text, key);
        sentKeys.add(key);
        ok = true;
        console.log(`[sent] ${key} attempt ${attempt} -> ${res}`);
      } catch (e) {
        const backoff = 50 * 2 ** (attempt - 1); // 50,100,200ms
        console.log(`[retry] ${key} attempt ${attempt} failed (${e.message}); backoff ${backoff}ms`);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
    if (!ok) console.log(`[dead-letter] ${key} gave up after ${MAX_RETRIES} attempts`);
  }
}

(async () => {
  enqueue({ userId: 'u1', eventId: 'e1', channel: 'push',  template: 'shipped', data: { name: 'Alice', id: 901 } });
  enqueue({ userId: 'u2', eventId: 'e2', channel: 'email', template: 'shipped', data: { name: 'Bob', id: 902 } });
  enqueue({ userId: 'u1', eventId: 'e1', channel: 'push',  template: 'shipped', data: { name: 'Alice', id: 901 } }); // duplicate
  console.log('---');
  await worker();
})();
