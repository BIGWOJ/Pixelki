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



//Kalendarz zakresowy
document.querySelector(".range-calendar").addEventListener("click", () => {
    //console.log("Kalendarz zakresowy\nJeszcze nie zrobione");
});

//Zastosowanie filtrów po kliknięciu w przycisk "Filtruj"
document.querySelector(".filter-buttons button:nth-child(1)").addEventListener("click", () => {
    show_tiles();
});


let laboratoriumNumber;
let wykladNumber;
let lektoratNumber;
let audytoriumNumber;
let projektNumber;
let konsultacjeNumber;
let wlasnyKafelekNumber;

resetStatistics();


function resetStatistics() {
    laboratoriumNumber = 0;
    wykladNumber = 0;
    lektoratNumber = 0;
    audytoriumNumber = 0;
    projektNumber = 0;
    konsultacjeNumber = 0;
    wlasnyKafelekNumber = 0;
}

function valid_inputs(lecturer, room, subject, group, index_number) {
    const text_format = /^[a-zA-Z\s]+$/;
    const number_format = /^[0-9]{1,5}$/;
    const group_format = /^[a-zA-Z0-9\sąćęłńóśźżĄĆĘŁŃÓŚŹŻ_+.\-\/]+$/;
    const sql_test = /\bdrop\b|\btable\b|\bselect\b|\bfrom\b/i;

    if (lecturer && (!text_format.test(lecturer) || sql_test.test(lecturer))) return false;
    if (room && (!text_format.test(room) || sql_test.test(room))) return false;
    if (subject && (!text_format.test(subject) || sql_test.test(subject))) return false;
    if (group && (!group_format.test(group) || sql_test.test(group))) return false;
    if (index_number && (!number_format.test(index_number))) return false;

    return true;
}

function show_tiles(){
    clear_tiles_calendar();

    const wykladowca = document.getElementById("lecturer").value;
    const sala = document.getElementById("room").value;
    const przedmiot = document.getElementById("subject").value;
    const grupa = document.getElementById("group").value;
    const numerAlbumu = document.getElementById("album-number").value;
    const forma = document.getElementById("forma-zajec").value;

    //Walidacja danych wejściowych
    if (!valid_inputs(wykladowca, sala, przedmiot, grupa, numerAlbumu, forma)) {
        alert("Wprowadź poprawne dane");
        return;
    }

    if (wykladowca.length === 0 && sala.length === 0 && przedmiot.length === 0 && grupa.length === 0 && numerAlbumu.length === 0 && forma.length === 0) {
        resetStatistics();
        showStatistics();
        return;
    }

    if (forma === "konsultacje" && (sala.length != 0 || przedmiot.length != 0 || grupa.length != 0 || numerAlbumu.length != 0)){
        resetStatistics();
        showStatistics();
        return;
    }

    const calendar = document.querySelector(".calendar");
    var dataStart, dataEnd;

    //Obliczanie daty początkowej i końcowej dla danego zakresu kalendarza
    if (calendar.id === "dzisiejszy"){
        let data = document.querySelector(".calendar_view thead th:nth-child(2)").textContent;
        let parts = data.split(".");
        dataStart = `${parts[2]}-${parts[1]}-${parts[0]}`;
        dataEnd = dataStart;
        let dateAdd = new Date(dataEnd);
        dateAdd.setDate(dateAdd.getDate() + 1);
        dataEnd = dateAdd.toISOString().split('T')[0];
        //console.log(data);
    }

    else if (calendar.id === "dzienny"){
        const data = document.querySelector(".calendar_range span").textContent;
        let parts = data.split(" ");
        let year = parts[1];
        dataStart = year + "-";
        let str = document.querySelector(".calendar_view thead th:nth-child(2)").textContent;
        parts = str.split(".");
        dataStart += parts[1] + "-" + parts[0];
        dataEnd = new Date(new Date(dataStart).setDate(new Date(dataStart).getDate() + 5));
        let dateAdd = new Date(dataEnd);
        dateAdd.setDate(dateAdd.getDate() + 1);
        dataEnd = dateAdd.toISOString().split('T')[0];
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
        dataEnd = parts[1].split(".");
        dataEnd = dataEnd.reverse().join("-");
        dataEnd = year + "-" + dataEnd;

    }

    else if (calendar.id === "miesieczny") {
        let months_dict = {
            '01': 'styczeń', '02': 'luty', '03': 'marzec', '04': 'kwiecień', '05': 'maj',
            '06': 'czerwiec', '07': 'lipiec', '08': 'sierpień', '09': 'wrzesień',
            '10': 'październik', '11': 'listopad', '12': 'grudzień'
        };

        const date = document.querySelector(".calendar_range span").textContent;
        let [month_string, year] = date.split(" ");
        let month_number = Object.keys(months_dict).find(key => months_dict[key] === month_string).padStart(2, '0');
        year = Number(year);
        month_number = Number(month_number);

        dataStart = new Date(year, month_number-1, 2).toISOString().split('T')[0];
        dataEnd = new Date(year, month_number, 1).toISOString().split('T')[0];
         //console.log(dataStart, dataEnd);
    }

    else if (calendar.id === "semestralny"){
        if (document.querySelector(".calendar_range span").textContent === "Semestr letni"){
            dataStart = letniStart;
            dataEnd = letniEnd;
        }
        else {
            dataStart = zimowyStart;
            dataEnd = zimowyEnd;
        }
    }

    else if (calendar.id === "custom") {
        dataStart = document.getElementById("start-date").value;
        dataEnd = document.getElementById("end-date").value;
        let dataEnd2 = new Date(dataEnd);
        dataEnd2.setDate(dataEnd2.getDate() + 1);
        dataEnd = dataEnd2.toISOString().split('T')[0];
        // console.log(dataStart, dataEnd);
    }

    //console.log(dataStart, dataEnd);
    //Pobieranie planu zajęć z bazy na podstawie filtrów oraz daty początkowej i końcowej
    fetch("process.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({wykladowca, sala, przedmiot, grupa, numerAlbumu, forma, dataStart, dataEnd})
    })
        .then(response => response.json())
        .then(data => {
            //Posortowanie zajęć według godziny zaczęcia
            data.sort((a, b) => new Date(a.start) - new Date(b.start));
            //console.log(data);

            //Wyświetlanie kafelków dla danego typu kalendarza
            if (calendar.id === "dzisiejszy") {
                    data.forEach(function(index){
                        let timeStart = new Date(index["start"]);
                        let hour = timeStart.getHours();
                        let minute = timeStart.getMinutes();

                        let timeEnd = new Date(index["koniec"]);

                        let timeEndMinutes;
                        if (timeEnd.getMinutes() === Number(0)) {
                            timeEndMinutes = "00";
                        }
                        else {
                            timeEndMinutes = timeEnd.getMinutes();
                        }

                        let roznica = timeEnd - timeStart;
                        roznica = roznica / 1000 / 60;

                        let text = timeStart.getHours() + ":" + timeStart.getMinutes() + " - " + timeEnd.getHours() + ":" + timeEndMinutes
                            + "\n" + index["tytul"];
                        let info = index["tytul"] + "\n" + "Prowadzący: " + index["imie"] + " " + index["nazwisko"] + "\n" + "Sala: " + index["3"]
                            + " " + index["pokoj"] + "\n" + "Grupa: " + index["2"] + "\n" + index["formaZajec"];


                        // zliczanie do statystyk
                        if (index["formaZajec"] === "laboratorium") laboratoriumNumber++;
                        else if (index["formaZajec"] === "wykład") wykladNumber++;
                        else if (index["formaZajec"] === "lektorat") lektoratNumber++;
                        else if (index["formaZajec"] === "audytoryjne") audytoriumNumber++;
                        else if (index["formaZajec"] === "projekt") projektNumber++;
                        else if (index["formaZajec"] === "własnyKafelek") wlasnyKafelekNumber++;
                        else if (index["opis"].includes("Konsultacje")) konsultacjeNumber++;
                        //


                        const dataTD = document.querySelectorAll(".calendar_view tbody tr td:nth-child(2)");
                        dataTD.forEach(function(indexTH, indexNum){
                            add_tile_calendar(hour, minute, roznica, 1, text, index["formaZajec"], info);
                        })

                    });
                }

            else if (calendar.id === "dzienny") {
                let current_lesson_day, previous_lesson_day;
                let jump_day = 0;
                for (let i = 0; i < data.length; i++) {
                    let index = data[i];
                    let timeStart = new Date(index["start"]);
                    let hour = timeStart.getHours();
                    let minute = timeStart.getMinutes();
                    let timeEnd = new Date(index["koniec"]);
                    let timeEndMinutes;
                    if (timeEnd.getMinutes() === Number(0)) {
                        timeEndMinutes = "00";
                    }
                    else {
                        timeEndMinutes = timeEnd.getMinutes();
                    }


                    let text = timeStart.getHours() + ":" + timeStart.getMinutes() + " - " + timeEnd.getHours() + ":" + timeEndMinutes
                        + "\n" + index["tytul"];
                    let info = index["tytul"] + "\n" + "Prowadzący: " + index["imie"] + " " + index["nazwisko"] + "\n" + "Sala: " + index["3"]
                        + " " + index["pokoj"] + "\n" + "Grupa: " + index["2"] + "\n" + index["formaZajec"];

                    current_lesson_day = index["start"].split("T")[0].split("-")[2];
                    previous_lesson_day = data[i-1] ? data[i-1]["start"].split("T")[0].split("-")[2] : null;

                    // zliczanie do statystyk
                    if (index["formaZajec"] === "laboratorium") laboratoriumNumber++;
                    else if (index["formaZajec"] === "wykład") wykladNumber++;
                    else if (index["formaZajec"] === "lektorat") lektoratNumber++;
                    else if (index["formaZajec"] === "audytoryjne") audytoriumNumber++;
                    else if (index["formaZajec"] === "projekt") projektNumber++;
                    else if (index["formaZajec"] === "własnyKafelek") wlasnyKafelekNumber++;
                    else if (index["opis"].includes("Konsultacje")) konsultacjeNumber++;
                    //

                    //Przesunięcie kafelka o dzień
                    if (current_lesson_day !== previous_lesson_day && previous_lesson_day !== null) {
                        jump_day += 840;
                    }
                    add_tile_calendar(6, (hour-6)*60+minute+jump_day, 90, 1, text, index["formaZajec"], info);
                }
                showStatistics();
            }

            else if (calendar.id === "tygodniowy"){
                data.forEach(function(index){

                    let timeStart = new Date(index["start"]);
                    let hour = timeStart.getHours();
                    let minute = timeStart.getMinutes();

                    let timeEnd = new Date(index["koniec"]);
                    //console.log(timeEnd.getMinutes());

                    let timeEndMinutes;
                    if (timeEnd.getMinutes() === Number(0)) {
                        timeEndMinutes = "00";
                    }
                    else {
                        timeEndMinutes = timeEnd.getMinutes();
                    }

                    let roznica = timeEnd - timeStart;
                    roznica = roznica / 1000 / 60;

                    let text = timeStart.getHours() + ":" + timeStart.getMinutes() + " - " + timeEnd.getHours() + ":" + timeEndMinutes
                        + "\n" + index["tytul"];
                    let info = index["tytul"] + "\n" + "Prowadzący: " + index["imie"] + " " + index["nazwisko"] + "\n" + "Sala: " + index["3"]
                        + " " + index["pokoj"] + "\n" + "Grupa: " + index["2"] + "\n" + index["formaZajec"];


                    // zliczanie do statystyk
                    if (index["formaZajec"] === "laboratorium") laboratoriumNumber++;
                    else if (index["formaZajec"] === "wykład") wykladNumber++;
                    else if (index["formaZajec"] === "lektorat") lektoratNumber++;
                    else if (index["formaZajec"] === "audytoryjne") audytoriumNumber++;
                    else if (index["formaZajec"] === "projekt") projektNumber++;
                    else if (index["formaZajec"] === "własnyKafelek") wlasnyKafelekNumber++;
                    else if (index["opis"].includes("Konsultacje")) konsultacjeNumber++;
                    //

                    const dataTH = document.querySelectorAll(".calendar_view thead th");

                    dataTH.forEach(function(indexTH, indexNum){
                        if (indexNum > 0) {
                            let str = indexTH.textContent;
                            let part = str.split(' ')[1].split('.')[0];

                            if (timeStart.getDate() === Number(part)){
                                add_tile_calendar(hour, minute, roznica, indexNum, text, index["formaZajec"], info);
                            }
                        }


                    })

                });
            }

            else if (calendar.id === "miesieczny") {
                //console.log("miesieczny");
                //console.log(data);
                let current_lesson_day, previous_lesson_day;
                let jump_day = 0;
                let jump_day_licznik = 0;
                let indexLicznik = data[0];
                let previousDay = new Date(indexLicznik["start"]);
                previousDay = previousDay.toISOString().split('T')[0];
                let dataLicznik = new Date(indexLicznik["start"]);
                for (let i = 0; i < data.length; i++) {
                    let index = data[i];
                    let timeStart = new Date(index["start"]);
                    let hour = timeStart.getHours();
                    let minute = timeStart.getMinutes();
                    let timeEnd = new Date(index["koniec"]);
                    let timeEndMinutes;
                    if (timeEnd.getMinutes() === Number(0)) {
                        timeEndMinutes = "00";
                    }
                    else {
                        timeEndMinutes = timeEnd.getMinutes();
                    }

                    const daysOfWeek = ["Pon", "Wto", "Śro", "Czw", "Pia", "Sob", "Nie"];
                    const dayOfWeek = daysOfWeek[(dataLicznik.getDay() + 6) % 7];




                    let roznica = timeEnd - timeStart;
                    roznica = roznica / 1000 / 60;

                    let text = timeStart.getHours() + ":" + timeStart.getMinutes() + " - " + timeEnd.getHours() + ":" + timeEndMinutes
                        + "\n" + index["tytul"];
                    let info = index["tytul"] + "\n" + "Prowadzący: " + index["imie"] + " " + index["nazwisko"] + "\n" + "Sala: " + index["3"]
                        + " " + index["pokoj"] + "\n" + "Grupa: " + index["2"] + "\n" + index["formaZajec"];

                    current_lesson_day = index["start"].split("T")[0].split("-")[2];
                    previous_lesson_day = data[i-1] ? data[i-1]["start"].split("T")[0].split("-")[2] : null;

                    // zliczanie do statystyk
                    if (index["formaZajec"] === "laboratorium") laboratoriumNumber++;
                    else if (index["formaZajec"] === "wykład") wykladNumber++;
                    else if (index["formaZajec"] === "lektorat") lektoratNumber++;
                    else if (index["formaZajec"] === "audytoryjne") audytoriumNumber++;
                    else if (index["formaZajec"] === "projekt") projektNumber++;
                    else if (index["formaZajec"] === "własnyKafelek") wlasnyKafelekNumber++;
                    else if (index["opis"].includes("Konsultacje")) konsultacjeNumber++;
                    //




                    //Przesunięcie kafelka o dzień
                    if (current_lesson_day !== previous_lesson_day && previous_lesson_day !== null) {
                        //console.log(dayOfWeek + " dodalo 1 warunek");
                        jump_day += 840;
                    }


                    if (dataLicznik.toISOString().split('T')[0] != timeStart.toISOString().split('T')[0] && (dayOfWeek === "Pia")){
                        //console.log("timeStart " + timeStart);
                        //console.log(dayOfWeek + " dodalo 2 warunek");
                        jump_day += 1680;
                        dataLicznik.setDate(dataLicznik.getDate() + 2);
                    }


                    add_tile_calendar(6, (hour-6)*60+minute+jump_day+jump_day_licznik, roznica, 1, text, index["formaZajec"], info);


                    if (previousDay != timeStart.toISOString().split('T')[0]) {
                        dataLicznik.setDate(dataLicznik.getDate() + 1);
                    }
                    previousDay = new Date(timeStart);
                    previousDay = previousDay.toISOString().split('T')[0];
                }

            }

            else if (calendar.id === "semestralny") {
                let current_lesson_day, previous_lesson_day;
                let jump_day = 0;
                let jump_day_licznik = 0;
                let indexLicznik = data[0];
                let previousDay = new Date(indexLicznik["start"]);
                previousDay = previousDay.toISOString().split('T')[0];
                let dataLicznik = new Date(indexLicznik["start"]);
                for (let i = 0; i < data.length; i++) {
                    let index = data[i];
                    let timeStart = new Date(index["start"]);
                    let hour = timeStart.getHours();
                    let minute = timeStart.getMinutes();
                    let timeEnd = new Date(index["koniec"]);
                    let timeEndMinutes;
                    if (timeEnd.getMinutes() === Number(0)) {
                        timeEndMinutes = "00";
                    }
                    else {
                        timeEndMinutes = timeEnd.getMinutes();
                    }

                    const daysOfWeek = ["Pon", "Wto", "Śro", "Czw", "Pia", "Sob", "Nie"];
                    const dayOfWeek = daysOfWeek[(dataLicznik.getDay() + 6) % 7];




                    let roznica = timeEnd - timeStart;
                    roznica = roznica / 1000 / 60;

                    let text = timeStart.getHours() + ":" + timeStart.getMinutes() + " - " + timeEnd.getHours() + ":" + timeEndMinutes
                        + "\n" + index["tytul"];
                    let info = index["tytul"] + "\n" + "Prowadzący: " + index["imie"] + " " + index["nazwisko"] + "\n" + "Sala: " + index["3"]
                        + " " + index["pokoj"] + "\n" + "Grupa: " + index["2"] + "\n" + index["formaZajec"];

                    current_lesson_day = index["start"].split("T")[0].split("-")[2];
                    previous_lesson_day = data[i-1] ? data[i-1]["start"].split("T")[0].split("-")[2] : null;

                    // zliczanie do statystyk
                    if (index["formaZajec"] === "laboratorium") laboratoriumNumber++;
                    else if (index["formaZajec"] === "wykład") wykladNumber++;
                    else if (index["formaZajec"] === "lektorat") lektoratNumber++;
                    else if (index["formaZajec"] === "audytoryjne") audytoriumNumber++;
                    else if (index["formaZajec"] === "projekt") projektNumber++;
                    else if (index["formaZajec"] === "własnyKafelek") wlasnyKafelekNumber++;
                    else if (index["opis"].includes("Konsultacje")) konsultacjeNumber++;
                    //




                    //Przesunięcie kafelka o dzień
                    if (current_lesson_day !== previous_lesson_day && previous_lesson_day !== null) {
                        //console.log(dayOfWeek + " dodalo 1 warunek");
                        jump_day += 840;
                    }


                    if (dataLicznik.toISOString().split('T')[0] != timeStart.toISOString().split('T')[0] && (dayOfWeek === "Pia")){
                        //console.log("timeStart " + timeStart);
                        //console.log(dayOfWeek + " dodalo 2 warunek");
                        jump_day += 1680;
                        dataLicznik.setDate(dataLicznik.getDate() + 2);
                    }


                    add_tile_calendar(6, (hour-6)*60+minute+jump_day+jump_day_licznik, roznica, 1, text, index["formaZajec"], info);


                    if (previousDay != timeStart.toISOString().split('T')[0]) {
                        dataLicznik.setDate(dataLicznik.getDate() + 1);
                    }
                    previousDay = new Date(timeStart);
                    previousDay = previousDay.toISOString().split('T')[0];
                }
            }

            else if (calendar.id === "custom") {
                let current_day, start_hour, end_hour, lesson_name;
                //Tworzenie hash mapy dla dni z zajęciami
                let days_info = {};

                for (let day = 1; day <= 31; day++) {
                    let dayString = day.toString().padStart(2, '0');
                    if (!days_info[dayString]) {
                        days_info[dayString] = [];
                    }
                }

                for (let lesson = 0; lesson < data.length; lesson++) {
                    current_day = new Date(data[lesson]["start"]).toISOString().split('T')[0].split("-")[2];
                    if (!days_info[current_day]) {
                        days_info[current_day] = [];
                    }

                    lesson_name = data[lesson]["tytul"];
                    start_hour = new Date(data[lesson]["start"]).toLocaleString().split(",")[1].split(":").slice(0,2).join(":");
                    end_hour = new Date(data[lesson]["koniec"]).toLocaleString().split(",")[1].split(":").slice(0,2).join(":");
                    days_info[current_day].push(lesson_name + " " + start_hour + " - " + end_hour);
                }


                //Przechodzenie przez wszystkie komórki
                let column_counter = 0;
                let row_counter = 0;
                let day_info;
                const cells = document.querySelectorAll(".calendar_view td");
                cells.forEach(cell => {
                    if (cell.innerHTML.length === 1) {
                        cell.innerHTML = "0" + cell.innerHTML;
                    }
                    if (days_info[cell.innerText]) {
                        day_info = days_info[cell.innerText].join("\n");
                    }
                    else {
                        day_info = "";
                    }


                    add_tile_calendar(7, 60*row_counter, 60, column_counter, "", "", day_info, false);
                    column_counter += 1;
                    if (column_counter === 7) {
                        column_counter = 0;
                        row_counter += 1;
                    }
                });
            }

            showStatistics();
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
                            add_tile_calendar(hour, minute, roznica, indexNum, text, "własnyKafelek", text);
                            wlasnyKafelekNumber++;
                        }
                    }
                })
            }
            else if (calendar.id === "dzisiejszy" && indexUlub["date"] === dataStart) {
                dataTD.forEach(function(indexTH){
                    let hourCheck = indexTH.previousElementSibling;
                    if (hourCheck.textContent === hour) {
                        add_tile_calendar(hour, minute, roznica, 1, text, "własnyKafelek", text);
                        wlasnyKafelekNumber++;
                    }
                })
            }

        });
    }

    document.getElementById("statistics-wlasny-kafelek-number").textContent = wlasnyKafelekNumber.toString();
    resetStatistics();
}

function showStatistics(){
    const statistics = document.getElementById("statistics");
    statistics.style.display = "flex";
    document.getElementById("statistics-laboratorium-number").textContent = laboratoriumNumber.toString();
    document.getElementById("statistics-wyklad-number").textContent = wykladNumber.toString();
    document.getElementById("statistics-lektorat-number").textContent = lektoratNumber.toString();
    document.getElementById("statistics-audytorium-number").textContent = audytoriumNumber.toString();
    document.getElementById("statistics-projekt-number").textContent = projektNumber.toString();
    document.getElementById("statistics-konsultacje-number").textContent = konsultacjeNumber.toString();
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
    show_tiles();
});

//Dzienny widok kalendarza
document.querySelector("#daily_button").addEventListener("click", () => {
    initialize_date_range();
    const table = document.querySelector(".calendar_view");
    let connected_table = '';
    //let lesson_hours = ['8:30 - 10:00', '10:15 - 12:00', '14:15 - 16:00', '16:15 - 18:00', '18:15 - 19:30']
    let current_date = new Date();
    let week_start = current_date.getDate() - current_date.getDay() + 1;

    for (let i = 0; i < 7; i++) {
        //Head jednego dnia
        let date = new Date(current_date.setDate(week_start + i)).toLocaleDateString();

        const daily_header = `
            <thead>
                <tr>
                    <th></th>
                    <th>${date.split('.').slice(0,2).join('.')}</th>
                </tr>
            </thead>`;

        //Body dziennego widoku
        let daily_body = `<tbody>`;
        for (let j = 0; j < 13; j++) {
            daily_body += `<tr>`;
            for (let k = 0; k < 2; k++) {
                if (k === 0) {
                    daily_body += `<td>${7+j}</td>`;
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
    show_tiles();
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
    const calendar = document.querySelector('.calendar');
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();


    function generateCalendar(year, month) {

        if (calendar.id === "miesieczny") {
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


            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const offset = (firstDay === 0 ? 6 : firstDay - 1);


            let monthly_body = `<tbody>`;
            let day = 1;


            for (let i = 0; i < 6; i++) {
                let row = "<tr>";
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < offset) {

                        row += "<td></td>";
                    } else if (day > daysInMonth) {

                        row += "<td></td>";
                    } else {

                        row += `<td>${day}</td>`;
                        day++;
                    }
                }
                row += "</tr>";
                monthly_body += row;

                if (day > daysInMonth) break;
            }
            monthly_body += `</tbody>`;

            table.innerHTML = monthly_header + monthly_body;
        }



    }


    prevButton.addEventListener("click", () => {
        month -= 1;
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        generateCalendar(year, month);
    });

    nextButton.addEventListener("click", () => {
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
        generateCalendar(year, month);
    });

    calendar.id = "miesieczny";
    generateCalendar(year, month);
    show_tiles();
});

// Pobieranie dat z zakresu semestrow

let letniStart;
let letniEnd;
let zimowyStart;
let zimowyEnd;

function getDatesSemestr() {
    fetch("semestrShow.php", {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            data.forEach(function (index) {
                let text = index["start"] + " - " + index["end"];
                if (index["name"] === "Semestr zimowy") {
                    //document.getElementById("semestr-zimowy-date").textContent = text;
                    zimowyStart = index["start"];
                    zimowyEnd = index["end"];
                }
                else {
                    //document.getElementById("semestr-letni-date").textContent = text;
                    letniStart = index["start"];
                    letniEnd = index["end"];
                }
            })
        })
}

getDatesSemestr();



//Semestralny widok kalendarza
document.querySelector("#semester_button").addEventListener("click", () => {
    document.querySelector(".calendar_range span").innerHTML = "Semestr letni";
    calendarSemestr();
});

function calendarSemestr() {
    //initialize_date_range(true);
    const table = document.querySelector(".calendar_view");
    let connected_table = '';
    let current_date = new Date();
    let startDate;


    let endDate;
    const semestr = document.querySelector(".calendar_range span").textContent;

    //console.log(semestr);

    if (semestr === "Semestr letni") {
        startDate = letniStart;
        endDate = letniEnd;
    }
    else {
        startDate = zimowyStart;
        endDate = zimowyEnd;
    }

    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);
    //console.log(dateStart, dateEnd);

    let roznica = (dateEnd - dateStart) / (24 * 60 * 60 * 1000);
    roznica++;

    for (let i = 0; i < roznica; i++) {
        let date = new Date(dateStart);
        date.setDate(dateStart.getDate() + i);

        let formattedDate = date.toLocaleDateString();
        const daily_header = `
            <thead>
                <tr>
                    <th></th>
                    <th>${formattedDate.split('.').slice(0,2).join('.')}</th>
                </tr>
            </thead>`;

        //Body dziennego widoku
        let daily_body = `<tbody>`;
        for (let j = 0; j < 13; j++) {
            daily_body += `<tr>`;
            for (let k = 0; k < 2; k++) {
                if (k === 0) {
                    daily_body += `<td>${7+j}</td>`;
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
    calendar.id = "semestralny";
    show_tiles();
}

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
    const calendar = document.querySelector('.calendar');

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
    // console.log(row_count, )

    //Widok dzienny
    if ((column_count === 2 && row_count === 98)) {
        console.log("Dzienny");
        let first_date = get_dates(year_input=false);
        let current_year = document.querySelector(".calendar_range span").innerHTML.split(' ')[1];
        first_date = new Date(parseInt(current_year), first_date[0].split('.')[1] - 1, first_date[0].split('.')[0]);

        if (next_range) {
            table_header = `<th></th>
                        <th>${(new Date(first_date.setDate(first_date.getDate() + 7)).toLocaleDateString()).split('.').slice(0, 2).join('.')}</th>`;
        }

        else {
            table_header = `<th></th>
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

    //Widok miesiąc
    if (calendar.id === "miesieczny") {
        let months_dict = {
            '01': 'styczeń', '02': 'luty', '03': 'marzec', '04': 'kwiecień', '05': 'maj',
            '06': 'czerwiec', '07': 'lipiec', '08': 'sierpień', '09': 'wrzesień',
            '10': 'październik', '11': 'listopad', '12': 'grudzień'
        };

        const date = document.querySelector(".calendar_range span").textContent;
        let [month_string, year] = date.split(" ");
        let month_number = Object.keys(months_dict).find(key => months_dict[key] === month_string).padStart(2, '0');
        year = Number(year);
        month_number = Number(month_number);

        if (next_range) {
            month_number++;
            if (month_number > 12) {
                month_number = 1;
                year++;
            }
        }

        else {
            month_number--;
            if (month_number < 1) {
                month_number = 12;
                year--;
            }
        }

        let next_month = months_dict[month_number.toString().padStart(2, '0')];
        new_range = `${next_month} ${year}`;

    }

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

    table_header += `<th></th><th>${month_after.getMonth()} ${month_after.getFullYear()}</th>`;
    // for (let i = 0; i < 7; i++) {
    //     table_header += `<th>${days[i]}</th>`;
    // }

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
function add_tile_calendar(hour_start, minutes_start, minutes_duration, column, text, form, infoText, render_border=True) {
    const row = hour_start - 6;
    const dims = get_table_tile_dimensions(row, column);

    let tile_upper_line = minutes_start / 60;
    tile_upper_line *= dims.height;

    const coordinates = get_table_tile_coordinates(row, column);
    const tile_duration_hour = minutes_duration / 60;
    const calendar = document.querySelector('.calendar');

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

        if (calendar.id === "custom") {
            tile.style.backgroundColor = '';
        }
        const info = document.createElement("div");

        if (!render_border) {
            tile.style.border = "none";
        }

        //Widok kalendarza zakresowego
        if (calendar.id === "custom") {
            tile.addEventListener('click', () => {
                info.className = "tile-info";
                info.innerText = infoText;
                info.style.visibility = "visible";
                info.style.opacity = "1";

                document.body.appendChild(info);
            });

            tile.addEventListener('mousemove', (e) => {
                info.style.top = `${e.pageY + 10}px`;
                info.style.left = `${e.pageX + 10}px`;
            });

            document.addEventListener('click', (e) => {
                if (!tile.contains(e.target)) {
                    info.style.visibility = "hidden";
                    info.style.opacity = "0";
                }
            });
            tile.addEventListener('mouseleave', () => {
                document.body.removeChild(info);
            });
        }

        //Widok wszystkich pozostałych kalendarzy
        else {
            tile.addEventListener('mouseenter', () => {
                info.className = "tile-info";
                info.innerText = infoText;
                info.style.visibility = "visible";
                info.style.opacity = "1";

                document.body.appendChild(info);
            });

            tile.addEventListener('mousemove', (e) => {
                info.style.top = `${e.pageY + 10}px`;
                info.style.left = `${e.pageX + 10}px`;
            });

            tile.addEventListener('mouseleave', () => {
                document.body.removeChild(info);
            });
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
    //console.log(row_count, column_count);
    let table_header = `
    <thead>
        <tr>`;

    let new_range;
    const calendar = document.querySelector(".calendar");

    // Widok dzisiaj
    if (row_count === 14 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table);
    }

    // Widok dzienny
    if (row_count === 98 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table);
    }

    // Widok tydzień
    if (row_count === 14 && column_count === 8) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table);
    }

    // Widok miesiąc
    if (calendar.id === "miesieczny") {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, false);
    }

    // const calendar = document.querySelector(".calendar");
    // //Widok semestr
    if (calendar.id === "semestralny") {
        if (document.querySelector(".calendar_range span").innerHTML === "Semestr zimowy") new_range = "Semestr letni";
        else new_range = "Semestr zimowy";
    }

    if (calendar.id != "semestralny"){
        table_header += `</tr></thead>`;
        table.tHead.innerHTML = table_header;
    }


    document.querySelector(".calendar_range span").innerHTML = new_range;
    if (calendar.id === "semestralny") {
        calendarSemestr();
    }
    show_tiles();
});

//Strzałka w prawo
document.querySelector(".calendar_range button:nth-child(3)").addEventListener("click", () => {
    const table = document.querySelector(".calendar_view");
    let row_count = table.rows.length;
    let column_count = table.rows[0].cells.length;
    //console.log(row_count, column_count);
    let table_header = `
    <thead>
        <tr>`;

    let new_range;
    const calendar = document.querySelector(".calendar");

    document.querySelector(".calendar_view").addEventListener("click", (event) => {
        const table = event.currentTarget;
        const row = table.rows[4]; // 5th row (index 4)
        const cell = row.cells[2]; // 3rd column (index 2)
        if (event.target === cell) {
            cell.classList.add("highlight");
            const tooltip = document.createElement("div");
            tooltip.style.position = "absolute";
            tooltip.classList.add("tooltip");
            tooltip.innerText = "Treść okna";
            document.body.appendChild(tooltip);
            const rect = cell.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.top + window.scrollY}px`;
            tooltip.style.height = '100px';
            tooltip.style.width = '100px';
            tooltip.style.backgroundColor = 'red';

        } else {
            cell.classList.remove("highlight");
            const tooltip = document.querySelector(".tooltip");
            if (tooltip) {
                tooltip.remove();
            }
        }
    });


    // Widok dzisiaj
    if (row_count === 14 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, true);
    }

    // Widok dzienny
    if (row_count === 98 && column_count === 2) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, true);
    }

    // Widok tydzień
    if (row_count === 14 && column_count === 8) {
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, true);
    }

    // Widok miesiąc
    if (calendar.id === "miesieczny") {
        //console.log("Miesiąc");
        [new_range, table_header] = set_calendar_head(row_count, column_count, table, true);
    }

    //Widok semestr
    if (calendar.id === "semestralny") {
        if (document.querySelector(".calendar_range span").innerHTML === "Semestr zimowy") new_range = "Semestr letni";
        else new_range = "Semestr zimowy";
    }

    if (calendar.id != "semestralny"){
        table_header += `</tr></thead>`;
        table.tHead.innerHTML = table_header;
    }

    document.querySelector(".calendar_range span").innerHTML = new_range;
    if (calendar.id === "semestralny") {
        calendarSemestr();
    }
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
    document.getElementById("date-container").style.display = "none";
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    //Walidacja zakresu dat
    if (!(startDate < endDate)) {
        alert("Data początkowa musi być wcześniejsza od daty końcowej");
        return;
    }

    if (startDate && endDate) {
        calendarRange.textContent = `${startDateInput.value} - ${endDateInput.value}`;
        updateCalendarView(startDate, endDate);
    }
});

function updateCalendarView(startDate, endDate) {
    const calendar = document.querySelector('.calendar');
    const calendarView = document.querySelector('.calendar_view tbody');
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
    const headerHtml = updatedHeader.map(day => `<th>${day}</th>`).join('');
    tableHeader.innerHTML = headerHtml;

    //Grupowanie dni w tygodnie
    let weeks = [];
    let currentWeek = [];
    daysInRange.forEach(function (date, index) {
        currentWeek.push(date);
        if (currentWeek.length === 7 || index === daysInRange.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    //Dodawanie dni do tabeli
    weeks.forEach(function (week) {
        let row = document.createElement('tr');
        week.forEach(function (date) {
            let cell = document.createElement('td');
            cell.textContent = date.getDate();
            cell.style.height = '35px';
            row.appendChild(cell);
        });

        // Dopełnianie tygodnia pustymi komórkami, jeśli jest mniej niż 7 dni
        while (row.children.length < 7) {
            let emptyCell = document.createElement('td');
            emptyCell.textContent = '';
            emptyCell.style.height = '35px';
            row.appendChild(emptyCell);
        }

        calendarView.appendChild(row);
    });

    calendar.id = "custom";

    // const table = document.querySelector(".calendar_view");
    // let current_date = new Date();
    // let week_start = current_date.getDate() - current_date.getDay() + 1;
    // let days_shortcut = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'ndz.'];
    //
    // // // Nagłówki tygodniowego widoku (bez kolumny godzin)
    // let weekly_header = `<thead><tr>`;
    //
    // for (let i = 0; i < 7; i++) {
    //     let date = new Date(current_date.setDate(week_start + i)).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
    //     weekly_header += `<th>${headerDays[i]}</th>`;
    // }
    //
    // weekly_header += `</tr></thead>`;
    // //
    // let weekly_body = `<tbody>`;
    // for (let i = 0; i < 12; i++) {
    //     weekly_body += `<tr>`;
    //     for (let j = 0; j < 7; j++) {
    //         weekly_body += `<td style="height: 50px;"></td>`;
    //     }
    //     weekly_body += `</tr>`;
    // }
    // weekly_body += `</tbody>`;
    //
    // table.innerHTML =  weekly_header + weekly_body;

    //Resetowanie tła dla wszystkich komórek
    let cells = document.querySelectorAll('.calendar_view td');
    cells.forEach(cell => {
        cell.style.backgroundColor = 'var(--color_background)';
    });

    //Podświetlanie dni z zakresu
    let week_count = 0;

    for (let day = 0; day < daysInRange.length; day++) {
        if (day % 7 === 0) {
            week_count += 1;
        }

        const column = (day % 7);
        const cell = document.querySelector(`.calendar_view tr:nth-child(${week_count}) td:nth-child(${column + 1})`);

        if (cell) {
            cell.style.backgroundColor = '#a5bc8f';
            cell.textContent = daysInRange[day].getDate();
        }
    }
}

// Strzalki
document.getElementById("confirm-dates").addEventListener("click", () => {
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    prevButton.style.display = "none";
    nextButton.style.display = "none";
});

["week_button", "today_button", "daily_button", "semester_button", "month_button"].forEach(buttonId => {
    document.getElementById(buttonId).addEventListener("click", () => {
        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");

        prevButton.style.display = "block";
        nextButton.style.display = "block";
    });
});

//Widoczność ikony kalnedarza tylko przy miesiącu
function toggleCalendarButton(view) {
    const calendarButton = document.getElementById("calendar-button");

    if (view === "month") {
        calendarButton.style.display = "block";
    } else {
        calendarButton.style.display = "none";
    }
}

["week_button", "daily_button", "today_button", "semester_button", "month_button"].forEach(buttonId => {
    document.getElementById(buttonId).addEventListener("click", () => {
        if (buttonId === "month_button") {
            toggleCalendarButton("month");
        } else {
            toggleCalendarButton("other");
        }
    });
});


if (theme === "dark") {
    document.querySelector("body").classList.add("dark");
}

if (theme === "light") {
    document.querySelector("body").classList.add("light");
}