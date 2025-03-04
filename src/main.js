import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import productsRouter from "./routers/productsRouter.js";
import cartsRouter from "./routers/cartsRouter.js";
import viewsRouter from "./routers/viewsRouter.js";
import ProductsManager from "./managers/productsManager.js";
import CartsManager from "./managers/cartsManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsManager = new ProductsManager("./src/data/products.json");
const cartsManager = new CartsManager("./src/data/carts.json");

const PORT = 8080;

const app = express();
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const httpServer = app.listen(PORT, () =>
	console.log(`Servidor corriendo en http://localhost:${PORT}`)
);

const io = new Server(httpServer);

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
	console.log("Cliente conectado");

	io.emit("products", await productsManager.getProducts());

	socket.on("deleteProduct", async (id) => {
		await productsManager.deleteProduct(id);
		io.emit("products", await productsManager.getProducts());
	});

	socket.on("addProduct", async (product) => {
		const { title, description, image, code, price, status, stock, category } = product;
		if (
			!title ||
			!description ||
			!image ||
			!code ||
			price === undefined ||
			status === undefined ||
			stock === undefined ||
			!category
		) {
			console.error("Faltan atributos del producto");
		} else {
			await productsManager.addProduct(product);
			io.emit("products", await productsManager.getProducts());
		}
	});
});

export { productsManager, cartsManager };
