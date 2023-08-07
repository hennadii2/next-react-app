import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Button, Col, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import { Clipboard } from 'react-feather'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import { getColorStyles, Td, Tr, Th } from '../DashboardPlan'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import vars from '../../../../../helpers/utils/vars'
import { toast } from 'react-toastify'
import { isEmpty } from '../../../../../helpers/utils/helpers'
import { getFormClient, server_domain } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import getStripePromise from '../../../../../helpers/utils/get-stripe'
import moment from 'moment'
import { nanoid } from 'nanoid'

export const renderMembershipInfo = (item) => {
	if (isEmpty(item)) return null
	const arrBefore = []
	const arrBeforeRow0 = []
	Object.keys(item).forEach(function (key) {
		if (key.substring(0, 7) === 'option_' && key.substring(9, key.length) === '_name') {
			arrBeforeRow0.push(item[key])
		}
	})
	arrBefore.push(arrBeforeRow0)

	const arrayBeforeRow = []
	Object.keys(item).forEach(function (key) {
		if (key.substring(0, 7) === 'option_' && key.substring(9, key.length) === '_YN') {
			arrayBeforeRow.push(item[key])
		}
	})
	arrBefore.push(arrayBeforeRow)

	// transposing the array
	const output = arrBefore[0].map((_, colIndex) => arrBefore.map((row) => row[colIndex]))

	return output.map((single, index) => {
		let available = false

		if (single[1] === '1') {
			available = true
		}

		if (single[0] === null) return null

		return (
			<p key={index} className='text-center m-0 py-2' style={{ fontSize: 16 }}>
				<span style={available ? { color: '#000' } : { opacity: 0.6, textDecoration: 'line-through' }}>
					{single[0]}
				</span>
			</p>
		)
	})
}

const SellerAccountPlan = ({ membershipTypes: _membershipTypes }) => {	
	const [cancelModal, setCancelModal] = useState(false)
	const [cardModal, setCardModal] = useState(false)
	const [noCardModal, setNoCardModal] = useState(false)
	const [canceling, setCanceling] = useState(false)
	const [cardInfo, setCardInfo] = useState({})
	const [stripePromise, setStripePromise] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuth = authContext.onAuth
	const stripePublicKey = authContext.validSessionData.stripe_public_key

	// 'My Plan' tab
	const userMembershipTypeId = user.membershipISbb_agrix_membership_typesID
	const activeMembership = _membershipTypes.find((membership) => membership._id === userMembershipTypeId)
	let membershipTypes =
		_membershipTypes?.filter?.((item) => {
			if (item.code?.toLowerCase?.() === user.role?.toLowerCase()) {
				return true
			}
			return false
		}) || []

	membershipTypes.sort((a, b) => parseFloat(a.membership_month_priceNUM) - parseFloat(b.membership_month_priceNUM))

	// Change Card
	const stripe = useStripe()
	const elements = useElements()
	
	const [paymentLoading, setPaymentLoading] = useState(false)
	const cardAmount = 0	
	
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

	const payMoney = async (e) => {
		e.preventDefault()
		if (!elements) return somethingWrong()

		try {
			setPaymentLoading(true)
			// 2. Call stripe_init to get the client secret
			const { long_id, first_name, last_name, email } = user						
			const suffix = `${nanoid()}`
			const code = `CARD-` + suffix
				
			let stripeInitFormData = getFormClient()
			stripeInitFormData.append('api_method', 'stripe_init')
			stripeInitFormData.append('user_id', long_id)
			stripeInitFormData.append('amount', cardAmount)
			stripeInitFormData.append('code', code)

			const stripeInitRes = await post(server_domain, stripeInitFormData)
			const { clientSecret } = stripeInitRes.data
			if (!clientSecret) return somethingWrong()

			if (cardAmount > 0) {
				// 3. Pass clientSecret and get the payment
				const paymentResult = await stripe.confirmCardPayment(clientSecret, {
					payment_method: {
						card: elements.getElement(CardElement),
						billing_details: { name: first_name + ' ' + last_name, email },
					},
				})

				if (paymentResult.error) {
					somethingWrong(paymentResult.error.message)
					console.log(paymentResult.error.message)
				} else {
					if (paymentResult.paymentIntent.status === 'succeeded') {
						const { id: stripe_ref } = paymentResult.paymentIntent
						// 4. If payment success then call capture_payment & membership log API endpoint
						let capturePaymentFormData = getFormClient()
						capturePaymentFormData.append('api_method', 'capture_payment')
						capturePaymentFormData.append('stripe_ref', stripe_ref)
						capturePaymentFormData.append('user_id', long_id)
						capturePaymentFormData.append('amount', cardAmount)
						capturePaymentFormData.append('code', code)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)

						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', long_id)
						membershipLogFormData.append('amountNUM', cardAmount)
						membershipLogFormData.append('code', 'card_change')
						
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						setCardModal(false)
						// 6. Update Card Info
						getUser()
					} else {
						somethingWrong()
					}
				}
			} else {
				// 3. Pass clientSecret and get the payment
				const setupResult = await stripe.confirmCardSetup(clientSecret, {
					payment_method: {
						card: elements.getElement(CardElement),
						billing_details: { name: first_name + ' ' + last_name, email },
					},
				})

				if (setupResult.error) {
					somethingWrong(setupResult.error.message)
					console.log(setupResult.error.message)
				} else {
					if (setupResult.setupIntent.status === 'succeeded') {
						const { id: stripe_ref } = setupResult.setupIntent
						// 4. If payment success then call capture_payment & membership log API endpoint
						let capturePaymentFormData = getFormClient()
						capturePaymentFormData.append('api_method', 'capture_payment')
						capturePaymentFormData.append('stripe_ref', stripe_ref)
						capturePaymentFormData.append('user_id', long_id)
						capturePaymentFormData.append('amount', cardAmount)
						capturePaymentFormData.append('code', code)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)

						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', long_id)
						membershipLogFormData.append('amountNUM', cardAmount)
						membershipLogFormData.append('code', 'card_change')
						
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						setCardModal(false)
						// 6. Update Card Info
						getUser()
					} else {
						somethingWrong()
					}
				}
			}
			
		} catch (error) {
			console.log(error)
			somethingWrong(error.toString())
		} finally {
			setPaymentLoading(false)
		}
	}

	const onMembershipClicked = (type) => {
		if (!(cardInfo && cardInfo?.brand && cardInfo?.brlast4and)) {
			setNoCardModal(true)
			return
		}
		const onAuthModalsTriggered = authContext.onAuthModalsTriggered
		onAuthModalsTriggered('subscribe', type._apikey)
	}

	const closeCancelModal = () => setCancelModal(false)

	const closeCardModal = () => setCardModal(false)

	const showMessage = (msg, type = 'error') => {
		toast[type](msg || 'Something went wrong!', {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined,
		})
	}


	const handleCancelSubscription = async () => {
		try {
			setCanceling(true)
			const { _id, session_id } = user

			let formData = getFormClient()
			formData.append('api_method', 'change_subscription')
			formData.append('user_id', _id)
			formData.append('session_id', session_id)
			formData.append('new_membership_type_id', membershipTypes[0]._id) // 0 One mean Blue
			formData.append('new_membership_period', 'YEAR')

			const response = await post(server_domain, formData)
			console.log('change_subscription response:', response.data)
			if (response.data.message === 'SUCCESS') {
				if (response.data.change_message) {
					showMessage(response.data.change_message, 'success')
				}
				const updatedUser = response.data.data
				// setting authenticated user information into the state of _app component
				onAuth(updatedUser, true)
				// saving the user information into localStorage
				localStorage.setItem('isAuthenticated', 'done')
				localStorage.setItem('user', JSON.stringify(updatedUser))
				setCanceling(false)
				onClose()
				setTimeout(() => window.location.reload(), 500)
			} else if (response.data.error) {
				showMessage(response.data.message)
			}
		} catch (error) {
			console.log(error)
			setCanceling(false)
			showMessage(error.toString())
		} finally {
			setCanceling(false)
		}
	}

	const onChageCard = () => {
		
		setCardModal(true)
	}

	const getUser = async () => {
		setIsLoading(true)
		try {			
			const { long_id } = user

			let formData = getFormClient()
			formData.append('api_method', 'get_user')
			formData.append('_id', long_id)
			formData.append('with_payment_details', "1")

			const response = await post(server_domain, formData)
			if (response.data.message === 'SUCCESS') {
				setCardInfo(response.data.card)
				console.log('--------user-with_payment_details', response.data);
			} else if (response.data.error) {
				showMessage(response.data.message)
			}
		} catch (error) {
			console.log(error)			
			showMessage(error.toString())
		} finally {
			setIsLoading(false)
		}
	}

	const onTriggerAddCard = () => {
		setNoCardModal(false)
		setCardModal(true)
	}

	const { subs } = user

	const yearAmount = useMemo(() => {
		if (!activeMembership || !subs || !subs.cycle_period) {
			return ''
		}
		let result = parseFloat(activeMembership?.membership_year_priceNUM).toFixed(2)
		if (subs.cycle_period !== 'Yearly') {
			result = parseFloat(activeMembership?.membership_month_priceNUM * 12).toFixed(2)
		}
		return result
	}, [activeMembership, subs])

	useEffect(() => {
		getUser()
		setStripePromise(getStripePromise(stripePublicKey))
	}, []);

	// console.log(membershipTypes)

	return (
		<>
			<div className='permission-block'>
				<div className='attribute-blocks'>
					<h5 className='f-w-600 mb-4 dashboard-title'>Current Subscription Plan</h5>
					<Row>
						{isEmpty(subs) ? (
							<h4 className='f-w-600 mb-4 dashboard-title' style={{ color: 'red' }}>
								Malformed data found. No user.subs info available.
							</h4>
						) : (
							<Col>
								<div
									style={{
										backgroundColor: '#fff',
										borderRadius: 5,
										boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
									}}
								>
									<Table responsive style={{ marginBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
										<thead style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
											<Tr style={{ backgroundColor: vars.blackColor }}>
												<Th style={{ borderTopLeftRadius: 5 }}>Plan</Th>
												<Th>Price</Th>
												<Th>Per</Th>
												<Th>Total Price Per Year</Th>
												<Th>Renewal Date</Th>
												<Th style={{ borderTopRightRadius: 5, textAlign: 'center' }}>Status</Th>
											</Tr>
										</thead>
										<tbody>
											<tr>
												<Td>
													<div
														style={{
															padding: '8px 15px',
															borderRadius: 25,
															maxWidth: 'fit-content',
															...getColorStyles(subs?.membership_type),
														}}
													>
														{subs?.membership_type}
													</div>
												</Td>
												<Td>{parseFloat(subs.list_price).toFixed(2)}</Td>
												<Td>{subs.cycle_period}</Td>
												<Td>{yearAmount}</Td>
												<Td>{subs.to_date}</Td>
												<Td className='d-flex justify-content-center'>
													<Button className='btn btn-disabled btn-post btn-lg' disabled>
														Subscribed
													</Button>
												</Td>
											</tr>
										</tbody>
									</Table>
								</div>
							</Col>
						)}
					</Row>
					<Button color='danger' className='mt-4' onClick={() => setCancelModal(true)}>
						Cancel Subscription
					</Button>
				</div>
				<div className='mt-5'>
					<div className='d-flex justify-content-start align-items-center mb-4' style={{fontSize: '16px', color: '#000'}}>
						<h5 className='f-w-600 dashboard-title mb-0'>Your payment details:</h5>
						<div className='ml-2' style={{ color: '#000', border: 'solid 1px #000', borderRadius: 5, padding: 5}}>
							powered by <span style={{fontWeight: 700}}>Stripe</span>
						</div>
					</div>
					
					{isLoading ? (
						<div>Getting payment info...</div>
					) : (
						<>
							{(cardInfo && cardInfo.brand && cardInfo.brlast4and) ? (
								<>
									<div>
										<p style={{fontSize: '16px', color: '#000'}}>Your card, stored securely with <a target="_blank" href='https://www.stripe.com/' style={{fontSize: '16px', color: '#000', textDecoration: 'underline'}}>Stripe:</a></p>
										<p style={{fontSize: '16px', color: '#000'}}>{`${cardInfo.brand} card ending with ****${cardInfo.brlast4and} (Exp: ${cardInfo.exp_month}/${cardInfo.exp_year})`}</p>
									</div>
									<Button color='danger' className='mt-4' onClick={onChageCard}>
										Change Card
									</Button>
								</>
							) : (
								<>
									<div>
										<p style={{fontSize: '16px', color: '#000'}}>You have no card saved. Click below to add a payment card.</p>
									</div>
									<Button color='danger' className='mt-4' onClick={onChageCard}>
										Add Card
									</Button>
								</>
							)}
						</>
					)}
					
				</div>
				<div className='mt-5'>
					<h5 className='f-w-600 mb-4 dashboard-title'>Other Subscription Plans Available </h5>

					<div className=''>
						<ARow gutter={[20, 20]} justify='space-between'>
							{membershipTypes.map((type, mainIndex) => {
								if (type.code.toLowerCase() !== user.role) return null
								const isPopular = type.name?.toLowerCase().includes('platinum')
								const amount = (Math.round(parseFloat(type.membership_month_priceNUM) * 100) / 100).toFixed(2)
								return (
									<ACol span={24} md={6} key={mainIndex}>
										<div
											className='p-4'
											style={{
												position: 'relative',
												borderRadius: 5,
												backgroundColor: '#fff',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
											}}
										>
											{isPopular && <div className='custom-badge custom-badge-top custom-badge-dark'>MOST POPULAR</div>}
											<h4 style={{ fontSize: 24, marginBottom: 16, fontWeight: 'bold' }}>{type.name}</h4>

											<div style={{ display: 'flex' }}>
												<span style={{ fontSize: '1.15rem' }}>$</span>
												<span style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>{amount}</span>
											</div>

											<span
												className='text-muted'
												style={{ fontWeight: '500', fontSize: '1rem', lineHeight: '1.25rem' }}
											>
												{type.name === 'Blue' ? <>&nbsp;</> : 'Monthly'}
											</span>
											<div className='mb-4 mt-3'>{renderMembershipInfo(type)}</div>
											{type._id === userMembershipTypeId ? (
												<Button
													className='btn btn-disabled btn-post btn-lg'
													disabled
													style={{ maxHeight: 34, width: '90%' }}
												>
													<span className='pl-1 fs-15'>Subscribed</span>
												</Button>
											) : (
												<button
													className='btn btn-solid btn-default-plan px-1 py-1'
													style={{ width: '90%' }}
													onClick={() => onMembershipClicked(type)}
												>
													Get {type.name}
												</button>
											)}
										</div>
									</ACol>
								)
							})}
						</ARow>
					</div>
				</div>
			</div>

			<Modal isOpen={cancelModal} toggle={closeCancelModal} className='modal-md' centered>
				<ModalHeader toggle={closeCancelModal}>Please Confirm</ModalHeader>
				<ModalBody className='px-4 pb-3'>
					<div className='my-4'>
						<p className='text-center' style={{ lineHeight: 1.4, fontSize: 17 }}>
							Oh dear! Are you sure you want to cancel? Clicking cancel below will stop the next renewal subscription
							payment from coming off and cancel your subscription. You will still have access to all your features
							until this date ({user.subs?.to_date?.split(' ')[0] || 'Date Unavailable'}) after this date you will
							become a free blue user.
						</p>
					</div>
					<div className='d-flex justify-content-center mb-4'>
						<Button className='mr-3' disabled={canceling} onClick={closeCancelModal}>
							No thanks
						</Button>
						<Button className='' color='danger' onClick={handleCancelSubscription}>
							{canceling ? 'Canceling...' : 'Cancel Subscription'}
							{canceling && <span className='spinner-border spinner-border-sm mr-1' />}
						</Button>
					</div>
				</ModalBody>
			</Modal>

			<Modal isOpen={cardModal} toggle={closeCardModal} className='modal-md' centered>
				<ModalHeader toggle={closeCardModal}>Save Payment Card</ModalHeader>
				<ModalBody className='px-4 pb-3'>
					<div className='my-4'>
						<p className='text-center' style={{ lineHeight: 1.4, fontSize: 17 }}>
							Save a card below for secure future payments
						</p>
					</div>
					{/* <div className='my-4 py-2 d-flex justify-content-between mb-4' style={{ borderTop: 'solid 1px #ccc' }}>
						<div style={{ lineHeight: 1.4, fontSize: 17 }}>Total:</div>
						<div style={{ lineHeight: 1.4, fontSize: 17 }}>$0.50</div>
					</div> */}
					<CardElement
						className='card'
						options={{
							hidePostalCode: true,
							style: {
								base: { backgroundColor: 'white', width: '100%' },
							},
						}}
					/>
							
					<div className='d-flex justify-content-center mb-4 mt-4'>
						<Button className='mr-3' onClick={payMoney}>
							{paymentLoading ? 'Processing...' : `Save Card`}
							{paymentLoading && <span className='spinner-border spinner-border-sm mr-1'></span>}
						</Button>
					</div>
				</ModalBody>
			</Modal>

			<Modal isOpen={noCardModal} toggle={()=>setNoCardModal(!noCardModal)} className='modal-md' centered>
				<ModalBody className='px-4 py-3'>
					<div className='my-4'>
						<p className='text-center' style={{ lineHeight: 1.4, fontSize: 17 }}>
							Looks like you have no saved card details. Please click below to save a card.
						</p>
					</div>
							
					<div className='d-flex justify-content-center mb-4 mt-4'>
						<Button className='mr-3' onClick={onTriggerAddCard}>
							Add Card
						</Button>
					</div>
				</ModalBody>
			</Modal>
		</>
	)
}

export default SellerAccountPlan