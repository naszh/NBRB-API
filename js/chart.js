Highcharts.chart("container", {
  title: {
    text: "Exchange rate on the requested date"
  },

  subtitle: {
    text:
    'Source: <a href="https://www.nbrb.by/apihelp/exrates" target="_blank">NBRB</a>'
  },

  yAxis: {
    title: {
      text: "Exchange rates"
    }
  },

  xAxis: {
    title: { text: "Period" },
    category: [20, 25, 30, 35, 40, 45, 50, 55, 60],
    accessibility: {
      rangeDescription: "Range: 20 to 60"
    }
  },

  legend: {
    enabled: false
  },

  plotOptions: {
    series: {
      marker: {
        enabled: false
      },
      pointStart: 20,
      pointInterval: 5
    }
  },

  series: [
    {
      name: "Income Distribution and Intentional Homicide Rates,",
      data: [16.56, 18.9, 21.24, 23.58, 25.92, 28.26, 30.6, 32.94, 35.28]
    }
  ]
});