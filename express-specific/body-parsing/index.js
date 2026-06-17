// Run:  node express-specific/body-parsing/index.js   -> http://localhost:3007
const express = require('express');
const app = express();

// JSON bodies, capped at 1mb to avoid memory-exhaustion DoS
app.use(express.json({ limit: '1mb' }));

// HTML form posts; extended:true allows nested objects (user[name]=...)
app.use(express.urlencoded({ extended: true }));

app.post('/json', (req, res) => {
  res.json({ received: req.body, type: 'application/json' });
});

app.post('/form', (req, res) => {
  res.json({ received: req.body, type: 'urlencoded' });
});

// A tiny HTML form to test urlencoded parsing in the browser
app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/form">
      <input name="user[name]" placeholder="name" />
      <input name="user[role]" placeholder="role" />
      <button>Submit (urlencoded)</button>
    </form>`);
});

// File uploads need multer (npm install multer) — sketch:
//   const multer = require('multer');
//   const upload = multer({ dest: 'uploads/', limits: { fileSize: 5e6 } });
//   app.post('/upload', upload.single('file'), (req, res) => res.json(req.file));

app.listen(3007, () => {
  console.log('Body parsing on http://localhost:3007');
  console.log('Open / for a form, or:');
  console.log('  curl -XPOST localhost:3007/json -H "Content-Type: application/json" -d \'{"a":1,"b":{"c":2}}\'');
});
