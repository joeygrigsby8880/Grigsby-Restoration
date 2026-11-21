const pages = [...document.querySelectorAll("[data-page]")];
const pageLinks = [...document.querySelectorAll("[data-page-link]")];
const nav = document.querySelector(".main-nav");
const menuToggle = document.querySelector(".menu-toggle");

function showPage(name, updateHistory = true) {
  const pageName = pages.some((page) => page.dataset.page === name) ? name : "work";
  pages.forEach((page) => {
    const active = page.dataset.page === pageName;
    page.hidden = !active;
    page.classList.toggle("active", active);
  });
  pageLinks.forEach((link) => {
    const active = link.dataset.pageLink === pageName;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (updateHistory) history.pushState({ page: pageName }, "", `#${pageName}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const destination = link.getAttribute("href").slice(1);
    if (["work", "services", "estimate"].includes(destination)) {
      event.preventDefault();
      showPage(destination);
    }
  });
});

window.addEventListener("popstate", () => showPage(location.hash.slice(1), false));
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
showPage(location.hash.slice(1) || "work", false);

document.querySelectorAll("[data-gallery-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.galleryTab;
    document.querySelectorAll("[data-gallery-tab]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".gallery-panel").forEach((panel) => {
      const active = panel.id === `gallery-${selected}`;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
  });
});

let beforePhotoUrl;
let afterPhotoUrl;
const photoUrls = new Set();
const uploadStatus = document.querySelector(".upload-status");
const addProjectButton = document.querySelector("#add-project");
const photoInputs = [
  { input: document.querySelector("#before-photo"), key: "before", label: "before" },
  { input: document.querySelector("#after-photo"), key: "after", label: "after" },
];

photoInputs.forEach(({ input, key, label }) => {
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      uploadStatus.textContent = "Please choose an image file.";
      input.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    photoUrls.add(url);
    if (key === "before") beforePhotoUrl = url;
    else afterPhotoUrl = url;
    const preview = input.parentElement.querySelector(".upload-preview");
    preview.src = url;
    preview.hidden = false;
    const [strong, helper] = input.parentElement.querySelectorAll("strong, span:last-of-type");
    strong.textContent = file.name;
    helper.textContent = `${label} photo selected`;
    const count = [beforePhotoUrl, afterPhotoUrl].filter(Boolean).length;
    addProjectButton.disabled = count !== 2;
    uploadStatus.textContent = count === 2
      ? "Your before-and-after pair is ready to add to this gallery preview."
      : "One photo added. Choose the matching " + (key === "before" ? "after" : "before") + " photo to complete your pair.";
  });
});

window.addEventListener("pagehide", () => photoUrls.forEach((url) => URL.revokeObjectURL(url)));

addProjectButton.addEventListener("click", () => {
  if (!beforePhotoUrl || !afterPhotoUrl) return;
  const project = document.createElement("article");
  project.className = "project-card";
  project.innerHTML = `
    <div class="project-pair">
      <figure><img alt="Before restoration" /><figcaption>BEFORE <span>Your project</span></figcaption></figure>
      <figure><img alt="After restoration" /><figcaption>AFTER <span>Your project</span></figcaption></figure>
    </div>
    <div class="project-caption"><span></span><span aria-hidden="true">↗</span></div>`;
  const images = project.querySelectorAll("img");
  images[0].src = beforePhotoUrl;
  images[1].src = afterPhotoUrl;
  project.querySelector(".project-caption span").textContent =
    document.querySelector("#project-title").value.trim() || "Your restoration project";
  document.querySelector(".project-grid").prepend(project);
  document.querySelector("#gallery-tab-showcase").click();
  uploadStatus.textContent = "Your project is now at the top of the gallery preview. It will be cleared when you close or refresh this page.";
});

const serviceContent = {
  demolition: {
    number: "01",
    title: "Demolition",
    heading: "Make room<br />for <em>what’s next.</em>",
    description: "We carefully remove damaged or outdated materials, protect the parts of your home that are staying, and prepare the space for its next chapter. A clean, considered start makes the rebuild smoother.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
    alt: "Home renovation work in progress",
  },
  flooring: {
    number: "02",
    title: "Flooring",
    heading: "A fresh foundation<br />for <em>every day.</em>",
    description: "From removing worn flooring to preparing the subfloor and installing a fresh finish, we help create a comfortable, durable foundation that feels right for your home.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    alt: "Warm living room with finished wood flooring",
  },
  painting: {
    number: "03",
    title: "Painting",
    heading: "A new point<br />of <em>view.</em>",
    description: "Good paint starts with good preparation. We help get surfaces ready, address small imperfections, and apply a clean, even finish that brings new life to a room.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    alt: "Refreshed home interior with a calm, neutral palette",
  },
  cabinets: {
    number: "04",
    title: "Cabinets",
    heading: "Make your space<br />work <em>beautifully.</em>",
    description: "Whether cabinets need a thoughtful refresh or a new installation, we focus on careful fitting, practical details, and finishes that feel at home in your space.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    alt: "Bright, thoughtfully finished kitchen cabinetry",
  },
  mold: {
    number: "05",
    title: "Mold remediation",
    heading: "Address the issue.<br /><em>Restore your peace.</em>",
    description: "When mold is a concern, the first step is understanding the affected area and its moisture source. We can discuss appropriate containment, careful removal, and the repair work needed afterward.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
    alt: "Restoration work in a home",
  },
};

document.querySelectorAll("[data-service]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const service = serviceContent[tab.dataset.service];
    document.querySelectorAll("[data-service]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const detail = document.querySelector("#service-detail");
    detail.setAttribute("aria-labelledby", tab.id);
    detail.querySelector(".eyebrow").innerHTML = `<span class="eyebrow-line"></span> ${service.number} / ${service.title}`;
    detail.querySelector("h2").innerHTML = service.heading;
    detail.querySelector(".service-description").textContent = service.description;
    const image = detail.querySelector(".service-image img");
    image.src = service.image;
    image.alt = service.alt;
  });
});

const laborRates = {
  demolition: 2.5,
  flooring: 4.25,
  painting: 2.75,
  cabinets: 8.5,
  mold: 5.75,
};
const setupAllowances = { mold: 450 };
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

document.querySelector("#estimate-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const squareFeet = Number(form.elements.squareFeet.value);
  const selectedServices = [...form.querySelectorAll('input[name="service"]:checked')].map((input) => input.value);
  const serviceError = document.querySelector("#service-error");
  serviceError.hidden = selectedServices.length !== 0;
  if (selectedServices.length === 0) {
    form.querySelector(".estimate-services").setAttribute("aria-invalid", "true");
    form.querySelector(".estimate-services").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (!Number.isFinite(squareFeet) || squareFeet <= 0 || squareFeet > 100000) {
    return;
  }
  form.querySelector(".estimate-services").removeAttribute("aria-invalid");

  const conditionMultiplier = Number(form.elements.condition.value);
  const labor = selectedServices.reduce((total, service) => total + squareFeet * laborRates[service], 0) * conditionMultiplier;
  const materials = squareFeet * 1.8;
  const setup = selectedServices.reduce((total, service) => total + (setupAllowances[service] || 0), 0);
  const midpoint = labor + materials + setup;
  const low = midpoint * 0.85;
  const high = midpoint * 1.15;

  document.querySelector("#result-empty").hidden = true;
  document.querySelector("#result-filled").hidden = false;
  document.querySelector("#estimate-range").textContent = `${currency.format(low)} – ${currency.format(high)}`;
  document.querySelector("#labor-cost").textContent = currency.format(labor);
  document.querySelector("#material-cost").textContent = currency.format(materials);
  document.querySelector("#setup-cost").textContent = currency.format(setup);
  const names = selectedServices.map((service) => serviceContent[service].title);
  document.querySelector("#selected-work").textContent = `${squareFeet.toLocaleString()} sq. ft. · ${names.join(" · ")}`;
});
