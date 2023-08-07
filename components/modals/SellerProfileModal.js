import React, { useContext, useEffect, useRef, useState } from 'react'
import getConfig from 'next/config'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Input, Col, Label, Modal, ModalBody, ModalHeader, Row, Button } from 'reactstrap'
import { Alert } from '../../components/common/Alert'
import { NavDropdown } from 'react-bootstrap'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import { isEmpty, getCroppedImg, getCompressedBase64 } from '../../helpers/utils/helpers'
import CountryInput from '../common/Geo/Country'
import RegionInput from '../common/Geo/Region'
import CityInput from '../common/Geo/City'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const SellerProfileForm = ({ modal, toggle }) => {
	const authContext = useContext(AuthContext)
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const user = authContext.user
	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'

	const inputLogoFile = useRef(null)
	const inputCoverFile = useRef(null)

	const imgLogoRef = useRef(null)
	const imgCoverRef = useRef(null)

	const [form, setForm] = useState({
		company_email: user.company_email ?? '',
		phoneNumber: user.telephone ?? '',
		address1: user.address_line_1 ?? '',
		address2: user.address_line_2 ?? '',
		areaCode: user.area_code ?? '',
		countryId: user.countryISbb_agrix_countriesID ?? '',
		regionId: user.regionISbb_agrix_countriesID ?? '',
		cityId: user.cityISbb_agrix_countriesID ?? '',
		company: user.company ?? '',
	})

	const [isLoading, setIsLoading] = useState(false)

	const [logoSrc, setLogoSrc] = useState(null)
	const [coverSrc, setCoverSrc] = useState(null)

	const [logoCompletedCrop, setLogoCompletedCrop] = useState(null)
	const [coverCompletedCrop, setCoverCompletedCrop] = useState(null)

	const [logoCrop, setLogoCrop] = useState()
	const [coverCrop, setCoverCrop] = useState()

	const [logoBlob, setLogoBlob] = useState(null)
	const [coverBlob, setCoverBlob] = useState(null)

	const [logoUrl, setLogoUrl] = useState(null)
	const [coverUrl, setCoverUrl] = useState(null)

	const [editingLogo, setEditingLogo] = useState(null)
	const [editingCover, setEditingCover] = useState(null)

	const [companySummary, setCompanySummary] = useState(user.companysummaryISsmallplaintextbox ?? '')
	const [companyDescription, setCompanyDescription] = useState(user.companydescriptionISsmallplaintextbox ?? '')
	const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState(user.website_url ?? '')

	const [errors, setErrors] = useState(false)

	useEffect(() => {
		if (user.companylogoISfile) setLogoUrl(encodeURI(`${contentsUrl}${user.companylogoISfile}`))

		if (user.companybannerISfile) setCoverUrl(encodeURI(`${contentsUrl}${user.companybannerISfile}`))
		setForm({
			...form, 
			company_email: user.company_email ?? '',
			phoneNumber: user.telephone ?? '',
			address1: user.address_line_1 ?? '',
			address2: user.address_line_2 ?? '',
			areaCode: user.area_code ?? '',
			countryId: user.countryISbb_agrix_countriesID ?? '',
			regionId: user.regionISbb_agrix_countriesID ?? '',
			cityId: user.cityISbb_agrix_countriesID ?? '',
			company: user.company ?? ''
		})
	}, [user])

	const onFormChanged = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const onWebsiteUrlChanged = (e) => {
		setCompanyWebsiteUrl(e.target.value)
		setErrors(false)
	}

	const validURL = (str) => {
		var pattern = new RegExp(
			'^(http(s)?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		) // fragment locator
		return !!pattern.test(str)
	}

	const onSaveClicked = async (e) => {
		e.preventDefault()
		// validation for website url
		const isValidUrl = validURL(companyWebsiteUrl)
		if (!isBlueUser && !isValidUrl) {
			setErrors(true)
			return
		}

		let formData = getFormClient()
		formData.append('api_method', 'update_profile')
		formData.append('user_id', user._id)
		formData.append('session_id', user.session_id)
		formData.append('companysummaryISsmallplaintextbox', companySummary)
		formData.append('companydescriptionISsmallplaintextbox', companyDescription)
		formData.append('company_email', form.company_email)
		formData.append('telephone', form.phoneNumber)
		formData.append('company', form.company)
		formData.append('address_line_1', form.address1)
		formData.append('address_line_2', form.address2)
		formData.append('area_code', form.areaCode)
		formData.append('countryISbb_agrix_countriesID', form.countryId)
		formData.append('regionISbb_agrix_countriesID', form.regionId)
		formData.append('cityISbb_agrix_countriesID', form.cityId)
		formData.append('website_url', companyWebsiteUrl || '')

		if (logoBlob) {
			const logoBlobToBase64 = await getCompressedBase64(logoBlob)
			formData.append('companylogoISfile', logoBlobToBase64)
		}
		if (coverBlob) {
			const coverBlobToBase64 = await getCompressedBase64(coverBlob)
			formData.append('companybannerISfile', coverBlobToBase64)
		}

		try {
			setIsLoading(true)
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				const userInfo = response.data.data
				localStorage.setItem('user', JSON.stringify(userInfo))
				const onAuth = authContext.onAuth
				onAuth(userInfo, true)
				// toggle(modal)
				window.location.reload()
			} else if (response.data.error) {
				alert(response.data.message)
			}
			setIsLoading(false)
		} catch (err) {
			alert(err.toString())
		}
	}

	const callPermissionLimit = () =>
		onAuthModalsTriggered('Permission', '', {
			backButton: true,
			message: 'Oops. You need to upgrade your subscription plan in order to upload company images!',
		})

	function handleSelectLogoClick(event) {
		console.log(user)
		event.preventDefault()
		if (isBlueUser) {
			// Blue
			return callPermissionLimit()
		}
		inputLogoFile.current.click()
	}

	function handleSelectCoverClick(event) {
		event.preventDefault()
		if (isBlueUser) {
			// Blue
			return callPermissionLimit()
		}
		inputCoverFile.current.click()
	}

	function handleSelectLogo(event) {
		if (event?.target?.files?.length) {
			setLogoCrop(undefined) // Makes crop preview update between images.
			const reader = new FileReader()
			reader.addEventListener('load', () => {
				setLogoSrc(reader?.result?.toString() ?? '')
				setEditingLogo(true)
				inputLogoFile.current.value = null
			})
			reader.readAsDataURL(event?.target?.files?.[0])
		}
	}

	function handleSelectCover(event) {
		if (event?.target?.files?.length) {
			setCoverCrop(undefined) // Makes crop preview update between images.
			const reader = new FileReader()
			reader.addEventListener('load', () => {
				setCoverSrc(reader?.result?.toString() ?? '')
				setEditingCover(true)
				inputCoverFile.current.value = null
			})
			reader.readAsDataURL(event?.target?.files[0])
		}
	}

	function handleLogoEditingCancel(_event) {
		setEditingLogo(null)
		setLogoBlob(null)
	}

	function handleCoverEditingCancel(_event) {
		setEditingCover(null)
		setCoverBlob(null)
	}

	async function handleLogoEditingDone(_event) {
		setEditingLogo(false)
		const logoBlob = await getCroppedImg(imgLogoRef.current, logoCompletedCrop, 'logo.png')
		setLogoBlob(logoBlob)
		// setLogoUploadedRes(null);
	}

	async function handleCoverEditingDone(_event) {
		setEditingCover(false)
		const coverBlob = await getCroppedImg(imgCoverRef.current, coverCompletedCrop, 'cover.png')
		setCoverBlob(coverBlob)
		// setCoverUploadedRes(null);
	}

	function handleLogoImageLoad(event) {
		imgLogoRef.current = event?.currentTarget

		const { width, height } = event?.currentTarget
		const crop = centerCrop(makeAspectCrop({ unit: '%', width: 100 }, 11 / 10, width, height), width, height)
		setLogoCrop(crop)
	}

	function handleCoverImageLoad(event) {
		imgCoverRef.current = event?.currentTarget

		const { width, height } = event.currentTarget
		const crop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height), width, height)
		setCoverCrop(crop)
	}

	let summaryMaxLength = 150
	let descriptionMaxLength = 500

	if (user.subs?.membership_type === 'Gold') {
		summaryMaxLength = 300
		descriptionMaxLength = 1000
	} else if (user.subs?.membership_type === 'Platinum') {
		summaryMaxLength = 300
		descriptionMaxLength = 1500
	} else if (user.subs?.membership_type === 'Diamond') {
		summaryMaxLength = 500
		descriptionMaxLength = 2500
	}

	return (
		<Modal centered isOpen={modal} toggle={toggle} className='modal-lg mt-4'>
			<ModalHeader toggle={toggle}>Create your Seller Profile Page</ModalHeader>
			<ModalBody className='mx-4'>
				<div className='my-4'>
					<div className='mb-3'>
						<Alert />
					</div>
					<div className='needs-validation user-add' noValidate=''>
						<Row>
							<Col md='6' className='mb-3'>
								<Label className=''>Company Summary</Label>
								<textarea
									className='form-control mb-0'
									rows='4'
									maxLength={summaryMaxLength}
									placeholder={`${summaryMaxLength} characters`}
									value={companySummary}
									onChange={(e) => setCompanySummary(e.target.value)}
								></textarea>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>Full Company Description</Label>
								<textarea
									className='form-control mb-0'
									rows='4'
									maxLength={descriptionMaxLength}
									placeholder={`${descriptionMaxLength} characters`}
									value={companyDescription}
									onChange={(e) => setCompanyDescription(e.target.value)}
								></textarea>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>Company</Label>
								<input
									className='form-control mb-0'
									name='company'
									type='text'
									value={form.company}
									onChange={onFormChanged}
								/>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>Company Email</Label>
								<input
									type='email'
									name='company_email'
									className='form-control mb-0'
									value={form.company_email}
									onChange={onFormChanged}
								/>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>Phone</Label>
								<input
									className='form-control mb-0'
									name='phoneNumber'
									type='text'
									value={form.phoneNumber}
									onChange={onFormChanged}
								/>
							</Col>

							<Col md='6' className='mb-3'>
								<Label className=''>Address Line 1</Label>
								<input
									className='form-control mb-0'
									name='address1'
									type='text'
									value={form.address1}
									onChange={onFormChanged}
								/>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>Address Line 2</Label>
								<input
									className='form-control mb-0'
									name='address2'
									type='text'
									value={form.address2}
									onChange={onFormChanged}
								/>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>Area Code</Label>
								<input
									className='form-control mb-0'
									name='areaCode'
									type='text'
									value={form.areaCode}
									onChange={onFormChanged}
								/>
							</Col>
							{!isBlueUser && (
								<Col md='6'>
									<Label className=''>Website URL</Label>
									{errors && <div style={{ float: 'right', color: 'red' }}>Invalid Url!</div>}
									<Input
										className={errors ? 'is-invalid' : ''}
										name='website_url'
										type='text'
										value={companyWebsiteUrl}
										disabled={isBlueUser} // Blue
										onChange={onWebsiteUrlChanged}
									/>
								</Col>
							)}
							
							<Col md='6' className='mb-3'>
								<Label className=''>Country</Label>
								<div className='p-0 mb-0'>
									<CountryInput
										value={form.countryId}
										onChange={(val) => {
											const value = val?.value
											setForm({ ...form, countryId: value })
										}}
									/>
								</div>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>Region</Label>
								<div className='p-0 mb-0'>
									<RegionInput
										countryId={form.countryId}
										value={form.regionId}
										onChange={(val) => {
											const value = val?.value
											setForm({ ...form, regionId: value })
										}}
									/>
								</div>
							</Col>
							<Col md='6' className='mb-3'>
								<Label className=''>City</Label>
								<div className='p-0 mb-0'>
									<CityInput
										regionId={form.regionId}
										value={form.cityId}
										onChange={(val) => {
											const value = val?.value
											setForm({ ...form, cityId: value })
										}}
									/>
								</div>
							</Col>
						</Row>

						<Row>
							<Col md='6' className='mt-4'>
								<Label className=''>Company Logo</Label>
								<Row>
									<Col md='9'>
										{editingLogo ? (
											<ReactCrop
												keepSelection
												crop={logoCrop}
												onChange={(_, percentCrop) => setLogoCrop(percentCrop)}
												onComplete={(crop) => setLogoCompletedCrop(crop)}
												// aspect={11 / 10}
											>
												<img
													alt='Logo'
													onLoad={handleLogoImageLoad}
													src={logoSrc}
													style={{ transform: `scale(1) rotate(0deg)` }}
												/>
											</ReactCrop>
										) : logoBlob ? (
											<img className='w-100' src={URL.createObjectURL(logoBlob)} alt='Logo' />
										) : logoUrl ? (
											<img className='w-100' src={logoUrl} alt='Logo' />
										) : (
											''
										)}
										<input style={{ display: 'none' }} ref={inputLogoFile} onChange={handleSelectLogo} type='file' />
									</Col>
									<Col md='3' className='mt-2'>
										{editingLogo ? (
											<div>
												<button onClick={handleLogoEditingDone} className='btn btn-solid btn-default-plan p-1 w-100'>
													<span className='pl-1 fs-15'>Crop</span>
												</button>
												<Button color='danger' onClick={handleLogoEditingCancel} sm={1} className='p-1 mt-2 w-100'>
													<span className='pl-1 fs-15'>Cancel</span>
												</Button>
											</div>
										) : (
											<div>
												<NavDropdown title='Edit' className='btn-gray-signup btn-navbar'>
													<NavDropdown.Item onClick={handleSelectLogoClick}>Upload Your Logo</NavDropdown.Item>
													<NavDropdown.Divider />
													<NavDropdown.Item
														onClick={() => {
															if (isBlueUser) {
																// Blue
																return callPermissionLimit()
															}
															onAuthModalsTriggered('LogoBannerPurchase', 'logo', {
																lastLine: `Let's go back to creating your page`,
																mainTypeTitle: `Design Purchase`,
																selectedTitle: `Logo Design`,
																designCost: 50,
																paymentTitle1: `Once off design purchase:`,
																paymentValue1: `$50`,
																paymentTitle2: `Design Type:`,
																paymentValue2: `Logo`,
																__TYPE: 'logo', // logo/banner/adverts/advertp
															})
														}}
													>
														Purchase a Logo Design
													</NavDropdown.Item>
												</NavDropdown>
											</div>
										)}
									</Col>
								</Row>
							</Col>
							<Col md='6' className='mt-4'>
								<Label className=''>Company Cover Image</Label>
								<Row>
									<Col md='9'>
										{editingCover ? (
											<ReactCrop
												keepSelection
												crop={coverCrop}
												onChange={(_, percentCrop) => setCoverCrop(percentCrop)}
												onComplete={(crop) => setCoverCompletedCrop(crop)}
												aspect={16 / 9}
											>
												<img
													alt='Cover Image'
													onLoad={handleCoverImageLoad}
													src={coverSrc}
													style={{ transform: `scale(1) rotate(0deg)` }}
												/>
											</ReactCrop>
										) : coverBlob ? (
											<img className='w-100' src={URL.createObjectURL(coverBlob)} alt='Image' />
										) : coverUrl ? (
											<img className='w-100' src={coverUrl} alt='Image' />
										) : (
											''
										)}
										<input style={{ display: 'none' }} ref={inputCoverFile} onChange={handleSelectCover} type='file' />
									</Col>
									<Col md='3' className='mt-2'>
										{editingCover ? (
											<div>
												<button onClick={handleCoverEditingDone} className='btn btn-solid btn-default-plan p-1 w-100'>
													<span className='pl-1 fs-15'>Crop</span>
												</button>
												<Button color='danger' onClick={handleCoverEditingCancel} className='p-1 mt-2 w-100'>
													<span className='pl-1 fs-15'>Cancel</span>
												</Button>
											</div>
										) : (
											<NavDropdown title='Edit' className='btn-gray-signup btn-navbar'>
												<NavDropdown.Item onClick={handleSelectCoverClick}>Upload Banner Image</NavDropdown.Item>
												<NavDropdown.Divider />
												<NavDropdown.Item
													onClick={() => {
														if (isBlueUser) {
															// Blue
															return callPermissionLimit()
														}
														onAuthModalsTriggered('LogoBannerPurchase', 'banner', {
															lastLine: `Let's go back to creating your page`,
															mainTypeTitle: `Design Purchase`,
															selectedTitle: `Banner Design`,
															designCost: 50,
															paymentTitle1: `Once off design purchase:`,
															paymentValue1: `$50`,
															paymentTitle2: `Design Type:`,
															paymentValue2: `Banner`,
															__TYPE: 'banner', // logo/banner/adverts/advertp
														})
													}}
												>
													Purchase Banner Image
												</NavDropdown.Item>
											</NavDropdown>
										)}
									</Col>
								</Row>
							</Col>
						</Row>
						<div className='mt-5 d-flex justify-content-center'>
							<button disabled={isLoading} className='btn btn-solid btn-default-plan btn-post' onClick={onSaveClicked}>
								<span className='px-2'>{isLoading ? 'Loading...' : 'Save'}</span>
								{isLoading && <span className='spinner-border spinner-border-sm mr-1'></span>}
							</button>
						</div>
					</div>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default SellerProfileForm
