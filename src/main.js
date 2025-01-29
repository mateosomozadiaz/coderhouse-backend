import express from "express";
import productsRoutes from "./src/routers/productsRouter.js";
import cartsRoutes from "./src/routers/cartsRouter.js";

const app = express();
const port = 8080;

app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.get("/", (req, res) => {
	res.send("Primera Pre-Entrega Backend");
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
