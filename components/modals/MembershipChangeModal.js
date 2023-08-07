import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Modal, ModalHeader, ModalBody, Input, Label, Alert, Button } from 'reactstrap'
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
import {
	capitalize,
	getBase64,
	blobToBase64,
	getFileObjForAjax,
	getNextMonthFirst,
	isEmpty,
} from '../../helpers/utils/helpers'
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import vars from '../../helpers/utils/vars'

const MembershipChangeModal = (props) => {
	const { isShow, onClose, additionalInfo } = props
	// const stripe = useStripe()
	// const elements = useElements()
	// console.log(additionalInfo)
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuth = authContext.onAuth
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	// const settingContext = useContext(SettingContext)
	// const planTypes = settingContext.appData.membership_types
	// const [paymentLoading, setPaymentLoading] = useState(false)
	const [fetching, setFetching] = useState(false)
	const [userInfo, setUserInfo] = useState({})

	const getUserInfo = async (e) => {
		try {
			setFetching(true)
			let formData = getFormClient()
			formData.append('api_method', 'validate_session')
			formData.append('user_id', user._id)
			formData.append('session_id', user.session_id)

			const response = await post(server_domain, formData)
			console.log('-----------User info response:', response.data)
			setUserInfo(response.data)
		} catch (error) {
			console.log(error)
			showMessage(error.toString())
		} finally {
			setFetching(false)
		}
	}

	useEffect(() => {
		isShow && getUserInfo()
	}, [isShow])

	const { period, name, numeric_id, membership_year_priceNUM, membership_month_priceNUM } =
		additionalInfo?.MembershipChange || {}
	const selected_price =
		period === '__yearly' ? Number(membership_year_priceNUM).toFixed(2) : Number(membership_month_priceNUM).toFixed(2)
	const selected_period = period === '__yearly' ? 'yearly' : 'monthly'
	const nextDate = moment()
		.add(1, period === '__monthly' ? 'months' : 'years')
		.calendar()

	// console.log('Additional Info:', additionalInfo?.MembershipChange)

	// const [paymentModal, setPaymentModal] = useState(false)
	// const [doneModal, setDoneModal] = useState(false)
	const [saving, setSaving] = useState(false)

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

	// const purchaseDoneCall = () => {
	// 	// closing modal
	// 	onClose()
	// 	setDoneModal(false)
	// }

	const handleChangeSubscription = async () => {
		try {
			setSaving(true)
			const { _id, session_id } = user

			let formData = getFormClient()
			formData.append('api_method', 'change_subscription')
			formData.append('user_id', _id)
			formData.append('session_id', session_id)
			formData.append('new_membership_type_id', numeric_id)
			formData.append('new_membership_period', period === '__yearly' ? 'YEAR' : 'MONTH')

			const response = await post(server_domain, formData)
			console.log('change_subscription api response:', response.data)
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
				setSaving(false)
				onClose()
				setTimeout(() => window.location.reload(), 500)
			} else if (response.data.error) {
				showMessage(response.data.message)
			}
		} catch (error) {
			console.log(error)
			setSaving(false)
			showMessage(error.toString())
		} finally {
			setSaving(false)
		}
	}

	const { cycle_period = '', amount: current_price = 0 } = userInfo?.subs || {}
	const current_period = cycle_period.toLowerCase()

	// console.log({ selected_period, current_period })

	let message = ''
	let shouldTakePayment = false

	if (current_period === 'monthly' && selected_period === 'monthly') {
		if (Number(current_price) < Number(selected_price)) {
			// Upgrade
			message = (
				<>
					You are changing your subscription type to a <b>{capitalize(selected_period)}</b> subscription that will have
					a new subscription fee of
					<b>${selected_price} a month</b>, recurring until canceled. Your saved card will be charged pro rata for the
					remainder of the month and your new subscription amount will be charged on the 1st of next month.
				</>
			)
		} else {
			message = (
				<>
					You are changing your subscription type to a <b>{capitalize(selected_period)}</b> subscription that will have
					a new subscription fee of <b>${selected_price} a month</b>, recurring until canceled. This membership change
					will happen immediately and you will be credited back on your original card pro rata for the remainder of the
					month. Your new subscription amount will be charged on the 1st of next month.
				</>
			)
		}
	} else if (current_period === 'monthly' && selected_period === 'yearly') {
		shouldTakePayment = true
		message = (
			<>
				You are changing your subscription type to a <b>{capitalize(selected_period)}</b> subscription. This will have a
				new subscription fee of <b>${selected_price} a year</b>, recurring until canceled. Your subscription will change
				instantly with your monthly payments canceled, and your renewal date will be in a year. Please confirm below to
				authorize the yearly payment to be debited from your saved card.
			</>
		)
	} else if (current_period === 'yearly' && selected_period === 'monthly') {
		message = (
			<>
				You are changing your subscription type to a <b>{capitalize(selected_period)}</b> subscription. This will have a
				new subscription fee of <b>${selected_price} a month</b>, recurring until canceled. Your saved card will be
				charged a pro rata amount for the remainder of the month and your new subscription amount will be charged on the
				1st of next month
			</>
		)
	} else if (current_period === 'yearly' && selected_period === 'yearly') {
		if (Number(current_price) < Number(selected_price)) {
			// Upgrade
			shouldTakePayment = true
			message = (
				<>
					You are changing your subscription type to a <b>{capitalize(selected_period)}</b> subscription. This will have
					a new subscription fee of <b>${selected_price} a year</b>, recurring until canceled. Your subscription will
					change instantly and your renewal date will be in a year. Please confirm below for us to charge your saved
					card for the new year subscription. You will be credited a pro rata amount for the reminder of your previous
					subscription.
				</>
			)
		} else {
			message = (
				<>
					You are changing your subscription type to a <b>{capitalize(selected_period)}</b> subscription. This will have
					a new subscription fee of <b>${selected_price} a year</b>, recurring until canceled. Your subscription will
					change instantly and your renewal date will be in a year. Please confirm below for us to charge your saved
					card for the new year subscription. You will be credited a pro rata amount for the reminder of your previous
					subscription.
				</>
			)
		}
	}

	const handleYes = (e) => {
		e.preventDefault()
		handleChangeSubscription()
		// if (shouldTakePayment) {
		// 	setPaymentModal(true)
		// } else {
		// 	// Update logic
		// 	updateUserInfo()
		// }
	}

	return (
		<>
			<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-md mt-3' centered>
				<ModalBody className='py-4 px-5'>
					<Row justify='center'>
						{fetching ? (
							<div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 200 }}>
								<span className='spinner-border text-success' style={{ fontSize: 22, width: 50, height: 50 }}></span>
								<br />
								<h6>Loading...</h6>
							</div>
						) : (
							<>
								{isEmpty(userInfo?.subs) ? (
									<h4 className='text-center mt-4' style={{ color: 'red', fontWeight: '500', fontSize: 20 }}>
										Malformed data found. This user contains previous versions of membership data. Which is not valid
										anymore.
									</h4>
								) : (
									<>
										<Col span={24}>
											<h4 className='section-title text-center mt-4' style={{ fontWeight: '500', fontSize: 22 }}>
												Please Confirm
											</h4>
										</Col>

										<Col span={24}>
											<p className='text-center mt-4' style={{ lineHeight: 1.4, fontSize: 17 }}>
												{message}
											</p>
										</Col>

										<Col span={24}>
											<Row wrap={false} justify='center' gutter={[20, 0]} className='mt-4'>
												<Col>
													<Button disabled={saving} onClick={() => onClose(!isShow)}>
														No, Thanks
													</Button>
												</Col>
												<Col>
													<button
														disabled={saving}
														className='btn btn-solid btn-default-plan btn-subscription btn-post'
														onClick={handleYes}
													>
														{saving ? 'Processing...' : 'Yes, Please'}
														{saving && <span className='spinner-border spinner-border-sm mr-1'></span>}
													</button>
												</Col>
											</Row>
										</Col>

										<Col span={24}>
											<h5
												className='text-center mt-4'
												style={{ color: '#20963d', cursor: 'pointer' }}
												onClick={(e) => {
													e.preventDefault()
													e.stopPropagation()
													window.open('/terms', '_blank')
												}}
											>
												Terms and Conditions Apply
											</h5>
										</Col>
									</>
								)}
							</>
						)}
					</Row>
				</ModalBody>
			</Modal>
			{/* <Modal isOpen={paymentModal} toggle={() => setPaymentModal(false)} className='modal-md mt-3' centered>
				<ModalBody className='py-4 px-5'>
					<Row justify='center'>
						<Col span={24}>
							<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
								You're changing your subscription
							</h4>
						</Col>
					</Row>
					<form className='mt-3' onSubmit={payMoney}>
						<div className='d-flex flex-column align-items-center'>
							<CardUI className='mb-4'>
								<h4 className='d-flex justify-content-between align-items-center'>
									<span>Agrixchange subscription:</span>
									<span>
										<strong>{name}</strong>
									</span>
								</h4>
								<h4 className='my-3 d-flex justify-content-between align-items-center'>
									<span>Subscription Type:</span>
									<strong>{capitalize(selected_period)}</strong>
								</h4>
								<h4 className='d-flex justify-content-between align-items-center'>
									<span>Total:</span>
									<span>
										<strong>${selected_price}</strong>
									</span>
								</h4>
							</CardUI>
							<CardWrapper>
								<CardElement
									className='card'
									options={{ hidePostalCode: true, style: { base: { backgroundColor: 'white', width: '100%' } } }}
								/>
							</CardWrapper>
							<div className='d-flex justify-content-center my-4'>
								<button
									className='pay-button btn btn-solid btn-default-plan btn-post btn-sm w-100'
									onClick={() => {}}
									disabled={paymentLoading || saving ? true : false}
								>
									{paymentLoading || saving ? 'Processing...' : `Pay ${selected_price} USD`}
									{(paymentLoading || saving) && <span className='spinner-border spinner-border-sm mr-1'></span>}
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
								Please check your inbox for your confirmation of Subscription.
							</p>
							<p className='text-center mt-2' style={{ lineHeight: 1.4, fontSize: 17 }}>
								Let's go back
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
			</Modal> */}
		</>
	)
}

export default MembershipChangeModal
