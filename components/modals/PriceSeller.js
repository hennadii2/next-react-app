import React, { useRef, useEffect, useState, useContext } from 'react'
import isWithinInterval from 'date-fns/isWithinInterval'
import compareAsc from 'date-fns/compareAsc'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_green.css'
import { Col, Row, Modal, ModalHeader, ModalBody, Input, Label, Form, Button } from 'reactstrap'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import { useRouter } from 'next/router'
import getConfig from 'next/config'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { getCroppedImg, getCompressedBase64 } from '../../helpers/utils/helpers'
import moment from 'moment';

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const PriceSellerModal = ({ selectedItem = null, modal, toggle, producesForSeller, produces, pricinglogs }) => {
	const router = useRouter()
	const authContext = useContext(AuthContext)
	const user = authContext.user

	const today = new Date()
	const minDate = moment(today).format('YYYY-MM-DD')

	const types = []

	const linkedProduceOptions = producesForSeller.map((produce) => {
		const linked_produce = produces.find(
			(prod) => prod.numeric_id === produce.produce_sub_categoryISbb_agrix_produce_typesID
		)
		const type = produces.find((prod) => prod.numeric_id === produce.produce_typeISbb_agrix_produce_typesID)
		types.push({ linked_produce_id: produce.numeric_id, type: type })

		return {
			label: `${linked_produce.name}${type?.name ? `, ${type?.name}` : ''}`,
			value: produce.numeric_id,
		}
	})

	const [isLoading, setIsLoading] = useState(false)
	const [toDate, setToDate] = useState('')
	const [fromDate, setFromDate] = useState('')
	const [linkedProduce, setLinkedProduce] = useState('')
	const [type, setType] = useState('')
	const [priceNum, setPriceNum] = useState(0)

	const inputImageFile = useRef(null)
	const imgImageRef = useRef(null)
	const [imageSrc, setImageSrc] = useState(null)
	const [editingImage, setEditingImage] = useState(null)
	const [imageCrop, setImageCrop] = useState()
	const [imageCompletedCrop, setImageCompletedCrop] = useState(null)
	const [imageUrl, setImageUrl] = useState(null)
	const [imageBase64, setImageBase64] = useState('')

	useEffect(() => {
		//console.log('selectedItemPrice', selectedItem?._price)
		if (modal && selectedItem) {
			onLinkedProduceChanged(selectedItem?.numeric_id || '')
			const { from_date, to_date } = selectedItem?._price || {}
			
			from_date && setFromDate(new Date(from_date))
			to_date && setToDate(new Date(to_date))
			selectedItem?.__price && setPriceNum(selectedItem?.__price)
		}
	}, [modal, selectedItem])

	const [errors, setErrors] = useState({
		linked_produces: false,
		price: false,
		fromDate: false,
		toDate: false,
	})

	const onLinkedProduceChanged = (produce_id) => {
		setLinkedProduce(produce_id)
		if (!produce_id) return setType('')

		const type = types.find((t) => t.linked_produce_id === produce_id)
		if (type)
			if (type.type) setType(type?.type?.name)
			else setType('')
		else setType('')
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
		setImageUrl(null)
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

	const onBlured = (e) => {
		const name = e.target.name
		const value = e.target.value
		if (name === 'linked_produces')
			if (value === '') setErrors({ ...errors, linked_produces: true })
			else setErrors({ ...errors, linked_produces: false })
		if (name === 'price')
			if (value <= 0) setErrors({ ...errors, price: true })
			else setErrors({ ...errors, price: false })
	}

	const validateDateRange = (date) => {
		const targetDate = date[0]?.toISOString().split('T')[0]
		const targetDates = targetDate.split('-')
		if (!linkedProduce) return false

		const producePrices = pricinglogs.filter((price) => price.produceISbb_agrix_users_produceID === linkedProduce)

		const pricinglog = producePrices.find((price) => {
			const from_date = price.from_date.split(' ')[0]
			const to_date = price.to_date.split(' ')[0]

			const from_dates = from_date.split('-')
			const to_dates = to_date.split('-')

			const isInDates = isWithinInterval(
				new Date(parseInt(targetDates[0]), parseInt(targetDates[1]) - 1, parseInt(targetDates[2])),
				{
					start: new Date(parseInt(from_dates[0]), parseInt(from_dates[1]) - 1, parseInt(from_dates[2])),
					end: new Date(parseInt(to_dates[0]), parseInt(to_dates[1]) - 1, parseInt(to_dates[2])),
				}
			)

			return isInDates
		})

		if (pricinglog) {
			somethingWrong('A price has already been added for this date range on this produce item')
			return false
		}
		return true
	}

	const validateFromDate = (date) => {
		const targetDate = date[0]?.toISOString().split('T')[0]
		const targetDates = targetDate.split('-')

		if (!toDate[0]) return true

		const toDateStr = toDate[0]?.toISOString().split('T')[0]
		const toDates = toDateStr.split('-')

		const result = compareAsc(
			new Date(parseInt(targetDates[0]), parseInt(targetDates[1]) - 1, parseInt(targetDates[2])),
			new Date(parseInt(toDates[0]), parseInt(toDates[1]) - 1, parseInt(toDates[2]))
		)
		if (result === 1) {
			somethingWrong('A price has already been added for this date on this produce item')
			return false
		}
		return true
	}

	const validateToDate = (date) => {
		const targetDate = date[0]?.toISOString().split('T')[0]
		const targetDates = targetDate.split('-')

		if (!fromDate[0]) return true
		//console.log("fromDate", fromDate)
		const fromDateStr = fromDate[0]?.toISOString().split('T')[0]
		const fromDates = fromDateStr.split('-')

		const result = compareAsc(
			new Date(parseInt(targetDates[0]), parseInt(targetDates[1]) - 1, parseInt(targetDates[2])),
			new Date(parseInt(fromDates[0]), parseInt(fromDates[1]) - 1, parseInt(fromDates[2]))
		)
		if (result === -1) {
			somethingWrong('A price has already been added for this date on this produce item')
			return false
		}
		return true
	}

	const onFromDateClosed = (value) => {
		// if (value.length === 0) setErrors({ ...errors, fromDate: true })
		// else {
		// 	const isValidRange = validateDateRange(value)
		// 	const isValidFrom = validateFromDate(value)
		// 	if (isValidFrom) setErrors({ ...errors, fromDate: false })
		// 	else setErrors({ ...errors, fromDate: true })
		// }
	}

	const onToDateClosed = (value) => {
		// if (value.length === 0) setErrors({ ...errors, toDate: true })
		// else {
		// 	const isValidRange = validateDateRange(value)
		// 	const isValidTo = validateToDate(value)
		// 	if (isValidTo) setErrors({ ...errors, toDate: false })
		// 	else setErrors({ ...errors, toDate: true })
		// }
	}

	const onSaveClicked = async () => {

		const from = (Array.isArray(fromDate)) ? moment(fromDate[0]).format('YYYY-MM-DD') : moment(fromDate).format('YYYY-MM-DD')
		const to = (Array.isArray(toDate)) ? moment(toDate[0]).format('YYYY-MM-DD') : moment(toDate).format('YYYY-MM-DD')
		

		if (!priceNum) {
			return somethingWrong('Please fill the price input field.')
		}

		if (!linkedProduce || !priceNum || !from || !to || errors.price) {			
			return somethingWrong('Please fill the form correctly.')
		}

		if (from > to) {
			return somethingWrong("'From date' can not be later than 'To date'")
		}
		

		let formData = getFormClient()
		formData.append('api_method', 'add_users_produce_pricing')
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)
		formData.append('produceISbb_agrix_users_produceID', linkedProduce)
		formData.append('priceNUM', priceNum)
		formData.append('from_date', from)
		formData.append('to_date', to)
		formData.append('produce_image01ISfile', imageBase64)

		try {
			setIsLoading(true)
			const response = await post(apiUrl, formData)
			//console.log(response, response.data)
			if (response.data.message === 'SUCCESS') {
				toggle(modal)
				router.reload()
			} else if (response.data.error) {
				alert(response.data.message)
			}
			setIsLoading(false)
		} catch (err) {
			alert(err.toString())
		}
	}

	return (
		<Modal centered className='modal-lg mt-3' isOpen={modal} toggle={toggle}>
			<ModalHeader toggle={toggle}>Add New Price Item</ModalHeader>
			<ModalBody>
				<section className='ratio_45 section-b-space'>
					<Form className='needs-validation produce-add mx-4' noValidate=''>
						<Row>
							<Col md='4'>
								<Label className={errors.linked_produces ? 'text-danger' : ''}>*Linked Produce:</Label>
							</Col>
							<Col md='7'>
								<Select
									className={`w-100`}
									style={{ height: 38, borderColor: '#ced4da' }}
									options={linkedProduceOptions}
									placeholder='Select produce'
									name='linked_produces'
									value={linkedProduce}
									onChange={(val) => {
										onLinkedProduceChanged(val?.value)
									}}
									menuPortalTarget={document.body}
								/>
							</Col>
						</Row>
						<Row className='mt-3'>
							<Col md='4'>
								<Label>*Type:</Label>
							</Col>
							<Col md='7'>
								<Input type='text' disabled value={type}></Input>
							</Col>
						</Row>
						<Row className='mt-3'>
							<Col md='4'>
								<Label className={errors.price ? 'text-danger' : ''}>*Price(US$(FOB)):</Label>
							</Col>
							<Col md='7'>
								<Input
									className={errors.price ? 'is-invalid' : ''}
									type='number'
									name='price'
									value={priceNum}
									onChange={(e) => setPriceNum(e.target.value)}
									onBlur={onBlured}
								/>
							</Col>
						</Row>
						<Row className='mt-3'>
							<Col md='4'>
								<Label className={errors.fromDate || errors.toDate ? 'text-danger' : ''}>
									*Date Range for Availability:
								</Label>
							</Col>
							<Col md='7' className='d-flex jsutify-content-between flatpickr'>
								<Flatpickr
									className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
									value={fromDate}
									onChange={(date) => setFromDate(date)}
									options={{ static: true, onClose: onFromDateClosed, minDate }}
								/>
								<Flatpickr
									className={`form-control ml-3 ${errors.toDate ? 'is-invalid' : ''}`}
									value={toDate}
									onChange={(date) => setToDate(date)}
									options={{ static: true, onClose: onToDateClosed, minDate }}
								/>
							</Col>
						</Row>
						<Row className='mt-4'>
							<Col md='3'>
								<Label className='pl-2'>Produce Image</Label>
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
							<Col md='4' className='mt-2'>
								{editingImage ? (
									<div style={{ width: '40%' }}>
										<button
											type='button'
											onClick={handleImageEditingDone}
											className='btn btn-solid btn-default-plan btn-post w-100'
										>
											Crop
										</button>
										<Button
											type='button'
											color='danger'
											onClick={handleImageEditingCancel}
											className='btn-post w-100 mt-2'
										>
											Cancel
										</Button>
									</div>
								) : (
									<div style={{ width: '55%' }}>
										<Button type='button' onClick={handleSelectImageClick} className='btn-post'>
											{imageSrc || imageUrl ? 'Edit Image' : 'Select Image'}
										</Button>
									</div>
								)}
							</Col>
						</Row>
						<div className='mt-5 d-flex justify-content-center'>
							<button
								type='button'
								onClick={onSaveClicked}
								disabled={isLoading}
								className='btn btn-solid btn-default-plan px-3 py-2'
							>
								<span className='px-2'>{isLoading ? 'Loading...' : 'Save'}</span>
								{isLoading && <span className='spinner-border spinner-border-sm mr-1'></span>}
							</button>
						</div>
					</Form>
				</section>
			</ModalBody>
		</Modal>
	)
}

export default PriceSellerModal
