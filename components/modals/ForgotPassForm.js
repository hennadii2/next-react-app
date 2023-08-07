import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Row, Col } from 'antd-grid-layout'
import { Modal, ModalHeader, ModalBody, Input, Label, Alert, FormGroup } from 'reactstrap'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { server_domain } from '../../services/constants'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'

const ForgotPassForm = (props) => {
	const { isShow, onClose, msg } = props

	const [loading, setLoading] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const [isErr, setIsErr] = useState(false)
	const [form, setForm] = useState({ email: '' })

	const onFormChanged = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const onResetClicked = async () => {
		if (!form.email) {
			setIsErr(true)
			setErrMsg('None-empty field is required.')
			return
		}

		let formData = getFormClient()
		formData.append('api_method', 'password_reset')
		formData.append('email', form.email)

		try {
			setLoading(true)
			const response = await post(server_domain, formData)
			if (response.data.message === 'SUCCESS') {
				setForm({ email: '' })
				onClose(!isShow)
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		} finally {
			setLoading(false)
		}
	}

	return (
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
							Let’s reset your password
						</h4>
					</Col>
					<Col span={24}>
						<p className='text-center'>Enter your email address below to receive reset link</p>
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

					<div className='d-flex justify-content-center my-3'>
						<button
							type='button'
							className='btn btn-solid btn-default-plan btn-post btn-sm'
							onClick={onResetClicked}
							disabled={loading}
							style={{ width: '100%' }}
						>
							{loading ? 'Loading...' : 'Send Link'}
							{loading && <span className='spinner-border spinner-border-sm'></span>}
						</button>
					</div>

					<hr />
					<div className='text-center'>
						Remembered your password?{' '}
						<a href='#' style={{ cursor: 'pointer', color: '#20963d' }} onClick={onClose}>
							Sign in
						</a>
					</div>
				</form>
			</ModalBody>
		</Modal>
	)
}

export default ForgotPassForm
