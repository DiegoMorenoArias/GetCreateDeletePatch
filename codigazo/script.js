//lista de animales, revisar y corregir

const getAnimalazosResponse = async () => await fetch("http://localhost:3000/api/products");
const animales = async () => (await getAnimalazosResponse()).json();

async function ordenarLista() {
  let sortValue = document.getElementById("sort-dropdown").value;
  let sortAnimals = async () => [...await animales()];
  let sortAux;
  if (sortValue === "price-asc") {
    sortAux = await sortAnimals();
    sortAux.sort((a, b) => a.age - b.age);
  } else if (sortValue === "price-desc") {
    sortAux = await sortAnimals();
    sortAux.sort((a, b) => b.age - a.age);
  }
  
  await mostrarLista(await obtenerItems(sortAux));
  await setupDragAndDrop(); // Re-setup del drag and drop después de ordenar
}
  

//funcion para obtener la sublista filtrada.
async function filtrarItems(name, description) {
  const nameMinus = name.toLowerCase();
  const descriptionMinus = description.toLowerCase();
  const resultados = async () => (await animales()).filter((animal) => {
    return (
      animal.name.toLowerCase().includes(nameMinus) ||
      animal.description.toLowerCase().includes(descriptionMinus)
    );
  });

  return resultados.length > 0 ? (await obtenerItems)(resultados) : null;
}

async function searchItems() {
  const searchInput = document.getElementById("Text").value.toLowerCase();

  if (searchInput.trim() === "") {
    // Si el input está vacío, mostramos todos los elementos.
    mostrarLista(await obtenerItems(await animales()));
  } else {
    const filteredItems = filtrarItems(searchInput, searchInput);
    mostrarLista(filteredItems);
  }
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

async function mostrarLista(lista) {
  const contentDiv = document.getElementById("content");
  if (contentDiv) {
    contentDiv.innerHTML = "";

    if (lista === null || lista.length === 0) {
      contentDiv.innerHTML = "<p>No hay ningún ítem que cumpla con la búsqueda</p>";
    } else {
      contentDiv.innerHTML = lista.join("");
      setupDragAndDrop();
      setupAnimalCardClicks(); // Buildea ambos setUps
    }
  }
}
  

// muestra a los animales
document.addEventListener("DOMContentLoaded", async () => {
  mostrarLista(await obtenerItems(await animales()));
  setupCartDropZone();
});

const dropZone = document.getElementById("drop-zone");
let mensaje = document.getElementById("mensaje");

function setupCartDropZone() {
  const dropZone = document.getElementById("drop-zone");
  let mensaje = document.getElementById("mensaje");

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    const animalIndex = parseInt(event.dataTransfer.getData("text/plain"));
    const cards = document.querySelectorAll(".card");
    const cardElement = cards[animalIndex];
    
    if (cardElement) {
      const animal = {
        name: cardElement.querySelector('.title').textContent,
        age: parseFloat(cardElement.querySelector('.subtitle').textContent.split(':')[1]),
        image: cardElement.querySelector('img').src,
        description: cardElement.querySelector('.content').textContent.trim()
      };
      
      if (animal) {
        const animalName = animal.name;
        const animalAge = animal.age == 1 ? "1 año" : `${animal.age} años`;
        const animalImage = animal.image;
        const animalEntero = `
          <div id="divDe${animalName}" style="display: flex; align-items: center; gap: 10px;">
            <img src="${animalImage}" alt="${animalName}" style="width: 100px; height: 100px; object-fit: cover; border: 3px solid hsl(48, 100%, 67%); border-radius: 50%;">
            <h1 id="mensaje">${animalName} (${animalAge})</h1>
          </div>`;

        if (!dropZone.innerHTML.includes(`id="divDe${animalName}"`)) {
          mensaje.style.display = 'none';
          dropZone.innerHTML += animalEntero + `<br>`;
          dropZone.style.textAlign = 'left';
        }
      }
    }
  });
}

function setupDragAndDrop() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.setAttribute('data-index', index);
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.getAttribute('data-index'));
    });
  });
}



async function setupAnimalCardClicks() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.addEventListener("click", async () => {
      await openInfoModal((await animales())[index]);
    });
  });
}

async function openEditModal(animal){
  const modal = await document.getElementById("editModal");
  const modalContent = await document.getElementById("editModalContent");
  const aceptarButton = await document.getElementById("botonEditarDelModal");
  const inputName = await document.getElementById("input1");
  const inputDescription = await document.getElementById("input2");
  const inputAge = await document.getElementById("input3");
  inputName.value = await animal.name;
  inputDescription.value = await animal.description;
  inputAge.value = await animal.age;
  await modal.classList.add("is-active");
  aceptarButton.addEventListener("click", async() =>{
    const jsonAnimal =
    {
      id: animal.id,
      name: inputName.value,
      description: inputDescription.value,
      age: inputAge.value,
      image: animal.image
    };
    await editarAsync(animal.id, jsonAnimal);
    await aceptarButton.removeEventListener("click", editarAsync(animal.id, jsonAnimal));
      await document.getElementById("editModal").classList.remove("is-active");
      await document.getElementById("infoModal").classList.remove("is-active");
      await openInfoModal(animal);
      await mostrarLista(await obtenerItems(await animales()));
      await setupDragAndDrop();
  });
}
async function editarAsync(id, jsonActualizado) {
  await fetch(`http://localhost:3000/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jsonActualizado)
  });
}


// Función para abrir el modal con información de la mascota
async function openInfoModal(animal) {
    const modal = document.getElementById("infoModal");
    const modalContent = document.getElementById("infoModalContent");
    const deleteButton = document.getElementById("botonEliminar");
    const editarButton = document.getElementById("botonEditar");

    // Actualiza el contenido del modal con la información del animal
    modalContent.innerHTML = `
        <figure class="image is-4by3">
            <img src="${animal.image}" alt="${animal.name}" />
        </figure>
        <p id="nombreEnTarjetita"><strong>Nombre:</strong> ${animal.name}</p>
        <p><strong>Edad:</strong>${animal.age} años</p>
        <p><strong>Descripción:</strong>${animal.description}</p>
    `;

    modal.classList.add("is-active");
    
    editarButton.addEventListener("click", async() =>{
      await openEditModal(animal);
    });
    deleteButton.addEventListener("click", async () =>{
      await eliminarAsync(animal.id);
      await deleteButton.removeEventListener("click", eliminarAsync(animal.id));
      await document.getElementById("infoModal").classList.remove("is-active");
      await mostrarLista(await obtenerItems(await animales()));
      await setupDragAndDrop(); // Configurar el drag and drop
    });
}

// Agregar EventListener a cada card para abrir el modal al hacer clic
function setupCardClick() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
        card.addEventListener("click", async () => {
            await openInfoModal(await animales())[index];
        });
    });
}


// eventListeners.js:

document.addEventListener("DOMContentLoaded", async () => {
  mostrarLista(await obtenerItems(await animales()));
  setupDragAndDrop(); // Configurar el drag and drop
  document.getElementById("sort-dropdown").addEventListener("change", await ordenarLista);
});

// EventListener al botón "Buscar"
document.getElementById("Buscar").addEventListener("click", searchItems);
document.getElementById("Text").addEventListener("input", searchItems);

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



// const botonEliminar = document.getElementById("botonEliminar");

const eliminarAsync = async (id) => {
  await fetch(`http://localhost:3000/api/products/${id}`, { method: "DELETE" });
};