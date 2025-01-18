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

    // Kalendarz jako tydzien na wejsciu
    calendarStart();

    // testowanie
    //add_tile_calendar(9, 0, 90, 1, "test");
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
    show_tiles();
});

function show_tiles(){
    clear_tiles_calendar();
    const wykladowca = document.getElementById("lecturer").value;
    const sala = document.getElementById("room").value;
    const przedmiot = document.getElementById("subject").value;
    const grupa = document.getElementById("group").value;
    const numerAlbumu = document.getElementById("album-number").value;
    const forma = document.getElementById("forma-zajec").value;

    if (wykladowca.length === 0 && sala.length === 0 && przedmiot.length === 0 && grupa.length === 0 && numerAlbumu.length === 0 && forma.length === 0) {
        return;
    }

    const calendar = document.querySelector(".calendar");

    var dataStart;
    if (calendar.id === "dzisiejszy"){
        let data = document.querySelector(".calendar_view thead th:nth-child(2)").textContent;
        let parts = data.split(".");
        dataStart = `${parts[2]}-${parts[1]}-${parts[0]}`;
        var dataEnd = dataStart;
        let dateAdd = new Date(dataEnd);
        dateAdd.setDate(dateAdd.getDate() + 1);
        dataEnd = dateAdd.toISOString().split('T')[0];
    }
    else if (calendar.id === "dzienny"){

    }
    else if (calendar.id === "tygodniowy"){
        const data = document.querySelectorAll(".calendar_view thead th");
        let str = data[1].textContent;
        let parts = str.split(" ");
        dataStart = parts[1].split(".");
        dataStart = dataStart.reverse().join("-");

        let year = document.querySelector(".calendar_range span").textContent;
        const part = year.split(" ");
        year = part[1];
        dataStart = year + "-" + dataStart;

        str = data[7].textContent;
        parts = str.split(" ");
        var dataEnd = parts[1].split(".");
        dataEnd = dataEnd.reverse().join("-");
        dataEnd = year + "-" + dataEnd;
        //console.log(dataStart);
    }
    else if (calendar.id === "miesieczny"){

    }
    else if (calendar.id === "semestralny"){

    }


    fetch("process.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({wykladowca, sala, przedmiot, grupa, numerAlbumu, forma, dataStart, dataEnd})
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (calendar.id === "tygodniowy"){
                data.forEach(function(index){

                    let timeStart = new Date(index["start"]);
                    let hour = timeStart.getHours();
                    let minute = timeStart.getMinutes();

                    let timeEnd = new Date(index["koniec"]);

                    let roznica = timeEnd - timeStart;
                    roznica = roznica / 1000 / 60;

                    let text = timeStart.getHours() + ":" + timeStart.getMinutes() + " - " + timeEnd.getHours() + ":" + timeEnd.getMinutes()
                        + "\n" + index["tytul"];

                    const dataTH = document.querySelectorAll(".calendar_view thead th");

                    dataTH.forEach(function(indexTH, indexNum){
                        if (indexNum > 0) {
                            let str = indexTH.textContent;
                            let part = str.split(' ')[1].split('.')[0];

                            if (timeStart.getDate() === Number(part)){
                                add_tile_calendar(hour, minute, roznica, indexNum, text, index["formaZajec"]);
                            }
                        }


                    })

                });
            }
            else if (calendar.id === "dzisiejszy") {
                data.forEach(function(index){
                    let timeStart = new Date(index["start"]);
                    let hour = timeStart.getHours();
                    let minute = timeStart.getMinutes();


                    let timeEnd = new Date(index["koniec"]);

                    let roznica = timeEnd - timeStart;
                    roznica = roznica / 1000 / 60;

                    let text = timeStart.getHours() + ":" + timeStart.getMinutes() + " - " + timeEnd.getHours() + ":" + timeEnd.getMinutes()
                        + "\n" + index["tytul"];

                    const dataTD = document.querySelectorAll(".calendar_view tbody tr td:nth-child(2)");

                    dataTD.forEach(function(indexTH, indexNum){
                        add_tile_calendar(hour, minute, roznica, 1, text, index["formaZajec"]);
                    })

                });
            }

        })

    if (forma.length === 0 || forma === "własnyKafelek"){
        ulubione.forEach(function(indexUlub){

            let str = indexUlub["timeFrom"];
            let hour = str.split(':')[0];
            let minute = str.split(':')[1];

            str = indexUlub["timeTo"];
            let hourEnd = str.split(':')[0];

            let startTime = '2025-01-01T' + hour + ":00";
            startTime = new Date(startTime);

            let endTime = '2025-01-01T' + hourEnd + ":00";
            endTime = new Date(endTime);

            let roznica = endTime - startTime;
            roznica = roznica / 1000 / 60;

            let dataKafelek = new Date(indexUlub["date"]);
            dataKafelek = dataKafelek.getDate();

            let text = indexUlub["timeFrom"] + " - " + indexUlub["timeTo"]
                + "\n" + indexUlub["name"];

            const dataTH = document.querySelectorAll(".calendar_view thead th");
            const dataTD = document.querySelectorAll(".calendar_view tbody tr td:nth-child(2)")

            if (calendar.id === "tygodniowy"){
                dataTH.forEach(function(indexTH, indexNum){
                    if (indexNum > 0) {
                        let str = indexTH.textContent;
                        let part = str.split(' ')[1].split('.')[0];

                        if (Number(dataKafelek) === Number(part)){
                            add_tile_calendar(hour, minute, roznica, indexNum, text, "własnyKafelek");
                        }
                    }
                })
            }
            else if (calendar.id === "dzisiejszy" && indexUlub["date"] === dataStart) {
                dataTD.forEach(function(indexTH){
                    add_tile_calendar(hour, minute, roznica, 1, text, "własnyKafelek");
                })
            }

        });
    }

}

//Czyszczenie inputów filtrów po kliknięciu w przycisk "Wyczyść"
document.querySelector(".filter-buttons button:nth-child(2)").addEventListener("click", () => {
    let filter_inputs = document.querySelectorAll(".filters input");
    filter_inputs.forEach(input => {
        input.value = "";
    });
});

//Dzisiejszy dzień widok kalendarza
document.querySelector("#today_button").addEventListener("click", () => {
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
    calendar.id = "dzisiejszy";
    show_tiles()
});

//Dzienny widok kalendarza
document.querySelector("#daily_button").addEventListener("click", () => {
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
    calendar.id = "dzienny";
    show_tiles()
});

//Tygodniowy widok kalendarza
document.querySelector("#week_button").addEventListener("click", () => {
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
    calendar.id = "tygodniowy";
    show_tiles();
});

//Tygodniowy widok kalendarza
function calendarStart(){
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
    calendar.id = "tygodniowy";
    show_tiles();
}

//Miesięczny widok kalendarza
document.querySelector("#month_button").addEventListener("click", () => {
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
    const calendar = document.querySelector('.calendar');
    calendar.id = "miesieczny";
    show_tiles();
});

//Semestralny widok kalendarza
document.querySelector("#semester_button").addEventListener("click", () => {
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
    calendar.id = "semestralny";
    show_tiles();
});

//Funkcja do ustawiania poprawnego semestru w zakresie kalendarza
//output: nazwa semestru
function set_semester_range() {
    let current_semester = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
    let new_range;
    if (current_semester === 'zimowy') {
        new_range = 'Semestr letni';
    }
    else {
        new_range = 'Semestr zimowy';
    }
    return new_range;
}

//Funkcja do ustawiania poprawnego heada w kalendarzu dla dzisiaj, dziennego, tygodniowego
//output: nowy zakres, nowy head
function set_calendar_head(row_count, column_count, table, next_range=false) {
    let current_dates, new_range, date, table_header;
    let months_dict = {
        '01': 'styczeń', '02': 'luty', '03': 'marzec', '04': 'kwiecień', '05': 'maj',
        '06': 'czerwiec', '07': 'lipiec', '08': 'sierpień', '09': 'wrzesień',
        '10': 'październik', '11': 'listopad', '12': 'grudzień'
    };
    let days_shortcut = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'ndz.'];

    //Widok dzisiaj
    if (column_count === 2 && row_count === 14) {
        current_dates = get_dates(true);
        date = new Date(current_dates[0].split('.').reverse().join('-'));
        if (next_range) {
            date.setDate(date.getDate() + 1);
        }
        else {
            date.setDate(date.getDate() - 1);
        }

        current_dates[0] = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        new_range = `${months_dict[current_dates[0].split('.')[1]]} ${current_dates[0].split('.')[2]}`;
        table_header = `<th></th><th>${current_dates[0]}</th>`;
       // console.log(current_dates);   //zmienna przechowujaca date danego dnia
    }

    //Widok dzienny
    if (column_count === 2 && row_count === 42) {
        let first_date = get_dates(year_input=false);
        let current_year = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        first_date = new Date(parseInt(current_year), first_date[0].split('.')[1] - 1, first_date[0].split('.')[0]);

        if (next_range) {
            table_header = `<th>Trzeba ustalić poprawne godziny,<br> bo czasami 10:30 a czasami 10:15 np<br>według godzin w kafelkach</th>
                        <th>${(new Date(first_date.setDate(first_date.getDate() + 7)).toLocaleDateString()).split('.').slice(0, 2).join('.')}</th>`;
        }

        else {
            table_header = `<th>Trzeba ustalić poprawne godziny,<br> bo czasami 10:30 a czasami 10:15 np<br>według godzin w kafelkach</th>
                        <th>${(new Date(first_date.setDate(first_date.getDate() - 7)).toLocaleDateString()).split('.').slice(0, 2).join('.')}</th>`;
        }

        for (let i = 0; i < table.rows.length; i++) {
            let row = table.rows[i];
            let date = row.cells[1].innerText;
            let new_date;
            if (date) {
                if (next_range) {
                   new_date = (new Date(new Date(first_date).setDate(new Date(first_date).getDate() + i)).toLocaleDateString()).split('.').slice(0, 2).join('.');
                }
                else {
                    new_date = (new Date(new Date(first_date).setDate(new Date(first_date).getDate() - i)).toLocaleDateString()).split('.').slice(0, 2).join('.');
                }
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

        let current_year = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        let first_date = new Date(parseInt(current_year), month - 1, day);
        if (next_range) {
            first_date.setDate(first_date.getDate() + 7);
        }
        else {
            first_date.setDate(first_date.getDate() - 7);
        }

        let year = first_date.getFullYear();

        table_header = `<th></th>`;

        for (let i = 0; i < current_dates.length; i++) {
            [day, month] = current_dates[i].split(".");
            let date = new Date(year, month - 1, day);
            if (next_range) {
                date.setDate(date.getDate() + 7);
            }
            else {
                date.setDate(date.getDate() - 7);
            }

            current_dates[i] = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            table_header += `<th>${days_shortcut[i]} ${current_dates[i]}</th>`;
        }
        new_range = `${months_dict[current_dates[0].split('.')[1]]} ${year}`;
    }

    //console.log(table_header);  // przechowuje daty calego tygodnia
    //console.log(new_range)  // przechowuje dany miesiac i rok

    return [new_range, table_header];
}

//Funkcja do ustawiania poprawnego heada w kalendarzu dla semestru oraz miesiąca
//output: nowy zakres, nowy head
function render_head_range_semester_month(semester=false, next_range=false) {
    let months_dict = {
        '01': 'styczeń', '02': 'luty', '03': 'marzec', '04': 'kwiecień', '05': 'maj',
        '06': 'czerwiec', '07': 'lipiec', '08': 'sierpień', '09': 'wrzesień',
        '10': 'październik', '11': 'listopad', '12': 'grudzień'
    };

    let [month_string, year] = document.querySelector(".calendar_range span").innerHTML.split(' ');
    let month_number = Object.keys(months_dict).find(key => months_dict[key] === month_string);
    let current_date = new Date(parseInt(year), parseInt(month_number) - 1, 1);
    current_date.setMonth(current_date.getMonth() - 1);
    let month_before = current_date;
    let month_before_string = months_dict[(month_before.getMonth() + 1).toString().padStart(2, '0')];

    current_date = new Date(parseInt(year), parseInt(month_number) - 1, 1);
    current_date.setMonth(current_date.getMonth() + 1);
    let month_after = current_date;
    let month_after_string = months_dict[(month_after.getMonth() + 1).toString().padStart(2, '0')];
    let new_range, table_header='';
    let days = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'];

    if (semester) {
        table_header = `<th></th>`;
        let winter_semester = ['01', '02', '10', '11', '12']
        if (winter_semester.hasOwnProperty(month_number)) {
            new_range = "Semestr zimowy";
        }

        else {
            new_range = "Semestr letni";
        }
    }

    else {
        if (next_range) {
            new_range = `${month_after_string} ${month_after.getFullYear()}`;
        }
        else {
            new_range = `${month_before_string} ${month_before.getFullYear()}`;
        }
    }

    for (let i = 0; i < 7; i++) {
        table_header += `<th>${days[i]}</th>`;
    }

    //console.log(new_range)  // wyswietla miesiac i rok

    return [new_range, table_header];
}

//Funkcja do obliczania współrzędnych dla podanego kafelka
//output: Object(współrzędne x, y) kafelka
function get_table_tile_coordinates(row, column) {
    const table = document.querySelector(".calendar_view");
    if (table) {
        const cell = table.rows[row].cells[column];
        if (cell) {
            const rect = cell.getBoundingClientRect();
            return { x: rect.left, y: rect.top };
        }
    }
    return null;
}

//Funkcja do obliczania wymiarów dla podanego kafelka
//output: Object(wymiary width, height) kafelka
function get_table_tile_dimensions(row, column) {
    const table = document.querySelector(".calendar_view");
    if (table) {
        const cell = table.rows[row].cells[column];
        if (cell) {
            const rect = cell.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
        }
    }
    return null;
}

//Funkcja do dodawania kafelka do kalendarza
//input: godzina startu, minuty startu, minuty trwania, nr_kolumny (od 1), tekst, forma zajec
function add_tile_calendar(hour_start, minutes_start, minutes_duration, column, text, form) {
    const row = hour_start - 6;
    const dims = get_table_tile_dimensions(row, column);
    let tile_upper_line = minutes_start / 60;
    tile_upper_line *= dims.height;

    const coordinates = get_table_tile_coordinates(row, column);
    const tile_duration_hour = minutes_duration / 60;

    if (coordinates) {
        const tile = document.createElement('div');
        tile.classList.add('calendar_tile');
        tile.style.left = `${coordinates.x}px`;
        tile.style.top = `${coordinates.y + tile_upper_line}px`;
        tile.style.width = `${dims.width}px`;
        tile.style.height = `${dims.height * tile_duration_hour}px`;
        tile.innerText = text;

        if (form === "laboratorium") {
            tile.style.backgroundColor = 'var(--color_laby)';
        }
        else if (form === "wykład") {
            tile.style.backgroundColor = 'var(--color_wyklad)';
        }
        else if (form === "lektorat") {
            tile.style.backgroundColor = 'var(--color_lektorat)';
        }
        else if (form === "projekt") {
            tile.style.backgroundColor = 'var(--color_projekt)';
        }
        else if (form === "własnyKafelek") {
            tile.style.backgroundColor = 'var(--color_kafelek)';
        }
        else if (form === "audytoryjne") {
            tile.style.backgroundColor = 'var(--color_audytorium)';
        }
        else {
            tile.style.backgroundColor = 'var(--color_konsultacje)';
        }

        document.body.appendChild(tile);

        window.addEventListener('resize', () => {
            const new_dims = get_table_tile_dimensions(row, column);
            const new_coordinates = get_table_tile_coordinates(row, column);
            if (new_dims && new_coordinates) {
                tile.style.left = `${new_coordinates.x}px`;
                tile.style.top = `${new_coordinates.y}px`;
                tile.style.width = `${new_dims.width}px`;
                tile.style.height = `${new_dims.height}px`;
            }
        });
    }
}

//Funkcja do usuwania wszystkich kafelków z kalendarza
function clear_tiles_calendar() {
    const tiles = document.querySelectorAll('.calendar_tile');
    tiles.forEach(tile => {
        tile.remove();
    });
}

//Strzałka w lewo
document.querySelector(".calendar_range button:nth-child(1)").addEventListener("click", () => {
const table = document.querySelector(".calendar_view");
    let row_count = table.rows.length;
    let column_count = table.rows[0].cells.length;

    let table_header = `
    <thead>
        <tr>`;

    let new_range;

    // Widok dzisiaj
    if (row_count === 14 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table);
    }

    // Widok dzienny
    if (row_count === 42 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table);
    }

    // Widok tydzień
    if (row_count === 14 && column_count === 8) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table);
    }

    // Widok miesiąc
    if (row_count === 6 && column_count === 7) {
        [new_range, table_header] = render_head_range_semester_month(false);
    }

    //Widok semestr
    if (row_count === 16 && column_count === 8) {
        table_header = render_head_range_semester_month(true)[1];
        new_range = set_semester_range();
    }

    table_header += `</tr></thead>`;
    table.tHead.innerHTML = table_header;

    document.querySelector(".calendar_range span").innerHTML = new_range;
    show_tiles();
});

//Strzałka w prawo
document.querySelector(".calendar_range button:nth-child(3)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");
    let row_count = table.rows.length;
    let column_count = table.rows[0].cells.length;

    let table_header = `
    <thead>
        <tr>`;

    let new_range;

    // Widok dzisiaj
    if ( row_count === 14 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, true);
    }

    // Widok dzienny
    if (row_count === 42 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, true);
    }

    // Widok tydzień
    if (row_count === 14 && column_count === 8) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, true);
    }

    // Widok miesiąc
    if (row_count === 6 && column_count === 7) {
        [new_range, table_header] = render_head_range_semester_month(false, true);
    }

    //Widok semestr
    if (row_count === 16 && column_count === 8) {
        table_header = render_head_range_semester_month(true)[1];
        new_range = set_semester_range();
    }

    table_header += `</tr></thead>`;
    table.tHead.innerHTML = table_header;

    document.querySelector(".calendar_range span").innerHTML = new_range;
    show_tiles();
});

//Ikona kalendarza
document.getElementById("calendar-button").addEventListener("click", () => {
    document.getElementById("date-container").style.display = "block";
});

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("date-container").style.display = "none";
});


const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const confirmButton = document.getElementById('confirm-dates');
const calendarRange = document.querySelector('.calendar_range span');
const calendarView = document.querySelector('.calendar_view tbody');


confirmButton.addEventListener('click', function() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (startDate && endDate) {
        calendarRange.textContent = `${startDateInput.value} - ${endDateInput.value}`;
        updateCalendarView(startDate, endDate);
    }

});

function updateCalendarView(startDate, endDate) {
    calendarView.innerHTML = '';

    let currentDate = new Date(startDate);
    let daysInRange = [];


    while (currentDate <= endDate) {
        daysInRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }


    let startDay = startDate.getDay();
    if (startDay === 0) startDay = 7;

    const headerDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So', 'Nd'];
    let updatedHeader = headerDays.slice(startDay - 1).concat(headerDays.slice(0, startDay - 1));

    //Nagłowki
    const tableHeader = document.querySelector('.calendar_view thead tr');
    tableHeader.innerHTML = updatedHeader.map(day => `<th>${day}</th>`).join('');

    //Grupowanie dni w tygodnie
    let weeks = [];
    let currentWeek = [];
    daysInRange.forEach(function(date, index) {
        currentWeek.push(date.getDate());
        if (currentWeek.length === 7 || index === daysInRange.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    //Dodawanie dni do tabeli
    weeks.forEach(function(week) {
        let row = document.createElement('tr');
        week.forEach(function(day) {
            let cell = document.createElement('td');
            cell.textContent = day || '';
            row.appendChild(cell);
        });
        calendarView.appendChild(row);
    });
}

if (theme === "dark") {
    document.querySelector("body").classList.add("dark");
}

if (theme === "light") {
    document.querySelector("body").classList.add("light");
}