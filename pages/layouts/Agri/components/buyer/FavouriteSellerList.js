import React, { Fragment, useState, useEffect, useContext } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { Col, Media, Row, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import UserPermissionModal from '../../../../../components/modals/UserPermission'
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5'
import { MdLocationOn } from 'react-icons/md'
import PlaceholderImage from '../../../../../public/assets/images/placeholder.webp'
import { isEmpty, getValidUrl } from '../../../../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const SellerList = ({ favourites, filter, sellers, usersProduce }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'

	const [showPermissionModal, setShowPermissionModal] = useState(false)
	const [message, setMessage] = useState('')
	const [modal, setModal] = useState(false)

	const [followLoading, setFollowLoading] = useState([])

	// The variable for handling the real data displayed through search
	const [filteredSellers, setFilteredSellers] = useState([])
	const [favouriteSellers, setFavouriteSellers] = useState([])

	// the variable for handling the fundamental data for search
	const [nonFavSellers, setNonFavSellers] = useState([])
	const [favSellers, setFavSellers] = useState([])

	// removing favourite sellers from s
	const initSellers = []
	const initFavourites = []
	for (let seller of sellers) {
		const favourite = favourites.find((f) => f.fav_userISbb_agrix_usersID === seller.numeric_id)
		const user_produce = usersProduce.filter((produce) => produce.userISbb_agrix_usersID === seller.numeric_id)
		if (!favourite) {
			initSellers.push({
				...seller,
				favourite_id: null,
				produce: user_produce,
			})
		} else {
			initFavourites.push({
				...seller,
				favourite_id: favourite._id,
				produce: user_produce,
			})
		}
	}

	useEffect(() => {
		if (filter.country || filter.region || filter.city || filter.seller || filter.category) {
			setModal(true)
		}
		let temp_sellers = [...nonFavSellers]
		// let temp_favourites = [...favSellers]
		if (filter.country) {
			temp_sellers = temp_sellers.filter((temp) => temp.countryISbb_agrix_countriesID === filter.country)
			// temp_favourites = temp_favourites.filter((temp) => temp.countryISbb_agrix_countriesID === filter.country)
		}
		if (filter.region) {
			temp_sellers = temp_sellers.filter((temp) => temp.regionISbb_agrix_countriesID === filter.region)
			// temp_favourites = temp_favourites.filter((temp) => temp.regionISbb_agrix_countriesID === filter.region)
		}
		if (filter.city) {
			temp_sellers = temp_sellers.filter((temp) => temp.cityISbb_agrix_countriesID === filter.city)
			// temp_favourites = temp_favourites.filter((temp) => temp.cityISbb_agrix_countriesID === filter.city)
		}
		// if (filter.seller) {
		// 	temp_sellers = temp_sellers.filter(
		// 		(temp) =>
		// 			temp.first_name.toLowerCase().includes(filter.seller.toLowerCase()) ||
		// 			temp.last_name.toLowerCase().includes(filter.seller.toLowerCase())
		// 	)
		// }

		if (filter.seller) {
			temp_sellers = temp_sellers.filter(
				(temp) =>
				temp.company && temp.company.toLowerCase().includes(filter.seller.toLowerCase())
			)
		}

		if (filter.category) {
			temp_sellers = temp_sellers.filter((temp) => {
				const category = temp.produce.find(
					(prod) => prod.produce_categoryISbb_agrix_produce_typesID === filter.category
				)
				if (category) return true
				return false
			})
			// temp_favourites = temp_favourites.filter((temp) => {
			// 	const category = temp.produce.find(
			// 		(prod) => prod.produce_categoryISbb_agrix_produce_typesID === filter.category
			// 	)
			// 	if (category) return true
			// 	return false
			// })
		}
		// setFavouriteSellers(temp_favourites)
		setFilteredSellers(temp_sellers)

		// const loadings = [...temp_favourites, ...temp_sellers].map((item) => {
		// 	return false
		// })
		const loadings = temp_sellers.map(() => {
			return false
		})
		setFollowLoading(loadings)
	}, [filter])

	useEffect(() => {
		setFavouriteSellers(initFavourites)
		setFavSellers(initFavourites)
		setNonFavSellers(initSellers)
		const loadings = initFavourites.map((item) => {
			return false
		})
		setFollowLoading(loadings)
	}, [])

	const callPermissionLimit = () =>
		onAuthModalsTriggered('Permission', '', {
			backButton: true,
			message: 'Oops. You need to upgrade your subscription to follow more sellers!',
		})

	const onFollowingClicked = async (e, seller, idx) => {
		e.stopPropagation()
		let formData = getFormClient()

		if (seller.favourite_id) {
			formData.append('api_method', 'delete_users_favourites')
			formData.append('_id', seller.favourite_id)
		} else {
			if (isBlueUser) {
				// Blue
				if (favSellers.length >= 1) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Gold') {
				if (favSellers.length >= 5) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Platinum') {
				if (favSellers.length >= 20) {
					return callPermissionLimit()
				}
			}

			formData.append('api_method', 'add_users_favourites')
			formData.append('userISbb_agrix_usersID', user._id)
			formData.append('fav_userISbb_agrix_usersID', seller._id)
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
				if (seller.favourite_id) {
					const newFavouriteSellers = favouriteSellers.filter((favSeller) => favSeller._id !== seller._id)
					setFavouriteSellers(newFavouriteSellers)
					const newFavSellers = favSellers.filter((favSeller) => favSeller._id !== seller._id)
					setFavSellers(newFavSellers)
					setFilteredSellers([...filteredSellers, ...[Object.assign({}, seller, { favourite_id: null })]])
					setNonFavSellers([...nonFavSellers, ...[Object.assign({}, seller, { favourite_id: null })]])
				} else {
					const favourite_item = response.data.item
					const newNonFavSellers = nonFavSellers.filter((nonFavSeller) => nonFavSeller._id !== seller._id)
					setNonFavSellers(newNonFavSellers)
					const newFilteredSellers = filteredSellers.filter((filteredSeller) => filteredSeller._id !== seller._id)
					setFilteredSellers(newFilteredSellers)
					setFavouriteSellers([
						...favouriteSellers,
						...[Object.assign({}, seller, { favourite_id: favourite_item._id })],
					])
					setFavSellers([...favSellers, ...[Object.assign({}, seller, { favourite_id: favourite_item._id })]])
				}
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	const onSellerClicked = (value, newWindow = false) => {
		const url = getValidUrl(`/seller/detail/${value.numeric_id}/${value.name}`)
		if (newWindow) {
			window.open(url)
		} else {
			router.push(url)
		}
	}

	const renderItem = (data, idx, className = 'col-md-4', newWindow = false) => {
		const country_name = data.countryISbb_agrix_countriesID_data ? data.countryISbb_agrix_countriesID_data.name : ''
		const region_name = data.regionISbb_agrix_countriesID_data ? data.regionISbb_agrix_countriesID_data.name : ''
		const city_name = data.cityISbb_agrix_countriesID_data ? data.cityISbb_agrix_countriesID_data.name : ''
		let produce_names = []
		for (let prod of data.produce) {
			if (prod.produce_categoryISbb_agrix_produce_typesID_data) {
				const produceName = prod.produce_categoryISbb_agrix_produce_typesID_data.name
				const produce = produce_names.find((name) => name === produceName)
				if (!produce) produce_names.push(produceName)
			}
		}

		const imgUrl = data.companylogoISfile ? contentsUrl + data.companylogoISfile : PlaceholderImage

		return (
			<div className={`${className} mb-3`} key={data._id}>
				<a href='#' className='linkCursor' onClick={() => onSellerClicked(data, newWindow)}>
					<div
						style={{
							position: 'relative',
							borderRadius: 5,
							boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
						}}
					>
						<div className={`collection-banner`}>
							<div className='img-part'>
								<Media
									src={imgUrl}
									className='img-fluid-ads'
									alt='seller'
									height='220px'
									width='280px'
									style={{ objectFit: 'contain', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
								/>
							</div>
						</div>
						<div className='p-3 produce-info'>
							<div
								className='d-flex'
								style={
									data.favourite_id
										? { justifyContent: 'flex-end', height: 25 }
										: { color: 'gray', justifyContent: 'flex-end', height: 25 }
								}
							>
								{followLoading[idx] ? (
									<div className='d-flex justify-content-end'>
										<span className='spinner-border text-success m-0 p-0' style={{ width: 20, height: 20 }} />
									</div>
								) : (
									<div style={{ textAlign: 'right' }} onClick={(e) => onFollowingClicked(e, data, idx)}>
										{data.favourite_id ? <IoHeartSharp size={25} /> : <IoHeartOutline size={25} />}
									</div>
								)}
							</div>
							<h5 className='f-w-600 mb-1' style={{ fontSize: 18 }}>
								{data.company ?? ''}
							</h5>
							<h5 className='f-w-600 mb-2'>{data.first_name + ' ' + data.last_name}</h5>
							<h6 className='pl-0 mb-1 d-flex align-items-center'>
								<MdLocationOn className='mr-2' />
								{country_name + ' ' + region_name + ' ' + city_name}
							</h6>
							<h6 className='pl-0 mb-1'>Produce: {produce_names.join(', ')}</h6>
							<hr className='my-2' />
							<div className='d-flex justify-content-between'>
								<div />
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

	// const list = [...favouriteSellers, ...filteredSellers]
	return (
		<Fragment>
			<div className='ratio_45 section-b-space'>
				<>
					{isEmpty(favouriteSellers) ? (
						<h3 className='text-center my-5'>
							You do not have any favourites yet, start searching above to find some!
						</h3>
					) : (
						<>
							<Row className='partition4 mb-2'>
								<Col md='12'>
									<h5 className='f-w-600 mb-2'>My Favourite Sellers</h5>
								</Col>
							</Row>
							<Row>{favouriteSellers.map((data, idx) => renderItem(data, idx))}</Row>
						</>
					)}
				</>
			</div>
			<UserPermissionModal
				modal={showPermissionModal}
				onToggle={() => setShowPermissionModal(!showPermissionModal)}
				message={message}
				isBack={false}
			/>

			<Modal centered isOpen={modal} toggle={() => setModal(false)} className='modal-lg'>
				<ModalHeader toggle={() => setModal(false)}>Search Results</ModalHeader>
				<ModalBody>
					<Row className='m-4'>{filteredSellers.map((data, idx) => renderItem(data, idx, 'col-md-6', true))}</Row>
					{isEmpty(filteredSellers) && (
						<h3 className='text-center my-5'>There are no results for that search, try something else!</h3>
					)}
				</ModalBody>
			</Modal>
		</Fragment>
	)
}

export default SellerList
