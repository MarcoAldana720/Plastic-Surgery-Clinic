function autoplayCarousel() {
  const carouselEl = document.getElementById("carousel");
  const slideContainerEl = carouselEl.querySelector("#slide-container");
  const slideEl = carouselEl.querySelector(".slide");
  const indicators = document.querySelectorAll(".slide-indicator");
  const slideWidth = slideEl.offsetWidth;
  const gap = 10; // Espaciado entre slides
  let autoplay;

  // Función para calcular la posición de scroll
  const getNewScrollPosition = (direction) => {
    const maxScrollLeft =
      slideContainerEl.scrollWidth - slideContainerEl.clientWidth;
    if (direction === "forward") {
      const x = slideContainerEl.scrollLeft + slideWidth + gap;
      return x > maxScrollLeft ? 0 : x; // Vuelve al inicio si supera el límite
    } else if (direction === "backward") {
      const x = slideContainerEl.scrollLeft - slideWidth - gap;
      return x < 0 ? maxScrollLeft : x; // Va al final si está antes del primer slide
    }
  };

  // Función para navegar entre diapositivas
  const navigate = (arg) => {
    if (typeof arg === "number") {
      slideContainerEl.scrollLeft = arg * (slideWidth + gap);
    } else {
      slideContainerEl.scrollLeft = getNewScrollPosition(arg);
    }
    updateIndicators();
  };

  // Actualizar los indicadores activos
  const updateIndicators = () => {
    const slideIndex = Math.round(
      slideContainerEl.scrollLeft / (slideWidth + gap)
    );
    indicators.forEach((dot, index) => {
      dot.classList.toggle("active", index === slideIndex);
    });
  };

  // Configurar los eventos de las flechas
  document
    .querySelector("#back-button")
    .addEventListener("click", () => navigate("backward"));
  document
    .querySelector("#forward-button")
    .addEventListener("click", () => navigate("forward"));

  // Configurar los indicadores
  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => navigate(index));
  });

  // Iniciar autoplay
  autoplay = setInterval(() => navigate("forward"), 3000);

  // Detener autoplay al pasar el mouse sobre el carrusel
  slideContainerEl.addEventListener("mouseenter", () => clearInterval(autoplay));
  slideContainerEl.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => navigate("forward"), 3000);
  });

  // Recalcular el ancho de las diapositivas al cambiar el tamaño de la ventana
  window.addEventListener("resize", () => {
    clearInterval(autoplay);
    navigate(0);
  });

  // Iniciar el observador para indicadores
  const slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slideIndex = Number(entry.target.dataset.slideindex);
          indicators.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === slideIndex);
          });
        }
      });
    },
    { root: slideContainerEl, threshold: 0.7 }
  );

  document.querySelectorAll(".slide").forEach((slide) => {
    slideObserver.observe(slide);
  });
}

// Inicia el carrusel
autoplayCarousel();
