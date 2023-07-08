// DESAFIO 1 Stephanie Legarra - Curso Backend - Comisión: 55305

class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, thumbnail, code) {
    // VALIDAR CAMPOS OBLIGATORIOS
    if (!title || !description || !price || !thumbnail || !code) {
      console.log("Todos los campos son obligatorios");
      return;
    }
    // ALERTA CODE
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].code === code) {
        console.log(`El código ${code} ya existe`);
        return;
      }
    }

    const product = {
      id: this.getId(),
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: 25,
    };
    this.products.push(product);
  }

  getId() {
    let max = 0;
    this.products.forEach((prod) => {
      max = prod.id > max && prod.id;
    });

    return max + 1;
  }

  getProductById(id) {
    if (!this.products.find((prod) => prod.id === id)) {
      console.log("Error not found");
    } else {
      console.log(this.products.find((prod) => prod.id === id));
    }
  }
}

const product = new ProductManager();

let vacio = product.getProducts(); // ARRAY VACIO
console.log(vacio);

product.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "sin imagen",
  "abc123"
);
product.addProduct(
  "producto prueba 2",
  "Este es un segundo producto de prueba",
  300,
  "sin imagen",
  "abc123"
);
product.addProduct(
  "producto prueba 3",
  "Este es un tercer producto de prueba",
  300,
  "sin imagen",
  "asd456"
);

console.log(product.getProducts()); // ARRAY CON LOS PRODUCTOS

// BUSCAR PRODUCTO POR ID
product.getProductById(25);
product.getProductById(2);
