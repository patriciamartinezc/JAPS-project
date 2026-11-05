/*
  src/data/seed.js - the starting data (what the pages used to type by hand)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only DATA, no logic. store.js copies these rows into the database the first
  time it finds a table empty, so they are the "seed" of the real data.
  Changing a row here has no effect on a japs.db that already has data: delete
  the japs.db file (or run "npm run reset") to start again from these rows.
*/

// ---- Main resource: garments (what collections.html used to type by hand) ----
const garments = [
  { id: 1, name: "The Silk Camisole", category: "shirts", price: 120, material: "Washed black silk with lace and beadwork", inStock: true, image: "images/oxford-shirt.jpg" },
  { id: 2, name: "The Sequin Shirt", category: "shirts", price: 110, material: "Matte black sequins on a soft viscose base", inStock: true, image: "images/sequin-shirt.jpg" },
  { id: 3, name: "The Slip Dress", category: "dresses", price: 130, material: "Washed black silk with French lace", inStock: true, image: "images/slip-dress.jpg" },
  { id: 4, name: "The Smock Dress", category: "dresses", price: 115, material: "Printed cotton voile", inStock: true, image: "images/smock-dress.jpg" },
  { id: 5, name: "The Scallop Knit Dress", category: "dresses", price: 125, material: "Cream cotton knit with open ladder stitches", inStock: true, image: "images/scallop-knit-dress.jpg" },
  { id: 6, name: "The Ikat Skirt", category: "skirts", price: 110, material: "Printed viscose crêpe", inStock: true, image: "images/ikat-skirt.jpg" },
  { id: 7, name: "The Suede Skirt", category: "skirts", price: 295, material: "Tobacco suede from a tannery in Ubrique", inStock: false, image: "images/suede-skirt.jpg" },
  { id: 8, name: "The Tweed Jacket", category: "jackets", price: 290, material: "Oatmeal tweed with a dark velvet collar", inStock: true, image: "images/look-01-tweed-suit.jpg" },
  { id: 9, name: "The Tailored Jacket", category: "jackets", price: 265, material: "Cream wool in a half lining", inStock: true, image: "images/look-02-cream-suit.jpg" },
  { id: 10, name: "The Check Trench Jacket", category: "jackets", price: 245, material: "Shower-proof waxed cotton check", inStock: true, image: "images/check-trench-jacket.jpg" },
  { id: 11, name: "The Cropped Navy Jacket", category: "jackets", price: 240, material: "Navy wool bouclé", inStock: true, image: "images/cropped-navy-jacket.jpg" },
  { id: 12, name: "The Puff-Sleeve Jacket", category: "jackets", price: 260, material: "Grey wool flannel", inStock: true, image: "images/puff-sleeve-jacket.jpg" },
  { id: 13, name: "The Pleated Trouser", category: "trousers", price: 135, material: "Chocolate Italian wool", inStock: true, image: "images/pleated-trouser.jpg" },
  { id: 14, name: "The Check Trouser", category: "trousers", price: 145, material: "Brown and black check wool flannel", inStock: true, image: "images/check-trouser.jpg" },
  { id: 15, name: "The Stripe Trouser", category: "trousers", price: 120, material: "Olive and brown ticking stripe in heavy cotton", inStock: true, image: "images/stripe-trouser.jpg" },
  { id: 16, name: "The Pinstripe Trouser", category: "trousers", price: 140, material: "Black wool twill with a rust pinstripe", inStock: true, image: "images/pinstripe-trouser.jpg" },
  { id: 17, name: "The Draped Trouser", category: "trousers", price: 165, material: "Black crêpe", inStock: false, image: "images/draped-trouser.jpg" },
  { id: 18, name: "The Suede Ballet Flat in Paprika", category: "shoes", price: 125, material: "Paprika suede with a pink leather lining", inStock: true, image: "images/ballet-flat-paprika.jpg" },
  { id: 19, name: "The Suede Ballet Flat in Olive", category: "shoes", price: 125, material: "Olive suede with a pink leather lining", inStock: true, image: "images/ballet-flat-olive.jpg" },
  { id: 20, name: "The Leather Shoulder Bag", category: "bags", price: 195, material: "Chocolate calf leather with white saddle stitching", inStock: true, image: "images/leather-handbag.jpg" },
];

// ---- stores.html ----
const stores = [
  { id: 1, name: "JAPS Madrid", city: "Madrid", address: "Calle de Serrano 46", hours: "Monday to Friday: 10:00 - 20:30. Saturday: 11:00 - 21:00. Sunday: closed", opensSunday: false, image: "images/madrid-store.jpg" },
  { id: 2, name: "JAPS Barcelona", city: "Barcelona", address: "Carrer de Verdi 8", hours: "Tuesday to Saturday: 11:00 - 20:00. Sunday and Monday: closed", opensSunday: false, image: "images/barcelona-store.jpg" },
  { id: 3, name: "JAPS Porto", city: "Porto", address: "Rua de Cedofeita 220", hours: "Monday to Saturday: 10:00 - 19:00. Sunday: closed", opensSunday: false, image: "images/porto-store.jpg" },
];

// ---- lookbook.html ----
const looks = [
  { id: 1, title: "Look 01 - Tweed jacket and wide trouser", season: "autumn-2026", description: "The Tweed Jacket in oatmeal, cut close through the waist and fastened high with a dark velvet collar, over the Pleated Trouser in the same cloth.", published: true, image: "images/look-01-tweed-suit.jpg" },
  { id: 2, title: "Look 02 - Cream suit, worn open", season: "autumn-2026", description: "The Tailored Jacket in cream, nipped at the waist and left open over bare skin, with wide trousers in the same cloth breaking over black loafers.", published: true, image: "images/look-02-cream-suit.jpg" },
  { id: 3, title: "Spring 2026 collage", season: "spring-2026", description: "The previous season, shot in Cádiz. Every piece from this shoot has now sold out.", published: true, image: "images/spring-2026-collage.jpg" },
];

// ---- login.html (accounts) ----
const customers = [
  { id: 1, fullName: "Jimena Gil", email: "jimena.gil@example.com", city: "Madrid", newsletter: true },
  { id: 2, fullName: "Ariadna Calzado", email: "ariadna.calzado@example.com", city: "Barcelona", newsletter: false },
  { id: 3, fullName: "Sofía Rodríguez", email: "sofia.rodriguez@example.com", city: "Porto", newsletter: true },
  { id: 4, fullName: "Patricia Martínez", email: "patricia.martinez@example.com", city: "Madrid", newsletter: false },
];

// ---- cart.html (orders and the garments inside each one) ----
const orders = [
  { id: 1, customerId: 1, status: "paid", country: "Spain", total: 245 },
  { id: 2, customerId: 3, status: "shipped", country: "Portugal", total: 265 },
  { id: 3, customerId: 2, status: "pending", country: "Spain", total: 120 },
];

const orderItems = [
  { id: 1, orderId: 1, garmentId: 10, quantity: 1, size: "M" },
  { id: 2, orderId: 2, garmentId: 3, quantity: 1, size: "S" },
  { id: 3, orderId: 2, garmentId: 13, quantity: 1, size: "S" },
  { id: 4, orderId: 3, garmentId: 1, quantity: 1, size: "XS" },
];

// ---- stores.html (free repairs for life) ----
const repairs = [
  { id: 1, customerId: 2, storeId: 1, description: "Replace a missing button on the Tweed Jacket", status: "received" },
  { id: 2, customerId: 4, storeId: 3, description: "Take in the waist of the Pleated Trouser", status: "done" },
];

// ---- collections.html (what customers say) ----
const reviews = [
  { id: 1, garmentId: 3, author: "Jimena Gil", rating: 5, comment: "It falls exactly as it looks in the photo." },
  { id: 2, garmentId: 10, author: "Sofía Rodríguez", rating: 4, comment: "Keeps off a shower. The belt is a little long." },
  { id: 3, garmentId: 13, author: "Ariadna Calzado", rating: 5, comment: "The pleats hold their shape after a day of wear." },
  { id: 4, garmentId: 1, author: "Patricia Martínez", rating: 4, comment: "Lovely beadwork, and it does take a while to finish." },
];

// ---- workshop.html (how we make it) ----
const fabrics = [
  { id: 1, name: "Chocolate Italian wool", origin: "Italy", gsm: 380, organic: false },
  { id: 2, name: "Oatmeal tweed", origin: "Spain", gsm: 450, organic: false },
  { id: 3, name: "Washed black silk", origin: "Italy", gsm: 70, organic: false },
  { id: 4, name: "Printed cotton voile", origin: "Portugal", gsm: 80, organic: true },
];

const workshops = [
  { id: 1, name: "Family workshop near Porto", city: "Porto", employees: 18, familyRun: true },
  { id: 2, name: "Madrid pattern room", city: "Madrid", employees: 6, familyRun: false },
];

module.exports = {
  garments, stores, looks, customers, orders, orderItems, repairs, reviews, fabrics, workshops,
};
