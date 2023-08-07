import React, { Fragment, useState, useEffect, useContext } from 'react'
import getConfig from 'next/config'
import { Col, Media, Row, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import FavouriteProduceDetail from '../../../../../components/modals/FavouriteProduceBuyer'
import { getCurrentMonthName, getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import UserPermissionModal from '../../../../../components/modals/UserPermission'
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5'
import { GrLocation } from 'react-icons/gr'
import vars from '../../../../../helpers/utils/vars'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import { isEmpty } from '../../../../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const seasonMsg = `No info available for current season`
const infoUnavailableMsg = `Information Unavailable`

const ProduceList = ({ favourites, filter, sellers, usersProduces, pricinglogs }) => {
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'

	const [showDetailsModal, setDetailsModal] = useState(false)
	const [selectedProduce, setSelectedProduce] = useState(null)
	const [selectedPrice, setSelectedPrice] = useState(null)

	const [showPermissionModal, setShowPermissionModal] = useState(false)
	const [message, setMessage] = useState('')

	const [followLoading, setFollowLoading] = useState([])
	const [modal, setModal] = useState(false)

	// adding seller data to user's produce item
	const produces = usersProduces.map((produce) => {
		const seller_data = sellers.find((s) => String(s.numeric_id) === String(produce.userISbb_agrix_usersID))
		const seller = seller_data ?? null
		return { ...produce, seller: seller, favourite_id: null }
	})
	// removing favourites produces from users_produces
	const initProduces = []
	for (let produce of produces) {
		const favourite = favourites.find(
			(f) => String(f.fav_produceISbb_agrix_users_produceID) === String(produce.numeric_id)
		)
		if (!favourite) {
			initProduces.push(produce)
		}
	}

	const initFavourites = favourites.map((favourite) => {
		const user_produce =
			usersProduces.find((up) => String(up.numeric_id) === String(favourite.fav_produceISbb_agrix_users_produceID)) ||
			{}
		const seller_data = sellers.find((s) => String(s.numeric_id) === String(user_produce?.userISbb_agrix_usersID))
		const seller = seller_data ?? null
		return { ...user_produce, seller: seller, favourite_id: favourite._id }
	})

	// the variable for handling the real produces disaplyed via search result
	const [filteredProduces, setFilteredProduces] = useState([])
	const [favouriteProduces, setFavouriteProduces] = useState([])

	// the variable for handling the fundamental produces for search
	const [nonFavProduces, setNonFavProduces] = useState([])
	const [favProduces, setFavProduces] = useState([])

	useEffect(() => {
		if (filter.country || filter.region || filter.city || filter.produce || filter.type) {
			setModal(true)
		}
		let temp_produces = [...nonFavProduces]
		// let temp_favourites = [...favProduces]
		if (filter.country) {
			temp_produces = temp_produces.filter((temp) => temp.seller?.countryISbb_agrix_countriesID === filter.country)
			// temp_favourites = temp_favourites.filter((temp) => temp.seller?.countryISbb_agrix_countriesID === filter.country)
		}
		if (filter.region) {
			temp_produces = temp_produces.filter((temp) => temp.seller?.regionISbb_agrix_countriesID === filter.region)
			// temp_favourites = temp_favourites.filter((temp) => temp.seller?.regionISbb_agrix_countriesID === filter.region)
		}
		if (filter.city) {
			temp_produces = temp_produces.filter((temp) => temp.seller?.cityISbb_agrix_countriesID === filter.city)
			// temp_favourites = temp_favourites.filter((temp) => temp.seller?.cityISbb_agrix_countriesID === filter.city)
		}
		if (filter.produce) {
			temp_produces = temp_produces.filter(
				(temp) => temp.produce_sub_categoryISbb_agrix_produce_typesID === filter.produce
			)
			// temp_favourites = temp_favourites.filter(
			// 	(temp) => temp.produce_sub_categoryISbb_agrix_produce_typesID === filter.produce
			// )
		}
		if (filter.type) {
			temp_produces = temp_produces.filter((temp) => temp.produce_typeISbb_agrix_produce_typesID === filter.type)
			// temp_favourites = temp_favourites.filter((temp) => temp.produce_typeISbb_agrix_produce_typesID === filter.type)
		}
		// if (filter.month !== "") {
		//   temp_produces = temp_produces.filter(temp=>temp. === filter.month)
		// }
		// setFavouriteProduces(temp_favourites)
		setFilteredProduces(temp_produces)

		// const loadings = [...temp_favourites, ...temp_produces].map((item) => {
		// 	return false
		// })
		const loadings = temp_produces.map((item) => {
			return false
		})
		setFollowLoading(loadings)
	}, [filter])

	useEffect(() => {
		setFavouriteProduces(initFavourites)
		setFavProduces(initFavourites)
		setNonFavProduces(initProduces)

		const loadings = initFavourites.map((item) => {
			return false
		})
		setFollowLoading(loadings)
	}, [])

	const callPermissionLimit = () =>
		onAuthModalsTriggered('Permission', '', {
			backButton: true,
			message: 'Oops. You need to upgrade your subscription to follow more produce!',
		})

	const onFollowingClicked = async (e, produce, idx) => {
		e.stopPropagation()

		let formData = getFormClient()

		if (produce.favourite_id) {
			formData.append('api_method', 'delete_users_favourites')
			formData.append('_id', produce.favourite_id)
		} else {
			if (isBlueUser) {
				// Blue
				if (favProduces.length >= 2) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Gold') {
				if (favProduces.length >= 5) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Platinum') {
				if (favProduces.length >= 20) {
					return callPermissionLimit()
				}
			}
			formData.append('api_method', 'add_users_favourites')
			formData.append('userISbb_agrix_usersID', user._id)
			formData.append('fav_produceISbb_agrix_users_produceID', produce.numeric_id)
		}
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)

		let loadings = followLoading.map((load, i) => {
			if (i === idx) return true
			return false
		})

		setFollowLoading(loadings)

		try {
			const response = await post(apiUrl, formData)

			loadings = followLoading.map((load) => {
				return false
			})
			setFollowLoading(loadings)

			if (response.data.message === 'SUCCESS') {
				const favourite_item = response.data.item
				updateProduces(produce, favourite_item)
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	const updateProduces = (produce, favourite_item) => {
		if (produce.favourite_id) {
			const newFavouriteProduces = favouriteProduces.filter((favProd) => favProd._id !== produce._id)
			setFavouriteProduces(newFavouriteProduces)
			const newFavProduces = favProduces.filter((favProd) => favProd._id !== produce._id)
			setFavProduces(newFavProduces)
			setFilteredProduces([...filteredProduces, ...[Object.assign({}, produce, { favourite_id: null })]])
			setNonFavProduces([...nonFavProduces, ...[Object.assign({}, produce, { favourite_id: null })]])
			setSelectedProduce((prevData) => Object.assign({}, prevData, produce, { favourite_id: null }))
		} else {
			const newNonFavProduces = nonFavProduces.filter((nonFavProd) => nonFavProd._id !== produce._id)
			setNonFavProduces(newNonFavProduces)
			const newFilteredProduces = filteredProduces.filter((filteredProd) => filteredProd._id !== produce._id)
			setFilteredProduces(newFilteredProduces)
			setFavouriteProduces([
				...favouriteProduces,
				...[Object.assign({}, produce, { favourite_id: favourite_item._id })],
			])
			setFavProduces([...favProduces, ...[Object.assign({}, produce, { favourite_id: favourite_item._id })]])
			setSelectedProduce((prevData) => Object.assign({}, prevData, produce, { favourite_id: favourite_item._id }))
		}
	}

	const onProduceClicked = (value, price) => {
		setDetailsModal(true)
		setSelectedProduce(value)
		setSelectedPrice(price)
	}

	const onModalFollowClicked = (e, produce) => {
		onFollowingClicked(e, produce)
	}

	const renderItem = (data, idx, className = 'col-md-4') => {
		let company_name = ''
		let country_name = ''
		let region_name = ''
		let city_name = ''

		if (data.seller) {
			company_name = data.seller.company ?? ''
			country_name = data.seller.countryISbb_agrix_countriesID_data
				? data.seller.countryISbb_agrix_countriesID_data.name
				: ''
			region_name = data.seller.regionISbb_agrix_countriesID_data
				? data.seller.regionISbb_agrix_countriesID_data.name
				: ''
			city_name = data.seller.cityISbb_agrix_countriesID_data ? data.seller.cityISbb_agrix_countriesID_data.name : ''
		}

		const type_name = data.produce_typeISbb_agrix_produce_typesID_data
			? data.produce_typeISbb_agrix_produce_typesID_data.name
			: ''
		const size_name = data.sizeISbb_agrix_produce_sizesID_data ? data.sizeISbb_agrix_produce_sizesID_data.name : ''

		const farming_name = data.farming_methodISbb_agrix_produce_farming_methodID_data
			? data.farming_methodISbb_agrix_produce_farming_methodID_data.name
			: ''

		const pricing = pricinglogs.find((price) => price.produceISbb_agrix_users_produceID === data.numeric_id)
		const price = pricing ? parseFloat(pricing.priceNUM).toFixed(2) : ''
		let loc = country_name + ' ' + region_name + ' ' + city_name
		loc = loc ? loc.trim() : ''

		const hs = data.produce_harvest_season ? JSON.parse(data.produce_harvest_season) : []
		const ss = data.produce_storage_season ? JSON.parse(data.produce_storage_season) : []
		const us = data.produce_unavaliable_season ? JSON.parse(data.produce_unavaliable_season) : []
		const currentMonth = getCurrentMonthName()
		let seasonValue = seasonMsg
		if (hs.includes(currentMonth)) {
			seasonValue = `Harvest Season (${hs.join(', ')})`
		} else if (ss.includes(currentMonth)) {
			seasonValue = `Storage Season (${ss.join(', ')})`
		} else if (us.includes(currentMonth)) {
			seasonValue = `Unavailable Season (${us.join(', ')})`
		}
		const __type = data.produce_typeISbb_agrix_produce_typesID_data?.name || infoUnavailableMsg
		const __name = data.produce_sub_categoryISbb_agrix_produce_typesID_data?.name || infoUnavailableMsg

		return (
			<div className={`${className} mb-3`} key={data._id}>
				<a href='#'
					className='linkCursor'
					onClick={() => onProduceClicked({ ...data, __name, __type, seasonValue, __pricing: pricing }, price)}
				>
					<div
						style={{
							position: 'relative',
							borderRadius: 5,
							boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
						}}
					>
						<div className={`collection-banner`} style={{ position: 'relative' }}>
							<div className='img-part'>
								<Media
									src={contentsUrl + data.produce_imageISfile}
									className='img-fluid-ads'
									alt={'produce'}
									height='220px'
									width='280px'
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
								{__type}
							</div>
							<div
								style={{
									position: 'absolute',
									top: 10,
									right: 10,
									borderRadius: '100%',
									backgroundColor: '#fff',
									height: 30,
									width: 30,
								}}
								className='d-flex align-items-center justify-content-center'
							>
								<div
									className='d-flex align-items-center justify-content-center'
									style={data.favourite_id ? { height: 25 } : { color: 'gray', height: 25 }}
								>
									{followLoading[idx] ? (
										<span className='spinner-border text-success m-0 p-0' style={{ width: 20, height: 20 }} />
									) : (
										<div
											className='d-flex align-items-center justify-content-center'
											onClick={(e) => onFollowingClicked(e, data, idx)}
										>
											{data.favourite_id ? <IoHeartSharp size={25} /> : <IoHeartOutline size={25} />}
										</div>
									)}
								</div>
							</div>
						</div>
						<div className='p-3 produce-info'>
							<h5 style={{ fontWeight: 'bold' }}>{__name}</h5>

							<h6 className='pl-0 mb-1'>Type: {type_name || infoUnavailableMsg}</h6>
							<h6 className='pl-0 mb-1'>Size: {size_name || infoUnavailableMsg}</h6>
							<h6 className='pl-0 mb-1'>
								Packaging: {data.packaging_weightISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg},{' '}
								{data.packagingISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg}
							</h6>
							<h6 className='pl-0 mb-1'>Farming Method: {farming_name || infoUnavailableMsg}</h6>
							<h6 className='pl-0 mb-1'>Current Season: {seasonValue}</h6>
							<hr className='my-2' />
							<div style={{ fontSize: 18, fontWeight: 'bold' }}>Price: {price ? `$${price}` : infoUnavailableMsg}</div>
							{pricing ? (
								<h5 style={{ fontWeight: 500, fontSize: 14 }}>
									Price Valid From: {pricing.from_date ? `${pricing.from_date.split(' ')[0]} to ` : ''}
									{pricing.to_date ? pricing.to_date.split(' ')[0] : ''}
									{/* {pricing && isInDateRange(pricing.from_date, pricing.to_date) ? 'Yes' : 'No'} */}
								</h5>
							) : (
								<h5 style={{ fontWeight: 500, fontSize: 14 }}>Price Valid From: {infoUnavailableMsg}</h5>
							)}
							{loc && (
								<ARow className='mt-2' align='middle' wrap={false}>
									<ACol style={{ minWidth: 30 }}>
										<GrLocation size={20} style={{ verticalAlign: 'middle' }} />
									</ACol>
									<ACol flex={1}>
										<h6 className='m-0 p-0'>{loc}</h6>
									</ACol>
								</ARow>
							)}
							<hr className='my-2' />
							<div className='d-flex justify-content-between align-items-center'>
								<div></div>
								<div>
									<Button>View Detail</Button>
								</div>
							</div>
						</div>
					</div>
				</a>
			</div>
		)
	}

	// const list = [...favouriteProduces, ...filteredProduces]

	return (
		<Fragment>
			<div className='ratio_45 section-b-space'>
				{isEmpty(favouriteProduces) ? (
					<h3 className='text-center my-5'>You do not have any favourite yet, start searching above to find some!</h3>
				) : (
					<>
						<Row className='partition4 mb-2'>
							<Col md='12'>
								<h5 className='f-w-600 mb-2'>My Favourite Produce</h5>
							</Col>
						</Row>
						<Row>{favouriteProduces.map((data, idx) => renderItem(data, idx))}</Row>
					</>
				)}
			</div>

			<Modal centered isOpen={modal} toggle={() => setModal(false)} className='modal-lg'>
				<ModalHeader toggle={() => setModal(false)}>Search Results</ModalHeader>
				<ModalBody>
					<Row className='m-4'>{filteredProduces.map((data, idx) => renderItem(data, idx, 'col-md-6', true))}</Row>
					{isEmpty(filteredProduces) && (
						<h3 className='text-center mb-5'>There are no results for that search, try something else!</h3>
					)}
				</ModalBody>
			</Modal>

			<FavouriteProduceDetail
				modal={showDetailsModal}
				onToggle={(showDetailsModal) => setDetailsModal(!showDetailsModal)}
				selectedProduce={selectedProduce}
				selectedPrice={selectedPrice}
				onFollowClicked={onModalFollowClicked}
				pricingLogs={pricinglogs}
				usersProduce={usersProduces}
			/>
			<UserPermissionModal
				modal={showPermissionModal}
				onToggle={() => setShowPermissionModal(!showPermissionModal)}
				message={message}
				isBack={false}
			/>
		</Fragment>
	)
}

export default ProduceList
