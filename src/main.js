import './style.css';

// Llamamos al popup de login
const loginPopup = document.getElementById('loginPopup');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');

// Elementos del DOM
const repertorioForm = document.getElementById("repertorioForm");
const editRepertorioForm = document.getElementById("editRepertorioForm");
const tableBody = document.querySelector("#repertorioTable tbody");
const editSongModal = new bootstrap.Modal(document.getElementById('editSongModal'));
let editId = null;

// Lista de usuarios autorizados
const authorizedUsers = [
  { email: atob("ZGVsbWVyQHRlcnJhbmRpbmEuY29t"), password: atob("c2h1MTIz") },
  { email: atob("am9uYXRoYW5AdGVycmFuZGluYS5jb20="), password: atob("c2h1MTIz") },
  { email: atob("YnVsYWNpb0B0ZXJyYW5kaW5hLmNvbQ=="), password: atob("c2h1MTIz") },
  { email: atob("bWFydmluQHRlcnJhbmRpbmEuY29t"), password: atob("c2h1MTIz") },
  { email: atob("cm9kcmlnb0B0ZXJyYW5kaW5hLmNvbQ=="), password: atob("c2h1MTIz") }
];

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email, password);

  // Verificar si las credenciales ingresadas coinciden con algún usuario autorizado
  const user = authorizedUsers.find(user => {
    // Comparar las credenciales directamente sin decodificarlas
    return user.email === email && user.password === password;
  });

  if (user) {
    alert("Sesión iniciada correctamente");
    loginPopup.style.display = "none";  // Ocultar el popup de login
    app.style.display = "block";  // Mostrar la app principal
    loadRepertorio();  // Cargar los datos del repertorio
  } else {
    alert("Credenciales incorrectas");
  }
});

// Cargar repertorio desde localStorage
function loadRepertoire() {
  const repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  tableBody.innerHTML = "";

  repertorio.forEach((cancion, index) => {
    const row = `<tr>
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
    tableBody.innerHTML += row;
  });

  // Asignar los eventos después de que toda la tabla haya sido cargada
  repertorio.forEach((cancion, index) => {
    document.getElementById(`viewBtn-${index}`).addEventListener("click", function() {
      viewSong(index);
    });
  });
}

// Guardar repertorio en localStorage
function saveRepertoire(repertorio) {
  localStorage.setItem("repertorio", JSON.stringify(repertorio));
  loadRepertoire();
}

// Agregar nueva canción
repertorioForm.addEventListener("submit", function (e) {
  e.preventDefault();
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
});

// Editar canción
window.editSong = function (index) {
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

// Guardar edición
editRepertorioForm.addEventListener("submit", function (e) {
  e.preventDefault();
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
});

// Eliminar canción
window.deleteSong = function (index) {
  const repertorio = JSON.parse(localStorage.getItem("repertorio"));
  repertorio.splice(index, 1);
  saveRepertoire(repertorio);
};

// Función para mostrar los acordes en el modal
function viewSong(index) {
  const repertorio = JSON.parse(localStorage.getItem("repertorio"));
  const cancion = repertorio[index];
  const letrasAcordes = cancion.letrasAcordes;

  // Resaltar los acordes dentro del texto.
  const highlightedChords = highlightChordsInText(letrasAcordes);

  // Insertar el texto resaltado en el modal.
  document.getElementById("chordsContent").innerHTML = highlightedChords;

  // Mostrar el título de la canción en el modal.
  document.getElementById("chordsModalLabel").textContent = `${cancion.titulo} - ${cancion.artista}`;

  // Mostrar el modal con los acordes resaltados.
  const chordsModal = new bootstrap.Modal(document.getElementById('chordsModal'));
  chordsModal.show();
}

function highlightChordsInText(text) {
  // Paso 1: Resaltar los símbolos '@' y '#'
  text = text.replace(/@/g, '<span class="special-symbol">@</span>');
  text = text.replace(/#/g, '<span class="special-symbol">#</span>');

  // Paso 2: Resaltar los acordes
  const chordPattern = /\b([A-G](?:♯|b)?(?:m|maj|min|dim|aug|sus|add)?[0-9]{0,2})\b/g;
  
  text = text.replace(chordPattern, (match) => {
    console.log('Acorde encontrado: ', match);  // Debugging
    return `<span class="chord">${match}</span>`;
  });

  return text;
}

// Inicializar
loadRepertoire();




