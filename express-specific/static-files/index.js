// Run:  node express-specific/static-files/index.js   -> http://localhost:3005
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Create a small public folder on the fly for the demo
const pub = path.join(__dirname, 'public');
fs.mkdirSync(pub, { recursive: true });
fs.writeFileSync(path.join(pub, 'index.html'),
  '<h1>Served by express.static</h1><img src="/assets/pixel.txt-as-demo">');
fs.writeFileSync(path.join(pub, 'hello.txt'), 'this is a static file\n');

// Serve the folder. ALWAYS use an absolute path.
app.use(express.static(pub, {
  maxAge: '1h',          // Cache-Control: max-age=3600
  etag: true,
}));

// You can also mount under a prefix
app.use('/assets', express.static(pub));

app.listen(3005, () => {
  console.log('Static files on http://localhost:3005');
  console.log('Try: /            -> index.html (auto)');
  console.log('     /hello.txt   -> static text file');
  console.log('     /assets/hello.txt -> same file under prefix');
  console.log('(public/ folder was generated next to this script)');
});
