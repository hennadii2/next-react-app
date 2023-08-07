import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import getConfig from 'next/config'
import { getFormClient } from '../../../../services/constants'
import { post } from '../../../../services/axios'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const PriceLineGraph2 = ({ lineData, pricelogs, graphTitle }) => {
	let lineChartOptions = {
		title: graphTitle,
		titleTextStyle: { fontSize: 18 },
		hAxis: {
			title: '12 Months of the Year',
			textPosition: ['out'],
		},
		vAxis: {
			textPosition: ['in'],
			title: 'Price FOB in US$',
		},
		legend: { position: "bottom" },
		curveType: 'function',
		colors: [ 'red', 'blue', 'green', 'orange', 'black'],
	}

	const initGraphData = [
		['x', ''],
		['', 0],
	]

	const [graphData, setGraphData] = useState(initGraphData)

	useEffect(() => {
		setGraphData(initGraphData)
	}, [])

	useEffect(() => {
		if (lineData && Array.isArray(lineData) && lineData.length > 0) {
			let output = []
			lineData.forEach(line => {
				const tempData = calcGraphData(line)
				output = [...output, tempData ]
			});

			displayGraph(output)			
		} else {
			setGraphData(initGraphData)
		}
	}, [lineData])

	const displayGraph = (inData) => {
		const dataLabels = ['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let result = []	

		dataLabels.forEach((label, index) => {
			let row = [label]
			if (inData && inData.length > 0) {
				inData.forEach((data) => {
					row = [...row, data[1][index]]
				});
			}
			result = [...result, row]
		});

		setGraphData(result)
	}

	const calcDays = (month, day, dir, dates) => {
		if (dir === 'end') {
			if (month === parseInt(dates[1])) return Math.abs(parseInt(dates[2]) - day) + 1

			if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
				return 31 - day + 1
			} else if (month === 2) {
				return 28 - day + 1
			} else {
				return 30 - day + 1
			}
		} else if (dir === 'none') {
			if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
				return 31
			} else if (month === 2) {
				return 28
			} else {
				return 30
			}
		} else return day
	}

	const calcGraphData = (tag) => {
		const numeric_id = tag.value
		let graphData = [['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']]
		const price_logs = pricelogs.filter((price) => price.produceISbb_agrix_users_produceID === numeric_id)
		let price_day_2arr = []
		for (let log of price_logs) {
			let price_day_months = []
			for (let i = 0; i < 12; i++) {
				price_day_months.push([0, 0])
			}
			const from_date = log.from_date.split(' ')[0]
			const to_date = log.to_date.split(' ')[0]
			const from_dates = from_date.split('-')
			const to_dates = to_date.split('-')
			const from_month = parseInt(from_dates[1])
			const to_month = parseInt(to_dates[1])
			const from_day = parseInt(from_dates[2])
			const to_day = parseInt(to_dates[2])
			for (let m = from_month; m <= to_month; m++) {
				if (m === from_month) {
					price_day_months[m - 1] = [parseFloat(log.priceNUM), calcDays(m, from_day, 'end', to_dates)]
				} else if (m === to_month) {
					price_day_months[m - 1] = [parseFloat(log.priceNUM), calcDays(m, to_day, 'start', to_dates)]
				} else {
					price_day_months[m - 1] = [parseFloat(log.priceNUM), calcDays(m, to_day, 'none', to_dates)]
				}
			}
			price_day_2arr.push(price_day_months)
		}

		let produce_price_row = []
		for (let i = 0; i < 12; i++) {
			let price_sum = 0
			let days_sum = 0
			for (let j = 0; j < price_day_2arr.length; j++) {
				price_sum += price_day_2arr[j][i][0] * price_day_2arr[j][i][1]
				days_sum += price_day_2arr[j][i][1]
			}
			const ave_price = days_sum === 0 ? 0 : price_sum / days_sum
			produce_price_row.push(ave_price)
		}
		produce_price_row.unshift(tag.label)
		graphData.push(produce_price_row)

		return graphData
	}

	return (
		<div>
			<Chart
				width='100%'
				height='350px'
				chartType='LineChart'
				loader={<div>Loading Chart..</div>}
				data={graphData}
				options={lineChartOptions}
				rootProps={{ 'data-testid': '2' }}
			/>
		</div>
	)
}

export default PriceLineGraph2
