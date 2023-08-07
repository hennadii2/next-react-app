import React, { useEffect, useState, useContext } from 'react'
import getConfig from 'next/config'
import Chart from 'react-google-charts'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import { AuthContext } from '../../helpers/auth/AuthContext'
import PriceLineGraph from '../../pages/layouts/Agri/components/PriceLineGraph'
import SeasonalPieChart from '../../pages/layouts/Agri/components/SeasonalPieChart'
import { Col, Row } from 'antd-grid-layout'
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5'
import { MdLocationOn } from 'react-icons/md'
import { GrUserManager } from 'react-icons/gr'
import { BsTag } from 'react-icons/bs'
import vars from '../../helpers/utils/vars'
import { getCurrentMonthName } from '../../services/constants'

const infoUnavailableMsg = `Information Unavailable`
const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const boxStyles = {
	borderRadius: 3,
	boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
}

const ProduceDetailsModal = ({
	modal,
	onToggle,
	selectedProduce,
	selectedPrice,
	pricingLogs,
	usersProduce,
	onFollowClicked,
	showFollowButton = true,
}) => {
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const seasonMsg = `No info available for current season`

	const [companyName, setCompanyName] = useState('')
	const [sellerName, setSellerName] = useState('')
	const [locationName, setLocationName] = useState('')
	const [typeName, setTypeName] = useState('')
	const [sizeName, setSizeName] = useState('')
	const [packagingName, setPackagingName] = useState('')
	const [farmingName, setFarmingName] = useState('')
	const [seasonName, setSeasonName] = useState('')
	const [imgUrl, setImgUrl] = useState('')
	const [favouriteId, setFavouriteId] = useState('')
	const [lineChartData, setLineChartData] = useState([])
	const [loading, setLoading] = useState(false)

	const [idForGraph, setIdForGraph] = useState('')

	useEffect(() => {
		if (selectedProduce) {
			setInitValues(selectedProduce)
			setLoading(false)
			setIdForGraph(selectedProduce.numeric_id)
		}
	}, [selectedProduce])

	const setInitValues = (selectedProduce) => {
		let company_name = ''
		let seller_name = ''
		let country_name = ''
		let region_name = ''
		let city_name = ''
		if (selectedProduce.seller) {
			company_name = selectedProduce.seller.company ?? ''
			country_name = selectedProduce.seller.countryISbb_agrix_countriesID_data
				? selectedProduce.seller.countryISbb_agrix_countriesID_data.name
				: ''
			region_name = selectedProduce.seller.regionISbb_agrix_countriesID_data
				? selectedProduce.seller.regionISbb_agrix_countriesID_data.name
				: ''
			city_name = selectedProduce.seller.cityISbb_agrix_countriesID_data
				? selectedProduce.seller.cityISbb_agrix_countriesID_data.name
				: ''
			seller_name = (selectedProduce.seller.first_name ?? '') + ' ' + (selectedProduce.seller.last_name ?? '')
		}

		const type_name = selectedProduce.produce_typeISbb_agrix_produce_typesID_data
			? selectedProduce.produce_typeISbb_agrix_produce_typesID_data.name
			: ''
		const size_name = selectedProduce.sizeISbb_agrix_produce_sizesID_data
			? selectedProduce.sizeISbb_agrix_produce_sizesID_data.name
			: ''
		const packaging_name = selectedProduce.packagingISbb_agrix_produce_packagingID_data
			? selectedProduce.packagingISbb_agrix_produce_packagingID_data.name
			: ''
		const farming_name = selectedProduce.farming_methodISbb_agrix_produce_farming_methodID_data
			? selectedProduce.farming_methodISbb_agrix_produce_farming_methodID_data.name
			: ''
		const season_name = selectedProduce.produce_storage_season
			? JSON.parse(selectedProduce.produce_storage_season).join(',')
			: ''

		setCompanyName(company_name)
		setSellerName(seller_name)
		setLocationName(country_name + region_name + city_name)
		setTypeName(type_name)
		setSizeName(size_name)
		setPackagingName(packaging_name)
		setFarmingName(farming_name)
		setSeasonName(season_name)
		setImgUrl(contentsUrl + selectedProduce.produce_imageISfile)
		setFavouriteId(selectedProduce.favourite_id)
	}

	if (!selectedProduce) return null
	const { __pricing, __name } = selectedProduce
	const hs = selectedProduce.produce_harvest_season ? JSON.parse(selectedProduce.produce_harvest_season) : []
	const ss = selectedProduce.produce_storage_season ? JSON.parse(selectedProduce.produce_storage_season) : []
	const us = selectedProduce.produce_unavaliable_season ? JSON.parse(selectedProduce.produce_unavaliable_season) : []
	const currentMonth = getCurrentMonthName()
	let seasonValue = seasonMsg
	if (hs.includes(currentMonth)) {
		seasonValue = `Harvest Season (${hs.join(', ')})`
	} else if (ss.includes(currentMonth)) {
		seasonValue = `Storage Season (${ss.join(', ')})`
	} else if (us.includes(currentMonth)) {
		seasonValue = `Unavailable Season (${us.join(', ')})`
	}

	return (
		<Modal centered isOpen={modal} toggle={onToggle} className='modal-lg'>
			<ModalHeader toggle={onToggle}>{__name}</ModalHeader>
			<ModalBody className='mx-4'>
				<div className='my-4'>
					<div style={{ ...boxStyles }} className='px-4 py-3'>
						<Row gutter={[20, 20]}>
							<Col span={24} md={12}>
								<div style={{ position: 'relative' }}>
									<img
										src={imgUrl}
										className='img-fluid-ads'
										style={{
											objectFit: 'cover',
											width: '100%',
											maxHeight: '350px',
											borderRadius: 10,
										}}
										alt={'produce'}
									/>
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
										{selectedProduce.produce_typeISbb_agrix_produce_typesID_data?.name || infoUnavailableMsg}
									</div>
								</div>
							</Col>
							<Col span={24} md={12}>
								<Row justify='space-between' gutter={[10, 10]}>
									<Col>
										<h5 className='f-w-600'>{companyName || infoUnavailableMsg}</h5>
									</Col>
									<Col>
										{user.role === 'buyer' && showFollowButton && (
											<Button
												onClick={(e) => {
													setLoading(true)
													onFollowClicked(e, selectedProduce)
													setTimeout(() => {
														setLoading(false)
													}, 2000)
												}}
												disabled={loading}
												color={favouriteId ? 'success' : 'secondary'}
												className='d-flex justify-content-center align-items-center'
											>
												{loading ? (
													<span className='spinner-border text-success' style={{ width: 20, height: 20 }} />
												) : (
													<>{favouriteId ? <IoHeartSharp size={22} /> : <IoHeartOutline size={22} />}</>
												)}

												<span className='ml-2'>{favouriteId ? 'Unfollow' : 'Follow'}</span>
											</Button>
										)}
									</Col>
								</Row>

								<h5 className='d-flex align-items-center'>
									<GrUserManager className='mr-2' />
									{sellerName || infoUnavailableMsg}
								</h5>
								<h5 className='d-flex align-items-center'>
									<MdLocationOn className='mr-2' />
									{locationName || infoUnavailableMsg}
								</h5>
								<hr />
								<h5
									className='d-flex align-items-center'
									style={{ color: vars.primaryColor, fontSize: 18, fontWeight: 'bold' }}
								>
									<BsTag className='mr-2' />
									{selectedPrice ? `$${selectedPrice}` : infoUnavailableMsg}
								</h5>
								{__pricing ? (
									<h5 style={{ fontWeight: 500, fontSize: 14 }}>
										Price Valid From: {__pricing.from_date ? `${__pricing.from_date.split(' ')[0]} to ` : ''}
										{__pricing.to_date ? __pricing.to_date.split(' ')[0] : ''}
										{/* {__pricing && isInDateRange(__pricing.from_date, __pricing.to_date) ? 'Yes' : 'No'} */}
									</h5>
								) : (
									<h5 style={{ fontWeight: 500, fontSize: 14 }}>Price Valid From: {infoUnavailableMsg}</h5>
								)}
							</Col>
						</Row>
					</div>

					<div style={{ ...boxStyles }} className='mt-4'>
						<Row gutter={[20, 20]} className='mx-4 py-3'>
							<Col span={24} md={12}>
								<h6 className='pl-0 mb-1'>Size: {sizeName || infoUnavailableMsg}</h6>
								<h6 className='pl-0 mb-1 mt-3'>
									Packaging:{' '}
									{selectedProduce.packaging_weightISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg},{' '}
									{selectedProduce.packagingISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg}
								</h6>
							</Col>
							<Col span={24} md={12}>
								<h6 className='pl-0 mb-1'>Farming Method: {farmingName || infoUnavailableMsg}</h6>
								<h6 className='pl-0 mb-1 mt-3'>Current Season: {seasonValue}</h6>
							</Col>
						</Row>
					</div>

					<div className='mt-4' style={{ ...boxStyles }}>
						<PriceLineGraph
							numeric_id={idForGraph}
							pricelogs={pricingLogs}
							graphTitle='Line Graph Showing Price Changes Over 12 Months'
						/>
					</div>
					<div className='mt-4' style={{ ...boxStyles }}>
						<SeasonalPieChart numeric_id={idForGraph} usersProduce={usersProduce} graphTitle='Produce Seasonal Chart' />
					</div>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default ProduceDetailsModal
