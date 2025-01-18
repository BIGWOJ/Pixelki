function generateLink() {
    const wykladowca = document.getElementById("lecturer").value;
    const sala = document.getElementById("room").value;
    const przedmiot = document.getElementById("subject").value;
    const grupa = document.getElementById("group").value;
    const numerAlbumu = document.getElementById("album-number").value;
    const forma = document.getElementById("forma-zajec").value;

    const baseUrl = window.location.href.split("?")[0];

    let url = `${baseUrl}?`;

    if (wykladowca != "") {
        url = url + `lecturer=${encodeURIComponent(wykladowca)}&`;
    }

    if (sala != "") {
        url = url + `room=${encodeURIComponent(sala)}&`;
    }

    if (przedmiot != "") {
        url = url + `subject=${encodeURIComponent(przedmiot)}&`;
    }

    if (grupa != "") {
        url = url + `group=${encodeURIComponent(grupa)}&`;
    }

    if (numerAlbumu != "") {
        url = url + `album-number=${encodeURIComponent(numerAlbumu)}&`
    }

    if (forma != "") {
        url = url + `class-type=${encodeURIComponent(forma)}`;
    }

    navigator.clipboard.writeText(url).then(() => {
        alert("Link został skopiowany!");
    });
}

document.getElementById("copyLink").addEventListener("click", () => {
    generateLink();
})

function paramsEnter() {
    const params = new URLSearchParams(window.location.search);

    const lecturer = params.get("lecturer");
    const room = params.get("room");
    const subject = params.get("subject");
    const group = params.get("group");
    const albumNumber = params.get("album-number");
    const classType = params.get("class-type");

    // console.log(params.get("lecturer"));

    document.getElementById("lecturer").value = params.get("lecturer");
    document.getElementById("room").value = params.get("room");
    document.getElementById("subject").value = params.get("subject");
    document.getElementById("group").value = params.get("group");
    document.getElementById("album-number").value = params.get("album-number");
    // document.getElementById("class-type").value = params.get("class-type");

    // pozniej dodac wyswietlanie od razu planu jak sie wejdzie na strone
}

paramsEnter();