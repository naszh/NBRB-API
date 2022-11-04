function generateWidgetVal(curr) {
  const currForWidget = [];

  curr.forEach(el => {    
    switch(el.name) {
      case 'US Dollar':
      case 'EURO':
      case 'Russian Ruble':
      case 'Polish Zloty':
        currForWidget.push(el);
        break;
    };
    return currForWidget;
  });

  getDataWidget(currForWidget, today);
};

function getDataWidget(curr, today) {
  const links = [];

  curr.forEach(item => {
    item.currs.map(el => {
      if (new Date(today).getTime() <= new Date(el.dateE).getTime()
      && new Date(today) >= new Date(el.dateS).getTime()) {
        links.push(`${baseUrl}rates/${el.id}?ondate=${today}`);
      };
    });
  });

  let requests = links.map(url => fetch(url));
  Promise.all(requests)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(data => {data.forEach(data => {
      addToWidget(data.Cur_OfficialRate, data.Cur_Scale, data.Cur_Abbreviation)
    });
  });
};

function addToWidget(rate, scale, curr) {
  document.querySelector(`#widget-name`).innerHTML = `<p>Exchange rate for today, ${today}</p>`;

  const currencyExch = document.createElement('div')
  currencyExch.innerHTML = `<p>${scale}</p>
                            <p>${curr}</p>
                            <p>${rate}</p>`;
  
  document.querySelector('.widget').append(currencyExch);
  document.querySelector('.widget').style.backgroundColor = '#0080ff';
};