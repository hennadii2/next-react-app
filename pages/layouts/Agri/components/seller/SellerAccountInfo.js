import React, { useState, useContext, useEffect, Fragment, useRef } from 'react'
import { Button, Col, FormGroup, Label, Row } from 'reactstrap'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import getConfig from 'next/config'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import AlertModal from '../../../../../components/modals/AlertModal'
import Man from '../../../../../public/assets/images/user.png'
import { blobToBase64, getCompressedBase64, getCroppedImg } from '../../../../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const SellerAccountInfo = () => {
	const authContext = useContext(AuthContext)
	const user = authContext.user

	const [isShowAlertModal, setShowAlertModal] = useState(false)
	const [modalMsg, setModalMsg] = useState('')

	const [loading, setIsLoading] = useState(false)
	const [passwordloading, setPasswordLoading] = useState(false)

	const inputImageFile = useRef(null)
	const imgImageRef = useRef(null)
	const [imageSrc, setImageSrc] = useState(null)
	const [editingImage, setEditingImage] = useState(null)
	const [imageCrop, setImageCrop] = useState()
	const [imageCompletedCrop, setImageCompletedCrop] = useState(null)
	const [imageUrl, setImageUrl] = useState(user.profilepictureISfile ? contentsUrl + user.profilepictureISfile : null)
	const [imageBase64, setImageBase64] = useState('')

	const [errors, setErrors] = useState({
		first_name: false,
		last_name: false,
		email: false,
	})

	const [form, setForm] = useState({
		firstName: user.first_name ?? '',
		lastName: user.last_name ?? '',
		email: user.email ?? '',
	})

	const onSaveClicked = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'update_profile')
		formData.append('user_id', user._id)
		formData.append('session_id', user.session_id)
		formData.append('first_name', form.firstName)
		formData.append('last_name', form.lastName)
		formData.append('email', form.email)
		imageBase64 && formData.append('profilepictureISfile', imageBase64)

		try {
			setIsLoading(true)
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				const userInfo = response.data.data
				console.log(userInfo)
				localStorage.setItem('user', JSON.stringify(userInfo))
				const onAuth = authContext.onAuth
				onAuth(userInfo, true)

				setModalMsg('User information has been updated successfully.')
				setShowAlertModal(!isShowAlertModal)
			} else if (response.data.error) {
				alert(response.data.message)
			}
			setIsLoading(false)
		} catch (err) {
			alert(err.toString())
		}
	}

	const onResetPasswordClicked = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'password_reset')
		formData.append('email', form.email)

		try {
			setPasswordLoading(true)
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				setModalMsg('An email with password-reset link has been sent to your mail account.')
				setShowAlertModal(!isShowAlertModal)
			} else if (response.data.error) {
				alert(response.data.message)
			}
			setPasswordLoading(false)
		} catch (err) {
			alert(err.toString())
		}
	}

	const onFormChanged = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const onBlur = (e) => {
		const name = e.target.name
		const value = e.target.value
		if (name === 'firstName')
			if (value === '') setErrors({ ...errors, first_name: true })
			else setErrors({ ...errors, first_name: false })
		if (name === 'lastName')
			if (value === '') setErrors({ ...errors, last_name: true })
			else setErrors({ ...errors, last_name: false })
		if (name === 'email')
			if (value === '') setErrors({ ...errors, email: true })
			else setErrors({ ...errors, email: false })
	}

	function handleImageImageLoad(event) {
		imgImageRef.current = event?.currentTarget

		const { width, height } = event?.currentTarget
		const crop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1 / 1, width, height), width, height)
		setImageCrop(crop)
	}

	function handleSelectImageClick(event) {
		event.preventDefault()
		inputImageFile.current.click()
	}

	async function handleImageEditingDone(_event) {
		setEditingImage(false)
		const imageBlob = await getCroppedImg(imgImageRef.current, imageCompletedCrop, 'Image.png')		
		setImageUrl(URL.createObjectURL(imageBlob))	
		
		const imageBlobToBase64 = await getCompressedBase64(imageBlob)
		setImageBase64(imageBlobToBase64)
	}

	function handleImageEditingCancel(_event) {
		setEditingImage(null)
		setImageUrl(user.profilepictureISfile ? contentsUrl + user.profilepictureISfile : null)
		setImageSrc(null)
	}

	function handleSelectImage(event) {
		if (event?.target?.files?.length) {
			setImageCrop(undefined) // Makes crop preview update between images.
			const reader = new FileReader()
			reader.addEventListener('load', () => {
				setImageSrc(reader?.result?.toString() ?? '')
				setEditingImage(true)
				inputImageFile.current.value = null
			})
			reader.readAsDataURL(event?.target?.files?.[0])
		}
	}

	useEffect(() => {
		setForm({
			firstName: user.first_name ?? '',
			lastName: user.last_name ?? '',
			email: user.email ?? '',
		})
		setImageUrl(user.profilepictureISfile ? contentsUrl + user.profilepictureISfile : Man)
	}, [user]);

	return (
		<Fragment>
			<div className='my-5'>
				{(imageSrc || imageUrl) && (
					<>
						{editingImage && (
							<div className='d-flex justify-content-center'>
								<div style={{ maxWidth: 300 }}>
									<ReactCrop
										keepSelection
										crop={imageCrop}
										onChange={(crop) => setImageCrop(crop)}
										onComplete={(crop) => setImageCompletedCrop(crop)}
										aspect={1 / 1}
									>
										<img
											alt='Image'
											onLoad={handleImageImageLoad}
											src={imageSrc}
											style={{ transform: `scale(1) rotate(0deg)` }}
										/>
									</ReactCrop>
								</div>
							</div>
						)}
					</>
				)}

				{!editingImage && (
					<div className='d-flex justify-content-center'>
						<div
							style={{
								width: 150,
								height: 150,
								backgroundImage: `url(${imageUrl || Man})`,
								backgroundPosition: 'center center',
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat',
								borderRadius: '100%',
								border: '6px solid #bcb7b7',
								boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
							}}
						/>
					</div>
				)}
				<input style={{ display: 'none' }} ref={inputImageFile} onChange={handleSelectImage} type='file' />
				<div className='d-flex justify-content-center mt-4'>
					{editingImage ? (
						<div className='d-flex justify-content-center'>
							<button
								type='button'
								onClick={handleImageEditingDone}
								className='btn btn-solid btn-default-plan btn-post w-100'
							>
								Crop
							</button>
							<Button type='button' className='ml-4' color='danger' outline onClick={handleImageEditingCancel}>
								Cancel
							</Button>
						</div>
					) : (
						<div className='ml-4'>
							<Button type='button' onClick={handleSelectImageClick} className='default-outlined-btn'>
								{imageSrc || imageUrl ? 'Edit Image' : 'Select Image'}
							</Button>
						</div>
					)}
					<Button
						type='button'
						className='default-outlined-btn ml-4'
						onClick={onResetPasswordClicked}
						disabled={passwordloading ? true : false}
					>
						{passwordloading ? 'Loading...' : 'Reset Password'}
						{passwordloading && <span className='spinner-border spinner-border-sm mr-1'></span>}
					</Button>
				</div>
			</div>
			<form className='needs-validation user-add'>
				<Row style={{ justifyContent: 'center' }}>
					<Col md='6'>
						<FormGroup className='row'>
							<Label className='col-xl-3 col-md-4'>
								<span>*</span> First Name
							</Label>
							<input
								className={`form-control col-xl-8 col-md-7 ${errors.first_name ? 'is-invalid' : ''}`}
								name='firstName'
								type='text'
								value={form.firstName}
								onChange={onFormChanged}
								onBlur={onBlur}
							/>
						</FormGroup>
						<FormGroup className='row'>
							<Label className='col-xl-3 col-md-4'>
								<span>*</span> Last Name
							</Label>
							<input
								className={`form-control col-xl-8 col-md-7 ${errors.last_name ? 'is-invalid' : ''}`}
								name='lastName'
								type='text'
								value={form.lastName}
								onChange={onFormChanged}
								onBlur={onBlur}
							/>
						</FormGroup>
						<FormGroup className='row'>
							<Label className='col-xl-3 col-md-4'>
								<span>*</span> Email
							</Label>
							<input
								type='text'
								name='email'
								className={`form-control col-xl-8 col-md-7 ${errors.email ? 'is-invalid' : ''}`}
								value={form.email}
								onChange={onFormChanged}
								onBlur={onBlur}
							/>
						</FormGroup>
						<FormGroup className='my-3 row justify-content-end'>
							<button
								type='button'
								className='btn btn-solid btn-default-plan btn-post btn-sm mr-5'
								onClick={onSaveClicked}
								disabled={loading ? true : false}
							>
								{loading ? 'Loading...' : 'Save Changes'}
								{loading && <span className='spinner-border spinner-border-sm mr-1'></span>}
							</button>
						</FormGroup>
					</Col>
				</Row>
			</form>

			<AlertModal
				isShow={isShowAlertModal}
				onToggle={(isShowAlertModal) => setShowAlertModal(!isShowAlertModal)}
				message={modalMsg}
			/>
		</Fragment>
	)
}

export default SellerAccountInfo
