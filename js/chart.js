function prepareDataForChart(data, fromVal, toVal) {
	const arrData = [];
	const dataConcat = [];
	if (fromVal === toVal) {
		dataConcat.push([
			Date.UTC(
				data.Date.slice(0, 4),
				data.Date.slice(5, 7) - 1,
				data.Date.slice(8, 10)
			),
			data.Cur_OfficialRate,
		]); //Массив с датой (перевод даты из формата 'yyyy-mm-ddThh:mm:ss' в формат UTC) и курсом
	} else {
		[...data].map(data => {
			dataConcat.push([
				Date.UTC(
					data.Date.slice(0, 4),
					data.Date.slice(5, 7) - 1,
					data.Date.slice(8, 10)
				),
				data.Cur_OfficialRate,
			]);
		});
	}
	arrData.push(dataConcat);
	return arrData.sort();
}

function drawChart(args) {
	const data = prepareDataForChart(args, fromDate.value, toDate.value);
	addChart(data);
}

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

		series: [
			{
				name: 'rate',
				data: arrData[0],
			},
		],
	});
}
