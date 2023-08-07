import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Modal, ModalHeader, ModalBody, Input, Label, Alert } from 'reactstrap'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import { getFormClient, server_domain } from '../../services/constants'
import { post } from '../../services/axios'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'
import moment from 'moment'
import styled from 'styled-components'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const ChangeCardFrom = (props) => {
	const { isShow, onClose, additionalInfo, onComplete } = props
	const stripe = useStripe()
	const elements = useElements()
	
	const [paymentLoading, setPaymentLoading] = useState(false)
	const cardAmount = 0.5
	const { period = '', membershipType, membershipTypesID, user } = additionalInfo.ChangeCard || {}
	const nextDate = moment()
		.add(1, period === '__monthly' ? 'months' : 'years')
		.calendar()
	
	
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
			const now = new Date()
			const shortMonthName = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
			const day = now.getDate()
			const year = now.getFullYear()
			const suffix = `.${long_id}.${nanoid()}`
			const code =
				period === '__monthly'
					? `MEM-MONTH-${day}-${shortMonthName}-${year}` + suffix
					: `MEM-YEAR-${day}-${shortMonthName}-${year}` + suffix
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
						
						capturePaymentFormData.append('membership_type', membershipType)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)

						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', long_id)
						membershipLogFormData.append('amountNUM', cardAmount)
						membershipLogFormData.append('code', 'mem_subs')
						
						membershipLogFormData.append(
							'membership_typeISbb_agrix_membership_typesID',
							membershipTypesID
						)
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						onClose(false)
						onComplete(true)
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
						
						capturePaymentFormData.append('membership_type', membershipType)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)

						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', long_id)
						membershipLogFormData.append('amountNUM', cardAmount)
						membershipLogFormData.append('code', 'mem_subs')
						
						membershipLogFormData.append(
							'membership_typeISbb_agrix_membership_typesID',
							membershipTypesID
						)
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						onClose(false)
						onComplete(true)
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

	useEffect(() => {
		
	}, [])

	return (
		<>
			<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-md' centered>
				<ModalHeader toggle={() => onClose(!isShow)}>Save Payment Card1</ModalHeader>
				<ModalBody className='px-4 pb-3'>
					<div className='my-4'>
						<p className='text-center' style={{ lineHeight: 1.4, fontSize: 17 }}>
							We take a $0.50 payment to authorise and secure your card for future payments
						</p>
					</div>
					<div className='my-4 py-2 d-flex justify-content-between mb-4' style={{ borderTop: 'solid 1px #ccc' }}>
						<div style={{ lineHeight: 1.4, fontSize: 17 }}>Total:</div>
						<div style={{ lineHeight: 1.4, fontSize: 17, color:'red' }}>{`$${cardAmount}`}</div>
					</div>
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
							
					<div className='d-flex justify-content-center mb-4'>
						<button
							className='pay-button btn btn-solid btn-default-plan btn-post btn-sm w-100'
							onClick={payMoney}
							disabled={paymentLoading ? true : false}
						>
							{paymentLoading ? 'Processing...' : `Pay $${cardAmount} USD`}
							{paymentLoading && <span className='spinner-border spinner-border-sm mr-1'></span>}
						</button>
					</div>
				</ModalBody>
			</Modal>
		</>
	)
}

export default ChangeCardFrom

export const CardWrapper = styled.div`
	box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
	display: flex;
	align-items: center;
	height: 42px;
	width: 100%;
	padding: 0 15px;
	border-radius: 5px;
`

export const CardUI = styled.div`
	width: 100%;
	background-color: #fff;
	border-radius: 5;
	padding: 1.5rem;
	box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`
