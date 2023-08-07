import React, { Fragment, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Col, Row, Media, Button } from 'reactstrap'
import getConfig from 'next/config'
import Link from 'next/link'
import NoData from '../NoData/NoData'
import { GrLocation } from 'react-icons/gr'
import SettingContext from '../../../../../helpers/theme-setting/SettingContext'
import PlaceholderImage from '../../../../../public/assets/images/placeholder.webp'
import { getCurrentMonthName } from '../../../../../services/constants'
import vars from '../../../../../helpers/utils/vars'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import { isEmpty } from '../../../../../helpers/utils/helpers'
import FavouriteProduceDetail from '../../../../../components/modals/FavouriteProduceBuyer'

const seasonMsg = `No info available for current season`
const infoUnavailableMsg = `Information Unavailable`
const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const DashboardProduce = ({ producesForBuyer, usersProduces, pricinglogs, sellers }) => {
	const router = useRouter()

	const settingContext = useContext(SettingContext)
	const produce_types = settingContext.appData.produce_types

	const [showDetailsModal, setDetailsModal] = useState(false)
	const [selectedProduce, setSelectedProduce] = useState(null)
	const [selectedPrice, setSelectedPrice] = useState(null)

	const produces = producesForBuyer
		.filter((_, index) => index < 3)
		.map((produce) => {
			const others =
				usersProduces.find((x) => String(x.numeric_id) === String(produce.fav_produceISbb_agrix_users_produceID)) || {}
			const seller_data = sellers.find((s) => String(s.numeric_id) === String(others.userISbb_agrix_usersID))
			const seller = seller_data ?? null
			return { ...produce, seller: seller, ...others }
		})

	const onCreate = () => {
		router.push('/buyer/favourite-produce')
	}

	const onFavouriteProducesBtnClicked = () => {
		router.push('/buyer/favourite-produce')
	}

	const onProduceClicked = (value, price) => {
		setDetailsModal(true)
		setSelectedProduce(value)
		setSelectedPrice(price)
	}

	return (
		<Container className='mt-5'>
			<h4 className='f-w-600 mb-4 dashboard-title'>My Latest Favorite Produce</h4>
			{produces.length === 0 ? (
				<NoData
					description='Looks like you have no favourite produce item yet! Click below to discover some.'
					createLabel='Explore Produce'
					onCreate={onCreate}
				/>
			) : (
				<Fragment>
					<Row className='partition4'>
						{produces.map((produce) => {
							const data = produce.fav_produceISbb_agrix_users_produceID_data
								? { ...produce, ...produce.fav_produceISbb_agrix_users_produceID_data }
								: produce

							const _produce = produce_types.find(
								(prod) =>
									prod.numeric_id ===
									produce.fav_produceISbb_agrix_users_produceID_data?.produce_sub_categoryISbb_agrix_produce_typesID
							)

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
								city_name = data.seller.cityISbb_agrix_countriesID_data
									? data.seller.cityISbb_agrix_countriesID_data.name
									: ''
							}

							const type_name = data.produce_typeISbb_agrix_produce_typesID_data
								? data.produce_typeISbb_agrix_produce_typesID_data.name
								: ''
							const size_name = data.sizeISbb_agrix_produce_sizesID_data
								? data.sizeISbb_agrix_produce_sizesID_data.name
								: ''

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
							const __name =
								data.produce_sub_categoryISbb_agrix_produce_typesID_data?.name || _produce?.name || infoUnavailableMsg

							return (
								<div className='col-md-4 mb-3' key={data._id}>
									<a href='#'
										className='linkCursor'
										onClick={() =>
											onProduceClicked({ ...data, __name, __type, seasonValue, __pricing: pricing }, price)
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
														src={data.produce_imageISfile ? contentsUrl + data.produce_imageISfile : PlaceholderImage}
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
											</div>
											<div className='p-3 produce-info'>
												<h5 style={{ fontWeight: 'bold' }}>{__name}</h5>

												<h6 className='pl-0 mb-1'>Type: {type_name || infoUnavailableMsg}</h6>
												<h6 className='pl-0 mb-1'>Size: {size_name || infoUnavailableMsg}</h6>
												<h6 className='pl-0 mb-1'>
													Packaging:{' '}
													{data.packaging_weightISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg},{' '}
													{data.packagingISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg}
												</h6>
												<h6 className='pl-0 mb-1'>Farming Method: {farming_name || infoUnavailableMsg}</h6>
												<h6 className='pl-0 mb-1'>Current Season: {seasonValue}</h6>
												<hr className='my-2' />
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
					<div className='d-flex justify-content-end'>
						<button
							type='button'
							className='btn btn-solid btn-default-plan py-2 px-2'
							onClick={onFavouriteProducesBtnClicked}
						>
							See all favorite produce items
						</button>
					</div>
					<FavouriteProduceDetail
						modal={showDetailsModal}
						onToggle={(showDetailsModal) => setDetailsModal(!showDetailsModal)}
						selectedProduce={selectedProduce}
						selectedPrice={selectedPrice}
						pricingLogs={pricinglogs}
						usersProduce={usersProduces}
						showFollowButton={false}
					/>
				</Fragment>
			)}
		</Container>
	)
}

export default DashboardProduce
