//Zmienne odnoszczące się do zmiany motywu strony
let theme = localStorage.getItem("theme");

//Czynności wykonywane po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    //Czyszczenie inputów po odświeżeniu strony
/*    let filter_inputs = document.querySelectorAll("input");
    filter_inputs.forEach(input => {
        input.value = "";
    });*/

    // zakomentowalem to bo nie potrzebne a komplikuje sie z kopiowaniem linku

    //Inicjalizacja motywu na podstawie preferencji systemowych / przeglądarkowych
    if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
        document.querySelector("body").classList.add(theme);
    }

    localStorage.setItem("theme", theme);
});

//Zmiana motywu strony
document.querySelector(".theme-buttons button:nth-child(2)").addEventListener("click", () => {
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
//Dodaj do ulubioncyh przycisk
// addToFavoritesBtn.addEventListener('click', () => {
//     currentFilter = getCurrentFilterValues();
//     titleModal.classList.remove('hidden');
// });

//Wyśweitlanie z nadawaniem tytułu
// saveFilterBtn.addEventListener('click', () => {
//     const title = document.getElementById('filter-title').value;
//     if (title) {
//         favorites.push({ title, filter: currentFilter });
//         updateFavoritesList();
//         titleModal.classList.add('hidden');
//         document.getElementById('filter-title').value = '';
//     }
// });

// cancelFilterBtn.addEventListener('click', () => {
//     titleModal.classList.add('hidden');
// });

//Zmiana wielkości czcionki
document.querySelector(".theme-buttons button:nth-child(2)").addEventListener("click", () => {
    console.log("Zmiana czcionki\nJeszcze nie zrobione");
});

//Kalendarz zakresowy
document.querySelector(".range-calendar").addEventListener("click", () => {
    console.log("Kalendarz zakresowy\nJeszcze nie zrobione");
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

//Czyszczenie inputów filtrów po kliknięciu w przycisk "Wyczyść"
document.querySelector(".filter-buttons button:nth-child(2)").addEventListener("click", () => {
    let filter_inputs = document.querySelectorAll(".filters input");
    filter_inputs.forEach(input => {
        input.value = "";
    });
});

//Dzisiejszy dzień widok kalendarza
document.querySelector(".navigation button:nth-child(2)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");

    //Head dzisiejszego widoku
    const today_header = `
        <thead>
            <tr>
                <th></th>
                <th>Dzisiejsza data</th>
            </tr>
        </thead>`;

    //Body dzisiejszego widoku
    let today_body = `<tbody>`;
    for (let i = 0; i < 13; i++) {
        today_body += `<tr>`;
        for (let j = 0; j < 2; j++) {
            if (j === 0) {
                today_body += `<td>${7 + i}</td>`;
                continue;
            }
            today_body += `<td></td>`;
        }
        today_body += `</tr>`;
    }
    today_body += `</tbody>`;

    table.innerHTML = today_header + today_body;
});

//Dzienny widok kalendarza
document.querySelector(".navigation button:nth-child(3)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");
    let connected_table = '';
    let lesson_hours = ['8:30 - 10:00', '10:15 - 12:00', '14:15 - 16:00', '16:15 - 18:00', '18:15 - 19:30']
    for (let i = 0; i < 7; i++) {
        //Head jednego dnia
        const daily_header = `
            <thead>
                <tr>
                    <th></th>
                    <th>Data</th>
                </tr>
            </thead>`;

        //Body dziennego widoku
        let daily_body = `<tbody>`;
        for (let j = 0; j < 5; j++) {
            daily_body += `<tr>`;
            for (let k = 0; k < 2; k++) {
                if (k === 0) {
                    daily_body += `<td>${lesson_hours[j]}</td>`;
                    continue;
                }
                daily_body += `<td></td>`;
            }
            daily_body += `</tr>`;
        }
        daily_body += `</tbody>`;

        connected_table += daily_header + daily_body;
    }

    table.innerHTML = connected_table;

    const calendar = document.querySelector('.calendar');
calendar.style.height = `${table.scrollHeight +250}px`;

});

//Tygodniowy widok kalendarza
document.querySelector(".navigation button:nth-child(4)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");

    //Head tygodniowego widoku
    const weekly_header = `
        <thead>
            <tr>
                <th></th>
                <th>poniedziałek</th>
                <th>wtorek</th>
                <th>środa</th>
                <th>czwartek</th>
                <th>piątek</th>
                <th>sobota</th>
                <th>niedziela</th>
            </tr>
        </thead>`;

    //Body tygodniowego widoku
    let weekly_body = `<tbody>`;
    for (let i = 0; i < 13; i++) {
        weekly_body += `<tr>`;
        for (let j = 0; j <= 7; j++) {
            if (j === 0) {
                weekly_body += `<td>${7 + i}</td>`;
                continue;
            }
            weekly_body += `<td></td>`;
        }
        weekly_body += `</tr>`;
    }
    weekly_body += `</tbody>`;

    table.innerHTML = weekly_header + weekly_body;
});

//Miesięczny widok kalendarza
document.querySelector(".navigation button:nth-child(5)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");

    //Head miesięcznego widoku
    const monthly_header = `
        <thead>
            <tr>
                <th>poniedziałek</th>
                <th>wtorek</th>
                <th>środa</th>
                <th>czwartek</th>
                <th>piątek</th>
                <th>sobota</th>
                <th>niedziela</th>
            </tr>
        </thead>`;

    //Body miesięcznego widoku
    let monthly_body = `<tbody>`;
    for (let i = 0; i < 5; i++) {
        monthly_body += `<tr>`;
        for (let j = 0; j < 7; j++) {
            let day = i * 7 + j + 1;
            monthly_body += `<td>${day <= 31 ? day : ''}</td>`;
        }
        monthly_body += `</tr>`;
    }
    monthly_body += `</tbody>`;

    table.innerHTML = monthly_header + monthly_body;
});

//Semestralny widok kalendarza
document.querySelector(".navigation button:nth-child(6)").addEventListener("click", () => {

});


if (theme === "dark") {
    document.querySelector("body").classList.add("dark");
}

if (theme === "light") {
    document.querySelector("body").classList.add("light");
}
