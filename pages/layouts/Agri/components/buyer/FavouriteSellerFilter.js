import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { Col, Input, Row } from 'reactstrap'
import SellerFilters from './SellerFilters'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import Select from 'react-select'
import CountryInput from '../../../../../components/common/Geo/Country'
import RegionInput from '../../../../../components/common/Geo/Region'
import CityInput from '../../../../../components/common/Geo/City'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const FavouriteSeller = ({ onFilter }) => {
	const [country, setCountry] = useState('')
	const [region, setRegion] = useState('')
	const [city, setCity] = useState('')

	const [seller, setSeller] = useState('')
	const [categories, setCategories] = useState([])
	const [category, setCategory] = useState('')

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

	const categoryOptions = categories
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	useEffect(() => {
		const getProduceTypes = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_produce_types')
			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					const produceTypes = response.data.list
					const categories = produceTypes.filter((pt) => pt.refers_toISbb_agrix_produce_typesID === null)
					setCategories(categories)
				} else if (response.data.error) {
					alert(response.data.message)
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		getProduceTypes()
	}, [])

	const onSearchClicked = () => {
		const filterObj = {
			country,
			region,
			city,
			seller,
			category,
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
						<Input type='text' placeholder='Seller Company Name' value={seller} onChange={(e) => setSeller(e.target.value)} />
					</Col>
					<Col md='3'>
						<Select
							className={`w-100`}
							style={{ height: 38, borderColor: '#ced4da' }}
							options={categoryOptions}
							placeholder='Select produce interest'
							name='category'
							value={category}
							onChange={(val) => {
								setCategory(val?.value)
							}}
							menuPortalTarget={document.body}
						/>
					</Col>
					<Col md='3'>
						<button type='button' className='btn btn-solid btn-default-plan btn-post' onClick={onSearchClicked}>
							{/* <i className='fa fa-eye' aria-hidden='true'></i> */}
							Search
						</button>
					</Col>
				</Row>
			</form>
		</section>
	)
}

export default FavouriteSeller
