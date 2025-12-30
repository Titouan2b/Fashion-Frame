window.onload = function() {
    renderGallery();
};

function renderGallery() {
    const wfGrid = document.getElementById('grid-warframe');
    const opGrid = document.getElementById('grid-operator');
    
    wfGrid.innerHTML = '';
    opGrid.innerHTML = '';

    let wfCount = 0;
    let opCount = 0;

    // Parcourir toutes les clés du LocalStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Si c'est une sauvegarde Warframe
        if (key.startsWith('warframe_save_')) {
            const data = JSON.parse(localStorage.getItem(key));
            const name = key.replace('warframe_save_', '');
            createCard(wfGrid, name, data, key, 'wf');
            wfCount++;
        }
        // Si c'est une sauvegarde Opérateur
        else if (key.startsWith('operator_save_')) {
            const data = JSON.parse(localStorage.getItem(key));
            const name = key.replace('operator_save_', '');
            createCard(opGrid, name, data, key, 'op');
            opCount++;
        }
    }

    // Messages si vide
    if (wfCount === 0) wfGrid.innerHTML = '<div class="empty-msg">Aucune configuration Warframe sauvegardée.</div>';
    if (opCount === 0) opGrid.innerHTML = '<div class="empty-msg">Aucune configuration Opérateur sauvegardée.</div>';
}

function createCard(container, name, data, key, type) {
    const card = document.createElement('div');
    card.className = 'fashion-card';
    
    // Image par défaut si pas d'image sauvegardée
    let imgSrc = data.img ? data.img : 'https://via.placeholder.com/300x400/111/fff?text=No+Image';
    
    // Bordure de couleur selon type
    if(type === 'op') card.style.borderColor = 'rgba(0, 229, 255, 0.3)';

    card.innerHTML = `
        <div class="card-img-container" onclick="openModal('${imgSrc}')">
            <img src="${imgSrc}" class="card-img" alt="${name}">
        </div>
        <div class="card-info">
            <div class="card-title">${name}</div>
            <button class="btn-delete" onclick="deleteSave('${key}')" title="Supprimer">🗑</button>
        </div>
    `;
    container.appendChild(card);
}

function deleteSave(key) {
    if(confirm("Êtes-vous sûr de vouloir supprimer cette sauvegarde ?")) {
        localStorage.removeItem(key);
        renderGallery(); // Recharger la grille
    }
}

// --- Modale ---
function openModal(src) {
    if(src.includes('placeholder')) return; // Pas de zoom sur placeholder
    const modal = document.getElementById('view-modal');
    const img = document.getElementById('modal-img');
    img.src = src;
    modal.style.display = 'flex';
}

function closeModal(e) {
    // Fermer si on clique sur le fond ou le bouton, pas l'image
    if(e.target.id === 'view-modal' || e.target.className === 'close-modal') {
        document.getElementById('view-modal').style.display = 'none';
    }
}