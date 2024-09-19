import express from "express";
const router = express.Router();

let products = [
  {
    id: "1",
    name: "Annie Bonny",
    description: "Perra energica y juetona de 3 años de edad",
    age: "3",
    image: "image/Annie Bonny.jpeg",
  },
  {
    id: "2",
    name: "Cleo",
    description: "Una gatita de 1 año, curiosa y aventurera. Siempre está explorando nuevos rincones de la casa.",
    age: "1",
    image: "image/Cleo.jpeg",
  },
  {
    id: "3",
    name: "Ramon",
    description: "Un gato blanco de 1 año, Energico y jugeton. Tambien disfruta de las siestas al sol.",
    age: "1.5",
    image: "image/Ramon.jpeg",
  },
  {
    id: "4",
    name: "Randall",
    description: "Perrito lindo",
    age: "6",
    image: "image/randall.jpeg",
  },
  {
    id: "5",
    name: "Ron",
    description: "Es un buen chico",
    age: "4",
    image: "image/Ron.jpeg",
  },
  {
    id: "6",
    name: "uma",
    description: "Le gusta viajar",
    age: "2",
    image: "image/uma.jpeg",
  },
  {
    id: "7",
    name: "Vasco",
    description: "es un buen chico",
    age: "5",
    image: "image/vasco.jpeg",
  },
  {
    id: "8",
    name: "Zuri",
    description: "Bolita de pelo amada por todos",
    age: "6",
    image: "image/zuri.jpeg",
  },
  {
    id: "9",
    name: "Lola",
    description: "Perro caniche de 1 año, cariñosa y celosa. Le encanta jugar con la gente y los niños.",
    age: "1",
    image: "image/Lola_caniche.jpg",
  },
];

// GET all product
router.get("/products", (req, res) => {
  res.json(products);
});

// POST a new product
router.post("/products", (req, res) => {
  const product = req.body;
  product.id = (products.length + 1).toString();
  products.push(product);
  res.status(201).json(product);
});

// DELETE a product by ID
router.delete("/products/:productId", (req, res) => {
  const productId = req.params.productId;
  products = products.filter((product) => product.id !== productId);
  res.sendStatus(204);
});

// PATCH (update) a product by ID
router.patch("/products/:productId", (req, res) => {
  const productId = req.params.productId;
  const updatedTask = req.body;

  products = products.map((product) => {
    if (product.id === productId) {
      return { ...product, ...updatedTask, id: productId };
    }
    return product;
  });

  res.json(products.find((product) => product.id === productId));
});

export default router;
