import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const proxy = httpProxy.createProxyServer();

app.all('/api/auth/*', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:8081' });
});

app.listen(port, () => {
    console.log(`API Gateway running on http://localhost:${port}`);
});
