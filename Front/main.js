const headerAccount = document.getElementById("headerAccount");
const headerName = document.getElementById("headerName");
// const apigClient = apigClientFactory.newClient();

// aws api gateway invoke url:
// https://0qra6oqo64.execute-api.sa-east-1.amazonaws.com/dev

window.addEventListener('load', (event) => {
    startup();
});

function startup() {
    showScreen("screenStart");

    document.getElementById("btnStartLogin").addEventListener("click", enterAccount, false);
    document.getElementById("btnHomeBalance").addEventListener("click", choiceBalance, false);
    document.getElementById("btnHomeStatement").addEventListener("click", choiceStatement, false);
    document.getElementById("btnHomeTransfer").addEventListener("click", choiceTransfer, false);
    document.getElementById("btnHomeWithdrawal").addEventListener("click", choiceWithdrawal, false);
    document.getElementById("btnHomeDeposit").addEventListener("click", choiceDeposit, false);
    document.getElementById("btnHomeEnd").addEventListener("click", exitAccount, false);

    for (e of document.getElementsByClassName("btnBack")) {
        // e.addEventListener("click", showScreen("screenHome"), false);
        e.addEventListener("click", showHome, false);
    }

    headerAccount.innerHTML = "---";
    headerName.innerHTML = "---";
}


// define the callAPI function that takes a first name and last name as parameters
var callAPI = (Account, Password) => {
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    // myHeaders.append("Content-Type", "application/json");
    myHeaders.set("Content-Type", "application/json")
    // myHeaders.append("Access-Control-Allow-Origin", "*");
    // myHeaders.append("Request-Mode", "no-cors");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify(
        {
            "Operation": "Login",
            "Account": Account,
            "Password": Password
        }
    );
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://0qra6oqo64.execute-api.sa-east-1.amazonaws.com/dev", requestOptions)
        .then(response => response.text())
        .then(result => alert(JSON.parse(result).body))
        .catch(error => console.log('error', error));
}

function hideScreens() {
    document.getElementById("screenStart").className = document.getElementById("screenHome").className.replace("d-flex", "d-none");
    document.getElementById("screenHome").className = document.getElementById("screenHome").className.replace("d-flex", "d-none");
    document.getElementById("screenBalance").className = document.getElementById("screenBalance").className.replace("d-flex", "d-none");
    document.getElementById("screenStatement").className = document.getElementById("screenStatement").className.replace("d-flex", "d-none");
    document.getElementById("screenTransfer").className = document.getElementById("screenTransfer").className.replace("d-flex", "d-none");
    document.getElementById("screenWithdrawal").className = document.getElementById("screenWithdrawal").className.replace("d-flex", "d-none");
    document.getElementById("screenDeposit").className = document.getElementById("screenDeposit").className.replace("d-flex", "d-none");
}

function showScreen(screenName) {
    hideScreens();
    document.getElementById('screenStart').className = document.getElementById(screenName).className.replace("d-flex", "d-none");
    document.getElementById(screenName).className = document.getElementById(screenName).className.replace("d-none", "d-flex");
}

function showHome() {
    showScreen("screenHome");
}

function enterAccount() {
    callAPI(1001, 'abc123');
    showHome();
    headerAccount.innerHTML = "1234567890";
    headerName.innerHTML = "Fulano";
}

function exitAccount() {
    showScreen("screenStart");
    headerAccount.innerHTML = "---";
    headerName.innerHTML = "---";
}

function choiceBalance() {
    hideScreens();
    showScreen("screenBalance");
}

function choiceStatement() {
    hideScreens();
    showScreen("screenStatement");
}

function choiceTransfer() {
    hideScreens();
    showScreen("screenTransfer");
}

function choiceWithdrawal() {
    hideScreens();
    showScreen("screenWithdrawal");
}

function choiceDeposit() {
    hideScreens();
    showScreen("screenDeposit");
}