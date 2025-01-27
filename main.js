import express from "express";
import CartsManager from "./managers/cartsManager.js";
import ProductsManager from "./managers/productsManager.js";

const cartsManager = new CartsManager("./cart.json");
const productsManager = new ProductsManager("./products.json");

const port = 8080;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Primera Pre-Entrega Backend");
});

/* Products */

app.get("/api/products", async (req, res) => {
	const products = await productsManager.getProducts();
	res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
	const product = await productsManager.getProductById(parseInt(req.params.id));
	res.status(200).json(product);
});

app.post("/api/products", async (req, res) => {
	const product = await productsManager.addProduct(req.body);
	res.status(201).json(product);
});

app.put("/api/products/:id", async (req, res) => {
	const product = await productsManager.updateProduct(parseInt(req.params.id), req.body);
	res.json(product);
});

app.delete("/api/products/:id", async (req, res) => {
	await productsManager.deleteProduct(parseInt(req.params.id));
	res.sendStatus(200);
});

/* Carts */

app.post("/api/carts", async (req, res) => {
	const cart = await cartsManager.createCart();
	res.status(201).json(cart);
});

app.get("/api/carts/:id", async (req, res) => {
	const cart = await cartsManager.getCartById(parseInt(req.params.id));
	res.status(200).json(cart);
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
	const product = await cartsManager.addProductToCart(
		parseInt(req.params.cid),
		parseInt(req.params.pid)
	);
	res.status(201).json(product);
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
