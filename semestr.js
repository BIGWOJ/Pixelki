function changeSemestrDate() {
    const semestr = document.getElementById("semestr-select").value;
    const dateStart = document.getElementById("semestr-start").value;
    const dateEnd = document.getElementById("semestr-end").value;

    if (semestr === "" || dateStart === "" || dateEnd === "") {
        alert("Wypelnij wszystkie pola!");
        return;
    }

    console.log(dateStart);

    fetch("semestr.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({semestr, dateStart, dateEnd})
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
    semestrDateShow();
}


function semestrDateShow() {
    fetch("semestrShow.php", {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(function (index) {
                let text = index["start"] + " - " + index["end"];
                if (index["name"] === "Semestr zimowy") {
                    document.getElementById("semestr-zimowy-date").textContent = text;
                }
                else {
                    document.getElementById("semestr-letni-date").textContent = text;
                }
            })
        })
}

semestrDateShow();


document.querySelector("#semestr-submit").addEventListener("click", () => {
    changeSemestrDate();
})