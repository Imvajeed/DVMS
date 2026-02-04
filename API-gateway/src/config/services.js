

export const services = {
  auth: {
    prefix: "/users",
    target: "http://localhost:4000"
  },
  profile:{
    prefix:"/profile",
    target:"http://localhost:4000"
  },
  resetPassword:{
    prefix:"/reset-password",
    target:"http://localhost:4000"
  },
  bank:{
    prefix:"/bank",
    target:"http://localhost:4001"
  },
  cart:{
    prefix:"/cart",
    target:"http://localhost:4005"
  },
  checkout:{
    prefix:"/checkout",
    target:"http://localhost:4005"
  },
  products:{
    prefix:"/products",
    target:"http://localhost:4003"
  },
  blog: {
    prefix: "/blogs",
    target: "http://blog-service:5000"
  },
  order: {
    prefix: "/orders",
    target: "http://order-service:6000"
  }
}
