// Run:  node express-specific/templating/index.js   -> http://localhost:3009
// To avoid extra installs, this registers a TINY custom engine so res.render works.
// In real apps:  npm install ejs   then   app.set('view engine','ejs')
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const views = path.join(__dirname, 'views');
fs.mkdirSync(views, { recursive: true });

// A throwaway template: {{title}} interpolation + {{#each users}} loop, HTML-escaped.
fs.writeFileSync(path.join(views, 'home.tpl'),
`<!doctype html><h1>{{title}}</h1><ul>{{#each users}}<li>{{.}}</li>{{/each}}</ul>`);

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Register custom engine for ".tpl" files (this is exactly what EJS/Pug plug into)
app.engine('tpl', (filePath, options, callback) => {
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) return callback(err);
    let html = content.replace(/{{title}}/g, escapeHtml(options.title));
    html = html.replace(/{{#each users}}(.*?){{\/each}}/s, (_, item) =>
      options.users.map(u => item.replace(/{{\.}}/g, escapeHtml(u))).join(''));
    callback(null, html);
  });
});
app.set('view engine', 'tpl');
app.set('views', views);

app.get('/', (req, res) => {
  // Note user data is auto-escaped -> XSS-safe
  res.render('home', { title: 'Server-rendered page', users: ['Ada', 'Linus', '<script>alert(1)</script>'] });
});

app.listen(3009, () => {
  console.log('Templating on http://localhost:3009  (the <script> in the list is escaped, not executed)');
});
