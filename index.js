// --- DONNEES ---
const palettes = {
    "Classique": ["#4a1a1a", "#1a2b4a", "#1a4a2b", "#4a4a4a", "#222222", "#6e2626", "#263f6e", "#266e3f", "#6e6e6e", "#333333", "#943535", "#355494", "#359453", "#949494", "#444444", "#ba4545", "#4569ba", "#45ba69", "#bababa", "#555555", "#db5e5e", "#5e8adb", "#5edb8a", "#dbdbdb", "#666666", "#ff7a7a", "#7aaeff", "#7affae", "#ffffff", "#777777", "#ffa3a3", "#a3caff", "#a3ffca", "#eeeeee", "#888888", "#ffcccc", "#cce0ff", "#ccffe0", "#dddddd", "#999999", "#ffe6e6", "#e6f0ff", "#e6fff0", "#cccccc", "#aaaaaa"],
    "Fumée": generateGradient("#000000", "#ffffff", 90),
    "Orokin": ["#e3dac9", "#f5f5f5", "#ffffff", "#1a2c38", "#0f1a21", "#d4af37", "#f0d57a", "#fff2cc", "#253b4a", "#15222b", "#b59326", "#d9bd62", "#f7ebc6", "#344e5e", "#1e313d", "#8c721d", "#bfa656", "#eee3c1", "#446275", "#2a4252", "#e8e8e8", "#fdfdfd", "#ffffff", "#00bcd4", "#008ba3", "#c0c0c0", "#e0e0e0", "#ffffff", "#00e5ff", "#00acc1", "#a0a0a0", "#cccccc", "#eeeeee", "#4dd0e1", "#26c6da"],
    "Halloween": ["#ff6600", "#cc5200", "#331400", "#2b3b08", "#1a2405", "#ff3300", "#990000", "#4a0404", "#425c0c", "#283807", "#ff0000", "#660000", "#2e0202", "#5c8011", "#3b520a", "#ff9900", "#e68a00", "#663d00", "#78a616", "#4e6b0d", "#ffcc00", "#ffaa00", "#996600", "#92cc1b", "#5e8010", "#330000", "#4d0000", "#660000", "#ccff33", "#aaff00"]
};

let currentSlotId = null;
let currentPalette = 'Classique';

// --- NAVIGATION UI ---
// Gère les états : 'main', 'accessories', 'syandana'
function navTo(target) {
    const container = document.getElementById('leftContainer');
    // Reset
    container.classList.remove('state-accessories', 'state-syandana');
    
    if (target === 'accessories') {
        container.classList.add('state-accessories');
    } else if (target === 'syandana') {
        container.classList.add('state-syandana');
    }
    // Si 'main', on a déjà tout retiré, donc c'est bon.

    // Fermer palette couleur au changement de menu
    closePalette();
}

// --- COULEURS ---
function openPalettePicker(slotId, element) {
    currentSlotId = slotId;
    document.querySelectorAll('.slot-row').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('palettePanel').classList.add('open');
}

function closePalette() {
    document.getElementById('palettePanel').classList.remove('open');
    document.querySelectorAll('.slot-row').forEach(el => el.classList.remove('active'));
}

function applyColor(hex) {
    if (!currentSlotId) return;

    const box = document.getElementById(`box-${currentSlotId}`);
    if (box) {
        box.style.backgroundColor = hex;
        box.style.boxShadow = `0 0 10px ${hex}`;
    }

    // Gestion "Energy"
    if (currentSlotId.includes('energy')) {
        document.documentElement.style.setProperty('--energy-color', hex);
    }
    // Teinte légère image si c'est la couleur principale Warframe
    if (currentSlotId === 'wf-primary') {
         document.getElementById('mainImage').style.filter = `drop-shadow(0 0 5px ${hex})`;
    }
}

// --- INIT ---
window.onload = () => {
    renderTabs();
    renderGrid(currentPalette);
    document.documentElement.style.setProperty('--energy-color', '#00e5ff');
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