import express from "express"
import cors from "cors"
import { services } from "./config/services.js"
import { authenticate } from "./middlewares/auth.js"
import { gatewayRateLimit } from "./middlewares/rateLimit.js"
import { createServiceProxy } from "./proxy/proxy.js"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.use(cors())
app.use(express.json())
app.use(gatewayRateLimit)

// Public routes (NO auth)
app.use(
  services.auth.prefix,
  createServiceProxy(services.auth.target,services.auth.prefix)
)
app.use(
    services.resetPassword.prefix,
    authenticate,
    createServiceProxy(services.resetPassword.target, services.resetPassword.prefix)
)

app.use(
    services.profile.prefix,
    authenticate,
    createServiceProxy(services.profile.target,services.profile.prefix)
)
app.use(
    services.bank.prefix,
    authenticate,
    createServiceProxy(services.bank.target,services.bank.prefix)
)

app.use(
    services.products.prefix,
    authenticate,
    createServiceProxy(services.products.target,services.products.prefix)
)




app.use(
    services.cart.prefix,
    authenticate,
    createServiceProxy(services.cart.target,services.cart.prefix)
)

app.use(
    services.checkout.prefix,
    authenticate,
    createServiceProxy(services.checkout.target,services.checkout.prefix)
)
// Protected routes
app.use(
  services.blog.prefix,
  authenticate,
  createServiceProxy(services.blog.target)
)

app.use(
  services.order.prefix,
  authenticate,
  createServiceProxy(services.order.target)
)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway running" })
})

app.listen(3100, () => {
  console.log("API Gateway running on port 3000")
})
