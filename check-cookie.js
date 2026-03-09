const http = require('http');

const postData = JSON.stringify({
    email: 'sajidleet@gmail.com',
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 5173,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log('STATUS:', res.statusCode);
    console.log('--- ALL RESPONSE HEADERS ---');
    Object.entries(res.headers).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
    console.log('--- SET-COOKIE SPECIFICALLY ---');
    console.log(res.headers['set-cookie']);

    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('--- BODY ---');
        console.log(body.substring(0, 200));
    });
});

req.write(postData);
req.end();
