/* Front-end controller: builds the sidenav and loads each module's
   index.html (explanation) + index.js (runnable code) into the content pane.
   Also handles the persisted dark-mode toggle. */

const MODULES = {
  "JavaScript": {
    folder: "javascript",
    items: [
      ["types-coercion",       "Types & coercion",       "==, ===, typeof, NaN, falsy"],
      ["scope-hoisting",       "Scope & hoisting",       "var/let/const, TDZ, blocks"],
      ["closures",             "Closures",               "lexical scope, data privacy"],
      ["this-binding",         "this & binding",         "call, apply, bind, arrow"],
      ["prototypes",           "Prototypes & classes",   "proto chain, inheritance"],
      ["async",                "Promises & async/await", "microtasks, error handling"],
      ["array-methods",        "Array & object methods", "map, filter, reduce, spread"],
      ["es-features",          "Modern JS (ES6+)",       "destructuring, optional chaining"],
      ["iterators-generators", "Iterators & generators", "Symbol.iterator, yield"]
    ]
  },
  "Node.js Core": {
    folder: "node-specific",
    items: [
      ["globals",         "Globals & process",      "__dirname, process, argv, env"],
      ["modules",         "Modules: CJS vs ESM",    "require, module.exports, import"],
      ["event-loop",      "Event Loop & timers",    "phases, microtasks, nextTick"],
      ["events",          "EventEmitter",           "pub/sub, on/emit, memory leaks"],
      ["error-handling",  "Error handling",         "try/catch, callbacks, promises, process"],
      ["fs",              "File System (fs)",       "sync, callback, promises"],
      ["path",            "Path",                   "join, resolve, parse"],
      ["os",              "OS",                     "cpus, memory, platform"],
      ["streams",         "Streams",                "readable, writable, pipe, backpressure"],
      ["buffer",          "Buffer",                 "binary data, encodings"],
      ["http",            "HTTP (no framework)",    "createServer, routing by hand"],
      ["url-querystring", "URL & Query String",     "URL, URLSearchParams"],
      ["crypto",          "Crypto",                 "hash, hmac, encrypt, bcrypt vs sha"],
      ["util",            "Util",                   "promisify, inspect, types"],
      ["child-process",   "Child Process",          "spawn, exec, fork"],
      ["cluster",         "Cluster",                "multi-core scaling"],
      ["worker-threads",  "Worker Threads",         "CPU-bound parallelism"]
    ]
  },
  "Express.js": {
    folder: "express-specific",
    items: [
      ["basics",          "Express basics",         "app, listen, first route"],
      ["routing",         "Routing",                "methods, params, chaining"],
      ["middleware",      "Middleware",             "the heart of Express"],
      ["req-res",         "Request & Response",     "req object, res helpers"],
      ["static-files",    "Static files",           "express.static"],
      ["router",          "Router (modular)",       "express.Router(), mounting"],
      ["body-parsing",    "Body parsing",           "json, urlencoded, multipart"],
      ["error-handling",  "Error handling",         "4-arg middleware, async errors"],
      ["templating",      "Template engines",       "EJS / views / SSR"],
      ["rest-api",        "REST API design",        "CRUD, status codes, versioning"],
      ["validation",      "Validation & security",  "input validation, helmet, cors"],
      ["auth-jwt",        "Authentication (JWT)",   "sessions vs tokens, middleware"]
    ]
  },
  "NestJS": {
    folder: "nestjs",
    items: [
      ["overview",          "NestJS overview",         "what, why, architecture"],
      ["modules",           "Modules",                 "@Module, encapsulation"],
      ["controllers",       "Controllers",             "routing, decorators, params"],
      ["providers-di",      "Providers & DI",          "@Injectable, injection, scopes"],
      ["request-lifecycle", "Lifecycle features",      "middleware, guards, pipes, interceptors"],
      ["exception-filters", "Exception filters",       "centralized error handling"],
      ["features",          "Ecosystem & features",    "TypeORM, GraphQL, microservices"]
    ]
  },
  "MongoDB": {
    folder: "mongodb",
    items: [
      ["basics",          "MongoDB + Mongoose",     "schemas, queries, populate"],
      ["data-modeling",   "Data modeling",          "embed vs reference"],
      ["aggregation",     "Aggregation pipeline",   "$match, $group, $lookup"],
      ["indexing",        "Indexing & performance", "IXSCAN, ESR rule, explain"],
      ["transactions",    "Transactions",           "sessions, ACID, write concern"]
    ]
  },
  "SQL": {
    folder: "sql",
    items: [
      ["basics",            "SQL basics & pooling",   "pools, parameterized queries"],
      ["joins",             "Joins",                  "inner, left, right, full"],
      ["indexing",          "Indexing & tuning",      "B-tree, EXPLAIN ANALYZE"],
      ["transactions-acid", "Transactions & ACID",    "isolation levels, locking"],
      ["normalization",     "Normalization",          "1NF–3NF, when to denormalize"]
    ]
  },
  "DSA": {
    folder: "dsa",
    items: [
      ["big-o",         "Big-O cheat sheet",     "time & space complexity"],
      ["arrays",        "Arrays",                "two pointers, sliding window"],
      ["strings",       "Strings",               "anagrams, substrings"],
      ["hashmap",       "HashMap / HashSet",     "frequency, lookup, dedupe"],
      ["linked-list",   "Linked List",           "fast/slow, reverse"],
      ["stack",         "Stack",                 "parentheses, monotonic"],
      ["queue",         "Queue",                 "BFS, scheduling"],
      ["trees",         "Trees",                 "DFS, BFS, traversals"],
      ["graphs",        "Graphs",                "DFS, BFS, visited set"],
      ["heap",          "Heap / Priority Queue", "top-K, streaming"],
      ["binary-search", "Binary Search",         "sorted data, O(log n)"],
      ["lru-cache",     "LRU Cache",             "HashMap + DLL, O(1)"]
    ]
  },
  "System Design": {
    folder: "system-design",
    items: [
      ["fundamentals",         "SD fundamentals",      "scalability, CAP, load balancing"],
      ["caching",              "Caching & Redis",      "patterns, eviction, invalidation"],
      ["message-queues",       "Message queues",       "Kafka, RabbitMQ, async work"],
      ["rate-limiter",         "Rate limiter",         "token bucket, sliding window"],
      ["url-shortener",        "URL shortener",        "base62, hashing, scale"],
      ["chat-system",          "Chat system",          "websockets, fan-out, presence"],
      ["notification-service", "Notification service", "push/email, queues, retries"],
      ["file-upload",          "File upload service",  "chunking, presigned URLs"]
    ]
  },
  "Wrap-up": {
    folder: "express-specific",
    items: [
      ["why-express",     "Why Express over Node?", "what Express adds on top of node"]
    ]
  }
};

const navList = document.getElementById("nav-list");
const content = document.getElementById("content");
const search  = document.getElementById("search");

// Flat lookup: "folder/slug" is unique because slugs repeat across sections (e.g. "basics").
const flat = {};
const keyOf = (folder, slug) => `${folder}::${slug}`;

function buildNav() {
  navList.innerHTML = "";
  for (const [group, { folder, items }] of Object.entries(MODULES)) {
    const details = document.createElement("details");
    details.className = "nav-group";
    details.open = true;                       // expanded by default; click to collapse

    const summary = document.createElement("summary");
    summary.className = "nav-group-title";
    summary.textContent = group;
    details.appendChild(summary);

    items.forEach(([slug, name, blurb]) => {
      const key = keyOf(folder, slug);
      flat[key] = { folder, slug, name, blurb };
      const a = document.createElement("a");
      a.className = "nav-item";
      a.dataset.key = key;
      a.href = "#" + key;
      a.innerHTML = `${name}<small>${blurb}</small>`;
      details.appendChild(a);
    });
    navList.appendChild(details);
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

/* Turn each <h2> "major concept" + the content that follows it into a
   collapsible <details class="acc"> panel (open by default, click to close).
   The <h1>/intro stay as a fixed header; the .interview Q&A card is left
   untouched (it already has its own per-question accordions). */
function groupIntoAccordions(root) {
  const nodes = Array.from(root.childNodes);
  const frag = document.createDocumentFragment();
  let body = null; // current open panel's body, or null when outside a panel

  const openPanel = (summaryHTML) => {
    const d = document.createElement("details");
    d.className = "acc";
    d.open = true;
    const s = document.createElement("summary");
    s.innerHTML = summaryHTML;
    body = document.createElement("div");
    body.className = "acc-body";
    d.append(s, body);
    frag.appendChild(d);
  };

  nodes.forEach(node => {
    const el = node.nodeType === 1 ? node : null;
    if (el && el.tagName === "H2") {            // start a new collapsible concept
      openPanel(el.innerHTML);
      return;
    }
    if (el && el.classList.contains("interview")) {  // leave the Q&A card standalone
      body = null;
      frag.appendChild(node);
      return;
    }
    (body || frag).appendChild(node);           // header content, or current panel body
  });

  root.innerHTML = "";
  root.appendChild(frag);
}

async function loadModule(key) {
  const meta = flat[key];
  if (!meta) return;

  document.querySelectorAll(".nav-item").forEach(el =>
    el.classList.toggle("active", el.dataset.key === key));

  // make sure the active item's group is expanded
  const activeEl = document.querySelector(".nav-item.active");
  const activeGroup = activeEl && activeEl.closest(".nav-group");
  if (activeGroup) activeGroup.open = true;

  const base = `${meta.folder}/${meta.slug}`;
  content.innerHTML = `<p class="placeholder">Loading ${meta.name}…</p>`;

  try {
    const [htmlRes, jsRes] = await Promise.all([
      fetch(`${base}/index.html`),
      fetch(`${base}/index.js`)
    ]);
    const explanation = await htmlRes.text();
    const code = jsRes.ok ? await jsRes.text() : "// (no index.js for this page)";

    const runCmd = `node ${base}/index.js`;
    const codeBlock = jsRes.ok ? `
      <h2>📄 Code — <code>${base}/index.js</code></h2>
      <div class="run-banner">
        <span># run it:</span> <span class="cmd-text">${runCmd}</span>
        <button class="copy-btn run-copy" onclick="copyRunCmd(this)" data-cmd="${runCmd}">Copy</button>
      </div>
      <div class="code-wrap">
        <div class="code-head">
          <span class="run-cmd">$ ${runCmd}</span>
        </div>
        <pre><code>${escapeHtml(code)}</code></pre>
      </div>` : "";

    content.innerHTML = explanation + codeBlock;
    groupIntoAccordions(content);
    content.scrollTop = 0;
  } catch (e) {
    content.innerHTML = `<div class="callout warn"><strong>Could not load module.</strong>
      Are you running through the server? Open a terminal here and run
      <code>npm install && npm start</code>, then visit
      <code>http://localhost:3000</code>. (Browsers block <code>fetch()</code> on <code>file://</code>.)</div>`;
  }
}

window.copyRunCmd = function (btn) {
  navigator.clipboard.writeText(btn.dataset.cmd).then(() => {
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1200);
  });
};

/* ---------- Dark mode ---------- */
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
function syncThemeIcon() {
  themeIcon.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
}
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
  syncThemeIcon();
});
syncThemeIcon();

/* ---------- Search ---------- */
search.addEventListener("input", () => {
  const q = search.value.toLowerCase().trim();
  document.querySelectorAll(".nav-group").forEach(group => {
    let anyMatch = false;
    group.querySelectorAll(".nav-item").forEach(el => {
      const match = el.textContent.toLowerCase().includes(q);
      el.style.display = match ? "" : "none";
      if (match) anyMatch = true;
    });
    // while searching, expand groups with hits and hide groups with none;
    // when the box is cleared, show every group again (expanded)
    group.style.display = q && !anyMatch ? "none" : "";
    if (q) group.open = anyMatch; else group.open = true;
  });
});

window.addEventListener("hashchange", () => {
  const key = decodeURIComponent(location.hash.slice(1));
  if (flat[key]) loadModule(key);
});

buildNav();
const initial = decodeURIComponent(location.hash.slice(1));
if (flat[initial]) loadModule(initial);
