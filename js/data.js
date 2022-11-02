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
  arrCurrs.forEach(curr => {
    document.querySelectorAll('.value').forEach(el => el.addEventListener('change', () => {
      if (fromDate.value != '' 
      && select.value === curr.name 
      && fromDate.valueAsDate.getFullYear() >= 1991) {
        console.log(curr)
        curr.currs.map(el => {
          if (fromDate.valueAsDate.getTime() <= (new Date(el.dateE).getTime()) 
          && toDate.valueAsDate.getTime() >= (new Date(el.dateS).getTime())) {

            if (fromDate.valueAsDate.getTime() === toDate.valueAsDate.getTime()) {
              getOnDate(el.id, fromDate);
            }
            else if (fromDate.valueAsDate.getFullYear() === toDate.valueAsDate.getFullYear()) {
              getForYear(el.id, fromDate, toDate);
            } 
          }
        })

        if (fromDate.valueAsDate.getFullYear() != toDate.valueAsDate.getFullYear()) {
          getForPeriod(curr.currs, fromDate, toDate);
        }
      }
    }))
  });
};

function getOnDate(id, fromDate) {
  fetch(`${baseUrl}rates/${id}?ondate=${fromDate.value}`)
    .then(response => response.json())
    .then(prepareDataForChart)
};

function getForYear(id, fromDate, toDate) {
  fetch(`${baseUrl}rates/dynamics/${id}?startdate=${fromDate.value}&enddate=${toDate.value}`)
    .then(response => response.json())
    .then(prepareDataForChart)
};

function getForPeriod(curr, fromDate, toDate) {
  console.log(curr, fromDate.value, toDate.value);

  const links = [];


    let startYear = fromDate.valueAsDate.getFullYear();
    console.log(startYear);

    let nextYear = fromDate.valueAsDate.getFullYear() + 1;
    let endYear = toDate.valueAsDate.getFullYear();

    let dateWithoutYear = fromDate.value.slice(5,10);
    let enddateWithoutYear = toDate.value.slice(5,10);

  for (let i = 0; i < curr.length; i++) {
    console.log(curr[i])
    let endYearID = new Date(curr[i].dateE).getFullYear();

    while (nextYear < endYearID) {
      links.push(`${baseUrl}rates/dynamics/${curr[i].id}?startdate=${startYear}-${dateWithoutYear}&enddate=${nextYear}-${dateWithoutYear}`);

      if(nextYear >= endYear){
        if (dateWithoutYear<enddateWithoutYear) {
            startYear=nextYear;
        }

      links.push(`${baseUrl}rates/dynamics/${curr[i].id}?startdate=${startYear}-${dateWithoutYear}&enddate=${toDate.value}`);

      return links;
      }
      startYear=nextYear;
      nextYear++;
    } 
      console.log(links)
  }
  
  let requests = links.map(url => console.log(url));

  // Promise.allSettled(links)
  // .then((results) => results.forEach((result) => console.log(result.status)));
  // }
  // let requests = links.map(url => console.log(url));
  // console.log(requests)
  //     Promise.all(requests)
  //       .then(responses => responses.forEach(response => alert(`${response.url}: ${response.status}`)
  // ));
}