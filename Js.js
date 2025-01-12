//Zmienne odnoszczące się do zmiany motywu strony
let theme = localStorage.getItem("theme");

//Czynności wykonywane po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    //Czyszczenie inputów po odświeżeniu strony
    let filter_inputs = document.querySelectorAll("input");
    filter_inputs.forEach(input => {
        input.value = "";
    });

    //Inicjalizacja motywu na podstawie preferencji systemowych / przeglądarkowych
    if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
        document.querySelector("body").classList.add(theme);
    }

    localStorage.setItem("theme", theme);
});

//Zmiana motywu strony
document.querySelector(".theme-buttons button:nth-child(1)").addEventListener("click", () => {
    console.log("Zmiana motywu\nJeszcze nie zrobione do końca");

    if (theme === "dark") {
        document.querySelector("body").classList.remove("dark");
        document.querySelector("body").classList.add("light");
        theme = "light";
    }
    else {
        document.querySelector("body").classList.remove("light");
        document.querySelector("body").classList.add("dark");
        theme = "dark";
    }

    localStorage.setItem("theme", theme);
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


if (theme === "dark") {
    document.querySelector("body").classList.add("dark");
}

if (theme === "light") {
    document.querySelector("body").classList.add("light");
}