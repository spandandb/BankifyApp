'use strict';

// Data
const account1 = {
  owner: 'Spandan Das Barman',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Abhijeet Paul',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Karan Agrawal',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Ria Mukherjee',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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

// Functions

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements?.forEach((mov, i) => {
    const typeOfMovement = mov > 0 ? 'deposit' : 'withdrawal';
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="movements__row">
          <div class="movements__type movements__type--${typeOfMovement}">${
        i + 1
      } ${typeOfMovement}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">₹${Math.abs(mov)}</div>
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

  labelSumIn.textContent = '₹ ' + totalDeposit;
  labelSumOut.textContent = '₹ ' + Math.abs(totalWithradrawl);
  labelSumInterest.textContent = '₹ ' + totalInterest;
};

const displayAvailableBalance = function (account) {
  const totalAvailableBalance = account?.movements.reduce(
    (sum, mov) => sum + mov,
    0
  );
  labelBalance.textContent = '₹ ' + totalAvailableBalance;
};

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .split(' ')
      .map(namePart => namePart[0].toLowerCase())
      .join('');
  });
};

// Logic

createUsernames(accounts);

// Event listener
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
        return true;
      }
    }
  });

  currentAccount && displayMovements(currentAccount?.movements);
  currentAccount && displaySummary(currentAccount);
  currentAccount && displayAvailableBalance(currentAccount);
});
