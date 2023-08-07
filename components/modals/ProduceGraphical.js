import React, { useEffect, useState, useContext, useMemo } from 'react'
import Link from 'next/link'
import getConfig from 'next/config'
import Chart from 'react-google-charts'
import { Modal, ModalHeader, ModalBody, Input, Label } from 'reactstrap'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import Select from 'react-select'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import MultiSeasonSelect from '../../pages/layouts/Agri/components/MultiSeasonSelect'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { seasonOptions } from '../../services/constants'
import { Col, Row } from 'antd-grid-layout'
import { sortByName } from '../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const commonSelectStyles = { height: 38, borderColor: '#ced4da' }
const colors = ['#3366cc','#dc3912','#ff9900','#109618',
                '#990099','#0099c6','#dd4477','#66aa00',
                '#b82e2e','#316395','#994499','#22aa99',
                '#aaaa11','#6633cc','#e67300','#8b0707',
                '#651067','#329262','#5574a6','#3b3eac',
                '#b77322','#16d620','#b91383','#f4359e',
                '#9c5935','#a9c413','#2a778d','#668d1c',
                '#bea413','#0c5922','#743411'];
let lineChartOptions = {
	title: 'Produce vs. Price comparison',
	titlePosition: 'out',
	axisTitlesPosition: 'out',
	hAxis: {
		title: '12 Months of the Year',
		textPosition: 'in',
	},
	vAxis: {
		textPosition: 'in',
		title: 'Price',
	},
	legend:  'none',
	curveType: 'function',
	colors
}

const initGraphData = [
	['x', ''],
	['', 0],
]

const ProduceGraphical = ({ isShow, onToggle, produceData }) => {

	const isCategory = produceData.refers_toISbb_agrix_produce_typesID === null
	const settingContext = useContext(SettingContext)

	const packagings = settingContext.appData.produce_packaging
	const packagingOptions = packagings.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const farmings = settingContext.appData.produce_farming_method
	const farmingOptions = farmings.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const noResultsMessage = 'There is no result to match your filter. Please try another filter.'

	const [pricelogs, setPriceLogs] = useState([])
	const [graphData, setGraphData] = useState(initGraphData)

	const [loadedProducesData, setLoadedProducesData] = useState(false)
	const [noFilteredDataMessage, setNoFilteredDataMessage] = useState('')
	const [produces, setProduces] = useState([])
	const [subCategories, setSubCategories] = useState([])
	const [subCategory, setSubCategory] = useState('')
	const [produceTypes, setProduceTypes] = useState([])
	const [produceType, setProduceType] = useState('')
	const [countryList, setCountryList] = useState([])
	const [country, setCountry] = useState('')
	const [regions, setRegions] = useState([])
	const [region, setRegion] = useState('')
	const [toPrice, setToPrice] = useState(0)
	const [fromPrice, setFromPrice] = useState(0)
	const [farming, setFarming] = useState('')
	const [packaging, setPackaging] = useState('')
	const [storage, setStorage] = useState([])
	const [loadingText, setLoadingText] = useState('')

	const [priceRangeError, setPriceRangeError] = useState(false)
	const [graphItems, setGraphItems] = useState([])

	const legendDiv = useMemo(() => {
		return (
			<div className="d-flex align-items-center justify-content-center mb-4">
				<div className="legend">
					{graphItems.map((item, index) => (
						<div key={index} className="d-flex align-items-center">
							<div style={{
								width: '20px',
								height: '2px',
								backgroundColor: colors[index]
							}}></div>
							<div className="ml-2">{item}</div>
						</div>
					))}
				</div>
			</div>
		)
	}, [graphItems]);

	useEffect(() => {
		const getProduceTypes = async (isCat, id) => {
			setLoadedProducesData(false)
			let formData = getFormClient()
			formData.append('api_method', 'list_produce_types')
			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					const allProduces = response.data.list
					const sortedAll = sortByName(allProduces)
					setProduces(sortedAll)

					if (isCat) {
						const subCategories = allProduces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === id)
						const sortedCates = sortByName(subCategories)
						setSubCategories(sortedCates)
					} else {
						const produces = allProduces.filter(
							(pt) => pt.refers_toISbb_agrix_produce_typesID === id
						)
						console.log('---------produces',produces)
						const sortedProtypes = sortByName(produces)
						setProduceTypes(sortedProtypes)
					}

					setLoadedProducesData(true)
					
				} else if (response.data.error) {
					alert(response.data.message)
					setLoadedProducesData(true)
				} else {
					setLoadedProducesData(true)
				}
			} catch (err) {
				alert(err.toString())
				setLoadedProducesData(true)
			}
		}

		const getCountryList = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_countries')

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setCountryList(response.data.list)
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		const getPriceLogs = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_users_produce_pricing')

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setPriceLogs(response.data.list)
				}
			} catch (err) {
				alert(err.toString())
			}
		}
		
		const id = produceData.numeric_id

		getProduceTypes(isCategory, id)
		getCountryList()
		getPriceLogs()
		setGraphData(initGraphData)
		setGraphItems([])
		
	}, [produceData])

	const setDefaultSelection = () => {
		if (isCategory) {
			if (subCategories.length > 0) {
				const defaultSubCategoryId = subCategories[0].numeric_id
				setSubCategory(defaultSubCategoryId)							
				const types = onSubCategoryChanged(defaultSubCategoryId)							
				if (types.length > 0) {
					const defaultType = types[0].numeric_id
					setProduceType(defaultType)								
					onFilterClicked(defaultSubCategoryId, defaultType)
				}
			}
		} else {
			if (produceTypes.length > 0) {
				const defaultType = produceTypes[0].numeric_id
				setProduceType(defaultType)
				onFilterClicked(null, defaultType)
			}
		}
	}

	useEffect(() => {
		if (isShow && loadedProducesData) {
			setFromPrice(0)
			setToPrice(0)
			setDefaultSelection()
		}
	}, [isShow, loadedProducesData])
	

	const subCategoryOptions = subCategories.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const produceTypeOptions = produceTypes.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const countries = countryList.filter((country) => country.refers_toISbb_agrix_countriesID === null)

	const countryOptions = countries.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const regionOptions = regions.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const onToggled = () => {
		onToggle()
	}

	const onSubCategoryChanged = (val) => {
		console.log("category changed", val)
		if (!val) {
			setSubCategory('')
			setProduceTypes([])
			setProduceType('')
			return
		}		
		setSubCategory(val)
		const types = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === val)
		//console.log(types)
		setProduceTypes(types)
		return types
	}

	const onCountryChanged = (numeric_id) => {
		setCountry(numeric_id)
		const regions = countryList.filter((country) => country.refers_toISbb_agrix_countriesID === numeric_id)
		setRegions(regions)
	}

	const onStorageFiltered = (produces) => {
		if (storage.length === 0) return produces

		const filteredProduces = produces.filter((produce) => {
			// exclude the produce with storage_season=null
			if (!produce.produce_storage_season) return false
			else {
				// get the porduces only that inludes filter-storage in its own storage_season field
				const produceStorages = JSON.parse(produce.produce_storage_season)
				const containsAll = storage.every((element) => {
					return produceStorages.includes(element)
				})
				return containsAll
			}
		})

		return filteredProduces
	}

	const onPriceFiltered = (produces) => {
		if (fromPrice === 0 && toPrice === 0) return produces

		const filteredProduces = produces.filter((produce) => {
			const producePrices = pricelogs.filter((price) => price.produceISbb_agrix_users_produceID === produce.numeric_id)
			// if produce has no price logs
			if (producePrices.length === 0) return false

			// get first priceLog with priceNum that is out of filter-price ranges
			const priceLog = producePrices.find(
				(producePrice) => parseFloat(producePrice.priceNUM) < fromPrice || parseFloat(producePrice.priceNUM) > toPrice
			)

			if (priceLog) return false

			return true
		})

		return filteredProduces
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

	const calcGraphData = (produces) => {
		let graphData = [['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']]
		let tempGraphItems = []
		for (let produce of produces) {
			const price_logs = pricelogs.filter((price) => price.produceISbb_agrix_users_produceID === produce.numeric_id)
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
			//produce_price_row.unshift(produce.produce_sub_categoryISbb_agrix_produce_typesID_data?.name)
			const produceName = produce.produce_sub_categoryISbb_agrix_produce_typesID_data?.name ? produce.produce_sub_categoryISbb_agrix_produce_typesID_data?.name : "";
			const TypeName = produce.produce_typeISbb_agrix_produce_typesID_data?.name ? produce.produce_typeISbb_agrix_produce_typesID_data?.name : "";
			const sizeName = produce.sizeISbb_agrix_produce_sizesID_data?.name ? ", " + produce.sizeISbb_agrix_produce_sizesID_data?.name : "";
			const weightPackageName = produce.packaging_weightISbb_agrix_produce_packagingID_data?.name ? ", " + produce.packaging_weightISbb_agrix_produce_packagingID_data?.name : "";
			const packageName = produce.packagingISbb_agrix_produce_packagingID_data?.name ? ", " + produce.packagingISbb_agrix_produce_packagingID_data?.name : "";

			const produceFullName = (isCategory) ? (produceName + ", " + TypeName + sizeName + weightPackageName + packageName) : (TypeName + sizeName + weightPackageName + packageName);
			
			produce_price_row.unshift(produceFullName)
			graphData.push(produce_price_row)
			tempGraphItems.push(produceFullName);
		}
		setGraphItems(tempGraphItems);
		return graphData
	}

	const onFilterClicked = async (defaultCate = null, defaultProduceType = null) => {
		if (fromPrice > toPrice) {
			setPriceRangeError(true)
			return
		}

		let subCat = null
		let proType = null

		if (!defaultCate && !defaultProduceType) {
			console.log('---------search by default selection-----------');
			if (isCategory) {
				if (subCategories.length > 0) {
					const defaultSubCategoryId = subCategories[0].numeric_id
					setSubCategory(defaultSubCategoryId)
					subCat = defaultSubCategoryId
					const types = onSubCategoryChanged(defaultSubCategoryId)							
					if (types.length > 0) {
						const defaultType = types[0].numeric_id
						setProduceType(defaultType)
						proType = defaultType
					}
				}
			} else {
				if (produceTypes.length > 0) {
					const defaultType = produceTypes[0].numeric_id
					setProduceType(defaultType)
					proType = defaultType
				}
			}
		} else {
			subCat = defaultCate === null ? subCategory : defaultCate
			proType = defaultProduceType === null ? produceType : defaultProduceType
		}
		

		//console.log("------subCategory-----", subCat)
		//console.log("------produceType-----", produceType)

		setNoFilteredDataMessage("")
		setLoadingText("Fetching data...")
		let formData = getFormClient()
		formData.append('api_method', 'list_users_produce')
		formData.append('get_linked_data', '1')
		// if on category screen
		if (isCategory) {
			formData.append('produce_categoryISbb_agrix_produce_typesID', produceData.numeric_id)
			if (subCat) formData.append('produce_sub_categoryISbb_agrix_produce_typesID', subCat)
			if (proType) formData.append('produce_typeISbb_agrix_produce_typesID', proType)
			// if on sub-category screen
		} else {
			formData.append('produce_sub_categoryISbb_agrix_produce_typesID', produceData.numeric_id)
			if (proType) formData.append('produce_typeISbb_agrix_produce_typesID', proType)
		}

		if (country) formData.append('countryISbb_agrix_countriesID', country)

		if (region) formData.append('regionISbb_agrix_countriesID', region)

		if (packaging) formData.append('packagingISbb_agrix_produce_packagingID', packaging)

		if (farming) formData.append('farming_methodISbb_agrix_produce_farming_methodID', farming)
		
		try {
			const response = await post(apiUrl, formData)
			//console.log("apiUrl", apiUrl)
			//console.log("response", response)
			if (response.data.message === 'SUCCESS') {
				const respData = response.data.list

				if (response.data.list.length < 0) {
					setNoFilteredDataMessage(noResultsMessage)
				}
				
				const storageFilteredProduces = onStorageFiltered(respData)
				const priceFilteredProduces = onPriceFiltered(storageFilteredProduces)
				const graphData = calcGraphData(priceFilteredProduces)
				// transposing the array

				const output = graphData[0].map((_, colIndex) => graphData.map((row) => row[colIndex]))
				// lineChartOptions.chartArea = {
				// 								width: '50%',
				// 								height: '80%',
				// 								left: 0,
				// 							};
				console.log('------------output', output);
				setGraphData(output)
			} else if (response.data.error) {
				setNoFilteredDataMessage(noResultsMessage)
				setGraphData(initGraphData)
				setGraphItems([])
			}
		} catch (err) {
			console.log("err", err)
			setGraphItems([])
			alert(err.toString())
		}

		setLoadingText("")
	}

	return (
		<Modal centered isOpen={isShow} toggle={onToggled} size='lg'>
			<CloseModalBtn
				onClick={onToggled}
				styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
				iconProps={{ color: 'gray' }}
			/>
			<ModalBody className='py-4 px-5'>
				<h4 className='section-title text-center mt-3 mb-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
					Produce Pricing Report
				</h4>
				<form className='needs-validation'>
					<Row gutter={[10, 6]}>
						{isCategory && (
							<Col span={24} md={12}>
								<Select
									className={`w-100`}
									style={commonSelectStyles}
									options={subCategoryOptions}
									placeholder='Select produce sub category'
									name='subcategory'
									value={subCategory}
									onChange={(val) => {
										onSubCategoryChanged(val?.value)
									}}
									menuPortalTarget={document.body}
								/>
							</Col>
						)}
						<Col span={24} md={12}>
							<Select
								className={`w-100`}
								style={commonSelectStyles}
								options={produceTypeOptions}
								placeholder='Select produce type'
								disabled={isCategory && !subCategory}
								name='producetype'
								value={produceType}
								onChange={(val) => {
									setProduceType(val?.value)
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
						<Col span={24} md={12}>
							<div className='d-flex align-items-center justify-content-between'>
								<Label className={priceRangeError ? 'text-danger' : ''}>Price Range($):</Label>
								<Input
									className={`w-25 ml-2 ${priceRangeError ? 'is-invalid' : ''}`}
									type='number'
									value={fromPrice}
									onChange={(e) => {
										setFromPrice(e.target.value)
										setPriceRangeError(false)
									}}
								/>
								<Label className='mx-4'> to </Label>
								<Input
									className={`w-25 ${priceRangeError ? 'is-invalid' : ''}`}
									type='number'
									value={toPrice}
									onChange={(e) => {
										setToPrice(e.target.value)
										setPriceRangeError(false)
									}}
								/>
							</div>
						</Col>
						<Col span={24} md={12}>
							<Select
								className={`w-100`}
								style={commonSelectStyles}
								options={countryOptions}
								placeholder='Select country'
								name='country'
								value={country}
								onChange={(val) => {
									onCountryChanged(val?.value)
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
						<Col span={24} md={12}>
							<Select
								className={`w-100`}
								style={commonSelectStyles}
								options={regionOptions}
								disabled={!country}
								placeholder='Select region'
								name='region'
								value={region}
								onChange={(val) => {
									setRegion(val?.value)
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
						<Col span={24} md={12}>
							<Select
								className={`w-100`}
								style={commonSelectStyles}
								options={farmingOptions}
								placeholder='Select farming method'
								name='farming'
								value={farming}
								onChange={(val) => {
									setFarming(val?.value)
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
						<Col span={24} md={12}>
							<Select
								className={`w-100`}
								style={commonSelectStyles}
								options={packagingOptions}
								placeholder='Select packaging'
								name='packaging'
								value={packaging}
								onChange={(val) => {
									setPackaging(val?.value)
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
						<Col span={24} md={12}>
							<Select
								className={`w-100`}
								multi={true}
								style={commonSelectStyles}
								options={seasonOptions.map((x) => ({ value: x, label: x }))}
								placeholder='Select storage'
								name='storage'
								value={storage}
								onChange={(val) => {
									console.log(val)
									if (val && val?.length) {
										setStorage([...val.map((x) => x.value)])
									} else {
										setStorage([])
									}
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
					</Row>

					{isCategory ? (
						<div>
							<button
								type='button'
								className='btn btn-solid btn-default-plan py-1 px-3'
								style={{ float: 'right' }}
								onClick={() => onFilterClicked(subCategory, produceType)}
								// disabled={loadingText || !subCategory || !produceType}
								disabled={loadingText}
							>
								{loadingText ? 'Filtering...' : 'Filter'}
							</button>
						</div>
					) : (
						<div>
							<button
								type='button'
								className='btn btn-solid btn-default-plan py-1 px-3'
								style={{ float: 'right' }}
								onClick={() => onFilterClicked(null, produceType)}
								// disabled={loadingText || !produceType}
								disabled={loadingText}
							>
								{loadingText ? 'Filtering...' : 'Filter'}
							</button>
						</div>
					)}

					
				</form>
				{loadingText ? (
					<div className='mt-5'>
						{/* <div>{loadingText}</div> */}
						<Chart
							width='100%'
							height='400px'
							chartType='LineChart'
							loader={<div>Loading Chart</div>}
							data={initGraphData}
							options={lineChartOptions}
							rootProps={{ 'data-testid': '2' }}
						/>
					</div>
				) : (
					<div className='mt-5'>
						{noFilteredDataMessage && (
							<div className='mt-5 text-danger'>{noFilteredDataMessage}</div>
						)}
						<Chart
							width='100%'
							height='400px'
							chartType='LineChart'
							loader={<div>Loading Chart</div>}
							data={graphData}
							options={lineChartOptions}
							rootProps={{ 'data-testid': '2' }}
						/>
						<div>{legendDiv}</div>
					</div>
				)}
				
			</ModalBody>
		</Modal>
	)
}

export default ProduceGraphical
