import React, { Fragment, useContext, useState, useEffect } from 'react'
import { Container, Col, Input, Row, Label, FormGroup } from 'reactstrap'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import vars from '../../../.../../../../helpers/utils/vars'

import Select from 'react-select'
import getConfig from 'next/config'
import Checkbox from 'react-custom-checkbox'
import { FiCheck } from 'react-icons/fi'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import CountryInput from '../../../../../components/common/Geo/Country'
import CityInput from '../../../../../components/common/Geo/City'
import RegionInput from '../../../../../components/common/Geo/Region'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const SellerReportFilter = ({ onFilter, membershipId, onLimited, onCheck }) => {
	const [showDetailsModal, setDetailsModal] = useState(false)

	const authContext = useContext(AuthContext)
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const [country, setCountry] = useState('')
	const [region, setRegion] = useState('')
	const [city, setCity] = useState('')

	const [buyer, setBuyer] = useState('')

	const [checked, setChecked] = useState(true)

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

	const onSearchClicked = () => {
		// onAuthModalsTriggered('Permission')
		const filterObj = {
			country,
			region,
			city,
			buyer,
			checked,
		}
		onFilter(filterObj)
	}

	React.useEffect(() => {
		onSearchClicked()
	}, [checked])

	const onCheckboxChanged = () => {
		const val = !checked
		setChecked(val)
		onCheck(val)
	}

	return (
		<Fragment>
			<section className='ratio_45 section-b-space pt-0'>
				<Container>
					<div className='partition4 mb-2'>
						<h4 className='f-w-600 mb-4 dashboard-title'>Buyer Filter:</h4>
					</div>
					<form className='needs-validation user-add' noValidate=''>
						<Row>
							<Col md='4' className='mb-2'>
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
							<Col md='4' className='mb-2'>
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
							<Col md='4' className='mb-2'>
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
							<Col md='4' className='mb-2'>
								<Input type='text' placeholder='Buyer name' value={buyer} onChange={(e) => setBuyer(e.target.value)} />
							</Col>

							<Col md='1' className='mb-2'>
								<button
									type='button'
									// disabled={!checked}
									className='btn btn-solid btn-default-plan btn-post'
									onClick={onSearchClicked}
								>
									{/* <i className='fa fa-eye' aria-hidden='true'></i> */}
									Search
								</button>
							</Col>

							<Col md='3' className='mb-2'>
								<FormGroup check className='pt-2'>
									<Checkbox
										icon={<FiCheck color={vars.primaryColor} size={14} />}
										name='my-input'
										checked={checked}
										onChange={(value) => {
											onCheckboxChanged()
										}}
										borderColor={vars.primaryColor}
										style={{ cursor: 'pointer' }}
										labelStyle={{ marginLeft: 5, userSelect: 'none' }}
										label='Show Buyers following me'
									/>
								</FormGroup>
							</Col>
						</Row>
					</form>
				</Container>
			</section>
		</Fragment>
	)
}

export default SellerReportFilter
