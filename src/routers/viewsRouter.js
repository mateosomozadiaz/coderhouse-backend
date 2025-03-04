import { Router } from "express";
import { productsManager } from "../main.js";

const router = Router();

router.get("/", async (req, res) => {
	const products = await productsManager.getProducts();
	res.render("home", { pageTitle: "Lista de Productos", products });
});

router.get("/realtimeproducts", async (req, res) => {
	const products = await productsManager.getProducts();
	res.render("realTimeProducts", { pageTitle: "Productos en Tiempo Real", products });
});

export default router;
