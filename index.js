const palettes = {
    "Classique": ["#4a1a1a", "#1a2b4a", "#1a4a2b", "#4a4a4a", "#222222", "#6e2626", "#263f6e", "#266e3f", "#6e6e6e", "#333333", "#943535", "#355494", "#359453", "#949494", "#444444", "#ba4545", "#4569ba", "#45ba69", "#bababa", "#555555", "#db5e5e", "#5e8adb", "#5edb8a", "#dbdbdb", "#666666", "#ff7a7a", "#7aaeff", "#7affae", "#ffffff", "#777777", "#ffa3a3", "#a3caff", "#a3ffca", "#eeeeee", "#888888", "#ffcccc", "#cce0ff", "#ccffe0", "#dddddd", "#999999", "#ffe6e6", "#e6f0ff", "#e6fff0", "#cccccc", "#aaaaaa"],
    "Fumée": generateGradient("#000000", "#ffffff", 90),
    "Orokin": ["#e3dac9", "#f5f5f5", "#ffffff", "#1a2c38", "#0f1a21", "#d4af37", "#f0d57a", "#fff2cc", "#253b4a", "#15222b", "#b59326", "#d9bd62", "#f7ebc6", "#344e5e", "#1e313d", "#8c721d", "#bfa656", "#eee3c1", "#446275", "#2a4252", "#e8e8e8", "#fdfdfd", "#ffffff", "#00bcd4", "#008ba3", "#c0c0c0", "#e0e0e0", "#ffffff", "#00e5ff", "#00acc1", "#a0a0a0", "#cccccc", "#eeeeee", "#4dd0e1", "#26c6da"],
    "Halloween": ["#ff6600", "#cc5200", "#331400", "#2b3b08", "#1a2405", "#ff3300", "#990000", "#4a0404", "#425c0c", "#283807", "#ff0000", "#660000", "#2e0202", "#5c8011", "#3b520a", "#ff9900", "#e68a00", "#663d00", "#78a616", "#4e6b0d", "#ffcc00", "#ffaa00", "#996600", "#92cc1b", "#5e8010", "#330000", "#4d0000", "#660000", "#ccff33", "#aaff00"]
};

let currentSlotId = null;
let currentPalette = 'Classique';
let activeApp = null; 

// --- GESTION IMAGE ---
function triggerUpload() { document.getElementById('imageInput').click(); }

function handleImageUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgId = activeApp === 'warframe' ? 'img-wf' : 'img-op';
            document.getElementById(imgId).src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// --- NAVIGATION ---
function startApp(mode) {
    activeApp = mode;
    document.getElementById('landing-page').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('landing-page').style.display = 'none';
        document.querySelector('.system-panel').style.display = 'flex';
    }, 500);
    document.querySelectorAll('.app-container').forEach(el => el.classList.remove('active'));
    if (mode === 'warframe') document.getElementById('app-warframe').classList.add('active');
    else document.getElementById('app-operator').classList.add('active');
}

function exitToMenu() {
    activeApp = null;
    document.getElementById('landing-page').style.display = 'flex';
    setTimeout(() => document.getElementById('landing-page').style.opacity = '1', 10);
    document.querySelectorAll('.app-container').forEach(el => el.classList.remove('active'));
    resetViewClasses();
    closePalette();
}

function resetViewClasses() {
    document.querySelectorAll('.left-panel-container').forEach(el => { el.className = 'left-panel-container'; });
    document.querySelectorAll('.menu-layer').forEach(l => { l.removeAttribute('style'); });
}

function navTo(target) {
    const panel = document.querySelector('.app-container.active .left-panel-container');
    if(!panel) return;
    if (activeApp === 'warframe') { showLayer(panel, 'menu-' + target, 'menu-wf-main'); } 
    else {
        if (target === 'op-main') { showLayer(panel, 'menu-op-main'); return; }
        if (target === 'op-clothing') { showLayer(panel, 'menu-op-clothing', 'menu-op-main'); return; }
        if (target === 'op-traits') { showLayer(panel, 'menu-op-traits', 'menu-op-main'); return; }
        if (['op-face-acc', 'op-suit', 'op-regalia', 'op-anim', 'op-attachments', 'op-syandana'].includes(target)) { showLayer(panel, 'menu-' + target, 'menu-op-clothing'); return; }
        if (target.startsWith('op-trait-')) { showLayer(panel, 'menu-' + target, 'menu-op-traits'); return; }
        showLayer(panel, 'menu-' + target, 'menu-wf-main');
    }
    closePalette();
}

function showLayer(container, targetId, parentId = null) {
    const layers = container.querySelectorAll('.menu-layer');
    layers.forEach(l => {
        if (l.id === targetId) { l.style.transform = 'translateX(0)'; l.style.opacity = '1'; l.style.pointerEvents = 'auto'; } 
        else if (l.id === parentId) { l.style.transform = 'translateX(-50%)'; l.style.opacity = '0'; l.style.pointerEvents = 'none'; } 
        else { l.style.transform = 'translateX(100%)'; l.style.opacity = '0'; l.style.pointerEvents = 'none'; }
    });
}

function updateVal(input) { input.nextElementSibling.innerText = parseFloat(input.value).toFixed(2); }

function openPalette(slotId, element) {
    currentSlotId = slotId;
    if (!slotId.match(/-[12]$/)) { document.querySelectorAll('.slot-row').forEach(el => el.classList.remove('active')); if(element) element.classList.add('active'); }
    document.getElementById('palettePanel').classList.add('open');
    if(event) event.stopPropagation();
}
function closePalette() { document.getElementById('palettePanel').classList.remove('open'); document.querySelectorAll('.slot-row').forEach(el => el.classList.remove('active')); }

function applyColor(hex) {
    if (!currentSlotId) return;
    const box = document.getElementById(`box-${currentSlotId}`);
    if (box) { box.style.backgroundColor = hex; box.style.boxShadow = `0 0 10px ${hex}`; box.style.borderColor = 'white'; }
    const prefix = activeApp === 'warframe' ? 'wf' : 'op';
    if (currentSlotId.includes(`${prefix}-energy-1`)) document.documentElement.style.setProperty('--energy-1', hex);
    if (currentSlotId.includes(`${prefix}-energy-2`)) document.documentElement.style.setProperty('--energy-2', hex);
}

// --- INIT ---
window.onload = () => {
    renderTabs(); renderGrid(currentPalette);
    document.querySelector('.system-panel').style.display = 'none';
};
function renderTabs() {
    const container = document.getElementById('paletteTabs'); container.innerHTML = '';
    Object.keys(palettes).forEach(name => { const btn = document.createElement('button'); btn.className = `tab-btn ${name === currentPalette ? 'active' : ''}`; btn.innerText = name; btn.onclick = () => { currentPalette = name; renderTabs(); renderGrid(name); }; container.appendChild(btn); });
}
function renderGrid(paletteName) {
    const container = document.getElementById('colorGrid'); container.innerHTML = '';
    palettes[paletteName].forEach(color => { const div = document.createElement('div'); div.className = 'color-swatch'; div.style.backgroundColor = color; div.onclick = () => applyColor(color); container.appendChild(div); });
}
function generateGradient(start, end, steps) { let arr = []; for (let i = 0; i < steps; i++) { const int = Math.floor((255 * i) / steps); const h = int.toString(16).padStart(2, '0'); arr.push(`#${h}${h}${h}`); } return arr; }

// --- SAUVEGARDE & CHARGEMENT AVEC NOM ---
function getActiveElements() {
    if (!activeApp) return null;
    const container = document.getElementById(activeApp === 'warframe' ? 'app-warframe' : 'app-operator');
    return {
        colors: container.querySelectorAll('.current-color-box'),
        inputs: container.querySelectorAll('input[type="text"]'),
        sliders: container.querySelectorAll('input[type="range"]'),
        img: container.querySelector('.warframe-img')
    };
}

function promptSaveName() {
    const name = prompt("Nom de la configuration (ex: Volt Prime Gold):");
    if(name) saveNamedConfig(name);
}

function saveNamedConfig(name) {
    if (!activeApp) return;
    const els = getActiveElements();
    const config = { colors: {}, texts: {}, sliders: {}, img: null };
    els.colors.forEach(el => config.colors[el.id] = el.style.backgroundColor);
    els.inputs.forEach(el => config.texts[el.id] = el.value);
    els.sliders.forEach(el => config.sliders[el.id] = el.value);
    // Sauvegarde de l'image (si possible)
    try { config.img = els.img.src; } catch(e) { console.log("Image non sauvegardée (CORS/Taille)"); }

    const key = `${activeApp}_save_${name}`;
    try {
        localStorage.setItem(key, JSON.stringify(config));
        showFlash(`SAUVEGARDÉ : ${name}`);
    } catch (e) {
        alert("Erreur: Image trop lourde ou stockage plein.");
    }
}

function openLoadModal() {
    const list = document.getElementById('saves-list');
    list.innerHTML = '';
    const prefix = `${activeApp}_save_`;
    
    let found = false;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            found = true;
            const saveName = key.replace(prefix, '');
            const div = document.createElement('div');
            div.className = 'save-item';
            div.innerHTML = `<span class="save-name" onclick="loadNamedConfig('${key}')">${saveName}</span> 
                             <button class="delete-save" onclick="deleteSave('${key}')">×</button>`;
            list.appendChild(div);
        }
    }
    if(!found) list.innerHTML = '<div style="color:#888; padding:20px;">Aucune sauvegarde trouvée.</div>';
    document.getElementById('load-modal').style.display = 'flex';
}

function closeLoadModal() { document.getElementById('load-modal').style.display = 'none'; }

function loadNamedConfig(key) {
    const data = localStorage.getItem(key);
    if (!data) return;
    const config = JSON.parse(data);
    
    // Restauration
    if (config.colors) {
        for (const [id, color] of Object.entries(config.colors)) {
            const el = document.getElementById(id);
            if (el && color) { el.style.backgroundColor = color; el.style.boxShadow = `0 0 10px ${color}`; el.style.borderColor = 'white'; }
        }
    }
    if (config.texts) { for (const [id, val] of Object.entries(config.texts)) { const el = document.getElementById(id); if (el) el.value = val; } }
    if (config.sliders) { for (const [id, val] of Object.entries(config.sliders)) { const el = document.getElementById(id); if (el) { el.value = val; updateVal(el); } } }
    
    // Image
    if (config.img) {
        const imgId = activeApp === 'warframe' ? 'img-wf' : 'img-op';
        document.getElementById(imgId).src = config.img;
    }

    // Reset effets visuels
    const prefix = activeApp === 'warframe' ? 'wf' : 'op';
    const col1 = config.colors[`box-${prefix}-energy-1`];
    const col2 = config.colors[`box-${prefix}-energy-2`];
    if(col1) document.documentElement.style.setProperty('--energy-1', col1);
    if(col2) document.documentElement.style.setProperty('--energy-2', col2);

    closeLoadModal();
    showFlash("CHARGÉ AVEC SUCCÈS");
}

function deleteSave(key) {
    if(confirm("Supprimer cette sauvegarde ?")) {
        localStorage.removeItem(key);
        openLoadModal(); // Rafraichir la liste
    }
}

function resetConfig() {
    if (!activeApp) return;
    if(confirm("Réinitialiser l'affichage actuel ?")) {
        const els = getActiveElements();
        els.colors.forEach(el => { el.style.backgroundColor = ''; el.style.boxShadow = ''; el.style.borderColor = ''; });
        els.inputs.forEach(el => el.value = '');
        els.sliders.forEach(el => { el.value = 0.5; updateVal(el); });
        document.documentElement.style.setProperty('--energy-1', 'transparent');
        document.documentElement.style.setProperty('--energy-2', 'transparent');
        showFlash("RÉINITIALISÉ");
    }
}

function showFlash(msg) {
    const el = document.getElementById('flashMsg');
    el.innerText = msg; el.style.opacity = 1;
    setTimeout(() => { el.style.opacity = 0; }, 2000);
}