import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { Col, Input, Row } from 'reactstrap'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import Select from 'react-select'
import CityInput from '../../../../../components/common/Geo/City'
import RegionInput from '../../../../../components/common/Geo/Region'
import CountryInput from '../../../../../components/common/Geo/Country'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const FavouriteProduceFilter = ({ onFilter }) => {
	const [country, setCountry] = useState('')
	const [region, setRegion] = useState('')
	const [city, setCity] = useState('')

	const [produceTypes, setProduceTypes] = useState([])
	const [produce, setProduce] = useState('')
	const [types, setTypes] = useState([])
	const [type, setType] = useState('')

	const [month, setMonth] = useState('')

	useEffect(() => {
		const getProduceTypes = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_produce_types')
			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setProduceTypes(response.data.list)
				} else if (response.data.error) {
					alert(response.data.message)
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		getProduceTypes()
	}, [])

	const onCountryChanged = (country_numeric_id) => {
		setCountry(country_numeric_id)
		if (!country_numeric_id) {
			setRegion('')
			setCity('')
			return
		}
	}

	const onRegionChanged = (region_numeric_id) => {
		setRegion(region_numeric_id)
		if (!region_numeric_id) {
			setCity('')
			return
		}
	}

	const categories = produceTypes.filter((pt) => pt.refers_toISbb_agrix_produce_typesID === null)
	let produces = []
	for (let category of categories) {
		const sub_categories = produceTypes.filter((pt) => pt.refers_toISbb_agrix_produce_typesID === category.numeric_id)
		produces = [...produces, ...sub_categories]
	}

	const produceOptions = produces.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const typeOptions = types.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const onProduceChanged = (produce_id) => {
		setProduce(produce_id)
		if (!produce_id) return setTypes([])

		const types = produceTypes.filter((pt) => pt.refers_toISbb_agrix_produce_typesID === produce_id)
		setTypes(types)
	}

	const onSearchClicked = () => {
		const filterObj = {
			country,
			region,
			city,
			produce,
			type,
			month,
		}
		onFilter(filterObj)
	}

	return (
		<section className='ratio_45 section-b-space'>
			<form className='needs-validation user-add' noValidate=''>
				<Row className='mb-2'>
					<Col md='3'>
						<CountryInput
							value={country}
							onChange={(val) => {
								onCountryChanged(val?.value)
							}}
							directProps={{
								name: 'country',
							}}
						/>
					</Col>
					<Col md='3'>
						<RegionInput
							countryId={country}
							value={region}
							onChange={(val) => {
								onRegionChanged(val?.value)
							}}
							directProps={{
								name: 'region',
							}}
						/>
					</Col>
					<Col md='3'>
						<CityInput
							regionId={region}
							value={city}
							onChange={(val) => {
								setCity(val?.value)
							}}
							directProps={{
								name: 'city',
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col md='3'>
						<Select
							className={`w-100`}
							style={{ height: 38, borderColor: '#ced4da' }}
							options={produceOptions}
							placeholder='Select produce'
							name='produce'
							value={produce}
							onChange={(val) => {
								onProduceChanged(val?.value)
							}}
							menuPortalTarget={document.body}
						/>
					</Col>
					<Col md='3'>
						<Select
							className={`w-100`}
							style={{ height: 38, borderColor: '#ced4da' }}
							options={typeOptions}
							placeholder='Select type'
							name='type'
							value={type}
							onChange={(val) => {
								setType(val?.value)
							}}
							menuPortalTarget={document.body}
						/>
					</Col>
					<Col md='3'>
						<Select
							className={`w-100`}
							style={{ height: 38, borderColor: '#ced4da' }}
							options={[
								{ label: 'January', value: '1' },
								{ label: 'February', value: '2' },
								{ label: 'March', value: '3' },
								{ label: 'April', value: '4' },
								{ label: 'May', value: '5' },
								{ label: 'June', value: '6' },
								{ label: 'July', value: '7' },
								{ label: 'August', value: '8' },
								{ label: 'September', value: '9' },
								{ label: 'October', value: '10' },
								{ label: 'November', value: '11' },
								{ label: 'December', value: '12' },
							]}
							placeholder='Select month'
							name='month'
							value={month}
							onChange={(val) => {
								setMonth(val?.value)
							}}
							menuPortalTarget={document.body}
						/>
					</Col>
					<Col md='3'>
						<button type='button' className='btn btn-solid btn-default-plan btn-post mt-1' onClick={onSearchClicked}>
							{/* <i className='fa fa-eye' aria-hidden='true'></i> */}
							Search
						</button>
					</Col>
				</Row>
			</form>
		</section>
	)
}

export default FavouriteProduceFilter
