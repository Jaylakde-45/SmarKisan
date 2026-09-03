// MASTER KNOWLEDGE BASE (All inclusive)

// 1. SOIL DATABASE (Alluvial, Black, Red, Laterite, Desert, Clay, Sandy, Loam, Peaty, Saline)
const soilTypes = {
    "Alluvial": { retention: "High", crops: ["Rice", "Wheat", "Sugarcane", "Maize"] },
    "Black (Regur)": { retention: "Very High", crops: ["Cotton", "Soybean", "Sorghum", "Pulses"] },
    "Red": { retention: "Low", crops: ["Groundnut", "Millet", "Potato", "Onion"] },
    "Laterite": { retention: "Low", crops: ["Tea", "Coffee", "Cashew", "Rubber"] },
    "Arid (Desert)": { retention: "Very Low", crops: ["Bajra", "Guar", "Millet", "Dates"] },
    "Clay": { retention: "Very High", crops: ["Rice", "Paddy", "Wheat"] },
    "Sandy": { retention: "Very Low", crops: ["Potato", "Onion", "Groundnut", "Watermelon"] },
    "Loam": { retention: "Medium", crops: ["Maize", "Vegetables", "Tomato", "Brinjal"] },
    "Peaty": { retention: "Very High", crops: ["Moss", "Vegetables", "Rice"] },
    "Saline": { retention: "Low", crops: ["Barley", "Spinach", "Date Palm"] }
};

// 2. DISEASE & PEST DOCTOR DATABASE
const diseaseData = [
    { symptom: "Yellow Leaves", diagnosis: "Nitrogen Deficiency", remedy: "Apply Urea or Compost. Dosage: 50kg/acre.", severity: "Medium" },
    { symptom: "White Spots", diagnosis: "Powdery Mildew", remedy: "Spray water + baking soda mix (1 tsp per liter).", severity: "High" },
    { symptom: "Curling", diagnosis: "Aphid Attack", remedy: "Spray neem oil solution (5ml per liter).", severity: "Medium" },
    { symptom: "Brown Spots", diagnosis: "Early Blight", remedy: "Spray copper fungicide or neem extract.", severity: "High" },
    { symptom: "Wilting", diagnosis: "Fusarium Wilt", remedy: "Remove infected plant, drench soil with Trichoderma.", severity: "Critical" },
    { symptom: "Stunted Growth", diagnosis: "Root Knot Nematodes", remedy: "Apply neem cake or mustard cake in soil.", severity: "High" },
    { symptom: "Root Rot", diagnosis: "Overwatering/Fungal", remedy: "Stop irrigation, apply fungicide to roots.", severity: "Critical" },
    { symptom: "Rust (Brown Powder)", diagnosis: "Rust Fungus", remedy: "Spray sulfur-based fungicide.", severity: "Medium" },
    { symptom: "Moldy Leaves", diagnosis: "Downy Mildew", remedy: "Spray Bordeaux mixture or baking soda.", severity: "High" }
];

// 3. MANDI PRICE DATABASE (Prices in INR per Quintal)
const priceData = { 
    "Wheat": [2000, 2100, 2150, 2400], 
    "Rice": [1800, 1900, 1700, 1750],
    "Cotton": [6000, 6100, 6200, 6400],
    "Potato": [800, 850, 900, 1200],
    "Onion": [1000, 1100, 1500, 1400],
    "Maize": [1900, 1950, 2000, 2100]
};