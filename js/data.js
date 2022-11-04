const baseUrl = 'https://www.nbrb.by/api/exrates/';

fetch(`${baseUrl}currencies`)
  .then(response => response.json())
  .then(parseData)
  .then(addToSelect)
  .catch(error => console.log(error))

const set = new Set();

function parseData(resp) {
  const obj = resp
  .map(({
    Cur_ID: id,
    Cur_ParentID: parent,
    Cur_Name_Eng: name,
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
  arrCurrs.forEach(curr => {
    document.querySelectorAll('.value').forEach(el => el.addEventListener('change', () => {
      if (fromDate.value != '' && select.value === curr.name && toDate.value <= today
      && fromDate.valueAsDate.getFullYear() >= 1991) {
        if (new Date(fromDate.value).getTime() <= new Date(toDate.value).getTime()) {
          if (new Date(fromDate.value).getTime() === new Date(toDate.value).getTime()) {
            getOnDate(curr, fromDate);
          } else {
            let links = splitLinks(curr.currs, fromDate, toDate);
            getForPeriod(links);
          };
        };
      };
    }));
  });
};

function getOnDate(curr, fromDate) {
  curr.currs.map(el => {
    if (new Date(fromDate.value).getTime() <= new Date(el.dateE).getTime()
    && new Date(toDate.value) >= new Date(el.dateS).getTime()) {
      fetch(`${baseUrl}rates/${el.id}?ondate=${fromDate.value}`)
      .then(response => response.json())
      .then(prepareDataForChart);
    };
  });
};

function getForPeriod(links) {
  let requests;
  !links
    ? document.querySelector('#chart').innerHTML = 'There is no exchange rate on the requested date.'
    : requests = links.map(url => fetch(url));

  Promise.all(requests)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(res => prepareDataForChart(res.flat()));
};

function splitLinks(curr, fromDate, toDate) {
  const links = [];

  let startYear = fromDate.valueAsDate.getFullYear();
  let nextYear = fromDate.valueAsDate.getFullYear() + 1;
  let endYear = toDate.valueAsDate.getFullYear();

  let dateWithoutYear = fromDate.value.slice(5, 10);
  let enddateWithoutYear = toDate.value.slice(5, 10);

  for (let i = 0; i < curr.length; i++) {
    let endYearCurr = new Date(curr[i].dateE).getFullYear();

    while (nextYear < endYearCurr
    || nextYear === endYearCurr && new Date(`${nextYear}-${dateWithoutYear}`).getTime() < new Date(curr[i].dateE).getTime()) {

      if (nextYear > endYear 
      || nextYear === endYear && dateWithoutYear > enddateWithoutYear) {
        links.push(`${baseUrl}rates/dynamics/${curr[i].id}?startdate=${startYear}-${dateWithoutYear}&enddate=${toDate.value}`);
        return links;
      };
      links.push(`${baseUrl}rates/dynamics/${curr[i].id}?startdate=${startYear}-${dateWithoutYear}&enddate=${nextYear}-${dateWithoutYear}`);

      startYear = nextYear;
      nextYear++;
    };

    if (startYear === endYearCurr && dateWithoutYear < curr[i].dateE.slice(5, 10)
    || startYear < endYearCurr && new Date(`${nextYear}-${dateWithoutYear}`).getTime() > new Date(curr[i].dateE).getTime()) {
      links.push(`${baseUrl}rates/dynamics/${curr[i].id}?startdate=${startYear}-${dateWithoutYear}&enddate=${curr[i].dateE.slice(0, 10)}`);
      dateWithoutYear = curr[i + 1].dateS.slice(5, 10);
      startYear = curr[i + 1].dateS.slice(0, 4);
    };
  };
};