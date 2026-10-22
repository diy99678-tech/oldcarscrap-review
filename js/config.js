// Business details. Change this file for another shop; nothing else needs editing.
export const CONFIG = {
  name: "oldcarscrap",
  tagline: "Car · Truck · Bus scrap",
  address: "4 Chandmari, Et Bhatta, Dhar Rd, Indore, MP 452002",
  reviewUrl: "https://g.page/r/CWT614wkHmw0EBE/review",

  // How a customer might name the business / place inside a review.
  nameForms: ["oldcarscrap", "Old Car Scrap", "oldcarscrap wale", "oldcarscrap ki team"],
  places: ["Indore", "Indore", "Dhar Road, Indore"],

  // Optional: Supabase project that remembers which texts were already used, on every phone.
  // Empty = each phone remembers only its own (still practically never repeats; see README).
  supabaseUrl: "",
  supabaseKey: "", // the publishable / anon key, never the secret key
};
