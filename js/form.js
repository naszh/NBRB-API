const main = document.querySelector('main');
const select = document.querySelector('#curr');
const fromDate = document.querySelector('#fromDate');
const toDate = document.querySelector('#toDate');
const form = document.querySelector('form');

window.addEventListener('DOMContentLoaded', function () {
  var d = new Date();
  var day = d.getDate(); 
  if (day < 10) day = '0' + day;

  var month = d.getMonth() + 1; 
  if (month < 10) month = '0' + month;

  var year = d.getFullYear();

  toDate.value = `${year}-${month}-${day}`;
  toDate.setAttribute('max', `${year}-${month}-${day}`);
}, false);

function addToSelect(curr) {
  const arr = [];
  for (let el of curr) {
    arr.push(el.name);
  };
  arr.sort();

  for (let name of arr) {
    const option = document.createElement('option');
    option.text = `${name}`;
    option.value = `${name}`;
    select.add(option);
  };

  validateForm();
  getValues(curr);
  return curr;
};

function validateForm() {
  document.querySelectorAll('input').forEach(el => el.addEventListener('change', () => {
    if (fromDate.valueAsDate.getTime() > toDate.valueAsDate.getTime()) {
      document.querySelector('#container').innerHTML = 'Error! The start date must be less than the end date.'
    };
  }));
};