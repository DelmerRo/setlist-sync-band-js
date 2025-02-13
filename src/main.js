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
      <button class="btn btn-success btn-sm" onclick="viewSong(${index})">Ver</button>
        <button class="btn btn-warning btn-sm" onclick="editSong(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteSong(${index})">Eliminar</button>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
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

  // Accedemos al contenido de los acordes de la canción
  const letrasAcordes = cancion.letrasAcordes;

  // Resaltar los acordes dentro del texto
  const highlightedChords = highlightChordsInText(letrasAcordes);

  // Mostrar los acordes en el modal
  document.getElementById("chordsContent").innerHTML = highlightedChords;

  // Mostrar el modal con los acordes
  const chordsModal = new bootstrap.Modal(document.getElementById('chordsModal'));
  chordsModal.show();
}

// Función para resaltar los acordes en el texto
function highlightChordsInText(text) {
  const chordPattern = /\[([A-Za-z#0-9]+)\]/g;  // Detecta los acordes entre corchetes
  return text.replace(chordPattern, '<span class="chord">$1</span>');
}

// Inicializar
loadRepertoire();




