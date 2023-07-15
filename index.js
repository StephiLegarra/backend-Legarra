// DESAFIO 1 Stephanie Legarra - Curso Backend - Comisión: 55305

class ProductManager {
  constructor() {
    this.products = [];
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
      !product.code
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
        stock: 25,
      };
      this.products.push(producto);
      console.log("Producto agregado!");
    }
  }

  getProducts() {
    return this.products;
  }

  getId() {
    let max = 0;
    this.products.forEach((prod) => {
      max = prod.id > max && prod.id;
    });

    return max + 1;
  }

  getProductById(id) {
    const productoEncontrado = this.products.find((prod) => prod.id === id);
    if (!productoEncontrado) {
      console.log("Error not found, producto no encontrado");
    } else {
      console.log(productoEncontrado);
    }
  }

  validateCode(code) {
    return this.products.some((prod) => prod.code === code);
  }
}

const product = new ProductManager();

let vacio = product.getProducts(); // ARRAY VACIO
console.log(vacio);

product.addProduct({
  title: "Peluche Totodile",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2022, viene con todas sus etiquetas y mide 25cm de alto",
  price: 17600,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/totodile-hokkori-healing-21cm-20221-07ff3dcf51d18116a816859928660950-640-0.webp",
  code: "totodile129",
});
product.addProduct({
  title: "Peluche Gengar",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2012, viene con todas sus etiquetas y mide 28cm de alto",
  price: 18000,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/gengar-hokkori-healing2-09f8b606c41eec33db16859861147835-640-0.webp",
  code: "gengar051",
});
product.addProduct({
  title: "Peluche Mew",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2019, viene con todas sus etiquetas y mide 38cm de alto",
  price: 25000,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/mew-evolution1-c70a35cf05f0b50a1f16842664635151-640-0.webp",
  code: "gengar051",
});
product.addProduct({
  title: "Peluche Mew",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2019, viene con todas sus etiquetas y mide 38cm de alto",
  price: 25000,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/mew-evolution1-c70a35cf05f0b50a1f16842664635151-640-0.webp",
  code: "mew151",
});
product.addProduct({
  title: "",
  description:
    "Este producto es original e importado de Japón, de la marca Banpresto año 2020, viene con todas sus etiquetas y mide 20cm de alto",
  price: 13200,
  thumbnail:
    "https://d3ugyf2ht6aenh.cloudfront.net/stores/110/201/products/mew-evolution1-c70a35cf05f0b50a1f16842664635151-640-0.webp",
  code: "sobble311",
});

console.log(product.getProducts()); // ARRAY CON LOS PRODUCTOS

// BUSCAR PRODUCTO POR ID
product.getProductById(25);
product.getProductById(2);
