// Run:  node system-design/fundamentals/index.js
// Back-of-envelope capacity estimation — the kind of math you scribble in the
// first 5 minutes of a system design interview. No dependencies.

function estimate({ name, dau, writesPerUserPerDay, readWriteRatio, bytesPerRecord }) {
  const SECONDS_PER_DAY = 86400;

  // Daily write volume, then average + peak QPS (peak ~= 2-3x average).
  const writesPerDay = dau * writesPerUserPerDay;
  const writeQpsAvg = writesPerDay / SECONDS_PER_DAY;
  const readQpsAvg = writeQpsAvg * readWriteRatio;
  const peakFactor = 3; // traffic is bursty; size for the spike, not the mean

  // Storage: how much new data we accumulate per year.
  const bytesPerYear = writesPerDay * 365 * bytesPerRecord;
  const gb = (b) => (b / 1e9).toFixed(1) + ' GB';
  const k = (n) => Math.round(n).toLocaleString();

  console.log(`\n=== ${name} ===`);
  console.log(`DAU:                ${k(dau)}`);
  console.log(`Writes/day:         ${k(writesPerDay)}`);
  console.log(`Write QPS (avg):    ${k(writeQpsAvg)}`);
  console.log(`Write QPS (peak):   ${k(writeQpsAvg * peakFactor)}  (x${peakFactor})`);
  console.log(`Read QPS (avg):     ${k(readQpsAvg)}  (${readWriteRatio}:1 read/write)`);
  console.log(`Read QPS (peak):    ${k(readQpsAvg * peakFactor)}`);
  console.log(`New storage / year: ${gb(bytesPerYear)}`);
  console.log(`Storage / 5 years:  ${gb(bytesPerYear * 5)}`);
}

// Example: a Twitter-like feed. 200M DAU, 2 tweets/user/day, very read-heavy.
estimate({
  name: 'Tweet service',
  dau: 200_000_000,
  writesPerUserPerDay: 2,
  readWriteRatio: 100,      // timelines are read 100x more than written
  bytesPerRecord: 300,      // ~300 bytes/tweet row
});

// Example: a URL shortener. 100M new links/day, read-heavy redirects.
estimate({
  name: 'URL shortener',
  dau: 100_000_000,
  writesPerUserPerDay: 1,
  readWriteRatio: 100,
  bytesPerRecord: 500,
});

console.log('\nRule of thumb: 1M req/day ~= 12 QPS. Always size for PEAK, not average.');
