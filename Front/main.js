const headerAccount = document.getElementById("headerAccount");
const headerName = document.getElementById("headerName");

window.addEventListener('load', (event) => {
    startup();
});

function startup(){
    showScreen("screenStart");

    document.getElementById("btnStartEnter").addEventListener("click", enterAccount, false);
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
    document.getElementById(screenName).className = document.getElementById(screenName).className.replace("d-none", "d-flex");
}

function showHome() {
    showScreen("screenHome");
}

function enterAccount() {
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