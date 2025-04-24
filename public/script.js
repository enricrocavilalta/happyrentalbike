async function loadBikes() {
  const response = await fetch('/bikes');
  const bikes = await response.json();
  const bikeList = document.getElementById('bike-list');
  bikeList.innerHTML = '';

  bikes.forEach(bike => {
    const bikeDiv = document.createElement('div');
    bikeDiv.className = 'bike';
  
    const name = document.createElement('h3');
    name.textContent = bike.model;
    bikeDiv.appendChild(name);
  
    const description = document.createElement('p');
    description.textContent = bike.type;
    bikeDiv.appendChild(description);
  
    // Botón de borrar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.onclick = () => deleteBike(bike.id);
    bikeDiv.appendChild(deleteBtn);
  
    // 👉 Botón de editar
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => showEditForm(bike);
    bikeDiv.appendChild(editBtn);
  
    container.appendChild(bikeDiv);
  });

  

  // Botones de editar
  document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      const res = await fetch(`/bikes/${id}`);
      const bike = await res.json();

      document.getElementById('edit-bike-id').value = bike.id;
      document.getElementById('edit-bike-name').value = bike.name;
      document.getElementById('edit-bike-price').value = bike.price_per_hour;
      document.getElementById('edit-bike-form').style.display = 'block';
    });
  });

  // Botones de borrar
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      await fetch(`/bikes/${id}`, { method: 'DELETE' });
      loadBikes();
    });
  });
}

document.getElementById('create-bike-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('bike-name').value;
  const price = parseFloat(document.getElementById('bike-price').value);

  await fetch('/bikes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price_per_hour: price })
  });

  e.target.reset();
  loadBikes();
});

document.getElementById('edit-bike-form').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('edit-bike-id').value;
  const name = document.getElementById('edit-bike-name').value;
  const price = parseFloat(document.getElementById('edit-bike-price').value);

  await fetch(`/bikes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price_per_hour: price })
  });

  e.target.reset();
  document.getElementById('edit-bike-form').style.display = 'none';
  loadBikes();
});

loadBikes();


// Mostrar el formulario con los datos actuales
function showEditForm(bike) {
  document.getElementById('editBikeForm').style.display = 'block';
  document.getElementById('editBikeId').value = bike.id;
  document.getElementById('editModel').value = bike.model;
  document.getElementById('editType').value = bike.type;
}

// Captura del envío del formulario de edición
document.getElementById('editBikeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editBikeId').value;
  const model = document.getElementById('editModel').value;
  const type = document.getElementById('editType').value;

  try {
    const response = await fetch(`/bikes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, type })
    });

    if (response.ok) {
      loadBikes();
      document.getElementById('editBikeForm').reset();
      document.getElementById('editBikeForm').style.display = 'none';
    } else {
      console.error('Error al editar bicicleta');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
