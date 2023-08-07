import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Row, Col } from 'antd-grid-layout'
import { Modal, ModalHeader, ModalBody, Input, Label, Alert, FormGroup } from 'reactstrap'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { MessengerContext } from '../../helpers/messenger/MessengerContext'
import { server_domain } from '../../services/constants'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import ForgotPassForm from './ForgotPassForm'
import { toast } from 'react-toastify'

const SigninForm = (props) => {
	const { isShow, onClose, msg } = props

	const router = useRouter()

	const authContext = useContext(AuthContext)
	
	const onAuth = authContext.onAuth
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const targetPath = authContext.targetPath

	const messengerContext = useContext(MessengerContext)
	const onUser = messengerContext.onUser

	const [resetModal, setResetModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const [isErr, setIsErr] = useState(false)
	const [form, setForm] = useState({ email: '', password: '' })

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

	const onSigninClicked = async () => {
		if (!form.email || !form.password) {
			setIsErr(true)
			setErrMsg('None-empty field is required.')
			return
		}

		let formData = getFormClient()
		formData.append('api_method', 'login')
		formData.append('login_email', form.email)
		formData.append('login_password', form.password)

		try {
			setLoading(true)
			const response = await post(server_domain, formData)
			if (response.data.message === 'SUCCESS') {
				const user = response.data.data

				const apiResponse = await fetch('/api/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ user: user }),
				})

				if (apiResponse.ok) {
					// setting authenticated user information into the state of _app component
					onAuth(user, true)
					onUser(user)

					// saving the user information into localStorage
					localStorage.setItem('isAuthenticated', 'done')
					localStorage.setItem('user', JSON.stringify(user))

					// closing modal
					setForm({ email: '', password: '' })
					onClose(!isShow, 'logged-in')

					let target = null
					if (targetPath.pathname) {
						target = {
							pathname: `/${user.role}` + targetPath.pathname,
						}
						if (targetPath.query) {
							target = { ...target, query: targetPath.query }
						}
					} else if (targetPath === '/dashboard') {
						target = `/${user.role}` + targetPath
					} else {
						target = targetPath
					}
					router.push(target)
				}
			} else if (response.data.error) {
				somethingWrong(response.data.message)
			}
		} catch (err) {
			somethingWrong(err.toString())
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-md' centered>
				<CloseModalBtn
					onClick={() => onClose(!isShow)}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>

				<ModalBody className='py-4 px-5'>
					<Row justify='center'>
						<Col span={24}>
							<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
								Welcome back
							</h4>
						</Col>
						<Col span={24}>
							<p className='text-center'>Enter your account details below</p>
						</Col>
					</Row>
					<form className='mt-4'>
						{isErr && (
							<div className='mb-3'>
								<Alert color='danger' toggle={() => setIsErr(false)}>
									{errMsg}
								</Alert>
							</div>
						)}
						{msg && (
							<div className='mb-3'>
								<Alert color='primary'>{msg}</Alert>
							</div>
						)}
						<div className='input-group mb-3 mt-2'>
							<input
								type='email'
								className='form-control'
								name='email'
								placeholder='Email Address'
								value={form.email}
								onChange={onFormChanged}
							/>
						</div>
						<div className='input-group mb-1'>
							<input
								type='password'
								className='form-control'
								name='password'
								placeholder='Password'
								value={form.password}
								onChange={onFormChanged}
							/>
						</div>
						<a href='#'
							onClick={() => {
								setResetModal(true)
							}}
							className='nav-link-style fs-ms signLink'
							style={{ color: '#20963d', cursor: 'pointer' }}
						>
							Forgot your password?
						</a>

						<div className='d-flex justify-content-center my-3'>
							<button
								type='button'
								className='btn btn-solid btn-default-plan btn-post btn-sm'
								onClick={onSigninClicked}
								disabled={loading}
								style={{ width: '100%' }}
							>
								{loading ? 'Loading...' : 'Sign In'}
								{loading && <span className='spinner-border spinner-border-sm'></span>}
							</button>
						</div>
						<div className='mb-4 d-flex justify-content-between align-items-center'>
							<div className='form-check'>
								<Input className='form-check-input' type='checkbox' id='keep-signed' />
								<Label className='form-check-label fs-sm' for='keep-signed'>
									Keep me signed in
								</Label>
							</div>
						</div>
						<hr />
						<div className='text-center'>
							Don't have an account yet?{' '}
							<a href='#' style={{ cursor: 'pointer', color: '#20963d' }} onClick={() => onAuthModalsTriggered('user_type')}>
								Create one
							</a>
						</div>
					</form>
				</ModalBody>
			</Modal>
			<ForgotPassForm isShow={resetModal} onClose={() => setResetModal(false)} />
		</>
	)
}

export default SigninForm
