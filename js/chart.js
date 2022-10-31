
function prepareDataForChart(data) {
  const arrData = [];
  const dataConcat = [];

  if (Object.keys(data).length === 6) {
    dataConcat.push(
      [Date.UTC(data.Date.slice(0, 10).slice(0,4),
      data.Date.slice(0, 10).slice(5,7) - 1,
      data.Date.slice(0, 10).slice(8,10)), 
      data.Cur_OfficialRate]
    );
  } else {
    [...data].map(data => {
      dataConcat.push(
        [Date.UTC(data.Date.slice(0, 10).slice(0,4),
        data.Date.slice(0, 10).slice(5,7) - 1,
        data.Date.slice(0, 10).slice(8,10)),
        data.Cur_OfficialRate]
      );
    });
  };
  arrData.push(dataConcat);

  (arrData[0].length === 0) 
    ? document.querySelector('#container').innerHTML = 'There is no exchange rate on the requested date.' 
    : addChart(arrData);
}

function addChart(arrData) {
  Highcharts.chart('container', {
    title: {
      text: 'Exchange rate on the requested date',
    },
  
    subtitle: {
      text: `Currency: ${select.value}, 
      source: <a href="https://www.nbrb.by/apihelp/exrates" target="_blank">NBRB</a>`,
    },
  
    yAxis: {
      title: {
        text: 'Exchange rates',
      },
    },

    xAxis: {
      title: { text: 'Period' },
      type: 'datetime',
    },

    series: [{
      name: 'rate',
      data: arrData[0],
    }],   
  });
};