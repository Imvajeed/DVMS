import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware"

export const createServiceProxy = (target, prefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => `${prefix}${path}`,
    on: {
      proxyReq(proxyReq, req, res) {
        console.log("🔥 proxyReq fired")

        if (req.user) {
          proxyReq.setHeader("x-user-id", String(req.user.id))
          proxyReq.setHeader("x-user-role", String(req.user.role))
        }

        if (!req.body) return;

        const bodyData = JSON.stringify(req.body);

        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

        proxyReq.write(bodyData);
      }
    }
  })
