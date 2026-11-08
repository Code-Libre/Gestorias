/* ==========================================================
   GESTORÍA MODELO — Script del formulario de consulta
   Índice:
   1. Configuración
   2. Reglas de validación
   3. Mostrar y limpiar errores
   4. Envío del formulario
   5. Inicio
   ========================================================== */


/* ---------- 1. CONFIGURACIÓN ---------- */
// Dirección del servicio que recibe las consultas (por ejemplo, Formspree:
// "https://formspree.io/f/xxxxxxxx"). Si queda vacía, el formulario funciona
// en modo demostración: valida y muestra el éxito, pero NO envía nada.
const URL_ENVIO = "";


/* ---------- 2. REGLAS DE VALIDACIÓN ---------- */
// Cada regla devuelve un texto de error, o "" si el campo está bien
const reglas = {
  nombre(valor) {
    return valor.trim().length >= 3 ? "" : "Ingrese su nombre y apellido.";
  },

  correo(valor) {
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return formatoCorreo.test(valor.trim()) ? "" : "Ingrese un correo válido, por ejemplo nombre@correo.com.";
  },

  telefono(valor) {
    if (valor.trim() === "") return ""; // es opcional
    const soloNumeros = valor.replace(/\D/g, "");
    return soloNumeros.length >= 8 && soloNumeros.length <= 15
      ? ""
      : "Ingrese un teléfono válido (entre 8 y 15 números).";
  },

  tramite(valor) {
    return valor !== "" ? "" : "Seleccione el tipo de trámite.";
  },

  mensaje(valor) {
    return valor.trim().length >= 10 ? "" : "Cuéntenos un poco más sobre su consulta (mínimo 10 caracteres).";
  },

  terminos(marcado) {
    return marcado ? "" : "Debe aceptar los términos y condiciones.";
  }
};


/* ---------- 3. MOSTRAR Y LIMPIAR ERRORES ---------- */
function mostrarError(nombreCampo, texto) {
  const entrada = document.getElementById(`campo-${nombreCampo}`);
  const mensaje = document.getElementById(`error-${nombreCampo}`);

  mensaje.textContent = texto;
  entrada.classList.toggle("formulario__entrada--invalida", texto !== "");
  entrada.setAttribute("aria-invalid", texto !== "");
}

// Valida un campo y devuelve true si está bien
function validarCampo(nombreCampo) {
  const entrada = document.getElementById(`campo-${nombreCampo}`);
  const valor = nombreCampo === "terminos" ? entrada.checked : entrada.value;
  const error = reglas[nombreCampo](valor);

  mostrarError(nombreCampo, error);
  return error === "";
}


/* ---------- 4. ENVÍO DEL FORMULARIO ---------- */
async function enviarConsulta(formulario) {
  const aviso = document.getElementById("aviso-envio");
  const botonEnviar = document.getElementById("boton-enviar");
  aviso.textContent = "";

  // Si un robot completó el campo trampa, se finge éxito sin enviar nada
  if (document.getElementById("campo-web").value !== "") {
    mostrarExito(formulario);
    return;
  }

  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando…";

  try {
    if (URL_ENVIO === "") {
      // Modo demostración: espera un instante y simula el envío
      console.warn("Formulario en modo demostración: configure URL_ENVIO en consulta.js");
      await new Promise((resolver) => setTimeout(resolver, 600));
    } else {
      const respuesta = await fetch(URL_ENVIO, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(formulario)
      });
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
    }
    mostrarExito(formulario);
  } catch (error) {
    aviso.textContent = "No pudimos enviar su consulta. Intente nuevamente o escríbanos por WhatsApp.";
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar consulta";
  }
}

function mostrarExito(formulario) {
  formulario.hidden = true;
  document.getElementById("mensaje-exito").hidden = false;

  // Saca el título, la introducción y la imagen
  document.querySelector(".consulta__titulo").hidden = true;
  document.querySelector(".consulta__introduccion").hidden = true;
  const imagen = document.querySelector(".consulta__imagen");
  if (imagen) imagen.hidden = true;

  // Deja la tarjeta centrada
  document.querySelector(".consulta__cuadricula")
    .classList.add("consulta__cuadricula--enviada");

  document.getElementById("consulta").scrollIntoView({ behavior: "smooth" });
}

/* ---------- 5. INICIO ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-consulta");
  if (!formulario) return;

  const campos = Object.keys(reglas);

  // Valida cada campo al salir de él, y limpia el error mientras se corrige
  campos.forEach((nombreCampo) => {
    const entrada = document.getElementById(`campo-${nombreCampo}`);
    entrada.addEventListener("blur", () => validarCampo(nombreCampo));
    entrada.addEventListener("input", () => {
      if (entrada.classList.contains("formulario__entrada--invalida")) validarCampo(nombreCampo);
    });
  });

  // Al enviar, valida todo; si hay errores, lleva el foco al primero
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultados = campos.map((nombreCampo) => [nombreCampo, validarCampo(nombreCampo)]);
    const primerError = resultados.find(([, esValido]) => !esValido);

    if (primerError) {
      document.getElementById(`campo-${primerError[0]}`).focus();
      return;
    }

    enviarConsulta(formulario);
  });
});