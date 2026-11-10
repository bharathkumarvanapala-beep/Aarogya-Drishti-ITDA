const fs=require('node:fs');
const value=process.env.BACKEND_ORIGIN;
if(!value)throw Error('Set BACKEND_ORIGIN to the deployed backend HTTPS address before publishing');
const url=new URL(value);
if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('BACKEND_ORIGIN must be an HTTPS origin without a path or credentials');
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/_redirects',`/api/* ${url.origin}/api/:splat 200!\n/* /index.html 200\n`);
console.log('Netlify API forwarding and page routes prepared');
