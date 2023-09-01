const addToCartButton = document.querySelector(".card button#addToCart");

addToCartButton.addEventListener("click", () => {
  const card = document.querySelector(".card");
  const id = card.querySelector(".card_id").textContent;
  console.log(id);

  // Deja el carrito 1 predeterminado
  fetch(`/api/cart/1/products/${id}`, {
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
