// Run:  node node-specific/url-querystring/index.js
const u = new URL('https://user:pw@api.example.com:8443/v1/users?role=admin&role=dev&q=hello%20world#section');

console.log('--- URL parts ---');
console.log('protocol :', u.protocol);   // https:
console.log('hostname :', u.hostname);   // api.example.com
console.log('port     :', u.port);       // 8443
console.log('pathname :', u.pathname);   // /v1/users
console.log('search   :', u.search);     // ?role=admin&role=dev&q=hello%20world
console.log('hash     :', u.hash);       // #section

console.log('\n--- searchParams ---');
console.log("get('q')     :", u.searchParams.get('q'));      // "hello world" (decoded)
console.log("get('role')  :", u.searchParams.get('role'));   // admin (first)
console.log("getAll('role'):", u.searchParams.getAll('role')); // ['admin','dev']
console.log('has(role)?   :', u.searchParams.has('role'));

console.log('\n--- building a query string safely ---');
const params = new URLSearchParams();
params.set('search', 'node & express');   // & gets encoded
params.set('page', '2');
params.append('tag', 'a');
params.append('tag', 'b');
console.log('encoded:', params.toString());   // search=node+%26+express&page=2&tag=a&tag=b

console.log('\n--- relative resolution with a base ---');
console.log(new URL('../profile', 'https://site.com/users/42/edit').href);
