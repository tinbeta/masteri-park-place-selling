const galleryButtons = document.querySelectorAll(".thumb");
const stickyContact = document.querySelector(".sticky-contact");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

document.body.classList.add("js-enhanced");

const openLightbox = (imageSrc, caption) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lightboxImage.src = imageSrc;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
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

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const imageSrc = button.dataset.image;
    const caption = button.dataset.caption;

    if (button.dataset.default === "true") {
      galleryButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
    }

    openLightbox(imageSrc, caption);
  });
});

document.querySelectorAll("[data-lightbox-close]").forEach((el) => {
  el.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
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
