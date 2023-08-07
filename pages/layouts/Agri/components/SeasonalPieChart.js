import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import { getArrayFromJson } from '../../../../helpers/utils/helpers'

const SeasonalPieChart = ({ usersProduce, numeric_id, graphTitle }) => {
	const initChartData = [
		['Seasons', 'Seasons in a year'],
		['', 0],
	]

	const initChartOptions = {
		title: graphTitle,
		pieSliceText: "none",
		titleTextStyle: { fontSize: 18 },
	}

	const colors = ['#3366cc','#ff9900', '#dc3912', 'yello']

	const [chartData, setChartData] = useState(initChartData)
	const [chartOptions, setChartOptions] = useState(initChartOptions)

	useEffect(() => {
		setChartData(initChartData)
	}, [])

	useEffect(() => {
		if (numeric_id) {
			const month = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			]

			const produce = usersProduce.find((prod) => prod.numeric_id === numeric_id)

			const harvestSeasons = (produce && produce.produce_harvest_season) ? getArrayFromJson(produce.produce_harvest_season) : null
			const harvestSeasonSize = harvestSeasons ? harvestSeasons.length : 0
			const storageSeasons = (produce && produce.produce_storage_season) ? getArrayFromJson(produce.produce_storage_season) : null
			const storageSeasonSize = storageSeasons ? storageSeasons.length : 0
			const unavailableSeasons = (produce && produce.produce_unavaliable_season) ? getArrayFromJson(produce.produce_unavaliable_season) : null
			const unavailableSeasonSize = unavailableSeasons ? unavailableSeasons.length : 0
			
			const chartData = [
				['Seasons', 'Seasons in a year'],
				[`Harvest (${harvestSeasons?.join(', ')})`, harvestSeasonSize],
				[`Storage (${storageSeasons?.join(', ')})`, storageSeasonSize],
				[`Unavailable (${unavailableSeasons?.join(', ')})`, unavailableSeasonSize],
			]

			// getting current month
			const d = new Date()
			let monthName = month[d.getMonth()]

			let slices = {}
			if (harvestSeasons && harvestSeasons.includes(monthName)) slices = { 0: { offset: 0.3 } }
			else if (storageSeasons && storageSeasons.includes(monthName)) slices = { 1: { offset: 0.1 } }
			slices = { 1: { offset: 0.1 } }

			const chartOptions = {
				title: graphTitle,
				//slices: slices,
				titleTextStyle: { fontSize: 18 },
				colors,
			}

			setChartOptions(chartOptions)
			setChartData(chartData)
		}
	}, [numeric_id])

	return (
		<div>
			<Chart
				width='100%'
				height='350px'
				chartType='PieChart'
				loader={<div>Loading Chart...</div>}
				data={chartData}
				options={chartOptions}
				rootProps={{ 'data-testid': '2' }}
			/>
		</div>
	)
}

export default SeasonalPieChart
