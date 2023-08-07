import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Form, Label, Input, Button, Media, Spinner } from 'reactstrap'
import SettingContext from '../../../../helpers/theme-setting/SettingContext'
import { getFormClient, contents_url } from '../../../../services/constants'
import { post } from '../../../../services/axios'
import getConfig from 'next/config'
import Select from 'react-select'
import { Row, Col } from 'antd-grid-layout'
import MapGL, { Marker, Popup } from '@urbica/react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import vars from '../../../../helpers/utils/vars'
import { nanoid } from 'nanoid'
import UserPermissionHoc from '../../../../components/modals/UserPermissionHoc'
import MapNoResultsModal from '../../../../components/modals/MapNoResultsModal'
import { useRouter } from 'next/router'
import PlaceholderImage from '../../../../public/assets/images/placeholder.webp'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`
const MAPBOX_TOKEN = `${publicRuntimeConfig.MAPBOX_TOKEN}`

export const cardStyles = {
	backgroundColor: '#fff',
	borderRadius: 5,
	padding: '1.5rem',
	boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
}

const mapDefault = { latitude: 0, longitude: 0, zoom: 1 }

const ProduceMap = ({ categories, produceData, produceSubCatId }) => {
	const router = useRouter()
	const settingContext = useContext(SettingContext)
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const membershipId = user.membershipISbb_agrix_membership_typesID
	const seasons = settingContext.appData.produce_seasons
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const seasonOptions = seasons.map((item) => ({
		label: item.name,
		value: item._id,
	}))

	const [produces, setProduces] = useState([])
	const [countries, setCountries] = useState([])
	const [viewport, setViewport] = useState(mapDefault)
	const [showMapNoResultModal, setShowMapNoResultModall] = useState(false)

	const countryOptions = countries
		.filter((x) => !x.refers_toISbb_agrix_countriesID)
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.slice()
		.sort((a, b) => a?.label.localeCompare(b?.label))

	

	const allSubCategories = useMemo(() => {
		let tempSubCategories = []
		for (let category of categories) {
			const subCategories = produces.filter(
				(produce) => produce.refers_toISbb_agrix_produce_typesID === category.numeric_id
			)
			tempSubCategories = [...tempSubCategories, ...subCategories]
		}
		tempSubCategories = tempSubCategories.filter(
			(x) => x.refers_toISbb_agrix_produce_typesID === produceData.refers_toISbb_agrix_produce_typesID
		)
		return tempSubCategories;

	}, [produces])

	const getAllSubCategories = produces => {
		let tempSubCategories = []
		for (let category of categories) {
			const subCategories = produces.filter(
				(produce) => produce.refers_toISbb_agrix_produce_typesID === category.numeric_id
			)
			tempSubCategories = [...tempSubCategories, ...subCategories]
		}
		tempSubCategories = tempSubCategories.filter(
			(x) => x.refers_toISbb_agrix_produce_typesID === produceData.refers_toISbb_agrix_produce_typesID
		)
		return tempSubCategories;
	}

	const subCategoryOptions = useMemo(() => {
		const result = allSubCategories
			.map((item) => ({
				label: item.name,
				value: item.numeric_id,
			}))
			.sort((a, b) => a.label.localeCompare(b.label))
		return result
	}, [allSubCategories])

	const [seasonId, setSeasonId] = useState('')
	const [month, setMonth] = useState('')
	const [countryId, setCountryId] = useState('')
	const [subCategoryId, setSubCategoryId] = useState(produceSubCatId)
	const [tags, setTags] = useState([])
	const [tagId, setTagId] = useState('')
	const [company, setCompany] = useState('')
	const [results, setResults] = useState([])
	const [markers, setMarkers] = useState([])
	const [searching, setSearching] = useState(false)
	const [mapReRenderer, setMapReRenderer] = useState(nanoid())
	const [regions, setRegions] = useState([])
	const [region, setRegion] = useState('')
	const [city, setCity] = useState('')
	const [cities, setCities] = useState([])
	const [popupItem, setPopupItem] = useState(null)
	const [loading, setLoading] = useState(true)

	const onSubCategoryChanged = (sub_category_id) => {
		setSubCategoryId(sub_category_id)

		if (!sub_category_id) return setTags([])

		updateTags(produces, sub_category_id)
	}

	const updateTags = (produces, sub_category_id) => {
		const all = getAllSubCategories(produces)
		const selectedSubCategory = all.find((subCategory) => subCategory.numeric_id === sub_category_id)
		if (selectedSubCategory && selectedSubCategory.numeric_id) {
			const tags = produces.filter(
				(produce) => produce.refers_toISbb_agrix_produce_typesID === selectedSubCategory.numeric_id
			)
			setTags(tags)
		}
	}

	const tagOptions = useMemo(() => {
		const result = tags
			.map((item) => ({
				label: item.name,
				value: item.numeric_id,
			}))
			.sort((a, b) => a.label.localeCompare(b.label))
		return result
	}, [tags])	

	const initPageSetup = async () => {
		handleSearch()
		setLoading(true)
		const subs = await getSubCategories()
		await getCountries()
		setLoading(false)

		setSubCategoryId(produceSubCatId)
		updateTags(subs, produceSubCatId)
	}

	const getSubCategories = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'list_produce_types')

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				setProduces(response.data.list)
				return response.data.list
			} else if (response.data.error) {
				alert(response.data.message)
				return []
			}
		} catch (err) {
			alert(err.toString())
			return []
		}
	}

	const getCountries = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'list_countries')

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				setCountries(response.data.list)
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	useEffect(() => {
		initPageSetup()
	}, [])

	const somethingWrong = (msg) => {
		toast.error(msg || 'Something went wrong!', {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined,
		})
	}

	/**
	 * Get sellers of the produce (subCategoryId)
	 * @returns Sellers list
	 */
	const handleSearch = async () => {
		if (!subCategoryId) return
		initMap()
		setSearching(true)
		let formData = getFormClient()
		formData.append('api_method', 'list_users')
		formData.append('typeISbb_agrix_users_typesID', '2')
		formData.append('get_linked_data', 1)
		// formData.append('userISbb_agrix_usersID', user._id)
		// formData.append('session_id', user.session_id)
		// formData.append('user_id', user._id)
		subCategoryId && formData.append('produce_sub_categoryISbb_agrix_produce_typesID', subCategoryId)
		tagId && formData.append('produce_typeISbb_agrix_produce_typesID', tagId)
		countryId && formData.append('countryISbb_agrix_countriesID', countryId)
		region && formData.append('regionISbb_agrix_countriesID', region)
		city && formData.append('cityISbb_agrix_countriesID', city)

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS' && !response.data.list.error) {
				setupResults(response.data.list)				
				setViewport(mapDefault)
			} else if (response.data.error) {
				setupResults([])
				setShowMapNoResultModall(true)
				setMapReRenderer(null)
			}
		} catch (err) {
			alert(err.toString())
		} finally {
			setMapReRenderer(nanoid())
			setSearching(false)
		}
	}

	const setupResults = (list) => {
		const filtered = list.filter((x) => {
			if (x.lat && x.lng) return true
			return false
		})
		setMarkers(filtered)
		setResults(list)
	}

	const initMap = () => {
		setMarkers([])
		setPopupItem(null)
	}

	const onCountryChanged = (numeric_id) => {
		setCountryId(numeric_id)
		if (!numeric_id) {
			setRegion('')
			setRegions([])
			setCity('')
			setCities([])
			return
		}
		const regions = countries.filter((country) => country.refers_toISbb_agrix_countriesID === numeric_id)
		setRegions(regions)
		setRegion('')
		setCity('')
	}
	const onRegionChanged = (region_numeric_id) => {
		setRegion(region_numeric_id)
		if (!region_numeric_id) {
			setCity('')
			setCities([])
			return
		}

		const cities = countries.filter((item) => item.refers_toISbb_agrix_countriesID === region_numeric_id)
		setCities(cities)
		setCity('')
	}
	const regionOptions = regions
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))
	const cityOptions = cities
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const setPopupInfo = (item) => {
		setPopupItem(item)
	}

	const clickPopup = (item) => {
		const sellerId = item.numeric_id		
		router.push(getValidUrl(`/seller/detail/${sellerId}/${item.label}`))
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }} className=''>
			<section style={{ width: '100%', maxWidth: 1200 }}>				
				<div style={cardStyles}>					
					<UserPermissionHoc
						asModal={false}
						checkPermission={() => {
							if (membershipId === '3') return false
							return true
						}}
					>
						{mapReRenderer && (
							<MapGL
								style={{ width: '100%', height: '400px' }}
								mapStyle='mapbox://styles/mapbox/light-v9'
								accessToken={MAPBOX_TOKEN}
								latitude={viewport.latitude}
								longitude={viewport.longitude}
								zoom={viewport.zoom}
								onViewportChange={setViewport}
							>
								{markers.map((item, index) => {
									return (
										<div key={index}>
											<Marker
												longitude={item.lng}
												latitude={item.lat}
												draggable={false}
												onClick={() => setPopupInfo(item)}>
												<FaMapMarkerAlt size={24} color={vars.secondaryColor} style={{ cursor: 'pointer' }}/>
											</Marker>
										</div>
									)
								})}
								{popupItem && (
									<Popup
										longitude={popupItem.lng}
										latitude={popupItem.lat}
										closeButton={true}
										closeOnClick={false}
										onClose={() => setPopupItem(null)}
										offset={15}
										anchor="left"
										className="map-popup"
									>	
										<a href='#' onClick={() => clickPopup(popupItem)}>
											<div className={`collection-banner`} style={{ position: 'relative' }}>
												<div className='img-part'>
													<Media
														src={popupItem.companylogoISfile ? contents_url + popupItem.companylogoISfile : PlaceholderImage}
														className='img-fluid-ads'
														alt={popupItem.company}
														height='80px'
														style={{ objectFit: 'cover', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
													/>
												</div>
												<div
													style={{
														position: 'absolute',
														top: 10,
														left: 10,
														padding: '6px 10px',
														borderRadius: 35,
														backgroundColor: vars.primaryColor,
														color: '#fff',
													}}
												>
													{popupItem.company}
												</div>
											</div>
											<div className='p-3 produce-info'>
												<h5 style={{ fontWeight: 'bold' }}>Seller: {popupItem.company}</h5>
												{/* <h6 className='pl-0 mb-1'>Sub Category: {popupItem.produce_sub_categoryISbb_agrix_produce_typesID_data.name}</h6> */}
											</div>
										</a>
									</Popup>
								)}
							</MapGL>
						)}
					</UserPermissionHoc>
				</div>
				{loading ? (
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 60 }}>
						<Spinner color='primary' size={'sm'}>
							Loading...
						</Spinner>
					</div>
				) : (
					<div style={cardStyles} className='mt-4'>
						<Form>
							<Label className='my-1'>Choose your produce below:</Label>
							<Row gutter={[20, 20]}>
								<Col span={24} md={6}>
									<Select
										className={`w-100`}
										style={{ height: 38, borderColor: '#ced4da' }}
										options={subCategoryOptions}
										placeholder='Sub-Category'
										name='subCategoryId'
										value={subCategoryId}
										onChange={(val) => {
											onSubCategoryChanged(val?.value)
										}}
										menuPortalTarget={document.body}
									/>
								</Col>
								<Col span={24} md={6}>
									<Select
										className={`w-100`}
										style={{ height: 38, borderColor: '#ced4da' }}
										options={tagOptions}
										placeholder='Tag'
										name='tagId'
										value={tagId}
										onChange={(val) => {
											setTagId(val?.value)
										}}
										menuPortalTarget={document.body}
									/>
								</Col>
							</Row>
							<Label className='mt-2 mb-1'>Filter by:</Label>
							<Row gutter={[20, 20]}>							
								<Col span={24} md={6}>
									<Select
										className={`w-100`}
										style={{ height: 38, borderColor: '#ced4da' }}
										options={countryOptions}
										placeholder='Country'
										name='countryId'
										value={countryId}
										onChange={(val) => {
											onCountryChanged(val?.value)
										}}
										menuPortalTarget={document.body}
									/>
								</Col>
								<Col span={24} md={6}>
									<Select
										className={`w-100`}
										style={{ height: 38, borderColor: '#ced4da' }}
										options={regionOptions}
										placeholder='Select region'
										name='region'
										disabled={countryId? false: true}
										value={region}
										onChange={(val) => {
											onRegionChanged(val?.value)
										}}
										menuPortalTarget={document.body}
									/>
								</Col>
								<Col span={24} md={6}>
									<Select
										className={`w-100`}
										style={{ height: 38, borderColor: '#ced4da' }}
										options={cityOptions}
										placeholder='Select city'
										name='city'
										value={city}
										disabled={region? false: true}
										onChange={(val) => {
											setCity(val?.value)
										}}
										menuPortalTarget={document.body}
									/>
								</Col>							
								<Col span={24} md={6}>
									<button
										type='button'
										disabled={!subCategoryId || searching}
										onClick={handleSearch}
										className='btn btn-solid btn-default-plan btn-post'
									>
										<i className='fa fa-search mr-2' aria-hidden='true'></i>
										{searching ? 'Searching...' : 'Filter'}
									</button>
								</Col>
							</Row>
						</Form>
					</div>
				)}
			</section>
			<MapNoResultsModal
				modal={showMapNoResultModal}
				toggle={(showMapNoResultModal) => setShowMapNoResultModall(!showMapNoResultModal)}				
				message={"There are no results for this search"}
			/>
		</div>
	)
}

export default ProduceMap
