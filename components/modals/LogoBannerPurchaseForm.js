import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Modal, ModalHeader, ModalBody, Input, Label, Alert } from 'reactstrap'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import { getFormClient, server_domain } from '../../services/constants'
import { post } from '../../services/axios'
import { AuthContext } from '../../helpers/auth/AuthContext'
import router from 'next/router'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { Row, Col } from 'antd-grid-layout'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'
import moment from 'moment'
import styled from 'styled-components'
import { CardWrapper, CardUI } from './SignupForm'
import { TiInfo } from 'react-icons/ti'
import { capitalize, getBase64, blobToBase64, getFileObjForAjax } from '../../helpers/utils/helpers'
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import vars from '../../helpers/utils/vars'

const LogoBannerPurchaseForm = (props) => {
	const { isShow, onClose, additionalInfo } = props
	const stripe = useStripe()
	const elements = useElements()
	// console.log(additionalInfo)
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuth = authContext.onAuth
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const settingContext = useContext(SettingContext)
	const [paymentModal, setPaymentModal] = useState(false)
	const [paymentLoading, setPaymentLoading] = useState(false)
	const {
		__TYPE,
		__justSend = false,
		__justSendCallback,
		period = '',
		membership_month_priceNUM,
		membership_year_priceNUM,
		lastLine = `Let's go back`,
		mainTypeTitle = `Purchase`,
		selectedTitle = `Design`,
		reqExistMsg,
		subtitleTxt = (
			<>
				Please tell us a little bit more about you below
				<br /> so we can customize your design to your needs
			</>
		),
		subtitleTxt2 = (
			<>
				Upload up to 3 images, of ideas, branding or
				<br /> your current design
			</>
		),
		designCost = 0,
		paymentTitle1,
		paymentTitle2,
		paymentValue1,
		paymentValue2,
	} = additionalInfo?.LogoBannerPurchase || {}
	const amount = designCost
	// const nextDate = moment()
	// 	.add(1, period === '__monthly' ? 'months' : 'years')
	// 	.calendar()

	const [loading, setLoading] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const [isErr, setIsErr] = useState(false)
	const [savedResponse, setSavedResponse] = useState({})
	const [doneModal, setDoneModal] = useState(false)
	const [checking, setChecking] = useState(true)
	const [requests, setRequests] = useState([])

	const [form, setForm] = useState({ details: '', file1: null, file2: null, file3: null })

	const onFormChanged = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const startCheckingRequest = async () => {
		setChecking(true)
		setRequests([])

		if (__TYPE === 'adverts') {
			setRequests([])
			setChecking(false)
			return
		}

		let formData = getFormClient()
		formData.append('api_method', 'list_design_requests')
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)
		formData.append('userISbb_agrix_usersID', user._id)
		formData.append('typeISLIST_logo_banner_advertp_adverts', __TYPE)
		formData.append('completedYN', 0)

		try {
			const response = await post(server_domain, formData)
			if (response.data?.message === vars.listEmptyMsg) {
				return setChecking(false)
			}
			if (response.data.message === 'SUCCESS') {
				setRequests(response.data?.list || [])
				setChecking(false)
			} else if (response.data.error) {
				somethingWrong(response.data.message)
			}
		} catch (err) {
			somethingWrong(err.toString())
		}
	}

	useEffect(() => {
		if (isShow) startCheckingRequest()
	}, [isShow])

	const onChangeFile = async (event) => {
		event.persist()
		event.stopPropagation()
		event.preventDefault()
		const file = event.target.files?.[0]
		if (!file) return
		try {
			const base64 = await getBase64(file)
			// const imageData = getFileObjForAjax(file, base64)
			// console.log(event.target.name, imageData)
			setForm({ ...form, [event.target.name]: base64 })
		} catch (error) {
			console.log(error)
		}
	}

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

	const purchaseDoneCall = () => {
		// closing modal
		setForm({ details: '', file1: null, file2: null, file3: null })
		onClose()
		setDoneModal(false)
	}

	const onContinueClick = async () => {
		// 1. Validation & Reset
		setIsErr(false)
		setErrMsg('')
		console.log(form)

		if (!form.details) {
			setIsErr(true)
			setErrMsg('Details field is required.')
			return
		}

		if (!form.file1 && !form.file2 && !form.file3) {
			setIsErr(true)
			setErrMsg('Please choose at least one image file.')
			return
		}

		// 2. Original Reg
		let formData = getFormClient()
		formData.append('api_method', 'add_design_requests')
		formData.append('messageISsmallplaintextbox', form.details)
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)
		formData.append('userISbb_agrix_usersID', user._id)
		formData.append('typeISLIST_logo_banner_advertp_adverts', __TYPE)
		form.file1 && formData.append('image01ISfile', form.file1)
		form.file2 && formData.append('image02ISfile', form.file2)
		form.file3 && formData.append('image03ISfile', form.file3)
		formData.append('completedYN', 0)

		try {
			setLoading(true)
			const response = await post(server_domain, formData)
			if (response.data.message === 'SUCCESS') {
				console.log(response.data)
				const savedData = response.data?.item || {}
				if (__justSend) {
					__justSendCallback?.(savedData)
					purchaseDoneCall()
					return
				}
				setSavedResponse(savedData)
				// Go to payMoney() for next steps
				setPaymentModal(true)
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		} finally {
			setLoading(false)
		}
	}

	const payMoney = async (e) => {
		e.preventDefault()
		if (!stripe || !elements) return somethingWrong()

		try {
			setPaymentLoading(true)
			// 2. Call stripe_init to get the client secret
			const { numeric_id } = savedResponse
			const now = new Date()
			const shortMonthName = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
			const day = now.getDate()
			const year = now.getFullYear()
			const suffix = `.${nanoid()}`
			const code = `${__TYPE.toUpperCase()}-${numeric_id}-${day}-${shortMonthName}-${year}` + suffix
			let stripeInitFormData = getFormClient()
			stripeInitFormData.append('api_method', 'stripe_init')
			stripeInitFormData.append('user_id', user._id)
			stripeInitFormData.append('amount', amount)
			stripeInitFormData.append('code', code)

			const stripeInitRes = await post(server_domain, stripeInitFormData)
			const { clientSecret } = stripeInitRes.data
			if (!clientSecret) return somethingWrong()

			if (amount > 0) {
				// 3. Pass clientSecret and get the payment
				const paymentResult = await stripe.confirmCardPayment(clientSecret, {
					payment_method: {
						card: elements.getElement(CardElement),
						billing_details: { name: user.first_name + ' ' + user.last_name, email: user.email },
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
						capturePaymentFormData.append('user_id', user._id)
						capturePaymentFormData.append('amount', amount)
						capturePaymentFormData.append('code', code)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)

						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', user._id)
						membershipLogFormData.append('amountNUM', amount)
						let __code = 'purch_logo'
						if (__TYPE === 'adverts') {
							__code = 'purch_advert'
						} else if (__TYPE === 'advertp') {
							__code = 'ad_subs'
						}
						membershipLogFormData.append('code', __code)
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						setPaymentModal(false)
						setDoneModal(true)
					} else {
						somethingWrong()
					}
				}
			} else {
				// 3. Pass clientSecret and get the payment
				const setupResult = await stripe.confirmCardSetup(clientSecret, {
					payment_method: {
						card: elements.getElement(CardElement),
						billing_details: { name: user.first_name + ' ' + user.last_name, email: user.email },
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
						capturePaymentFormData.append('user_id', user._id)
						capturePaymentFormData.append('amount', amount)
						capturePaymentFormData.append('code', code)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)

						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', user._id)
						membershipLogFormData.append('amountNUM', amount)
						let __code = 'purch_logo'
						if (__TYPE === 'adverts') {
							__code = 'purch_advert'
						} else if (__TYPE === 'advertp') {
							__code = 'ad_subs'
						}
						membershipLogFormData.append('code', __code)
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						setPaymentModal(false)
						setDoneModal(true)
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

	return (
		<>
			<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-md mt-3' centered>
				<CloseModalBtn
					onClick={() => onClose(!isShow)}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
				<ModalBody className='py-4 px-5'>
					{checking ? (
						<>
							<div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 200 }}>
								<span className='spinner-border text-success' style={{ fontSize: 22, width: 50, height: 50 }}></span>
								<br />
								<h6>Checking...</h6>
							</div>
						</>
					) : (
						<>
							{requests.length > 0 ? (
								<div
									className='d-flex flex-column justify-content-center align-items-center'
									style={{ minHeight: 200 }}
								>
									<TiInfo size={50} color={vars.secondaryColor} />
									<br />
									<h6>{reqExistMsg || 'You already have pending design request.'}</h6>
								</div>
							) : (
								<>
									<Row justify='center'>
										<Col span={24}>
											<h4 className='section-title text-center mt-4' style={{ fontWeight: '500', fontSize: 22 }}>
												Purchase Design
											</h4>
										</Col>
										<Col span={24}>
											<p className='text-center'>You have chosen to purchase a design from us!</p>
											<p className='text-center'>You have selected:</p>
											<p className='text-center my-4'>
												You have selected: <strong>{selectedTitle}</strong>
											</p>
											<p className='text-center'>
												Once of design cost: <strong>${designCost}</strong>
											</p>
										</Col>
									</Row>
									<form className='mt-3'>
										{isErr && (
											<div className='mb-3'>
												<Alert color='danger' toggle={() => setIsErr(false)}>
													{errMsg}
												</Alert>
											</div>
										)}

										<p className='text-center' style={{ lineHeight: 1.3 }}>
											{subtitleTxt}
										</p>
										<textarea
											type='text'
											style={{ width: '100%', border: '1px solid #ccc', borderRadius: 5, padding: 5 }}
											placeholder='Max 500 characters...'
											rows='4'
											maxLength={500}
											name='details'
											value={form.details}
											onChange={onFormChanged}
										/>

										<p className='text-center my-3' style={{ lineHeight: 1.3 }}>
											{subtitleTxt2}
										</p>

										<Row gutter={[16, 10]} className='mb-4'>
											<Col span={24} md={12}>
												<input
													type='file'
													name='file1'
													accept='image/*'
													onChange={onChangeFile}
													className='purchase-file-input'
												/>
											</Col>
											<Col span={24} md={12}>
												<input
													type='file'
													name='file2'
													accept='image/*'
													onChange={onChangeFile}
													className='purchase-file-input'
												/>
											</Col>
											<Col span={24} md={12}>
												<input
													type='file'
													name='file3'
													accept='image/*'
													onChange={onChangeFile}
													className='purchase-file-input'
												/>
											</Col>
										</Row>

										<div className='d-flex justify-content-center mb-4'>
											<button
												type='button'
												className='btn btn-solid btn-default-plan btn-post btn-sm w-100'
												onClick={onContinueClick}
												disabled={loading ? true : false}
											>
												{loading ? 'Loading...' : `${__justSend ? 'Send' : 'Continue to Payment'}`}
												{loading && <span className='spinner-border spinner-border-sm mr-1'></span>}
											</button>
										</div>
									</form>
								</>
							)}
						</>
					)}
				</ModalBody>
			</Modal>
			<Modal isOpen={paymentModal} toggle={() => {}} className='modal-md mt-3' centered>
				<ModalBody className='py-4 px-5'>
					<Row justify='center'>
						<Col span={24}>
							<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
								Complete Payment
							</h4>
						</Col>
					</Row>
					<form className='mt-3' onSubmit={payMoney}>
						<div className='d-flex flex-column align-items-center'>
							<CardUI className='mb-4'>
								<h4 className='my-3 d-flex justify-content-between align-items-center'>
									<span>{paymentTitle1}</span>
									<strong>{paymentValue1}</strong>
								</h4>
								<h4 className='d-flex justify-content-between align-items-center'>
									<span>{paymentTitle2}</span>
									<span>
										<strong>{paymentValue2}</strong>
									</span>
								</h4>
							</CardUI>
							<CardWrapper>
								<CardElement
									className='card'
									options={{
										hidePostalCode: true,
										style: {
											base: { backgroundColor: 'white', width: '100%' },
										},
									}}
								/>
							</CardWrapper>
							<div className='d-flex justify-content-center my-4'>
								<button
									className='pay-button btn btn-solid btn-default-plan btn-post btn-sm w-100'
									onClick={() => {}}
									disabled={paymentLoading ? true : false}
								>
									{paymentLoading ? 'Processing...' : `Pay ${designCost || amount} USD`}
									{paymentLoading && <span className='spinner-border spinner-border-sm mr-1'></span>}
								</button>
							</div>
						</div>
					</form>
				</ModalBody>
			</Modal>
			<Modal isOpen={doneModal} toggle={() => {}} className='modal-md mt-3' centered>
				<ModalBody className='py-4 px-5'>
					<Row justify='center'>
						<Col span={24}>
							<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
								Payment successful
							</h4>
						</Col>

						<Col span={24}>
							<p className='text-center mt-4' style={{ lineHeight: 1.4, fontSize: 17 }}>
								Please check your inbox for your confirmation of {mainTypeTitle}.
							</p>
							<p className='text-center mt-2' style={{ lineHeight: 1.4, fontSize: 17 }}>
								{lastLine}
							</p>
						</Col>

						<Col span={24}>
							<div className='text-center mt-4'>
								<button className='btn btn-solid btn-default-plan btn-post btn-sm' onClick={() => purchaseDoneCall()}>
									Back
								</button>
							</div>
						</Col>
					</Row>
				</ModalBody>
			</Modal>
		</>
	)
}

export default LogoBannerPurchaseForm
