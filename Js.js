//Zmienne odnoszczące się do zmiany motywu strony
let theme = localStorage.getItem("theme");
let current_year_read = false;

//Funkcja do zwracania tablicy dat w headzie kalendarza
function get_dates(year_input=true) {
    try {
        let current_dates = (document.querySelector(".calendar_view thead").innerHTML)
            .split("</th>")
            .slice(1, -1);

        if (year_input) {
            return current_dates.map(item => {
                let [day, month, year] = item.match(/\d{1,2}\.\d{1,2}\.\d{4}/)[0].split('.');
                return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
            })
        }
        else {
            return current_dates.map(item => {
                let [day, month] = item.match(/\d{1,2}\.\d{1,2}/)[0].split('.');
                return `${day.padStart(2, '0')}.${month.padStart(2, '0')}`;
            })
        }
    }
    catch (error) {
        return [];
    }
}

function initialize_calendar_head_week() {
    let days_shortcut = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'ndz.'];
    let table = document.querySelector(".calendar_view");
    let current_date = new Date;
    let week_start = new Date(current_date.setDate(current_date.getDate() - current_date.getDay() + 1));

    let table_header = `
    <thead>
        <tr>
            <th></th>`;

    for (let i = 0; i < 7; i++) {
        let date = new Date(current_year, week_start.getMonth(), week_start.getDate() + i);
        table_header += `<th>${days_shortcut[i]} ${date.toLocaleDateString().split('.').slice(0, 2).join('.')}</th>`;
    }

    table_header += `</tr></thead>`;
    table.tHead.innerHTML = table_header;
}

function initialize_date_range(semester=false) {
    let current_date = new Date();
    let month = current_date.getMonth()+1;
    let year = current_date.getFullYear();
    let months_dict = {
        '1': 'styczeń', '2': 'luty', '3': 'marzec', '4': 'kwiecień', '5': 'maj',
        '6': 'czerwiec', '7': 'lipiec', '8': 'sierpień', '9': 'wrzesień',
        '10': 'październik', '11': 'listopad', '12': 'grudzień'
    };

    if (semester) {
        let winter_semester = ['01', '02', '10', '11', '12']
        if (winter_semester.hasOwnProperty(month.toString())) {
            document.querySelector(".calendar_range span").innerHTML = `Semestr zimowy`;
        }

        else {
            document.querySelector(".calendar_range span").innerHTML = `Semestr letni`;
        }
    }

    else {
         document.querySelector(".calendar_range span").innerHTML = `${months_dict[month]} ${year}`;
    }

    // const current_year = document.querySelector(".calendar_range span").innerHTML.split(' ');
    // current_dates = get_dates(year_input=false);
    // [day, month] = current_dates[0].split(".");
    //
    // first_date = new Date(parseInt(current_year), month - 1, day);

    if (!current_year_read) {
        current_year = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        current_year_read = true;
    }

}

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

    //Ustawianie wyjściowej daty na górze planu zajęć
    initialize_date_range();

    //Ustawienie wyjsciowych dat w headzie kalendarza
    initialize_calendar_head_week();
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
    initialize_date_range();
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
    const calendar = document.querySelector('.calendar');
    calendar.style.height = `70vh`;
});

//Dzienny widok kalendarza
document.querySelector(".navigation button:nth-child(3)").addEventListener("click", () => {
    initialize_date_range();
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
                    <th>Trzeba ustalić poprawne godziny,<br> bo czasami 10:30 a czasami 10:15 np<br>według godzin w kafelkach</th>
                    <th>${date.split('.').slice(0,2).join('.')}</th>
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
    calendar.style.height = `${table.scrollHeight+250}px`;

});

//Tygodniowy widok kalendarza
document.querySelector(".navigation button:nth-child(4)").addEventListener("click", () => {
    initialize_date_range();
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
    const calendar = document.querySelector('.calendar');
    calendar.style.height = `70vh`;
});

//Miesięczny widok kalendarza
document.querySelector(".navigation button:nth-child(5)").addEventListener("click", () => {
    initialize_date_range();
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
    initialize_date_range(semester=true);
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
    const calendar = document.querySelector('.calendar');
    calendar.style.height = `80vh`;
});

//Strzałka w lewo
document.querySelector(".calendar_range button:nth-child(1)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");
    let row_count = table.rows.length;
    let column_count = table.rows[0].cells.length;

    let days_shortcut = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'ndz.'];
    let months_dict = {
        '01': 'styczeń', '02': 'luty', '03': 'marzec', '04': 'kwiecień', '05': 'maj',
        '06': 'czerwiec', '07': 'lipiec', '08': 'sierpień', '09': 'wrzesień',
        '10': 'październik', '11': 'listopad', '12': 'grudzień'
    };

    let table_header = `
    <thead>
        <tr>`;

    let current_dates, new_range, date;

    // Widok dzisiaj
    if (column_count === 2 && row_count === 14) {
        current_dates = get_dates(year_input=true);
        date = new Date(current_dates[0].split('.').reverse().join('-'));
        date.setDate(date.getDate() - 1);
        current_dates[0] = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        new_range = `${months_dict[current_dates[0].split('.')[1]]} ${current_dates[0].split('.')[2]}`;
        table_header += `<th></th><th>${current_dates[0]}</th>`;
    }

    //Widok dzienny
    if (column_count === 2 && row_count === 42) {
        let first_date = get_dates(year_input=false);
        let current_year = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        first_date = new Date(parseInt(current_year), first_date[0].split('.')[1] - 1, first_date[0].split('.')[0]);

        table_header += `<th>Trzeba ustalić poprawne godziny,<br> bo czasami 10:30 a czasami 10:15 np<br>według godzin w kafelkach</th>
                        <th>${(new Date(first_date.setDate(first_date.getDate() - 7)).toLocaleDateString()).split('.').slice(0, 2).join('.')}</th>`;

        for (let i = 0; i < table.rows.length; i++) {
            let row = table.rows[i];
            let date = row.cells[1].innerText;

            if (date) {
                let new_date = (new Date(new Date(first_date).setDate(new Date(first_date).getDate() + i)).toLocaleDateString()).split('.').slice(0, 2).join('.');
                row.cells[1].innerText = new_date;
            }
        }
        let new_month = ((first_date.getMonth() + 1).toString().padStart(2, '0'));

        new_range = `${months_dict[new_month]} ${first_date.getFullYear()}`;
    }

    //Widok tydzień
    if (column_count === 8 && row_count === 14) {
        current_dates = get_dates(year_input = false);
        let [day, month] = current_dates[0].split(".");

        current_year = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        first_date = new Date(parseInt(current_year), month - 1, day);
        first_date.setDate(first_date.getDate() - 7);

        let year = first_date.getFullYear();

        table_header += `<th></th>`;

        for (let i = 0; i < current_dates.length; i++) {
            [day, month] = current_dates[i].split(".");
            let date = new Date(year, month - 1, day);
            date.setDate(date.getDate() - 7);
            current_dates[i] = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            table_header += `<th>${days_shortcut[i]} ${current_dates[i]}</th>`;
        }
        new_range = `${months_dict[current_dates[0].split('.')[1]]} ${year}`;
    }

    let days = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'];

    function render_head_range_semester_month(semester=false) {
        let [month_string, year] = document.querySelector(".calendar_range span").innerHTML.split(' ');
        let month_number = Object.keys(months_dict).find(key => months_dict[key] === month_string);
        let current_date = new Date(parseInt(year), parseInt(month_number) - 1, 1);
        current_date.setMonth(current_date.getMonth() - 1);
        let month_before = current_date;
        let month_before_string = months_dict[(month_before.getMonth() + 1).toString().padStart(2, '0')];

        if (semester) {
            table_header += `<th></th>`;
            let winter_semester = ['01', '02', '10', '11', '12']
            if (winter_semester.hasOwnProperty(month_number)) {
                new_range = "Semestr zimowy";
            }

            else {
                new_range = "Semestr letni";
            }
        }

        else {
            new_range = `${month_before_string} ${month_before.getFullYear()}`;
        }

        for (let i = 0; i < 7; i++) {
            table_header += `<th>${days[i]}</th>`;
        }
    }

    //Widok miesiąc
    if (column_count === 7 && row_count === 6) {
        render_head_range_semester_month();
    }

    //Widok semestr
    if (column_count === 8 && row_count === 16) {
        render_head_range_semester_month(semester=true);
        let current_semester = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        if (current_semester === 'zimowy') {
            new_range = 'Semestr letni';
        }
        else {
            new_range = 'Semestr zimowy';
        }
    }

    table_header += `</tr></thead>`;
    table.tHead.innerHTML = table_header;

    document.querySelector(".calendar_range span").innerHTML = new_range;

});

// Strzałka w prawo
document.querySelector(".calendar_range button:nth-child(3)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");
    let row_count = table.rows.length;
    let column_count = table.rows[0].cells.length;

    let days_shortcut = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'ndz.'];
    let months_dict = {
        '01': 'styczeń', '02': 'luty', '03': 'marzec', '04': 'kwiecień', '05': 'maj',
        '06': 'czerwiec', '07': 'lipiec', '08': 'sierpień', '09': 'wrzesień',
        '10': 'październik', '11': 'listopad', '12': 'grudzień'
    };

    let table_header = `
    <thead>
        <tr>
            <th></th>`;

    let current_dates, new_range, date;

    // Widok dzisiaj
    if (column_count === 2 && row_count === 14) {
        current_dates = get_dates(year_input=true);
        date = new Date(current_dates[0].split('.').reverse().join('-'));
        date.setDate(date.getDate() + 1);
        current_dates[0] = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        new_range = `${months_dict[current_dates[0].split('.')[1]]} ${current_dates[0].split('.')[2]}`;
        table_header += `<th>${current_dates[0]}</th>`;
    }

    // Widok dzienny


    // Widok tydzień
    if (column_count === 8 && row_count === 14) {
        current_dates = get_dates(year_input=false);
        let [day, month] = current_dates[0].split(".");

        current_year = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        first_date = new Date(parseInt(current_year), month - 1, day);
        first_date.setDate(first_date.getDate() + 7);
        let year = first_date.getFullYear();

        for (let i = 0; i < current_dates.length; i++) {
            [day, month] = current_dates[i].split(".");
            let date = new Date(year, month - 1, day);
            date.setDate(date.getDate() + 7);
            current_dates[i] = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            table_header += `<th>${days_shortcut[i]} ${current_dates[i]}</th>`;
        }
        new_range = `${months_dict[current_dates[0].split('.')[1]]} ${year}`;
    }

    // Widok miesiąc


    // Widok semestr


    table_header += `</tr></thead>`;
    table.tHead.innerHTML = table_header;

    document.querySelector(".calendar_range span").innerHTML = new_range;
});


//Kalendarz ikona
document.getElementById("calendar-button").addEventListener("click", () => {
    document.getElementById("date-container").style.display = "block";
});

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("date-container").style.display = "none";
});

