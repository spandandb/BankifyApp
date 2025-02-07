'use strict';

// ? Data

const account1 = {
  owner: 'Spandan Das Barman',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2024-11-18T21:31:17.178Z',
    '2025-01-28T09:15:04.904Z',
    '2025-02-04T10:17:24.185Z',
    '2025-02-01T07:42:02.383Z',
    '2025-02-06T14:11:59.604Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Abhijeet Paul',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account3 = {
  owner: 'Karan Agrawal',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2025-02-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account4 = {
  owner: 'Ria Mukherjee',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3, account4];

// ? Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// ? Functions

const dateFormatter = function (date) {
  const dateDiff = Math.trunc((new Date() - date) / (1000 * 60 * 60 * 24));

  if (dateDiff === 0) return 'Today';
  if (dateDiff === 1) return 'Yesterday';
  if (dateDiff <= 7) return `${dateDiff} days ago`;

  return `${date.getDate().toString().padStart(2, '0')}/${String(
    date.getMonth() + 1
  ).padStart(2, '0')}/${date.getFullYear()}`;
};

const displayMovements = function (account, sort = false) {
  const combineMovDates = account.movements.map((mov, i) => ({
    movement: mov,
    date: account.movementsDates[i],
  }));

  containerMovements.innerHTML = '';

  const movs = sort
    ? combineMovDates.sort((a, b) => a.movement - b.movement)
    : combineMovDates;

  movs?.forEach((mov, i) => {
    const typeOfMovement = mov.movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(mov.date);
    const movDate = dateFormatter(date);

    containerMovements.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="movements__row">
          <div class="movements__type movements__type--${typeOfMovement}">${
        i + 1
      } ${typeOfMovement}</div>
          <div class="movements__date">${movDate}</div>
          <div class="movements__value">₹${Math.abs(mov.movement).toFixed(
            2
          )}</div>
      </div>
      `
    );
  });
};

const displaySummary = function (account) {
  const totalDeposit = account?.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);

  const totalWithradrawl = account.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);

  const totalInterest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((sum, mov) => sum + mov, 0);

  labelSumIn.textContent = '₹ ' + totalDeposit.toFixed(2);
  labelSumOut.textContent = '₹ ' + Math.abs(totalWithradrawl).toFixed(2);
  labelSumInterest.textContent = '₹ ' + totalInterest.toFixed(2);
};

const displayAvailableBalance = function (account) {
  const totalAvailableBalance = account?.movements.reduce(
    (sum, mov) => sum + mov,
    0
  );
  labelBalance.textContent = '₹ ' + totalAvailableBalance.toFixed(2);
  account.balance = totalAvailableBalance;
};

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .split(' ')
      .map(namePart => namePart[0].toLowerCase())
      .join('');
  });
};

const refreshUI = function (account) {
  displayMovements(account);
  displaySummary(account);
  displayAvailableBalance(account);
};

// ? Logic

containerApp.style.opacity = 0;

createUsernames(accounts);
accounts.forEach(account => {
  const totalBalance = account.movements.reduce((sum, mov) => sum + mov, 0);
  account.balance = totalBalance;
});

// ? Event listener

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  accounts.find(account => {
    if (account.username === inputLoginUsername.value) {
      if (account.pin === Number(inputLoginPin.value)) {
        currentAccount = account;
        containerApp.style.opacity = 1;
        inputLoginPin.value = inputLoginUsername.value = '';
        inputLoginPin.blur();
        labelWelcome.textContent = `Welcome back, ${
          currentAccount.owner.split(' ')[0]
        }!`;
        const date = new Date();
        labelDate.textContent = `${date
          .getDate()
          .toString()
          .padStart(2, '0')}/${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}/${date.getFullYear()}`;
        return true;
      }
    }
  });

  currentAccount && refreshUI(currentAccount);
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const transferToAccount = accounts.find(
    account => inputTransferTo.value === account.username
  );

  if (
    transferToAccount &&
    transferToAccount.username !== currentAccount.username &&
    Number(inputTransferAmount.value) > 0 &&
    Number(inputTransferAmount.value) <= currentAccount.balance
  ) {
    const date = new Date();
    currentAccount.movements.push(Number(inputTransferAmount.value) * -1);
    currentAccount.movementsDates.push(date.toISOString());
    transferToAccount.movements.push(Number(inputTransferAmount.value));
    transferToAccount.movementsDates.push(date.toISOString());
    transferToAccount && refreshUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const deleteIndex = accounts.findIndex(
      account => account.username === inputCloseUsername.value
    );
    accounts.splice(deleteIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    currentAccount.movements.some(
      mov => Number(inputLoanAmount.value) * 0.1 < mov
    )
  ) {
    currentAccount.movements.push(Number(inputLoanAmount.value));
    currentAccount.movementsDates.push(new Date().toISOString());
    refreshUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});

//  FAKE LOGIN IMPLEMENTATION

// currentAccount = accounts[0];
// refreshUI(accounts[0]);
// containerApp.style.opacity = 1;
