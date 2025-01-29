import { Router } from "express";
import CartsManager from "../managers/cartsManager.js";

const router = Router();

// La ruta debe escribirse como si se ejecutara el programa desde main.js
const cartsManager = new CartsManager("./data/carts.json");

router.post("/", async (req, res) => {
	const cart = await cartsManager.createCart();
	res.status(201).json(cart);
});

router.get("/:id", async (req, res) => {
	const cart = await cartsManager.getCartById(parseInt(req.params.id));
	res.status(200).json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
	const product = await cartsManager.addProductToCart(
		parseInt(req.params.cid),
		parseInt(req.params.pid)
	);
	res.status(201).json(product);
});

export default router;
