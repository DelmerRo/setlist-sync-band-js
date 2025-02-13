import './style.css';

// Elementos del DOM
const loginPopup = document.getElementById('loginPopup');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const repertorioForm = document.getElementById("repertorioForm");
const editRepertorioForm = document.getElementById("editRepertorioForm");
const tableBody = document.querySelector("#repertorioTable tbody");
const editSongModal = new bootstrap.Modal(document.getElementById('editSongModal'));
const availableSongsContainer = document.getElementById('availableSongs');
const selectedSongsContainer = document.getElementById('selectedSongs');
const addEventModal = document.getElementById('addEventModal');
const eventTableBody = document.querySelector("#eventTable tbody");


// Variables de edición
let editId = null;

// Lista de usuarios autorizados (base64 decodificado)
const authorizedUsers = [
  { email: atob("ZGVsbWVyQHRlcnJhbmRpbmEuY29t"), password: atob("c2h1MTIz") },
  { email: atob("am9uYXRoYW5AdGVycmFuZGluYS5jb20="), password: atob("c2h1MTIz") },
  { email: atob("YnVsYWNpb0B0ZXJyYW5kaW5hLmNvbQ=="), password: atob("c2h1MTIz") },
  { email: atob("bWFydmluQHRlcnJhbmRpbmEuY29t"), password: atob("c2h1MTIz") },
  { email: atob("cm9kcmlnb0B0ZXJyYW5kaW5hLmNvbQ=="), password: atob("c2h1MTIz") }
];

// Función para cargar repertorio desde localStorage
function loadRepertoire() {
  const repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  tableBody.innerHTML = "";

  repertorio.forEach((cancion, index) => {
    const row = generateSongRow(cancion, index);
    tableBody.innerHTML += row;
  });

  // Asignar los eventos después de cargar la tabla
  repertorio.forEach((cancion, index) => {
    document.getElementById(`viewBtn-${index}`).addEventListener("click", function() {
      viewSong(index);
    });
  });
}

// Función para cargar events desde localStorage
function loadEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  eventTableBody.innerHTML = ""; // Limpiar la tabla de eventos

  events.forEach((event, index) => {
    const row = generateEventRow(event, index);
    eventTableBody.innerHTML += row;
  });

  // Asignar eventos a los botones de cada fila
  events.forEach((event, index) => {
    document.getElementById(`viewEventBtn-${index}`).addEventListener("click", function() {
      viewEvent(index);
    });
  });
}


// Generar una fila para la tabla de canciones
function generateSongRow(cancion, index) {
  return `<tr>
    <td>${cancion.titulo}</td>
    <td>${cancion.artista}</td>
    <td>${cancion.genero}</td>
    <td>${cancion.tonalidad}</td>
    <td>
      <button class="btn btn-success btn-sm" id="viewBtn-${index}">Ver</button>
      <button class="btn btn-warning btn-sm" onclick="editSong(${index})">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="deleteSong(${index})">Eliminar</button>
    </td>
  </tr>`;
}

// Generar una fila para la tabla de canciones
function generateEventRow(event, index) {
  return `<tr>
    <td>${event.nombre}</td>
    <td>${event.fecha}</td>
    <td>${event.temas}</td> 
    <td>
      <button class="btn btn-success btn-sm" id="viewBtn-${index}">Ver</button>
      <button class="btn btn-warning btn-sm" onclick="editEvent(${index})">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="deleteEvent(${index})">Eliminar</button>
    </td>
  </tr>`;
}

// Guardar repertorio en localStorage
function saveRepertoire(repertorio) {
  localStorage.setItem("repertorio", JSON.stringify(repertorio));
  loadRepertoire();
}

function saveEvent(events) {
  localStorage.setItem("events", JSON.stringify(events));
  loadEvents();
}

// Función para manejar el login
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = authorizedUsers.find(user => user.email === email && user.password === password);

  if (user) {
    alert("Sesión iniciada correctamente");
    loginPopup.style.display = "none";
    app.style.display = "block";
    loadRepertoire(); // Cargar repertorio al iniciar sesión
  } else {
    alert("Credenciales incorrectas");
  }
}

// Función para agregar una nueva canción al repertorio
function addNewSong(event) {
  event.preventDefault();
  const nuevaCancion = {
    titulo: document.getElementById("titulo").value,
    artista: document.getElementById("artista").value,
    genero: document.getElementById("genero").value,
    tonalidad: document.getElementById("tonalidad").value,
    letrasAcordes: document.getElementById("letrasAcordes").value
  };

  const repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  repertorio.push(nuevaCancion);
  saveRepertoire(repertorio);

  document.getElementById("repertorioForm").reset();
  bootstrap.Modal.getInstance(document.getElementById('addSongModal')).hide();
}

// Función para agregar un nuevo evento
function addNewEvent(event) {
  event.preventDefault();

  const nuevoEvento = {
    nombre: document.getElementById("eventName").value,
    fecha: document.getElementById("eventDate").value,
    temas: JSON.parse(localStorage.getItem("selectedSongs")) || []
  };

  const events = JSON.parse(localStorage.getItem("events")) || [];
  events.push(nuevoEvento);
  saveEvent(events);

  document.getElementById("eventForm").reset();
  bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
}



window.editSong = function(index) {
  const repertorio = JSON.parse(localStorage.getItem("repertorio"));
  const cancion = repertorio[index];

  document.getElementById("editTitulo").value = cancion.titulo;
  document.getElementById("editArtista").value = cancion.artista;
  document.getElementById("editGenero").value = cancion.genero;
  document.getElementById("editTonalidad").value = cancion.tonalidad;
  document.getElementById("editLetrasAcordes").value = cancion.letrasAcordes;

  editId = index;
  editSongModal.show();
};

// Guardar la edición de la canción
function saveEditedSong(event) {
  event.preventDefault();
  const repertorio = JSON.parse(localStorage.getItem("repertorio"));
  repertorio[editId] = {
    titulo: document.getElementById("editTitulo").value,
    artista: document.getElementById("editArtista").value,
    genero: document.getElementById("editGenero").value,
    tonalidad: document.getElementById("editTonalidad").value,
    letrasAcordes: document.getElementById("editLetrasAcordes").value
  };

  saveRepertoire(repertorio);
  editSongModal.hide();
}

// Eliminar una canción del repertorio
window.deleteSong = function(index) {
  const repertorio = JSON.parse(localStorage.getItem("repertorio"));
  repertorio.splice(index, 1);
  saveRepertoire(repertorio);
};

// Ver detalles de la canción (mostrar acordes en modal)
function viewSong(index) {
  const repertorio = JSON.parse(localStorage.getItem("repertorio"));
  const cancion = repertorio[index];
  const letrasAcordes = cancion.letrasAcordes;

  const highlightedChords = highlightChordsInText(letrasAcordes);
  document.getElementById("chordsContent").innerHTML = highlightedChords;
  document.getElementById("chordsModalLabel").textContent = `${cancion.titulo} - ${cancion.artista}`;

  const chordsModal = new bootstrap.Modal(document.getElementById('chordsModal'));
  chordsModal.show();
}

// Resaltar acordes en el texto
function highlightChordsInText(text) {
  text = text.replace(/@/g, '<span class="special-symbol">@</span>');
  text = text.replace(/#/g, '<span class="special-symbol">#</span>');
  
  const chordPattern = /\b([A-G](?:♯|b)?(?:m|maj|min|dim|aug|sus|add)?[0-9]{0,2})\b/g;
  return text.replace(chordPattern, (match) => `<span class="chord">${match}</span>`);
}

// Cargar las canciones disponibles para selección
function loadAvailableSongs() {
  const repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  availableSongsContainer.innerHTML = ""; // Limpiar antes de agregar nuevos elementos

  if (repertorio.length === 0) {
    availableSongsContainer.innerHTML = "<p>No hay canciones disponibles.</p>";
    return;
  }

  repertorio.forEach((song, index) => {
  const songCheckbox = document.createElement("input");
  songCheckbox.type = "checkbox";
  songCheckbox.value = song.titulo;
  songCheckbox.id = `song-${index}`;

  songCheckbox.addEventListener("change", (e) => {
    updateSelectedSongs(song.titulo, e.target.checked);
  });

  const label = document.createElement("label");
  label.htmlFor = `song-${index}`;
  label.textContent = song.titulo;

  const div = document.createElement("div");
  div.appendChild(songCheckbox);
  div.appendChild(label);

  availableSongsContainer.appendChild(div);
});

}


// Actualizar las canciones seleccionadas
function updateSelectedSongs(songTitle, isSelected) {
  const selectedSongs = JSON.parse(localStorage.getItem("selectedSongs")) || [];

  if (isSelected) {
    selectedSongs.push(songTitle);
  } else {
    const index = selectedSongs.indexOf(songTitle);
    if (index > -1) {
      selectedSongs.splice(index, 1);
    }
  }

  localStorage.setItem("selectedSongs", JSON.stringify(selectedSongs));
  updateSelectedSongsDisplay();
}

// Mostrar canciones seleccionadas
function updateSelectedSongsDisplay() {
  const selectedSongs = JSON.parse(localStorage.getItem("selectedSongs")) || [];
  selectedSongsContainer.innerHTML = '';

  selectedSongs.forEach(songTitle => {
    const songLabel = document.createElement('p');
    songLabel.textContent = songTitle;
    selectedSongsContainer.appendChild(songLabel);
  });
}

// Limpiar el formulario de eventos
function resetForm(formId) {
  const form = document.getElementById(formId);
  form.reset();

  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
}

// Función para mostrar el modal de agregar evento y limpiar los campos
function showAddEventModal() {
  selectedSongsContainer.innerHTML = '';
  localStorage.setItem("selectedSongs", JSON.stringify([]));
  updateSelectedSongsDisplay();
  resetForm("eventForm");
}

// Limpiar checkboxes al cerrar el modal
function clearCheckboxes() {
  const checkboxes = document.querySelectorAll('#availableSongs input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
}

// Asignar los eventos de modal
addEventModal.addEventListener('show.bs.modal', showAddEventModal);
addEventModal.addEventListener('hidden.bs.modal', clearCheckboxes);

// Inicializar la aplicación
function init() {
  loadRepertoire();
  loadEvents()
  loadAvailableSongs();
  updateSelectedSongsDisplay();
  console.log(localStorage.getItem('nombre_de_tu_clave'));

}

// Asignar evento al formulario de login
loginForm.addEventListener("submit", handleLogin);

// Asignar evento al formulario de agregar canción
repertorioForm.addEventListener("submit", addNewSong);

// Asignar evento al formulario de agregar canción
eventForm.addEventListener("submit", addNewEvent);

// Asignar evento al formulario de edición de canción
editRepertorioForm.addEventListener("submit", saveEditedSong);

//Carga los temas que se podrian tocar en el evento
document.addEventListener("DOMContentLoaded", function() {
  loadAvailableSongs();
});


// Iniciar la aplicación
init();
