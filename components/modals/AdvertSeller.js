import React, { useState, useEffect, useRef, useContext} from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useRouter } from 'next/router'
import getConfig from 'next/config'
import Select from 'react-select'
import {
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	ListGroup,
	ListGroupItem,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Label,
	Button,
} from 'reactstrap'
import { getFormClient } from '../../services/constants'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { post } from '../../services/axios'
import { toast } from 'react-toastify'
import { isEmpty, getNextMonthFirst, getBase64OfImageUrl, getCroppedImg, getCompressedBase64 } from '../../helpers/utils/helpers'
import vars from '../../helpers/utils/vars'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const AdvertSellerModal = ({
	setSelectedPosition,
	modal,
	onToggle,
	caption,
	selectedPosition,
	selectedAdvert,
	positions,
}) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const cropAspect = selectedPosition.name === 'Premium' ? 1 / 1 : 16 / 9

	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [produceTypes, setProduceTypes] = useState([])
	const [category, setCategory] = useState('')
	const [subCategories, setSubCategories] = useState([])
	const [subcategory, setSubCategory] = useState('')
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [advertDesignInfo, setAdvertDesignInfo] = useState({})
	const isPurchasing = !isEmpty(advertDesignInfo)

	const inputImageFile = useRef(null)
	const imgImageRef = useRef(null)
	const [imageSrc, setImageSrc] = useState(null)
	const [editingImage, setEditingImage] = useState(null)
	const [imageCrop, setImageCrop] = useState()
	const [imageCompletedCrop, setImageCompletedCrop] = useState(null)
	const [imageUrl, setImageUrl] = useState(null)
	const [imageBase64, setImageBase64] = useState('')
	const [initWidth, setInitWidth] = useState(null)
	const [initHeight, setInitHeight] = useState(null)

	const categories = produceTypes.filter((pt) => pt.refers_toISbb_agrix_produce_typesID === null)
	const categoryOptions = categories
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const subcategoryOptions = subCategories
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	useEffect(() => {
		if (selectedAdvert) {
			if (selectedAdvert.advert_image01ISfile) {
				const imgUrl = contentsUrl + selectedAdvert.advert_image01ISfile
				setImageUrl(imgUrl)
				setBase64FromUrl(imgUrl)
			} else {
				setImageUrl(null)
				setImageBase64(null)
			}
			if (selectedAdvert.produce_categoryISbb_agrix_produce_typesID) {
				const category_id = selectedAdvert.produce_categoryISbb_agrix_produce_typesID
				setCategory(category_id)
				const subcategories = produceTypes.filter((pt) => pt.refers_toISbb_agrix_produce_typesID === category_id)
				setSubCategories(subcategories)
			} else {
				setCategory('')
				setSubCategories([])
			}
			if (selectedAdvert.produce_sub_categoryISbb_agrix_produce_typesID) {
				const subcategory_id = selectedAdvert.produce_sub_categoryISbb_agrix_produce_typesID
				setSubCategory(subcategory_id)
			} else {
				setSubCategory('')
			}
		} else {
			setImageUrl(null)
			setImageBase64('')
			setCategory('')
			setSubCategories([])
			setSubCategory('')
			setEditingImage(false)
		}

		setErrors({})
	}, [selectedAdvert])

	useEffect(() => {
		const getProduceTypes = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_produce_types')
			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setProduceTypes(response.data.list)
				} else if (response.data.error) {
					alert(response.data.message)
				}
			} catch (err) {
				alert(err.toString())
			}
		}
		getProduceTypes()
	}, [])

	const onCategoryChanged = (categoryId) => {
		setCategory(categoryId)
		if (!categoryId) return setSubCategories([])
		const subcategories = produceTypes.filter((pt) => pt.refers_toISbb_agrix_produce_typesID === categoryId)
		setSubCategories(subcategories)
	}

	const onBlured = (e) => {
		const name = e.target.name
		const value = e.target.value
		if (name === 'category')
			if (value === '') setErrors({ ...errors, category: true })
			else setErrors({ ...errors, category: false })
		if (name === 'subcategory')
			if (value === '') setErrors({ ...errors, subcategory: true })
			else setErrors({ ...errors, subcategory: false })
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

	function makeCrop(cropAspect, width, height) {
		const crop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, cropAspect, width, height), width, height)
		return crop;
	}

	function handleImageImageLoad(event) {
		imgImageRef.current = event?.currentTarget

		const { width, height } = event?.currentTarget
		const crop = makeCrop(cropAspect, width, height)
		setImageCrop(crop)
		setInitWidth(width)
		setInitHeight(height)
	}

	function handleSelectImageClick(event) {
		event.preventDefault()
		inputImageFile.current.click()
	}

	function onChagePosition(position) {
		const newAspect = position.name === 'Premium' ? 1 / 1 : 16 / 9
		const newCrop = makeCrop(newAspect, initWidth, initHeight)
		setImageCrop(newCrop)
		
		const newPxCrop = convertToPixelCrop(newCrop, initWidth, initHeight)
		setImageCompletedCrop(newPxCrop);
		setEditingImage(true);
	}

	async function handleImageEditingDone(_event) {
		setErrors({ ...errors, advertImage: false })
		setEditingImage(false)
		const imageBlob = await getCroppedImg(imgImageRef.current, imageCompletedCrop, 'Image.png')
		setImageUrl(URL.createObjectURL(imageBlob))

		const finalImage = await getCompressedBase64(imageBlob)		
		setImageBase64(finalImage)
	}

	function handleImageEditingCancel(_event) {
		setEditingImage(null)
		if (selectedAdvert?.advert_image01ISfile) {
			const imgUrl = contentsUrl + selectedAdvert.advert_image01ISfile
			setImageUrl(imgUrl)
		}
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

	const onButtonClicked = async (e, additionData) => {
		
		const btnId = e.target.id
		if (selectedPosition.name === 'Standard' && (!category || !subcategory)) {
			return somethingWrong('Select category & sub-category.')
		}

		setLoading(btnId)
		let reqList = []

		const isAddForm = selectedAdvert ? false : true

		if (!imageBase64) {
			if (!isAddForm) {
				if (selectedAdvert.advert_image01ISfile) {
					const imgUrl = contentsUrl + selectedAdvert.advert_image01ISfile
					const base64Image = await getBase64OfImageUrl(imgUrl)
					setImageBase64(base64Image)
				}
			}

			if (isPurchasing) {
				reqList = [advertDesignInfo]
			} else {
				let formData = getFormClient()
				formData.append('api_method', 'list_design_requests')
				formData.append('session_id', user.session_id)
				formData.append('user_id', user._id)
				formData.append('userISbb_agrix_usersID', user._id)
				formData.append('typeISLIST_logo_banner_advertp_adverts', 'adverts')
				formData.append('completedYN', 0)

				try {
					const response = await post(apiUrl, formData)

					if (response.data?.message !== vars.listEmptyMsg) {
						if (response.data.message === 'SUCCESS') {
							reqList = response.data?.list || []
							console.log({ reqList })
						} else if (response.data.error) {
							somethingWrong(response.data.message)
						}
					}
				} catch (err) {
					somethingWrong(err.toString())
				}
			}

			if (reqList.length === 0) {
				setErrors({ ...errors, advertImage: true })
				return setLoading(false)
			}
		}

		let formData = getFormClient()
		if (isAddForm) {
			formData.append('api_method', 'add_adverts')			
		} else {
			formData.append('api_method', 'update_adverts')
			formData.append('_id', selectedAdvert._id)
		}
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)
		formData.append('userISbb_agrix_usersID', user._id)

		if (selectedPosition.name === 'Standard') {
			formData.append('produce_categoryISbb_agrix_produce_typesID', category)
			formData.append('produce_sub_categoryISbb_agrix_produce_typesID', subcategory)
		}

		formData.append('positionISbb_agrix_adverts_positionsID', selectedPosition._id)

		if (btnId === 'save_draft') {
			formData.append('statusISLIST_Draft_Active_Deactivated_Reactivated_Archived', 'Draft')
			formData.append('submittedYN', '0')
		} else {
			formData.append(
				'statusISLIST_Draft_Active_Deactivated_Reactivated_Archived',
				isAddForm || selectedAdvert.__wasDraft
					? 'Pending'
					: selectedAdvert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived
			)
			
			if (isAddForm || selectedAdvert.__wasDraft) {
				formData.append('submittedYN', '1')
			} else {
				if (selectedAdvert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Pending') {
					formData.append('submittedYN', '1')
				} else {
					formData.append('submittedYN', '0')
				}
			}
			
		}
	

		if (additionData) {
			Object.keys(additionData).forEach((x) => {
				formData.append(x, additionData[x])
			})
		}

		imageBase64 && formData.append('advert_image01ISfile', imageBase64)

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {

				if (additionData && additionData.stripe_payment_ref) {

					console.log('Created Advert response data:', response.data)

					const advert_id = (isAddForm) ? response.data.item._id : selectedAdvert.numeric_id
					
					const stripe_payment_ref = additionData.stripe_payment_ref

					const amount = additionData.designCost

					if (isPurchasing) {
						console.log('isPurchasing advertDesignInfo', advertDesignInfo)
						let membershipLogFormData = getFormClient()
						membershipLogFormData.append('api_method', 'add_membership_log')
						membershipLogFormData.append('stripe_payment_ref', stripe_payment_ref)
						membershipLogFormData.append('userISbb_agrix_usersID', user._id)
						membershipLogFormData.append('amountNUM', 50)						
						let __code = `purch_advert`
						membershipLogFormData.append('code', __code)
						const membershipLogRes = await post(apiUrl, membershipLogFormData)
						console.log('purch_advert Log response:', membershipLogRes.data)
					}

					let membershipLogFormData = getFormClient()
					membershipLogFormData.append('api_method', 'add_membership_log')
					membershipLogFormData.append('stripe_payment_ref', stripe_payment_ref)
					membershipLogFormData.append('userISbb_agrix_usersID', user._id)
					membershipLogFormData.append('amountNUM', isPurchasing ? amount - 50 : amount)
					const prefix = (selectedPosition.name === 'Premium') ? `ADVERT-P` : `ADVERT-S`
					let __code = `${prefix}_${advert_id}`
					membershipLogFormData.append('code', __code)
					const membershipLogRes = await post(apiUrl, membershipLogFormData)
					console.log(`${__code} Log response:`, membershipLogRes.data)
					
				}				

				console.log('--11--add_membership_log--debug--')
				router.reload()
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
		<Modal
			centered
			isOpen={modal}
			toggle={onToggle}
			className='modal-lg'
			// style={{ width: "60%" }}
		>
			<ModalHeader toggle={onToggle}>{caption}</ModalHeader>
			<ModalBody className='m-4'>
				{selectedPosition.name === 'Standard' && (
					<Row className='mb-4'>
						<Col md='4'>
							<Label className={`${errors.category ? 'text-danger' : ''}`}>*Produce Category</Label>
							<Select
								className={`w-100`}
								style={{ height: 38, borderColor: '#ced4da', overflowY: 'scroll' }}
								options={categoryOptions}
								placeholder='Select category'
								name='category'
								value={category}
								onChange={(val) => {
									onCategoryChanged(val?.value)
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
						<Col md='4'>
							<Label className={`${errors.subcategory ? 'text-danger' : ''}`}>*Produce Sub-Category</Label>
							<Select
								className={`w-100`}
								style={{ height: 38, borderColor: '#ced4da' }}
								options={subcategoryOptions}
								placeholder='Select sub-category'
								name='subcategory'
								value={subcategory}
								onChange={(val) => {
									setSubCategory(val?.value)
								}}
								menuPortalTarget={document.body}
							/>
						</Col>
					</Row>
				)}
				<Row className='mb-4'>
					<Col md='5'>
						<div>
							<div className='mb-2' style={{ fontSize: 16 }}>
								Advert Image
							</div>
							<div className='mb-2' style={{ fontSize: 14, color: 'grey' }}>
								Upload your advert image here in JPG format
							</div>
							{errors.advertImage && <p className='text-danger text-center'>*Please select image for advert.</p>}
							{editingImage ? (
								<ReactCrop
									keepSelection
									crop={imageCrop}
									onChange={(crop) => setImageCrop(crop)}
									onComplete={(crop) => setImageCompletedCrop(crop)}
									aspect={cropAspect}
								>
									<img
										alt='Image'
										onLoad={handleImageImageLoad}
										src={imageSrc}
										style={{ transform: `scale(1) rotate(0deg)` }}
									/>
								</ReactCrop>
							) : imageUrl ? (
								<img className='w-100' src={imageUrl} alt='image' />
							) : (
								''
							)}
							<input style={{ display: 'none' }} ref={inputImageFile} onChange={handleSelectImage} type='file' />
						</div>
					</Col>
					<Col md='3'>
						{isPurchasing ? (
							<strong>Purchasing Advert Design</strong>
						) : (
							<>
								{editingImage ? (
									<div style={{ width: '100%', marginTop: 20 }}>
										<button
											type='button'
											onClick={handleImageEditingDone}
											className='btn btn-solid btn-default-plan btn-post w-100'
										>
											Crop
										</button>
										<Button type='button' className='mt-2' color='danger' outline onClick={handleImageEditingCancel}>
											Cancel
										</Button>
									</div>
								) : (
									<div style={{ width: '10	0%' }}>
										<Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
											<DropdownToggle className='btn btn-solid btn-post border'>
												{imageUrl ? 'Edit Advert' : 'Browse for image'}
											</DropdownToggle>
											<DropdownMenu>
												<DropdownItem onClick={handleSelectImageClick}>Upload Advert Image</DropdownItem>
												<DropdownItem
													onClick={() =>
														onAuthModalsTriggered('LogoBannerPurchase', 'adverts', {
															lastLine: `Let's go back to creating your page`,
															mainTypeTitle: `Design Purchase`,
															selectedTitle: `Advert Design`,
															designCost: 50,
															paymentTitle1: `Once off design purchase:`,
															paymentValue1: `$50`,
															paymentTitle2: `Design Type:`,
															paymentValue2: `Advert Design`,
															__TYPE: 'adverts', // logo/banner/adverts/advertp
															__justSend: true,
															__justSendCallback: setAdvertDesignInfo,
														})
													}
												>
													Purchase Advert
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</div>
								)}
							</>
						)}
					</Col>
				</Row>

				<Row>
					<Col md='8'>
						<div>
							<div className='mb-2' style={{ fontSize: 16 }}>
								Selected Position
							</div>
							<ListGroup>
								{positions.map((position) => (
									<ListGroupItem
										style={{ cursor: 'pointer' }}
										key={position._id}
										color={position._id === selectedPosition._id ? 'info' : ''}
										onClick={() =>{ 
											setSelectedPosition(position);
											if (imageSrc) {
												onChagePosition(position);
											}
										}}
									>
										<div className='d-flex justify-content-between py-3'>
											<div>{position.name} Position</div>
											<div>
												<strong>${parseFloat(position.priceNUM).toFixed(2)}</strong> per month
											</div>
										</div>
									</ListGroupItem>
								))}
							</ListGroup>
						</div>
						<div style={{ marginTop: 10, marginLeft: 3 }}>
							<span style={{}}>Subscription Total </span>
							<span>
								<strong>${parseFloat(selectedPosition.priceNUM).toFixed(2)}</strong>
							</span>
							<span style={{}}>&nbsp;per Month</span>
						</div>
						{isPurchasing && (
							<div style={{ marginTop: 10, marginLeft: 3 }}>
								<span style={{}}>Advert Design Total </span>
								<span>
									<strong>$50.00</strong>
								</span>
							</div>
						)}
					</Col>
				</Row>

				<div className='mt-5 d-flex justify-content-center'>
					<button
						className='btn btn-solid btn-default-plan btn-post'
						onClick={(e) => {
							e.persist()
							if (selectedPosition.name === 'Standard' && (!category || !subcategory)) {
								return somethingWrong('Select category & sub-category.')
							}
							let totalCost = parseFloat(selectedPosition.priceNUM)
							const others = {}
							if (isPurchasing) {
								totalCost += 50
								others['paymentTitle2'] = `Once off design purchase:`
								others['paymentValue2'] = `$50`
								others['advertDesignInfo'] = advertDesignInfo
							}

							onAuthModalsTriggered('Payment', 'advertp', {
								lastLine: `Let's go back to your adverts`,
								designCost: parseFloat(totalCost).toFixed(0),
								paymentTitle1: `Advert Subscription:`,
								paymentValue1: `$${parseFloat(selectedPosition.priceNUM).toFixed(0)}`,
								paymentTitle3: `Total:`,
								paymentValue3: `$${totalCost.toFixed(0)}`,
								paymentTitle4: `Advert Type:`,
								paymentValue4: `${selectedPosition.name}`,
								__TYPE: 'advertp', // logo/banner/adverts/advertp
								onFinishCallback: ({ stripe_ref }) =>
									onButtonClicked(e, {
										actionedYN: 1,
										activeYN: 0,
										sumbittedYN: 1,
										stripe_payment_ref: stripe_ref,
										designCost: parseFloat(totalCost).toFixed(0),
										price_paidNUM: Number(parseFloat(selectedPosition.priceNUM).toFixed(0)),
									}),
								finalFinishCallback: () => {
									onToggle()
									setTimeout(() => router.reload(), 900)
								},
								...others,
							})
						}}
						disabled={loading === 'save_draft' || (!imageUrl && !isPurchasing)}
						id='make_payment'
					>
						Make Payment
						{loading === 'make_payment' && <span className='spinner-border spinner-border-sm ml-2'></span>}
					</button>
					<Button
						className='btn-post ml-2'
						style={{}}
						id='save_draft'
						disabled={loading === 'make_payment'}
						onClick={onButtonClicked}
					>
						Save as draft
						{loading === 'save_draft' && <span className='spinner-border spinner-border-sm ml-2'></span>}
					</Button>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default AdvertSellerModal
