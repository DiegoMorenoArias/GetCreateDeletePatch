function setupDragAndDrop() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.setAttribute('data-index', index);
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.getAttribute('data-index'));
    });
  });
}


async function obtenerItems(animalLists) {
  return animalLists.map((animal, index) => {
    let años = animal.age == 1 ? `${animal.age} año` : `${animal.age} años`;
    return `
      <div class="card has-background-warning-light custom-card" id="animal-card-${index}" draggable="true">
        <div class="card-image">
          <figure class="image is-4by3">
            <img class="is-fullwidth fixed" src="${animal.image}" alt="${animal.name}" />
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">${animal.name}</p>
              <p class="subtitle is-6">age: ${años}</p>
            </div>
          </div>
          <div class="content">
            ${animal.description}
          </div>
        </div>
      </div>
    `;
  });
}
// Maneja el guardado del animal
document.getElementById("saveProduct").addEventListener("click", async function () {
    const form = document.getElementById("productForm");
    const edadInput = form.querySelector('input[type="number"]');
    const edad = parseFloat(edadInput.value);
  
    if (form.checkValidity() && edad > 0 && edad <= 100) {
      const nombreProducto = form.querySelector('input[type="text"]').value;
      const descripcionProducto = form.querySelector("textarea").value;
      const imagenForm = form.querySelector('input[type="file"]').files[0];
  
      const imagenURL = URL.createObjectURL(imagenForm);
  
      const todo = {
        name: nombreProducto,
        description: descripcionProducto,
        image: imagenURL,
        age: edad,
      };
      console.log(todo);
      
      await fetch("http://localhost:3000/api/products", {body: JSON.stringify(todo), method: "POST",headers: {"Content-Type": "application/json",}});
      
      const misAnimalitosLlamada = await fetch ("http://localhost:3000/api/products");
      const misAnimalitos = await misAnimalitosLlamada.json();
      document.getElementById("productModal").classList.remove("is-active");
      await mostrarLista(await obtenerItems(misAnimalitos));
      // Limpia el formulario
      form.reset();
    } else {
      // muestra errores si los campos no están llenos o la edad es inválida
      if (edad < 0 || edad > 100) {
        alert("La edad debe ser mayor o igual que 0 y no más de 100 años.");
        edadInput.setCustomValidity("La edad debe ser mayor que 0 y no más de 100 años.");
      } else {
        edadInput.setCustomValidity("");
      }
      form.reportValidity();
    }
  });


// EventListeners

document.addEventListener("DOMContentLoaded", async () => {
  mostrarLista(await obtenerItems(await animales()));
  setupDragAndDrop(); // Configurar el drag and drop
  document.getElementById("sort-dropdown").addEventListener("change", await ordenarLista);
});

// EventListener al botón "Buscar"
document.getElementById("Buscar").addEventListener("click", searchItems);
document.getElementById("Text").addEventListener("input", searchItems);

// EventListener para que tambien funcione con enter
const searchInputElement = document.getElementById("Text");
searchInputElement.addEventListener("keydown", function (event) {
if (event.key === "Enter") {
  event.preventDefault();
  searchItems();
}
});

// mostramos todos los elementos al cargar la página por primera vez
document.addEventListener("DOMContentLoaded", async () => {
mostrarLista(await obtenerItems(await animales()));
});

// Maneja la apertura y cierre del modal
document.getElementById("openModal").addEventListener("click", function () {
document.getElementById("productModal").classList.add("is-active");
});

document.getElementById("closeModal").addEventListener("click", function () {
document.getElementById("productModal").classList.remove("is-active");
});

document.getElementById("cancelModal").addEventListener("click", function () {
document.getElementById("productModal").classList.remove("is-active");
});

// Función para cerrar el modal de detalles de animales
document.getElementById("closeInfoModal").addEventListener("click", function () {
document.getElementById("infoModal").classList.remove("is-active");
});

// Muestra todos los elementos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  mostrarLista(await obtenerItems(await animales()));
  setupDragAndDrop(); // Configura el drag and drop
});

