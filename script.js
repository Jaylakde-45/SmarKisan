// ==========================================
// 1. DATABASE & SEED DATA (LocalStorage)
// ==========================================
function initDatabase() {
    if (!localStorage.getItem('smartKisan_Users')) {
        let users = [
            { id: 1, name: "Admin", email: "admin@kisan.com", password: "admin123", role: "admin" }
        ];
        localStorage.setItem('smartKisan_Users', JSON.stringify(users));
    }
    
    if (!localStorage.getItem('smartKisan_Diseases')) {
        let diseases = [
            { symptom: "Yellow Leaves", diagnosis: "Nitrogen Deficiency", remedy: "Apply Urea or Compost. Dosage: 50kg/acre." },
            { symptom: "White Spots", diagnosis: "Powdery Mildew", remedy: "Spray water + baking soda mix." }
        ];
        localStorage.setItem('smartKisan_Diseases', JSON.stringify(diseases));
    }

    if (!localStorage.getItem('smartKisan_Prices')) {
        let prices = { "Wheat": [2000, 2100, 2150, 2400], "Rice": [1800, 1900, 1700, 1750] };
        localStorage.setItem('smartKisan_Prices', JSON.stringify(prices));
    }
}

// ==========================================
// 2. AUTHENTICATION (Login / Register / Logout)
// ==========================================
function showAuthForm(formType) {
    document.getElementById('login-form').style.display = formType === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = formType === 'register' ? 'block' : 'none';
    document.querySelectorAll('.auth-box .tab-btn')[0].classList.toggle('active', formType === 'login');
    document.querySelectorAll('.auth-box .tab-btn')[1].classList.toggle('active', formType === 'register');
}

function registerUser() {
    let name = document.getElementById('regName').value;
    let email = document.getElementById('regEmail').value;
    let pass = document.getElementById('regPass').value;
    let role = document.getElementById('regRole').value;

    if (!name || !email || !pass) {
        document.getElementById('regMessage').innerText = "Please fill all fields!";
        return;
    }

    let users = JSON.parse(localStorage.getItem('smartKisan_Users'));
    if (users.find(u => u.email === email)) {
        document.getElementById('regMessage').innerText = "User already exists!";
        return;
    }

    let newUser = { id: Date.now(), name, email, password: pass, role };
    users.push(newUser);
    localStorage.setItem('smartKisan_Users', JSON.stringify(users));

    alert("Registration successful! Please Login.");
    showAuthForm('login');
}

function loginUser() {
    let email = document.getElementById('loginEmail').value;
    let pass = document.getElementById('loginPass').value;

    let users = JSON.parse(localStorage.getItem('smartKisan_Users'));
    let user = users.find(u => u.email === email && u.password === pass);

    if (user) {
        localStorage.setItem('smartKisan_CurrentUser', JSON.stringify(user));
        window.location.reload(); 
    } else {
        document.getElementById('authMessage').innerText = "Invalid email or password!";
    }
}

function logout() {
    localStorage.removeItem('smartKisan_CurrentUser');
    window.location.reload();
}

// ==========================================
// 3. DASHBOARD SWITCHING LOGIC
// ==========================================
function checkSession() {
    let currentUser = JSON.parse(localStorage.getItem('smartKisan_CurrentUser'));
    
    if (currentUser && currentUser.role === 'admin') {
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('farmer-dashboard').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadAdminData();
    } else if (currentUser && currentUser.role === 'farmer') {
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('farmer-dashboard').style.display = 'block';
        document.getElementById('farmerName').innerText = currentUser.name;
        loadFarmerDropdowns();
    } else {
        document.getElementById('auth-page').style.display = 'block';
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('farmer-dashboard').style.display = 'none';
    }
}

// ==========================================
// 4. ADMIN MANAGEMENT LOGIC
// ==========================================
function showAdminSection(sectionId) {
    let sections = document.querySelectorAll('.admin-tabs ~ .section');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    loadAdminData();
}

function loadAdminData() {
    // Load Users
    let users = JSON.parse(localStorage.getItem('smartKisan_Users'));
    let userListHtml = "<ul>";
    users.forEach(u => {
        userListHtml += `<li>${u.name} (${u.role}) - ${u.email} <button onclick="deleteUser(${u.id})" style="background:red;color:white;border:none;padding:5px;">Delete</button></li>`;
    });
    userListHtml += "</ul>";
    document.getElementById('usersList').innerHTML = userListHtml;

    // Load Prices
    let prices = JSON.parse(localStorage.getItem('smartKisan_Prices'));
    let priceListHtml = "<ul>";
    for (let crop in prices) {
        let price = prices[crop][prices[crop].length - 1];
        priceListHtml += `<li>${crop}: ₹${price}</li>`;
    }
    priceListHtml += "</ul>";
    document.getElementById('priceAdminList').innerHTML = priceListHtml;

    // Load Diseases
    let diseases = JSON.parse(localStorage.getItem('smartKisan_Diseases'));
    let diseaseListHtml = "<ul>";
    diseases.forEach(d => {
        diseaseListHtml += `<li>${d.symptom} - ${d.diagnosis}</li>`;
    });
    diseaseListHtml += "</ul>";
    document.getElementById('diseaseAdminList').innerHTML = diseaseListHtml;
}

function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem('smartKisan_Users'));
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('smartKisan_Users', JSON.stringify(users));
    loadAdminData();
}

function adminAddOrUpdatePrice() {
    let crop = document.getElementById('adminCropName').value;
    let price = parseInt(document.getElementById('adminCropPrice').value);
    let prices = JSON.parse(localStorage.getItem('smartKisan_Prices'));
    
    if(!prices[crop]) prices[crop] = [];
    prices[crop].push(price);
    
    localStorage.setItem('smartKisan_Prices', JSON.stringify(prices));
    alert("Price updated!");
    loadAdminData();
}

function adminAddDisease() {
    let symptom = document.getElementById('adminSymptom').value;
    let remedy = document.getElementById('adminRemedy').value;
    let diseases = JSON.parse(localStorage.getItem('smartKisan_Diseases'));
    
    diseases.push({ symptom: symptom, diagnosis: "Admin Added", remedy: remedy });
    
    localStorage.setItem('smartKisan_Diseases', JSON.stringify(diseases));
    alert("Disease added!");
    loadAdminData();
}

// ==========================================
// 5. FARMER DASHBOARD FUNCTIONS
// ==========================================

// *** THE FIXED loadFarmerDropdowns FUNCTION ***
function loadFarmerDropdowns() {
    // LOAD CROPS (with a safety fallback so it never shows empty)
    let prices = JSON.parse(localStorage.getItem('smartKisan_Prices'));
    if (!prices || Object.keys(prices).length === 0) {
        prices = { "Wheat": [2000, 2100, 2150, 2400], "Rice": [1800, 1900, 1700, 1750], "Cotton": [6000, 6100, 6200, 6400] };
        localStorage.setItem('smartKisan_Prices', JSON.stringify(prices));
    }
    
    let cropOptions = "";
    for (let crop in prices) {
        cropOptions += `<option>${crop}</option>`;
    }
    document.getElementById('priceCrop').innerHTML = cropOptions;

    // LOAD DISEASES (with a safety fallback)
    let diseases = JSON.parse(localStorage.getItem('smartKisan_Diseases'));
    if (!diseases || diseases.length === 0) {
        diseases = [
            { symptom: "Yellow Leaves", diagnosis: "Nitrogen Deficiency", remedy: "Apply Urea or Compost. Dosage: 50kg/acre." },
            { symptom: "White Spots", diagnosis: "Powdery Mildew", remedy: "Spray water + baking soda mix." },
            { symptom: "Curling", diagnosis: "Aphid Attack", remedy: "Spray neem oil solution (5ml per liter)." },
            { symptom: "Wilting", diagnosis: "Fusarium Wilt", remedy: "Remove infected plant, drench soil with Trichoderma." }
        ];
        localStorage.setItem('smartKisan_Diseases', JSON.stringify(diseases));
    }
    
    let diseaseOptions = "";
    diseases.forEach(d => { diseaseOptions += `<option>${d.symptom}</option>`; });
    document.getElementById('symptomInput').innerHTML = diseaseOptions;
}

function showTab(tabId) {
    let sections = document.querySelectorAll('#farmer-dashboard .section');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    document.getElementById(tabId).classList.add('active-section');

    let buttons = document.querySelectorAll('.sidebar .tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    let activeBtn = document.querySelector(`.sidebar .tab-btn[data-tab="${tabId}"]`);
    if(activeBtn) activeBtn.classList.add('active');
}

// Crop Planner
function getCropRecommendation() {
    let soil = document.getElementById("soilInput").value;
    let season = document.getElementById("seasonInput").value;
    let result = { crop: "Maize / Vegetables", match: 70, reason: "Safe fallback for any soil type." };

    if (soil === "Clay" && season === "Kharif") result = { crop: "Rice", match: 95, reason: "High water retention." };
    else if (soil === "Sandy" && season === "Rabi") result = { crop: "Potato / Onion", match: 90, reason: "Drainage needed." };
    else if (soil === "Loam" && season === "Zaid") result = { crop: "Maize", match: 98, reason: "Perfect balanced soil." };

    document.getElementById("resultBox").innerHTML = `<h3>🌱 ${result.crop}</h3><p>Match: ${result.match}%</p><p>${result.reason}</p>`;
}

// Plant Doctor
function diagnosePlant() {
    let symptom = document.getElementById("symptomInput").value;
    let diseases = JSON.parse(localStorage.getItem('smartKisan_Diseases'));
    let result = diseases.find(x => x.symptom === symptom);

    let html = `<h4>Diagnosis: ${result.diagnosis}</h4><p>Remedy: ${result.remedy}</p>`;
    document.getElementById("doctorBox").innerHTML = html;
}

// Market Price
function checkMarketPrice() {
    let crop = document.getElementById("priceCrop").value;
    let prices = JSON.parse(localStorage.getItem('smartKisan_Prices'));
    let allPrices = prices[crop];
    let lastPrice = allPrices[allPrices.length - 1];
    let avg = allPrices.reduce((a,b)=>a+b, 0) / allPrices.length;

    let msg = (lastPrice > avg * 1.15) ? `📈 Sell ${crop} NOW at ₹${lastPrice/100} per kg!` : `📉 Price is low (₹${lastPrice/100} per kg). Hold stock.`;
    document.getElementById("priceBox").innerHTML = msg + `<br><small>Offline data.</small>`;
}

async function fetchLivePrice() {
    let crop = document.getElementById("priceCrop").value;
    document.getElementById("priceBox").innerText = "⏳ Fetching...";
    try {
        let response = await fetch(`https://mandi-api.onrender.com/v1/prices?state=Maharashtra&commodity=${crop}`);
        let data = await response.json();
        let livePrice = data.markets[0].modal_price;
        document.getElementById("priceBox").innerHTML = `✅ Live Price: ₹${livePrice/100} per kg (${data.markets[0].market})`;
    } catch (error) {
        checkMarketPrice();
    }
}

// Irrigation
function checkIrrigation() {
    let crop = document.getElementById("cropType").value;
    let soil = document.getElementById("soilTypeIrrigation").value;
    let moisture = parseInt(document.getElementById("moisture").value) || 50;
    let rainfall = document.getElementById("rainfall").value;

    let cropNeed = 50;
    if (crop === "Rice") cropNeed = 60;
    if (crop === "Sugarcane") cropNeed = 65;
    if (crop === "Onion") cropNeed = 35;

    if (soil === "Clay") cropNeed -= 10;
    if (soil === "Sandy") cropNeed += 10;
    if (rainfall === "High") cropNeed -= 15;

    if (rainfall === "High") {
        document.getElementById("irrigationBox").innerHTML = "🚫 Do NOT water today! Heavy rain detected.";
    } else if (moisture < cropNeed - 10) {
        document.getElementById("irrigationBox").innerHTML = `🚨 Critical! Turn on pump immediately (Target: ${cropNeed}%).`;
    } else {
        document.getElementById("irrigationBox").innerHTML = `✅ Soil moisture is balanced. Conserve water.`;
    }
}

// Initialize on Load
initDatabase();
checkSession();