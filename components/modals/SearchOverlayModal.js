import React, { useEffect, useContext, useState, Fragment } from 'react'
import getConfig from 'next/config'
import { Modal, ModalBody, Row, Col, Label, Container, Media } from 'reactstrap'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import { useRouter } from 'next/router'
import { AuthContext } from '../../helpers/auth/AuthContext'
import BuyerReportDetail from './BuyerReportSeller'
import UserPermission from './UserPermission'
import { GrLocation } from 'react-icons/gr'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import PlaceholderImage from '../../public/assets/images/placeholder.webp'
import vars from '../../helpers/utils/vars'
import { getValidUrl } from '../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`
const infoUnavailableMsg = `Information Unavailable`

const cardStyles = {
	position: 'relative',
	borderRadius: 5,
	boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
}

const SearchOverlay = ({ isShow, onToggle, searchParams }) => {
	const router = useRouter()
	// console.log({ searchParams })
	const { searchText, id, country } = searchParams

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const [sellers, setSellers] = useState([])
	const [buyers, setBuyers] = useState([])
	const [produces, setProduces] = useState([])
	const [categoryIds, setCategoryIds] = useState([])
	const [subCategoryIds, setSubCategoryIds] = useState([])
	const [noResult, setNoResult] = useState(false)

	const [showBuyerModal, setShowBuyerModal] = useState(false)
	const [showRoleModal, setShowRoleModal] = useState(false)
	const [selectedBuyer, setSelectedBuyer] = useState({})

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const getProduceTypes = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_produce_types')
			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					const result = response.data.list

					const categories = result.filter((item) => item.refers_toISbb_agrix_produce_typesID === null)
					const categoryIds = categories.map((category) => category.numeric_id)
					setCategoryIds(categoryIds)

					let subCategories = []
					for (let catId of categoryIds) {
						const subCats = result.filter((item) => item.refers_toISbb_agrix_produce_typesID === catId)
						subCategories = [...subCategories, ...subCats]
					}
					const subCategoryIds = subCategories.map((sub) => sub.numeric_id)
					setSubCategoryIds(subCategoryIds)
				} else if (response.data.error) {
					alert(response.data.message)
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		getProduceTypes()
	}, [])

	useEffect(() => {
		const getSearchResult = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'search')
			formData.append('search_text', searchText)
			country && formData.append('countryISbb_agrix_countriesID', country)
			if (id) {
				if (typeof id === 'string' || typeof id === 'number') {
					formData.append('produce_typeISbb_agrix_produce_typesID', id)
				} else if (id?.value) {
					formData.append('produce_typeISbb_agrix_produce_typesID', id?.value)
				}
			}
			try {
				setLoading(true)
				const response = await post(apiUrl, formData)
				setLoading(false)
				if (response.data.message === 'SUCCESS') {
					const result = response.data.results
					// console.log(result)
					if (result.sellers.length === 0 && result.buyers.length === 0 && result.produce_list.length === 0) {
						setNoResult(true)
					} else {
						const tempSellers = result.sellers
						const resultSellers = tempSellers.filter(s => s.companylogoISfile && (s.company || s.first_name || s.last_name))
						setSellers(resultSellers)
						setBuyers(result.buyers)
						setProduces(result.produce_list)
					}
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		if (isShow) getSearchResult()
	}, [searchText, id, isShow])

	const openInNewTab = url => {
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	const onSellerClicked = (seller) => {
		const url = getValidUrl(`/seller/detail/${seller.numeric_id}/${seller.company}`)		
		openInNewTab(url)
	}

	const onBuyerClicked = (buyer) => {
		onSearchClosed()

		if (!isAuth) {
			onAuthModalsTriggered('login')
			return
		}
		setSelectedBuyer(buyer)
		setShowBuyerModal(true)
	}

	const onProduceClicked = (produce) => {
		const url = getValidUrl(`/seller/detail/${produce.seller_id}/${produce.company}`)
		openInNewTab(url)
	}

	const onSearchClosed = () => {
		onToggle()
		setNoResult(false)
		setSellers([])
		setBuyers([])
		setProduces([])
		setLoading(false)
	}

	const onUserLimited = () => {
		setShowBuyerModal(false)
		setShowRoleModal(true)
	}

	const getColorStyles = (membership) => {
		const _membership = membership.toLowerCase()
		switch (_membership) {
			case 'diamond':
				return { backgroundColor: '#b9f2ff', color: '#00bcd4' }
			case 'platinum':
				return { backgroundColor: '#E5E4E2', color: '#607d8b' }

			default:
				return { backgroundColor: _membership, color: '#fff' }
		}
	}

	const BuyersEl = (
		<Fragment>
			{buyers.length > 0 && (
				<div className='mt-3'>
					<Label style={{ fontSize: 18, fontWeight: 'bold' }}>Buyers</Label>
					<ARow gutter={[20, 20]}>
						{buyers.map((buyer) => {
							// console.log(buyer)
							const imgUrl = buyer.companylogoISfile ? contentsUrl + '' + buyer.companylogoISfile : PlaceholderImage

							const countryName = buyer.countryISbb_agrix_countriesID_data?.name || ''
							const regionName = buyer.regionISbb_agrix_countriesID_data?.name || ''
							const cityName = buyer.cityISbb_agrix_countriesID_data?.name || ''
							const membership = buyer.membershipISbb_agrix_membership_typesID_data?.name || ''
							const _location = countryName + ' ' + regionName + ' ' + cityName
							const location = _location ? _location.trim() : ''
							const _title = (buyer.first_name || '') + ' ' + (buyer.last_name || '')
							const title = _title ? _title.trim() : infoUnavailableMsg

							return (
								<ACol span={24} md={8} key={buyer.numeric_id}>
									<a href='#' onClick={() => onBuyerClicked(buyer)} style={{ cursor: 'pointer' }}>
										<div className={`collection-banner`} style={cardStyles}>
											<div className='img-part'>
												{membership ? (
													<div
														style={{
															padding: '5px 15px',
															borderRadius: 25,
															position: 'absolute',
															top: 10,
															left: 10,
															zIndex: 9,
															...getColorStyles(membership),
														}}
													>
														{membership}
													</div>
												) : null}
												{imgUrl && (
													<Media
														src={imgUrl}
														className='img-fluid-ads'
														alt={title}
														width='260'
														height='180'
														style={{ objectFit: 'cover' }}
													/>
												)}
											</div>
											<div className='ourseller-info px-3 pb-3'>
												<h5 style={{ fontSize: 18, fontWeight: 'bold' }}>
													{buyer.company || title || infoUnavailableMsg}
												</h5>
												{/* <h5 style={{ fontSize: 16 }}>{title}</h5> */}

												{location && (
													<div className='mt-1' style={{ display: 'flex', alignItems: 'center' }}>
														<GrLocation />
														<h6 className='ml-1'>{location}</h6>
													</div>
												)}
											</div>
										</div>
									</a>
								</ACol>
							)
						})}
					</ARow>
				</div>
			)}
		</Fragment>
	)

	return (
		<Fragment>
			<Modal isOpen={isShow} toggle={onSearchClosed} size='lg' centered>
				<ModalBody className='p-3'>
					<CloseModalBtn onClick={onSearchClosed} />
					<Row>
						<Col md='1'>
							{/* <div style={{ fontSize: 18, cursor: 'pointer' }} onClick={onSearchClosed}>
								<i className='fa fa-arrow-left' aria-hidden='true'></i>
							</div> */}
						</Col>
						<Col md={{ offset: 4, size: 4 }}>
							<Label style={{ fontSize: 18, fontWeight: 'bold' }}>Search Results</Label>
						</Col>
					</Row>
					{loading ? (
						<div className='d-flex justify-content-center align-items-center' style={{ minHeight: 200 }}>
							<span className='spinner-border text-success' style={{ fontSize: 22, width: 50, height: 50 }}></span>
						</div>
					) : (
						<Container
							style={{
								maxHeight: '750px',
								overflow: 'auto',
							}}
						>
							{noResult && (
								<div className='d-flex justify-content-center my-5'>
									<h3 className='font-weight-bold'>Sorry, there is no result.</h3>
								</div>
							)}
							{/* Here was the buyer section */}
							<Fragment>
								{produces.length > 0 && (
									<div className='mt-3'>
										<Label style={{ fontSize: 18, fontWeight: 'bold' }}>Produce Items</Label>
										<ARow gutter={[20, 20]}>
											{produces.map((produce) => {
												const { produce_type_name } = produce
												// console.log(produce)
												const _location =
													(produce.city_name ? `${produce.city_name}, ` : '') +
													(produce.region_name ? `${produce.region_name}, ` : '') +
													(produce.country_name || '')

												const location = _location ? _location.trim() : ''

												return (
													// (categoryIds.includes(produce.numeric_id) || subCategoryIds.includes(produce.numeric_id)) && (
													<ACol span={24} md={8} key={produce.numeric_id}>
														<a href='#' onClick={() => onProduceClicked(produce)} style={{ cursor: 'pointer' }}>
															<div className={`collection-banner`} style={cardStyles}>
																<div className='img-part'>
																	<div
																		style={{
																			padding: '5px 15px',
																			borderRadius: 25,
																			position: 'absolute',
																			top: 10,
																			left: 10,
																			zIndex: 9,
																			backgroundColor: vars.primaryColor,
																			color: '#fff',
																		}}
																	>
																		{produce_type_name || infoUnavailableMsg}
																	</div>
																	<Media
																		src={
																			produce.produce_imageISfile
																				? contentsUrl + produce.produce_imageISfile
																				: PlaceholderImage
																		}
																		className='img-fluid-ads'
																		width='260'
																		height='180'
																		style={{ objectFit: 'cover' }}
																		alt={'produce'}
																	/>
																</div>
																<div className='ourseller-info px-3 pb-3'>
																	<h5 style={{ fontSize: 18, fontWeight: 'bold' }}>
																		{produce.produce_sub_category_name || infoUnavailableMsg}
																	</h5>
																	<h5 style={{ fontSize: 16, fontWeight: 'bold' }}>
																		{produce.company || infoUnavailableMsg}
																	</h5>
																	<div className='mt-1' style={{ display: 'flex', alignItems: 'center' }}>
																		<div className='d-flex align-items-center' style={{ minWidth: 20 }}>
																			<GrLocation />
																		</div>
																		<h6 className='ml-1'>{location || infoUnavailableMsg}</h6>
																	</div>
																</div>
															</div>
														</a>
													</ACol>
													// )
												)
											})}
										</ARow>
									</div>
								)}
							</Fragment>
							<Fragment>
								{sellers.length > 0 && (
									<div className='mt-3'>
										<Label style={{ fontSize: 18, fontWeight: 'bold' }}>Sellers</Label>
										<ARow gutter={[20, 20]}>
											{sellers.map((seller) => {
												// console.log(seller)
												const imgUrl = seller.companylogoISfile
													? contentsUrl + '' + seller.companylogoISfile
													: PlaceholderImage

												const countryName = seller.countryISbb_agrix_countriesID_data?.name || ''
												const regionName = seller.regionISbb_agrix_countriesID_data?.name || ''
												const cityName = seller.cityISbb_agrix_countriesID_data?.name || ''
												const membership = seller.membershipISbb_agrix_membership_typesID_data?.name || ''
												const _location = countryName + ' ' + regionName + ' ' + cityName
												const location = _location ? _location.trim() : ''
												const _title = (seller.first_name || '') + ' ' + (seller.last_name || '')
												const title = _title ? _title.trim() : infoUnavailableMsg

												return (
													<ACol span={24} md={8} key={seller.numeric_id}>
														<a href='#' onClick={() => onSellerClicked(seller)} style={{ cursor: 'pointer' }}>
															<div className={`collection-banner`} style={cardStyles}>
																<div className='img-part'>
																	{membership ? (
																		<div
																			style={{
																				padding: '5px 15px',
																				borderRadius: 25,
																				position: 'absolute',
																				top: 10,
																				left: 10,
																				zIndex: 9,
																				...getColorStyles(membership),
																			}}
																		>
																			{membership}
																		</div>
																	) : null}
																	{imgUrl && (
																		<Media
																			src={imgUrl}
																			className='img-fluid-ads'
																			width='260'
																			height='180'
																			style={{ objectFit: 'contain' }}
																			alt={title}
																		/>
																	)}
																</div>
																<div className='ourseller-info px-3 pb-3'>
																	<h5 style={{ fontSize: 18, fontWeight: 'bold' }}>
																		{seller.company || title || infoUnavailableMsg}
																	</h5>
																	{/* <h5 style={{ fontSize: 16 }}>{title}</h5> */}

																	{location && (
																		<div className='mt-1' style={{ display: 'flex', alignItems: 'center' }}>
																			<GrLocation />
																			<h6 className='ml-1'>{location}</h6>
																		</div>
																	)}
																</div>
															</div>
														</a>
													</ACol>
												)
											})}
										</ARow>
									</div>
								)}
							</Fragment>							
						</Container>
					)}
				</ModalBody>
			</Modal>
			<BuyerReportDetail
				isShow={showBuyerModal}
				onToggle={() => setShowBuyerModal(!showBuyerModal)}
				buyer={selectedBuyer}
				onLimited={onUserLimited}
			/>
			<UserPermission
				modal={showRoleModal}
				onToggle={() => setShowRoleModal(!showRoleModal)}
				message='Your membership does not allow you to view this feature. Please upgrade to continue.'
				isBack={false}
			/>
		</Fragment>
	)
}

export default SearchOverlay
