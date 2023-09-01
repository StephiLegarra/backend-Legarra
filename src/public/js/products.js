const addToCartButtons = document.querySelectorAll(".card button#addToCart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".card");
    const id = card.querySelector(".card_id").textContent;

    //Deje el carrito 1 predeterminado
    fetch(`api/carts/1/products/${id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
