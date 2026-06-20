// Run:  node system-design/message-queues/index.js
// In-memory queue with a producer, a consumer, retries-with-backoff, and a DLQ.
// Models at-least-once delivery: failing jobs are retried, then dead-lettered.

const queue = [];   // pending messages
const dlq = [];     // dead-letter queue (gave up after MAX_RETRIES)
const MAX_RETRIES = 3;

// Producer: enqueue some jobs. Job #2 is "poison" — it always fails.
function produce(jobs) {
  jobs.forEach((payload, i) => {
    queue.push({ id: i + 1, payload, attempts: 0 });
    console.log(`[producer] enqueued job#${i + 1} (${payload})`);
  });
}

// Simulated work: job#2 always throws; others succeed.
function processJob(job) {
  if (job.payload === 'poison') throw new Error('cannot process');
  return `done:${job.payload}`;
}

// Consumer: drains the queue, retrying failures with exponential backoff.
async function consume() {
  while (queue.length) {
    const job = queue.shift();
    job.attempts++;
    try {
      const result = processJob(job);
      console.log(`[consumer] job#${job.id} OK -> ${result}`);
    } catch (err) {
      if (job.attempts < MAX_RETRIES) {
        const backoff = 100 * 2 ** (job.attempts - 1); // 100ms, 200ms, 400ms
        console.log(`[consumer] job#${job.id} FAILED (${err.message}); retry ${job.attempts}/${MAX_RETRIES} in ${backoff}ms`);
        await new Promise((r) => setTimeout(r, backoff));
        queue.push(job); // requeue for another attempt
      } else {
        console.log(`[consumer] job#${job.id} exhausted retries -> DEAD-LETTER`);
        dlq.push(job);
      }
    }
  }
}

(async () => {
  produce(['email-alice', 'poison', 'email-bob']);
  console.log('---');
  await consume();
  console.log('---');
  console.log(`DLQ holds ${dlq.length} message(s):`, dlq.map((j) => `job#${j.id}`).join(', '));
})();
