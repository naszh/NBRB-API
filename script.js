const baseUrl = 'https://www.nbrb.by/api/exrates/';

fetch(`${baseUrl}currencies`)
  .then(response => response.json())
  .then(parseData)
  .then(addToSelect);

function parseData(resp) {
  const set = new Set();

  const obj = resp
  .map(({
    Cur_ID: id,
    Cur_ParentID: parent,
    Cur_Name: name,
    Cur_DateStart: dateS,
    Cur_DateEnd: dateE,
  }) => {
    return {
      id, parent, name, dateS, dateE,
    };
  })
  .reduce(
    (acc, el) => {
      if (!acc[el.parent] && !acc[el.name]) {
        const arr = [el];
        acc[el.parent] = arr;
        acc[el.name] = arr;
      } else if (acc[el.parent] && !acc[el.name]) {
        acc[el.name] = acc[el.parent];
        acc[el.parent].push(el);
      } else if (!acc[el.parent] && acc[el.name]) {
        acc[el.parent] = acc[el.name];
        acc[el.parent].push(el);
      } else {
        acc[el.parent].push(el);
      }
      return acc;
    }, {});

  Object.values(obj).forEach(el => set.add(el));

  return [...set].map(el => el.reduce(
    (acc, { name, id, dateS, dateE }) => {
      if (!acc.name) acc.name = name;
      if (!acc.currs) acc.currs = [];

      acc.currs.push({ id, dateS, dateE });
      return acc;
    }, {}));
};

// ====================================
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

  fromDate.value = `${year}-${month}-${day}`;
  toDate.value = `${year}-${month}-${day}`;
  fromDate.setAttribute('max', `${year}-${month}-${day}`);
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
    };
  }));
};

validateForm()

