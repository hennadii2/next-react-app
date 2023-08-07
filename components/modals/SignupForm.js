import React, { useContext, useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, Input, Label, Alert } from 'reactstrap'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import { getFormClient, server_domain } from '../../services/constants'
import { post } from '../../services/axios'
import { AuthContext } from '../../helpers/auth/AuthContext'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { Row, Col } from 'antd-grid-layout'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'
import moment from 'moment'
import styled from 'styled-components'
import { capitalize, getMembershipData } from '../../helpers/utils/helpers'
import isEmail from 'is-email'
import { Elements, CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import ReCAPTCHA from "react-google-recaptcha"
import getStripePromise from '../../helpers/utils/get-stripe'

const recaptchaSiteKey = '6LeQxnQiAAAAAC_0GIzdcxTx-MPKzN22GCqV5-Ez'

const SignupForm = (props) => {
	const { isShow, onClose, onGoBack, userTypeId, membershipTypeId, additionalInfo } = props	
	// console.log(additionalInfo)
	const authContext = useContext(AuthContext)
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const settingContext = useContext(SettingContext)
	const types = settingContext.appData.users_types
	const userTypes = types.filter((type) => type.name !== 'Admin')
	const membershipTypes = settingContext.appData.membership_types
	const [paymentModal, setPaymentModal] = useState(false)	

	const [loading, setLoading] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const [isErr, setIsErr] = useState(false)
	const [newUser, setNewUser] = useState({})
	const [doneModal, setDoneModal] = useState(false)
	const [agreed, setAgreed] = useState(false)
	const [captcha, setCaptcha] = useState(null)

	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		userType: '',
		membershipType: '',
	})

	const userTypeOptions = userTypes.map((type) => ({
		label: type.name,
		value: type._id,
	}))

	const selectedUserTypeInfo = userTypes.find((x) => x._id === form.userType)
	const membershipOptions = membershipTypes
		.filter((x) => {
			if (x.code.toLowerCase() === selectedUserTypeInfo?.name?.toLowerCase()) {
				return true
			} else {
				return false
			}
		})
		.map((type) => ({
			label: type.name,
			value: type._id,
		}))

	const selectedMembershipTypeItem = membershipOptions.find((x) => x.value === form.membershipType)
	console.log('selectedMembershipTypeItem', selectedMembershipTypeItem);

	const onFormChanged = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
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

	const regDoneCall = () => {
		// closing modal
		setForm({
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			userType: '',
			membershipType: '',
		})
		onClose(!isShow)
		setDoneModal(false)
		onAuthModalsTriggered('login', 'Thanks for signing up! Login below to start.')
	}

	const onRecaptchChange = (value) => {
		setCaptcha(value)
	}

	const onSignupClicked = async () => {
		// 1. Validation & Reset
		setIsErr(false)
		setErrMsg('')

		if (!agreed) {
			setIsErr(true)
			setErrMsg('Please accept our Terms & Conditions.')
			return
		}

		if (!form.firstName || !form.lastName || !form.email || !form.password) {
			setIsErr(true)
			setErrMsg('None-empty field is required.')
			return
		}

		if (form.password !== form.confirmPassword) {
			setIsErr(true)
			setErrMsg('Password is not matched.')
			return
		}

		if (!isEmail(form.email)) {
			setIsErr(true)
			setErrMsg('Email is invalid.')
			return
		}

		if (!captcha) {
			setIsErr(true)
			setErrMsg('Please check the reCatcha')
			return
		}

		// 2. Original Registration Request to get new_user_id
		let formData = getFormClient()
		formData.append('api_method', 'register')
		formData.append('first_name', form.firstName)
		formData.append('last_name', form.lastName)
		formData.append('email', form.email)
		formData.append('password', form.password)
		formData.append('typeISbb_agrix_users_typesID', form.userType)
		formData.append('membershipISbb_agrix_membership_typesID', form.membershipType)

		try {
			setLoading(true)
			const response = await post(server_domain, formData)
			if (response.data.message === 'SUCCESS') {
				const { new_user_id } = response.data
				const _newUser = response.data?.data || {}
				if (!new_user_id) return somethingWrong()
				setNewUser({ new_user_id, ..._newUser })
				if (selectedMembershipTypeItem?.label === 'Blue') return regDoneCall()
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

	const successPayment = () => {
		setPaymentModal(false)
		setDoneModal(true)
	}

	useEffect(() => {
		setForm({ ...form, userType: userTypeId, membershipType: membershipTypeId })
	}, [userTypeId, membershipTypeId])

	return (
		<>
			<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-md mt-3' centered>
				<div onClick={() => onGoBack()} className='go-back'>Go back</div>
				<CloseModalBtn
					onClick={() => onClose(!isShow)}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
				<ModalBody className='py-4 px-5'>
					<Row justify='center'>
						<Col span={24}>
							<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
								Create Account
							</h4>
						</Col>
						<Col span={24}>
							<p className='text-center'>Complete your details below</p>
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
						<div className='input-group mb-3 mt-2'>
							<input
								type='text'
								className='form-control'
								name='firstName'
								placeholder='First Name'
								value={form.firstName}
								onChange={onFormChanged}
							/>
						</div>
						<div className='input-group mb-3'>
							<input
								type='text'
								className='form-control'
								name='lastName'
								placeholder='Last Name'
								value={form.lastName}
								onChange={onFormChanged}
							/>
						</div>
						<div className='input-group mb-3'>
							<input
								type='email'
								className='form-control'
								name='email'
								placeholder='Email Address'
								value={form.email}
								onChange={onFormChanged}
							/>
						</div>
						<div className='input-group mb-3'>
							<input
								type='password'
								className='form-control'
								name='password'
								placeholder='Password'
								value={form.password}
								onChange={onFormChanged}
							/>
						</div>
						<div className='input-group mb-3'>
							<input
								type='password'
								className='form-control'
								name='confirmPassword'
								placeholder='Confirm Password'
								value={form.confirmPassword}
								onChange={onFormChanged}
							/>
						</div>
						<div className='input-group mb-0'>
							<Select
								className={`w-100`}
								style={{ height: 38, borderColor: '#ced4da', display: 'none' }}
								options={userTypeOptions}
								placeholder='Select user type'
								name='userType'
								value={form.userType}
								onChange={(val) => {
									setForm({ ...form, userType: val?.value })
								}}
								menuPortalTarget={document.body}
							/>
						</div>
						<div className='input-group mb-0'>
							<Select
								className={`w-100`}
								style={{ height: 38, borderColor: '#ced4da', display: 'none' }}
								options={membershipOptions}
								placeholder='Select membership type'
								name='membershipType'
								value={form.membershipType}
								onChange={(val) => {
									setForm({ ...form, membershipType: val?.value })
								}}
								menuPortalTarget={document.body}
							/>
						</div>
						<div className='input-group mb-3'>
						<ReCAPTCHA
							sitekey={recaptchaSiteKey}
							onChange={onRecaptchChange}
							className='recaptchField'
						/>
						</div>
						<div className='form-check mb-3'>
							<Input
								checked={agreed}
								onChange={(e) => {
									setAgreed(e.target.checked)
								}}
								className='form-check-input'
								type='checkbox'
								id='keep-signed'
							/>
							<Label className='form-check-label fs-sm' for='keep-signed'>
								<span className='signLink' style={{ color: 'gray', userSelect: 'none' }}>
									I agree to the{' '}
									<span
										style={{ color: '#20963d', cursor: 'pointer' }}
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											window.open('/terms', '_blank')
										}}
									>
										Terms & Conditions
									</span>
								</span>
							</Label>
						</div>
						<div className='d-flex justify-content-center mb-4'>
							<button
								type='button'
								className='btn btn-solid btn-default-plan btn-post btn-sm w-100'
								onClick={onSignupClicked}
								disabled={loading ? true : false}
							>
								{loading
									? 'Loading...'
									: `${selectedMembershipTypeItem?.label === 'Blue' ? 'Sign Up' : 'Register and save card details'}`}
								{loading && <span className='spinner-border spinner-border-sm mr-1'></span>}
							</button>
						</div>
						<hr />
						<div className='text-center'>
							Already have an account?{' '}
							<a href='#' style={{ cursor: 'pointer', color: '#20963d' }} onClick={() => onAuthModalsTriggered('login')}>
								Sign in
							</a>
						</div>
					</form>
				</ModalBody>
			</Modal>
			<SignupPaymentWrapper
				newUser={newUser}
				isShow={paymentModal}
				additionalInfo={additionalInfo}
				selectedMembershipTypeItem={selectedMembershipTypeItem}
				onClose={() => setPaymentModal(false)}
				success={successPayment}
			/>	
			<Modal isOpen={doneModal} toggle={() => {}} className='modal-md mt-3' centered>
				<ModalBody className='py-4 px-5'>
					<Row justify='center'>
						<Col span={24}>
							<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
								Payment successful
							</h4>
						</Col>

						<Col span={24}>
							<p className='text-center mt-4-5' style={{ lineHeight: 1.4, fontSize: 17 }}>
								Please check your inbox for your confirmation of Subscription.
							</p>
						</Col>

						<Col span={24}>
							<div className='text-center mt-4-5'>
								<button className='btn btn-solid btn-default-plan btn-post btn-sm' onClick={() => regDoneCall()}>
									<i className='fa fa-sign-in' aria-hidden='true'></i> Login
								</button>
							</div>
						</Col>
					</Row>
				</ModalBody>
			</Modal>
		</>
	)
}

export default SignupForm

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

export const SignupPaymentWrapper = ({newUser, isShow, additionalInfo, selectedMembershipTypeItem, onClose, success}) => {
	const stripePublicKey = newUser.stripe_public_key
	const stripePromise = getStripePromise(stripePublicKey)
	return (
		<Elements stripe={stripePromise}>
			<SignupPaymentForm
				newUser={newUser}
				isShow={isShow}
				additionalInfo={additionalInfo}
				selectedMembershipTypeItem={selectedMembershipTypeItem}
				onClose={onClose}
				success={success}
			/>
		</Elements>
	)
}

export const SignupPaymentForm = ({newUser, isShow, additionalInfo, selectedMembershipTypeItem, onClose, success}) => {

	const stripe = useStripe()
	const elements = useElements()

	const [paymentLoading, setPaymentLoading] = useState(false)
	const { period = ''} = additionalInfo?.register || {}
	const payAmount = getMembershipData(additionalInfo?.register).amount
	const renewalDate = getMembershipData(additionalInfo?.register).renewalDate
	
	const amount = parseFloat(0).toFixed(2);

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
		if (!stripe || !elements) return somethingWrong()

		try {
			setPaymentLoading(true)
			// 2. Call stripe_init to get the client secret
			const { new_user_id, first_name, last_name, email } = newUser
			const now = new Date()
			const shortMonthName = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
			const day = now.getDate()
			const year = now.getFullYear()
			const suffix = `.${new_user_id}.${nanoid()}`
			const code =
				period === '__monthly'
					? `MEM-MONTH-${day}-${shortMonthName}-${year}` + suffix
					: `MEM-YEAR-${day}-${shortMonthName}-${year}` + suffix
			let stripeInitFormData = getFormClient()
			stripeInitFormData.append('api_method', 'stripe_init')
			stripeInitFormData.append('user_id', new_user_id)
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
						capturePaymentFormData.append('user_id', new_user_id)
						capturePaymentFormData.append('amount', amount)
						capturePaymentFormData.append('code', code)
						
						capturePaymentFormData.append('membership_type', selectedMembershipTypeItem?.value)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)
	
						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', new_user_id)
						membershipLogFormData.append('amountNUM', amount)
						membershipLogFormData.append('code', 'mem_subs')
						
						membershipLogFormData.append(
							'membership_typeISbb_agrix_membership_typesID',
							selectedMembershipTypeItem?.value
						)
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						success();
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
						capturePaymentFormData.append('user_id', new_user_id)
						capturePaymentFormData.append('amount', amount)
						capturePaymentFormData.append('code', code)
						
						capturePaymentFormData.append('membership_type', selectedMembershipTypeItem?.value)
						const capturePaymentRes = await post(server_domain, capturePaymentFormData)
						console.log('Capture payment response:', capturePaymentRes.data)
	
						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', new_user_id)
						membershipLogFormData.append('amountNUM', amount)
						membershipLogFormData.append('code', 'mem_subs')
						
						membershipLogFormData.append(
							'membership_typeISbb_agrix_membership_typesID',
							selectedMembershipTypeItem?.value
						)
						const membershipLogRes = await post(server_domain, membershipLogFormData)
						console.log('Log response:', membershipLogRes.data)
						// 5. Close and redirect with success message
						toast.success('Payment successful.')
						success();
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
		<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-md mt-3' centered>
			<CloseModalBtn
				onClick={() => onClose(!isShow)}
				styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
				iconProps={{ color: 'gray' }}
			/>
			<ModalBody className='py-4 px-5'>
				<Row justify='center'>
					<Col span={24}>
						<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
							Complete Registration
						</h4>
					</Col>
				</Row>
				<form className='mt-3' onSubmit={payMoney}>
					<div className='d-flex flex-column align-items-center'>
						<CardUI className='mb-4'>
							<h4 className='d-flex justify-content-between align-items-center'>
								<span>Agrixchange subscription:</span>
								<span>
									<strong>{selectedMembershipTypeItem?.label}</strong>
								</span>
							</h4>
							<h4 className='my-3 d-flex justify-content-between align-items-center'>
								<span>Subscription Type:</span>
								<strong>{capitalize(period.replace('__', ''))}</strong>
							</h4>
							<h4 className='d-flex justify-content-between align-items-center'>
								<span>Total:</span>
								<span>
									<strong>{payAmount}</strong>
								</span>
							</h4>
							<p className='text-center mt-4 text-success' style={{ fontSize: 16, color: '#000', lineHeight: '1.5'}}>
								{`Please note: You are currently on a Free Trial period for a month, charges will commence on (${renewalDate})`}
							</p>
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
								{paymentLoading ? 'Processing...' : `Save Card details`}
								{paymentLoading && <span className='spinner-border spinner-border-sm mr-1'></span>}
							</button>
						</div>
					</div>
				</form>
			</ModalBody>
		</Modal>
	)
}

