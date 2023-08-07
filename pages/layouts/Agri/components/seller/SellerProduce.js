import React, { useContext, useState } from 'react'
import moment from 'moment'
import { Button, Container, Col, Row, Media } from 'reactstrap'
import getConfig from 'next/config'
import SettingContext from '../../../../../helpers/theme-setting/SettingContext'
import { isWithinInterval } from 'date-fns'
import { GrLocation } from 'react-icons/gr'
import { getCurrentMonthName, seasonOptions } from '../../../../../services/constants'
import vars from '../../../../../helpers/utils/vars'
import { FiTrash2 } from 'react-icons/fi'
import { FaEdit } from 'react-icons/fa'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import PriceSellerModal from '../../../../../components/modals/PriceSeller'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const seasonMsg = `No info available for current season`
const infoUnavailableMsg = `Information Unavailable`

const actionBtnStyle = {
	width: 25,
	height: 25,
	border: '1px solid #021A49',
	borderRadius: '100%',
	cursor: 'pointer',
}

const MyProduce = ({ producesForSeller, pricelogs, pricelogsForSeller, produces, onEdit, onDelete }) => {
	const settingContext = useContext(SettingContext)
	const seasons = settingContext.appData.produce_seasons
	const packagings = settingContext.appData.produce_packaging
	const farmings = settingContext.appData.produce_farming_method
	const sizes = settingContext.appData.produce_sizes
	const [showPriceAddModal, setShowPriceAddModal] = useState(false)

	let priceLogsForSeller = []
	for (let produce of producesForSeller) {
		const priceLogsForProduce = pricelogs.filter((log) => log.produceISbb_agrix_users_produceID === produce.numeric_id)
		priceLogsForSeller = [...priceLogsForSeller, ...priceLogsForProduce]
	}
	
	let reversedPrices = priceLogsForSeller.reverse()
	

	const isInDateRange = (from, to) => {
		const nowDate = new Date()
		let text = nowDate.toISOString()
		const currentDate = text.split('T')[0]
		const currentYear = parseInt(currentDate.split('-')[0])
		const currentMonth = parseInt(currentDate.split('-')[1])
		const currentDay = parseInt(currentDate.split('-')[2])

		const fromDate = from.split(' ')[0]
		const fromYear = parseInt(fromDate.split('-')[0])
		const fromMonth = parseInt(fromDate.split('-')[1])
		const fromDay = parseInt(fromDate.split('-')[2])

		const toDate = to.split(' ')[0]
		const toYear = parseInt(toDate.split('-')[0])
		const toMonth = parseInt(toDate.split('-')[1])
		const toDay = parseInt(toDate.split('-')[2])

		return isWithinInterval(new Date(currentYear, currentMonth - 1, currentDay), {
			start: new Date(fromYear, fromMonth - 1, fromDay),
			end: new Date(toYear, toMonth, toDay),
		})
	}

	return (
		<>
			<Container>
				<Row className='partition4'>
					{producesForSeller.map((produce) => {
						const prices = reversedPrices.filter((p) => p.produceISbb_agrix_users_produceID === produce.numeric_id)
						
						let price = ''
						if (prices && prices.length>0) {
							price = prices.sort((a, b) => moment(b._datemodified) - moment(a._datemodified))[0]
						}
						// const isValidate = priceisInDateRange(price.from_date, price.to_date)

						let loc =
							(produce.countryISbb_agrix_countriesID_data ? produce.countryISbb_agrix_countriesID_data.name : '') +
							' ' +
							(produce.regionISbb_agrix_countriesID_data ? produce.regionISbb_agrix_countriesID_data.name : '') +
							' ' +
							(produce.cityISbb_agrix_countriesID_data ? produce.cityISbb_agrix_countriesID_data.name : '')
						loc = loc ? loc.trim() : ''
						const _price = price ? parseFloat(price.priceNUM).toFixed(2) : ''
						const hs = produce.produce_harvest_season ? JSON.parse(produce.produce_harvest_season) : []
						const ss = produce.produce_storage_season ? JSON.parse(produce.produce_storage_season) : []
						const us = produce.produce_unavaliable_season ? JSON.parse(produce.produce_unavaliable_season) : []
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
							<Col md='4' className='mb-4' key={produce.numeric_id}>
								<div style={{ borderRadius: 5, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
									<div className='collection-banner' style={{ position: 'relative' }}>
										<div className='img-part'>
											<Media
												src={contentsUrl + produce.produce_imageISfile}
												className='img-fluid-ads'
												alt='produce'
												height='200px'
												width='260px'
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
											{produce.produce_typeISbb_agrix_produce_typesID_data?.name || infoUnavailableMsg}
										</div>
									</div>
									<div className='produce-info p-3'>
										<h5 style={{ fontWeight: 'bold' }}>
											{produce.produce_sub_categoryISbb_agrix_produce_typesID_data?.name || infoUnavailableMsg}
										</h5>

										<h6 className='pl-0 mb-0'>
											Size: {produce.sizeISbb_agrix_produce_sizesID_data?.name || infoUnavailableMsg}
										</h6>
										<h6 className='pl-0 mb-0'>
											Packaging:{' '}
											{produce.packaging_weightISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg},{' '}
											{produce.packagingISbb_agrix_produce_packagingID_data?.name || infoUnavailableMsg}
										</h6>
										<h6 className='pl-0 mb-0'>
											Farming Method:{' '}
											{produce.farming_methodISbb_agrix_produce_farming_methodID_data?.name || infoUnavailableMsg}
										</h6>
										<h6 className='pl-0 mb-0'>Current Season: {seasonValue}</h6>
										<hr />
										{_price ? (
											<h5 style={{ fontWeight: 'bold', color: vars.primaryColor }}>
												Price: ${_price}
												{/* <i className='fa fa-lock' aria-hidden='true'></i> */}
											</h5>
										) : null}
										{price ? (
											<h5 style={{ fontWeight: 500, fontSize: 14 }}>
												Price Valid From: {price.from_date ? `${price.from_date.split(' ')[0]} to ` : ''}
												{price.to_date ? price.to_date.split(' ')[0] : ''}
												{/* {price && isInDateRange(price.from_date, price.to_date) ? 'Yes' : 'No'} */}
											</h5>
										) : (
											<h5 style={{ fontWeight: 500, fontSize: 14 }}>Price Valid From: {infoUnavailableMsg}</h5>
										)}

										{loc && (
											<ARow className='mt-3' align='middle' wrap={false}>
												<ACol style={{ minWidth: 30 }}>
													<GrLocation size={20} style={{ verticalAlign: 'middle' }} />
												</ACol>
												<ACol flex={1}>
													<h6 className='m-0 p-0'>{loc}</h6>
												</ACol>
											</ARow>
										)}

										<hr />
										<div className='d-flex justify-content-between align-items-center'>
											<div>
												<Button
													onClick={() => {
														setShowPriceAddModal({ ...produce, _price: price, __price: _price })
													}}
												>
													{_price ? 'Update' : 'Add'} Price
												</Button>
											</div>
											<div className='d-flex justify-content-center'>
												<div
													style={actionBtnStyle}
													className='mx-1 d-flex justify-content-center align-items-center'
													onClick={() => onDelete(produce)}
												>
													<FiTrash2 color='#021A49' />
												</div>
												<div
													style={actionBtnStyle}
													className='mx-1 d-flex justify-content-center align-items-center'
													onClick={() => onEdit(produce)}
												>
													<FaEdit color='#021A49' />
												</div>
											</div>
										</div>
									</div>
								</div>
							</Col>
						)
					})}
				</Row>
			</Container>
			<PriceSellerModal
				modal={!!showPriceAddModal}
				selectedItem={showPriceAddModal}
				toggle={() => setShowPriceAddModal(null)}
				producesForSeller={producesForSeller}
				produces={produces}
				pricinglogs={pricelogsForSeller}
			/>
		</>
	)
}

export default MyProduce
