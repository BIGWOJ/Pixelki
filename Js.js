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
                <th>${new Date().toLocaleDateString()}</th>
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
    let current_date = new Date();
    let week_start = current_date.getDate() - current_date.getDay() + 1;

    for (let i = 0; i < 7; i++) {
        //Head jednego dnia
        let date = new Date(current_date.setDate(week_start + i)).toLocaleDateString();

        const daily_header = `
            <thead>
                <tr>
                    <th></th>
                    <th>${date}</th>
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
    let current_date = new Date();
    let week_start = current_date.getDate() - current_date.getDay() + 1;
    let days_shortcut = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'ndz.'];

    //Head tygodniowego widoku
    let weekly_header = `
        <thead>
            <tr>
                <th></th>`;

    for (let i = 0; i < 7; i++) {
        //Data bez roku
        let date = new Date(current_date.setDate(week_start + i)).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
        weekly_header += `<th>${days_shortcut[i]} ${date}</th>`;
    }

    weekly_header += `</tr></thead>`;

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
    const table = document.querySelector(".calendar_view");

    //Head semestralnego widoku
    const semester_header = `
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

    //Body semestralnego widoku
    let semester_body = `<tbody>`;
    for (let i = 0; i < 15; i++) {
        semester_body += `<tr>`;
        for (let j = 0; j < 8; j++) {
            if (j === 0) {
                semester_body += `<td>${i + 1}</td>`;
                continue;
            }
            semester_body += `<td></td>`;
        }
        semester_body += `</tr>`;
    }
    semester_body += `</tbody>`;

    table.innerHTML = semester_header + semester_body;
});

//Strzałka w lewo
document.querySelector(".calendar_range button:nth-child(1)").addEventListener("click", () => {

    const table = document.querySelector(".calendar_view");
    let row_count = table.rows.length;
    console.log(row_count);
    //Trzeba jakoś inaczej zmieniać dla semestru oraz miesiąca, bo tam nie ma dat, tylko dni
    //Zmiana dziennego też inaczej, bo tam jest długa tabela
    if (row_count !== 14) {
        return;
    }

    let current_dates = (document.querySelector(".calendar_view thead").innerHTML)
    .split("</th>")
    .slice(1, -1)
    .map(item => {
        let [day, month] = item.match(/\d{1,2}\.\d{1,2}/)[0].split('.');
        return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${new Date().getFullYear()}`;
    });
     console.log((current_dates));

     let days_shortcut = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'ndz.'];

    let today_header = `
    <thead>
        <tr>
            <th></th>`;

    for (let i = 0; i < current_dates.length; i++) {
        let [day, month] = current_dates[i].split("-");
        let date = new Date(new Date().getFullYear(), month - 1, day);
        date.setDate(date.getDate() - 7);
        current_dates[i] = `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        today_header += `<th>${days_shortcut[i]} ${current_dates[i]}</th>`;
    }

    today_header += `</tr></thead>`;

    table.tHead.innerHTML = today_header;

});


//Strzałka w prawo
document.querySelector(".calendar_range button:nth-child(3)").addEventListener("click", () => {
    console.log("Strzałka w prawo\nJeszcze nie zrobione");
});

if (theme === "dark") {
    document.querySelector("body").classList.add("dark");
}

if (theme === "light") {
    document.querySelector("body").classList.add("light");
}
