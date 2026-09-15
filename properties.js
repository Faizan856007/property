/* =============================================================================
   PrimeNest Properties — js/properties.js
   Central configuration + all property data (no backend, no database).
   Change WHATSAPP_NUMBER here to point all WhatsApp buttons to a new number.
   ============================================================================= */
window.PRIME = window.PRIME || {};

(function (P) {
  "use strict";

  /* ---------------------------------------------------------------- CONFIG */
  P.CONFIG = {
    brand: "PrimeNest Properties",
    tagline: "Premium Real Estate Advisory",
    /** International format — used ONLY to build wa.me links (never shown to users) */
    WHATSAPP_NUMBER: "919217151926",
    /** Number displayed to visitors */
    phoneDisplay: "9217151926",
    phoneDial: "+919217151926",
    altPhoneDisplay: "0124 456 7890",
    email: "hello@primenestproperties.in",
    salesEmail: "invest@primenestproperties.in",
    address: "PrimeNest Tower, 4th Floor, Sector 29, MG Road, Gurugram, Haryana 122001",
    city: "Gurugram, India",
    raveReviews: "4.9 / 5 from 1,200+ happy families",
    hours: [
      { d: "Monday — Friday", t: "9:30 AM — 7:30 PM" },
      { d: "Saturday", t: "10:00 AM — 6:00 PM" },
      { d: "Sunday", t: "11:00 AM — 4:00 PM (Site Visits Only)" }
    ],
    social: [
      { icon: "fa-brands fa-facebook-f", label: "Facebook", url: "https://facebook.com" },
      { icon: "fa-brands fa-instagram", label: "Instagram", url: "https://instagram.com" },
      { icon: "fa-brands fa-x-twitter", label: "X (Twitter)", url: "https://x.com" },
      { icon: "fa-brands fa-linkedin-in", label: "LinkedIn", url: "https://linkedin.com" },
      { icon: "fa-brands fa-youtube", label: "YouTube", url: "https://youtube.com" }
    ]
  };

  /** Build a wa.me link with a pre-filled, URL-encoded message. */
  P.wa = function (message) {
    var msg = message || "Hello, I am interested in this property. Please share more details.";
    return "https://wa.me/" + P.CONFIG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  };
  /** Property specific WhatsApp link */
  P.waProperty = function (p) {
    return P.wa("Hello, I am interested in " + p.title + " (" + p.location + ") listed at " +
      P.priceLabel(p) + ". Please share more details about this property.");
  };
  /** tel: link */
  P.tel = function () { return "tel:" + P.CONFIG.phoneDial; };

  /* ------------------------------------------------------- IMAGE HELPER */
  var CDN = "https://images.pexels.com/photos/";
  P.img = function (id, w, h) {
    w = w || 1200;
    var q = "?auto=compress&cs=tinysrgb&fit=crop&w=" + w + (h ? "&h=" + h : "");
    return CDN + id + "/pexels-photo-" + id + ".jpeg" + q;
  };

  /* ------------------------------------------------------------- AGENTS */
  P.AGENTS = [
    {
      id: "ag-1", name: "Rajat Khanna", role: "Founder & Principal Consultant",
      photo: 28442318, phone: "9217151926", email: "rajat@primenestproperties.in",
      exp: "16+ Years", deals: "1,400+", languages: "English, Hindi, Punjabi",
      bio: "Rajat founded PrimeNest with one belief — property advice should be honest, data backed and completely transparent. He has closed transactions worth over ₹2,800 Cr across NCR, Mumbai and Bengaluru."
    },
    {
      id: "ag-2", name: "Sanya Mehra", role: "Head of Residential Sales",
      photo: 25651531, phone: "9217151926", email: "sanya@primenestproperties.in",
      exp: "11+ Years", deals: "780+", languages: "English, Hindi, Marathi",
      bio: "Sanya leads our residential desk and specialises in luxury apartments, villas and builder floors. She personally walks every client through title diligence, negotiation and registration."
    },
    {
      id: "ag-3", name: "Karan Bhatia", role: "Commercial & Investment Advisor",
      photo: 38740728, phone: "9217151926", email: "karan@primenestproperties.in",
      exp: "13+ Years", deals: "520+", languages: "English, Hindi",
      bio: "Karan handles office, retail and warehouse mandates for corporates, NRIs and family offices, with a sharp focus on rental yield and exit strategy."
    },
    {
      id: "ag-4", name: "Neha Rawat", role: "Legal & Documentation Head",
      photo: 34761515, phone: "9217151926", email: "legal@primenestproperties.in",
      exp: "9+ Years", deals: "960+", languages: "English, Hindi, Garhwali",
      bio: "Neha and her team verify every title, encumbrance certificate and approval before a PrimeNest property is ever listed — so you never inherit someone else's problem."
    },
    {
      id: "ag-5", name: "Aditya Verma", role: "Senior Property Consultant",
      photo: 27972376, phone: "9217151926", email: "aditya@primenestproperties.in",
      exp: "8+ Years", deals: "410+", languages: "English, Hindi",
      bio: "Aditya is the friendly voice on our helpline. He shortlists properties, arranges site visits and follows up until keys are in your hand."
    }
  ];
  P.agentById = function (id) {
    for (var i = 0; i < P.AGENTS.length; i++) { if (P.AGENTS[i].id === id) return P.AGENTS[i]; }
    return P.AGENTS[0];
  };

  /* --------------------------------------------------------- PROPERTIES */
  P.PROPERTIES = [
    {
      id: "pn-101",
      title: "Luxury 4 BHK Sky Residence at DLF Camellias",
      type: "Apartment", status: "buy",
      city: "Gurugram", location: "DLF Phase 5, Sector 53, Gurugram, Haryana",
      price: 125000000, bedrooms: 4, bathrooms: 5, area: 3850,
      facing: "North-East", furnishing: "Fully Furnished", floor: "21st of 24",
      possession: "Ready to Move", age: "3 Years Old", parking: "3 Covered",
      featured: true, agent: "ag-1",
      images: [24419854, 8089172, 8135492, 7587864, 6934170],
      description: "A palatial sky residence on the 21st floor of Gurugram's most address. Full-floor privacy, 11-foot ceilings, imported marble flooring and an unobstructable view of the Aravallis from every room. The residence comes fully furnished with Italian modular kitchen, home automation and a private lift lobby.",
      features: ["Private lift lobby", "11 ft ceilings with floor-to-ceiling glazing", "Italian marble flooring", "Full home automation", "Wrap-around sun deck", "Italian modular kitchen with Bosch appliances"],
      amenities: ["Infinity swimming pool", "Clubhouse & spa", "Concierge service", "Gym & yoga deck", "Kids play zone", "24x7 security & CCTV", "Power backup", "Visitor parking", "Amphitheatre", "Salon & cafe"],
      nearby: [["DLF Cyber Hub", "3.2 km"], ["Rapid Metro Sector 53-54", "1.1 km"], ["The Shri Ram School", "1.8 km"], ["Medanta Medicity", "5.4 km"], ["IGI Airport", "18 km"]]
    },
    {
      id: "pn-102",
      title: "Elegant 3 BHK Apartment with Lake View in Powai",
      type: "Apartment", status: "buy",
      city: "Mumbai", location: "Hiranandani Gardens, Powai, Mumbai, Maharashtra",
      price: 43500000, bedrooms: 3, bathrooms: 3, area: 1650,
      facing: "West", furnishing: "Semi Furnished", floor: "12th of 18",
      possession: "Ready to Move", age: "5 Years Old", parking: "2 Covered",
      featured: true, agent: "ag-2",
      images: [17634651, 7174113, 6588581, 7214450, 30767888],
      description: "Bright cross-ventilated 3 BHK overlooking Powai Lake, set inside a landscaped Hiranandani complex. Wide living and dining, a separate utility balcony and a society with resort-style amenities — walking distance from ND Arte, Galleria and IIT Bombay.",
      features: ["Powai Lake view from living room", "Cross ventilation — 3 side open", "Wooden laminated master bedroom", "Modular kitchen with utility balcony", "Society garden view"],
      amenities: ["Swimming pool", "Clubhouse", "Gymnasium", "Landscaped garden", "Children's play area", "Intercom", "Covered parking", "CCTV surveillance", "Jogging track", "Housekeeping"],
      nearby: [["IIT Bombay", "1.4 km"], ["Powai Metro (Line 6, proposed)", "2.1 km"], ["Hiranandani Hospital", "0.9 km"], ["Delhi Public School Powai", "1.6 km"], ["Airport T2", "9 km"]]
    },
    {
      id: "pn-103",
      title: "Independent 4 BHK House in Whitefield",
      type: "House", status: "buy",
      city: "Bengaluru", location: "Palm Meadows Road, Whitefield, Bengaluru, Karnataka",
      price: 31000000, bedrooms: 4, bathrooms: 4, area: 2400,
      facing: "East", furnishing: "Unfurnished", floor: "G + 2",
      possession: "Ready to Move", age: "4 Years Old", parking: "2 Covered",
      featured: true, agent: "ag-5",
      images: [7031600, 6987730, 8082562, 7031879, 7166640],
      description: "A crisply designed east-facing independent house on a 30x50 plot with a private garden, terrace and a fully separate rental-ready second unit. Clear B Khada-free title, A Khata, and located inside a quiet residential lane minutes from ITPL.",
      features: ["A Khata, clear title", "Private garden & terrace", "Separate rental unit", "Borewell + Cauvery water", "Vitrified flooring throughout", "Solar water heater"],
      amenities: ["Car park", "Terrace garden space", "Borewell", "Modular switches", "Compound wall gating", "Rainwater harvesting", "Backup power point", "Store room"],
      nearby: [["ITPL", "2.6 km"], ["Phoenix Marketcity", "3.4 km"], ["Whitefield Metro Station", "2.9 km"], ["Vydehi Hospital", "2.2 km"], ["Ryan International School", "1.5 km"]]
    },
    {
      id: "pn-104",
      title: "Pool Facing 5 BHK Luxury Villa with Private Lawn",
      type: "Villa", status: "buy",
      city: "Jaipur", location: "Queen's Road, Vaishali Extension, Jaipur, Rajasthan",
      price: 87500000, bedrooms: 5, bathrooms: 6, area: 4600,
      facing: "North", furnishing: "Fully Furnished", floor: "G + 1",
      possession: "Ready to Move", age: "1 Year Old", parking: "4 Covered",
      featured: true, agent: "ag-1",
      images: [8082328, 8135496, 28853343, 35021550, 7031594],
      description: "A contemporary villa built around a private pool and courtyard, finished with sandstone cladding, teak joinery and designer lighting. Ideal for a joint family or as a premium second home, with staff quarters and a double-height living room.",
      features: ["Private temperature-controlled pool", "Double-height living room", "Home theatre", "Staff quarters", "Sandstone & teak finishes", "Landscaped 1,800 sq.ft. lawn"],
      amenities: ["Private pool", "Home automation", "Gym room", "Piped gas", "Servant room", "Gated community", "Clubhouse access", "24x7 security", "EV charging point", "Rainwater harvesting"],
      nearby: [["Vaishali Nagar Market", "2.4 km"], ["Jaipur Junction", "6.8 km"], ["Maharaja Agrasen Business School", "3.1 km"], ["Fortis Hospital", "4.5 km"], ["Jaipur Airport", "12 km"]]
    },
    {
      id: "pn-105",
      title: "Premium 4 BHK Builder Floor in South Extension",
      type: "Builder Floor", status: "buy",
      city: "New Delhi", location: "South Extension Part 2, New Delhi",
      price: 52000000, bedrooms: 4, bathrooms: 4, area: 2200,
      facing: "Park Facing", furnishing: "Semi Furnished", floor: "2nd of 4",
      possession: "Ready to Move", age: "6 Years Old", parking: "1 Covered + 1 Open",
      featured: false, agent: "ag-2",
      images: [7031412, 7174386, 6434592, 7214450, 6758245],
      description: "A park-facing builder floor in the heart of South Delhi with only one apartment per floor, stilt parking and a lift. High ceilings, wide balcony and a layout that works beautifully for a family that entertains.",
      features: ["One apartment per floor", "Park facing balcony", "Stilt + open parking", "Lift & power backup", "Woodwork in all bedrooms"],
      amenities: ["Lift", "Power backup", "Water storage", "CCTV", "Visitor parking", "Park access", "Security guard", "Rooftop rights"],
      nearby: [["South Ex Market", "0.4 km"], ["AIIMS", "2.8 km"], ["INA Metro", "2.1 km"], ["Lodhi Garden", "3.6 km"], ["IGI Airport T3", "13 km"]]
    },
    {
      id: "pn-106",
      title: "Corner Residential Plot in Noida Sector 150",
      type: "Plot", status: "buy",
      city: "Noida", location: "Sector 150, Noida Expressway, Uttar Pradesh",
      price: 24000000, bedrooms: 0, bathrooms: 0, area: 2700,
      facing: "South-East", furnishing: "—", floor: "—",
      possession: "Immediate Registry", age: "—", parking: "Open",
      featured: false, agent: "ag-3",
      images: [32112592, 33572933, 38574684, 31722506],
      description: "A rare 300 sq.yd. south-east corner plot inside a fully developed gated sector with green belt on two sides. Ready for registry with boundary demarcation done — build your dream home or hold for appreciation on the Noida Expressway belt.",
      features: ["Corner plot — 2 side open", "300 sq.yd. (2,700 sq.ft.)", "Registry ready", "Green belt facing", "Levelled and demarcated"],
      amenities: ["Gated sector", "Underground electricity", "Wide 24m road", "Street lighting", "Drainage & sewer line", "Park nearby", "Security patrol", "Water supply line"],
      nearby: [["Noida-Greater Noida Expressway", "0.8 km"], ["Sector 148 Metro", "4.2 km"], ["Amity University", "6.5 km"], ["Galgotias University", "7 km"], ["Jewar Airport", "38 km"]]
    },
    {
      id: "pn-107",
      title: "High Street Retail Shop in Connaught Place",
      type: "Commercial Shop", status: "rent",
      city: "New Delhi", location: "Inner Circle, Connaught Place, New Delhi",
      price: 325000, bedrooms: 0, bathrooms: 2, area: 1200,
      facing: "Main Road", furnishing: "Bare Shell", floor: "Ground",
      possession: "Immediate", age: "Heritage Building", parking: "Paid Nearby",
      featured: false, agent: "ag-3",
      images: [30929605, 12547325, 28153483, 18761008],
      description: "Ground floor high-footfall retail space on the Inner Circle with a 22 ft glass frontage. Perfect for F&B, fashion, electronics or a flagship experience centre. Legacy tenant licence, transferable and immediately available.",
      features: ["22 ft glass frontage", "Ground floor main market", "Separate store & staff toilet", "3-phase power", "Heritage facade signage rights"],
      amenities: ["Air conditioning provision", "Fire safety system", "CCTV", "Service lift", "Public parking", "24x7 access", "Power backup (common)", "Housekeeping"],
      nearby: [["Rajiv Chowk Metro", "0.3 km"], ["New Delhi Railway Station", "3.1 km"], ["Janpath", "0.9 km"], ["IGI Airport T3", "14 km"], ["Connaught Place Central Park", "0.4 km"]]
    },
    {
      id: "pn-108",
      title: "Grade A Fully Furnished Office in BKC",
      type: "Office", status: "rent",
      city: "Mumbai", location: "G Block, Bandra Kurla Complex, Mumbai",
      price: 650000, bedrooms: 0, bathrooms: 4, area: 2400,
      facing: "Sea Facing", furnishing: "Fully Furnished", floor: "9th of 14",
      possession: "Immediate", age: "2 Years Old", parking: "4 Car Parks",
      featured: true, agent: "ag-3",
      images: [13219418, 38247895, 18468708, 33719774, 13762569],
      description: "Plug-and-play leased office in Mumbai's premier business district, fitted with 68 workstations, two cabins, a boardroom, phone booths and a server room. LEED Gold building with 100% DG backup — ideal for fintech, consulting and GCC teams.",
      features: ["68 workstations + 2 cabins", "Boardroom & 2 huddle rooms", "LEED Gold certified building", "100% DG power backup", "Dual fibre internet providers"],
      amenities: ["Central AC", "Managed reception", "Cafeteria", "Reserved car parks", "Building management system", "Access control", "Fire suppression", "Concierge", "Bicycle bay", "Shower pods"],
      nearby: [["BKC Metro Station", "0.6 km"], ["US Consulate", "1.2 km"], ["Jio World Centre", "0.9 km"], ["Kurla Station", "3.4 km"], ["Airport T1/T2", "6 km"]]
    },
    {
      id: "pn-109",
      title: "Logistics Warehouse with Dock Doors in Chakan MIDC",
      type: "Warehouse", status: "rent",
      city: "Pune", location: "MIDC Phase 2, Chakan, Pune, Maharashtra",
      price: 520000, bedrooms: 0, bathrooms: 6, area: 25000,
      facing: "West", furnishing: "Industrial Shell", floor: "Ground + Mezzanine",
      possession: "Within 30 Days", age: "3 Years Old", parking: "40 Wheeler Bay",
      featured: false, agent: "ag-3",
      images: [36006588, 34550874, 32390903, 3612341],
      description: "FM2 floor, 12 m clear height, 8 dock levellers and a 1,800 sq.ft. two-level office block. Built to FM Global standards inside Chakan MIDC with approvals for warehousing and light assembly. Ideal for 3PL, e-commerce and auto component clients.",
      features: ["12 m clear height", "FM2 grade flooring", "8 dock levellers", "1,800 sq.ft. office block", "FM Global compliant", "40 ft turning radius apron"],
      amenities: ["Fire hydrant system", "CCTV & security cabin", "Weighbridge", "Dedicated transformer", "Staff canteen", "Truck parking yard", "Rainwater harvesting", "Boundary wall", "Street lighting", "Dock shelters"],
      nearby: [["Chakan Chowk", "3.5 km"], ["NH-48 (Mumbai-Bengaluru)", "4.1 km"], ["Pune Railway Station", "28 km"], ["Talegaon MIDC", "12 km"], ["Pune Airport", "32 km"]]
    },
    {
      id: "pn-110",
      title: "Sea Facing 2 BHK Apartment in Bandra West",
      type: "Apartment", status: "rent",
      city: "Mumbai", location: "Carter Road, Bandra West, Mumbai, Maharashtra",
      price: 185000, bedrooms: 2, bathrooms: 2, area: 1150,
      facing: "West / Sea Facing", furnishing: "Fully Furnished", floor: "7th of 12",
      possession: "Immediate", age: "8 Years Old", parking: "1 Covered",
      featured: true, agent: "ag-2",
      images: [19584051, 8089172, 6434592, 6934170, 7166640],
      description: "A beautifully done-up sea facing 2 BHK on Carter Road, rented fully furnished with white goods, air conditioning and custom joinery. Walk out to the promenade, cafes and the Bandstand heritage stretch.",
      features: ["Sea facing living room & master bedroom", "Fully furnished with white goods", "Custom wardrobes & lighting", "Split AC in all rooms", "Society garden access"],
      amenities: ["Swimming pool", "Gym", "Intercom", "Covered parking", "24x7 security", "Housekeeping available", "Power backup", "Lift"],
      nearby: [["Carter Road Promenade", "0.2 km"], ["Bandra Station", "2.4 km"], ["Mount Mary Steps", "1.6 km"], ["Lilavati Hospital", "2.1 km"], ["Airport T2", "8 km"]]
    },
    {
      id: "pn-111",
      title: "Gated Community 4 BHK Villa for Rent in Kondapur",
      type: "Villa", status: "rent",
      city: "Hyderabad", location: "Botanical Garden Road, Kondapur, Hyderabad, Telangana",
      price: 275000, bedrooms: 4, bathrooms: 5, area: 3800,
      facing: "East", furnishing: "Semi Furnished", floor: "G + 2",
      possession: "Immediate", age: "2 Years Old", parking: "3 Covered",
      featured: false, agent: "ag-5",
      images: [7031598, 7174113, 30767888, 7587864, 7031602],
      description: "East-facing villa inside a 46-villa gated community with clubhouse, pool and 24x7 security. Private garden, home office nook and a family lounge — ten minutes from the Financial District and HITEC City.",
      features: ["Private garden & sit-out", "Home office / study nook", "Family lounge up", "Modular kitchen with chimney & hob", "Community clubhouse membership"],
      amenities: ["Clubhouse", "Swimming pool", "Gym", "Tennis court", "24x7 security", "Power backup", "Kids play area", "Sewage treatment plant", "Piped gas", "Visitor parking"],
      nearby: [["Botanical Garden Metro", "1.9 km"], ["HITEC City", "5.2 km"], ["Financial District", "6.8 km"], ["Delhi Public School", "2.2 km"], ["Citizens Hospital", "1.4 km"]]
    },
    {
      id: "pn-112",
      title: "Sunlit 2 BHK Starter Home in Hinjewadi Phase 2",
      type: "Apartment", status: "buy",
      city: "Pune", location: "Hinjewadi Phase 2, Pune, Maharashtra",
      price: 7800000, bedrooms: 2, bathrooms: 2, area: 980,
      facing: "North", furnishing: "Unfurnished", floor: "6th of 14",
      possession: "Dec 2026", age: "Under Construction", parking: "1 Covered",
      featured: true, agent: "ag-5",
      images: [31681835, 6758245, 6588581, 7214450],
      description: "An efficiently planned 2 BHK with zero wastage, large windows and a balcony overlooking the central greens. RERA registered, bank approved by all leading lenders and located inside the Hinjewadi IT corridor — a superb first home or rental asset.",
      features: ["Zero-wastage floor plan", "Balcony overlooking greens", "RERA registered project", "All bank loans approved", "Provision for modular kitchen"],
      amenities: ["Swimming pool", "Clubhouse", "Gymnasium", "Jogging track", "Kids play area", "Multipurpose court", "Solar water", "24x7 security", "Rainwater harvesting", "Society office"],
      nearby: [["Rajiv Gandhi IT Park", "2.3 km"], ["Hinjewadi Metro (proposed)", "1.8 km"], ["Aditya Birla Hospital", "4.6 km"], ["Indira College", "3.2 km"], ["Mumbai-Bengaluru Bypass", "3.9 km"]]
    },
    {
      id: "pn-113",
      title: "Pre-Leased Office Space in HITEC City",
      type: "Office", status: "buy",
      city: "Hyderabad", location: "Madhapur, HITEC City, Hyderabad, Telangana",
      price: 48000000, bedrooms: 0, bathrooms: 4, area: 3200,
      facing: "North", furnishing: "Fully Furnished", floor: "5th of 11",
      possession: "Ready with Tenant", age: "4 Years Old", parking: "6 Car Parks",
      featured: false, agent: "ag-3",
      images: [18468708, 29502230, 33719774, 13762569, 38247895],
      description: "A pre-leased, income-producing office asset leased to a listed IT company at ₹3.4 lakh per month with a 4.2% escalation and nine years remaining. Clean title, single owner, and an assured rental yield of approximately 8.5% per annum.",
      features: ["Pre-leased at ₹3.4 L/month", "9 year lease remaining", "4.2% annual escalation", "Approx. 8.5% rental yield", "Fully fitted with workstations"],
      amenities: ["Central AC", "6 reserved parks", "100% power backup", "Building management", "Access control", "Fire safety", "Cafeteria", "Lift lobby branding"],
      nearby: [["Cyber Towers", "0.7 km"], ["Raheja Mindspace", "1.9 km"], ["Durgam Cheruvu Metro", "1.4 km"], ["Inorbit Mall", "2.3 km"], ["RGIA Airport", "31 km"]]
    },
    {
      id: "pn-114",
      title: "Farmhouse Plot with Mango Orchard on Sohna Road",
      type: "Plot", status: "buy",
      city: "Gurugram", location: "Sohna Road, Sector 5, Sohna, Gurugram, Haryana",
      price: 16500000, bedrooms: 1, bathrooms: 2, area: 12000,
      facing: "North", furnishing: "Farmhouse Structure", floor: "G",
      possession: "Immediate Registry", age: "—", parking: "Open for 6 Cars",
      featured: false, agent: "ag-1",
      images: [38574684, 33572933, 31722506, 32112592],
      description: "A quarter-acre farmhouse holding with a mature mango orchard, tube well and a small caretaker unit, fifteen minutes from Golf Course Extension Road. Weekend-farm zoned with clean revenue record and boundary wall on three sides.",
      features: ["Mature mango orchard", "Tube well & underground tank", "Caretaker room + toilet", "Boundary wall on 3 sides", "Weekend farmhouse zoning"],
      amenities: ["Tube well", "Power connection", "Caretaker unit", "Internal paved driveway", "Water tank", "Fencing", "Open parking", "Fruit trees"],
      nearby: [["Golf Course Ext. Road", "9 km"], ["Sohna town", "3.4 km"], ["GD Goenka University", "6.1 km"], ["KMP Expressway", "5.7 km"], ["IGI Airport", "38 km"]]
    },
    {
      id: "pn-115",
      title: "Spacious 3 BHK Builder Floor for Families in Sector 57",
      type: "Builder Floor", status: "rent",
      city: "Gurugram", location: "Sushant Lok Phase 1, Sector 57, Gurugram, Haryana",
      price: 95000, bedrooms: 3, bathrooms: 3, area: 1850,
      facing: "East", furnishing: "Semi Furnished", floor: "1st of 3",
      possession: "Immediate", age: "5 Years Old", parking: "1 Covered",
      featured: false, agent: "ag-5",
      images: [7031407, 8135492, 7031879, 6987730, 6434592],
      description: "A well-maintained first-floor builder floor with a dedicated covered parking bay, private entrance and park view. Wardrobes, modular kitchen and ACs included — move in with just your suitcases.",
      features: ["Private entrance", "Covered car park", "Wardrobes in all rooms", "Modular kitchen with chimney", "5 split ACs included"],
      amenities: ["Lift", "Power backup", "Park facing", "Water supply", "CCTV", "Visitor parking", "Maintenance staff", "Intercom"],
      nearby: [["Sector 55-56 Rapid Metro", "1.2 km"], ["Golf Course Road", "2.4 km"], ["The Shri Ram School Aravali", "2.8 km"], ["Park Hospital", "1.9 km"], ["Cyber City", "6.5 km"]]
    },
    {
      id: "pn-116",
      title: "High Street Retail Showroom on MG Road",
      type: "Commercial Shop", status: "buy",
      city: "Bengaluru", location: "MG Road, Central Bengaluru, Karnataka",
      price: 39500000, bedrooms: 0, bathrooms: 3, area: 1800,
      facing: "Main Road", furnishing: "Bare Shell", floor: "Ground + Mezzanine",
      possession: "Immediate", age: "10 Years Old", parking: "2 Dedicated",
      featured: false, agent: "ag-3",
      images: [28153483, 12547325, 30929605, 18761008],
      description: "Free-hold ground floor plus mezzanine retail unit with double-height glazing on Bengaluru's most recognised shopping street. Currently vacant, ideal for an owner-occupier brand or an investor seeking a strong rental covenant.",
      features: ["Double-height glass frontage", "Ground + mezzanine layout", "Free-hold title", "3-phase industrial power", "Signage rights on facade"],
      amenities: ["Central AC provision", "Fire sprinklers", "Service lift", "Dedicated parking", "CCTV", "24x7 access", "Security", "Store room"],
      nearby: [["MG Road Metro", "0.2 km"], ["Trinity Circle", "1.1 km"], ["UB City", "1.8 km"], ["Commercial Street", "1.3 km"], ["Cubbon Park", "1.6 km"]]
    }
  ];

  /* --------------------------------------------------------- TAXONOMIES */
  P.CATEGORIES = [
    { name: "Apartments", type: "Apartment", icon: "fa-building", img: 24419854 },
    { name: "Houses", type: "House", icon: "fa-house-chimney", img: 7031600 },
    { name: "Villas", type: "Villa", icon: "fa-house-tsunami", img: 8082328 },
    { name: "Builder Floors", type: "Builder Floor", icon: "fa-layer-group", img: 7031412 },
    { name: "Plots", type: "Plot", icon: "fa-map-location-dot", img: 32112592 },
    { name: "Commercial Shops", type: "Commercial Shop", icon: "fa-store", img: 30929605 },
    { name: "Offices", type: "Office", icon: "fa-briefcase", img: 13219418 },
    { name: "Warehouses", type: "Warehouse", icon: "fa-warehouse", img: 36006588 }
  ];

  P.LOCATIONS = [
    { name: "Gurugram", region: "Golf Course Road & Cyber City", img: 37853145, avg: "₹1.8 Cr onwards" },
    { name: "Mumbai", region: "Powai, Bandra & BKC", img: 5414582, avg: "₹3.2 Cr onwards" },
    { name: "Bengaluru", region: "Whitefield, MG Road & Hebbal", img: 31713110, avg: "₹1.4 Cr onwards" },
    { name: "New Delhi", region: "South Ex, GK & CP", img: 2287335, avg: "₹2.6 Cr onwards" },
    { name: "Hyderabad", region: "HITEC City & Kondapur", img: 30471067, avg: "₹1.1 Cr onwards" },
    { name: "Pune", region: "Hinjewadi, Kharadi & Chakan", img: 9169886, avg: "₹85 L onwards" }
  ];

  P.SERVICES = [
    { icon: "fa-hand-holding-dollar", title: "Property Buying", text: "Shortlisting, site visits, negotiation, diligence and registration — we manage the entire buy-side journey for you.", points: ["Curated shortlists", "Price benchmarking", "Title & RERA verification", "Loan assistance"] },
    { icon: "fa-tags", title: "Property Selling", text: "Get the right price in the right time with professional photography, targeted marketing and qualified buyers only.", points: ["Free valuation", "Pro photography & walkthrough", "Buyer KYC & qualification", "Deal closure support"] },
    { icon: "fa-key", title: "Property Renting", text: "Whether you are a landlord or a tenant, we handle listings, screening, agreements and police verification.", points: ["Tenant screening", "Registered rent agreement", "Move-in inspection", "Renewal management"] },
    { icon: "fa-building-shield", title: "Property Management", text: "Complete asset care for NRI and out-of-city owners — rent collection, maintenance, audits and reporting.", points: ["Monthly rent collection", "Vendor & repair management", "Quarterly inspection reports", "Society liaison"] },
    { icon: "fa-house", title: "Residential Properties", text: "Apartments, houses, villas and builder floors matched to your family's budget, school zone and commute.", points: ["Family-first shortlisting", "School & hospital mapping", "Vastu preferences honoured", "Resale & new launch access"] },
    { icon: "fa-city", title: "Commercial Properties", text: "Offices, retail, showrooms and warehouses with yield analysis and tenant covenant assessment.", points: ["Yield & IRR modelling", "Pre-leased assets", "Lease structuring", "Fit-out coordination"] },
    { icon: "fa-chart-line", title: "Property Investment", text: "Build a property portfolio with data — micro-market research, entry pricing, exit planning and tax awareness.", points: ["Micro-market reports", "Portfolio planning", "Pre-launch allocation", "Exit & resale strategy"] },
    { icon: "fa-comments", title: "Free Consultation", text: "A no-obligation 30-minute call with a senior advisor to clarify budget, financing and the right next step.", points: ["Zero obligation", "Loan eligibility check", "Market outlook briefing", "Written action plan"] }
  ];

  P.TESTIMONIALS = [
    { name: "Ankit & Priya Sharma", role: "Bought a 3 BHK in Powai", img: 25651531, text: "We had almost given up on Mumbai after six months of searching. PrimeNest shortlisted five properties in a week and we closed on the third one — at ₹11 lakh below the quoted price. Absolutely flawless process." },
    { name: "Col. R. S. Bhatnagar", role: "Purchased a villa in Jaipur", img: 27972376, text: "As a serving officer posted out of state, I needed someone I could trust blindly. Every document was verified, every visit video-recorded and shared. The villa was exactly as described — not one promise was broken." },
    { name: "Meera Iyer", role: "NRI investor, Bengaluru", img: 34761515, text: "Their property management team has handled my Whitefield house for three years. Rent lands on the 3rd of every month, maintenance is photographed before and after. It is genuinely stress-free from 12,000 km away." },
    { name: "Vikram Sethi", role: "Leased office in BKC", img: 38740728, text: "Karan negotiated a 14% reduction on our BKC lease and got us four extra car parks thrown in. Our fit-out finished eleven days early. Best commercial advisory we have worked with." },
    { name: "Dr. Shalini Gupta", role: "Bought a plot in Noida", img: 8312669, text: "I was terrified of land deals. Neha's legal team ran the full title search and the registry was done in nine days. Transparent, patient and completely professional." },
    { name: "Farhan Qureshi", role: "Rented in Gurugram", img: 28442318, text: "Zero brokerage surprises, honest about every flaw in the flat and they got the landlord to repaint before handover. I have recommended them to four colleagues already." }
  ];

  P.TEAM = [
    { name: "Rajat Khanna", role: "Founder & Principal Consultant", img: 28442318, exp: "16 yrs" },
    { name: "Sanya Mehra", role: "Head of Residential Sales", img: 25651531, exp: "11 yrs" },
    { name: "Karan Bhatia", role: "Commercial & Investment", img: 38740728, exp: "13 yrs" },
    { name: "Neha Rawat", role: "Legal & Documentation", img: 34761515, exp: "9 yrs" },
    { name: "Aditya Verma", role: "Senior Property Consultant", img: 27972376, exp: "8 yrs" }
  ];

  P.STATS = [
    { n: 2400, suffix: "+", label: "Properties Sold" },
    { n: 16, suffix: "+", label: "Years Experience" },
    { n: 1200, suffix: "+", label: "Happy Families" },
    { n: 6, suffix: "", label: "Cities Covered" }
  ];

  P.WHY_US = [
    { icon: "fa-shield-halved", title: "Verified Listings Only", text: "Every property is physically visited, title-checked and RERA verified by our legal desk before it appears on PrimeNest." },
    { icon: "fa-handshake-angle", title: "Zero Hidden Charges", text: "One clear brokerage, disclosed in writing before we start. No inflated prices, no developer kickbacks, no surprises at registry." },
    { icon: "fa-scale-balanced", title: "Legal Due Diligence", text: "In-house advocates examine the chain of title, encumbrance certificate and approved plans before you pay a single rupee." },
    { icon: "fa-sack-dollar", title: "Best Price Negotiation", text: "Our advisors close at an average of 7% below the asking price — backed by live micro-market transaction data." },
    { icon: "fa-plane-departure", title: "NRI Desk", text: "Video walkthroughs, POA support, repatriation guidance and complete asset management for overseas buyers." },
    { icon: "fa-headset", title: "Lifetime Relationship", text: "Renting out, reselling, interiors or paperwork years later — your advisor stays one phone call away." }
  ];

  P.PROCESS = [
    { n: "01", title: "Discovery Call", text: "We understand your budget, family needs, commute and investment horizon in a free 30-minute consultation." },
    { n: "02", title: "Curated Shortlist", text: "You receive 4-6 matched properties with photos, price benchmarks and honest pros-and-cons — not a spam list." },
    { n: "03", title: "Site Visits", text: "Scheduled visits with a senior advisor, plus video walkthroughs for NRI and out-station clients." },
    { n: "04", title: "Legal & Negotiation", text: "We verify documents, negotiate on your behalf and issue a written diligence report before token money." },
    { n: "05", title: "Registration & Handover", text: "Loan disbursal, stamp duty, registry and possession — coordinated end to end until keys are in your hand." }
  ];

  P.FAQS = [
    { q: "Do you charge any fee for the first consultation?", a: "No. The first consultation, shortlisting and site visits are completely free. We charge a transparent brokerage only when your transaction is successfully completed, and the amount is always shared in writing upfront." },
    { q: "Are all listings on this website verified?", a: "Yes. Every listing is physically visited by our team, ownership documents are examined and RERA registration (where applicable) is checked before the property goes live. We delist anything that fails verification." },
    { q: "Can you help with a home loan?", a: "Absolutely. We work with all major banks and NBFCs and can arrange pre-approved eligibility checks, rate comparison and documentation support at no additional cost to you." },
    { q: "I live overseas. Can I buy without visiting India?", a: "Yes. Our NRI desk provides live video walkthroughs, digital documentation, Power of Attorney drafting, FEMA compliance guidance and post-purchase property management." },
    { q: "How quickly can I rent out my property through PrimeNest?", a: "Well-priced residential units in our core markets are typically rented within 21-35 days. We handle photography, listing, tenant screening, agreement registration and move-in inspection." }
  ];

  /* ------------------------------------------------------------ HELPERS */
  function inr(n) { return "₹" + n.toLocaleString("en-IN"); }

  P.priceLabel = function (p) {
    if (p.status === "rent") return inr(p.price) + "/mo";
    if (p.price >= 10000000) return "₹" + (p.price / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
    if (p.price >= 100000) return "₹" + (p.price / 100000).toFixed(2).replace(/\.00$/, "") + " Lakh";
    return inr(p.price);
  };
  P.priceLong = function (p) {
    return p.status === "rent" ? inr(p.price) + " per month" : inr(p.price);
  };
  P.areaLabel = function (p) {
    return p.type === "Plot" ? p.area.toLocaleString("en-IN") + " sq.ft. (" + Math.round(p.area / 9) + " sq.yd.)" : p.area.toLocaleString("en-IN") + " sq.ft.";
  };
  P.getById = function (id) {
    for (var i = 0; i < P.PROPERTIES.length; i++) { if (String(P.PROPERTIES[i].id) === String(id)) return P.PROPERTIES[i]; }
    return null;
  };
  P.countByType = function (type) {
    return P.PROPERTIES.filter(function (p) { return p.type === type; }).length;
  };
  P.countByCity = function (city) {
    return P.PROPERTIES.filter(function (p) { return p.city === city; }).length;
  };
  P.featured = function (limit) {
    var f = P.PROPERTIES.filter(function (p) { return p.featured; });
    return limit ? f.slice(0, limit) : f;
  };
  P.similar = function (p, limit) {
    var others = P.PROPERTIES.filter(function (x) { return x.id !== p.id; });
    others.sort(function (a, b) {
      var sa = (a.type === p.type ? 4 : 0) + (a.city === p.city ? 3 : 0) + (a.status === p.status ? 2 : 0);
      var sb = (b.type === p.type ? 4 : 0) + (b.city === p.city ? 3 : 0) + (b.status === p.status ? 2 : 0);
      return sb - sa;
    });
    return others.slice(0, limit || 3);
  };
  P.types = function () {
    var seen = {};
    P.PROPERTIES.forEach(function (p) { seen[p.type] = 1; });
    return Object.keys(seen).sort();
  };
  P.cities = function () {
    var seen = {};
    P.PROPERTIES.forEach(function (p) { seen[p.city] = 1; });
    return Object.keys(seen).sort();
  };
})(window.PRIME);
