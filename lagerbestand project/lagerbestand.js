const welcomeMsg = document.getElementById('welcomeMsg');
const itemcode = '';//document.getElementById('itemcode');
const txtareaItem = document.getElementById('txtAreaitemcode');
const bestaendeTable = document.getElementById('table');
const button = document.getElementById('button');
let tableclass  = '';
let errmsg = '';

let action = 'Lagerbestand';
let Lagerbestaende = [];
let headers = ['Lager', 'Nummer', 'Beschreibung'];
let connectData = {};
let apiUrl = '';
let price = 0;

async function getConnectionData(){
    const apiUrl = 'http://psg-ger-sap:8082/SAPb1/Connect';
    try {
        const response = await fetch(apiUrl);
        connectData = await response.json();
        welcomeMsg.textContent = `Welcome ${connectData.userName} on ${connectData.companyName}`;
    } catch (error) {
        alert(error);
    }
}
async function getLagerbestaende(){
    var itArea = txtareaItem.value;
    if(itArea.includes(',')){
        itArea = itArea.slice(0, -1);
        action = 'Lagerbestands';
    }
        
    // var it = itemcode.value;
    const apiUrlTest = `https://localhost:5001/SAPb1/${action}/${itArea}`;
    const apiUrl = `http://psg-ger-sap:8082/SAPb1/${action}/${itArea}`;
    try {
        if(itArea != ""){
            const response = await fetch(apiUrlTest);
            Lagerbestaende = await response.json();
            // console.log(Lagerbestaende);
            tableCreate(Lagerbestaende);
        }else {
            errmsg = 'Please make sure the itemcode really exists!';
            alert(errmsg);
        }
    } catch (error) {
        alert(error);
    }
}

async function getProduktionsauftrag(auftragNr){
    const apiUrl = `http://psg-ger-sap:8082/SAPb1/ProduktionAuftrag/${auftragNr}`;
    try {
        const response = await fetch(apiUrl);
        Lagerbestaende = await response.json();
        console.log(Lagerbestaende);
    } catch (error) {
        alert(error);
    }
}

async function getPrice(CardCode, ItemCode, Quantity){
    const apiUrl = `http://psg-ger-sap:8082/SAPb1/ProduktionAuftrag/${CardCode}/${ItemCode}/${Quantity}`;
    try {
        const response = await fetch(apiUrl);
        price = await response.json();
        console.log(Lagerbestaende);
    } catch (error) {
        alert(error);
    }
}

function addItemNr() {
    if(txtareaItem.value != "")
        txtareaItem.value += ',';
}

function tableCreate(bestandArray) {

    tableclass = document.getElementsByClassName('table-content');
    while (document.getElementsByClassName('table-content')[0]) {
        document.getElementsByClassName('table-content')[0].remove();
    }
    let table = document.createElement('table');

    table.classList.add('table-content');
    let headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    bestandArray.forEach(item => {
        item.forEach(best =>{
            let row = document.createElement('tr');
            Object.values(best).forEach(text => {
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        })
        table.appendChild(row);
        })
    })

    bestaendeTable.appendChild(table);
  }

//On Load
getConnectionData();

txtareaItem.addEventListener('input', addItemNr);
button.addEventListener('click', getLagerbestaende)