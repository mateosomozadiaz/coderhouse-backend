import fs from "fs/promises";

export default class CartsManager {
	constructor(path) {
		this.path = path;
	}

	async _readFile() {
		try {
			const data = await fs.readFile(this.path, "utf8");
			return JSON.parse(data);
		} catch {
			return [];
		}
	}

	async _writeFile(data) {
		await fs.writeFile(this.path, JSON.stringify(data));
	}

	async createCart() {
		const carts = await this._readFile();
		const maxId = carts.reduce(function (maxId, cart) {
			return cart.id > maxId ? cart.id : maxId;
		}, 0);
		const newCart = { id: maxId + 1, products: [] };
		carts.push(newCart);
		await this._writeFile(carts);
		return newCart;
	}

	async getCartById(id) {
		const carts = await this._readFile();
		const cart = carts.find((c) => c.id === id);
		return cart.products || null;
	}

	async addProductToCart(cid, pid) {
		const carts = await this._readFile();
		const cart = carts.find((c) => c.id === cid);
		if (!cart) return null;
		const product = cart.products.find((p) => p.id === pid);
		product ? product.quantity++ : cart.products.push({ id: pid, quantity: 1 });
		await this._writeFile(carts);
		return product;
	}
}
