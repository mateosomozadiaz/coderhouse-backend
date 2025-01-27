import fs from "fs/promises";

export default class ProductsManager {
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

	async addProduct(product) {
		const products = await this._readFile();
		const maxId = products.reduce(function (maxId, product) {
			return product.id > maxId ? product.id : maxId;
		}, 0);
		const newProduct = { ...product, id: maxId + 1 };
		products.push(newProduct);
		await this._writeFile(products);
		return newProduct;
	}

	async getProducts() {
		return await this._readFile();
	}

	async getProductById(id) {
		const products = await this._readFile();
		return products.find((p) => p.id === id) || null;
	}

	async updateProduct(id, updates) {
		const products = await this._readFile();
		const index = products.findIndex((p) => p.id === id);
		if (index === -1) return null;
		products[index] = { ...products[index], ...updates };
		await this._writeFile(products);
		return products[index];
	}

	async deleteProduct(id) {
		const products = await this._readFile();
		const updatedProducts = products.filter((p) => p.id !== id);
		await this._writeFile(updatedProducts);
	}
}
