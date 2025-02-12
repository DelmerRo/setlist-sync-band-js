import './style.css';

// Llamamos al popup de login
const loginPopup = document.getElementById('loginPopup');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');

// Popup de edición
const editPopup = document.getElementById('editPopup');
const editForm = document.getElementById('editForm');
const editTituloInput = document.getElementById('editTitulo');
const editArtistaInput = document.getElementById('editArtista');

// Repertorio
const repertorioForm = document.getElementById("repertorioForm");
const tituloInput = document.getElementById("titulo");
const artistaInput = document.getElementById("artista");
const tableBody = document.querySelector("#repertorioTable tbody");

// Lista de usuarios autorizados
const authorizedUsers = [
  { email: atob("ZGVsbWVyQHRlcnJhbmRpbmEuY29t"), password: atob("c2h1MTIz") },
  { email: atob("am9uYXRoYW5AdGVycmFuZGluYS5jb20="), password: atob("c2h1MTIz") },
  { email: atob("YnVsYWNpb0B0ZXJyYW5kaW5hLmNvbQ=="), password: atob("c2h1MTIz") },
  { email: atob("bWFydmluQHRlcnJhbmRpbmEuY29t"), password: atob("c2h1MTIz") },
  { email: atob("cm9kcmlnb0B0ZXJyYW5kaW5hLmNvbQ=="), password: atob("c2h1MTIz") }
];

// Función para cargar el repertorio desde localStorage
function loadRepertorio() {
  let repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  tableBody.innerHTML = ""; // Limpiar la tabla antes de cargar los nuevos elementos
  repertorio.forEach((item, index) => {
    let row = tableBody.insertRow();
    row.innerHTML = `
      <td>${item.titulo}</td>
      <td>${item.artista}</td>
      <td>
        <button onclick="editItem(${index})">Editar</button>
        <button onclick="deleteItem(${index})">Eliminar</button>
      </td>
    `;
  });
}

// Función para guardar el repertorio en localStorage
function saveRepertorio(repertorio) {
  localStorage.setItem("repertorio", JSON.stringify(repertorio));
}

// Función para agregar un ítem al repertorio
function addItem(event) {
  event.preventDefault();
  let repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  repertorio.push({
    titulo: tituloInput.value,
    artista: artistaInput.value,
  });
  saveRepertorio(repertorio);
  loadRepertorio();  // Recargar la tabla después de agregar
  repertorioForm.reset();  // Limpiar los campos del formulario
}

// Función para editar un ítem del repertorio
window.editItem = function (index) {
  let repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  let item = repertorio[index];
  
  // Rellenar el formulario de edición con los datos del ítem
  editTituloInput.value = item.titulo;
  editArtistaInput.value = item.artista;

  // Mostrar el popup de edición
  editPopup.style.display = "flex";

  // Guardar cambios al enviar el formulario de edición
  editForm.onsubmit = function(event) {
    event.preventDefault();
    item.titulo = editTituloInput.value;
    item.artista = editArtistaInput.value;

    // Actualizar el repertorio y cerrar el popup
    repertorio.splice(index, 1, item);
    saveRepertorio(repertorio);
    loadRepertorio();  // Recargar la tabla después de editar
    editPopup.style.display = "none";  // Cerrar el popup de edición
  };
};

// Función para cancelar la edición
document.getElementById('cancelEdit').addEventListener('click', function() {
  editPopup.style.display = "none";  // Cerrar el popup de edición sin guardar
});

// Función para eliminar un ítem del repertorio
window.deleteItem = function (index) {
  let repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];
  repertorio.splice(index, 1);  // Eliminar el ítem del arreglo
  saveRepertorio(repertorio);  // Guardar el repertorio actualizado
  loadRepertorio();  // Recargar la tabla después de eliminar
};

// Agregar un ítem cuando el formulario se envía
repertorioForm.addEventListener("submit", addItem);

// Cargar el repertorio al iniciar
loadRepertorio();

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





