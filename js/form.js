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

  // fromDate.value = `${year}-${month}-${day}`;
  toDate.value = `${year}-${month}-${day}`;
  // fromDate.setAttribute('max', `${year}-${month}-${day}`);
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

  // getSelect(select);
  validateForm()
  getValues(curr)
  return curr;
};

function validateForm() {
  document.querySelectorAll('input').forEach(el => el.addEventListener('change', () => {
    if (fromDate.valueAsDate.getTime() > toDate.valueAsDate.getTime()) {
      if (!document.querySelector('.tooltip')) {
        const tip = document.createElement('div');
        tip.className = 'tooltip';
        tip.innerHTML = 'Error! The start date must be less than the end date.';
        form.append(tip); 
      };
    } else {
      !document.querySelector('.tooltip') || 
      document.querySelectorAll('.tooltip').forEach(el => el.remove());

      // getValues(fromDate, toDate);
      // getSelect(select)
    };
  }));

  // select.addEventListener('input', getValues)

};

// validateForm()