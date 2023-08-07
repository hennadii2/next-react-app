import React, { Fragment, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { Col, Table, Row, Media, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import { format } from 'date-fns'
import getConfig from 'next/config'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import ConfirmModal from '../../../../../components/modals/ConfirmModal'
import { Td, Th, Tr } from '../DashboardPlan'
import PlaceholderImage from '../../../../../public/assets/images/placeholder.jpg'
import { getBase64OfImageUrl, getNextMonthFirst, formatPrice } from '../../../../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const greenBadgeStyles = {
	padding: '5px 15px',
	borderRadius: 25,
	maxWidth: 'fit-content',
	backgroundColor: '#20963d3d',
	color: '#20963d',
}

const MyAverts = ({ advertsForSeller, advertsPositions, onEdit }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const initOpens = advertsForSeller.map((advert) => {
		return false
	})
	const [opens, setOpens] = useState(initOpens)
	const [advert, setAdvert] = useState(null)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [caption, setCaption] = useState('')
	const [message, setMessage] = useState('')
	const [base64Img, setBase64Img] = useState('')

	const formatDate = (dateStr) => {
		if (!dateStr) {
			return "No date"
		}
		const date = dateStr.split(' ')[0]
		const year = parseInt(date.split('-')[0])
		const month = parseInt(date.split('-')[1])
		const day = parseInt(date.split('-')[2])

		return format(new Date(year, month - 1, day), 'dd MMM yyyy')
	}

	const getRenewalDateTitle = (ad) => {
		if (ad.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Deactivated') {
			return "Expiry Date"
		}
		return "Renewal Date"
	}

	const onDropdownToggle = (index) => {
		const newOpens = opens.map((open, i) => {
			if (i === index) return !open
			return false
		})
		setOpens(newOpens)
	}

	const onStatusConfirmed = (ad) => {
		console.log(ad)
		setAdvert(ad)
		setBase64FromUrl(contentsUrl + ad.advert_image01ISfile)
		if (
			ad.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Active' ||
			ad.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Reactivated'
		) {
			setCaption('Deactivate Advert')
			setMessage('Are you sure you want to cancel your subscription?')
		} else if (ad.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Deactivated') {
			setCaption('Reactivate Advert')
			setMessage('Are you sure to make current advert Reactivate?')
		}
		setShowConfirmModal(!showConfirmModal)
	}

	const onStatusChanged = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'update_adverts')
		formData.append('_id', advert._id)
		formData.append('user_id', user._id)
		formData.append('session_id', user.session_id)
		formData.append('userISbb_agrix_usersID', user._id)
		formData.append('positionISbb_agrix_adverts_positionsID', advert.positionISbb_agrix_adverts_positionsID)
		formData.append('advert_image01ISfile', base64Img)
		if (advert.produce_categoryISbb_agrix_produce_typesID) {
			formData.append('produce_categoryISbb_agrix_produce_typesID', advert.produce_categoryISbb_agrix_produce_typesID)
		}

		if (advert.produce_sub_categoryISbb_agrix_produce_typesID) {
			formData.append(
				'produce_sub_categoryISbb_agrix_produce_typesID',
				advert.produce_sub_categoryISbb_agrix_produce_typesID
			)
		}
		

		if (
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Active' ||
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Reactivated'
		)
			formData.append('statusISLIST_Draft_Active_Deactivated_Reactivated_Archived', 'Deactivated')
		else if (advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Deactivated')
			formData.append('statusISLIST_Draft_Active_Deactivated_Reactivated_Archived', 'Reactivated')

		try {
			const response = await post(apiUrl, formData)			
			if (response.data.message === "SUCCESS") {
				router.reload()
			} else {
				console.log(response.data)
				alert(response.data)
			}
			//router.reload()
		} catch (err) {
			alert(err.toString())
		}
	}

	const setBase64FromUrl = (img_url) => {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', img_url, true)
		xhr.responseType = 'blob'
		xhr.onload = function (e) {
			var reader = new FileReader()
			reader.onload = function (event) {
				var res = event.target.result
				setBase64Img(res)
			}
			var file = this.response
			reader.readAsDataURL(file)
		}
		xhr.send()
	}

	// console.log(advertsForSeller)

	return (
		<Fragment>
			{advertsForSeller.map((advert, i) => {
				const _status = advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived || ''
				const isPending = _status.toLowerCase().includes('pending')

				return (
					<Row className='mb-3 py-2 border-bottom' key={advert._id} style={{ borderColor: '#b8b8b8' }}>
						<Col md='3'>
							<Media
								src={advert.advert_image01ISfile ? contentsUrl + advert.advert_image01ISfile : PlaceholderImage}
								className='img-fluid-ads'
								alt='advert'
								style={{
									objectFit: 'cover',
									width: '100%',
									height: '100%',
									maxHeight: advert.positionISbb_agrix_adverts_positionsID === '1' ? '170px' : '140px',
									borderRadius: '6px',
									boxShadow: 'rgb(149 157 165 / 20%) 0px 8px 24px',
								}}
							/>
						</Col>
						<Col md='9'>
							<div
								style={{
									backgroundColor: '#fff',
									borderRadius: 5,
									boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
								}}
							>
								<Table responsive style={{ marginBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
									<thead style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
										<Tr style={{ textAlign: 'center', backgroundColor: '#131b28' }}>
											<Th style={{ borderTopLeftRadius: 5 }}>Date created</Th>
											<Th>{getRenewalDateTitle(advert)}</Th>
											<Th>Price</Th>
											<Th>Position</Th>
											{/* <Th>Transaction</Th> */}
											<Th style={{ width: 165 }}>Status</Th>
											<Th style={{ borderTopRightRadius: 5 }}>Action</Th>
										</Tr>
									</thead>
									<tbody>
										<tr style={{ textAlign: 'center' }}>
											<Td>{formatDate(advert._datemodified)}</Td>
											<Td>{formatDate(advert.valid_until_datetime)}</Td>
											<Td>{formatPrice(advert.price_paidNUM)}</Td>
											<Td>
												{
													advertsPositions.find(
														(position) => position.numeric_id === advert.positionISbb_agrix_adverts_positionsID
													).name
												}
											</Td>
											{/* <Td>Otto</Td> */}
											<Td className='d-flex justify-content-center'>
												{_status === 'Active' ? (
													<div style={greenBadgeStyles}>Active</div>
												) : (
													<div
														style={
															_status === 'Reactivated'
																? greenBadgeStyles
																: {
																		padding: '5px 15px',
																		borderRadius: 25,
																		maxWidth: 'fit-content',
																		backgroundColor: '#0000002e',
																		color: '#000',
																  }
														}
													>
														{_status}
													</div>
												)}
											</Td>
											<Td>
												<ButtonDropdown
													disabled={isPending}
													isOpen={opens[i]}
													toggle={() => onDropdownToggle(i)}
													direction='left'
													style={isPending ? { opacity: 0.2, pointerEvents: 'none' } : {}}
												>
													<DropdownToggle className='btn btn-solid btn-post border' style={{ borderRadius: 5 }}>
														Select
													</DropdownToggle>
													<DropdownMenu>
														{!['Reactivated', 'Active'].includes(_status) && (
															<DropdownItem onClick={() => onEdit(advert)}>Edit</DropdownItem>
														)}
														{(_status === 'Active' || _status === 'Reactivated') && (
															<DropdownItem onClick={() => onStatusConfirmed(advert)}>Deactivate</DropdownItem>
														)}
														{_status === 'Draft' && (
															<DropdownItem onClick={() => onEdit({ ...advert, __wasDraft: true })}>
																Activate
															</DropdownItem>
														)}
														{_status === 'Deactivated' && (
															<DropdownItem
																onClick={(e) => {
																	onStatusConfirmed(advert)
																	// e.persist()
																	// console.log('Reactivating advert - ', advert)
																	// let totalCost = parseFloat(advert.price_paidNUM)
																	// const others = {}

																	// onAuthModalsTriggered('Payment', 'advertp', {
																	// 	lastLine: `Let's go back to your adverts`,
																	// 	designCost: parseFloat(totalCost).toFixed(0),
																	// 	paymentTitle1: `Advert Subscription:`,
																	// 	paymentValue1: `$${parseFloat(advert.price_paidNUM).toFixed(0)}`,
																	// 	paymentTitle3: `Total:`,
																	// 	paymentValue3: `$${totalCost.toFixed(0)}`,
																	// 	__TYPE: 'advertp', // logo/banner/adverts/advertp
																	// 	onFinishCallback: async ({ stripe_ref }) => {
																	// 		let __base64Img
																	// 		if (advert.advert_image01ISfile) {
																	// 			__base64Img = await getBase64OfImageUrl(contentsUrl + advert.advert_image01ISfile)
																	// 		}
																	// 		let formData = getFormClient()
																	// 		formData.append('api_method', 'update_adverts')
																	// 		formData.append('_id', advert._id)
																	// 		formData.append('session_id', user.session_id)
																	// 		formData.append('user_id', user._id)
																	// 		formData.append('userISbb_agrix_usersID', user._id)
																	// 		formData.append(
																	// 			'statusISLIST_Draft_Active_Deactivated_Reactivated_Archived',
																	// 			'Reactivated'
																	// 		)
																	// 		formData.append(
																	// 			'positionISbb_agrix_adverts_positionsID',
																	// 			advert.positionISbb_agrix_adverts_positionsID
																	// 		)

																	// 		const additionData = {
																	// 			actionedYN: 1,
																	// 			activeYN: 1,
																	// 			sumbittedYN: 1,
																	// 			stripe_payment_ref: stripe_ref,
																	// 			price_paidNUM: Number(parseFloat(advert.price_paidNUM).toFixed(0)),
																	// 		}
																	// 		if (additionData) {
																	// 			Object.keys(additionData).forEach((x) => {
																	// 				formData.append(x, additionData[x])
																	// 			})
																	// 		}

																	// 		__base64Img && formData.append('advert_image01ISfile', __base64Img)

																	// 		try {
																	// 			const response = await post(apiUrl, formData)
																	// 			if (response.data.message === 'SUCCESS') {
																					
																	// 				if (additionData && additionData.stripe_payment_ref) {

																	// 					console.log('response.data 2', response.data)
																	// 					console.log("advert", advert)

																	// 					const advert_id = advert.numeric_id
																	// 					const stripe_payment_ref = additionData.stripe_payment_ref
																	// 					const amount = parseFloat(totalCost).toFixed(0)
																	
																	// 					let membershipLogFormData = getFormClient()
																	// 					membershipLogFormData.append('api_method', 'add_membership_log')
																	// 					membershipLogFormData.append('stripe_payment_ref', stripe_payment_ref)
																	// 					membershipLogFormData.append('userISbb_agrix_usersID', user._id)
																	// 					membershipLogFormData.append('amountNUM', amount)
																	// 					const prefix = (advert.positionISbb_agrix_adverts_positionsID_data?.name === 'Standard') ? `ADVERT-S` : `ADVERT-P`
																	// 					let __code = `${prefix}_${advert_id}`			
																	// 					membershipLogFormData.append('code', __code)
																	// 					const membershipLogRes = await post(apiUrl, membershipLogFormData)
																	// 					console.log(`${__code} Log response:`, membershipLogRes.data)
																						
																	// 				}

																	// 			} else if (response.data.error) {
																	// 				alert(response.data.message)
																	// 			}
																	// 		} catch (err) {
																	// 			alert(err.toString())
																	// 		}
																	// 	},
																	// 	finalFinishCallback: () => {
																	// 		console.log('--22--add_membership_log--debug--')
																	// 		setTimeout(() => router.reload(), 900)
																	// 	},
																	// 	...others,
																	// })
																}}
															>
																Reactivate
															</DropdownItem>
														)}
													</DropdownMenu>
												</ButtonDropdown>
											</Td>
										</tr>
									</tbody>
								</Table>
							</div>
						</Col>
					</Row>
				)
			})}
			<ConfirmModal
				modal={showConfirmModal}
				toggle={(showConfirmModal) => setShowConfirmModal(!showConfirmModal)}
				caption={caption}
				message={message}
				onConfirm={onStatusChanged}
			/>
		</Fragment>
	)
}

export default MyAverts
