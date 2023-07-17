// DESAFIO 2 Stephanie Legarra - Curso Backend - Comisión: 55305

// FILE SYSTEM
const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "Products.json";
    this.createFile();
  }

  createFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
  }

  addProduct(product) {
    // VALIDAR CAMPOS OBLIGATORIOS
    const values = Object.values(product).length;
    console.log(values);

    // VALIDAR CAMPOS OBLIGATORIOS
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.validateCode(product.code)) {
      console.log("Error, el codigo ya existe!");
    } else {
      const producto = {
        id: this.getId(),
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock,
      };
      this.products = this.getProducts();
      this.products.push(producto);
      this.saveProducts();
      console.log("El producto ha sido agregado!");
    }
  }

  // ACTUALIZAR PRODUCTO
  updateProduct(id, product) {
    this.products = this.getProducts();
    let pos = this.products.findIndex((item) => item.id === id);
    if (pos > -1) {
      this.products[pos].title = product.title;
      this.products[pos].description = product.description;
      this.products[pos].price = product.price;
      this.products[pos].thumbnail = product.thumbnail;
      this.products[pos].code = product.code;
      this.products[pos].stock = product.stock;
      this.saveProducts();
      console.log("El producto ha sido actualizado!");
    } else {
      console.log("Error not found!, producto no encontrado!");
    }
  }

  // ELIMINAR PRODUCTO
  deleteProduct(id) {
    this.products = this.getProducts();
    let pos = this.products.findIndex((item) => item.id === id);

    if (pos > -1) {
      this.products.splice(pos, 1);
      0, 1;
      this.saveProducts();
      console.log("El producto N°:" + id + "ha sido eliminado!");
    } else {
      console.log("Error not found!, producto no encontrado!");
    }
  }

  // OBETENER PRODUCTO
  getProducts() {
    let products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    return products;
  }

  // OBTENER ID
  getId() {
    let max = 0;
    this.products.forEach((prod) => {
      max = prod.id > max && prod.id;
    });

    return max + 1;
  }

  // BUSCAR PRODUCTO POR ID
  getProductById(id) {
    this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    const productoEncontrado = this.products.find((prod) => prod.id === id);
    if (!productoEncontrado) {
      console.log("Error not found!, producto no encontrado!");
    } else {
      console.log(productoEncontrado);
    }
  }

  // VALIDACION DE CODIGO DE PRODUCTO
  validateCode(code) {
    return this.products.some((prod) => prod.code === code);
  }

  // GUARDAR PRODUCTO
  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }
}

const product = new ProductManager();

// ARRAY VACIO
let vacio = product.getProducts();
console.log(vacio);

// PRODUCTOS PARA EL ARRAY
product.addProduct({
  title: "Peluche Totodile",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2022, viene con todas sus etiquetas y mide 25cm de alto",
  price: 17600,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/totodile-hokkori-healing-21cm-20221-07ff3dcf51d18116a816859928660950-640-0.webp",
  code: "totodile129",
  stock: 25,
});
product.addProduct({
  title: "Peluche Gengar",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2012, viene con todas sus etiquetas y mide 28cm de alto",
  price: 18000,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/gengar-hokkori-healing2-09f8b606c41eec33db16859861147835-640-0.webp",
  code: "gengar051",
  stock: 14,
});
product.addProduct({
  title: "Peluche Mew",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2019, viene con todas sus etiquetas y mide 38cm de alto",
  price: 25000,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/mew-evolution1-c70a35cf05f0b50a1f16842664635151-640-0.webp",
  code: "gengar051",
  stock: 9,
});
product.addProduct({
  title: "Peluche Mew",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2019, viene con todas sus etiquetas y mide 38cm de alto",
  price: 25000,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/mew-evolution1-c70a35cf05f0b50a1f16842664635151-640-0.webp",
  code: "mew151",
  stock: 10,
});
product.addProduct({
  title: "",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2020, viene con todas sus etiquetas y mide 20cm de alto",
  price: 13200,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/mew-evolution1-c70a35cf05f0b50a1f16842664635151-640-0.webp",
  code: "sobble311",
  stock: 24,
});
product.addProduct({
  title: "Larvitar",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2016, viene con todas sus etiquetas y mide 45cm de alto",
  price: 27200,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/larvitar-grande1-9ac98e0dafbc4b342716752786618904-640-0.webp",
  code: "larvitar547",
  stock: 5,
});
product.addProduct({
  title: "Piplop",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2021, viene con todas sus etiquetas y mide 26cm de alto",
  price: 27500,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/kivd698-peluche-piplup-pokemon-for-you-ichiban-kuji11-0570dce73ef2d8842316822259808053-640-0.webp",
  code: "piplop895",
  stock: 15,
});
product.addProduct({
  title: "Vulpix",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2020, viene con todas sus etiquetas y mide 27cm de alto",
  price: 15400,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/vulpix1-622b35555160d87e0316754628607808-640-0.webp",
  code: "vulpix653",
  stock: 18,
});

console.log(product.getProducts()); // ARRAY CON LOS PRODUCTOS

// BUSCAR PRODUCTO POR ID
product.getProductById(25);
product.getProductById(2);

// ELIMINAR PRODUCTO POR ID
console.log(product.deleteProduct(4));
console.log(product.getProducts());

//ACTUALIZAR PRODUCTO
product.updateProduct(1, {
  title: "Peluche Totodile",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2023, viene con todas sus etiquetas y mide 25cm de alto",
  price: 22750,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/totodile-hokkori-healing-21cm-20221-07ff3dcf51d18116a816859928660950-640-0.webp",
  code: "totodile129",
  stock: 50,
});
