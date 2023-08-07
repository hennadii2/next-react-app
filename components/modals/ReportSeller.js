import React, { useEffect, useState, useContext, useRef } from 'react'
import getConfig from 'next/config'
import moment from 'moment'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useRouter } from 'next/router'
import { Col, Row, Modal, ModalHeader, ModalBody, Input, Label, Button } from 'reactstrap'
import Select from 'react-select'

import { getFormClient } from '../../services/constants'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { post } from '../../services/axios'
import { isEmpty, getCroppedImg, getCompressedBase64 } from '../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const ReportSellerModal = ({ reportsForSeller, modal, onToggle, caption, selectedReport }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'

	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const [produces, setProduces] = useState([])
	const [produceOptions, setProduceOptions] = useState([])
	const [produce, setProduce] = useState('')
	// const [countryList, setCountryList] = useState([])
	const [location, setLocation] = useState('')
	const [title, setTitle] = useState('')
	const [summary, setSummary] = useState('')
	const [reportText, setReportText] = useState('')
	const inputPDFFile = useRef(null)
	const [pdfReportFile, setPDFReportFile] = useState('')
	const [pdfName, setPDFName] = useState('PDF file')

	const inputImageFile = useRef(null)
	const imgImageRef = useRef(null)
	const [imageSrc, setImageSrc] = useState(null)
	const [editingImage, setEditingImage] = useState(null)
	const [imageCrop, setImageCrop] = useState()
	const [imageCompletedCrop, setImageCompletedCrop] = useState(null)
	const [imageUrl, setImageUrl] = useState(null)
	const [imageBase64, setImageBase64] = useState('')
	const [imageErrorText, setImageErrorText] = useState('')

	// const produceOptions = (produces.length > 0) ? produces.map((item) => ({
	// 	label: item.produce_sub_categoryISbb_agrix_produce_typesID_data?.name || '',
	// 	value: item.numeric_id,
	// })) : []

	useEffect(() => {
		if (!user || !user._id) {
			return
		}
		const getUserProduces = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_users_produce')
			formData.append(
				'get_linked_data',
				'produce_sub_categoryISbb_agrix_produce_typesID,countryISbb_agrix_countriesID,regionISbb_agrix_countriesID,cityISbb_agrix_countriesID'
			)
			formData.append('userISbb_agrix_usersID', user._id)

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setProduces(response.data.list)

					if (response.data.list.length > 0) {
						const produceOptions1 = response.data.list.map((item) => ({
							label: item.produce_sub_categoryISbb_agrix_produce_typesID_data?.name || '',
							value: item.numeric_id,
						}))
						setProduceOptions(produceOptions1)
					}

					
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		getUserProduces()
	}, [user])

	useEffect(() => {
		if (selectedReport) {
			if (selectedReport.report_image01ISfile) {
				const imgUrl = contentsUrl + selectedReport.report_image01ISfile
				setImageUrl(imgUrl)
				setBase64FromUrl(imgUrl)
			} else {
				setImageUrl(null)
				setImageBase64(null)
			}
			setProduce(selectedReport.produceISbb_agrix_users_produceID)
			setTitle(selectedReport.name)
			setSummary(selectedReport.summaryISsmallplaintextbox)
			setReportText(selectedReport.report_textISsmallplaintextbox ?? '')

			let location_text = ''
			if (selectedReport.countryISbb_agrix_countriesID_data)
				location_text += selectedReport.countryISbb_agrix_countriesID_data.name + ' '
			if (selectedReport.regionISbb_agrix_countriesID_data)
				location_text += selectedReport.regionISbb_agrix_countriesID_data.name + ' '
			if (selectedReport.cityISbb_agrix_countriesID_data)
				location_text += selectedReport.cityISbb_agrix_countriesID_data.name + ' '
			location_text = location_text.trim()
			setLocation(location_text)

			if (selectedReport.upload_pdf01ISfile) {
				const pathItems = selectedReport.upload_pdf01ISfile.split('/')
				const fileName = pathItems[pathItems.length - 1]
				setPDFName(fileName)
				setPDFBase64(contentsUrl + selectedReport.upload_pdf01ISfile)
			} else {
				setPDFName('PDF file')
				setPDFReportFile(null)
			}
		} else {
			setImageUrl(null)
			setImageBase64('')
			setImageSrc(null)
			setProduce('')
			setLocation('')
			setTitle('')
			setSummary('')
			setReportText('')
			setPDFName('PDF file')
			setPDFReportFile(null)
		}
		setEditingImage(false)
	}, [selectedReport])

	const onProduceChanged = (numeric_id) => {
		setProduce(numeric_id)
		if (!numeric_id) return setLocation('')
		const produce = produces.find((prod) => prod.numeric_id === numeric_id)

		const countryName = produce.countryISbb_agrix_countriesID_data
			? produce.countryISbb_agrix_countriesID_data.name
			: ''
		const regionName = produce.regionISbb_agrix_countriesID_data ? produce.regionISbb_agrix_countriesID_data.name : ''
		const cityName = produce.cityISbb_agrix_countriesID_data ? produce.cityISbb_agrix_countriesID_data.name : ''
		setLocation(countryName + ' ' + regionName + ' ' + cityName)
	}

	// const onCountryChanged = (e) => {
	//     setCountry(e.target.value)
	// }

	const handleSelectPDFClick = (event) => {
		event.preventDefault()
		inputPDFFile.current.click()
	}

	const handleSelectPDF = (e) => {
		const file = e.target.files[0]
		if (file === undefined) {
			setPDFReportFile('')
			if (reportText === '') setErrors({ ...errors, reportText: true })
			return
		}

		const fileName = file.name
		setPDFName(fileName)
		setErrors({ ...errors, reportText: false })

		// show alert when file and url both are set
		// if (file && url)
		//     setLinkAlert(true)

		// encode the file using the FileReader API
		const reader = new FileReader()
		reader.onloadend = () => {
			// logs data:<type>;base64,wL2dvYWwgbW9yZ...
			// console.log(reader.result);
			setPDFReportFile(reader.result)
		}
		reader.readAsDataURL(file)
	}

	const onBlured = (e) => {
		const name = e.target.name
		const value = e.target.value
		if (name === 'produce')
			if (value === '') setErrors({ ...errors, produce: true })
			else setErrors({ ...errors, produce: false })
		if (name === 'title')
			if (value === '') setErrors({ ...errors, title: true })
			else setErrors({ ...errors, title: false })
		if (name === 'summary')
			if (value === '') setErrors({ ...errors, summary: true })
			else setErrors({ ...errors, summary: false })
		if (name === 'reportText')
			if (value === '' && pdfReportFile === null) setErrors({ ...errors, reportText: true })
			else setErrors({ ...errors, reportText: false })
	}

	function handleImageImageLoad(event) {
		imgImageRef.current = event?.currentTarget

		const { width, height } = event?.currentTarget
		const crop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 11 / 6, width, height), width, height)
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
		if (selectedReport?.report_image01ISfile) {
			const imgUrl = contentsUrl + selectedReport.report_image01ISfile
			setImageUrl(imgUrl)
		}
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

	const setBase64FromUrl = (img_url) => {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', img_url, true)
		xhr.responseType = 'blob'
		xhr.onload = function (e) {
			var reader = new FileReader()
			reader.onload = function (event) {
				var res = event.target.result
				setImageBase64(res)
			}
			var file = this.response
			reader.readAsDataURL(file)
		}
		xhr.send()
	}

	const setPDFBase64 = (pdf_url) => {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', pdf_url, true)
		xhr.responseType = 'blob'
		xhr.onload = function (e) {
			var reader = new FileReader()
			reader.onload = function (event) {
				var res = event.target.result
				setPDFReportFile(res)
			}
			var file = this.response
			reader.readAsDataURL(file)
		}
		xhr.send()
	}

	const callPermissionLimit = (config = {}) =>
		onAuthModalsTriggered('Permission', '', {
			backButton: true,
			message: 'Oops. You need to upgrade your subscription to add reports!',
			...config,
		})

	const checkAddedInThisMonth = (item) => {
		const dateToCheck = item._dateadded
		if (moment(dateToCheck).isSame(new Date(), 'month') && moment(dateToCheck).isSame(new Date(), 'year')) {
			return true
		} else {
			return false
		}
	}

	const onButtonClicked = async (e) => {
		if (!imageBase64) {
			setImageErrorText('Required Field')
		} else {
			setImageErrorText('')
		}
		if (!imageBase64 || !produce || !title || !summary || (!reportText && !pdfReportFile)) return

		const btnId = e.target.id
		const userProduce = produces.find((prod) => prod.numeric_id === produce)

		if (!selectedReport) {
			if (isBlueUser) {
				// Blue
				return callPermissionLimit()
			} else {
				if (
					reportsForSeller.length >= 1 &&
					checkAddedInThisMonth(reportsForSeller[0]) &&
					userProduce.numeric_id === reportsForSeller[0].produceISbb_agrix_users_produceID // Same produce in the same month again
				) {
					return callPermissionLimit({
						message: `You already have a report for a produce item this month, come back next month to add another, or add for a different produce item.`,
						backBtnLabel: 'Back to my reports',
						planButton: false,
						backBtnClassName: '',
					})
				}
			}
		}

		let formData = getFormClient()
		if (selectedReport) {
			formData.append('api_method', 'update_reports')
			formData.append('_id', selectedReport.numeric_id)
		} else {
			formData.append('api_method', 'add_reports')
		}
		formData.append('user_id', user._id)
		formData.append('session_id', user.session_id)
		formData.append('userISbb_agrix_usersID', user._id)
		formData.append(
			'produce_categoryISbb_agrix_produce_typesID',
			userProduce.produce_categoryISbb_agrix_produce_typesID
		)
		formData.append(
			'produce_sub_categoryISbb_agrix_produce_typesID',
			userProduce.produce_sub_categoryISbb_agrix_produce_typesID
		)
		formData.append('produceISbb_agrix_users_produceID', produce)
		if (userProduce.countryISbb_agrix_countriesID)
			formData.append('countryISbb_agrix_countriesID', userProduce.countryISbb_agrix_countriesID)
		if (userProduce.regionISbb_agrix_countriesID)
			formData.append('regionISbb_agrix_countriesID', userProduce.regionISbb_agrix_countriesID)
		if (userProduce.cityISbb_agrix_countriesID)
			formData.append('cityISbb_agrix_countriesID', userProduce.cityISbb_agrix_countriesID)
		formData.append('name', title)
		formData.append('summaryISsmallplaintextbox', summary)

		if (reportText) formData.append('report_textISsmallplaintextbox', reportText)
		if (imageBase64) formData.append('report_image01ISfile', imageBase64)
		if (pdfReportFile) formData.append('upload_pdf01ISfile', pdfReportFile)
		if (btnId === 'save_draft') {
			formData.append('submittedYN', 0)
			formData.append('statusISLIST_Draft_Approved_Declined_Archived', 'Draft')
		} else {
			formData.append('submittedYN', 1)
			formData.append('statusISLIST_Draft_Approved_Declined_Archived', 'Pending')
		}

		try {
			setLoading(true)
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				onToggle(modal)
				router.reload()
			} else if (response.data.error) {
				alert(response.data.message)
			}
			setLoading(false)
		} catch (err) {
			alert(err.toString())
		}
	}

	return (
		<Modal centered isOpen={modal} className='modal-lg' toggle={onToggle}>
			<ModalHeader toggle={onToggle}>{caption}</ModalHeader>
			<ModalBody>
				<section className='ratio_45 section-b-space'>
					<form className='needs-validation produce-add mx-4' noValidate=''>
						<Row>
							<Col className='mb-3'>
								<Row>
									<Col md='3'>
										<Label className={`pl-2 ${errors.produce ? 'text-danger' : ''}`}>*Produce</Label>
									</Col>
									<Col md='9'>
										<Select
											className={`w-100`}
											style={{ height: 38, borderColor: '#ced4da' }}
											options={produceOptions}
											placeholder='Select produce'
											name='produce'
											value={produce}
											onChange={(val) => {
												onProduceChanged(val?.value)
											}}
											menuPortalTarget={document.body}
										/>
									</Col>
								</Row>
							</Col>
							<Col className='mb-3'>
								<Row>
									<Col md='2'>
										<Label>Location</Label>
									</Col>
									<Col md='10'>
										<Input type='text' name='location' value={location} disabled />
									</Col>
								</Row>
							</Col>
						</Row>
						<Row>
							<Col md='6' className='mb-3'>
								<Row>
									<Col md='3'>
										<Label className={`pl-2 ${errors.title ? 'text-danger' : ''}`}>*Title</Label>
									</Col>
									<Col>
										<Input
											className={errors.title ? 'is-invalid' : ''}
											placeholder='Title'
											type='text'
											name='title'
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											onBlur={onBlured}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<div className='mb-3'>
							<Row>
								<Col md='1'>
									<Label className={`pl-2 ${errors.summary ? 'text-danger' : ''}`}>*Summary</Label>
								</Col>
								<Col className='text-area'>
									<textarea
										className={`form-control ${errors.summary ? 'is-invalid' : ''}`}
										rows='4'
										// maxLength="200"
										name='summary'
										// placeholder="200 characters"
										value={summary}
										onChange={(e) => setSummary(e.target.value)}
										onBlur={onBlured}
									></textarea>
								</Col>
							</Row>
						</div>
						<Row className='my-4' style={{border: `${imageErrorText ? 'solid 1px red' : 'none'}`}}>
							<Col md='3'>
								<Label className='pl-2'>Report Image</Label>
							</Col>
							{(imageSrc || imageUrl) && (
								<Col md='4'>
									{editingImage ? (
										<ReactCrop
											keepSelection
											crop={imageCrop}
											onChange={(crop) => setImageCrop(crop)}
											onComplete={(crop) => setImageCompletedCrop(crop)}
											aspect={11 / 6}
										>
											<img
												alt='Image'
												onLoad={handleImageImageLoad}
												src={imageSrc}
												style={{ transform: `scale(1) rotate(0deg)` }}
											/>
										</ReactCrop>
									) : imageUrl ? (
										<img className='w-100' src={imageUrl} alt='Image' />
									) : (
										''
									)}
								</Col>
							)}
							<input style={{ display: 'none' }} ref={inputImageFile} onChange={handleSelectImage} type='file' />
							<Col md='3' className='mt-2'>
								{editingImage ? (
									<div style={{ width: '60%' }}>
										<button
											type='button'
											onClick={handleImageEditingDone}
											className='btn btn-solid btn-default-plan btn-post w-100'
										>
											Crop
										</button>
										<Button
											color='danger'
											type='button'
											onClick={handleImageEditingCancel}
											className='btn-post mt-2 w-100'
										>
											Cancel
										</Button>
									</div>
								) : (
									<div style={{ width: '75%' }}>
										<Button type='button' onClick={handleSelectImageClick} className='btn-post'>
											{imageSrc || imageUrl ? 'Edit Image' : 'Select Image'}
										</Button>
									</div>
								)}
							</Col>
						</Row>
						<div className='mb-3'>
							<Row>
								<Col md='1'>
									<Label className={`pl-2 ${errors.reportText ? 'text-danger' : ''}`}>*Report Text</Label>
								</Col>
								<Col className='text-area'>
									<textarea
										className={`form-control ${errors.reportText ? 'is-invalid' : ''}`}
										rows='4'
										name='reportText'
										// maxLength="300"
										// placeholder="300 characters"
										value={reportText}
										onChange={(e) => setReportText(e.target.value)}
										onBlur={onBlured}
									></textarea>
								</Col>
							</Row>
							<div className='d-flex justify-content-center'>Or</div>
							<div className='d-flex justify-content-center'>
								Upload&nbsp;
								{selectedReport?.upload_pdf01ISfile ? (
									<a href={contentsUrl + selectedReport.upload_pdf01ISfile} target='_blank' rel='noreferrer'>
										{pdfName}
									</a>
								) : (
									<span>{pdfName}</span>
								)}
							</div>
							<div className='d-flex justify-content-center mt-2'>
								<input style={{ display: 'none' }} ref={inputPDFFile} onChange={handleSelectPDF} type='file' />
								<Button type='button' onClick={handleSelectPDFClick} className='btn-post'>
									<i className='fa fa-upload' aria-hidden='true'></i>
									Upload additional information in PDF format
								</Button>
							</div>
						</div>
					</form>
					<div className='mt-4 d-flex justify-content-center'>
						<Button type='button' id='save_draft' className='btn-post' disabled={loading} onClick={onButtonClicked}>
							Save Draft&nbsp;
							{loading && <span className='spinner-border spinner-border-sm'></span>}
						</Button>
						<button
							type='button'
							id='submit_approval'
							className='btn btn-solid btn-default-plan btn-post ml-2'
							disabled={loading}
							onClick={onButtonClicked}
						>
							Submit for Approval&nbsp;
							{loading && <span className='spinner-border spinner-border-sm'></span>}
						</button>
					</div>
				</section>
			</ModalBody>
		</Modal>
	)
}

export default ReportSellerModal
