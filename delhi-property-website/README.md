# Delhi Properties — Static Real Estate Website

A premium, Delhi-only real estate property dealer website. Pure HTML5, CSS3
and vanilla JavaScript (ES6+) with Bootstrap-free custom design — no
frameworks, no backend, ready to deploy as a static site.

## Structure
```
index.html              Home
properties.html          All properties + full filter/search
property-details.html    Single property view (?id=<propertyId>)
buy.html                 Buy-only listings with category tabs
rent.html                Rent-only listings with category tabs
sell.html                "Sell your property" lead form
about.html                About the (demo) business
contact.html              Contact form + map
css/style.css             All styles (design tokens at the top)
js/properties.js          54 sample Delhi properties (demo data)
js/main.js                Filtering engine, nav, gallery, forms, WhatsApp/call links
robots.txt / sitemap.xml  Basic SEO files
```

## Running locally
Just open `index.html` in a browser, or serve the folder with any static
server, e.g.:
```
npx serve .
```

## Deploying
Drag-and-drop the folder into Netlify/Vercel, or push it to a GitHub repo and
enable GitHub Pages on the `main` branch — no build step is required.

## Notes
- WhatsApp number used throughout: **+91 92171 51926** (`js/main.js` → `WHATSAPP_NUMBER`).
- All 54 demo properties are located in Delhi only (no Gurgaon/Noida/Ghaziabad/Faridabad).
- Forms (Sell, Contact, Enquiry) show a front-end-only success message — there is no backend.
- Statistics ("500+ Properties", "1000+ Happy Clients", etc.) are clearly demo placeholders.
- Property photos are placeholder images (Unsplash/Picsum) — swap `js/properties.js` image URLs
  and `images/` folder for real photography before going live.
