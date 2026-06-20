// Run:  node system-design/chat-system/index.js
// A tiny in-memory pub/sub showing message fan-out to all subscribers of a room.
// This models the "topic per room" fan-out a chat backend uses between gateways.

class PubSub {
  constructor() {
    this.rooms = new Map(); // room -> Map(userId -> handler)
  }

  subscribe(room, userId, handler) {
    if (!this.rooms.has(room)) this.rooms.set(room, new Map());
    this.rooms.get(room).set(userId, handler);
    console.log(`[sub] ${userId} joined "${room}"`);
  }

  unsubscribe(room, userId) {
    this.rooms.get(room)?.delete(userId);
    console.log(`[unsub] ${userId} left "${room}"`);
  }

  // Fan out a message to every subscriber EXCEPT the sender.
  publish(room, fromUser, text) {
    const subs = this.rooms.get(room);
    if (!subs) return;
    let seq = (this._seq.get(room) || 0) + 1; // per-room ordering
    this._seq.set(room, seq);
    const msg = { room, from: fromUser, text, seq };
    console.log(`[pub] ${fromUser} -> "${room}" (#${seq}): ${text}`);
    for (const [userId, handler] of subs) {
      if (userId !== fromUser) handler(msg);
    }
  }

  _seq = new Map();
}

const bus = new PubSub();
const deliver = (userId) => (msg) =>
  console.log(`   -> delivered to ${userId}: [#${msg.seq}] ${msg.from}: ${msg.text}`);

// Three users join the "general" room.
bus.subscribe('general', 'alice', deliver('alice'));
bus.subscribe('general', 'bob', deliver('bob'));
bus.subscribe('general', 'carol', deliver('carol'));

console.log('---');
bus.publish('general', 'alice', 'hey team');   // bob + carol receive it
bus.publish('general', 'bob', 'morning!');      // alice + carol receive it

console.log('---');
bus.unsubscribe('general', 'carol');            // carol goes offline
bus.publish('general', 'alice', 'carol left'); // only bob receives it now
