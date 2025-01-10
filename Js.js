//Czyszczenie inputów po odświeżeniu strony
document.addEventListener("DOMContentLoaded", () => {
    let filter_inputs = document.querySelectorAll("input");
    filter_inputs.forEach(input => {
        input.value = "";
    });
});

//Zmiana motywu strony
document.querySelector(".theme-buttons button:nth-child(1)").addEventListener("click", () => {
    console.log("Zmiana motywu\nJeszcze nie zrobione");
});

//Zmiana wielkości czcionki
document.querySelector(".theme-buttons button:nth-child(2)").addEventListener("click", () => {
    console.log("Zmiana czcionki\nJeszcze nie zrobione");
});

//Kopiowanie filtrów
document.querySelector(".filter-share").addEventListener("click", () => {
    console.log("Kopiowanie filtrów\nJeszcze nie zrobione");
});

//Kalendarz zakresowy
document.querySelector(".range-calendar").addEventListener("click", () => {
    console.log("Kalendarz zakresowy\nJeszcze nie zrobione");
});

//Zastosowanie filtrów po kliknięciu w przycisk "Filtruj"
document.querySelector(".filter-buttons button:nth-child(1)").addEventListener("click", () => {
    console.log("Filtrowanie\nJeszcze nie zrobione");
});

//Czyszczenie inputów filtrów po kliknięciu w przycisk "Wyczyść"
document.querySelector(".filter-buttons button:nth-child(2)").addEventListener("click", () => {
    let filter_inputs = document.querySelectorAll(".filters input");
    filter_inputs.forEach(input => {
        input.value = "";
    });
});

//Zarządzanie kafelkami
document.querySelector(".manage-button").addEventListener("click", () => {
    console.log("Zarządzanie kafelkami\nJeszcze nie zrobione");
});


