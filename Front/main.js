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
const inputTransferAccount = document.getElementById('inputTransferAccount');
const inputTransferValue = document.getElementById('inputTransferValue');
const transferConfirmationName = document.getElementById('transferConfirmationName');
const transferConfirmationValue = document.getElementById('transferConfirmationValue');
const statementPeriod = document.getElementById('statementPeriod');

const statementList = document.getElementById('statementList');

const alertModal = new bootstrap.Modal(document.getElementById('alertModal'),)
let currentAccountNumber, currentAccountPassword;
let currentPeriod = new Date();

const statementListItens = {
    statementListItemDeposit: document.getElementById('statementListItemDeposit').cloneNode(true),
    statementListItemWithdrawal: document.getElementById('statementListItemWithdrawal').cloneNode(true),
    statementListItemCredit: document.getElementById('statementListItemCredit').cloneNode(true),
    statementListItemDebit: document.getElementById('statementListItemDebit').cloneNode(true)
}
statementListItens.textContent = '';

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

    document.getElementById('btnHomeTransfer').addEventListener('click', choiceTransfer, false);
    document.getElementById('inputTransferAccount').addEventListener('keyup', transferConfirmation, false);
    document.getElementById('inputTransferValue').addEventListener('keyup', transferConfirmation, false);
    document.getElementById('btnTransferConfirmation').addEventListener('click', transferConfirmation, false);
    document.getElementById('btnTransferConfirm').addEventListener('click', transferConfirm, false);
    document.getElementById('btnTransferConfirmBack').addEventListener('click', transferConfirmBack, false);

    document.getElementById('btnStatementLeft').addEventListener('click', statementPeriodChangeLeft, false);
    document.getElementById('btnStatementRight').addEventListener('click', statementPeriodChangeRight, false);

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

    inputTransferValue.addEventListener('keyup', function (evt) {
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

    for (e of document.getElementsByClassName('btnBack')) {
        if (e.id !== 'btnTransferConfirmBack') {
            e.addEventListener('click', showHome, false);
        }
    }

    headerAccount.innerHTML = '---';
    headerName.innerHTML = '---';
}

// call api gateway
const callAPI = (requestParameters) => {
    return new Promise((resolve) => {
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

async function choiceStatement() {
    hideScreens();
    statementList.textContent = '';
    showScreen('screenStatement');
    let requestModel = Operations.Statement;
    requestModel.Account = currentAccountNumber;
    requestModel.Password = currentAccountPassword;
    currentPeriod = new Date();
    requestModel.Period = `${currentPeriod.getFullYear()}-${(currentPeriod.getMonth() + 1).toString().padStart(2, '0')}`;
    let statementResponse = await callAPI(requestModel);
    if (statementResponse && statementResponse.Success) {
        statementList.scrollTo(0, 0);
        statementList.textContent = '';
        for (const item of statementResponse.Statement) {
            if (item.Type == 'Debit') {
                newListItem = statementListItens.statementListItemDebit.cloneNode(true);
                newListItem.querySelector('p.statementAccount').innerHTML = item.Destiny;
                newListItem.querySelector('p.statementName').innerHTML = item.Name;
            } else if (item.Type == 'Credit') {
                newListItem = statementListItens.statementListItemCredit.cloneNode(true);
                newListItem.querySelector('p.statementAccount').innerHTML = item.Origin;
                newListItem.querySelector('p.statementName').innerHTML = item.Name;
            } else if (item.Type == 'Withdrawal') {
                newListItem = statementListItens.statementListItemWithdrawal.cloneNode(true);
            } else {
                newListItem = statementListItens.statementListItemDeposit.cloneNode(true);
            }
            newListItem.querySelector('p.statementValue').innerHTML = item.Value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            let newDate = new Date(item.Date);
            newListItem.querySelector('p.statementDate').innerHTML = newDate.toLocaleString('pt-BR');
            newListItem.className = newListItem.className.replace(/d-none/, 'd-flex');
            statementList.appendChild(newListItem);
        }
    }
    statementPeriod.innerHTML = requestModel.Period.substring(5, 7) + '/' + requestModel.Period.substring(0, 4);
}

async function statementPeriodChangeLeft() {
    await statementPeriodChange(false);
}

async function statementPeriodChangeRight() {
    await statementPeriodChange(true);
}

async function statementPeriodChange(next) {
    let targetPeriod = new Date();
    targetPeriod.setFullYear(currentPeriod.getFullYear());
    targetPeriod.setMonth(currentPeriod.getMonth());
    if (next) { // next period, right button
        let today = new Date();
        if (targetPeriod.getFullYear() < today.getFullYear()) {
            if (targetPeriod.getMonth() < 11) {
                targetPeriod.setMonth(targetPeriod.getMonth() + 1);
            } else {
                targetPeriod.setFullYear(targetPeriod.getFullYear() + 1);
                targetPeriod.setMonth(0);
            }
        } else if (targetPeriod.getMonth() < today.getMonth()) {
            targetPeriod.setMonth(targetPeriod.getMonth() + 1);
        } else {
            alertModalText.innerHTML = 'Última página.';
            alertModal.show();
            document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                inputDepositValue.value = '';
                inputDepositValue.focus();
                this.removeEventListener('hidden.bs.modal', handler);
            });
        }
    } else { // last period, left button
        if (targetPeriod.getMonth() > 0) {
            targetPeriod.setMonth(targetPeriod.getMonth() - 1);
        } else {
            targetPeriod.setFullYear(targetPeriod.getFullYear() - 1);
            targetPeriod.setMonth(11);
        }
    }

    let requestModel = Operations.Statement;
    requestModel.Account = currentAccountNumber;
    requestModel.Password = currentAccountPassword;
    requestModel.Period = `${targetPeriod.getFullYear()}-${(targetPeriod.getMonth() + 1).toString().padStart(2, '0')}`;
    let statementResponse = await callAPI(requestModel);
    if (statementResponse && statementResponse.Success) {
        statementList.textContent = '';
        for (const item of statementResponse.Statement) {
            if (item.Type == 'Debit') {
                newListItem = statementListItens.statementListItemDebit.cloneNode(true);
                newListItem.querySelector('p.statementAccount').innerHTML = item.Destiny;
                newListItem.querySelector('p.statementName').innerHTML = item.Name;
            } else if (item.Type == 'Credit') {
                newListItem = statementListItens.statementListItemCredit.cloneNode(true);
                newListItem.querySelector('p.statementAccount').innerHTML = item.Origin;
                newListItem.querySelector('p.statementName').innerHTML = item.Name;
            } else if (item.Type == 'Withdrawal') {
                newListItem = statementListItens.statementListItemWithdrawal.cloneNode(true);
            } else {
                newListItem = statementListItens.statementListItemDeposit.cloneNode(true);
            }
            newListItem.querySelector('p.statementValue').innerHTML = item.Value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            let newDate = new Date(item.Date);
            newListItem.querySelector('p.statementDate').innerHTML = newDate.toLocaleString('pt-BR');
            newListItem.className = newListItem.className.replace(/d-none/, 'd-flex');
            statementList.appendChild(newListItem);
        }
        statementPeriod.innerHTML = requestModel.Period.substring(5, 7) + '/' + requestModel.Period.substring(0, 4);
        currentPeriod = targetPeriod;
    } else {
        alertModalText.innerHTML = 'Última página.';
        alertModal.show();
        document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
            inputDepositValue.value = '';
            inputDepositValue.focus();
            this.removeEventListener('hidden.bs.modal', handler);
        });
    }
}

function choiceTransfer() {
    hideScreens();
    inputTransferAccount.value = '';
    inputTransferValue.value = '';
    document.getElementById('screenTransferFill').className = document.getElementById('screenTransferFill').className.replace('d-none', 'd-flex');
    document.getElementById('screenTransferConfirmation').className = document.getElementById('screenTransferConfirmation').className.replace('d-flex', 'd-none');
    showScreen('screenTransfer');
    inputTransferAccount.focus();
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
        alertModalText.innerHTML = 'Somente valores inteiros maiores que 0.';
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
            if (requestModel.Value <= 0) {
                inputDepositValue.value = '';
                inputDepositValue.focus();
                return
            }
            let depositResponse = await callAPI(requestModel);
            if (depositResponse && depositResponse.Success) {
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
        alertModalText.innerHTML = 'Somente valores inteiros maiores que 0.';
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
            if (requestModel.Value <= 0) {
                inputWithdrawalValue.value = '';
                inputWithdrawalValue.focus();
                return
            }
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

async function transferConfirmation(e) {
    if (e && (e.key == '.' || e.key == ',' || e.keyCode == 188 || e.keyCode == 190)) {
        if (e.target.id == inputTransferAccount.id) {
            alertModalText.innerHTML = 'Somente valores inteiros maiores que 0.';
            alertModal.show();
            document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                inputTransferAccount.value = '';
                inputTransferAccount.focus();
                this.removeEventListener('hidden.bs.modal', handler);
            });
        } else {
            alertModalText.innerHTML = 'Somente valores inteiros.';
            alertModal.show();
            document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                inputTransferValue.value = '';
                inputTransferValue.focus();
                this.removeEventListener('hidden.bs.modal', handler);
            });
        }
        return;
    }
    if (e && e.key && (e.key !== 'Enter' && e.keyCode !== 13)) {
        return;
    } else {
        if (!inputTransferAccount.value) {
            inputTransferAccount.focus();
        } else if (!inputTransferValue.value) {
            inputTransferValue.focus();
        }
        else {
            let requestModel = Operations.Check;
            requestModel.Account = inputTransferAccount.value;
            let transferValue = parseInt(inputTransferValue.value.replaceAll('.', '').replaceAll(',00', ''));
            if (transferValue <= 0) {
                inputTransferValue.value = '';
                inputTransferValue.focus();
                return;
            }
            let checkResponse = await callAPI(requestModel);
            if (checkResponse && checkResponse.Success && (checkResponse.Account.Account != currentAccountNumber)) {
                transferConfirmationName.innerHTML = checkResponse.Account.Name;
                transferConfirmationValue.innerHTML = inputTransferValue.value;
                document.getElementById('screenTransferFill').className = document.getElementById('screenTransferFill').className.replace('d-flex', 'd-none');
                document.getElementById('screenTransferConfirmation').className = document.getElementById('screenTransferConfirmation').className.replace('d-none', 'd-flex');
            } else {
                alertModalText.innerHTML = 'Verifique a conta informada.';
                alertModal.show();
                document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
                    inputTransferAccount.value = '';
                    inputTransferValue.value = '';
                    inputTransferAccount.focus();
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            }
        }
    }
}

async function transferConfirm(e) {
    let requestModel = Operations.Transfer;
    requestModel.Account = currentAccountNumber;
    requestModel.Password = currentAccountPassword;
    requestModel.Destiny = inputTransferAccount.value;
    requestModel.Value = parseInt(inputTransferValue.value.replaceAll('.', '').replaceAll(',00', ''));
    let transferResponse = await callAPI(requestModel);
    if (transferResponse && transferResponse.Success) {
        inputTransferAccount.value = '';
        inputTransferValue.value = '';
        alertModalText.innerHTML = 'Transferência realizada.';
        alertModal.show();
        document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
            inputTransferAccount.value = '';
            inputTransferValue.value = '';
            inputTransferAccount.focus();
            document.getElementById('screenTransferFill').className = document.getElementById('screenTransferFill').className.replace('d-none', 'd-flex');
            document.getElementById('screenTransferConfirmation').className = document.getElementById('screenTransferConfirmation').className.replace('d-flex', 'd-none');
            this.removeEventListener('hidden.bs.modal', handler);
        });
    } else {
        alertModalText.innerHTML = 'Saldo insuficiente.';
        alertModal.show();
        document.getElementById('alertModal').addEventListener('hidden.bs.modal', function handler() {
            inputTransferAccount.value = '';
            inputTransferValue.value = '';
            inputTransferAccount.focus();
            this.removeEventListener('hidden.bs.modal', handler);
        });
    }
}

async function transferConfirmBack(e) {
    transferConfirmationName.innerHTML = '';
    transferConfirmationValue.innerHTML = '';
    inputTransferAccount.value = '';
    inputTransferValue.value = '';
    document.getElementById('screenTransferFill').className = document.getElementById('screenTransferFill').className.replace('d-none', 'd-flex');
    document.getElementById('screenTransferConfirmation').className = document.getElementById('screenTransferConfirmation').className.replace('d-flex', 'd-none');
    showScreen('screenTransfer');
    inputTransferAccount.focus();
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