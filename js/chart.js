function prepareDataForChart(data) {
  const arrData = [];
  const dataConcat = [];
  if (new Date(fromDate.value).getTime() === new Date(toDate.value).getTime()) {
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

  addChart(arrData.sort());
};

function addChart(arrData) {
  Highcharts.chart('chart', {
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