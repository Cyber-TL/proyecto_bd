const API_URL = "https://proyecto-bd-gk0o.onrender.com";

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar && formulario) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion();
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });

    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

const formContacto = document.getElementById("formularioContacto");
const listaMensajes = document.getElementById("listaMensajes");
const btnRefrescar = document.getElementById("btnRefrescar");

// READ
async function cargarMensajes() {
  if (!listaMensajes) return;

  try {
    const respuesta = await fetch(`${API_URL}/contacto`);
    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
      listaMensajes.innerHTML = "<p class='vacio'>No hay mensajes todavía.</p>";
      return;
    }

    mensajes.forEach((m) => {
      const fecha = m.fecha
        ? new Date(m.fecha).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })
        : "";

      const elemento = document.createElement("div");
      elemento.classList.add("mensaje");

      elemento.innerHTML = `
        <div class="mensaje-cabecera">
          <h3 class="mensaje-nombre">
            ${escaparHTML(m.nombre)}
            <span class="mensaje-correo">&lt;${escaparHTML(m.correo)}&gt;</span>
          </h3>
          <span class="mensaje-fecha">${fecha}</span>
        </div>
        <p class="mensaje-asunto">Asunto: ${escaparHTML(m.asunto)}</p>
        <p class="mensaje-texto">${escaparHTML(m.mensaje)}</p>
        <div class="mensaje-acciones">
          <button class="btn-eliminar" onclick="eliminarMensaje(${m.id})">Eliminar</button>
        </div>
      `;

      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
    listaMensajes.innerHTML = "<p class='vacio'>No se pudo conectar con el servidor.</p>";
  }
}

if (formContacto) {
  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const datos = {
      nombre: document.getElementById("nombre").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      asunto: document.getElementById("asunto").value.trim(),
      mensaje: document.getElementById("mensaje").value.trim(),
    };

    try {
      const respuesta = await fetch(`${API_URL}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) {
        alert("No se pudo enviar el mensaje. Revisa los datos.");
        return;
      }

      formContacto.reset();
      cargarMensajes();
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error de conexión con el servidor.");
    }
  });
}

async function eliminarMensaje(id) {
  if (!confirm("¿Deseas eliminar este mensaje?")) return;

  try {
    await fetch(`${API_URL}/contacto/${id}`, { method: "DELETE" });
    cargarMensajes();
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
  }
}

if (btnRefrescar) {
  btnRefrescar.addEventListener("click", cargarMensajes);
}

cargarProductos();
cargarMensajes();