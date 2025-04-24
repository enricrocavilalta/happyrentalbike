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
  const response = await fetch('/bikes');
  const bikes = await response.json();
  const list = document.getElementById('bike-list');
  list.innerHTML = '';

  bikes.forEach(bike => {
    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${bike.name}</strong> - ${bike.description || 'Sin descripción'} - ${bike.price_per_hour}€/h
      <br><img src="${bike.image_url}" alt="Bici" width="100" />
      <br>
      <button onclick="deleteBike(${bike.id})">Eliminar</button>
      <button onclick="showUpdateForm(${bike.id}, '${bike.name}', '${bike.description}', ${bike.price_per_hour}, '${bike.image_url}')">Editar</button>
    `;
    list.appendChild(item);
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
