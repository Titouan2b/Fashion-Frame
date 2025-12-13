const palettes = {
    "Classique": ["#4a1a1a", "#1a2b4a", "#1a4a2b", "#4a4a4a", "#222222", "#6e2626", "#263f6e", "#266e3f", "#6e6e6e", "#333333", "#943535", "#355494", "#359453", "#949494", "#444444", "#ba4545", "#4569ba", "#45ba69", "#bababa", "#555555", "#db5e5e", "#5e8adb", "#5edb8a", "#dbdbdb", "#666666", "#ff7a7a", "#7aaeff", "#7affae", "#ffffff", "#777777", "#ffa3a3", "#a3caff", "#a3ffca", "#eeeeee", "#888888", "#ffcccc", "#cce0ff", "#ccffe0", "#dddddd", "#999999", "#ffe6e6", "#e6f0ff", "#e6fff0", "#cccccc", "#aaaaaa"],
    "Fumée": generateGradient("#000000", "#ffffff", 90),
    "Orokin": ["#e3dac9", "#f5f5f5", "#ffffff", "#1a2c38", "#0f1a21", "#d4af37", "#f0d57a", "#fff2cc", "#253b4a", "#15222b", "#b59326", "#d9bd62", "#f7ebc6", "#344e5e", "#1e313d", "#8c721d", "#bfa656", "#eee3c1", "#446275", "#2a4252", "#e8e8e8", "#fdfdfd", "#ffffff", "#00bcd4", "#008ba3", "#c0c0c0", "#e0e0e0", "#ffffff", "#00e5ff", "#00acc1", "#a0a0a0", "#cccccc", "#eeeeee", "#4dd0e1", "#26c6da"],
    "Halloween": ["#ff6600", "#cc5200", "#331400", "#2b3b08", "#1a2405", "#ff3300", "#990000", "#4a0404", "#425c0c", "#283807", "#ff0000", "#660000", "#2e0202", "#5c8011", "#3b520a", "#ff9900", "#e68a00", "#663d00", "#78a616", "#4e6b0d", "#ffcc00", "#ffaa00", "#996600", "#92cc1b", "#5e8010", "#330000", "#4d0000", "#660000", "#ccff33", "#aaff00"]
};

let currentSlotId = null;
let currentPalette = 'Classique';

function navTo(target) {
    const container = document.getElementById('leftContainer');
    // On retire toutes les classes d'état
    container.classList.remove('state-accessories', 'state-syandana', 'state-regalia');
    
    if (target === 'accessories') container.classList.add('state-accessories');
    else if (target === 'syandana') container.classList.add('state-syandana');
    else if (target === 'regalia') container.classList.add('state-regalia');
    
    closePalette();
}

// Met à jour l'affichage du chiffre quand on bouge le slider
function updateSliderVal(input) {
    // Le span est juste après l'input dans le HTML
    input.nextElementSibling.innerText = parseFloat(input.value).toFixed(2);
}

function openPalettePicker(slotId, element) {
    currentSlotId = slotId;
    if (!slotId.match(/-[12]$/)) {
         document.querySelectorAll('.slot-row').forEach(el => el.classList.remove('active'));
         element.classList.add('active');
    }
    document.getElementById('palettePanel').classList.add('open');
    if(event) event.stopPropagation();
}

function closePalette() {
    document.getElementById('palettePanel').classList.remove('open');
    document.querySelectorAll('.slot-row').forEach(el => el.classList.remove('active'));
}

function applyColor(hex) {
    if (!currentSlotId) return;
    updateColorBox(currentSlotId, hex);
}

function updateColorBox(slotId, hex) {
    const box = document.getElementById(`box-${slotId}`);
    if (box) {
        box.style.backgroundColor = hex;
        box.style.boxShadow = `0 0 10px ${hex}`;
        box.style.borderColor = 'white';
    }
    if (slotId === 'wf-energy-1') document.documentElement.style.setProperty('--energy-1', hex);
    if (slotId === 'wf-energy-2') document.documentElement.style.setProperty('--energy-2', hex);
    if (slotId === 'wf-primary') document.getElementById('mainImage').style.filter = `drop-shadow(0 0 5px ${hex})`;
}

window.onload = () => {
    renderTabs();
    renderGrid(currentPalette);
    if(localStorage.getItem('warframeConfig')) {
        loadConfig();
    }
};

function renderTabs() {
    const container = document.getElementById('paletteTabs');
    container.innerHTML = '';
    Object.keys(palettes).forEach(name => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${name === currentPalette ? 'active' : ''}`;
        btn.innerText = name;
        btn.onclick = () => { currentPalette = name; renderTabs(); renderGrid(name); };
        container.appendChild(btn);
    });
}

function renderGrid(paletteName) {
    const container = document.getElementById('colorGrid');
    container.innerHTML = '';
    palettes[paletteName].forEach(color => {
        const div = document.createElement('div');
        div.className = 'color-swatch';
        div.style.backgroundColor = color;
        div.onclick = () => applyColor(color);
        container.appendChild(div);
    });
}

function generateGradient(start, end, steps) {
    let arr = [];
    for (let i = 0; i < steps; i++) {
        const int = Math.floor((255 * i) / steps);
        const h = int.toString(16).padStart(2, '0');
        arr.push(`#${h}${h}${h}`);
    }
    return arr;
}

// --- GESTION DES DONNEES ---
const colorSlots = [
    'wf-primary', 'wf-secondary', 'wf-tertiary', 'wf-accents', 
    'wf-emissive-1', 'wf-emissive-2', 'wf-energy-1', 'wf-energy-2',
    'acc-primary', 'acc-secondary', 'acc-tertiary', 'acc-accents',
    'acc-emissive-1', 'acc-emissive-2', 'acc-energy-1', 'acc-energy-2',
    'syn-primary', 'syn-secondary', 'syn-tertiary', 'syn-accents',
    'syn-emissive-1', 'syn-emissive-2', 'syn-energy-1', 'syn-energy-2'
];

const textInputs = [
    'input-aspect', 'input-helm', 'input-animation',
    'input-torso', 'input-larm', 'input-rarm', 'input-lleg', 'input-rleg', 
    'input-aux', 'input-ephemera', 'input-signa', 'input-syandana',
    'input-badge-l', 'input-badge-r', 'input-sigil-f', 'input-sigil-b'
];

// Nouveaux inputs pour les sliders
const sliderInputs = [
    'input-regalia-slider-1', 'input-regalia-slider-2', 'input-regalia-slider-3',
    'input-regalia-slider-4', 'input-regalia-slider-5', 'input-regalia-slider-6'
];

function saveConfig() {
    const config = { colors: {}, texts: {}, sliders: {} };
    
    colorSlots.forEach(id => {
        const box = document.getElementById(`box-${id}`);
        config.colors[id] = box.style.backgroundColor; 
    });
    
    textInputs.forEach(id => {
        const input = document.getElementById(id);
        config.texts[id] = input.value;
    });
    
    // Sauvegarde des sliders
    sliderInputs.forEach(id => {
        const input = document.getElementById(id);
        config.sliders[id] = input.value;
    });

    localStorage.setItem('warframeConfig', JSON.stringify(config));
    showFlash("SAUVEGARDE RÉUSSIE");
}

function loadConfig() {
    const data = localStorage.getItem('warframeConfig');
    if (!data) {
        showFlash("AUCUNE SAUVEGARDE");
        return;
    }
    const config = JSON.parse(data);
    
    if (config.colors) {
        for (const [id, color] of Object.entries(config.colors)) {
            if(color) updateColorBox(id, color);
        }
    }
    if (config.texts) {
        for (const [id, text] of Object.entries(config.texts)) {
            const input = document.getElementById(id);
            if (input) input.value = text;
        }
    }
    if (config.sliders) {
        for (const [id, val] of Object.entries(config.sliders)) {
            const input = document.getElementById(id);
            if (input) {
                input.value = val;
                // Met aussi à jour le texte à côté
                updateSliderVal(input);
            }
        }
    }
    showFlash("CONFIGURATION CHARGÉE");
}

function resetConfig() {
    if(confirm("Voulez-vous vraiment tout effacer ?")) {
        localStorage.removeItem('warframeConfig');
        
        // Reset Textes
        textInputs.forEach(id => {
            const input = document.getElementById(id);
            if(input) input.value = '';
        });

        // Reset Couleurs
        colorSlots.forEach(id => {
            const box = document.getElementById(`box-${id}`);
            if (box) {
                box.style.backgroundColor = ''; 
                box.style.boxShadow = '';
                box.style.borderColor = '';
            }
        });

        // Reset Sliders
        sliderInputs.forEach(id => {
            const input = document.getElementById(id);
            if(input) {
                input.value = 0.5;
                updateSliderVal(input); // Remet le texte à 0.50
            }
        });

        // Reset Visuels
        document.documentElement.style.setProperty('--energy-1', 'transparent');
        document.documentElement.style.setProperty('--energy-2', 'transparent');
        const img = document.getElementById('mainImage');
        if (img) img.style.filter = '';

        showFlash("RÉINITIALISATION TERMINÉE");
    }
}

function showFlash(msg) {
    const el = document.getElementById('flashMsg');
    el.innerText = msg;
    el.style.opacity = 1;
    setTimeout(() => { el.style.opacity = 0; }, 2000);
}