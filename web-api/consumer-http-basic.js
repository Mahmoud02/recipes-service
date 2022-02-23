import { createRequire } from 'module'
import fetch from "node-fetch";

const require = createRequire(import.meta.url)
const server = require('fastify')();


const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3001;
const TARGET = process.env.TARGET || 'localhost:4001';

server.get('/', async () => {
    const req = await fetch(`http://${TARGET}/recipes/42`);
    const producer_data = await req.json();

    return {
        consumer_pid: process.pid,
        producer_data
    };
});

server.listen(PORT, HOST, () => {
    console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
