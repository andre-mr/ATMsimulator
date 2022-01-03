/* 
Notice: web app (back and front) under development
 */

const headerAccount = document.getElementById('headerAccount');
const headerName = document.getElementById('headerName');
const inputLoginAccount = document.getElementById('inputLoginAccount');
const inputLoginPassword = document.getElementById('inputLoginPassword');
const alertModalText = document.getElementById('alertModalText');
const balanceDate = document.getElementById('balanceDate');
const balanceValue = document.getElementById('balanceValue');
const inputDepositValue = document.getElementById('inputDepositValue');
const inputWithdrawalValue = document.getElementById('inputWithdrawalValue');
const alertModal = new bootstrap.Modal(document.getElementById('alertModal'),)
let currentAccountNumber, currentAccountPassword;

window.addEventListener('load', () => {
    startup();
});

function startup() {
    showScreen('screenStart');

    document.getElementById('btnStartLogin').addEventListener('click', enterAccount, false);
    document.getElementById('inputLoginAccount').addEventListener('keyup', enterAccount, false);
    document.getElementById('inputLoginPassword').addEventListener('keyup', enterAccount, false);

    document.getElementById('btnHomeBalance').addEventListener('click', choiceBalance, false);
    document.getElementById('btnHomeStatement').addEventListener('click', choiceStatement, false);
    document.getElementById('btnHomeTransfer').addEventListener('click', choiceTransfer, false);

    document.getElementById('btnHomeWithdrawal').addEventListener('click', choiceWithdrawal, false);
    document.getElementById('inputWithdrawalValue').addEventListener('keyup', withdrawalConfirm, false);
    document.getElementById('btnWithdrawalConfirm').addEventListener('click', withdrawalConfirm, false);

    document.getElementById('btnHomeDeposit').addEventListener('click', choiceDeposit, false);
    document.getElementById('inputDepositValue').addEventListener('keyup', depositConfirm, false);
    document.getElementById('btnDepositConfirm').addEventListener('click', depositConfirm, false);

    document.getElementById('btnHomeEnd').addEventListener('click', exitAccount, false);

    document.getElementById('alertModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('alertModalButton').focus();
    });

    inputDepositValue.addEventListener('keyup', function (evt) {
        if (evt.key == 'Enter') {
            return;
        }
        if (evt.key == 'Backspace') {
            if (this.value.length > 0) {
                this.value = this.value.substring(0, this.value.indexOf(',') - 1);
            }
        } else if (this.value.length > 1) {
            let lastChar = this.value.charAt(this.value.length - 1);
            this.value = this.value.substring(0, this.value.length - 1);
            let integerPart = this.value.substring(0, this.value.indexOf(','));
            // let decimalPart = this.value.substring(this.value.indexOf(',') + 1, this.value.length);
            this.value = integerPart + lastChar;
        }
        if (this.value.length > 0) {
            let n = parseInt(this.value.replace(/\D/g, ''), 10);
            this.value = n.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    }, false);

    inputWithdrawalValue.addEventListener('keyup', function (evt) {
        if (evt.key == 'Enter') {
            return;
        }
        if (evt.key == 'Backspace') {
            if (this.value.length > 0) {
                this.value = this.value.substring(0, this.value.indexOf(',') - 1);
            }
        } else if (this.value.length > 1) {
            let lastChar = this.value.charAt(this.value.length - 1);
            this.value = this.value.substring(0, this.value.length - 1);
            let integerPart = this.value.substring(0, this.value.indexOf(','));
            // let decimalPart = this.value.substring(this.value.indexOf(',') + 1, this.value.length);
            this.value = integerPart + lastChar;
        }
        else {
            //
        }
        if (this.value.length > 0) {
            let n = parseInt(this.value.replace(/\D/g, ''), 10);
            this.value = n.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    }, false);

    for (e of document.getElementsByClassName('btnBack')) {
        e.addEventListener('click', showHome, false);
    }

    headerAccount.innerHTML = '---';
    headerName.innerHTML = '---';
}

// call api gateway
const callAPI = (requestParameters) => {
    return new Promise((resolve, reject) => {
        let defaultHeader = new Headers();
        defaultHeader.append('Content-Type', 'application/json');
        let requestJSON = JSON.stringify(requestParameters);
        let requestOptions = {
            method: 'POST',
            headers: defaultHeader,
            body: requestJSON,
            redirect: 'follow'
        };
        fetch('https://0qra6oqo64.execute-api.sa-east-1.amazonaws.com/dev', requestOptions)
            .then((response) => {
                resolve(response.json())
            })
            .catch((error) => {
                resolve(error)
            })
    })
}

function hideScreens() {
    document.getElementById('screenStart').className = document.getElementById('screenHome').className.replace('d-flex', 'd-none');
    document.getElementById('screenHome').className = document.getElementById('screenHome').className.replace('d-flex', 'd-none');
    document.getElementById('screenBalance').className = document.getElementById('screenBalance').className.replace('d-flex', 'd-none');
    document.getElementById('screenStatement').className = document.getElementById('screenStatement').className.replace('d-flex', 'd-none');
    document.getElementById('screenTransfer').className = document.getElementById('screenTransfer').className.replace('d-flex', 'd-none');
    document.getElementById('screenWithdrawal').className = document.getElementById('screenWithdrawal').className.replace('d-flex', 'd-none');
    document.getElementById('screenDeposit').className = document.getElementById('screenDeposit').className.replace('d-flex', 'd-none');
}

function showScreen(screenName) {
    hideScreens();
    document.getElementById('screenStart').className = document.getElementById(screenName).className.replace('d-flex', 'd-none');
    document.getElementById(screenName).className = document.getElementById(screenName).className.replace('d-none', 'd-flex');
}

function showHome() {
    showScreen('screenHome');
}

async function enterAccount(e) {
    if (e && e.key && (e.key !== 'Enter' && e.keyCode !== 13)) {
        return;
    } else {
        if (!inputLoginAccount.value) {
            inputLoginAccount.focus();
        } else if (!inputLoginPassword.value) {
            inputLoginPassword.focus();
        } else {
            let requestModel = Operations.Login;
            requestModel.Account = inputLoginAccount.value ? inputLoginAccount.value.toString() : '0000';
            requestModel.Password = inputLoginPassword.value ? inputLoginPassword.value.toString() : '0000';
            // requestModel.Account = '1001'; // testing
            // requestModel.Password = 'fulano'; // testing
            let loginResponse = await callAPI(requestModel);
            if (loginResponse && loginResponse.Account) {
                currentAccountNumber = requestModel.Account;
                currentAccountPassword = requestModel.Password; // change for security after development
                headerAccount.innerHTML = loginResponse.Account.Account;
                headerName.innerHTML = loginResponse.Account.Name;
                inputLoginAccount.value = '';
                inputLoginPassword.value = '';
                showHome();
            } else {
                alertModalText.innerHTML = 'Verifique conta e senha.';
                alertModal.show();
                document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                    inputLoginAccount.value = ''
                    inputLoginPassword.value = ''
                    inputLoginAccount.focus();
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            }
        }
    }
}

function exitAccount() {
    showScreen('screenStart');
    currentAccountNumber = undefined;
    headerAccount.innerHTML = '---';
    headerName.innerHTML = '---';
    inputLoginAccount.focus();
}

async function choiceBalance() {
    hideScreens();
    let requestModel = Operations.Balance;
    requestModel.Account = currentAccountNumber;
    requestModel.Password = currentAccountPassword;
    let loginResponse = await callAPI(requestModel);
    if (loginResponse && loginResponse.Account) {
        balanceDate.innerHTML = new Date().toLocaleDateString();
        balanceValue.innerHTML = loginResponse.Account.Balance.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    } else {
        alertModalText.innerHTML = 'Falha na operação.';
        alertModal.show();
    }
    showScreen('screenBalance');
}

function choiceStatement() {
    hideScreens();
    showScreen('screenStatement');
}

function choiceTransfer() {
    hideScreens();
    showScreen('screenTransfer');
}

function choiceWithdrawal() {
    hideScreens();
    inputWithdrawalValue.value = '';
    showScreen('screenWithdrawal');
    inputWithdrawalValue.focus();
}

function choiceDeposit() {
    hideScreens();
    inputDepositValue.value = '';
    showScreen('screenDeposit');
    inputDepositValue.focus();
}

async function depositConfirm(e) {
    if (e && (e.key == '.' || e.key == ',' || e.keyCode == 188 || e.keyCode == 190)) {
        inputDepositValue.value = '';
        alertModalText.innerHTML = 'Somente valores inteiros.';
        alertModal.show();
        return;
    }
    if (e && e.key && (e.key !== 'Enter' && e.keyCode !== 13)) {
        return;
    } else {
        if (!inputDepositValue.value) {
            inputDepositValue.focus();
        } else {
            let requestModel = Operations.Deposit;
            requestModel.Account = currentAccountNumber;
            requestModel.Value = parseInt(inputDepositValue.value.replaceAll('.', '').replaceAll(',00', ''));
            let depositResponse = await callAPI(requestModel);
            if (depositResponse) {
                inputDepositValue.value = '';
                alertModalText.innerHTML = 'Depósito realizado.';
                alertModal.show();
                document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                    inputDepositValue.value = '';
                    inputDepositValue.focus();
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            } else {
                alertModalText.innerHTML = 'Verifique a conta informada.';
                alertModal.show();
                document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                    inputDepositValue.value = '';
                    inputDepositValue.focus();
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            }
        }
    }
}

async function withdrawalConfirm(e) {
    if (e && (e.key == '.' || e.key == ',' || e.keyCode == 188 || e.keyCode == 190)) {
        inputDepositValue.value = '';
        alertModalText.innerHTML = 'Somente valores inteiros.';
        alertModal.show();
        return;
    }
    if (e && e.key && (e.key !== 'Enter' && e.keyCode !== 13)) {
        return;
    } else {
        if (!inputWithdrawalValue.value) {
            inputWithdrawalValue.focus();
        } else {
            let requestModel = Operations.Withdrawal;
            requestModel.Account = currentAccountNumber;
            requestModel.Password = currentAccountPassword;
            requestModel.Value = parseInt(inputWithdrawalValue.value.replaceAll('.', '').replaceAll(',00', ''));
            let withdrawalResponse = await callAPI(requestModel);
            if (withdrawalResponse && withdrawalResponse.Success) {
                inputWithdrawalValue.value = '';
                alertModalText.innerHTML = 'Saque realizado.';
                alertModal.show();
                document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                    inputWithdrawalValue.value = '';
                    inputWithdrawalValue.focus();
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            } else {
                alertModalText.innerHTML = 'Saldo insuficiente.';
                alertModal.show();
                document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                    inputWithdrawalValue.value = '';
                    inputWithdrawalValue.focus();
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            }
        }
    }
}

// api request models accepted
const Operations = {
    "Login": {
        "Operation": "Login",
        "Account": "1001",
        "Password": "1001"
    },
    "Check": {
        "Operation": "Check",
        "Account": "1001"
    },
    "Balance": {
        "Operation": "Balance",
        "Account": "1001",
        "Password": "1001"
    },
    "Deposit": {
        "Operation": "Deposit",
        "Account": "1001",
        "Value": 0
    },
    "Withdrawal": {
        "Operation": "Withdrawal",
        "Account": "1001",
        "Password": "1001",
        "Value": 0
    },
    "Transfer": {
        "Operation": "Transfer",
        "Account": "1001",
        "Password": "1001",
        "Destiny": "1002",
        "Value": 0
    },
    "Statement": {
        "Operation": "Statement",
        "Account": "1001",
        "Password": "1001",
        "Period": "2021-01"
    }
}