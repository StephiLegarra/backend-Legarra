const socketClient = io();

//DESDE CLIENTE AL SERVER
socketClient.on("envioDeProductos", (obj)=>{
  updateProductList(obj);
});

//MOSTRAR PRODUCTOS DISPONIBLES
function updateProductList(products){
 const content = document.getElementById("content");
  let productos = " ";

  products.forEach((product) => {
      productos+= `<div class="col-md-6">
                   <div class="card border-black mb-5">
                   <h3 class="text-light bg-black">${product.title}</h3>
                   <img src="${product.thumbnail}" class="img-fluid" alt="imagen del producto" />
                   <div class="card-body text-center">
                   <h4 class="text-danger">Precio: ${product.price}</h4>
                   <h6>${product.description}</h6>
                   <p>ID: ${product.id}</p>
                   </div>
                   <p> ----------------------------------------------------</p>
                   </div>
                   </div>`    
  });
  content.innerHTML= productos;
}

// ADD PRODUCT
const formProduct = document.getElementById("formProduct");

formProduct.addEventListener("submit", (event)=>{
  event.preventDefault();

  let title = formProduct.elements.title.value;
  let thumbnail = formProduct.elements.thumbnail.value;
  let description = formProduct.elements.description.value;
  let price = formProduct.elements.price.value;
  let category = formProduct.elements.category.value;
  let code = formProduct.elements.code.value;
  let stock = formProduct.elements.stock.value;
  
  
  socketClient.emit("addProduct", {title,thumbnail,description,price,category,code, stock});
  Swal.fire({
  position: 'center',
  icon: 'success',
  title: 'Producto agregado con exito',
  showConfirmButton: false,
  timer: 2000
})
  formProduct.reset();
});

// DELETE PRODUCT
document.getElementById("btnDeleteProduct").addEventListener("click", function () {
  const deleteById = document.getElementById("id");
  const deleted = deleteById.value;
  socketClient.emit("deleteProduct", deleted);
  deleteById.value = "";
});

const eliminarProducto = () =>{
  const idProd = document.getElementById("id").value;
  socketClient.emit("eliminarProducto", idProd);
}

const btnDeleteProduct = document.getElementById("btnDeleteProduct");
btnDeleteProduct.onclick = eliminarProducto();

