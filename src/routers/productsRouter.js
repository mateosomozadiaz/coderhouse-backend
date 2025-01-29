import { Router } from "express";
import ProductsManager from "../managers/productsManager.js";

const router = Router();

// La ruta debe escribirse como si se ejecutara el programa desde main.js
const productsManager = new ProductsManager("./data/products.json");

router.get("/", async (req, res) => {
	const products = await productsManager.getProducts();
	res.json(products);
});

router.get("/:id", async (req, res) => {
	const product = await productsManager.getProductById(parseInt(req.params.id));
	res.status(200).json(product);
});

router.post("/", async (req, res) => {
	const product = await productsManager.addProduct(req.body);
	res.status(201).json(product);
});

router.put("/:id", async (req, res) => {
	const product = await productsManager.updateProduct(parseInt(req.params.id), req.body);
	res.json(product);
});

router.delete("/:id", async (req, res) => {
	const updatedProducts = await productsManager.deleteProduct(parseInt(req.params.id));
	res.status(200).json(updatedProducts);
});

export default router;
