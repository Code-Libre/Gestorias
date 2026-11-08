/* ==========================================================
   GESTORÍA MODELO — Scripts
   Índice:
   1. Menú móvil
   2. Sombra del encabezado al desplazarse
   3. Enlace activo según la sección visible
   4. Correo de contacto (protegido contra robots de spam)
   5. Año actual en el pie de página
   6. Aparición de secciones al desplazarse
   7. Servicios: ventana con el detalle
   8. Carrusel de opiniones
   9. Inicio
   ========================================================== */


/* ---------- 1. MENÚ MÓVIL ---------- */
function iniciarMenuMovil() {
  const botonMenu = document.getElementById("boton-menu");
  const menu = document.getElementById("menu-principal");
  const fondo = document.getElementById("menu-fondo");

  if (!botonMenu || !menu) return;

  function cerrarMenu() {
    menu.classList.remove("menu-principal--abierto");
    botonMenu.setAttribute("aria-expanded", "false");
    if (fondo) fondo.classList.remove("menu-fondo--visible");
  }

  botonMenu.addEventListener("click", () => {
    const estaAbierto = menu.classList.toggle("menu-principal--abierto");
    botonMenu.setAttribute("aria-expanded", estaAbierto);
    if (fondo) fondo.classList.toggle("menu-fondo--visible", estaAbierto);
  });

  // Cierra el menú al tocar el fondo borroso
  if (fondo) fondo.addEventListener("click", cerrarMenu);

  // Cierra el menú al elegir una opción
  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", cerrarMenu);
  });

  // Cierra el menú con la tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarMenu();
  });
}


/* ---------- 2. SOMBRA DEL ENCABEZADO AL DESPLAZARSE ---------- */
function iniciarSombraEncabezado() {
  const encabezado = document.getElementById("inicio-encabezado");
  if (!encabezado) return;

  window.addEventListener("scroll", () => {
    encabezado.classList.toggle("encabezado--con-sombra", window.scrollY > 10);
  }, { passive: true });
}


/* ---------- 3. ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE ---------- */
function iniciarEnlaceActivo() {
  const secciones = document.querySelectorAll("section[id]");
  const enlaces = document.querySelectorAll(".menu-principal__enlace");

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      enlaces.forEach((enlace) => {
        const coincide = enlace.getAttribute("href") === `#${entrada.target.id}`;
        enlace.classList.toggle("menu-principal__enlace--activo", coincide);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  secciones.forEach((seccion) => observador.observe(seccion));
}


/* ---------- 4. CORREO DE CONTACTO ---------- */
function iniciarCorreoContacto() {
  // El correo se arma acá para que no aparezca completo en el HTML
  const usuario = "contacto";
  const dominio = "example.com";
  const correo = `${usuario}@${dominio}`;

  const enlaceCorreo = document.getElementById("correo-contacto");
  const botonConsultar = document.getElementById("boton-consultar");

  if (enlaceCorreo) {
    enlaceCorreo.textContent = correo;
    enlaceCorreo.href = `mailto:${correo}`;
  }

  if (botonConsultar) {
    botonConsultar.href = `mailto:${correo}?subject=Consulta desde el sitio web`;
  }
}


/* ---------- 5. AÑO ACTUAL EN EL PIE DE PÁGINA ---------- */
function iniciarAnioActual() {
  const anio = document.getElementById("anio-actual");
  if (anio) anio.textContent = new Date().getFullYear();
}


/* ---------- 6. APARICIÓN DE SECCIONES AL DESPLAZARSE ---------- */
function iniciarAparicion() {
  if (!("IntersectionObserver" in window)) return;

  // Anima el contenido de cada sección, menos la portada
  const elementos = document.querySelectorAll("main > section:not(.portada) > .contenedor");

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("revelar--visible");
      obs.unobserve(entrada.target); // se anima una sola vez
    });
  }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });

  elementos.forEach((elemento) => {
    elemento.classList.add("revelar");
    observador.observe(elemento);
  });
}


/* ---------- 7. SERVICIOS: VENTANA CON EL DETALLE ---------- */
function iniciarServicios() {
  const ventana = document.getElementById("servicio-modal");
  const contenido = document.getElementById("servicio-modal-contenido");
  const imagen = document.getElementById("servicio-modal-imagen");
  const fondo = document.getElementById("servicio-fondo");
  if (!ventana || !contenido || typeof ventana.showModal !== "function") return;

  document.querySelectorAll(".servicio__boton").forEach((boton) => {
    boton.addEventListener("click", () => {
      const detalle = boton.parentElement.querySelector(".servicio__detalle");
      const foto = boton.querySelector(".servicio__imagen");
      if (!detalle) return;

      contenido.innerHTML = detalle.innerHTML;

      // Muestra en la ventana la misma imagen de la tarjeta
      if (imagen && foto) imagen.src = foto.currentSrc || foto.src;

      const titulo = contenido.querySelector(".servicio__titulo");
      ventana.setAttribute("aria-label", titulo ? titulo.textContent : "Detalle del servicio");

      if (fondo) fondo.classList.add("servicio-fondo--visible");
      ventana.showModal();
    });
  });

  // Quita el desenfoque siempre que la ventana se cierre (X, Escape o clic afuera)
  ventana.addEventListener("close", () => {
    if (fondo) fondo.classList.remove("servicio-fondo--visible");
  });

  // Cierra con la X
  ventana.querySelector(".servicio-modal__cerrar").addEventListener("click", () => ventana.close());

  // Cierra al tocar afuera de la ventana
  ventana.addEventListener("click", (e) => {
    if (e.target === ventana) ventana.close();
  });
}


/* ---------- 8. CÓMO TRABAJAMOS: PROCESO INTERACTIVO ---------- */
function iniciarProceso() {
  const pasos = Array.from(document.querySelectorAll(".proceso__paso"));
  const relleno = document.getElementById("proceso-relleno");
  const panel = document.getElementById("proceso-panel");
  const titulo = document.getElementById("proceso-panel-titulo");
  const texto = document.getElementById("proceso-panel-texto");
  if (!pasos.length || !relleno || !panel || !titulo || !texto) return;

  const SEGUNDOS_POR_TRAMO = 0.35;
  let actual = 0;

  function seleccionar(indice) {
    const anterior = actual;
    actual = indice;
    const tramos = Math.abs(indice - anterior);

    pasos.forEach((paso, i) => {
      const hecho = i <= indice;
      // Al avanzar, cada círculo se enciende justo cuando la barra lo alcanza
      const retraso = hecho && i > anterior ? (i - anterior) * SEGUNDOS_POR_TRAMO : 0;
      paso.style.setProperty("--retraso", `${retraso}s`);
      paso.classList.toggle("proceso__paso--hecho", hecho);
      paso.classList.toggle("proceso__paso--activo", i === indice);
      paso.setAttribute("aria-selected", i === indice ? "true" : "false");
      paso.tabIndex = i === indice ? 0 : -1;
    });

    // Barra de carga
    relleno.style.transitionDuration = `${Math.max(tramos * SEGUNDOS_POR_TRAMO, 0.3)}s`;
    relleno.style.width = `${(indice / (pasos.length - 1)) * 100}%`;

    // Contenido del panel
    titulo.textContent = pasos[indice].dataset.titulo;
    texto.textContent = pasos[indice].dataset.texto;
    panel.setAttribute("aria-labelledby", pasos[indice].id);

    // Reinicia la animación de entrada del panel
    panel.classList.remove("proceso__panel--entra");
    void panel.offsetWidth;
    panel.classList.add("proceso__panel--entra");
  }

  pasos.forEach((paso, i) => {
    paso.addEventListener("click", () => seleccionar(i));

    // Flechas del teclado para moverse entre etapas
    paso.addEventListener("keydown", (e) => {
      let destino = null;
      if (e.key === "ArrowRight") destino = Math.min(i + 1, pasos.length - 1);
      if (e.key === "ArrowLeft") destino = Math.max(i - 1, 0);
      if (destino === null) return;
      e.preventDefault();
      seleccionar(destino);
      pasos[destino].focus();
    });
  });

  seleccionar(0);
}
/* ---------- 8. CARRUSEL DE OPINIONES ---------- */
function iniciarCarruselOpiniones() {
  const carrusel = document.querySelector(".carrusel");
  const lista = document.getElementById("opiniones-lista");
  const anterior = document.querySelector(".carrusel__flecha--anterior");
  const siguiente = document.querySelector(".carrusel__flecha--siguiente");
  if (!carrusel || !lista || !anterior || !siguiente) return;

  const tarjetas = Array.from(lista.querySelectorAll(".opinion"));
  if (tarjetas.length < 2) return;

  // Posición exacta de una tarjeta dentro de la lista
  function posicion(tarjeta) {
    return lista.scrollLeft
      + tarjeta.getBoundingClientRect().left
      - lista.getBoundingClientRect().left;
  }

  // Hasta dónde se puede desplazar la lista
  function maximo() {
    return lista.scrollWidth - lista.clientWidth;
  }

  // Tarjeta que está al comienzo de la vista
  function indiceActual() {
    let mejor = 0;
    let distancia = Infinity;
    tarjetas.forEach((tarjeta, i) => {
      const d = Math.abs(posicion(tarjeta) - lista.scrollLeft);
      if (d < distancia) { distancia = d; mejor = i; }
    });
    return mejor;
  }

  // Avanza o retrocede una tarjeta; al llegar al final vuelve al principio (y al revés)
  function mover(direccion) {
    const alFinal = lista.scrollLeft >= maximo() - 4;
    const alPrincipio = lista.scrollLeft <= 4;
    const i = indiceActual();
    let destino;

    if (direccion > 0) {
      destino = alFinal
        ? 0
        : Math.min(posicion(tarjetas[Math.min(i + 1, tarjetas.length - 1)]), maximo());
    } else {
      destino = alPrincipio
        ? maximo()
        : posicion(tarjetas[Math.max(i - 1, 0)]);
    }

    lista.scrollTo({ left: destino });
  }

  anterior.addEventListener("click", () => mover(-1));
  siguiente.addEventListener("click", () => mover(1));

  // Gira solo cada 4 segundos. El temporizador no se corta nunca: en cada
  // vuelta mira si hay un mouse encima y, si es así, simplemente espera.
  // En pantallas táctiles no existe el "cursor encima", así que siempre gira.
  const hayMouse = window.matchMedia("(hover: hover)");
  setInterval(() => {
    if (document.hidden) return;
    if (hayMouse.matches && carrusel.matches(":hover")) return;
    mover(1);
  }, 4000);
}

function iniciarEnlaceActivo() {
  const secciones = document.querySelectorAll("section[id]");
  const enlaces = document.querySelectorAll(".menu-principal__enlace");

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      enlaces.forEach((enlace) => {
        const destino = enlace.getAttribute("href");
        // Los enlaces a otras páginas no se tocan: su marca es fija
        if (!destino.startsWith("#")) return;
        enlace.classList.toggle("menu-principal__enlace--activo", destino === `#${entrada.target.id}`);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  secciones.forEach((seccion) => observador.observe(seccion));
}

/* ---------- 10. INICIO ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarMenuMovil();
  iniciarSombraEncabezado();
  iniciarEnlaceActivo();
  iniciarCorreoContacto();
  iniciarAnioActual();
  iniciarAparicion();
  iniciarServicios();
  iniciarProceso();
  iniciarCarruselOpiniones();
});