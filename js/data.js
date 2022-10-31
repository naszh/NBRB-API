const baseUrl = 'https://www.nbrb.by/api/exrates/';

fetch(`${baseUrl}currencies`)
  .then(response => response.json())
  .then(parseData)
  .then(addToSelect)

const set = new Set();

function parseData(resp) {
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

function getValues(arrCurrs) {
  [...arrCurrs].forEach(curr => {
    document.querySelectorAll('.value').forEach(el => el.addEventListener('change', () => {
      if (fromDate.value != '' && select.value === curr.name) {
        if (fromDate.valueAsDate.getTime() === toDate.valueAsDate.getTime()) {
          getOnDate(curr.currs, fromDate);
        }
        else if (fromDate.valueAsDate.getFullYear() >= 1991 && fromDate.valueAsDate.getTime() != toDate.valueAsDate.getTime()) {
          getForYear(curr.currs, fromDate, toDate);
        };
      };
    }));
  });
};

function getOnDate(curr, fromDate) {
  [...curr].forEach(el => {
    if (fromDate.valueAsDate.getTime() <= (new Date(el.dateE).getTime()) && 
    fromDate.valueAsDate.getTime() >= (new Date(el.dateS).getTime())) {
      fetch(`${baseUrl}rates/${el.id}?ondate=${fromDate}`)
        .then(response => response.json())
        .then(prepareDataForChart)
    } 
    else {
      document.querySelector('#container').innerHTML = 'There is no exchange rate on the requested date.';
    };
  });
};

function getForYear (curr, fromDate, toDate) {
  curr.forEach(el => {
    if (fromDate.valueAsDate.getFullYear() === toDate.valueAsDate.getFullYear()
    && fromDate.valueAsDate.getTime() >= (new Date(el.dateS).getTime())
    && toDate.valueAsDate.getTime() <= (new Date(el.dateE).getTime())) {
      fetch(`${baseUrl}rates/dynamics/${el.id}?startdate=${fromDate.value}&enddate=${toDate.value}`)
        .then(response => response.json())
        .then(prepareDataForChart)
    } else {
      document.querySelector('#container').innerHTML = 'There is no exchange rate on the requested date.';
    };
  });
};