const favoritesModal = document.getElementById('favorites-modal');
const titleModal = document.getElementById('title-modal');
const saveFilterBtn = document.getElementById('save-filter');
const cancelFilterBtn = document.getElementById('cancel-filter');
const favoritesList = document.getElementById('favorites-list');
const heartIcon = document.querySelector('.fa-heart');
const addToFavoritesBtn = document.getElementById('add-to-favorites');
let currentFilter = {};
let favorites = [];


//Ulubione ikona serduszka
heartIcon.addEventListener('click', () => {
    if (favoritesModal.style.display === 'none' || !favoritesModal.style.display) {
        favoritesModal.style.display = 'block';
    } else {
        favoritesModal.style.display = 'none';
    }
});


//Dodaj do ulubioncyh przycisk
addToFavoritesBtn.addEventListener('click', () => {
    currentFilter = getCurrentFilterValues();
    titleModal.classList.remove('hidden');
});

//Wyśweitlanie z nadawaniem tytułu
saveFilterBtn.addEventListener('click', () => {
    const title = document.getElementById('filter-title').value;
    if (title) {
        favorites.push({ title, filter: currentFilter });
        updateFavoritesList();
        titleModal.classList.add('hidden');
        document.getElementById('filter-title').value = '';
    }
});

cancelFilterBtn.addEventListener('click', () => {
    titleModal.classList.add('hidden');
});


function getCurrentFilterValues() {
    return {
        lecturer: document.getElementById('lecturer').value,
        room: document.getElementById('room').value,
        subject: document.getElementById('subject').value,
        group: document.getElementById('group').value,
        albumNumber: document.getElementById('album-number').value,
        classType: document.getElementById('class-type').value,
    };
}

//Lista z ulubionymi filtrami
function updateFavoritesList() {
    favoritesList.innerHTML = '';
    favorites.forEach((fav, index) => {
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');

        const favButton = document.createElement('button');
        favButton.textContent = fav.title;
        favButton.addEventListener('click', () => {
            loadFilterValues(fav.filter);
        });

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete');
        deleteIcon.dataset.index = index;
        deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            favorites.splice(index, 1);
            updateFavoritesList();
        });

        favoriteItem.appendChild(favButton);
        favoriteItem.appendChild(deleteIcon);
        favoritesList.appendChild(favoriteItem);
    });
}

function loadFilterValues(filter) {
    document.getElementById('lecturer').value = filter.lecturer || '';
    document.getElementById('room').value = filter.room || '';
    document.getElementById('subject').value = filter.subject || '';
    document.getElementById('group').value = filter.group || '';
    document.getElementById('album-number').value = filter.albumNumber || '';
    document.getElementById('class-type').value = filter.classType || '';
}
