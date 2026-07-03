const galleryButtons = document.querySelectorAll(".thumb");
const stickyContact = document.querySelector(".sticky-contact");
const lightbox = document.querySelector("#lightbox");
const lightboxPanel = document.querySelector(".lightbox__panel");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

const galleryItems = Array.from(galleryButtons).map((button) => ({
  imageSrc: button.dataset.image,
  caption: button.dataset.caption,
  button,
}));

let lightboxIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

const SWIPE_THRESHOLD = 48;

document.body.classList.add("js-enhanced");

const setActiveThumb = (button) => {
  galleryButtons.forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
};

const showLightboxSlide = (index) => {
  if (!lightbox || !lightboxImage || !lightboxCaption || !galleryItems.length) return;

  lightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const { imageSrc, caption, button } = galleryItems[lightboxIndex];

  lightboxImage.src = imageSrc;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  setActiveThumb(button);
};

const openLightbox = (imageSrc) => {
  if (!lightbox) return;

  const index = galleryItems.findIndex((item) => item.imageSrc === imageSrc);
  showLightboxSlide(index >= 0 ? index : 0);

  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightbox.querySelector(".lightbox__close")?.focus();
};

const closeLightbox = () => {
  if (!lightbox) return;

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
};

const stepLightbox = (delta) => {
  if (lightbox?.hidden) return;
  showLightboxSlide(lightboxIndex + delta);
};

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openLightbox(button.dataset.image);
  });
});

document.querySelectorAll("[data-lightbox-close]").forEach((el) => {
  el.addEventListener("click", closeLightbox);
});

if (lightboxPanel) {
  lightboxPanel.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    },
    { passive: true }
  );

  lightboxPanel.addEventListener(
    "touchend",
    (event) => {
      if (lightbox?.hidden) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;

      stepLightbox(deltaX < 0 ? 1 : -1);
    },
    { passive: true }
  );
}

document.addEventListener("keydown", (event) => {
  if (lightbox?.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "ArrowLeft") {
    stepLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    stepLightbox(1);
  }
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;
    const original = button.textContent;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Đã copy";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1400);
    } catch {
      button.textContent = text;
    }
  });
});

const toggleStickyContact = () => {
  if (!stickyContact) return;
  const threshold = Math.min(window.innerHeight * 0.78, 720);
  stickyContact.classList.toggle("is-visible", window.scrollY > threshold);
};

toggleStickyContact();
window.addEventListener("scroll", toggleStickyContact, { passive: true });
