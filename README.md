# 🏠 PrimeNest Properties

A premium, fully-responsive **property dealer / real estate website** built with **HTML5, CSS3, JavaScript (ES6), Bootstrap 5 and Font Awesome 6**.

No PHP. No MySQL. No database. No admin panel. No login.
All property data lives in **`js/properties.js`** — so the site deploys **directly to GitHub Pages**.

---

## ✨ Features

| Area | What's included |
|------|-----------------|
| **Pages** | Home, Properties, Property Details, Buy, Rent, Services, About, Contact |
| **Home** | Hero with Buy/Rent toggle, location / type / budget search, stats counters, featured properties, 8 property categories, popular locations, why-choose-us, services, about company, process, testimonials carousel, CTA band, contact block |
| **Listings** | 16 realistic Indian properties, image, featured + buy/rent badges, title, location, price, area, beds, baths, type, View Details / WhatsApp / Call buttons |
| **Search** | Live JS filtering by buy/rent, location, type, min & max price, bedrooms, bathrooms, min & max area + 6 sort modes, result count, reset filters, mobile filter drawer — **no page refresh** |
| **Details** | JS-loaded by property id, gallery with thumbnails + lightbox + keyboard nav, price box, 12-field spec grid, description, features, amenities, nearby places, Google Map, agent card, enquiry form, similar properties |
| **WhatsApp** | Pre-filled messages everywhere (cards, details, agent, contact, hero, CTA) — number stored in **one config variable** |
| **UX** | Loading screen, sticky navbar with scroll state, mobile hamburger drawer, scroll-reveal animations, counters, back-to-top, floating WhatsApp/Call buttons, toasts, form validation, image lightbox |
| **SEO** | Unique titles + meta descriptions per page, Open Graph & Twitter tags, semantic HTML, H1/H2/H3 hierarchy, descriptive alt text, JSON-LD `RealEstateAgent` schema, `robots.txt`, `sitemap.xml`, canonical links, lazy-loaded images |
| **Design** | Dark navy + white + gold theme, Playfair Display & Plus Jakarta Sans, glassmorphism, gradients, rounded corners, layered shadows, hover & zoom effects, 100% responsive |

---

## 📁 Folder structure

```
/
├── index.html               ← Home page
├── properties.html          ← All properties + search & filters
├── property-details.html    ← Single property (loads by ?id=)
├── buy.html                 ← Properties for sale
├── rent.html                ← Properties for rent
├── services.html            ← Services, process, FAQ
├── about.html               ← Company, mission, vision, team, timeline
├── contact.html             ← Contact form, map, hours, social
├── robots.txt
├── sitemap.xml
├── README.md
│
├── css/
│   └── style.css           ← Complete premium stylesheet
│
├── js/
│   ├── properties.js       ← ⭐ CONFIG + all property data (edit this)
│   ├── main.js             ← Navigation, pages, search, forms, animations
│   └── property-details.js ← Details view, gallery, enquiry
│
└── images/
    ├── properties/         ← (optional) self-hosted property photos
    ├── locations/          ← (optional) city photos
    └── team/               ← (optional) advisor portraits
```

> `src/site-entry.js` + the root `index.html` exist only so the same `css/` and `js/`
> files can also be bundled into a single self-contained document. The files under
> `css/` and `js/` are the single source of truth — edit **those**, never the bundle.

---

## 🚀 Deploy to GitHub Pages

1. Create a repository (e.g. `primenest-properties`).
2. Copy these files/folders into it: **`*.html`, `robots.txt`, `sitemap.xml`, `css/`, `js/`, `images/`**
   (everything listed in the folder structure above).
3. Commit and push:
   ```bash
   git add .
   git commit -m "PrimeNest Properties website"
   git branch -M main
   git remote add origin https://github.com/<username>/primenest-properties.git
   git push -u origin main
   ```
4. In the repo go to **Settings → Pages → Build and deployment**.
   * Source: **Deploy from a branch**
   * Branch: **main** / folder: **/(root)**
5. Open `https://<username>.github.io/primenest-properties/` — done. ✅

**Using a project sub-path?** All page links, CSS and JS use *relative* paths
(`css/style.css`, `js/main.js`, `properties.html`), so it works out of the box under
`/<repo>/`. For an even nicer URL, deploy to a `<username>.github.io` repository.

---

## 🔧 Customisation

### 1. WhatsApp number (one place only)

Open **`js/properties.js`**:

```js
P.CONFIG = {
  WHATSAPP_NUMBER: "919217151926",  // international format, used to build wa.me links
  phoneDisplay:    "9217151926",    // what visitors see
  phoneDial:       "+919217151926", // tel: link
  email: "hello@primenestproperties.in",
  address: "PrimeNest Tower, 4th Floor, Sector 29, MG Road, Gurugram, Haryana 122001",
  ...
};
```

Every WhatsApp button on the site is generated from `WHATSAPP_NUMBER`:

```js
P.wa(message)        // → https://wa.me/919217151926?text=<encoded message>
P.waProperty(p)      // → "Hello, I am interested in <Property Name>. Please share more details about this property."
P.tel()              // → tel:+919217151926
```

### 2. Add / edit a property

Append an object to `P.PROPERTIES` in **`js/properties.js`**:

```js
{
  id: "pn-117",                          // unique — used in the details URL
  title: "3 BHK Apartment in Sector 66",
  type: "Apartment",                     // Apartment | House | Villa | Builder Floor |
                                         // Plot | Commercial Shop | Office | Warehouse
  status: "buy",                         // "buy" | "rent"
  city: "Gurugram",
  location: "Sector 66, Golf Course Ext. Road, Gurugram, Haryana",
  price: 21500000,                       // rupees (rent = per month)
  bedrooms: 3, bathrooms: 3, area: 1450, // sq.ft.
  facing: "East", furnishing: "Semi Furnished", floor: "5th of 12",
  possession: "Ready to Move", age: "2 Years Old", parking: "1 Covered",
  featured: true, agent: "ag-1",
  images: [24419854, 8089172, 8135492],  // image ids / urls (first one = card image)
  description: "…",
  features: ["Modular kitchen", "Balcony"],
  amenities: ["Swimming pool", "Gym", "24x7 security"],
  nearby: [["Metro", "1.2 km"], ["School", "0.8 km"]]
}
```

Everything updates automatically: listing counts, category cards, filters, sorting,
result counts, similar properties and the sitemap-ready details URL
`property-details.html?id=pn-117`.

### 3. Other editable data (all in `js/properties.js`)
`P.CATEGORIES` · `P.LOCATIONS` · `P.SERVICES` · `P.TESTIMONIALS` · `P.TEAM` ·
`P.STATS` · `P.WHY_US` · `P.PROCESS` · `P.FAQS` · `P.AGENTS`

### 4. Brand colours
Change the tokens at the top of **`css/style.css`** (`--navy-900`, `--gold`, `--gold-light`, …).

---

## 🖼️ About the images

Photographs are streamed from a free CDN through `P.img(id, width, height)` so the
repository stays light and pages load fast. To self-host, drop files into
`images/properties/`, `images/locations/` and `images/team/` and point `P.img()`
at them (see `images/README.md`).

---

## 🧪 Tested

* Chrome, Edge, Firefox, Safari (desktop + iOS/Android)
* 320 px → 2560 px breakpoints
* No console errors, no backend calls, works offline from static hosting

---

© 2026 PrimeNest Properties — RERA Reg. No. RC/GGM/2009/04.
Built with HTML5 · CSS3 · JavaScript · Bootstrap 5 · Font Awesome 6.
