import React, { Fragment, useContext, useEffect, useState } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { Row, Button, Media } from 'reactstrap'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import { getFormClient, getCurrentMonthName } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import FavouriteProduceDetail from '../../../../../components/modals/FavouriteProduceBuyer'
import UserPermissionModal from '../../../../../components/modals/UserPermission'
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5'
import { GrLocation } from 'react-icons/gr'
import vars from '../../../../../helpers/utils/vars'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import { isEmpty, getValidUrl } from '../../../../../helpers/utils/helpers'


const seasonMsg = `No info available for current season`
const infoUnavailableMsg = `Information Unavailable`

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const FavouriteSellerProduce = ({ seller, usersProduce, usersFavourites, pricingLogs }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget
	const isAuth = authContext.isAuthenticated
	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'

	const [produces, setProduces] = useState([])

	const [showDetailsModal, setDetailsModal] = useState(false)
	const [selectedProduce, setSelectedProduce] = useState(null)
	const [selectedPrice, setSelectedPrice] = useState(null)

	const [showPermissionModal, setShowPermissionModal] = useState(false)
	const [message, setMessage] = useState('')

	const [followLoading, setFollowLoading] = useState([])

	useEffect(() => {
		const produces = usersProduce.map((userProduce) => {
			const favourite = usersFavourites.find(
				(userfavourite) => userfavourite.fav_produceISbb_agrix_users_produceID === userProduce.numeric_id
			)
			if (favourite) return { ...userProduce, favourite_id: favourite._id }
			else return { ...userProduce, favourite_id: null }
		})
		setProduces(produces)

		const loadings = produces.map((produce) => {
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
				if (produces.length >= 2) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Gold') {
				if (produces.length >= 5) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Platinum') {
				if (produces.length >= 20) {
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
				const item = response.data.item
				if (produce.favourite_id) {
					const newProduces = produces.map((prod) => {
						if (prod._id === produce._id) {
							const followingProduce = Object.assign({}, prod, {
								favourite_id: null,
							})
							setSelectedProduce((prevData) => ({ ...prevData, ...followingProduce }))
							return followingProduce
						}
						return prod
					})
					setProduces(newProduces)
				} else {
					const newProduces = produces.map((prod) => {
						if (prod._id === produce._id) {
							const followingProduce = Object.assign({}, prod, {
								favourite_id: item._id,
							})
							setSelectedProduce((prevData) => ({ ...prevData, ...followingProduce }))
							return followingProduce
						}
						return prod
					})
					setProduces(newProduces)
				}
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	const onProduceClicked = (value, price) => {
		if (!isAuth || user.role === 'seller') {
			const url = getValidUrl(`/seller/detail/${seller.numeric_id}/${seller.name}`)
			onTarget(url)
			onAuthModalsTriggered('login')
			return
		}
		
		setDetailsModal(true)
		setSelectedProduce(value)
		setSelectedPrice(price)
	}

	const onModalFollowClicked = (e, produce) => {
		onFollowingClicked(e, produce)
	}

	if (isEmpty(produces)) return null

	return (
		<Fragment>
			<div>
				<h4 className='mb-4-5' style={{ fontWeight: 'bold', fontSize: 20 }}>
					{seller.company} Produce
				</h4>
			</div>
			<Row className='mb-4'>
				{produces.map((data, idx) => {
					let produce_name = ''
					if (data.produce_typeISbb_agrix_produce_typesID_data)
						produce_name = data.produce_typeISbb_agrix_produce_typesID_data.name
					else if (data.produce_sub_categoryISbb_agrix_produce_typesID_data)
						produce_name = data.produce_sub_categoryISbb_agrix_produce_typesID_data.name

					const pricingLog = pricingLogs.find(
						(pricelog) => pricelog.produceISbb_agrix_users_produceID === data.numeric_id
					)?.priceNUM
					const pricing = pricingLogs.find((price) => price.produceISbb_agrix_users_produceID === data.numeric_id)
					const price = pricingLog ? parseFloat(pricingLog).toFixed(2) : ''
					const country_name = data.countryISbb_agrix_countriesID_data
						? data.countryISbb_agrix_countriesID_data.name
						: ''
					const region_name = data.regionISbb_agrix_countriesID_data
						? data.regionISbb_agrix_countriesID_data.name
						: ''
					const city_name = data.cityISbb_agrix_countriesID_data ? data.cityISbb_agrix_countriesID_data.name : ''
					const type_name = data.produce_typeISbb_agrix_produce_typesID_data
						? data.produce_typeISbb_agrix_produce_typesID_data.name
						: ''
					const size_name = data.sizeISbb_agrix_produce_sizesID_data
						? data.sizeISbb_agrix_produce_sizesID_data.name
						: ''
					const packaging_name = data.packagingISbb_agrix_produce_packagingID_data
						? data.packagingISbb_agrix_produce_packagingID_data.name
						: ''
					const farming_name = data.farming_methodISbb_agrix_produce_farming_methodID_data
						? data.farming_methodISbb_agrix_produce_farming_methodID_data.name
						: ''
					const season_name = data.storage_seasonISbb_agrix_produce_seasonsID_data
						? data.storage_seasonISbb_agrix_produce_seasonsID_data.name
						: ''

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
					let loc = country_name + ' ' + region_name + ' ' + city_name
					loc = loc ? loc.trim() : ''

					return (
						<div className='col-md-4 mb-4' key={data._id}>
							<a href='#'
								className='linkCursor'
								onClick={() =>
									onProduceClicked(
										{
											...data,
											seller: data.seller ? data.seller : seller,
											__name,
											__type,
											seasonValue,
											__pricing: pricing,
										},
										price
									)
								}
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
												height='180px'
												width='230px'
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
											{user.role === 'buyer' && (
												<div
													className='d-flex justify-content-center align-items-center'
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
											)}
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
										{user.role === 'buyer' ? (
											<>
												<div style={{ fontSize: 18, fontWeight: 'bold' }}>
													Price: {price ? `$${price}` : infoUnavailableMsg}
												</div>
												{pricing ? (
													<h5 style={{ fontWeight: 500, fontSize: 14 }}>
														Price Valid From: {pricing.from_date ? `${pricing.from_date.split(' ')[0]} to ` : ''}
														{pricing.to_date ? pricing.to_date.split(' ')[0] : ''}
														{/* {pricing && isInDateRange(pricing.from_date, pricing.to_date) ? 'Yes' : 'No'} */}
													</h5>
												) : (
													<h5 style={{ fontWeight: 500, fontSize: 14 }}>Price Valid From: {infoUnavailableMsg}</h5>
												)}
											</>
										) : (
											<div style={{ textAlign: 'center',padding: 20 }}>
												<div style={{ fontSize: 18, color: '#777777', marginBottom: 10}} >
													To view pricing information													
												</div>
												<Button>Login as a Buyer</Button>
											</div>
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
				})}
			</Row>
			<FavouriteProduceDetail
				modal={showDetailsModal}
				onToggle={(showDetailsModal) => setDetailsModal(!showDetailsModal)}
				selectedProduce={selectedProduce}
				selectedPrice={selectedPrice}
				pricingLogs={pricingLogs}
				onFollowClicked={onModalFollowClicked}
				usersProduce={usersProduce}
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

export default FavouriteSellerProduce
