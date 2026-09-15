/* =============================================================================
   PrimeNest Properties — js/main.js
   Navigation, page rendering, search & filtering, forms, animations.
   Works in two modes without any change:
     • Multi-page mode  (real .html files → GitHub Pages)
     • Single-page mode (hash router, used when body has no data-page)
   ============================================================================= */
(function (P) {
  "use strict";

  var C = P.CONFIG;
  var IS_SPA = !(document.body && document.body.getAttribute("data-page"));
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------- ROUTING */
  function pageUrl(key) { return IS_SPA ? "#/" + key : key + ".html"; }
  function detailUrl(id) { return IS_SPA ? "#/property/" + id : "property-details.html?id=" + id; }

  function buildQuery(params) {
    var parts = [];
    Object.keys(params || {}).forEach(function (k) {
      var v = params[k];
      if (v !== "" && v !== null && v !== undefined) parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
    });
    return parts.join("&");
  }
  function go(page, params) {
    var q = buildQuery(params);
    if (IS_SPA) {
      var target = "#/" + page + (q ? "?" + q : "");
      if (location.hash === target) { render(); window.scrollTo(0, 0); } else location.hash = target;
    } else {
      window.location.href = page + ".html" + (q ? "?" + q : "");
    }
  }
  function getQuery() {
    var qs = "";
    if (IS_SPA) {
      var h = location.hash, i = h.indexOf("?");
      qs = i >= 0 ? h.slice(i + 1) : "";
    } else { qs = location.search.replace(/^\?/, ""); }
    var out = {};
    qs.split("&").forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split("=");
      out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
    });
    return out;
  }
  function currentRoute() {
    if (!IS_SPA) return { page: document.body.getAttribute("data-page"), params: getQuery() };
    var h = location.hash.replace(/^#\/?/, "");
    var i = h.indexOf("?");
    var path = (i >= 0 ? h.slice(0, i) : h) || "home";
    var seg = path.split("/");
    if (seg[0] === "property" && seg[1]) return { page: "property-details", params: { id: seg[1] } };
    return { page: seg[0], params: getQuery() };
  }
  P.pageUrl = pageUrl; P.detailUrl = detailUrl; P.go = go;
  P.IS_SPA = IS_SPA;

  /* ------------------------------------------------------- TINY COMPONENTS */
  var TITLES = {
    home: "PrimeNest Properties | Buy, Sell & Rent Premium Property in India",
    properties: "All Properties For Sale & Rent | PrimeNest Properties",
    "property-details": "Property Details | PrimeNest Properties",
    buy: "Buy Property — Apartments, Villas & Plots | PrimeNest Properties",
    rent: "Rent Property — Homes, Offices & Shops | PrimeNest Properties",
    services: "Our Real Estate Services | PrimeNest Properties",
    about: "About PrimeNest Properties | Trusted Property Advisors Since 2009",
    contact: "Contact Us | PrimeNest Properties"
  };
  function setTitle(key, sub) {
    var t = TITLES[key] || TITLES.home;
    if (sub) t = sub + " | PrimeNest Properties";
    document.title = t;
  }

  function navLink(key, label) {
    var route = currentRoute();
    var active = route.page === key || (key === "properties" && route.page === "property-details");
    return '<li><a href="' + pageUrl(key) + '" class="' + (active ? "active" : "") + '">' + label + "</a></li>";
  }

  function renderNav() {
    var host = $("#prime-nav");
    if (!host) return;
    host.innerHTML =
      '<div class="pn-topbar d-none d-lg-block"><div class="container"><div class="d-flex justify-content-between align-items-center py-2">' +
        '<div class="d-flex align-items-center gap-4"><span><i class="fa-solid fa-location-dot text-gold me-2"></i>' + esc(C.address) + "</span>" +
        '<span class="hide-sm"><i class="fa-regular fa-clock text-gold me-2"></i>Mon–Sat: 9:30 AM – 7:30 PM</span></div>' +
        '<div class="d-flex align-items-center gap-3"><a href="' + P.tel() + '" class="fw-600"><i class="fa-solid fa-phone-volume text-gold me-2"></i>' + C.phoneDisplay + "</a>" +
        '<span class="hide-sm d-flex gap-2">' + C.social.map(function (s) {
          return '<a class="soc" href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '"><i class="' + s.icon + '"></i></a>';
        }).join("") + "</span></div></div></div></div>" +
      '<nav class="pn-nav" id="pnNav"><div class="container">' +
        '<div class="d-flex align-items-center justify-content-between" style="min-height:84px">' +
          '<a class="brand" href="' + pageUrl("home") + '" aria-label="PrimeNest Properties home">' +
            '<span class="brand-mark"><i class="fa-solid fa-house-signal"></i></span>' +
            '<span class="brand-text"><span class="brand-name">PrimeNest</span><span class="brand-sub">Properties</span></span></a>' +
          '<div class="d-flex align-items-center gap-3">' +
            '<ul class="pn-menu" id="pnMenu">' +
              '<li><button class="menu-close" type="button" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button></li>' +
              navLink("home", "Home") + navLink("properties", "Properties") + navLink("buy", "Buy") +
              navLink("rent", "Rent") + navLink("services", "Services") + navLink("about", "About") +
              navLink("contact", "Contact") +
              '<li class="menu-cta d-xl-none"><a class="btn btn-gold w-100" href="' + pageUrl("contact") + '?intent=list">List Your Property</a></li>' +
            "</ul>" +
            '<a class="btn btn-gold btn-sm d-none d-xl-inline-flex align-items-center gap-2" href="' + pageUrl("contact") + '?intent=list"><i class="fa-solid fa-plus"></i> List Your Property</a>' +
            '<button class="nav-toggle" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>' +
          "</div></div></div></nav>" +
      '<div class="nav-backdrop" id="navBackdrop"></div>';
  }

  function renderFooter() {
    var host = $("#prime-footer");
    if (!host) return;
    host.innerHTML =
      '<div class="container"><div class="row g-5">' +
        '<div class="col-lg-4 col-md-6">' +
          '<a class="brand mb-3" href="' + pageUrl("home") + '"><span class="brand-mark"><i class="fa-solid fa-house-signal"></i></span>' +
          '<span class="brand-text"><span class="brand-name" style="color:#fff">PrimeNest</span><span class="brand-sub">Properties</span></span></a>' +
          '<p class="mt-3" style="font-size:.93rem">A RERA-registered property advisory helping families and investors buy, sell, rent and manage real estate across six Indian cities — with verified listings and honest advice since 2009.</p>' +
          '<div class="f-social">' + C.social.map(function (s) {
            return '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '"><i class="' + s.icon + '"></i></a>';
          }).join("") + "</div>" +
        "</div>" +
        '<div class="col-lg-2 col-md-6 col-6"><h5>Explore</h5><ul>' +
          ["properties|Properties", "buy|Buy Property", "rent|Rent Property", "services|Services", "about|About Us", "contact|Contact"].map(function (r) {
            var kv = r.split("|"); return '<li><a href="' + pageUrl(kv[0]) + '">' + kv[1] + "</a></li>";
          }).join("") + "</ul></div>" +
        '<div class="col-lg-3 col-md-6 col-12"><h5>Property Types</h5><ul>' +
          P.CATEGORIES.map(function (cat) {
            return '<li><a href="' + pageUrl("properties") + "?type=" + encodeURIComponent(cat.type) + '">' + esc(cat.name) + "</a></li>";
          }).join("") + "</ul></div>" +
        '<div class="col-lg-3 col-md-6"><h5>Get in Touch</h5>' +
          '<ul><li><a href="' + P.tel() + '"><i class="fa-solid fa-phone me-2 text-gold"></i>' + C.phoneDisplay + "</a></li>" +
          '<li><a href="' + P.wa() + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2 text-gold"></i>WhatsApp Enquiry</a></li>' +
          '<li><a href="mailto:' + C.email + '"><i class="fa-regular fa-envelope me-2 text-gold"></i>' + C.email + "</a></li>" +
          '<li><span style="font-size:.9rem"><i class="fa-solid fa-location-dot me-2 text-gold"></i>' + esc(C.address) + "</span></li></ul>" +
          '<form class="news-box" id="newsForm" novalidate><input type="email" id="newsEmail" placeholder="Your email address" aria-label="Email address"><button type="submit" aria-label="Subscribe"><i class="fa-solid fa-paper-plane"></i></button></form>' +
          '<small style="font-size:.76rem;opacity:.6">Market updates. No spam, ever.</small>' +
        "</div></div>" +
      '<div class="f-bottom"><div class="container d-flex flex-wrap justify-content-between gap-2 px-0">' +
        '<span>© ' + new Date().getFullYear() + " " + C.brand + ". All rights reserved. RERA Reg. No. RC/GGM/2009/04.</span>" +
        '<span class="d-flex gap-3"><a href="' + pageUrl("about") + '">About</a><a href="' + pageUrl("contact") + '">Contact</a><a href="' + P.wa() + '" target="_blank" rel="noopener">WhatsApp</a></span>' +
      "</div></div></div>";
  }

  function renderFabs() {
    if ($("#pnFabs")) return;
    var d = document.createElement("div");
    d.className = "fab-stack"; d.id = "pnFabs";
    d.innerHTML =
      '<a class="fab fab-wa" href="' + P.wa() + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
      '<a class="fab fab-call d-sm-none" href="' + P.tel() + '" aria-label="Call us"><i class="fa-solid fa-phone"></i></a>' +
      '<button class="fab fab-top" id="backToTop" type="button" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>';
    document.body.appendChild(d);
    var lb = document.createElement("div");
    lb.className = "pn-lightbox"; lb.id = "pnLightbox";
    lb.innerHTML = '<button class="lb-btn lb-close" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<img src="" alt="Property gallery image">' +
      '<button class="lb-btn lb-next" type="button" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>';
    document.body.appendChild(lb);
    var t = document.createElement("div");
    t.className = "toast-box"; t.id = "pnToast";
    document.body.appendChild(t);
  }

  /* ----------------------------------------------------------- UI HELPERS */
  var toastTimer;
  function toast(msg, icon) {
    var t = $("#pnToast");
    if (!t) return;
    t.innerHTML = '<i class="fa-solid ' + (icon || "fa-circle-check") + ' text-gold"></i><span>' + esc(msg) + "</span>";
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }
  P.toast = toast;

  function reveal() {
    var items = $$(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window)) { items.forEach(function (e) { e.classList.add("visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (e) { io.observe(e); });
  }
  P.reveal = reveal;

  function counters() {
    var els = $$("[data-count]");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.textContent = (+e.getAttribute("data-count")).toLocaleString("en-IN"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = +el.getAttribute("data-count"), start = performance.now(), dur = 1500;
        function step(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(target * eased).toLocaleString("en-IN");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* --------------------------------------------------- PROPERTY CARD VIEW */
  P.propCard = function (p, idx) {
    var d = idx % 4;
    return '<article class="prop-card reveal d' + d + '" itemprop="makesOffer">' +
      '<div class="prop-media">' +
        '<img src="' + P.img(p.images[0], 760, 520) + '" alt="' + esc(p.title) + " in " + esc(p.location) + '" loading="lazy">' +
        '<div class="prop-tags">' +
          (p.featured ? '<span class="badge-soft badge-featured"><i class="fa-solid fa-star"></i> Featured</span>' : "<span></span>") +
          '<span class="badge-soft ' + (p.status === "rent" ? "badge-status-rent" : "badge-status-buy") + '">' + (p.status === "rent" ? "For Rent" : "For Sale") + "</span>" +
        "</div>" +
        '<div class="prop-price"><b>' + P.priceLabel(p) + "</b>" + (p.status === "rent" ? "" : "") +
          '<div style="font-size:.74rem;opacity:.85;margin-top:2px"><i class="fa-solid fa-city me-1"></i>' + esc(p.city) + "</div></div>" +
        '<div class="prop-quick">' +
          '<a class="wa" href="' + P.waProperty(p) + '" target="_blank" rel="noopener" aria-label="WhatsApp about ' + esc(p.title) + '"><i class="fa-brands fa-whatsapp"></i></a>' +
          '<a href="' + P.tel() + '" aria-label="Call PrimeNest about ' + esc(p.title) + '"><i class="fa-solid fa-phone"></i></a>' +
        "</div>" +
      "</div>" +
      '<div class="prop-body">' +
        '<span class="prop-loc"><i class="fa-solid fa-location-dot"></i> ' + esc(p.location) + "</span>" +
        '<h3 class="prop-title"><a href="' + detailUrl(p.id) + '">' + esc(p.title) + "</a></h3>" +
        '<div class="prop-specs">' +
          (p.bedrooms ? '<span><i class="fa-solid fa-bed"></i>' + p.bedrooms + " Beds</span>" : "") +
          (p.bathrooms ? '<span><i class="fa-solid fa-bath"></i>' + p.bathrooms + " Baths</span>" : "") +
          '<span><i class="fa-solid fa-vector-square"></i>' + p.area.toLocaleString("en-IN") + " sq.ft.</span>" +
          '<span><i class="fa-solid fa-building"></i>' + esc(p.type) + "</span>" +
        "</div>" +
        '<div class="prop-foot">' +
          '<a class="btn btn-navy" href="' + detailUrl(p.id) + '">View Details</a>' +
          '<a class="btn btn-call" style="flex:0 0 46px;justify-content:center;padding:10px 0" href="' + P.tel() + '" aria-label="Call"><i class="fa-solid fa-phone"></i></a>' +
          '<a class="btn btn-wa" style="flex:0 0 46px;justify-content:center;padding:10px 0" href="' + P.waProperty(p) + '" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
        "</div></div></article>";
  };

  P.renderCards = function (selector, list, cols) {
    var host = typeof selector === "string" ? $(selector) : selector;
    if (!host) return;
    if (!list.length) {
      host.innerHTML = '<div class="col-12"><div class="empty-state"><i class="fa-solid fa-house-circle-exclamation"></i>' +
        "<h3>No properties match your filters</h3><p>Try widening your budget or changing the property type — our advisors can also source off-market options.</p>" +
        '<a class="btn btn-gold mt-2" href="' + pageUrl("contact") + '">Request a Custom Search</a></div></div>';
      return;
    }
    host.innerHTML = list.map(function (p, i) {
      return '<div class="' + (cols || "col-lg-4 col-md-6") + '">' + P.propCard(p, i) + "</div>";
    }).join("");
    reveal();
  };

  /* ------------------------------------------------------------- SECTION */
  function sectionHead(eyebrow, title, sub, center, dark) {
    return '<div class="section-head ' + (center ? "center" : "") + ' reveal">' +
      '<span class="eyebrow ' + (center ? "center" : "") + '">' + esc(eyebrow) + "</span>" +
      "<h2" + (dark ? ' style="color:#fff"' : "") + ">" + title + "</h2>" +
      (sub ? "<p>" + sub + "</p>" : "") + "</div>";
  }
  P.sectionHead = sectionHead;

  /* ---------------------------------------------------------- SEARCH FORM */
  function searchFormHTML(id, opts) {
    opts = opts || {};
    var dark = opts.dark !== false;
    var cities = P.cities();
    return '<form class="search-card" id="' + id + '" novalidate>' +
      '<div class="seg-toggle" role="tablist" aria-label="Looking to buy or rent">' +
        '<button type="button" class="active" data-status="buy"><i class="fa-solid fa-key me-1"></i> Buy</button>' +
        '<button type="button" data-status="rent"><i class="fa-solid fa-building-circle-check me-1"></i> Rent</button>' +
      "</div>" +
      '<div class="search-grid">' +
        '<div class="field"><label for="' + id + '-loc">Location</label><i class="fa-solid fa-location-dot ico"></i>' +
          '<input class="pn-control ' + (dark ? "" : "light") + '" list="' + id + '-cities" id="' + id + '-loc" name="loc" placeholder="City, locality or sector">' +
          '<datalist id="' + id + '-cities">' + cities.map(function (c) { return "<option value=\"" + esc(c) + "\">"; }).join("") +
          P.PROPERTIES.map(function (p) { return '<option value="' + esc(p.location) + '">'; }).join("") + "</datalist></div>" +
        '<div class="field"><label for="' + id + '-type">Property Type</label><i class="fa-solid fa-building ico"></i>' +
          '<select class="pn-control ' + (dark ? "" : "light") + '" id="' + id + '-type" name="type"><option value="">Any Type</option>' +
          P.types().map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label for="' + id + '-budget">Budget</label><i class="fa-solid fa-indian-rupee-sign ico"></i>' +
          '<select class="pn-control ' + (dark ? "" : "light") + '" id="' + id + '-budget" name="budget">' +
          '<option value="0-999999999">Any Budget</option>' +
          '<option value="0-5000000">Under ₹50 Lakh</option><option value="5000000-10000000">₹50 L – ₹1 Cr</option>' +
          '<option value="10000000-30000000">₹1 Cr – ₹3 Cr</option><option value="30000000-60000000">₹3 Cr – ₹6 Cr</option>' +
          '<option value="60000000-999999999">Above ₹6 Cr</option></select></div>' +
        '<div class="field"><label for="' + id + '-beds">Bedrooms</label><i class="fa-solid fa-bed ico"></i>' +
          '<select class="pn-control ' + (dark ? "" : "light") + '" id="' + id + '-beds" name="beds"><option value="">Any</option>' +
          '<option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select></div>' +
        '<div class="go"><button class="btn btn-gold btn-lg w-100" type="submit"><i class="fa-solid fa-magnifying-glass me-2"></i>Search Properties</button></div>' +
      "</div></form>";
  }

  function bindSearchForm(id) {
    var f = $("#" + id);
    if (!f) return;
    var status = f.querySelector(".seg-toggle button.active").getAttribute("data-status");
    $$(".seg-toggle button", f).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".seg-toggle button", f).forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active"); status = b.getAttribute("data-status");
      });
    });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var budget = ($("#" + id + "-budget").value || "").split("-");
      go("properties", {
        status: status,
        loc: $("#" + id + "-loc").value.trim(),
        type: $("#" + id + "-type").value,
        min: budget[0] || "", max: budget[1] || "",
        beds: $("#" + id + "-beds").value
      });
    });
  }

  /* ------------------------------------------------------------ HOME PAGE */
  function pageHome() {
    setTitle("home");
    return '<section class="hero" id="home">' +
      '<div class="hero-media"><img src="' + P.img(37853145, 1920, 1080) + '" alt="Aerial view of premium residential towers in an Indian metro city at daytime" fetchpriority="high"></div>' +
      '<div class="hero-veil"></div>' +
      '<div class="container hero-inner"><div class="row"><div class="col-lg-9">' +
        '<div class="hero-badges reveal">' +
          '<span class="hero-badge"><i class="fa-solid fa-circle-check text-gold"></i> RERA Registered Advisor</span>' +
          '<span class="hero-badge"><i class="fa-solid fa-star text-gold"></i> ' + esc(C.raveReviews) + "</span>" +
          '<span class="hero-badge"><i class="fa-solid fa-location-dot text-gold"></i> 6 Cities Across India</span></div>' +
        '<h1 class="reveal d1">Find Your <span class="gd">Perfect Property</span><br>with Trusted Advisors</h1>' +
        '<p class="lead reveal d2">From luxury sky residences in Gurugram to pre-leased offices in BKC — PrimeNest Properties brings you ' + P.PROPERTIES.length + ' hand-verified listings, transparent pricing and complete legal diligence under one roof.</p>' +
        '<div class="hero-actions reveal d3">' +
          '<a class="btn btn-gold btn-lg" href="' + pageUrl("buy") + '"><i class="fa-solid fa-key me-2"></i>Explore Properties</a>' +
          '<a class="btn btn-outline-light btn-lg" href="' + P.wa() + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>WhatsApp ' + C.phoneDisplay + "</a></div>" +
        '<div class="reveal d4">' + searchFormHTML("heroSearch") + "</div>" +
      "</div></div></div></section>" +

      '<section class="section-sm bg-navy"><div class="container"><div class="row g-3">' +
        P.STATS.map(function (s, i) {
          return '<div class="col-6 col-lg-3"><div class="stat-box reveal d' + i + '"><b data-count="' + s.n + '">0</b>' + s.suffix + "<span>" + esc(s.label) + "</span></div></div>";
        }).join("") + "</div></div></section>" +

      '<section class="section"><div class="container">' +
        sectionHead("Handpicked For You", "Featured Properties", "A short list of the finest homes and commercial assets our advisors are recommending this month.", true) +
        '<div class="row g-4" id="featuredGrid"></div>' +
        '<div class="text-center mt-5 reveal"><a class="btn btn-outline-navy btn-lg" href="' + pageUrl("properties") + '">View All ' + P.PROPERTIES.length + " Properties <i class=\"fa-solid fa-arrow-right-long ms-2\"></i></a></div>" +
      "</div></section>" +

      '<section class="section bg-soft"><div class="container">' +
        sectionHead("Browse By Category", "Property Categories", "Eight specialist desks, one accountable team — pick a category and we will take it from there.", true) +
        '<div class="row g-4">' + P.CATEGORIES.map(function (cat, i) {
          return '<div class="col-lg-3 col-md-4 col-sm-6"><a class="cat-card reveal d' + (i % 4) + '" href="' + pageUrl("properties") + "?type=" + encodeURIComponent(cat.type) + '">' +
            '<img src="' + P.img(cat.img, 700, 600) + '" alt="' + esc(cat.name) + " for sale and rent in India\" loading=\"lazy\">" +
            '<span class="veil"></span><span class="cat-ico"><i class="fa-solid ' + cat.icon + '"></i></span>' +
            '<span class="cat-body"><h3>' + esc(cat.name) + '</h3><span class="cat-count">' + P.countByType(cat.type) + " live listing" + (P.countByType(cat.type) === 1 ? "" : "s") + '</span><span class="cat-cta">Explore Properties <i class="fa-solid fa-arrow-right-long"></i></span></span></a></div>';
        }).join("") + "</div></div></section>" +

      '<section class="section"><div class="container">' +
        sectionHead("Where We Operate", "Popular Locations", "Deep on-ground presence in India's most searched residential and commercial micro-markets.", true) +
        '<div class="row g-4">' + P.LOCATIONS.map(function (l, i) {
          return '<div class="col-lg-4 col-md-6"><a class="loc-card reveal d' + (i % 3) + '" href="' + pageUrl("properties") + "?loc=" + encodeURIComponent(l.name) + '">' +
            '<img src="' + P.img(l.img, 800, 560) + '" alt="Properties in ' + esc(l.name) + ', India" loading="lazy"><span class="veil"></span>' +
            '<span class="loc-body"><h3>' + esc(l.name) + "</h3><small>" + esc(l.region) + "</small>" +
            '<div class="d-flex justify-content-between align-items-center mt-2"><span class="loc-price">' + esc(l.avg) + '</span><span style="font-size:.78rem">' + P.countByCity(l.name) + " listings</span></div></span></a></div>";
        }).join("") + "</div></div></section>" +

      '<section class="section bg-navy on-dark"><div class="container">' +
        sectionHead("The PrimeNest Promise", "Why Choose Us", "Sixteen years, one standard: we only recommend what we would buy for our own family.", true, true) +
        '<div class="row g-4">' + P.WHY_US.map(function (w, i) {
          return '<div class="col-lg-4 col-md-6"><div class="feat-card glass reveal d' + (i % 3) + '"><div class="feat-ico"><i class="fa-solid ' + w.icon + '"></i></div>' +
            "<h3>" + esc(w.title) + "</h3><p>" + esc(w.text) + "</p></div></div>";
        }).join("") + "</div></div></section>" +

      '<section class="section"><div class="container">' +
        sectionHead("What We Do", "Our Services", "End-to-end real estate services for buyers, sellers, landlords, tenants and investors.", true) +
        '<div class="row g-4">' + P.SERVICES.slice(0, 6).map(function (s, i) {
          return '<div class="col-lg-4 col-md-6"><div class="feat-card reveal d' + (i % 3) + '"><div class="feat-ico"><i class="fa-solid ' + s.icon + '"></i></div>' +
            "<h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + '</p><a class="link-gold" href="' + pageUrl("services") + '">Know more <i class="fa-solid fa-arrow-right-long ms-1"></i></a></div></div>';
        }).join("") + "</div>" +
        '<div class="text-center mt-5 reveal"><a class="btn btn-gold btn-lg" href="' + pageUrl("services") + '">View All Services</a></div>' +
      "</div></section>" +

      '<section class="section pt-0"><div class="container"><div class="row g-5 align-items-center">' +
        '<div class="col-lg-6 about-media reveal left">' +
          '<img class="main-img" src="' + P.img(8135496, 900, 700) + '" alt="PrimeNest Properties team inside a modern premium residence">' +
          '<img class="sub-img" src="' + P.img(13219418, 600, 450) + '" alt="Commercial property advisory at PrimeNest">' +
          '<div class="exp-badge"><b>16+</b><span>Years of<br>Experience</span></div></div>' +
        '<div class="col-lg-6 reveal right">' +
          '<span class="eyebrow">About Company</span><h2>A Property Partner You Can Actually Trust</h2>' +
          '<p>PrimeNest Properties began in 2009 with a single desk in Gurugram and one rule — never sell what you would not buy. Today our advisors close residential and commercial transactions across Gurugram, Delhi, Mumbai, Bengaluru, Hyderabad and Pune.</p>' +
          '<p>We do not run a listing mill. Every property is visited, documented and priced against real transaction data before it reaches you.</p>' +
          '<ul class="check-list">' +
            "<li><i class=\"fa-solid fa-circle-check\"></i> 100% verified ownership &amp; RERA documents</li>" +
            "<li><i class=\"fa-solid fa-circle-check\"></i> Written brokerage — no hidden commissions</li>" +
            "<li><i class=\"fa-solid fa-circle-check\"></i> In-house legal, loan and NRI desks</li>" +
            "<li><i class=\"fa-solid fa-circle-check\"></i> Post-sale support for life</li></ul>" +
          '<div class="d-flex flex-wrap gap-3 mt-4"><a class="btn btn-navy btn-lg" href="' + pageUrl("about") + '">More About Us</a>' +
          '<a class="btn btn-outline-navy btn-lg" href="' + pageUrl("contact") + '">Talk to an Advisor</a></div>' +
        "</div></div></div></section>" +

      '<section class="section bg-soft"><div class="container">' +
        sectionHead("Simple Process", "How It Works", "Five clear steps from first conversation to keys in hand.", true) +
        '<div class="row g-4 mt-2">' + P.PROCESS.map(function (s, i) {
          return '<div class="col-lg col-md-6 col-sm-6"><div class="process-card reveal d' + (i % 3) + '"><span class="process-num">' + s.n + "</span>" +
            "<h3 style=\"font-size:1.05rem;margin:14px 0 8px\">" + esc(s.title) + "</h3><p style=\"font-size:.9rem;margin:0\">" + esc(s.text) + "</p></div></div>";
        }).join("") + "</div></div></section>" +

      '<section class="section"><div class="container">' +
        sectionHead("Client Stories", "Customer Testimonials", "Real words from families, landlords and investors who moved with PrimeNest.", true) +
        '<div id="testiShell" class="row justify-content-center"></div>' +
      "</div></section>" +

      '<section class="section pt-0"><div class="container"><div class="cta-band reveal zoom"><div class="row align-items-center g-4">' +
        '<div class="col-lg-8"><h2>Ready to shortlist your next property?</h2>' +
        '<p class="mb-0">Send us your requirement on WhatsApp and receive a curated list of verified options within 24 hours — completely free.</p></div>' +
        '<div class="col-lg-4 text-lg-end d-flex flex-wrap gap-2 justify-content-lg-end">' +
          '<a class="btn btn-gold btn-lg" href="' + P.wa("Hello, I need help finding a property. Please share more details.") + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>Chat on WhatsApp</a>' +
          '<a class="btn btn-outline-light btn-lg" href="' + P.tel() + '"><i class="fa-solid fa-phone me-2"></i>' + C.phoneDisplay + "</a></div>" +
      "</div></div></div></section>" +

      '<section class="section pt-0" id="contact"><div class="container"><div class="row g-5">' +
        '<div class="col-lg-5">' + sectionHead("Get In Touch", "Talk to a PrimeNest Advisor", "Tell us what you are looking for and we will respond within one working day.") +
          infoBlock() + "</div>" +
        '<div class="col-lg-7">' + contactFormHTML("homeContact") + "</div>" +
      "</div></div></section>";
  }

  /* -------------------------------------------------- SHARED INFO / FORMS */
  function infoBlock() {
    return '<div class="detail-block">' +
      '<div class="info-row"><span class="info-ico"><i class="fa-solid fa-phone"></i></span><div><b>Call Us</b><a href="' + P.tel() + '">' + C.phoneDisplay + "</a> <span style='opacity:.5'>|</span> " + C.altPhoneDisplay + "</div></div>" +
      '<div class="info-row"><span class="info-ico wa" style="background:rgba(37,211,102,.12);color:#128c4a"><i class="fa-brands fa-whatsapp"></i></span><div><b>WhatsApp</b><a href="' + P.wa() + '" target="_blank" rel="noopener">Message us on ' + C.phoneDisplay + "</a></div></div>" +
      '<div class="info-row"><span class="info-ico"><i class="fa-regular fa-envelope"></i></span><div><b>Email</b><a href="mailto:' + C.email + '">' + C.email + "</a></div></div>" +
      '<div class="info-row"><span class="info-ico"><i class="fa-solid fa-location-dot"></i></span><div><b>Head Office</b><p>' + esc(C.address) + "</p></div></div>" +
      '<div class="info-row"><span class="info-ico"><i class="fa-regular fa-clock"></i></span><div><b>Business Hours</b>' +
        C.hours.map(function (h) { return "<p class='mb-1'><b style='font-size:.85rem;letter-spacing:0;text-transform:none'>" + esc(h.d) + ":</b> " + esc(h.t) + "</p>"; }).join("") + "</div></div>" +
      '<div class="d-flex flex-wrap gap-2 mt-3"><a class="btn btn-wa" href="' + P.wa() + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>WhatsApp Now</a>' +
      '<a class="btn btn-navy" href="' + P.tel() + '"><i class="fa-solid fa-phone me-2"></i>Call Now</a></div></div>';
  }
  P.infoBlock = infoBlock;

  function contactFormHTML(id) {
    return '<div class="form-card">' +
      '<h3 style="margin-bottom:6px">Send an Enquiry</h3><p style="font-size:.92rem;margin-bottom:22px">Fill in the form and our advisor will call you back within one working day.</p>' +
      '<div class="alert-success-custom" id="' + id + '-ok"><i class="fa-solid fa-circle-check fa-lg text-gold"></i><div><b>Thank you! Your enquiry has been sent successfully.</b><br><small>Our advisor will contact you shortly. For an instant response, message us on <a href="' + P.wa() + '" target="_blank" rel="noopener" style="color:#128c4a;font-weight:700">WhatsApp ' + C.phoneDisplay + "</a>.</small></div></div>" +
      '<form id="' + id + '" novalidate><div class="row g-3">' +
        '<div class="col-md-6"><label class="form-label" for="' + id + '-name">Full Name *</label><input class="form-control" id="' + id + '-name" name="name" placeholder="e.g. Rahul Sharma"><span class="err">Please enter your full name.</span></div>' +
        '<div class="col-md-6"><label class="form-label" for="' + id + '-phone">Phone Number *</label><input class="form-control" id="' + id + '-phone" name="phone" inputmode="numeric" placeholder="10 digit mobile number"><span class="err">Enter a valid 10 digit mobile number.</span></div>' +
        '<div class="col-md-6"><label class="form-label" for="' + id + '-email">Email Address *</label><input class="form-control" type="email" id="' + id + '-email" name="email" placeholder="you@example.com"><span class="err">Enter a valid email address.</span></div>' +
        '<div class="col-md-6"><label class="form-label" for="' + id + '-interest">I am interested in</label><select class="form-select" id="' + id + '-interest" name="interest">' +
          ["Buying a property", "Renting a property", "Selling my property", "Renting out my property", "Property management", "Investment advisory", "Other"].map(function (o) { return "<option>" + o + "</option>"; }).join("") + "</select></div>" +
        '<div class="col-12"><label class="form-label" for="' + id + '-msg">Message *</label><textarea class="form-control" rows="4" id="' + id + '-msg" name="message" placeholder="Tell us about your requirement — budget, location, size…"></textarea><span class="err">Please tell us a little about your requirement (min 10 characters).</span></div>' +
        '<div class="col-12 d-flex flex-wrap gap-2 align-items-center"><button class="btn btn-gold btn-lg" type="submit"><i class="fa-solid fa-paper-plane me-2"></i>Send Enquiry</button>' +
        '<a class="btn btn-wa" href="' + P.wa() + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>Send on WhatsApp</a></div>' +
      "</div></form></div>";
  }

  function validateAndBind(id, onValid) {
    var form = $("#" + id);
    if (!form) return;
    var fields = {
      name: function (v) { return v.trim().length >= 3; },
      phone: function (v) { return /^[6-9]\d{9}$/.test(v.replace(/\D/g, "").slice(-10)); },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); },
      message: function (v) { return v.trim().length >= 10; }
    };
    Object.keys(fields).forEach(function (key) {
      var el = $("#" + id + "-" + key);
      if (!el) return;
      el.addEventListener("blur", function () { check(el, key); });
      el.addEventListener("input", function () { if (el.classList.contains("is-invalid")) check(el, key); });
    });
    function check(el, key) {
      var ok = fields[key](el.value || "");
      el.classList.toggle("is-invalid", !ok);
      var err = el.parentElement.querySelector(".err");
      if (err) err.classList.toggle("show", !ok);
      return ok;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true, first = null;
      Object.keys(fields).forEach(function (key) {
        var el = $("#" + id + "-" + key);
        if (!el) return;
        if (!check(el, key)) { valid = false; if (!first) first = el; }
      });
      if (!valid) { if (first) first.focus(); toast("Please correct the highlighted fields.", "fa-triangle-exclamation"); return; }
      var data = { name: $("#" + id + "-name").value, phone: $("#" + id + "-phone").value, email: $("#" + id + "-email").value, message: $("#" + id + "-msg").value };
      if (typeof onValid === "function") onValid(data);
      var ok = $("#" + id + "-ok");
      if (ok) { ok.classList.add("show"); }
      form.reset();
      toast("Enquiry sent successfully. We will call you soon!");
      setTimeout(function () { if (ok) ok.scrollIntoView({ behavior: "smooth", block: "center" }); }, 120);
    });
  }
  P.validateAndBind = validateAndBind;

  function bindContactForm(id) {
    validateAndBind(id, function (d) {
      var msg = "Hello, my name is " + d.name + ". " + d.message + " (Call me on " + d.phone + ")";
      var wa = $("#homeContactWa");
      if (wa) wa.setAttribute("href", P.wa(msg));
    });
  }

  /* ------------------------------------------------------- LISTINGS PAGES */
  var FIELDS = [
    { k: "loc", label: "Location", type: "text", ph: "City or locality" },
    { k: "type", label: "Property Type", type: "select", opts: function () { return ["All Types"].concat(P.types()); } },
    { k: "min", label: "Min Price (₹)", type: "select", opts: function () { return ["", "2500000", "5000000", "10000000", "25000000", "50000000", "100000000"]; }, fmt: priceWord },
    { k: "max", label: "Max Price (₹)", type: "select", opts: function () { return ["", "5000000", "10000000", "25000000", "50000000", "100000000", "500000000"]; }, fmt: priceWord },
    { k: "beds", label: "Bedrooms", type: "select", opts: function () { return ["", "1", "2", "3", "4", "5"]; }, fmt: function (v) { return v ? v + "+" : "Any"; } },
    { k: "baths", label: "Bathrooms", type: "select", opts: function () { return ["", "1", "2", "3", "4", "5"]; }, fmt: function (v) { return v ? v + "+" : "Any"; } },
    { k: "amin", label: "Min Area (sq.ft.)", type: "number", ph: "e.g. 1000" },
    { k: "amax", label: "Max Area (sq.ft.)", type: "number", ph: "e.g. 5000" }
  ];
  function priceWord(v) {
    if (!v) return "Any";
    if (v >= 10000000) return "₹" + (v / 10000000) + " Cr";
    if (v >= 100000) return "₹" + (v / 100000) + " L";
    return "₹" + (+v).toLocaleString("en-IN");
  }

  function filterPanelHTML(params, lockStatus) {
    var body = FIELDS.map(function (f) {
      var v = params[f.k] || "";
      var input;
      if (f.type === "select") {
        input = '<select class="form-select" data-f="' + f.k + '">' + f.opts().map(function (o) {
          var val = o, lbl = f.fmt ? f.fmt(o) : o;
          if (f.k === "type" && o === "All Types") val = "";
          return '<option value="' + esc(val) + '"' + (String(v) === String(val) ? " selected" : "") + ">" + esc(lbl) + "</option>";
        }).join("") + "</select>";
      } else {
        input = '<input class="form-control" type="' + f.type + '" data-f="' + f.k + '" value="' + esc(v) + '" placeholder="' + esc(f.ph || "") + '">';
      }
      return '<div class="f-group"><label>' + f.label + "</label>" + input + "</div>";
    }).join("");
    return '<aside class="filter-panel" id="filterPanel">' +
      '<button class="filter-close d-lg-none" type="button" id="filterClose" aria-label="Close filters"><i class="fa-solid fa-xmark"></i></button>' +
      "<h5><i class=\"fa-solid fa-sliders\"></i> Refine Search</h5>" +
      '<div class="f-group"><label>Looking To</label><div class="chip-row">' +
        ["buy|For Sale", "rent|For Rent", "|Any"].map(function (s) {
          var kv = s.split("|");
          return '<button type="button" class="chip" data-status="' + kv[0] + '">' + kv[1] + "</button>";
        }).join("") + "</div></div>" +
      body +
      '<div class="f-group"><label>Sort Results</label><select class="form-select" data-f="sort">' +
        [["relevant|Most Relevant"], ["price-asc|Price: Low to High"], ["price-desc|Price: High to Low"], ["area-desc|Area: Largest First"], ["area-asc|Area: Smallest First"], ["featured|Featured First"]]
        .map(function (o) { var kv = o[0].split("|"); return '<option value="' + kv[0] + '"' + ((params.sort || "relevant") === kv[0] ? " selected" : "") + ">" + kv[1] + "</option>"; }).join("") + "</select></div>" +
      '<div class="d-grid gap-2 mt-3"><button class="btn btn-gold" id="applyFilters" type="button"><i class="fa-solid fa-magnifying-glass me-2"></i>Search</button>' +
      '<button class="btn btn-outline-navy" id="resetFilters" type="button"><i class="fa-solid fa-rotate-left me-2"></i>Reset Filters</button></div>' +
      '<hr class="my-4"><div class="p-3" style="background:var(--soft);border-radius:14px">' +
      '<b style="color:var(--navy-800);font-size:.95rem">Need help shortlisting?</b>' +
      '<p style="font-size:.85rem;margin:6px 0 12px">Our advisors will build a custom list for you at no cost.</p>' +
      '<a class="btn btn-wa btn-sm w-100" href="' + P.wa("Hello, I need help finding a property. Please share more details.") + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>Ask on WhatsApp</a></div>' +
      (lockStatus ? '<input type="hidden" data-f="lockstatus" value="' + lockStatus + '">' : "") +
      "</aside>";
  }

  function applyFilters(params) {
    var list = P.PROPERTIES.slice();
    var loc = (params.loc || "").trim().toLowerCase();
    if (params.status) list = list.filter(function (p) { return p.status === params.status; });
    if (params.type) list = list.filter(function (p) { return p.type === params.type; });
    if (params.beds) list = list.filter(function (p) { return p.bedrooms >= +params.beds; });
    if (params.baths) list = list.filter(function (p) { return p.bathrooms >= +params.baths; });
    if (params.min) list = list.filter(function (p) { return p.price >= +params.min; });
    if (params.max && +params.max < 999999999) list = list.filter(function (p) { return p.price <= +params.max; });
    if (params.amin) list = list.filter(function (p) { return p.area >= +params.amin; });
    if (params.amax) list = list.filter(function (p) { return p.area <= +params.amax; });
    if (loc) {
      list = list.filter(function (p) {
        return (p.location + " " + p.city + " " + p.title + " " + p.type).toLowerCase().indexOf(loc) > -1;
      });
    }
    switch (params.sort) {
      case "price-asc": list.sort(function (a, b) { return a.price - b.price; }); break;
      case "price-desc": list.sort(function (a, b) { return b.price - a.price; }); break;
      case "area-desc": list.sort(function (a, b) { return b.area - a.area; }); break;
      case "area-asc": list.sort(function (a, b) { return a.area - b.area; }); break;
      case "featured": list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }); break;
      default: list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    }
    return list;
  }

  function listingsPage(params, mode) {
    var isBuy = mode === "buy", isRent = mode === "rent";
    var p = Object.assign({}, params);
    if (isBuy) p.status = "buy";
    if (isRent) p.status = "rent";
    var results = applyFilters(p);
    var heading = mode === "properties" ? "All Properties" : (isBuy ? "Properties For Sale" : "Properties For Rent");
    var sub = mode === "properties"
      ? "Browse every verified listing on our books. Use the filters to narrow down by budget, size, type and location."
      : (isBuy ? "Homes, plots and commercial assets across six cities — each one title-verified and fairly priced."
              : "Residential and commercial rentals with transparent terms, verified owners and complete paperwork support.");
    setTitle(mode);
    return '<section class="page-hero"><div class="hero-media"><img src="' + P.img(isRent ? 31681835 : 7031602, 1920, 900) + '" alt="' + esc(heading) + ' in India"></div><div class="hero-veil"></div>' +
      '<div class="container"><span class="crumb"><a href="' + pageUrl("home") + '">Home</a> &nbsp;/&nbsp; ' + esc(heading) + "</span>" +
      "<h1>" + esc(heading) + "</h1><p>" + esc(sub) + "</p></div></section>" +

      '<section class="section"><div class="container">' +
      '<div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">' +
        '<button class="btn btn-navy mobile-filter-btn" id="filterOpen" type="button"><i class="fa-solid fa-sliders me-2"></i>Filters</button>' +
        '<div class="d-flex flex-wrap gap-2">' + P.CATEGORIES.slice(0, 6).map(function (cat) {
          return '<button class="chip' + (p.type === cat.type ? " active" : "") + '" data-chip="' + esc(cat.type) + '">' + esc(cat.name) + "</button>";
        }).join("") + "</div></div>" +
      '<div class="result-bar"><div><i class="fa-solid fa-house-flag me-2 text-gold"></i>Showing <b>' + results.length + "</b> of " + P.PROPERTIES.length + " properties" +
        (p.status ? ' <span style="opacity:.6">(' + (p.status === "rent" ? "for rent" : "for sale") + ")</span>" : "") + "</div>" +
        '<div class="d-flex align-items-center gap-2"><span style="font-size:.84rem;opacity:.8">Sort by</span>' +
        '<select id="sortMobile"><option value="relevant">Relevance</option><option value="price-asc"' + (p.sort === "price-asc" ? " selected" : "") + '>Price ↑</option>' +
        '<option value="price-desc"' + (p.sort === "price-desc" ? " selected" : "") + '>Price ↓</option><option value="area-desc"' + (p.sort === "area-desc" ? " selected" : "") + '>Area</option></select></div></div>' +
      '<div class="row g-4"><div class="col-lg-3">' + filterPanelHTML(p, (isBuy || isRent) ? p.status : "") + "</div>" +
      '<div class="col-lg-9"><div class="row g-4" id="grid"></div></div></div></div></section>' +

      '<section class="section pt-0"><div class="container"><div class="cta-band reveal"><div class="row align-items-center g-3">' +
      '<div class="col-lg-8"><h2 style="font-size:1.8rem">Cannot find the right property?</h2><p class="mb-0">Tell us your exact requirement — we have off-market and pre-launch inventory that never gets listed publicly.</p></div>' +
      '<div class="col-lg-4 text-lg-end"><a class="btn btn-gold btn-lg" href="' + pageUrl("contact") + '">Request a Custom Search</a></div>' +
      "</div></div></div></section>";
  }

  function bindListings(mode) {
    var params = currentRoute().params;
    if (mode === "buy") params.status = "buy";
    if (mode === "rent") params.status = "rent";
    var state = Object.assign({}, params);
    if (mode === "buy" || mode === "rent") state.lockstatus = state.status;
    var panel = $("#filterPanel");

    function syncChips() {
      $$("#filterOpen, .chip[data-chip]").forEach(function (c) {
        c.classList.toggle("active", c.getAttribute("data-chip") === state.type);
      });
    }
    function run() {
      var results = applyFilters(state);
      P.renderCards("#grid", results, "col-md-6");
      var bar = $(".result-bar div");
      if (bar) bar.innerHTML = '<i class="fa-solid fa-house-flag me-2 text-gold"></i>Showing <b>' + results.length + "</b> of " + P.PROPERTIES.length + " properties" +
        (state.status ? ' <span style="opacity:.6">(' + (state.status === "rent" ? "for rent" : "for sale") + ")</span>" : "");
      syncChips();
    }
    function readInputs() {
      $$("[data-f]", panel).forEach(function (el) {
        var k = el.getAttribute("data-f");
        if (k === "sort") { state.sort = el.value; return; }
        if (k === "lockstatus") return;
        state[k] = el.value;
      });
      if (state.lockstatus) state.status = state.lockstatus;
    }

    function setStatus(s) {
      if (state.lockstatus) return;
      state.status = s || "";
      $$(".chip[data-status]", panel).forEach(function (c) {
        var val = c.getAttribute("data-status");
        c.classList.toggle("active", (val || "") === (state.status || ""));
      });
    }

    $$(".chip[data-status]", panel).forEach(function (c) {
      var val = c.getAttribute("data-status") || "";
      c.classList.toggle("active", (val || "") === (state.status || ""));
      c.addEventListener("click", function () { setStatus(val); });
    });
    $$(".chip[data-chip]").forEach(function (c) {
      c.addEventListener("click", function () {
        var t = c.getAttribute("data-chip");
        state.type = state.type === t ? "" : t;
        var sel = panel.querySelector('[data-f="type"]');
        if (sel) sel.value = state.type;
        run();
      });
    });
    var apply = $("#applyFilters");
    if (apply) apply.addEventListener("click", function () { readInputs(); run(); toast(results_count(state) + " properties found"); });
    var reset = $("#resetFilters");
    if (reset) reset.addEventListener("click", function () {
      var keep = state.status;
      state = { status: keep, lockstatus: state.lockstatus, sort: state.sort };
      $$("[data-f]", panel).forEach(function (el) {
        var k = el.getAttribute("data-f");
        if (k === "sort") { el.value = "relevant"; return; }
        if (k === "lockstatus") return;
        el.value = "";
      });
      var sel = panel.querySelector('[data-f="type"]');
      if (sel) sel.value = "";
      setStatus(state.status);
      run();
      toast("Filters reset", "fa-rotate-left");
    });
    var sm = $("#sortMobile");
    if (sm) sm.addEventListener("change", function () {
      state.sort = sm.value;
      var sel = panel.querySelector('[data-f="sort"]');
      if (sel) sel.value = sm.value;
      run();
    });
    var open = $("#filterOpen");
    if (open) open.addEventListener("click", function () { panel.classList.add("open"); });
    var close = $("#filterClose");
    if (close) close.addEventListener("click", function () { panel.classList.remove("open"); });

    syncChips();
    run();
  }
  function results_count(state) { return applyFilters(state).length; }

  /* ------------------------------------------------------- SERVICES / ABOUT / CONTACT */
  function pageServices() {
    setTitle("services");
    return pageHeroHTML("services", "Our Services", "Everything you need to buy, sell, rent, manage or invest in Indian real estate — delivered by specialists, not generalists.",
      "From search to registry and beyond, one accountable team handles it all.") +
      '<section class="section"><div class="container"><div class="row g-4">' + P.SERVICES.map(function (s, i) {
        return '<div class="col-lg-6"><div class="feat-card reveal d' + (i % 3) + '"><div class="d-flex gap-3 align-items-start">' +
          '<div class="feat-ico mb-0" style="flex:0 0 60px"><i class="fa-solid ' + s.icon + '"></i></div><div>' +
          "<h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p>" +
          '<ul class="check-list" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-top:14px">' +
          s.points.map(function (pt) { return '<li style="font-size:.87rem"><i class="fa-solid fa-check"></i>' + esc(pt) + "</li>"; }).join("") +
          '</ul><div class="d-flex flex-wrap gap-2 mt-3"><a class="btn btn-navy btn-sm" href="' + pageUrl("contact") + '">Request Service</a>' +
          '<a class="btn btn-wa btn-sm" href="' + P.wa("Hello, I would like to know more about your " + s.title + " service.") + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>WhatsApp</a></div>' +
          "</div></div></div></div>";
      }).join("") + "</div></div></section>" +
      processSection("bg-soft") + statsSection("bg-navy on-dark") +
      faqSection("") +
      '<section class="section pt-0"><div class="container"><div class="cta-band reveal"><div class="row g-3 align-items-center">' +
      '<div class="col-lg-8"><h2 style="font-size:1.8rem">Not sure which service you need?</h2><p class="mb-0">Book a free 30-minute consultation and get a written action plan for your property goal.</p></div>' +
      '<div class="col-lg-4 text-lg-end"><a class="btn btn-gold btn-lg" href="' + pageUrl("contact") + '">Book Free Consultation</a></div></div></div></div></section>';
  }

  function pageHeroHTML(key, title, sub, crumbNote) {
    var imgs = { services: 13219418, about: 8135496, contact: 37853149, properties: 7031602, buy: 8082328, rent: 31681835, "property-details": 7031594 };
    return '<section class="page-hero"><div class="hero-media"><img src="' + P.img(imgs[key] || 7031602, 1920, 900) + '" alt="' + esc(title) + " — PrimeNest Properties\"></div>" +
      '<div class="hero-veil"></div><div class="container">' +
      '<span class="crumb"><a href="' + pageUrl("home") + '">Home</a> &nbsp;/&nbsp; ' + esc(title) + "</span>" +
      "<h1>" + esc(title) + "</h1><p>" + esc(sub) + "</p>" +
      (crumbNote ? '<p style="opacity:.85;margin-top:10px"><i class="fa-solid fa-circle-check text-gold me-2"></i>' + esc(crumbNote) + "</p>" : "") +
      "</div></section>";
  }

  function processSection(bg) {
    return '<section class="section ' + bg + '"><div class="container">' +
      sectionHead("How We Work", "Our Process", "Five transparent steps, full visibility at every stage.", true) +
      '<div class="row g-4 mt-2">' + P.PROCESS.map(function (s, i) {
        return '<div class="col-lg col-md-6 col-sm-6"><div class="process-card reveal d' + (i % 3) + '"><span class="process-num">' + s.n + "</span>" +
          "<h3 style=\"font-size:1.05rem;margin:14px 0 8px\">" + esc(s.title) + "</h3><p style=\"font-size:.9rem;margin:0\">" + esc(s.text) + "</p></div></div>";
      }).join("") + "</div></div></section>";
  }

  function statsSection(bg) {
    return '<section class="section-sm ' + bg + '"><div class="container"><div class="row g-3">' +
      P.STATS.map(function (s, i) {
        return '<div class="col-6 col-lg-3"><div class="stat-box reveal d' + i + '"><b data-count="' + s.n + '">0</b>' + s.suffix + "<span>" + esc(s.label) + "</span></div></div>";
      }).join("") + "</div></div></section>";
  }

  function faqSection(bg) {
    return '<section class="section ' + bg + '"><div class="container"><div class="row g-5">' +
      '<div class="col-lg-5">' + sectionHead("Good To Know", "Frequently Asked Questions", "Straight answers to the questions we hear most often.") +
      '<a class="btn btn-gold" href="' + pageUrl("contact") + '">Ask a Question</a></div>' +
      '<div class="col-lg-7"><div class="accordion pn-acc" id="faqAcc">' + P.FAQS.map(function (f, i) {
        return '<div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button' + (i ? " collapsed" : "") + '" type="button" data-bs-toggle="collapse" data-bs-target="#faq' + i + '">' + esc(f.q) + "</button></h3>" +
          '<div id="faq' + i + '" class="accordion-collapse collapse' + (i ? "" : " show") + '" data-bs-parent="#faqAcc"><div class="accordion-body"><p class="mb-0">' + esc(f.a) + "</p></div></div></div>";
      }).join("") + "</div></div></div></div></section>";
  }

  function pageAbout() {
    setTitle("about");
    return pageHeroHTML("about", "About PrimeNest Properties", "Sixteen years of honest advice, verified listings and closed deals across six Indian cities.") +
      '<section class="section"><div class="container"><div class="row g-5 align-items-center">' +
      '<div class="col-lg-6 about-media reveal left">' +
        '<img class="main-img" src="' + P.img(8135496, 900, 720) + '" alt="PrimeNest Properties advisory team meeting">' +
        '<img class="sub-img" src="' + P.img(7166640, 600, 450) + '" alt="Premium residence listed by PrimeNest">' +
        '<div class="exp-badge"><b>16+</b><span>Years of<br>Experience</span></div></div>' +
      '<div class="col-lg-6 reveal right"><span class="eyebrow">Who We Are</span><h2>Built on referrals, not advertising</h2>' +
        "<p>PrimeNest Properties was founded in 2009 in Gurugram by Rajat Khanna, after one too many clients arrived with a bad title, an inflated price and nobody to call. We set out to build the opposite kind of firm: small enough to know every client by name, disciplined enough to verify every document.</p>" +
        "<p>Today our team of eleven covers Gurugram, Delhi NCR, Mumbai, Bengaluru, Hyderabad and Pune — residential, commercial and land. More than 60% of our business still comes from client referrals, which we consider the only marketing metric that matters.</p>" +
        '<ul class="check-list">' +
          '<li><i class="fa-solid fa-circle-check"></i> RERA registered &amp; ISO 9001 process certified</li>' +
          '<li><i class="fa-solid fa-circle-check"></i> In-house legal, loan and NRI desks</li>' +
          '<li><i class="fa-solid fa-circle-check"></i> 2,400+ transactions closed since 2009</li>' +
          '<li><i class="fa-solid fa-circle-check"></i> Customer-first: you get the bad news early</li></ul>' +
        '<div class="d-flex flex-wrap gap-3 mt-4"><a class="btn btn-navy btn-lg" href="' + pageUrl("properties") + '">See Our Listings</a>' +
        '<a class="btn btn-wa btn-lg" href="' + P.wa() + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>WhatsApp Us</a></div>' +
      "</div></div></div></section>" +
      statsSection("bg-navy on-dark") +
      '<section class="section"><div class="container"><div class="row g-4">' +
        '<div class="col-lg-6"><div class="detail-block h-100 reveal left"><span class="tag-pill mb-3"><i class="fa-solid fa-bullseye text-gold"></i> Our Mission</span>' +
        "<h2 style='font-size:1.5rem'>Make property decisions safe and simple</h2><p>To give every family and investor access to verified property, honest pricing and complete legal clarity — so that the biggest purchase of their life is also the least stressful one.</p>" +
        '<ul class="check-list"><li><i class="fa-solid fa-check"></i> Verify before you list</li><li><i class="fa-solid fa-check"></i> Disclose before you ask</li><li><i class="fa-solid fa-check"></i> Support long after the registry</li></ul></div></div>' +
        '<div class="col-lg-6"><div class="detail-block h-100 reveal right"><span class="tag-pill mb-3"><i class="fa-solid fa-eye text-gold"></i> Our Vision</span>' +
        "<h2 style='font-size:1.5rem'>India's most trusted property advisory</h2><p>To become the first name Indian families think of when they buy, sell or rent — recognised not for the volume we sell, but for the number of clients who come back and send their relatives to us.</p>" +
        '<ul class="check-list"><li><i class="fa-solid fa-check"></i> 10 cities by 2028</li><li><i class="fa-solid fa-check"></i> 100% documentation compliance</li><li><i class="fa-solid fa-check"></i> Zero disputed transactions</li></ul></div></div>' +
      "</div></div></section>" +
      '<section class="section bg-soft"><div class="container">' +
      sectionHead("Why Families Pick Us", "Why Choose Us", "The habits that keep our clients coming back — and sending their friends.", true) +
      '<div class="row g-4">' + P.WHY_US.map(function (w, i) {
        return '<div class="col-lg-4 col-md-6"><div class="feat-card reveal d' + (i % 3) + '"><div class="feat-ico"><i class="fa-solid ' + w.icon + '"></i></div><h3>' + esc(w.title) + "</h3><p>" + esc(w.text) + "</p></div></div>";
      }).join("") + "</div></div></section>" +
      '<section class="section"><div class="container"><div class="row g-5">' +
      '<div class="col-lg-5">' + sectionHead("Our Journey", "Our Experience", "Sixteen years, one city at a time.") +
      '<div class="timeline">' +
        [["2009", "PrimeNest founded in Gurugram", "One desk, two advisors and our first twelve deals on Golf Course Road."],
         ["2013", "Commercial desk launched", "First office and retail mandates for IT and banking clients in Cyber City."],
         ["2016", "Legal & documentation cell", "In-house advocates brought title diligence in-house — disputes dropped to zero."],
         ["2019", "NRI & investment desk", "Video walkthroughs and remote registration for clients in 14 countries."],
         ["2022", "Property management division", "Full asset care for 300+ out-of-city and NRI owners."],
         ["2026", "6 cities, 11 specialists", "2,400+ transactions closed with a 4.9/5 client satisfaction score."]]
        .map(function (t) {
          return '<div class="tl-item reveal"><small>' + t[0] + "</small><b>" + esc(t[1]) + "</b><p>" + esc(t[2]) + "</p></div>";
        }).join("") + "</div></div>" +
      '<div class="col-lg-7"><div class="detail-block"><h2><i class="fa-solid fa-people-group"></i> Meet the Team</h2>' +
      '<p style="font-size:.93rem">Eleven specialists across sales, legal, leasing and asset management — every client has one accountable advisor from first call to final handover.</p>' +
      '<div class="row g-3 mt-1">' + P.TEAM.map(function (t, i) {
        return '<div class="col-sm-6 col-lg-4"><div class="team-card reveal d' + (i % 3) + '"><div class="tm-img">' +
          '<img src="' + P.img(t.img, 500, 500) + '" alt="' + esc(t.name) + " — " + esc(t.role) + '" loading="lazy">' +
          '<div class="tm-soc"><a href="' + P.tel() + '" aria-label="Call ' + esc(t.name) + '"><i class="fa-solid fa-phone"></i></a>' +
          '<a href="' + P.wa("Hello, I would like to speak with " + t.name + " about a property.") + '" target="_blank" rel="noopener" aria-label="WhatsApp ' + esc(t.name) + '"><i class="fa-brands fa-whatsapp"></i></a>' +
          '<a href="mailto:' + C.email + '" aria-label="Email PrimeNest"><i class="fa-regular fa-envelope"></i></a></div></div>' +
          '<div class="tm-body"><h3>' + esc(t.name) + '</h3><div class="role">' + esc(t.role) + '</div><small style="opacity:.7">' + esc(t.exp) + " experience</small></div></div></div>";
      }).join("") + "</div></div></div></div></div></section>" +
      '<section class="section bg-soft"><div class="container"><div class="row g-5 align-items-center">' +
      '<div class="col-lg-6 reveal left"><span class="eyebrow">Customer First</span><h2>What "customer-first" actually means here</h2>' +
      '<p>It means we will tell you when a property is wrong for you, even if it costs us the deal. It means every flaw we find in inspection is written into the report before negotiation. And it means your advisor answers the phone twelve months after registration.</p>' +
      '<div class="row g-3 mt-2"><div class="col-6"><div class="stat-box light"><b data-count="97">0</b>%<span>Would Recommend</span></div></div>' +
      '<div class="col-6"><div class="stat-box light"><b data-count="4">0</b>.9/5<span>Client Rating</span></div></div>' +
      '<div class="col-6"><div class="stat-box light"><b data-count="21">0</b><span>Avg. Days to Close</span></div></div>' +
      '<div class="col-6"><div class="stat-box light"><b data-count="60">0</b>%<span>Referral Business</span></div></div></div></div>' +
      '<div class="col-lg-6 reveal right"><div id="testiShell" class="row justify-content-center"></div></div>' +
      "</div></div></section>" + faqSection("") +
      '<section class="section pt-0"><div class="container"><div class="cta-band reveal"><div class="row g-3 align-items-center">' +
      '<div class="col-lg-8"><h2 style="font-size:1.8rem">Let us find your next address</h2><p class="mb-0">Speak to a senior advisor today — no obligation, no pressure, no brokerage until your deal closes.</p></div>' +
      '<div class="col-lg-4 text-lg-end"><a class="btn btn-gold btn-lg" href="' + pageUrl("contact") + '">Contact Us</a></div></div></div></div></section>';
  }

  function pageContact() {
    setTitle("contact");
    return pageHeroHTML("contact", "Contact Us", "Call, WhatsApp or drop into our Gurugram office — we reply to every enquiry within one working day.") +
      '<section class="section"><div class="container"><div class="row g-5">' +
      '<div class="col-lg-5">' + sectionHead("Reach Us", "Contact Information", "However you prefer to talk, we are easy to reach.") +
      infoBlock() +
      '<div class="detail-block mt-4"><h2><i class="fa-solid fa-share-nodes"></i> Follow Us</h2>' +
      '<p style="font-size:.92rem">New listings, price drops and market notes — follow along.</p>' +
      '<div class="d-flex flex-wrap gap-2">' + C.social.map(function (s) {
        return '<a class="btn btn-outline-navy btn-sm" href="' + s.url + '" target="_blank" rel="noopener"><i class="' + s.icon + ' me-2"></i>' + esc(s.label) + "</a>";
      }).join("") + "</div></div></div>" +
      '<div class="col-lg-7">' + contactFormHTML("contactForm") +
      '<div class="map-frame mt-4"><iframe title="PrimeNest Properties office location on Google Maps" src="https://www.google.com/maps?q=MG%20Road%20Sector%2029%20Gurugram%20Haryana&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>' +
      "</div></div></div></section>" +
      '<section class="section pt-0"><div class="container"><div class="row g-4">' +
      '<div class="col-lg-4"><div class="feat-card reveal"><div class="feat-ico"><i class="fa-solid fa-calendar-check"></i></div><h3>Book a Site Visit</h3><p>Weekday evenings and weekends available. We arrange pick-up for senior citizens and out-of-town clients.</p></div></div>' +
      '<div class="col-lg-4"><div class="feat-card reveal d1"><div class="feat-ico"><i class="fa-solid fa-file-shield"></i></div><h3>Free Document Review</h3><p>Already found something elsewhere? Send us the papers and we will review the title for free.</p></div></div>' +
      '<div class="col-lg-4"><div class="feat-card reveal d2"><div class="feat-ico"><i class="fa-solid fa-handshake"></i></div><h3>List With Us</h3><p>Professional photography, verified buyers and a written brokerage — list your property in 24 hours.</p></div></div>' +
      "</div></div></section>";
  }

  function renderTestimonials(target) {
    var host = typeof target === "string" ? $(target) : target;
    if (!host) return;
    var slides = [];
    for (var i = 0; i < P.TESTIMONIALS.length; i += 3) { slides.push(P.TESTIMONIALS.slice(i, i + 3)); }
    host.innerHTML = '<div class="col-12 testi-shell"><div id="testiCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">' +
      '<div class="carousel-indicators">' + slides.map(function (s, i) {
        return '<button type="button" data-bs-target="#testiCarousel" data-bs-slide-to="' + i + '"' + (i ? "" : ' class="active"') + ' aria-label="Slide ' + (i + 1) + '"></button>';
      }).join("") + "</div>" +
      '<div class="carousel-inner">' + slides.map(function (group, i) {
        return '<div class="carousel-item' + (i ? "" : " active") + '"><div class="row g-4">' + group.map(function (t, k) {
          return '<div class="col-md-4"><div class="quote-card"><span class="qmark">&rdquo;</span>' +
            '<div class="stars">' + '<i class="fa-solid fa-star"></i>'.repeat(5) + "</div><p>" + esc(t.text) + "</p>" +
            '<div class="quote-user"><img src="' + P.img(t.img, 200, 200) + '" alt="' + esc(t.name) + '" loading="lazy"><div><b>' + esc(t.name) + "</b><small>" + esc(t.role) + "</small></div></div></div></div>";
        }).join("") + "</div></div>";
      }).join("") + "</div>" +
      '<button class="carousel-control-prev" type="button" data-bs-target="#testiCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span><span class="visually-hidden">Previous</span></button>' +
      '<button class="carousel-control-next" type="button" data-bs-target="#testiCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span><span class="visually-hidden">Next</span></button>' +
      "</div></div>";
  }

  /* ------------------------------------------------------------- RENDERER */
  function render() {
    var route = currentRoute();
    var app = $("#prime-app");
    if (!app) return;
    document.body.classList.toggle("on-hero-page", route.page === "home");
    var nav = $("#pnNav");
    if (nav) nav.classList.toggle("over-hero", route.page === "home");

    var html = "";
    switch (route.page) {
      case "properties": html = listingsPage(route.params, "properties"); break;
      case "buy": html = listingsPage(route.params, "buy"); break;
      case "rent": html = listingsPage(route.params, "rent"); break;
      case "services": html = pageServices(); break;
      case "about": html = pageAbout(); break;
      case "contact": html = pageContact(); break;
      case "property-details":
        if (typeof P.renderDetails === "function") { html = P.renderDetails(route.params.id); }
        else { html = '<section class="section"><div class="container"><div class="empty-state"><h3>Property not found</h3></div></div></section>'; }
        break;
      default: html = pageHome();
    }
    app.innerHTML = html;

    /* page-specific bindings */
    if (route.page === "home") {
      P.renderCards("#featuredGrid", P.featured(6));
      renderTestimonials("#testiShell");
      bindSearchForm("heroSearch");
      bindContactForm("homeContact");
      counters();
    } else if (route.page === "properties" || route.page === "buy" || route.page === "rent") {
      bindListings(route.page);
    } else if (route.page === "about") {
      renderTestimonials("#testiShell");
      counters();
    } else if (route.page === "contact") {
      bindContactForm("contactForm");
    } else if (route.page === "property-details" && typeof P.bindDetails === "function") {
      P.bindDetails(route.params.id);
    }
    reveal();
    if (window.bootstrap) {
      $$('[data-bs-ride="carousel"]').forEach(function (el) { window.bootstrap.Carousel.getOrCreateInstance(el); });
    }

    /* pre-fill contact form intent (List Your Property) */
    if (route.page === "contact" && route.params.intent === "list") {
      var sel = $("#contactForm-interest");
      if (sel) sel.value = "Selling my property";
      var msg = $("#contactForm-msg");
      if (msg) msg.value = "I would like to list my property with PrimeNest Properties.";
    }
  }

  /* --------------------------------------------------------- CHROME / UX */
  function bindChrome() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      var toggle = t.closest && t.closest("#navToggle");
      var menu = $("#pnMenu"), backdrop = $("#navBackdrop");
      if (toggle && menu) {
        var open = menu.classList.toggle("open");
        if (backdrop) backdrop.classList.toggle("show", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      } else if (t.closest && t.closest(".menu-close")) {
        menu.classList.remove("open"); if (backdrop) backdrop.classList.remove("show");
        var bt = $("#navToggle"); if (bt) bt.innerHTML = '<i class="fa-solid fa-bars"></i>';
      } else if (t.closest && t.closest("#navBackdrop")) {
        menu.classList.remove("open"); if (backdrop) backdrop.classList.remove("show");
        var b2 = $("#navToggle"); if (b2) b2.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
      var top = t.closest && t.closest("#backToTop");
      if (top) window.scrollTo({ top: 0, behavior: "smooth" });
    });

    var news = $("#newsForm");
    if (news) news.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("#newsEmail").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) { toast("Please enter a valid email address.", "fa-triangle-exclamation"); return; }
      news.reset(); toast("Subscribed! Watch out for our next market note.");
    });

    function onScroll() {
      var nav = $("#pnNav");
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
      var btt = $("#backToTop");
      if (btt) btt.classList.toggle("show", window.scrollY > 420);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* lightbox */
    var lb = $("#pnLightbox"), lbImg = lb ? lb.querySelector("img") : null, list = [], idx = 0;
    function openLb(srcs, i) {
      if (!lb) return; list = srcs; idx = i;
      lbImg.src = list[idx]; lb.classList.add("show"); document.body.style.overflow = "hidden";
    }
    function closeLb() { if (lb) { lb.classList.remove("show"); document.body.style.overflow = ""; } }
    function step(d) { idx = (idx + d + list.length) % list.length; if (lbImg) lbImg.src = list[idx]; }
    document.addEventListener("click", function (e) {
      var z = e.target.closest && e.target.closest("[data-zoom]");
      if (z) {
        var srcs = (z.getAttribute("data-zoom") || "").split("|").filter(Boolean);
        openLb(srcs, +(z.getAttribute("data-index") || 0));
      }
      if (e.target.closest && e.target.closest(".lb-close")) closeLb();
      if (e.target.closest && e.target.closest(".lb-next")) step(1);
      if (e.target.closest && e.target.closest(".lb-prev")) step(-1);
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb || !lb.classList.contains("show")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------------------------------------------------------------- BOOT */
  function boot() {
    renderFabs();
    renderNav();
    renderFooter();
    bindChrome();
    render();
    if (IS_SPA) window.addEventListener("hashchange", function () {
      /* only react to router hashes (#/...) — plain #anchors scroll in place */
      if (location.hash.indexOf("#/") !== 0) return;
      render(); window.scrollTo(0, 0);
    });
    var loader = $("#prime-loader");
    function hideLoader() { if (loader) loader.classList.add("hidden"); }
    if (document.readyState === "complete") setTimeout(hideLoader, 500);
    else window.addEventListener("load", function () { setTimeout(hideLoader, 400); });
    setTimeout(hideLoader, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  P.refresh = render;
  P.toast = toast;
})(window.PRIME);
