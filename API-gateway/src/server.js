import express from "express"
import cors from "cors"
import { services } from "./config/services.js"
import { authenticate } from "./middlewares/auth.js"
import { gatewayRateLimit } from "./middlewares/rateLimit.js"
import { createServiceProxy } from "./proxy/proxy.js"

export const services = {

  auth: {
    prefix: "/auth",
    target: "http://auth-server:3000"
  },

  products: {
    prefix: "/products",
    target: "http://product-service:3000"
  },

  cart: {
    prefix: "/cart",
    target: "http://cart-checkout-server:3000"
  },

  checkout: {
    prefix: "/checkout",
    target: "http://cart-checkout-server:3000"
  },

  bank: {
    prefix: "/bank",
    target: "http://bank-server:3000"
  },

  profile: {
    prefix: "/profile",
    target: "http://auth-server:3000"
  },

  resetPassword: {
    prefix: "/reset",
    target: "http://auth-server:3000"
  },

  order: {
    prefix: "/order",
    target: "http://cart-checkout-server:3000"
  },

  blog: {
    prefix: "/blog",
    target: "http://product-service:3000"
  }

};
