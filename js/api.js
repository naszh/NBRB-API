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


function splitDate() {
  
}