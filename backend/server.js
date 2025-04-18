import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';

const app = express();
const port = 8080;

app.use(express.json());


app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000/', 'http://localhost:5173/', 'http://3.149.235.1:5173/']
}));

const proxy = httpProxy.createProxyServer();

app.all('/api/auth/*', (req, res) => {
    console.log(`🔥 API Gateway received request: ${req.method} ${req.url}`);
    console.log(`➡️ Forwarding request to auth service at http://localhost:8081${req.url}`);
    console.log(`📦 Request Body:`, req.body);

    proxy.web(req, res, { 
        target: 'http://localhost:8081', 
        changeOrigin: true 
    }, (err) => {
        console.error('❌ Proxy failed:', err);
        res.status(500).json({ error: 'Gateway error: Failed to forward request' });
    });
});

app.all('/api/user/*', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:8082' });
});


app.listen(port, () => {
    console.log(`🚀 API Gateway running on http://localhost:${port}`);
});
