document.addEventListener('DOMContentLoaded', () => {
  // Obtiene los elementos del DOM
  const loadButton = document.getElementById('load-bikes');
  const loadButtontours = document.getElementById('load-tour');
  const bikeList = document.getElementById('bike-list');
  const tourList = document.getElementById('tour-list');

  // Añade el evento al botón
  loadButton.addEventListener('click', async () => {
      try {
          // Realiza la solicitud GET a la API de bicicletas
          const response = await fetch('http://localhost:3000/bikes');  // Cambia la URL si es necesario
          const bikes = await response.json();

          // Verifica que la respuesta no esté vacía
          if (bikes.length === 0) {
              bikeList.innerHTML = 'No hay bicicletas disponibles.';
          } else {
              // Limpia la lista de bicicletas antes de agregar las nuevas
              bikeList.innerHTML = '';

              // Muestra cada bicicleta en la página
              bikes.forEach(bike => {
                  const bikeItem = document.createElement('div');
                  bikeItem.textContent = `${bike.name}: ${bike.description} - ${bike.price_per_hour} €`;
                  bikeList.appendChild(bikeItem);
              });
          }
      } catch (error) {
          console.error('Error al cargar las bicicletas:', error);
          bikeList.innerHTML = 'Hubo un error al obtener las bicicletas.';
      }
  });

  loadButtontours.addEventListener('click', async () => {
    try {
        // Realiza la solicitud GET a la API de bicicletas
        const response = await fetch('http://localhost:3000/tours');  // Cambia la URL si es necesario
        const tours = await response.json();

        // Verifica que la respuesta no esté vacía
        if (tours.length === 0) {
            tourList.innerHTML = 'No hay tours disponibles.';
        } else {
            // Limpia la lista de bicicletas antes de agregar las nuevas
            tourList.innerHTML = '';

            // Muestra cada bicicleta en la página
            tours.forEach(tour => {
                const tourItem = document.createElement('div');
                tourItem.textContent = `${tour.name}: ${tour.description} - ${tour.price_per_hour} €`;
                tourList.appendChild(tourItem);
            });
        }
    } catch (error) {
        console.error('Error al cargar los tours:', error);
        tourList.innerHTML = 'Hubo un error al obtener los tours.';
    }
});

});

document.addEventListener('DOMContentLoaded', () => {
document.getElementById('create-bike-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price_per_hour = document.getElementById('price').value;
  const image_url = document.getElementById('image_url').value;

  const response = await fetch('/bikes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      description: description,
      price_per_hour: price_per_hour,
      image_url: image_url
    })
  });

  if (response.ok) {
    alert('Bicicleta agregada');
    loadPublicBikes();
    loadBikes(); // recarga lista
    e.target.reset(); // limpia el formulario
  } else {
    alert('Error al agregar bicicleta');
  }
});
});

//tour
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('create-tour-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name_tour = document.getElementById('name-tour').value;
  const description_tour = document.getElementById('description-tour').value;
  const price_tour = document.getElementById('price-tour').value;
  const image_url_tour = document.getElementById('image_url-tour').value;
  
  const response = await fetch('/tours', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name_tour,
      description: description_tour,
      price_per_hour: price_tour,
      image_url: image_url_tour
    })
  });

  if (response.ok) {
    alert('Tour agregado');
    loadTours();
    loadPublicTours();
    e.target.reset(); // limpia el formulario
  } else {
    alert('Error al agregar tour');
  }
});
});


async function loadBikes() {
  const res = await fetch('/bikes');
  const bikes = await res.json();

  const container = document.getElementById('bike-list');
  container.innerHTML = '';

  bikes.forEach((bike) => {
    const bikeDiv = document.createElement('div');
    bikeDiv.classList.add('bike');
  
    bikeDiv.innerHTML = `
      <span>${bike.name}</span>
      <span>${bike.description}</span>
      <span>${bike.price_per_hour} €<span>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Borrar</button>
    `;
  
    // FORMULARIO DE EDICIÓN
    const editForm = document.createElement('form');
    editForm.style.display = 'none';
  
    editForm.innerHTML = `
      <input type="text" name="name" value="${bike.name}" required>
      <input type="text" name="description" value="${bike.description || ''}">
      <input type="number" name="price_per_hour" value="${bike.price_per_hour}" required>
      <input type="text" name="image_url" value="${bike.image_url}">
      <button type="submit">Guardar</button>
      <button type="button" class="cancel-btn">Cancelar</button>
    `;
  
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedBike = {
        name: editForm.name.value,
        description: editForm.description.value,
        price_per_hour: parseFloat(editForm.price_per_hour.value),
        image_url: editForm.image_url.value
      };
  
      await fetch(`/bikes/${bike.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBike),
      });
      loadPublicBikes();
      loadBikes();
    });
  
    editForm.querySelector('.cancel-btn').addEventListener('click', () => {
      editForm.style.display = 'none';
    });
  
    bikeDiv.querySelector('.edit-btn').addEventListener('click', () => {
      editForm.style.display = 'block';
    });
  
    bikeDiv.querySelector('.delete-btn').addEventListener('click', async () => {
      await fetch(`/bikes/${bike.id}`, { method: 'DELETE' });
      loadPublicBikes();
      loadBikes();
    });
  
    container.appendChild(editForm); // primero el form
    container.appendChild(bikeDiv);  // luego el div de la bici
  });
  
}

//tours
async function loadTours() {
  const res = await fetch('/tours');
  const tours = await res.json();

  const container = document.getElementById('tour-list');
  container.innerHTML = '';

  // Mostrar tours existentes
  tours.forEach((tour) => {
    const tourDiv = document.createElement('div');
    tourDiv.classList.add('tour');
  
    tourDiv.innerHTML = `
      <span>${tour.name}</span>
      <span>${tour.description}</span>
      <span>${tour.price_per_hour} €</span>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Borrar</button>
    `;
  
    // FORMULARIO DE EDICIÓN
    const editForm = document.createElement('form');
    editForm.style.display = 'none';
  
    editForm.innerHTML = `
      <input type="text" name="name-tour" value="${tour.name}" required>
      <input type="text" name="description-tour" value="${tour.description || ''}">
      <input type="text" name="price_per_hour-tour" value="${tour.price_per_hour}">
      <input type="text" name="image_url-tour" value="${tour.image_url_tour}">
      <button type="submit">Guardar</button>
      <button type="button" class="cancel-btn">Cancelar</button>
    `;
  
    // Manejo de evento para la edición
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedTour = {
        name: editForm['name-tour'].value,
        description: editForm['description-tour'].value,
        price_per_hour: parseFloat(editForm['price_per_hour-tour'].value),
        image_url:  editForm['image_url-tour'].value
      };
  
      const response = await fetch(`/tours/${tour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTour),
      });

      // Depuración: Revisar si la respuesta fue correcta
      const data = await response.json();
      console.log('Respuesta de la actualización:', data);

      if (response.ok) {
        alert('Tour actualizado');
        loadTours(); // Recargamos los tours
      } else {
        alert('Error al actualizar tour');
      }
    });
  
    // Cancelar la edición
    editForm.querySelector('.cancel-btn').addEventListener('click', () => {
      editForm.style.display = 'none';
    });
  
    // Mostrar formulario de edición
    tourDiv.querySelector('.edit-btn').addEventListener('click', () => {
      editForm.style.display = 'block';
    });
  
    // Eliminar tour
    tourDiv.querySelector('.delete-btn').addEventListener('click', async () => {
      const response = await fetch(`/tours/${tour.id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Tour borrado');
        loadTours(); // Recargamos los tours
      } else {
        alert('Error al eliminar tour');
      }
    });
  
    container.appendChild(editForm); // Primero el formulario
    container.appendChild(tourDiv);  // Luego el div del tour
  });
}

// Agregar el formulario de creación
function createTourForm() {
  const form = document.createElement('form');
  form.innerHTML = `
    <input type="text" name="name-tour" placeholder="Nombre del tour" required>
    <input type="text" name="description-tour" placeholder="Descripción del tour">
    <input type="number" name="price-tour" placeholder="Precio por hora" required>
    <button type="submit">Crear Tour</button>
  `;

  // Manejo del evento de creación
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTour = {
      name: form['name-tour'].value,
      description: form['description-tour'].value,
      price_per_hour: parseFloat(form['price-tour'].value),
      image_url: form['image_url-tour'].value
    };

    console.log('Creando tour:', newTour); // Depuración: Ver el objeto a enviar

    const response = await fetch('/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTour),
    });

    // Depuración: Revisar la respuesta
    const data = await response.json();

    if (response.ok) {
      alert('Tour creado');
      loadTours(); // Recargamos la lista de tours
    } else {
      alert('Error al crear tour');
    }
  });

  // Agregar el formulario a la página
  const container = document.getElementById('tour-list');
  const createSection = document.createElement('div');
  createSection.classList.add('create-tour');
  createSection.appendChild(form);
  container.prepend(createSection); // Lo ponemos al principio de la lista
}

// Llamar a la función de carga de tours y crear el formulario
window.onload = () => {
  loadTours();
  createTourForm(); // Crear el formulario para agregar nuevos tours
};


async function deleteBike(id) {
  if (!confirm('¿Seguro que quieres eliminar esta bici?')) return;
  const response = await fetch(`/bikes/${id}`, { method: 'DELETE' });
  if (response.ok) {
    loadPublicBikes();
    loadBikes();
  } else {
    alert('Error al eliminar bicicleta');
  }
  loadPublicBikes();
  loadBikes();
}

//tour
async function deleteTour(id) {
  if (!confirm('¿Seguro que quieres eliminar este tour?')) return;
  const response = await fetch(`/tours/${id}`, { method: 'DELETE' });
  if (response.ok) {
    loadPublicTours();
    loadTours();
  } else {
    alert('Error al eliminar tour');
  }
  loadPublicTours();
  loadTours();
}




function showUpdateForm(id, name, description, price, image_url) {
  document.getElementById('update-bike-form').style.display = 'block';
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-description').value = description;
  document.getElementById('edit-price').value = price;
  document.getElementById('edit-image_url').value = image_url;
}

//tour
function showUpdateFormTour(id, name, description, price, image_url) {
  document.getElementById('update-tour-form').style.display = 'block';
  document.getElementById('edit-id-tour').value = id;
  document.getElementById('edit-name-tour').value = name;
  document.getElementById('edit-description-tour').value = description;
  document.getElementById('edit-price-tour').value = price;
  document.getElementById('edit-image_url-tour').value = image_url;
}


document.getElementById('update-bike-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value;
  const description = document.getElementById('edit-description').value;
  const price_per_hour = document.getElementById('edit-price').value;
  const image_url = document.getElementById('edit-image_url').value;

  const response = await fetch(`/bikes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price_per_hour, image_url })
  });

  if (response.ok) {
    alert('Bicicleta actualizada');
    loadPublicBikes();
    loadBikes();
    document.getElementById('update-bike-form').style.display = 'none';
  } else {
    alert('Error al actualizar bicicleta');
  }
});

//tour
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('update-tour-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id_tour = document.getElementById('edit-id-tour').value;
  const name_tour = document.getElementById('edit-name-tour').value;
  const description_tour = document.getElementById('edit-description-tour').value;
  const price_per_hour_tour = document.getElementById('edit-price-tour').value;
  const image_url_tour = document.getElementById('edit-image_url-tour').value;

  const response = await fetch(`/tours/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_tour,name_tour, description_tour, price_per_hour_tour, image_url_tour })
  });

  if (response.ok) {
    alert('Tour actualizado');
    loadPublicTours();
    loadTours();
    document.getElementById('update-tour-form').style.display = 'none';
  } else {
    alert('Error al actualizar tour');
  }
  
});
});



document.addEventListener('DOMContentLoaded', () => {
  loadPublicBikes();
  loadBikes();
  loadPublicTours();
  loadTours();


const isAdmin = false; // Cambia a false si no eres admin

function toggleCrudVisibility() {
  const crudContainer = document.getElementById('crud-container');
  if (isAdmin) {
    crudContainer.style.display = 'block';
  } else {
    crudContainer.style.display = 'none';
  }
  
  const crudContainerTour = document.getElementById('crud-container-tour');
  if (isAdmin) {
    crudContainerTour.style.display = 'block';
  } else {
    crudContainerTour.style.display = 'none';
  }
    
}


// Llamamos a la función para ajustar la visibilidad al cargar la página
toggleCrudVisibility();
});

async function loadPublicBikes() {
  const res = await fetch('/bikes');
  const bikes = await res.json();

  const container = document.getElementById('user-bike-grid');
  container.innerHTML = '';

  bikes.forEach(bike => {
    const card = document.createElement('div');
    card.classList.add('bike-card');

    console.log(bike.image_url);

    card.innerHTML = `
    <img src="${bike.image_url}" alt="Image" style="width: 100%; height: auto;">
    <div class="bike-footer">
      <h3>${bike.name}</h3>
      <p><strong>${bike.price_per_hour} €</strong></p>
    </div>
    <p>${bike.description}</p>
    `;

    container.appendChild(card);
  });
}

//tours
async function loadPublicTours() {
  const res = await fetch('/tours');
  const tours = await res.json();

  const container = document.getElementById('user-tour-grid');
  container.innerHTML = '';

  tours.forEach(tour => {
    const card = document.createElement('div');
    card.classList.add('tour-card');

    card.innerHTML = `
    <img src="${tour.image_url}" alt="Image" style="width: 100%; height: auto;">
    <div class="tour-footer">
      <h3>${tour.name}</h3><br>
      <p><strong>${tour.price_per_hour} €</strong></p>
    </div>
    <p>${tour.description}</p>
    `;

    container.appendChild(card);
  });
}



