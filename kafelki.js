//Zarządzanie kafelkami

let ulubione = [];
ulubione = JSON.parse(localStorage.getItem("ulubione")) || [];

const cellsButtonContainer = document.querySelector(".cells-buttons");
document.querySelector(".manage-button").addEventListener("click", (e) => {
    e.stopPropagation();
    cellsButtonContainer.style.display = "flex";
});

document.addEventListener("click", () => {
    cellsButtonContainer.style.display = "none";
});

cellsButtonContainer.addEventListener("click", (e) => {
    e.stopPropagation();
});

// wyswietlenie dodaj, edytuj, usun
const cellContainer = document.querySelector(".cellContainer");

document.querySelector(".cellAdd").addEventListener("click", (e)  => {
    e.stopPropagation();
    cellContainer.style.display = "block";
    cellContainerDelete.style.display = "none";
    cellContainerEdit.style.display = "none"
    cellContainerEditEdit.style.display = "none"
    clear_tiles_calendar();
});

document.addEventListener("click", () => {
    cellContainer.style.display = "none";
});

cellContainer.addEventListener("click", (e) => {
    e.stopPropagation();
});

cellContainer.querySelector(".cellAddButton").addEventListener("click", (e) => {
    cellContainer.style.display = "none";
    addToStorage();
});




function addToStorage() {
    const cellName = document.getElementById("cellName").value;
    const cellDate = document.getElementById("cellDate").value;
    const cellTimeFrom = document.getElementById("inputTimeFrom").value;
    const cellTimeTo = document.getElementById("inputTimeTo").value;
    const cellDescription = document.getElementById("cellDescription").value;
    let id;


    if (ulubione.length === 0) {
        id = 0;
    }
    else {
        id = ulubione[ulubione.length -1].id + 1;
    }

    const object = {
        id: id,
        name: cellName,
        date: cellDate,
        timeFrom: cellTimeFrom,
        timeTo: cellTimeTo,
        description: cellDescription
    };

    ulubione.push(object);
    localStorage.setItem("ulubione", JSON.stringify(ulubione));

    listDelete();
    listEdit();

    document.getElementById("cellName").value = "";
    document.getElementById("cellDate").value = "";
    document.getElementById("inputTimeFrom").value = "";
    document.getElementById("inputTimeTo").value = "";
    document.getElementById("cellDescription").value = "";

}


const cellContainerDelete = document.querySelector(".cellContainerDelete");

document.querySelector(".cellDelete").addEventListener("click", (e)  => {
    e.stopPropagation();
    cellContainerDelete.style.display = "block";
    cellContainer.style.display = "none";
    cellContainerEdit.style.display = "none"
    cellContainerEditEdit.style.display = "none"
    clear_tiles_calendar();
});

document.addEventListener("click", () => {
    cellContainerDelete.style.display = "none";
});

cellContainerDelete.addEventListener("click", (e) => {
    e.stopPropagation();
});

function listDelete() {
    const cellDiv = document.querySelectorAll(".cellTile");

    cellDiv.forEach(cell => cell.remove());

    const deleteContainer = document.querySelector(".cellContainerDelete");

    ulubione.forEach(cell => {
        const newDiv = document.createElement("div");
        newDiv.className = "cellTile";

        const spanText = document.createElement("span");
        spanText.innerText = cell.name;

        newDiv.appendChild(spanText);

        const deleteButton = document.createElement("button");
        deleteButton.className = "tileDelete";
        deleteButton.innerText = "🗑️";
        deleteButton.addEventListener("click", () => deleteRecord(cell.id));

        newDiv.appendChild(deleteButton);

        deleteContainer.appendChild(newDiv);
    });
}

function deleteRecord(deleteRecord) {
    //console.log(deleteRecord);
    const updatedList = ulubione.filter(item => item.id !== deleteRecord);
    localStorage.setItem("ulubione", JSON.stringify(updatedList));
    cellContainerDelete.style.display = "none";
    ulubione = JSON.parse(localStorage.getItem("ulubione")) || [];
    listDelete();
    listEdit();
}

listDelete();

function listEdit() {
    const cellDiv = document.querySelectorAll(".cellTileEdit");

    cellDiv.forEach(cell => cell.remove());

    const editContainer = document.querySelector(".cellContainerEdit");

    ulubione.forEach(cell => {
        const newDiv = document.createElement("div");
        newDiv.className = "cellTile";

        const spanText = document.createElement("span");
        spanText.innerText = cell.name;

        newDiv.appendChild(spanText);

        const editButton = document.createElement("button");
        editButton.className = "fa fa-edit";
        editButton.id = "cellEdit";
        editButton.addEventListener("click", () => editRecord(cell.id));

        newDiv.appendChild(editButton);

        editContainer.appendChild(newDiv);
    });
}

listEdit();

const cellContainerEdit = document.querySelector(".cellContainerEdit");

document.querySelector(".cellEdit").addEventListener("click", (e)  => {
    e.stopPropagation();
    cellContainerDelete.style.display = "none";
    cellContainer.style.display = "none";
    cellContainerEdit.style.display = "block"
    cellContainerEditEdit.style.display = "none"
    clear_tiles_calendar();
});

document.addEventListener("click", () => {
    cellContainerEdit.style.display = "none";
});

cellContainerEdit.addEventListener("click", (e) => {
    e.stopPropagation();
});


const cellContainerEditEdit = document.querySelector(".cellContainerEditEdit");
document.addEventListener("click", () => {
    cellContainerEditEdit.style.display = "none";
});

cellContainerEditEdit.addEventListener("click", (e) => {
    e.stopPropagation();
});

let idEdit;
function editRecord(idRecord) {
    //console.log(id);
    const record = ulubione.filter(item => item.id === idRecord);
    idEdit = record[0].id;
    const name = record[0].name;
    const date = record[0].date;
    const timeFrom = record[0].timeFrom;
    const timeTo = record[0].timeTo;
    const description = record[0].description;

    cellContainerEdit.style.display = "none";
    cellContainerEditEdit.style.display = "block";

    document.getElementById("cellNameEdit").value = name;
    document.getElementById("cellDateEdit").value = date;
    document.getElementById("inputTimeFromEdit").value = timeFrom;
    document.getElementById("inputTimeToEdit").value = timeTo;
    document.getElementById("cellDescriptionEdit").value = description;
    //console.log(idEdit);
}

document.getElementById("cellEditButton").addEventListener("click", () => {
    editRecordbutton();
});

function editRecordbutton() {
    //console.log(idEdit);
    const cellName = document.getElementById("cellNameEdit").value;
    const cellDate = document.getElementById("cellDateEdit").value;
    const cellTimeFrom = document.getElementById("inputTimeFromEdit").value;
    const cellTimeTo = document.getElementById("inputTimeToEdit").value;
    const cellDescription = document.getElementById("cellDescriptionEdit").value;

    const object = {
        id: idEdit,
        name: cellName,
        date: cellDate,
        timeFrom: cellTimeFrom,
        timeTo: cellTimeTo,
        description: cellDescription
    };

    objectChange = ulubione.find(item => item.id === idEdit);

    objectChange.name = cellName;
    objectChange.date = cellDate;
    objectChange.timeFrom = cellTimeFrom;
    objectChange.timeTo = cellTimeTo;
    objectChange.description = cellDescription;

    localStorage.setItem("ulubione", JSON.stringify(ulubione));

    cellContainerEditEdit.style.display = "none";
}


