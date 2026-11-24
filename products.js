/* =====================================================================
   PRODUCTS LIST  (yahan se saare products control hote hain)

   NAYA PRODUCT ADD KARNE KE LIYE: neeche koi ek { ... }, line copy karo,
   uske neeche paste karo, aur text badal do. Comma (,) lagana mat bhoolna.

   Har product me:
     name      : product ka naam                       (zaruri)
     category  : category ka naam                      (zaruri)
                 -> nayi category likhoge to site par apne aap
                    naya filter button ban jayega
     desc      : chhota description                    (zaruri)
     image     : photo ka naam, e.g. "ply-19mm.jpg"    (optional)
                 photo nahi doge to wood-texture dikhega

   YE SAB SAMPLE PRODUCTS HAIN. Apne asli products se badal lena.
   ===================================================================== */

const PRODUCTS = [
  // ---------- Plywood ----------
  { name: "Marine Plywood (BWP)", category: "Plywood", desc: "Waterproof and termite resistant. Ideal for kitchens, bathrooms and wardrobes. Thickness 4mm to 25mm." },
  { name: "Commercial Plywood", category: "Plywood", desc: "Budget friendly plywood for interior furniture, partitions and everyday use." },
  { name: "Shuttering Plywood", category: "Plywood", desc: "Strong plywood for construction and concrete shuttering work." },

  // ---------- Laminates & Veneers ----------
  { name: "Decorative Laminates", category: "Laminates", desc: "Wood grains, solid colours and textured finishes in hundreds of designs." },
  { name: "High Gloss Laminates", category: "Laminates", desc: "Mirror-like glossy finish for modern kitchens and wardrobes." },
  { name: "Natural Veneers", category: "Laminates", desc: "Real wood veneers for a rich, premium look." },
  { name: "Edge Bands", category: "Laminates", desc: "Matching edge tapes to give furniture a clean, finished edge." },

  // ---------- Doors & Frames ----------
  { name: "Flush Doors", category: "Doors", desc: "Solid, smooth flush doors for bedrooms and bathrooms." },
  { name: "Membrane / PVC Doors", category: "Doors", desc: "Moisture resistant doors with attractive designs. Easy to maintain." },
  { name: "Door Frames", category: "Doors", desc: "Sturdy wooden and engineered frames in standard and custom sizes." },

  // ---------- Hardware & Fittings ----------
  { name: "Hinges & Drawer Channels", category: "Hardware", desc: "Soft-close hinges, telescopic channels and cabinet fittings." },
  { name: "Handles & Knobs", category: "Hardware", desc: "Steel, brass and designer handles for doors, drawers and cabinets." },
  { name: "Locks & Latches", category: "Hardware", desc: "Door locks, cabinet locks, tower bolts and latches." },
  { name: "Screws & Fasteners", category: "Hardware", desc: "Wood screws, nails, bolts and anchors in all sizes." },

  // ---------- Adhesives & Polish ----------
  { name: "Wood Adhesives", category: "Adhesives & Polish", desc: "Strong bonding adhesives for plywood, laminates and furniture work." },
  { name: "Wood Polish & Finishes", category: "Adhesives & Polish", desc: "Melamine, PU and lacquer finishes for a lasting shine." },
  { name: "Putty & Sealants", category: "Adhesives & Polish", desc: "Wood putty, fillers and sealants for a smooth surface." },

  // ---------- Boards & Sheets ----------
  { name: "MDF Board", category: "Boards", desc: "Smooth, uniform board for painted and laminated furniture." },
  { name: "Particle Board", category: "Boards", desc: "Economical board for modular and office furniture." },
  { name: "HDHMR Board", category: "Boards", desc: "High density, moisture resistant board for modern modular work." },
  { name: "Block Board", category: "Boards", desc: "Strong, lightweight board for tables, doors and shelves." }
];
