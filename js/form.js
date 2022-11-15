const main = document.querySelector('main');
const select = document.querySelector('#curr');
const fromDate = document.querySelector('#fromDate');
const toDate = document.querySelector('#toDate');
const form = document.querySelector('form');

function getToday() {
  const today = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);
  return today;
}

window.addEventListener(
  'DOMContentLoaded',
  function () {
    const d = new Date();
    const day = d.getDate();
    if (day < 10) day = '0' + day;

    const month = d.getMonth() + 1;
    if (month < 10) month = '0' + month;

    const year = d.getFullYear();

    toDate.value = `${year}-${month}-${day}`;
    toDate.setAttribute('max', `${year}-${month}-${day}`);
  },
  false
);

function addToSelect(curr) {
  const arr = curr.map(el => el.name).sort();

  for (let name of arr) {
    const option = document.createElement('option');
    option.text = `${name}`;
    option.value = `${name}`;
    select.add(option);
  }
  getValues(curr);
  generateWidgetVal(curr);
}

(function validateForm() {
  document.querySelectorAll('input').forEach(el =>
    el.addEventListener('change', () => {
      if (new Date(fromDate.value).getTime() > new Date(toDate.value).getTime())
        document.querySelector('#chart').innerHTML =
          'The start date must be less than the end date.';

      if (toDate.value > getToday())
        document.querySelector('#chart').innerHTML =
          'There is no exchange rate on the requested date.';
    })
  );
})();
