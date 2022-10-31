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
      if (fromDate.value != '' 
      && select.value === curr.name 
      && fromDate.valueAsDate.getFullYear() >= 1991) {
        curr.currs.forEach(el => {
          if (fromDate.valueAsDate.getTime() <= (new Date(el.dateE).getTime()) 
          && toDate.valueAsDate.getTime() >= (new Date(el.dateS).getTime())) {

            if (fromDate.valueAsDate.getTime() === toDate.valueAsDate.getTime()) {
              getOnDate(el.id, fromDate);
            }
            else if (fromDate.valueAsDate.getFullYear() === toDate.valueAsDate.getFullYear()) {
              getForYear(el.id, fromDate, toDate);
            }
            // else {
            //   getForPeriod(el, fromDate, toDate);
            // }
          }
          else {
            document.querySelector('#container').innerHTML = 'There is no exchange rate on the requested date.';
          }
        })
      }
    }))
  });
  validateForm();
};

function getOnDate(id, fromDate) {
  fetch(`${baseUrl}rates/${id}?ondate=${fromDate.value}`)
    .then(response => response.json())
    .then(prepareDataForChart)
};

function getForYear (id, fromDate, toDate) {
  fetch(`${baseUrl}rates/dynamics/${id}?startdate=${fromDate.value}&enddate=${toDate.value}`)
    .then(response => response.json())
    .then(prepareDataForChart)
};