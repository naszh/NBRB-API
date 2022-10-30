const baseUrl = 'https://www.nbrb.by/api/exrates/';


  fetch(`${baseUrl}currencies`)
  .then(response => response.json())
  .then(parseData)


  .then(addToSelect)
  // .then(validateForm)
  // .then(getValues)
  // .then(data => console.log(data))
  // .then(getRates);

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

// ====================================
// fetch(`${baseUrl}rates/${id}?ondate=${date}`)
// fetch(`${baseUrl}rates/dynamics/${id}?startdate=${start}&enddate=${end}`)

// console.log(acc)
function getValues(arrCurrs) {
  [...arrCurrs].forEach(curr => {
    // console.log(curr);
    // console.log(select.value);

    // select.addEventListener('input', () => {
    //   if (select.value === curr.name) {
        // console.log(curr)
        // console.log(fromDate)
        // console.log(toDate)
        document.querySelectorAll('.value').forEach(el => el.addEventListener('change', () => {
        if (fromDate.value != '' && select.value === curr.name) {
          if (fromDate.valueAsDate.getTime() === toDate.valueAsDate.getTime()) {
            getOnDate(curr.currs, fromDate)

          } else if (fromDate.valueAsDate.getFullYear() >= 1991 && fromDate.valueAsDate.getTime() != toDate.valueAsDate.getTime()) {
            splitDate(curr.currs, fromDate, toDate)
          }
          // console.log(curr)
        }
      }))
      })
    }

//   })
// }

function getOnDate(curr, fromDate) {
  // console.log(curr)
  // console.log(...curr, fromDate);
  [...curr].forEach(el => {
    if (fromDate.valueAsDate.getTime() <= (new Date(el.dateE).getTime()) && 
      fromDate.valueAsDate.getTime() >= (new Date(el.dateS).getTime())) {
        console.log(el)

        fetch(`${baseUrl}rates/${el.id}?ondate=${fromDate}`)
          .then(response => response.json())
          .then(data => data.Cur_OfficialRate)
          .then(console.log)
      }
  })
}

function splitDate (curr, fromDate, toDate) {
  console.log(curr, fromDate, toDate)
  curr.forEach(el => {
    console.log(el)
    if (fromDate.valueAsDate.getFullYear() === toDate.valueAsDate.getFullYear()
    && fromDate.valueAsDate.getTime() >= (new Date(el.dateS).getTime())
    && toDate.valueAsDate.getTime() <= (new Date(el.dateE).getTime())
    ) {
      fetch(`${baseUrl}rates/dynamics/${el.id}?startdate=${fromDate.value}&enddate=${toDate.value}`)
      .then(response => response.json())
      .then(getInDyn)
    }

    // if (fromDate.valueAsDate.getFullYear() != toDate.valueAsDate.getFullYear()
    // && fromDate.valueAsDate.getFullYear() >= (new Date(el.dateS).getFullYear()
    // // && fromDate.valueAsDate.getTime() >= (new Date(el.dateS).getTime())
    // && toDate.valueAsDate.getFullYear() <= (new Date(el.dateE).getFullYear())
    
    

  })
  
}

function getInDyn(data) {
  // console.log(...data)
  const arrRates = [];
  [...data].forEach(data => {
    arrRates.push(data.Cur_OfficialRate)
    return arrRates
  })
  console.log(arrRates)
}