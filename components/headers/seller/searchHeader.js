import React, { Fragment, useEffect, useState } from 'react'
import { Search } from 'react-feather'
import axios from 'axios'
import Select from 'react-select'
import { Form, FormGroup, Input } from 'reactstrap'
import getConfig from 'next/config'
import { getFormClient } from '../../../services/constants'
import { Spinner, Label, Button, Container } from 'reactstrap'
import { FaSearch } from 'react-icons/fa'
import handleError from '../../../helpers/utils/handleError'
import { Row, Col } from 'antd-grid-layout'

import 'react-select/dist/react-select.css'
import 'antd-grid-layout/styles/antd-grid-layout.css'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const SearchHeader = ({ onSearch, searchFieldCustomStyles = {}, asModal = false }) => {
	const [searchText, setSearchText] = useState('')
	const _isMounted = React.useRef(false)
	const [loading, setLoading] = React.useState(true)
	const [produces, setProduces] = React.useState([])
	const [countryList, setCountryList] = useState([])
	const [country, setCountry] = useState('')
	const [subCategories, setSubCategories] = useState([])
	const [types, setTypes] = useState([])
	const [category, setCategory] = useState('')
	const [subCategory, setSubCategory] = useState('')
	const [type, setType] = useState('')

	const [errors, setErrors] = useState({
		category: false,
		sub_category: false,
		country: false,
		type: false,
	})

	const getMainData = async () => {
		try {
			_isMounted.current && setLoading(true)
			let formData = getFormClient()
			formData.append('api_method', 'list_produce_types')

			const response = await axios.request({
				url: apiUrl,
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: formData,
			})
			if (response.data.message === 'SUCCESS') {
				_isMounted.current && setProduces(response.data.list)
			} else if (response.data.error) {
				console.log(response.data.error)
			}

			let formData2 = getFormClient()
			formData2.append('api_method', 'list_countries')
			formData2.append('toplevel_only', 1)
			const response2 = await axios.post(apiUrl, formData2)
			if (response2.data.message === 'SUCCESS') {
				setCountryList(response2.data.list)
			}
		} catch (error) {
			handleError(error, true)
		} finally {
			_isMounted.current && setLoading(false)
		}
	}

	React.useEffect(() => {
		_isMounted.current = true
		getMainData()
		return () => {
			_isMounted.current = false
		}
	}, [])

	const handleSearch = (e) => {
		e.preventDefault()
		let id = ''

		if (type) {
			id = type
		} else if (subCategory) {
			id = subCategory
		} else if (category) {
			id = category
		}

		if (searchText || id || country) onSearch({ searchText, id, country })
	}

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 60 }}>
				<Spinner color='primary' size={asModal ? '' : 'sm'}>
					Loading...
				</Spinner>
			</div>
		)
	}

	const onCategoryChanged = (val) => {
		if (!val) {
			setCategory('')
			setSubCategories([])
			setType('')
			setTypes([])
			return
		}
		const { value: numeric_id } = val
		setCategory(numeric_id)
		const subCategories = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === numeric_id)
		setSubCategories(subCategories)
	}

	const categories = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === null)
	const categoryOptions = categories
		.map((category) => ({ value: category.numeric_id, label: category.name }))
		.sort((a, b) => a.label.localeCompare(b.label))

	const subCategoryOptions = subCategories
		.map((subCategory) => ({
			label: subCategory.name,
			value: subCategory.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const typeOptions = types
		.map((type) => ({
			label: type.name,
			value: type.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const countries = countryList.filter((country) => country.refers_toISbb_agrix_countriesID === null)
	const countryOptions = countries
		.map((country) => ({
			label: country.name,
			value: country.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const onCountryChanged = (val) => {
		if (!val) {
			setCountry('')
			return
		}
		const { value: numeric_id } = val
		setCountry(numeric_id)
	}

	const onSubCategoryChanged = (val) => {
		if (!val) {
			setSubCategory('')
			setTypes([])
			setType('')
			return
		}
		const { value: numeric_id } = val
		setSubCategory(numeric_id)
		const types = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === numeric_id)
		setTypes(types)
	}

	// console.log(category, subCategory, type, country)

	return (
		<Fragment>
			<div className='search-form'>
				<Row justify='space-between' align='middle' gutter={[20, asModal ? 10 : 20]}>
					<Col span={24} md={5}>
						<Label>Search produce</Label>
						<Input
							type='search'
							className='w-100 search-input'
							placeholder='Search produce'
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={searchFieldCustomStyles}
						/>
					</Col>
					<Col span={24} md={4}>
						<Label>Produce Category</Label>
						<Select
							className={`w-100`}
							placeholder='Select categories'
							options={categoryOptions}
							name='category'
							value={category}
							onChange={onCategoryChanged}
							menuPortalTarget={document.getElementById('headSectionWithBanner')}
						/>
					</Col>
					<Col span={24} md={5}>
						<Label>Produce Sub Category</Label>
						<Select
							className={`w-100`}
							options={subCategoryOptions}
							placeholder='Select sub categories'
							name='sub_category'
							disabled={!category}
							value={subCategory}
							onChange={onSubCategoryChanged}
							menuPortalTarget={document.body}
						/>
					</Col>
					<Col span={24} md={4}>
						<Label>Type</Label>
						<Select
							className={`w-100`}
							options={typeOptions}
							placeholder='Select types'
							name='type'
							value={type}
							disabled={!subCategory}
							onChange={(val) => setType(val)}
							menuPortalTarget={document.body}
						/>
					</Col>
					<Col span={24} md={4}>
						<Label>Country</Label>
						<Select
							className={`w-100`}
							options={countryOptions}
							placeholder='Select country'
							name='country'
							value={country}
							onChange={onCountryChanged}
							menuPortalTarget={document.body}
						/>
					</Col>
					<Col style={asModal ? { width: '100%' } : {}}>
						<Button
							color='success'
							block={asModal}
							className={`${asModal ? 'd-flex align-items-center justify-content-center mt-3' : 'mt-4'}`}
							onClick={handleSearch}
						>
							<FaSearch size={20} />
							{asModal ? <span>&nbsp; Search</span> : null}
						</Button>
					</Col>
				</Row>
				{/* <div className='d-sm-none mobile-search'>
						<Search />
					</div> */}
			</div>
		</Fragment>
	)
}

export default SearchHeader
