import React from 'react'
import Select from 'react-select'
import getConfig from 'next/config'
import { post } from '../../../services/axios'
import { getFormClient } from '../../../services/constants'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

function CityInput({ regionId, value, onChange, styles = {}, directProps = {} }) {
	const [dataList, setDataList] = React.useState([])
	const [loading, setLoading] = React.useState(false)

	const getDataList = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'list_countries')
		formData.append('refers_toISbb_agrix_countriesID', regionId)
		try {
			setLoading(true)
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				const list = response.data.list
				setDataList(list)
			} else if (response.data.error) {
				// alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		} finally {
			setLoading(false)
		}
	}

	React.useEffect(() => {
		if (regionId) {
			getDataList()
		} else {
			onChange(null)
			setDataList([])
		}
	}, [regionId])

	const options = dataList
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	return (
		<>
			<Select
				className={`w-100`}
				style={{ height: 38, borderColor: '#ced4da', ...styles }}
				options={options}
				placeholder='Select City'
				name='cityId'
				value={value}
				isLoading={loading}
				disabled={!regionId || loading}
				onChange={(val) => {
					onChange(val)
				}}
				menuPortalTarget={document.body}
				{...directProps}
			/>
		</>
	)
}

export default CityInput
