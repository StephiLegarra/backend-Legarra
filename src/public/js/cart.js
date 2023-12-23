const obtenerIdCarrito = async () => {
  try {
    const response = await fetch("/api/carts/usuario/carrito", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error obteniendo el ID del carrito");
      return null;
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.log("Error en obtener el Id del Carrito! ", error);
    return null;
  }
};

const agregarProductoAlCarrito = async (pid) => {
  try {
    let cid = await obtenerIdCarrito();

    if (!cid) {
      console.error("El ID del carrito no pudo ser encontrado");
      return;
    }
    console.log("Verificando IDs:", cid, pid);
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: {"Content-type": "application/json"},
    }).then(response => {
      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Producto agregado al carrito!',
          showConfirmButton: false,
          timer: 2000
        }); 
          return res.json();
      } else {
          throw new Error('Ups! Algo salió mal!');
      }
  }); 
    if (!response.ok) {
      console.log("Error al agregar el producto al carrito");
      return;
    } 
    console.log("Se agrego el producto al carrito");
  } catch (error) {
    console.log("Error en agregar el Producto al Carrito! " + error);
  }
};

async function realizarCompra() {
  try {
    const cid = await obtenerIdCarrito();
  
    if (!cid) {
      console.error("El carrito no pudo ser encontrado");
      return;
    }

    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (response.ok) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: "Compra realizada con exito",
            text: "Muchas gracias por su compra! Revisa tu Correo Electronico para ver el detalle de tu compra!",
            howConfirmButton: true,
          });
          return res.json();
      } else {
          throw new Error('Ups! Algo salió mal!');
      }
  })
      if (!response.ok) {
       console.error("Error al realizar la compra");
      return;
       }
       console.log("Compra realizada con éxito"); 
  } catch (error) {
    console.error("Error al realizar la compra: ", error);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");

  if (cartButton) {
    cartButton.addEventListener("click", async () => {
      try {
        const cid = await obtenerIdCarrito();
        if (cid) {
          window.location.assign(`/carts/`);
        } else {
          console.error("El ID del carrito no es valido");
        }
      } catch (error) {
        console.error("Error al obtener el ID del carrito: " + error);
      }
      e.preventDefault();
    });
  }
});

const eliminarProductoDelCarrito = async (pid) => {
  try {
    const cid = await obtenerIdCarrito();

    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(response =>{ 
      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Producto eliminado con éxito",
          showConfirmButton: false, 
          timer: 2000,  
        }).then(() => {
          window.location.reload(); 
        });
  } else {
      throw new Error('Ups! Algo salió mal!');
    }
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el producto del carrito");
    }
    console.log("Producto eliminado del carrito con éxito");
  } catch (error) {
    console.error("Error al eliminar el producto del carrito: " + error);
  }
};

