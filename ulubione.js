const favoritesModal = document.getElementById('favorites-modal');
const titleModal = document.getElementById('title-modal');
const saveFilterBtn = document.getElementById('save-filter');
const cancelFilterBtn = document.getElementById('cancel-filter');
const favoritesList = document.getElementById('favorites-list');
const heartIcon = document.querySelector('.theme-buttons .fa-heart');
const addToFavoritesBtn = document.getElementById('add-to-favorites');
let currentFilter = {};
let favorites = loadFavorites();


//Ulubione ikona serduszka
heartIcon.addEventListener('click', () => {
    //console.log('Ulubione');
    if (favoritesModal.style.display === 'none' || !favoritesModal.style.display) {
        favoritesModal.style.display = 'block';
    }
});

//Zamykanie okna ulubionych po kliknięciu poza jego obszar
document.addEventListener('click', (event) => {
    if (!favoritesModal.contains(event.target) && event.target !== heartIcon) {
        favoritesModal.style.display = 'none';
    }
});

//Dodaj do ulubioncyh przycisk
addToFavoritesBtn.addEventListener('click', () => {
    currentFilter = getCurrentFilterValues();
    titleModal.classList.remove('hidden');
});

//Wyświetlanie z nadawaniem tytułu
saveFilterBtn.addEventListener('click', () => {
    const title = document.getElementById('filter-title').value;
    if (title) {
        favorites.push({ title, filter: currentFilter });
        saveFavorites(favorites);  // Zapisz ulubione filtry
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
            saveFavorites(favorites);
            updateFavoritesList();
        });

        favoriteItem.appendChild(favButton);
        favoriteItem.appendChild(deleteIcon);
        favoritesList.appendChild(favoriteItem);
    });
}

//Załadowanie z localstorage
function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
}

//Zapis do localstorage
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFilterValues(filter) {
    document.getElementById('lecturer').value = filter.lecturer || '';
    document.getElementById('room').value = filter.room || '';
    document.getElementById('subject').value = filter.subject || '';
    document.getElementById('group').value = filter.group || '';
    document.getElementById('album-number').value = filter.albumNumber || '';
    document.getElementById('class-type').value = filter.classType || '';
}




//Zmiana czcionki
let fontSizeLevel = 0;

function changeFontSize() {
    const body = document.body;
    const fontSizes = ['1em', '1.1em', '1.15em', '1.2em'];


    fontSizeLevel = (fontSizeLevel + 1) % fontSizes.length;

    const newFontSize = `${fontSizes[fontSizeLevel]}`;
    body.style.fontSize = newFontSize;

    //Powiekszenie przycisków i nawigacji
    const allElements = document.querySelectorAll('header, nav, button, .icon-and-text, footer, main, i, .calendar');
    allElements.forEach(element => {
        element.style.fontSize = newFontSize;
        if (element.classList.contains('calendar')) {
            element.style.height = `calc(${newFontSize} * 40)`;
        }
        if (element.classList.contains('calendar')) {
            element.style.height = newFontSize === '1em' ? '70vh' : `calc(${newFontSize} * 40)`;
        }
        // if (element.classList.contains('fa-heart')) {
        //     element.style.fontSize = newFontSize === '1em' ? '2em' : `calc(${newFontSize} * 35)`;
        // }
    });


}

document.getElementById('font-size').addEventListener('click', changeFontSize);

updateFavoritesList();