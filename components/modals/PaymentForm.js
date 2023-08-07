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
import { capitalize, getBase64, blobToBase64, getFileObjForAjax, getNextMonthFirst } from '../../helpers/utils/helpers'
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import vars from '../../helpers/utils/vars'

const PaymentForm = (props) => {
	const { isShow, onClose, additionalInfo } = props
	//console.log("additionalInfo", additionalInfo)
	const stripe = useStripe()
	const elements = useElements()
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuth = authContext.onAuth
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const settingContext = useContext(SettingContext)
	const [paymentLoading, setPaymentLoading] = useState(false)
	const {
		__TYPE,
		lastLine = `Let's go back`,
		mainTypeTitle = `Purchase`,
		designCost = 0,
		paymentTitle1,
		paymentTitle2,
		paymentTitle3,
		paymentValue1,
		paymentValue2,
		paymentValue3,
		paymentTitle4,
		paymentValue4,
		onFinishCallback,
		paymentForItem = {},
		finalFinishCallback,
		advertDesignInfo,
	} = additionalInfo?.Payment || {}
	const amount = designCost
	// const nextDate = moment()
	// 	.add(1, period === '__monthly' ? 'months' : 'years')
	// 	.calendar()

	const [doneModal, setDoneModal] = useState(false)

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
		onClose()
		setDoneModal(false)
		finalFinishCallback?.()
	}

	const payMoney = async (e) => {
		e.preventDefault()
		if (!stripe || !elements) return somethingWrong()

		try {
			setPaymentLoading(true)
			// 2. Call stripe_init to get the client secret
			const { numeric_id } = paymentForItem
			const now = new Date()
			const shortMonthName = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
			const day = now.getDate()
			const year = now.getFullYear()
			const suffix = `.${nanoid()}`
			const prefix = (paymentValue4 === 'Premium') ? `ADVERT-P` : `ADVERT-S`			
			const code = `${prefix}-${numeric_id || 'ID'}-${day}-${shortMonthName}-${year}` + suffix
			
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

						await onFinishCallback?.({ stripe_ref })
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
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

						await onFinishCallback?.({ stripe_ref })
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
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
								{paymentTitle4 && (
									<>
										<h5 style={{ opacity: 0.7 }} className='d-flex justify-content-between align-items-center'>
											<span>{paymentTitle4}</span>
											<span>
												<strong>{paymentValue4}</strong>
											</span>
										</h5>
									</>
								)}
								{paymentTitle2 && (
									<h4 className='d-flex justify-content-between align-items-center'>
										<span>{paymentTitle2}</span>
										<span>
											<strong>{paymentValue2}</strong>
										</span>
									</h4>
								)}
								{paymentTitle3 && (
									<>
										<hr />
										<h4 className='d-flex justify-content-between align-items-center'>
											<span>{paymentTitle3}</span>
											<span>
												<strong>{paymentValue3}</strong>
											</span>
										</h4>
									</>
								)}
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

export default PaymentForm
