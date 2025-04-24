document.addEventListener('DOMContentLoaded', () => {
  // Obtiene los elementos del DOM
  const loadButton = document.getElementById('load-bikes');
  const bikeList = document.getElementById('bike-list');

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
                  bikeItem.textContent = `${bike.name}: ${bike.description} - ${bike.price_per_hour} €/hora`;
                  bikeList.appendChild(bikeItem);
              });
          }
      } catch (error) {
          console.error('Error al cargar las bicicletas:', error);
          bikeList.innerHTML = 'Hubo un error al obtener las bicicletas.';
      }
  });
});


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
    body: JSON.stringify({ name, description, price_per_hour, image_url })
  });

  if (response.ok) {
    alert('Bicicleta agregada');
    loadBikes(); // recarga lista
    e.target.reset(); // limpia el formulario
  } else {
    alert('Error al agregar bicicleta');
  }
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
      <span>${bike.price_per_hour} €/hora<span>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Borrar</button>
    `;
  
    // FORMULARIO DE EDICIÓN
    const editForm = document.createElement('form');
    editForm.style.display = 'none';
  
    editForm.innerHTML = `
      <input type="text" name="name" value="${bike.name}" required>
      <input type="text" name="description" value="${bike.description || ''}">
      <input type="number" name="price_per_hour" value="${bike.price_per_hour}" step="0.01" required>
      <button type="submit">Guardar</button>
      <button type="button" class="cancel-btn">Cancelar</button>
    `;
  
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedBike = {
        name: editForm.name.value,
        description: editForm.description.value,
        price_per_hour: parseFloat(editForm.price_per_hour.value),
      };
  
      await fetch(`/bikes/${bike.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBike),
      });
  
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
      loadBikes();
    });
  
    container.appendChild(editForm); // primero el form
    container.appendChild(bikeDiv);  // luego el div de la bici
  });
  
}



async function deleteBike(id) {
  if (!confirm('¿Seguro que quieres eliminar esta bici?')) return;
  const response = await fetch(`/bikes/${id}`, { method: 'DELETE' });
  if (response.ok) {
    loadBikes();
  } else {
    alert('Error al eliminar bicicleta');
  }
  loadBikes();
}



function showUpdateForm(id, name, description, price, image_url) {
  document.getElementById('update-bike-form').style.display = 'block';
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-description').value = description;
  document.getElementById('edit-price').value = price;
  document.getElementById('edit-image_url').value = image_url;
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
    loadBikes();
    document.getElementById('update-bike-form').style.display = 'none';
  } else {
    alert('Error al actualizar bicicleta');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadBikes();
});

const isAdmin = true; // Cambia a false si no eres admin

function toggleCrudVisibility() {
  const crudContainer = document.getElementById('crud-container');
  if (isAdmin) {
    crudContainer.style.display = 'block';
  } else {
    crudContainer.style.display = 'none';
  }
}

// Llamamos a la función para ajustar la visibilidad al cargar la página
toggleCrudVisibility();
