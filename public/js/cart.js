/*
  public/js/cart.js - orders and what is in them, through the API
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The cart table above is drawn by japs-cart.js from localStorage. Below it,
  the orders are a resource of their own:
    - orders: /api/orders (each one points at a customer)
    - order items: /api/order-items (each one points at an order and a garment)
  Both lists of ids are filled from the API.
*/

const orderItemsCrud = setupCrud({
  root: document.querySelector("#order-items-crud"),
  endpoint: "/order-items",
  singular: "order item",
  plural: "order items",
  columns: [
    { key: "orderId", label: "Order", lookup: "orderId" },
    { key: "garmentId", label: "Garment", lookup: "garmentId" },
    { key: "quantity", label: "Quantity" },
    { key: "size", label: "Size" },
  ],
  fields: [
    { name: "orderId", label: "Order", type: "select", required: true, optionsFrom: { endpoint: "/orders", label: (order) => `Order #${order.id} (${order.status})` } },
    { name: "garmentId", label: "Garment", type: "select", required: true, optionsFrom: { endpoint: "/garments", label: (garment) => garment.name } },
    { name: "quantity", label: "Quantity", type: "number", required: true, integer: true, min: 1, max: 20 },
    { name: "size", label: "Size", type: "select", options: SIZES, required: true },
  ],
});

setupCrud({
  root: document.querySelector("#orders-crud"),
  endpoint: "/orders",
  singular: "order",
  plural: "orders",
  columns: [
    { key: "id", label: "Order" },
    { key: "customerId", label: "Customer", lookup: "customerId" },
    { key: "status", label: "Status" },
    { key: "country", label: "Ships to" },
    { key: "total", label: "Total", money: true },
  ],
  fields: [
    { name: "customerId", label: "Customer", type: "select", required: true, optionsFrom: { endpoint: "/customers", label: (customer) => customer.fullName } },
    { name: "status", label: "Status", type: "select", options: ORDER_STATUSES, required: true },
    { name: "country", label: "Ships to", type: "select", options: COUNTRIES, required: true },
    { name: "total", label: "Total (€)", type: "number", required: true, min: 0, max: 10000 },
  ],
  // The order-items form lists the orders, so it has to know about the change
  onChange: async () => {
    await orderItemsCrud.reloadOptions();
    await orderItemsCrud.reload();
  },
});
