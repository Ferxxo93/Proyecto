// Variables globales
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Cargar productos desde JSON local
async function fetchProductos() {
    try {
        const response = await fetch("data/productos.json");
        productos = await response.json();
        renderProductos();
        actualizarContador();
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// Renderizar productos en cards
function renderProductos() {
    const contenedor = document.getElementById("productos-container");
    contenedor.innerHTML = "";

    productos.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.titulo}">
            <div class="card-content">
                <h3>${prod.titulo}</h3>
                <p>Precio: $${prod.precio}</p>
                <button onclick="agregarAlCarrito(${prod.id})" class="btn">Agregar al carrito</button>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
}

// Actualizar contador en header
function actualizarContador() {
    const contador = document.getElementById("carrito-contador");
    contador.textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
}

// Mostrar carrito
function mostrarCarrito() {
    const contenedor = document.getElementById("carrito-container");
    contenedor.innerHTML = "";

    carrito.forEach(prod => {
        const item = document.createElement("div");
        item.classList.add("carrito-item");

        item.innerHTML = `
            <h4>${prod.titulo}</h4>
            <div>
                <label>Cantidad:</label>
                <input type="number" min="1" value="${prod.cantidad}" onchange="cambiarCantidad(${prod.id}, this.value)">
                <p>Subtotal: $${prod.precio * prod.cantidad}</p>
            </div>
            <button onclick="eliminarDelCarrito(${prod.id})">Eliminar</button>
        `;

        contenedor.appendChild(item);
    });

    const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("carrito-total");
    totalDiv.innerHTML = `<h3>Total: $${total}</h3>`;
    contenedor.appendChild(totalDiv);
}

// Cambiar cantidad
function cambiarCantidad(id, nuevaCantidad) {
    const producto = carrito.find(p => p.id === id);
    producto.cantidad = parseInt(nuevaCantidad);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
}

// Validación de formulario
function validarFormulario(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !email || !mensaje) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("El correo electrónico no es válido.");
        return;
    }

    alert("Formulario enviado correctamente.");
    event.target.reset();
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();
    mostrarCarrito();

    const form = document.getElementById("contacto-form");
    if (form) {
        form.addEventListener("submit", validarFormulario);
    }
});
