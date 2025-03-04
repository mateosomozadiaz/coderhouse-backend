import { Router } from "express";
import { productsManager } from "../main.js";

const router = Router();

router.get("/", async (req, res) => {
	const products = await productsManager.getProducts();
	res.json(products);
});

router.get("/:id", async (req, res) => {
	const product = await productsManager.getProductById(parseInt(req.params.id));
	if (!product) {
		return res.status(404).json({ error: "Producto no encontrado" });
	}
	res.status(200).json(product);
});

router.post("/", async (req, res) => {
	const product = await productsManager.addProduct(req.body);

	req.io.emit("products", await productsManager.getProducts());

	res.status(201).json(product);
});

router.put("/:id", async (req, res) => {
	const product = await productsManager.updateProduct(parseInt(req.params.id), req.body);
	if (!product) {
		return res.status(404).json({ error: "Producto no encontrado" });
	}

	req.io.emit("products", await productsManager.getProducts());

	res.json(product);
});

router.delete("/:id", async (req, res) => {
	const productExists = await productsManager.getProductById(parseInt(req.params.id));
	if (!productExists) {
		return res.status(404).json({ error: "Producto no encontrado" });
	}

	await productsManager.deleteProduct(parseInt(req.params.id));

	req.io.emit("products", await productsManager.getProducts());

	res.status(200).json({ message: "Producto eliminado" });
});

export default router;
