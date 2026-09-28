/* ==========================================================================
   Delhi Properties — main.js
   Shared site behaviour: navigation, WhatsApp links, property rendering,
   filtering engine, forms, gallery/lightbox, small UI polish.
   Depends on PROPERTIES array from properties.js (loaded first).
   ========================================================================== */

const WHATSAPP_NUMBER = "919217151926"; // 9217151926 with country code, no plus/spaces
const CALL_NUMBER = "+919217151926";

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */
function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function whatsappLink(property) {
  let msg = "Hello, I am interested in this property in Delhi. Please share more details.";
  if (property) {
    msg = `Hello, I am interested in "${property.title}" located in ${property.location}, Delhi (Price: ${property.price}). Please share more details.`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function callLink() {
  return `tel:${CALL_NUMBER}`;
}

/* ---------------------------------------------------------------------- */
/* Header: sticky shrink is CSS-only; here we handle mobile nav + active   */
/* ---------------------------------------------------------------------- */
function initHeader() {
  const hamburger = qs(".hamburger");
  const mobileNav = qs(".mobile-nav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      hamburger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = open ? "hidden" : "";
    });
    qsa(".mobile-nav a").forEach(a => a.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = "";
    }));
  }

  // Highlight active nav link based on current page
  const page = window.location.pathname.split("/").pop() || "index.html";
  qsa(".nav-main a, .mobile-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // Wire up WhatsApp / Call icons that use data attributes
  qsa("[data-whatsapp-generic]").forEach(el => el.setAttribute("href", whatsappLink()));
  qsa("[data-call]").forEach(el => el.setAttribute("href", callLink()));
}

/* ---------------------------------------------------------------------- */
/* Back to top                                                             */
/* ---------------------------------------------------------------------- */
function initBackToTop() {
  const btn = qs(".back-to-top");
  const header = qs(".site-header");
  window.addEventListener("scroll", () => {
    if (btn) btn.classList.toggle("show", window.scrollY > 500);
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }, { passive: true });
  if (btn) btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------------------------------------------------------------------- */
/* Scroll reveal — one subtle orchestrated entrance per section            */
/* ---------------------------------------------------------------------- */
function initReveal() {
  const items = qsa(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => obs.observe(el));
}

/* ---------------------------------------------------------------------- */
/* Property card markup                                                   */
/* ---------------------------------------------------------------------- */
/* Fallback placeholder used if a property photo fails to load */
function imgFallback(id) {
  return `this.onerror=null;this.src='https://picsum.photos/seed/delhiprop${id}/900/650';`;
}

function propertyCardHTML(p) {
  const bedsHtml = p.bedrooms > 0
    ? `<span><i class="fa-solid fa-bed" aria-hidden="true"></i> ${p.bedrooms} Beds</span>`
    : "";
  const bathsHtml = p.bathrooms > 0
    ? `<span><i class="fa-solid fa-bath" aria-hidden="true"></i> ${p.bathrooms} Baths</span>`
    : "";
  return `
  <article class="property-card reveal" data-id="${p.id}">
    <div class="property-media">
      <a href="property-details.html?id=${p.id}" aria-label="View details for ${p.title}">
        <img src="${p.image}" alt="${p.title} in ${p.location}, Delhi" loading="lazy" width="800" height="600" onerror="${imgFallback(p.id)}" onload="this.classList.add('loaded')">
      </a>
      <div class="property-badges">
        ${p.featured ? '<span class="badge badge-featured">Featured</span>' : ""}
        <span class="badge ${p.purpose === "Buy" ? "badge-buy" : "badge-rent"}">${p.purpose === "Buy" ? "For Sale" : "For Rent"}</span>
      </div>
    </div>
    <div class="property-body">
      <div class="property-price">${p.price}</div>
      <h3 class="property-title"><a href="property-details.html?id=${p.id}">${p.title}</a></h3>
      <div class="property-loc"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${p.location}, Delhi</div>
      <div class="property-meta">
        ${bedsHtml}
        ${bathsHtml}
        <span><i class="fa-solid fa-ruler-combined" aria-hidden="true"></i> ${p.size} Sq Ft</span>
        <span><i class="fa-solid fa-building" aria-hidden="true"></i> ${p.propertyType}</span>
      </div>
      <p class="property-desc">${p.description.slice(0, 90)}${p.description.length > 90 ? "…" : ""}</p>
      <div class="property-actions">
        <a class="btn btn-outline btn-sm" href="property-details.html?id=${p.id}">View Details</a>
        <a class="btn btn-call btn-sm" href="${callLink()}"><i class="fa-solid fa-phone"></i> Call</a>
        <a class="btn btn-whatsapp btn-sm" href="${whatsappLink(p)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i></a>
      </div>
    </div>
  </article>`;
}

function renderGrid(containerEl, list) {
  if (!containerEl) return;
  if (!list.length) {
    containerEl.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="icon"><i class="fa-regular fa-face-frown"></i></div>
        <h3>No properties found</h3>
        <p>Try adjusting your filters or search a different Delhi location.</p>
      </div>`;
    return;
  }
  containerEl.innerHTML = list.map(propertyCardHTML).join("");
  initReveal();
}

/* ---------------------------------------------------------------------- */
/* Filtering engine                                                       */
/* ---------------------------------------------------------------------- */
function filterProperties(filters) {
  return PROPERTIES.filter(p => {
    if (filters.purpose && filters.purpose !== "Any" && p.purpose !== filters.purpose) return false;
    if (filters.location && filters.location !== "Any" && p.location !== filters.location) return false;
    if (filters.propertyType && filters.propertyType !== "Any" && p.propertyType !== filters.propertyType) return false;
    if (filters.bedrooms && filters.bedrooms !== "Any") {
      const bd = parseInt(filters.bedrooms, 10);
      if (bd >= 4) { if (p.bedrooms < 4) return false; }
      else if (p.bedrooms !== bd) return false;
    }
    if (filters.bathrooms && filters.bathrooms !== "Any") {
      const ba = parseInt(filters.bathrooms, 10);
      if (p.bathrooms < ba) return false;
    }
    if (filters.furnished && filters.furnished !== "Any" && p.furnished !== filters.furnished) return false;
    if (filters.minPrice && Number(filters.minPrice) && p.priceValue < Number(filters.minPrice)) return false;
    if (filters.maxPrice && Number(filters.maxPrice) && p.priceValue > Number(filters.maxPrice)) return false;
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      if (!p.title.toLowerCase().includes(k) && !p.location.toLowerCase().includes(k)) return false;
    }
    return true;
  });
}

function sortProperties(list, sortBy) {
  const copy = [...list];
  switch (sortBy) {
    case "price-asc": return copy.sort((a, b) => a.priceValue - b.priceValue);
    case "price-desc": return copy.sort((a, b) => b.priceValue - a.priceValue);
    case "newest": return copy.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    default: return copy;
  }
}

/* Populate a <select> with unique location options */
function populateLocationOptions(selectEl, includeAny = true) {
  if (!selectEl) return;
  const locations = [...new Set(PROPERTIES.map(p => p.location))].sort();
  selectEl.innerHTML = (includeAny ? '<option value="Any">All Delhi Locations</option>' : "") +
    locations.map(l => `<option value="${l}">${l}</option>`).join("");
}

/* ---------------------------------------------------------------------- */
/* Generic listing page controller (used by properties.html, buy.html,    */
/* rent.html). basePurpose: "Any" | "Buy" | "Rent" locks the purpose tab.  */
/* ---------------------------------------------------------------------- */
function initListingPage(opts) {
  const {
    gridSelector, resultCountSelector, formSelector,
    lockedPurpose = null, lockedType = null
  } = opts;

  const grid = qs(gridSelector);
  const form = qs(formSelector);
  if (!grid || !form) return;

  const locationSel = qs('[name="location"]', form);
  populateLocationOptions(locationSel);

  // Pre-fill from URL query params (e.g. from hero search or area cards)
  const urlLocation = getQueryParam("location");
  const urlPurpose = getQueryParam("purpose");
  const urlType = getQueryParam("type");
  if (urlLocation && locationSel) locationSel.value = urlLocation;
  if (urlPurpose && qs('[name="purpose"]', form)) qs('[name="purpose"]', form).value = urlPurpose;
  if (urlType && qs('[name="propertyType"]', form)) qs('[name="propertyType"]', form).value = urlType;

  function currentFilters() {
    const data = new FormData(form);
    const f = Object.fromEntries(data.entries());
    if (lockedPurpose) f.purpose = lockedPurpose;
    if (lockedType) f.propertyType = lockedType;
    return f;
  }

  function apply() {
    const filters = currentFilters();
    const sortBy = qs("#sortBy") ? qs("#sortBy").value : "default";
    let list = filterProperties(filters);
    list = sortProperties(list, sortBy);
    renderGrid(grid, list);
    const countEl = qs(resultCountSelector);
    if (countEl) countEl.textContent = `${list.length} Propert${list.length === 1 ? "y" : "ies"} Found`;
  }

  form.addEventListener("submit", e => { e.preventDefault(); apply(); });
  form.addEventListener("change", apply);
  const kw = qs('[name="keyword"]', form);
  if (kw) kw.addEventListener("input", () => { apply(); });

  const resetBtn = qs('[data-reset]', form);
  if (resetBtn) resetBtn.addEventListener("click", () => {
    form.reset();
    if (lockedPurpose && qs('[name="purpose"]', form)) qs('[name="purpose"]', form).value = lockedPurpose;
    apply();
  });

  const sortSel = qs("#sortBy");
  if (sortSel) sortSel.addEventListener("change", apply);

  // Category tab buttons (used on buy.html / rent.html for property-type quick filters)
  qsa("[data-cat-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      qsa("[data-cat-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const typeSel = qs('[name="propertyType"]', form);
      if (typeSel) typeSel.value = btn.dataset.catTab;
      apply();
    });
  });

  apply();
}

/* ---------------------------------------------------------------------- */
/* Hero search box → redirects to properties.html with query params       */
/* ---------------------------------------------------------------------- */
function initHeroSearch() {
  const box = qs("#heroSearchForm");
  if (!box) return;

  const locationSel = qs('[name="location"]', box);
  populateLocationOptions(locationSel);

  let activePurpose = "Buy";
  qsa(".search-tabs button", box).forEach(btn => {
    btn.addEventListener("click", () => {
      qsa(".search-tabs button", box).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activePurpose = btn.dataset.purpose;
    });
  });

  box.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(box);
    const params = new URLSearchParams();
    params.set("purpose", activePurpose);
    for (const [key, val] of data.entries()) {
      if (val && val !== "Any") params.set(key, val);
    }
    window.location.href = `properties.html?${params.toString()}`;
  });
}

/* ---------------------------------------------------------------------- */
/* Popular Delhi Area cards → filter link                                 */
/* ---------------------------------------------------------------------- */
function initAreaLinks() {
  qsa("[data-area-link]").forEach(el => {
    el.setAttribute("href", `properties.html?location=${encodeURIComponent(el.dataset.areaLink)}`);
  });
}

/* ---------------------------------------------------------------------- */
/* Featured properties (home page)                                        */
/* ---------------------------------------------------------------------- */
function renderFeatured(containerSelector, count = 6) {
  const el = qs(containerSelector);
  if (!el) return;
  const featured = PROPERTIES.filter(p => p.featured).slice(0, count);
  const list = featured.length >= count ? featured : PROPERTIES.slice(0, count);
  renderGrid(el, list);
}

/* ---------------------------------------------------------------------- */
/* Property details page                                                  */
/* ---------------------------------------------------------------------- */
let currentGalleryIndex = 0;
let currentGalleryImages = [];

function initPropertyDetails() {
  const wrap = qs("#propertyDetailsRoot");
  if (!wrap) return;

  const id = parseInt(getQueryParam("id"), 10);
  const property = PROPERTIES.find(p => p.id === id) || PROPERTIES[0];
  currentGalleryImages = property.gallery && property.gallery.length ? property.gallery : [property.image];
  currentGalleryIndex = 0;

  document.title = `${property.title} | Delhi Properties`;
  const metaDesc = qs('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", `${property.title} in ${property.location}, Delhi — ${property.price}. ${property.description}`);

  const bedsSpec = property.bedrooms > 0 ? `<div class="spec-item"><div class="val">${property.bedrooms}</div><div class="lbl">Bedrooms</div></div>` : "";
  const bathsSpec = property.bathrooms > 0 ? `<div class="spec-item"><div class="val">${property.bathrooms}</div><div class="lbl">Bathrooms</div></div>` : "";

  wrap.innerHTML = `
    <div class="breadcrumb" style="margin-bottom:16px;">
      <a href="index.html">Home</a> / <a href="properties.html">Properties</a> / <span>${property.title}</span>
    </div>

    <div class="gallery-main">
      <img id="mainGalleryImg" src="${currentGalleryImages[0]}" alt="${property.title} in ${property.location}" width="1200" height="700" onerror="${imgFallback(property.id)}">
      ${currentGalleryImages.length > 1 ? `
        <button class="gallery-nav prev" id="galPrev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="gallery-nav next" id="galNext" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
      ` : ""}
      <div class="property-badges" style="top:16px; left:16px;">
        ${property.featured ? '<span class="badge badge-featured">Featured</span>' : ""}
        <span class="badge ${property.purpose === "Buy" ? "badge-buy" : "badge-rent"}">${property.purpose === "Buy" ? "For Sale" : "For Rent"}</span>
      </div>
    </div>
    ${currentGalleryImages.length > 1 ? `
    <div class="gallery-thumbs" id="galThumbs">
      ${currentGalleryImages.map((img, i) => `<img src="${img}" data-index="${i}" class="${i === 0 ? "active" : ""}" alt="Photo ${i + 1} of ${property.title}" loading="lazy" onerror="${imgFallback(property.id)}">`).join("")}
    </div>` : ""}

    <div class="details-grid">
      <div class="details-main">
        <h1 style="margin-top:28px;">${property.title}</h1>
        <div class="property-loc" style="font-size:1rem; margin-bottom: 10px;"><i class="fa-solid fa-location-dot"></i> ${property.location}, Delhi</div>
        <span class="badge-soft">${property.propertyType}</span>
        <span class="badge-soft">${property.furnished}</span>

        <div class="spec-grid">
          ${bedsSpec}
          ${bathsSpec}
          <div class="spec-item"><div class="val">${property.size}</div><div class="lbl">Sq Ft Area</div></div>
          <div class="spec-item"><div class="val">${property.furnished}</div><div class="lbl">Furnishing</div></div>
          <div class="spec-item"><div class="val">${property.propertyType}</div><div class="lbl">Property Type</div></div>
          <div class="spec-item"><div class="val">${property.purpose === "Buy" ? "For Sale" : "For Rent"}</div><div class="lbl">Purpose</div></div>
        </div>

        <h3>Description</h3>
        <p>${property.description} This property is located in ${property.location}, one of Delhi's well-connected residential and commercial pockets, with easy access to local markets, schools and public transport.</p>

        <h3>Amenities &amp; Features</h3>
        <ul class="amenity-list">
          ${property.amenities.map(a => `<li><i class="fa-solid fa-circle-check"></i> ${a}</li>`).join("")}
        </ul>
      </div>

      <aside class="sidebar-card">
        <div class="price">${property.price}</div>
        <div class="text-muted" style="font-size:.88rem;">${property.purpose === "Buy" ? "All-inclusive price" : "Per month + maintenance as applicable"}</div>
        <div class="agent">
          <div class="av"><i class="fa-solid fa-user-tie"></i></div>
          <div>
            <div style="font-weight:600; color:var(--indigo);">Delhi Properties Team</div>
            <div class="text-muted" style="font-size:.82rem;">Verified Local Dealer</div>
          </div>
        </div>
        <div class="stack">
          <a class="btn btn-call btn-block" href="${callLink()}"><i class="fa-solid fa-phone"></i> Call Dealer</a>
          <a class="btn btn-whatsapp btn-block" href="${whatsappLink(property)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp Dealer</a>
          <button class="btn btn-outline btn-block" id="openEnquiry"><i class="fa-regular fa-envelope"></i> Send Enquiry</button>
        </div>
        <div class="divider"></div>
        <form id="enquiryForm">
          <div class="alert-success" id="enquirySuccess"><i class="fa-solid fa-circle-check"></i> Thank you! Your enquiry has been noted. Our team will contact you shortly.</div>
          <div class="form-group">
            <label for="eqName">Your Name</label>
            <input type="text" id="eqName" name="name" required>
            <span class="error-msg">Please enter your name.</span>
          </div>
          <div class="form-group">
            <label for="eqPhone">Phone Number</label>
            <input type="tel" id="eqPhone" name="phone" required pattern="^[6-9]\\d{9}$" placeholder="10-digit mobile number">
            <span class="error-msg">Please enter a valid 10-digit phone number.</span>
          </div>
          <div class="form-group">
            <label for="eqMsg">Message</label>
            <textarea id="eqMsg" name="message" rows="3">I am interested in this property. Please share more details.</textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Send Enquiry</button>
        </form>
      </aside>
    </div>

    <div class="divider"></div>
    <h2>Similar Properties in ${property.location}</h2>
    <div class="grid-3" id="similarGrid"></div>
  `;

  // Gallery interactions
  const mainImg = qs("#mainGalleryImg");
  function updateGallery(i) {
    currentGalleryIndex = (i + currentGalleryImages.length) % currentGalleryImages.length;
    mainImg.src = currentGalleryImages[currentGalleryIndex];
    qsa("#galThumbs img").forEach((t, idx) => t.classList.toggle("active", idx === currentGalleryIndex));
  }
  const prevBtn = qs("#galPrev"), nextBtn = qs("#galNext");
  if (prevBtn) prevBtn.addEventListener("click", () => updateGallery(currentGalleryIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateGallery(currentGalleryIndex + 1));
  qsa("#galThumbs img").forEach(t => t.addEventListener("click", () => updateGallery(parseInt(t.dataset.index, 10))));
  if (mainImg) mainImg.addEventListener("click", () => openLightbox(currentGalleryImages, currentGalleryIndex));

  // Enquiry form
  const enquiryForm = qs("#enquiryForm");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", e => {
      e.preventDefault();
      if (validateForm(enquiryForm)) {
        qs("#enquirySuccess").classList.add("show");
        enquiryForm.reset();
        qs("#eqMsg").value = "I am interested in this property. Please share more details.";
      }
    });
  }
  const openEnquiryBtn = qs("#openEnquiry");
  if (openEnquiryBtn) openEnquiryBtn.addEventListener("click", () => qs("#eqName").focus());

  // Similar properties
  const similar = PROPERTIES.filter(p => p.location === property.location && p.id !== property.id).slice(0, 3);
  renderGrid(qs("#similarGrid"), similar.length ? similar : PROPERTIES.filter(p => p.id !== property.id).slice(0, 3));
}

/* ---------------------------------------------------------------------- */
/* Lightbox                                                                */
/* ---------------------------------------------------------------------- */
function openLightbox(images, startIndex) {
  let lb = qs("#lightbox");
  if (!lb) {
    lb = document.createElement("div");
    lb.id = "lightbox";
    lb.className = "lightbox";
    lb.innerHTML = `
      <button class="close" aria-label="Close gallery"><i class="fa-solid fa-xmark"></i></button>
      <button class="lb-nav prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
      <img id="lbImg" src="" alt="Property photo">
      <button class="lb-nav next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
    `;
    document.body.appendChild(lb);
    qs(".close", lb).addEventListener("click", closeLightbox);
    lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
    qs(".lb-nav.prev", lb).addEventListener("click", () => stepLightbox(-1));
    qs(".lb-nav.next", lb).addEventListener("click", () => stepLightbox(1));
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
  }
  currentGalleryImages = images;
  currentGalleryIndex = startIndex || 0;
  qs("#lbImg", lb).src = currentGalleryImages[currentGalleryIndex];
  lb.classList.add("open");
}
function stepLightbox(dir) {
  currentGalleryIndex = (currentGalleryIndex + dir + currentGalleryImages.length) % currentGalleryImages.length;
  qs("#lbImg").src = currentGalleryImages[currentGalleryIndex];
}
function closeLightbox() {
  const lb = qs("#lightbox");
  if (lb) lb.classList.remove("open");
}

/* ---------------------------------------------------------------------- */
/* Form validation (generic, used by Sell + Contact forms)                */
/* ---------------------------------------------------------------------- */
function validateForm(form) {
  let valid = true;
  qsa("[required]", form).forEach(field => {
    const group = field.closest(".form-group") || field.parentElement;
    let fieldValid = field.value.trim() !== "";
    if (field.type === "email" && fieldValid) {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    }
    if (field.hasAttribute("pattern") && fieldValid) {
      fieldValid = new RegExp(field.getAttribute("pattern")).test(field.value.trim());
    }
    if (group) group.classList.toggle("has-error", !fieldValid);
    if (!fieldValid) valid = false;
  });
  return valid;
}

function initGenericForm(formSelector, successSelector) {
  const form = qs(formSelector);
  const success = qs(successSelector);
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (validateForm(form)) {
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Stats count-up (hero)                                                  */
/* ---------------------------------------------------------------------- */
function initCountUp() {
  qsa("[data-countup]").forEach(el => {
    const target = parseInt(el.dataset.countup, 10);
    let started = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          let start = 0;
          const step = Math.max(1, Math.round(target / 40));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { start = target; clearInterval(timer); }
            el.textContent = start + (el.dataset.suffix || "");
          }, 25);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });
}

/* ---------------------------------------------------------------------- */
/* Init everything on DOM ready                                           */
/* ---------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initBackToTop();
  initReveal();
  initHeroSearch();
  initAreaLinks();
  initCountUp();
  qsa('a[data-whatsapp-float]').forEach(el => el.setAttribute("href", whatsappLink()));
});
