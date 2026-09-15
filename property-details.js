/* =============================================================================
   PrimeNest Properties — js/property-details.js
   Renders the full property details view based on the property id in the URL.
   Multi-page mode : property-details.html?id=pn-101
   Single-page mode: #/property/pn-101
   ============================================================================= */
(function (P) {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function pageUrl(k) { return P.IS_SPA ? "#/" + k : k + ".html"; }

  function pageHero(key, title, sub) {
    var imgs = { "property-details": 7031594, buy: 8082328, rent: 31681835 };
    return '<section class="page-hero"><div class="hero-media"><img src="' + P.img(imgs[key] || 7031594, 1920, 900) + '" alt="' + esc(title) + '"></div>' +
      '<div class="hero-veil"></div><div class="container">' +
      '<span class="crumb"><a href="' + pageUrl("home") + '">Home</a> &nbsp;/&nbsp; <a href="' + pageUrl("properties") + '">Properties</a> &nbsp;/&nbsp; ' + esc(sub) + "</span>" +
      "<h1>" + esc(title) + "</h1></div></section>";
  }

  P.renderDetails = function (id) {
    var p = P.getById(id);
    if (!p) {
      return pageHero("property-details", "Property Not Found", "404") +
        '<section class="section"><div class="container"><div class="empty-state">' +
        '<i class="fa-solid fa-house-circle-exclamation"></i><h3>Sorry, we could not find that property</h3>' +
        "<p>The listing may have been sold, rented out or removed from our books.</p>" +
        '<a class="btn btn-gold mt-2" href="' + pageUrl("properties") + '">Browse All Properties</a></div></div></section>';
    }
    var agent = P.agentById(p.agent);
    document.title = p.title + " | PrimeNest Properties";

    var specs = [
      { i: "fa-bed", l: "Bedrooms", v: p.bedrooms ? p.bedrooms : "—" },
      { i: "fa-bath", l: "Bathrooms", v: p.bathrooms ? p.bathrooms : "—" },
      { i: "fa-vector-square", l: "Built-up Area", v: P.areaLabel(p) },
      { i: "fa-building", l: "Property Type", v: p.type },
      { i: p.status === "rent" ? "fa-key" : "fa-tag", l: "Availability", v: p.status === "rent" ? "For Rent" : "For Sale" },
      { i: "fa-compass", l: "Facing", v: p.facing },
      { i: "fa-couch", l: "Furnishing", v: p.furnishing },
      { i: "fa-stairs", l: "Floor", v: p.floor },
      { i: "fa-calendar-check", l: "Possession", v: p.possession },
      { i: "fa-car", l: "Parking", v: p.parking },
      { i: "fa-hourglass-half", l: "Age of Property", v: p.age },
      { i: "fa-city", l: "City", v: p.city }
    ];

    return pageHero("property-details", p.title, p.id) +

      '<section class="section"><div class="container"><div class="row g-4">' +
      /* ---------- LEFT COLUMN ---------- */
      '<div class="col-lg-8">' +
        '<div class="gallery-main reveal">' +
          '<img id="galMain" src="' + P.img(p.images[0], 1200, 720) + '" alt="' + esc(p.title) + " — " + esc(p.location) + '">' +
          '<div class="badge-wrap">' +
            (p.featured ? '<span class="badge-soft badge-featured"><i class="fa-solid fa-star"></i> Featured</span>' : "") +
            '<span class="badge-soft ' + (p.status === "rent" ? "badge-status-rent" : "badge-status-buy") + '">' + (p.status === "rent" ? "For Rent" : "For Sale") + "</span>" +
            '<span class="badge-soft badge-type">' + esc(p.type) + "</span></div>" +
          '<button class="gal-nav prev" id="galPrev" type="button" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>' +
          '<button class="gal-nav next" id="galNext" type="button" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>' +
          '<span class="gal-count"><i class="fa-regular fa-images me-1"></i><span id="galCount">1</span> / ' + p.images.length + "</span>" +
        "</div>" +
        '<div class="thumbs" id="galThumbs">' + p.images.map(function (im, i) {
          return '<img src="' + P.img(im, 400, 300) + '" data-i="' + i + '" class="' + (i ? "" : "active") + '" alt="' + esc(p.title) + " photo " + (i + 1) + '" loading="lazy">';
        }).join("") + "</div>" +

        '<div class="detail-block mt-4 reveal"><div class="d-flex flex-wrap justify-content-between align-items-start gap-3">' +
          "<div><h2 style=\"margin-bottom:6px\">" + esc(p.title) + "</h2>" +
          '<p class="mb-2"><i class="fa-solid fa-location-dot text-gold me-2"></i>' + esc(p.location) + "</p>" +
          '<div class="d-flex flex-wrap gap-2">' +
            '<span class="tag-pill"><i class="fa-solid fa-layer-group text-gold"></i> Ref ID: ' + esc(p.id.toUpperCase()) + "</span>" +
            '<span class="tag-pill"><i class="fa-solid fa-building text-gold"></i> ' + esc(p.type) + "</span>" +
            '<span class="tag-pill"><i class="fa-solid fa-clock text-gold"></i> Updated today</span></div></div>' +
          '<div class="text-lg-end"><div style="font-size:.74rem;letter-spacing:2px;text-transform:uppercase;color:#8b95a6;font-weight:700">' +
            (p.status === "rent" ? "Rent" : "Price") + '</div><div class="font-display" style="font-size:2rem;color:var(--gold-dark)">' + P.priceLong(p) + "</div></div>" +
        "</div></div>" +

        '<div class="detail-block reveal"><h2><i class="fa-solid fa-ruler-combined"></i> Property Overview</h2>' +
          '<div class="spec-grid">' + specs.map(function (s) {
            return '<div class="spec-item"><i class="fa-solid ' + s.i + '"></i><b>' + esc(s.v) + "</b><span>" + esc(s.l) + "</span></div>";
          }).join("") + "</div></div>" +

        '<div class="detail-block reveal"><h2><i class="fa-solid fa-circle-info"></i> Description</h2>' +
          '<p class="mb-0">' + esc(p.description) + "</p></div>" +

        '<div class="detail-block reveal"><h2><i class="fa-solid fa-star"></i> Features</h2>' +
          '<ul class="check-list" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">' +
          p.features.map(function (f) { return '<li><i class="fa-solid fa-circle-check"></i>' + esc(f) + "</li>"; }).join("") + "</ul></div>" +

        '<div class="detail-block reveal"><h2><i class="fa-solid fa-sliders"></i> Amenities</h2>' +
          '<ul class="amen-list">' + p.amenities.map(function (a) {
            return '<li><i class="fa-solid fa-check"></i>' + esc(a) + "</li>";
          }).join("") + "</ul></div>" +

        '<div class="detail-block reveal"><h2><i class="fa-solid fa-map-location-dot"></i> Nearby Locations</h2>' +
          '<ul class="near-list">' + p.nearby.map(function (n) {
            return "<li><span style='color:var(--navy-800);font-weight:600'><i class=\"fa-solid fa-location-dot text-gold me-2\"></i>" + esc(n[0]) + "</span><span>" + esc(n[1]) + "</span></li>";
          }).join("") + "</ul>" +
          '<div class="map-frame mt-4"><iframe title="Location map for ' + esc(p.title) + '" src="https://www.google.com/maps?q=' + encodeURIComponent(p.location) + '&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>' +

        '<div class="detail-block reveal"><h2><i class="fa-solid fa-paper-plane"></i> Enquire About This Property</h2>' +
          '<div class="alert-success-custom mb-3" id="pd-ok"><i class="fa-solid fa-circle-check fa-lg text-gold"></i><div><b>Thank you! Your enquiry has been sent.</b><br>' +
          '<small>Our advisor will call you shortly. For an instant reply, WhatsApp us on <a href="' + P.waProperty(p) + '" target="_blank" rel="noopener" style="color:#128c4a;font-weight:700">' + P.CONFIG.phoneDisplay + "</a>.</small></div></div>" +
          '<form id="pdForm" novalidate><div class="row g-3">' +
            '<div class="col-md-6"><label class="form-label" for="pd-name">Full Name *</label><input class="form-control" id="pd-name" placeholder="Your name"><span class="err">Please enter your full name.</span></div>' +
            '<div class="col-md-6"><label class="form-label" for="pd-phone">Phone Number *</label><input class="form-control" id="pd-phone" inputmode="numeric" placeholder="10 digit mobile number"><span class="err">Enter a valid 10 digit mobile number.</span></div>' +
            '<div class="col-md-6"><label class="form-label" for="pd-email">Email Address *</label><input type="email" class="form-control" id="pd-email" placeholder="you@example.com"><span class="err">Enter a valid email address.</span></div>' +
            '<div class="col-md-6"><label class="form-label" for="pd-intent">I want to</label><select class="form-select" id="pd-intent">' +
              (p.status === "rent" ? '<option>Rent this property</option><option>Get more photos &amp; details</option><option>Negotiate the rent</option>' : '<option>Buy this property</option><option>Get more photos &amp; details</option><option>Negotiate the price</option><option>Arrange a site visit</option>') +
              "</select></div>" +
            '<div class="col-12"><label class="form-label" for="pd-msg">Message *</label><textarea class="form-control" id="pd-msg" rows="4">Hello, I am interested in ' + esc(p.title) + " listed at " + P.priceLabel(p) + ". Please share more details about this property.</textarea><span class=\"err\">Please add a short message (min 10 characters).</span></div>" +
            '<div class="col-12 d-flex flex-wrap gap-2"><button class="btn btn-gold btn-lg" type="submit"><i class="fa-solid fa-paper-plane me-2"></i>Send Enquiry</button>' +
            '<a class="btn btn-wa btn-lg" href="' + P.waProperty(p) + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>WhatsApp Enquiry</a>' +
            '<a class="btn btn-call btn-lg" href="' + P.tel() + '"><i class="fa-solid fa-phone me-2"></i>' + P.CONFIG.phoneDisplay + "</a></div>" +
          "</div></form></div>" +
      "</div>" +

      /* ---------- RIGHT COLUMN (STICKY) ---------- */
      '<div class="col-lg-4"><div class="sticky-card">' +
        '<div class="price-box mb-3 reveal right"><div class="d-flex justify-content-between align-items-start">' +
          "<div><div class='lbl'>" + (p.status === "rent" ? "Monthly Rent" : "Asking Price") + '</div><div class="amt">' + P.priceLabel(p) +
          (p.status === "rent" ? "<small>/month</small>" : "") + "</div>" +
          "<p style='font-size:.84rem;margin:8px 0 0;opacity:.75'>" + P.areaLabel(p) + (p.bedrooms ? " • " + p.bedrooms + " BHK" : "") + "</p></div>" +
          '<span class="badge-soft ' + (p.status === "rent" ? "badge-status-rent" : "badge-featured") + '">' + (p.status === "rent" ? "Rent" : "Sale") + "</span></div>" +
          '<hr style="border-color:rgba(255,255,255,.14);margin:18px 0">' +
          '<div class="d-grid gap-2">' +
            '<a class="btn btn-wa" href="' + P.waProperty(p) + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>WhatsApp Enquiry</a>' +
            '<a class="btn btn-gold" href="' + P.tel() + '"><i class="fa-solid fa-phone me-2"></i>Call ' + P.CONFIG.phoneDisplay + "</a>" +
            '<a class="btn btn-gold-light" href="#pdForm"><i class="fa-regular fa-calendar me-2"></i>Arrange Site Visit</a></div></div>' +

        '<div class="agent-card mb-3 reveal right d1"><img src="' + P.img(agent.photo, 300, 300) + '" alt="' + esc(agent.name) + " — " + esc(agent.role) + '">' +
          "<h3 style=\"font-size:1.05rem;margin-bottom:2px\">" + esc(agent.name) + "</h3>" +
          '<div class="role" style="font-size:.74rem;letter-spacing:1.4px;text-transform:uppercase;color:var(--gold-dark);font-weight:800">' + esc(agent.role) + "</div>" +
          '<p style="font-size:.87rem;margin:12px 0">' + esc(agent.bio) + "</p>" +
          '<div class="row g-2 text-center mb-3"><div class="col-4"><div class="spec-item" style="padding:10px 6px"><b style="font-size:.95rem">' + esc(agent.exp) + '</b><span>Exp.</span></div></div>' +
          '<div class="col-4"><div class="spec-item" style="padding:10px 6px"><b style="font-size:.95rem">' + esc(agent.deals) + '</b><span>Deals</span></div></div>' +
          '<div class="col-4"><div class="spec-item" style="padding:10px 6px"><b style="font-size:.95rem">4.9</b><span>Rating</span></div></div></div>' +
          '<div class="d-grid gap-2">' +
            '<a class="btn btn-navy btn-sm" href="' + P.tel() + '"><i class="fa-solid fa-phone me-2"></i>' + P.CONFIG.phoneDisplay + "</a>" +
            '<a class="btn btn-wa btn-sm" href="' + P.wa("Hello " + agent.name + ", I am interested in " + p.title + ". Please share more details about this property.") + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>WhatsApp Agent</a>' +
            '<a class="btn btn-call btn-sm" href="mailto:' + agent.email + '"><i class="fa-regular fa-envelope me-2"></i>' + esc(agent.email) + "</a></div></div>" +

        '<div class="detail-block reveal right d2"><h2 style="font-size:1.05rem"><i class="fa-solid fa-share-nodes"></i> Property Snapshot</h2>' +
          '<ul class="near-list">' +
          "<li><span>Reference ID</span><span style='color:var(--navy-800)'>" + esc(p.id.toUpperCase()) + "</span></li>" +
          "<li><span>Listed By</span><span style='color:var(--navy-800)'>PrimeNest Properties</span></li>" +
          "<li><span>Availability</span><span style='color:var(--navy-800)'>" + esc(p.possession) + "</span></li>" +
          "<li><span>Furnishing</span><span style='color:var(--navy-800)'>" + esc(p.furnishing) + "</span></li>" +
          "</ul>" +
          '<div class="d-flex flex-wrap gap-2 mt-3">' +
            '<a class="btn btn-outline-navy btn-sm" id="shareBtn" href="#"><i class="fa-solid fa-share-nodes me-2"></i>Share</a>' +
            '<a class="btn btn-outline-navy btn-sm" href="' + P.waProperty(p) + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>Send to Me</a></div></div>' +
      "</div></div>" +

      "</div></div></section>" +

      '<section class="section bg-soft"><div class="container">' +
        P.sectionHead("You May Also Like", "Similar Properties", "Handpicked options that match this property's type, budget and location.", true) +
        '<div class="row g-4" id="similarGrid"></div></div></section>';
  };

  P.bindDetails = function (id) {
    var p = P.getById(id);
    if (!p) return;
    var imgs = p.images;
    var main = $("#galMain"), count = $("#galCount");
    var cur = 0;

    function show(i) {
      cur = (i + imgs.length) % imgs.length;
      if (main) {
        main.style.opacity = "0";
        setTimeout(function () {
          main.src = P.img(imgs[cur], 1200, 720);
          main.alt = p.title + " — photo " + (cur + 1);
          main.style.opacity = "1";
        }, 130);
      }
      if (count) count.textContent = String(cur + 1);
      $$("#galThumbs img").forEach(function (t) { t.classList.toggle("active", +t.getAttribute("data-i") === cur); });
    }
    if (main) main.style.transition = "opacity .25s ease";
    var prev = $("#galPrev"), next = $("#galNext");
    if (prev) prev.addEventListener("click", function () { show(cur - 1); });
    if (next) next.addEventListener("click", function () { show(cur + 1); });
    $$("#galThumbs img").forEach(function (t) {
      t.addEventListener("click", function () { show(+t.getAttribute("data-i")); });
      t.setAttribute("data-zoom", imgs.map(function (im) { return P.img(im, 1600, 1000); }).join("|"));
      t.setAttribute("data-index", t.getAttribute("data-i"));
    });
    if (main) {
      main.setAttribute("data-zoom", imgs.map(function (im) { return P.img(im, 1600, 1000); }).join("|"));
      main.setAttribute("data-index", "0");
      main.style.cursor = "zoom-in";
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });

    var share = $("#shareBtn");
    if (share) share.addEventListener("click", function (e) {
      e.preventDefault();
      var url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: p.title, text: p.title + " — " + P.priceLabel(p), url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        P.toast("Property link copied to clipboard");
      } else { P.toast("Copy this page URL to share"); }
    });

    P.renderCards("#similarGrid", P.similar(p, 3));

    /* enquiry form */
    (function () {
      var form = $("#pdForm");
      if (!form) return;
      var rules = {
        name: function (v) { return v.trim().length >= 3; },
        phone: function (v) { return /^[6-9]\d{9}$/.test(v.replace(/\D/g, "").slice(-10)); },
        email: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); },
        msg: function (v) { return v.trim().length >= 10; }
      };
      Object.keys(rules).forEach(function (k) {
        var el = $("#pd-" + k);
        if (!el) return;
        el.addEventListener("blur", function () { chk(el, k); });
        el.addEventListener("input", function () { if (el.classList.contains("is-invalid")) chk(el, k); });
      });
      function chk(el, k) {
        var ok = rules[k](el.value || "");
        el.classList.toggle("is-invalid", !ok);
        var err = el.parentElement.querySelector(".err");
        if (err) err.classList.toggle("show", !ok);
        return ok;
      }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true, first = null;
        Object.keys(rules).forEach(function (k) {
          var el = $("#pd-" + k);
          if (!el) return;
          if (!chk(el, k)) { ok = false; if (!first) first = el; }
        });
        if (!ok) { if (first) first.focus(); P.toast("Please correct the highlighted fields.", "fa-triangle-exclamation"); return; }
        var box = $("#pd-ok");
        if (box) box.classList.add("show");
        form.reset();
        $("#pd-msg").value = "Hello, I am interested in " + p.title + ". Please share more details about this property.";
        P.toast("Enquiry sent — our advisor will call you soon!");
        if (box) box.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    })();

    if (window.P && window.PRIME && typeof P.reveal === "function") P.reveal();
  };
})(window.PRIME);
