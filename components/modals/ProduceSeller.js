import React, { useEffect, useState, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Select from 'react-select'
import { Col, Row, Modal, ModalHeader, ModalBody, Button, Input, Label } from 'reactstrap'
import getConfig from 'next/config'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { getFormClient, seasonOptions } from '../../services/constants'
import { post } from '../../services/axios'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify'
import AlertModal from '../../components/modals/AlertModal'
import CountryInput from '../common/Geo/Country'
import CityInput from '../common/Geo/City'
import RegionInput from '../common/Geo/Region'
import { getCompressedBase64 } from '../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const commonSelectStyles = { height: 38, borderColor: '#ced4da' }

const ProduceSellerModal = ({ modal, toggle, caption, selectedProduce }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const settingContext = useContext(SettingContext)
	//const [packagings, setPackagings] = useState(settingContext.appData?.produce_packaging || [])
	const [packagings, setPackagings] = useState([])
	const [packagingOptions, setPackagingOptions] = useState([])

	// const packagingOptions = packagings.map((item) => ({
	// 	label: item.name,
	// 	value: item.numeric_id,
	// }))

	const farmings = settingContext.appData.produce_farming_method
	const farmingOptions = farmings.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const getProduceTypes = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'list_produce_types')

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				setProduces(response.data.list)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	const getSizesList = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'list_produce_types_sizes_link')
		formData.append('get_linked_data', 1)

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				const list = response.data.list
				setMainSizeList(list)
				let sizes = list
					.filter((x) => {
						if (selectedProduce) {
							return (
								x.typeISbb_agrix_produce_typesID === selectedProduce?.produce_sub_categoryISbb_agrix_produce_typesID
							)
						}
						return true
					})
					.map((y) => y.sizeISbb_agrix_produce_sizesID_data)
				setSizeList(sizes)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	const getPackagingList = async () => {
		let formData = getFormClient()
		formData.append('api_method', 'list_produce_packaging')

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				setPackagingList(response.data.list)
				const packagingList = response.data.list
				setPackagingList(packagingList)

				if (selectedProduce) {
					packagings = packagingList.filter((x) => x.refers_toISbb_agrix_produce_packagingID === selectedProduce?.packaging_weightISbb_agrix_produce_packagingID)

					const packagingOptions = packagings.map((item) => ({
						label: item.name,
						value: item.numeric_id,
					}))
					setPackagingOptions(packagingOptions)
					setPackaging(selectedProduce?.packagingISbb_agrix_produce_packagingID ?? '')
				}
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	const [preparing, setPreparing] = useState(false)
	const [isShowAlertModal, setShowAlertModal] = useState(false)
	const [produces, setProduces] = useState([])
	const [subCategories, setSubCategories] = useState([])
	const [types, setTypes] = useState([])
	const [category, setCategory] = useState('')
	const [subCategory, setSubCategory] = useState('')
	const [type, setType] = useState('')
	const [size, setSize] = useState('')
	const [packaging, setPackaging] = useState('')
	const [weight, setWeight] = useState('')
	const [farming, setFarming] = useState('')
	const [packagingList, setPackagingList] = useState([])
	const [harvestSeasons, setHarvestSeasons] = useState([])
	const [preHarvestSeasons, setPreHarvestSeasons] = useState([])
	const [storageSeasons, setStorageSeasons] = useState([])
	const [preStorageSeasons, setPreStorageSeasons] = useState([])
	const [unavailableSeasons, setUnavailableSeasons] = useState([])
	const [preUnavailableSeasons, setPreUnavailableSeasons] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [mainSizeList, setMainSizeList] = useState([])
	const [sizeList, setSizeList] = useState([])
	const [country, setCountry] = useState(selectedProduce?.countryISbb_agrix_countriesID ?? '')
	const [region, setRegion] = useState(selectedProduce?.regionISbb_agrix_countriesID ?? '')
	const [city, setCity] = useState(selectedProduce?.cityISbb_agrix_countriesID ?? '')
	const [sending, setSending] = useState(false)

	const [harvestReRenderKey, setHarvestReRenderKey] = useState(nanoid())
	const [storageReRenderKey, setStorageReRenderKey] = useState(nanoid())
	const [unavailableReRenderKey, setUnavailableReRenderKey] = useState(nanoid())

	const inputImageFile = useRef(null)
	const imgImageRef = useRef(null)
	const [imageSrc, setImageSrc] = useState(null)
	const [editingImage, setEditingImage] = useState(null)
	const [imageCrop, setImageCrop] = useState()
	const [imageCompletedCrop, setImageCompletedCrop] = useState(null)
	const [imageUrl, setImageUrl] = useState(null)
	const [imageBase64, setImageBase64] = useState('')
	
	const [imageErrorText, setImageErrorText] = useState('')

	const [suggestionText, setSuggestionText] = useState('')

	const [imageChanging, setImageChanging] = useState(false)
	const [imageProcessing, setImageProcessing] = useState(false)

	const prepareForm = async () => {
		try {
			setPreparing(true)
			await getProduceTypes()
			await getSizesList()
			await getPackagingList()
		} catch (error) {
			console.log(error)
		} finally {
			setPreparing(false)
		}
	}

	useEffect(() => {
		if (modal) {
			prepareForm()
		}
	}, [modal])

	useEffect(() => {
		prepareForm()
	}, [])

	// console.log({ preparing, modal })

	useEffect(() => {
		setSuggestionText('')

		// Ajax related set first
		setCountry(selectedProduce?.countryISbb_agrix_countriesID ?? '')
		setRegion(selectedProduce?.regionISbb_agrix_countriesID ?? '')
		setCity(selectedProduce?.cityISbb_agrix_countriesID ?? '')

		if (selectedProduce) {
			if (selectedProduce.produce_imageISfile) {
				const imgUrl = contentsUrl + selectedProduce.produce_imageISfile
				setImageUrl(imgUrl)
				setBase64FromUrl(imgUrl)
			} else {
				setImageUrl(null)
				setImageBase64(null)
			}
		} else {
			setImageUrl(null)
			setImageBase64('')
			setImageSrc(null)
		}

		if (selectedProduce?.produce_categoryISbb_agrix_produce_typesID) {
			const category_numeric_id = selectedProduce.produce_categoryISbb_agrix_produce_typesID
			const sub_categories = produces.filter(
				(produce) => produce.refers_toISbb_agrix_produce_typesID === category_numeric_id
			)
			setSubCategories(sub_categories)
		} else {
			setSubCategories([])
		}

		if (selectedProduce?.produce_sub_categoryISbb_agrix_produce_typesID) {
			const subcategory_numeric_id = selectedProduce.produce_sub_categoryISbb_agrix_produce_typesID
			const types = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === subcategory_numeric_id)
			setTypes(types)
		} else {
			setTypes([])
		}

		setCategory(selectedProduce?.produce_categoryISbb_agrix_produce_typesID ?? '')
		setSubCategory(selectedProduce?.produce_sub_categoryISbb_agrix_produce_typesID ?? '')
		setType(selectedProduce?.produce_typeISbb_agrix_produce_typesID ?? '')
		setSize(selectedProduce?.sizeISbb_agrix_produce_sizesID ?? '')
		setPackaging(selectedProduce?.packagingISbb_agrix_produce_packagingID ?? '')
		setWeight(selectedProduce?.packaging_weightISbb_agrix_produce_packagingID ?? '')
		setFarming(selectedProduce?.farming_methodISbb_agrix_produce_farming_methodID ?? '')
		setPreHarvestSeasons(
			selectedProduce?.produce_harvest_season ? JSON.parse(selectedProduce.produce_harvest_season) : []
		)
		setPreStorageSeasons(
			selectedProduce?.produce_storage_season ? JSON.parse(selectedProduce.produce_storage_season) : []
		)
		setPreUnavailableSeasons(
			selectedProduce?.produce_unavaliable_season ? JSON.parse(selectedProduce.produce_unavaliable_season) : []
		)

		setEditingImage(false)
	}, [selectedProduce])

	const weightList = packagingList.filter((x) => x.refers_toISbb_agrix_produce_packagingID === null)
	const weightListOptions = weightList.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const subCategoryOptions = subCategories
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const typeOptions = types
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const categories = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === null)
	const categoryOptions = categories
		.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	// const sizes = settingContext.appData.produce_sizes
	const sizeOptions = sizeList.map((item) => ({
		label: item.name,
		value: item.numeric_id,
	}))

	const onCountryChanged = (numeric_id) => {
		setCountry(numeric_id)
	}

	const onWeightChanged = (numeric_id) => {
		setWeight(numeric_id)
		setPackaging('')
		if (!numeric_id) {
			setPackagings([])
			return
		}
		const packagings = packagingList.filter((x) => x.refers_toISbb_agrix_produce_packagingID === numeric_id)
		const packagingOptions = packagings.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		setPackagingOptions(packagingOptions)
		setPackagings(packagings)
	}

	const onRegionChanged = (numeric_id) => {
		setRegion(numeric_id)
	}

	const onCategoryChanged = (numeric_id) => {
		setCategory(numeric_id)
		if (!numeric_id) return setSubCategories([])
		const subCategories = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === numeric_id)
		setSubCategories(subCategories)
	}

	const onSubCategoryChanged = (numeric_id) => {
		setSubCategory(numeric_id)
		setSize('')
		if (!numeric_id) {
			setTypes([])
			setSizeList([])
			return
		}
		const types = produces.filter((produce) => produce.refers_toISbb_agrix_produce_typesID === numeric_id)
		setTypes(types)
		const sizes = mainSizeList
			.filter((x) => x.typeISbb_agrix_produce_typesID === numeric_id)
			.map((y) => y.sizeISbb_agrix_produce_sizesID_data)
		setSizeList(sizes)
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
		setImageProcessing(true)
		try {
			const imageBlob = await getCroppedImg(imgImageRef.current, imageCompletedCrop, 'image.png')
			// console.log('------imageBlob-', URL.createObjectURL(imageBlob));
			setImageUrl(URL.createObjectURL(imageBlob))
			try {
				const imageBlobToBase64 = await getCompressedBase64(imageBlob)
				// console.log('------imageBlobToBase64: OK');
				setImageBase64(imageBlobToBase64)
				setEditingImage(false)
			} catch (err) {
				console.log('-----getCompressedBase64-Error:', err);
			}
			
		} catch (error) {
			console.log('-----getCroppedImg-Error:', error);
		} finally {
			setImageProcessing(false)
		}
		
	}

	function handleImageEditingCancel(_event) {
		setEditingImage(null)
		if (selectedProduce?.produce_imageISfile) {
			const imgUrl = contentsUrl + selectedProduce.produce_imageISfile
			setImageUrl(imgUrl)
		}
		setImageSrc(null)
	}

	async function handleSelectImage (event) {
		if (event?.target?.files?.length) {
			setImageCrop(undefined) // Makes crop preview update between images.
			const reader = new FileReader()
			setImageSrc(null)
			setImageChanging(true)
			reader.addEventListener('load', () => {
				setImageChanging(false)
				setImageSrc(reader?.result?.toString() ?? '')
				setEditingImage(true)
				inputImageFile.current.value = null
			})
			reader.readAsDataURL(event?.target?.files?.[0])
		}
	}

	function getCroppedImg(image, crop, fileName) {
		// let image = this.imageRef;
		const canvas = document.createElement('canvas')
		const scaleX = image.naturalWidth / image.width
		const scaleY = image.naturalHeight / image.height
		canvas.width = Math.ceil(crop.width * scaleX)
		canvas.height = Math.ceil(crop.height * scaleY)
		const ctx = canvas.getContext('2d')
		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width * scaleX,
			crop.height * scaleY
			// 250,
			// 250
		)
		// As Base64 string
		// const base64Image = canvas.toDataURL('image/png');
		// As a blob
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					blob.name = fileName
					resolve(blob)
				},
				'image/png',
				1
			)
		})
	}

	const [errors, setErrors] = useState({
		category: false,
		sub_category: false,
		country: false,
		region: false,
		size: false,
		packaging: false,
		harvest_season: false,
		storage_season: false,
	})

	const onBlured = (name, value) => {
		if (name === 'category')
			if (!value) setErrors({ ...errors, category: true })
			else setErrors({ ...errors, category: false })
		if (name === 'sub_category')
			if (!value) setErrors({ ...errors, sub_category: true })
			else setErrors({ ...errors, sub_category: false })
		if (name === 'country')
			if (!value) setErrors({ ...errors, country: true })
			else setErrors({ ...errors, country: false })
		if (name === 'region')
			if (!value) setErrors({ ...errors, region: true })
			else setErrors({ ...errors, region: false })
		if (name === 'type')
			if (!value) setErrors({ ...errors, type: true })
			else setErrors({ ...errors, type: false })
		if (name === 'size')
			if (!value) setErrors({ ...errors, size: true })
			else setErrors({ ...errors, size: false })
		if (name === 'packaging')
			if (!value) setErrors({ ...errors, packaging: true })
			else setErrors({ ...errors, packaging: false })
		if (name === 'harvest_season')
			if (!value || value?.length === 0) setErrors({ ...errors, harvest_season: true })
			else setErrors({ ...errors, harvest_season: false })
		if (name === 'storage_season')
			if (!value || value?.length === 0) setErrors({ ...errors, storage_season: true })
			else setErrors({ ...errors, storage_season: false })
	}

	const callPermissionLimit = (message) =>
		onAuthModalsTriggered('Permission', '', {
			backButton: true,
			message: message,
		})

	const onSaveClicked = async () => {
		if (!imageBase64) {
			setImageErrorText('Required Field')
		} else {
			setImageErrorText('')
		}
		if (
			!imageBase64 ||
			!category ||
			!subCategory ||
			!country ||
			!region ||
			!size ||
			!packaging ||
			!preHarvestSeasons ||
			preHarvestSeasons?.length === 0 ||
			!preStorageSeasons ||
			preStorageSeasons?.length === 0
		) {
			return setShowAlertModal(true)
		}

		let formData = getFormClient()
		if (selectedProduce) {
			formData.append('api_method', 'update_users_produce')
			formData.append('_id', selectedProduce._id)
		} else {
			formData.append('api_method', 'add_users_produce')
		}

		formData.append('userISbb_agrix_usersID', user._id)
		formData.append('user_id', user._id)
		formData.append('session_id', user.session_id)
		formData.append('produce_categoryISbb_agrix_produce_typesID', category)
		formData.append('produce_sub_categoryISbb_agrix_produce_typesID', subCategory)
		formData.append('countryISbb_agrix_countriesID', country)
		formData.append('regionISbb_agrix_countriesID', region)
		if (city) formData.append('cityISbb_agrix_countriesID', city)
		if (type) formData.append('produce_typeISbb_agrix_produce_typesID', type)
		formData.append('sizeISbb_agrix_produce_sizesID', size)
		formData.append('packagingISbb_agrix_produce_packagingID', packaging)
		formData.append('packaging_weightISbb_agrix_produce_packagingID', weight)
		if (farming) formData.append('farming_methodISbb_agrix_produce_farming_methodID', farming)
		formData.append('produce_harvest_season', JSON.stringify(preHarvestSeasons))
		formData.append('produce_storage_season', JSON.stringify(preStorageSeasons))
		if (preUnavailableSeasons.length > 0) {
			formData.append('produce_unavaliable_season', JSON.stringify(preUnavailableSeasons))
		}
		formData.append('produce_imageISfile', imageBase64)

		try {
			setIsLoading(true)
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				toggle(modal)
				router.reload()
			} else if (response.data.error) {
				callPermissionLimit(response.data.error)
			}
			setIsLoading(false)
		} catch (err) {
			alert(err.toString())
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

	const onHarvestSelected = (list) => {
		setHarvestSeasons([...list])
		setErrors({ ...errors, harvest_season: false })
	}

	const onHarvestRemoved = (list) => {
		setHarvestSeasons([...list])
		if (list.length === 0) setErrors({ ...errors, harvest_season: true })
	}

	const onStorageSelected = (list) => {
		setStorageSeasons([...list])
		setErrors({ ...errors, storage_season: false })
	}

	const onStorageRemoved = (list) => {
		setHarvestSeasons([...list])
		if (list.length === 0) setErrors({ ...errors, storage_season: true })
	}

	const onSuggestionClicked = async () => {
		if (!suggestionText) return
		setSending(true)
		let formData = getFormClient()
		formData.append('api_method', 'add_suggestion_form')
		formData.append('messageISsmallplaintextbox', suggestionText)
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)
		formData.append('userISbb_agrix_usersID', user._id)

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				setSuggestionText('')
				toast.success('Thanks, your suggestion has been sent.', {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: false,
					progress: undefined,
				})
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		} finally {
			setSending(false)
		}
	}

	const getHarvestSeasonOptions = () => {
		return seasonOptions.map((x) => {
			let disabled = false
			if (preStorageSeasons.includes(x) || preUnavailableSeasons.includes(x)) {
				disabled = true
			}
			return { value: x, label: x, disabled }
		})
	}
	const harvestSeasonOptions = getHarvestSeasonOptions()

	const getStorageSeasonOptions = () => {
		return seasonOptions.map((x) => {
			let disabled = false
			if (preHarvestSeasons.includes(x) || preUnavailableSeasons.includes(x)) {
				disabled = true
			}
			return { value: x, label: x, disabled }
		})
	}
	const storageSeasonOptions = getStorageSeasonOptions()

	const getUnavailableSeasonOptions = () => {
		return seasonOptions.map((x) => {
			let disabled = false
			if (preHarvestSeasons.includes(x) || preStorageSeasons.includes(x)) {
				disabled = true
			}
			return { value: x, label: x, disabled }
		})
	}
	const unavailableSeasonOptions = getUnavailableSeasonOptions()
	// console.log({ harvestSeasonOptions, storageSeasonOptions, unavailableSeasonOptions })
	// console.log({ country, region, city })

	return (
		<>
			<Modal centered isOpen={modal} toggle={toggle} className='modal-lg'>
				<div>
					<ModalHeader toggle={toggle}>{caption}</ModalHeader>
					<ModalBody>
						{preparing ? (
							<div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 200 }}>
								<span className='spinner-border text-success' style={{ fontSize: 22, width: 50, height: 50 }}></span>
								<br />
								<h6>Loading...</h6>
							</div>
						) : (
							<section className='ratio_45 section-b-space'>
								<form className='needs-validation user-add mx-4' noValidate=''>
									<Row>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.category ? 'text-danger' : ''}`}>*Produce Category</Label>
											<Select
												className={`w-100`}
												style={commonSelectStyles}
												options={categoryOptions}
												placeholder='Select category'
												name='category'
												value={category}
												onChange={(val) => {
													onCategoryChanged(val?.value)
												}}
												onBlur={() => onBlured('category', category)}
												menuPortalTarget={document.body}
											/>
										</Col>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.sub_category ? 'text-danger' : ''}`}>*Produce Sub Category</Label>
											<Select
												className={`w-100`}
												style={commonSelectStyles}
												options={subCategoryOptions}
												placeholder='Select sub-category'
												name='sub_category'
												value={subCategory}
												onChange={(val) => {
													onSubCategoryChanged(val?.value)
												}}
												onBlur={() => onBlured('sub_category', subCategory)}
												menuPortalTarget={document.body}
											/>
										</Col>
										<Col md='4' className='mb-3'>
											<Label className=''>Type</Label>
											<Select
												className={`w-100`}
												style={commonSelectStyles}
												options={typeOptions}
												placeholder='Select types'
												name='type'
												value={type}
												onChange={(val) => {
													setType(val?.value)
												}}
												onBlur={() => onBlured('type', type)}
												menuPortalTarget={document.body}
											/>
										</Col>
									</Row>
									<Row>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.country ? 'text-danger' : ''}`}>*Country</Label>
											<CountryInput
												value={country}
												onChange={(val) => {
													onCountryChanged(val?.value)
												}}
												directProps={{
													name: 'country',
													onBlur: () => onBlured('country', country),
												}}
											/>
										</Col>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.region ? 'text-danger' : ''}`}>*Region</Label>
											<RegionInput
												countryId={country}
												value={region}
												onChange={(val) => {
													onRegionChanged(val?.value)
												}}
												directProps={{
													name: 'region',
													onBlur: () => onBlured('region', region),
												}}
											/>
										</Col>
										<Col md='4' className='mb-3'>
											<Label className=''>City</Label>
											<CityInput
												regionId={region}
												value={city}
												onChange={(val) => {
													setCity(val?.value)
												}}
												directProps={{
													name: 'city',
													onBlur: () => onBlured('city', city),
												}}
											/>
										</Col>
									</Row>
									<Row>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.size ? 'text-danger' : ''}`}>*Size</Label>

											<Select
												className={`w-100`}
												style={commonSelectStyles}
												options={sizeOptions}
												placeholder='Select size'
												name='size'
												value={size}
												onChange={(val) => {
													setSize(val?.value)
												}}
												onBlur={() => onBlured('size', size)}
												menuPortalTarget={document.body}
											/>
										</Col>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.packaging ? 'text-danger' : ''}`}>*Packaging</Label>
											<Select
												className={`w-100`}
												style={commonSelectStyles}
												options={weightListOptions}
												placeholder='Select weight'
												name='weight'
												value={weight}
												onChange={(val) => {
													onWeightChanged(val?.value)
												}}
												onBlur={() => onBlured('weight', weight)}
												menuPortalTarget={document.body}
											/>
										</Col>
										<Col md='4' className='mb-3'>
											<Label>&nbsp;</Label>
											<Select
												className={`w-100`}
												style={commonSelectStyles}
												options={packagingOptions}
												placeholder='Select packaging'
												name='packaging'
												value={packaging}
												onChange={(val) => {
													setPackaging(val?.value)
												}}
												onBlur={() => onBlured('packaging', packaging)}
												menuPortalTarget={document.body}
											/>
										</Col>
									</Row>
									<Row>
										<Col md='5' className='mb-3'>
											<Label className=''>Farming Method</Label>

											<Select
												className={`w-100`}
												style={commonSelectStyles}
												options={farmingOptions}
												placeholder='Select farming method'
												name='farming'
												value={farming}
												onChange={(val) => {
													setFarming(val?.value)
												}}
												onBlur={() => onBlured('farming', farming)}
												menuPortalTarget={document.body}
											/>
										</Col>
									</Row>
									<Row>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.harvest_season ? 'text-danger' : ''}`}>*Harvest Season</Label>
											{/* <MultiSeasonSelect
										onSelected={onHarvestSelected}
										onRemoved={onHarvestRemoved}
										selectedValues={preHarvestSeasons}
									/> */}
											{harvestReRenderKey && (
												<Select
													className={`w-100`}
													multi={true}
													cacheOptions={false}
													style={commonSelectStyles}
													key={'harvest_season' + harvestReRenderKey}
													options={harvestSeasonOptions}
													placeholder='Select harvest seasons'
													name='harvest_season'
													value={preHarvestSeasons}
													onChange={(val) => {
														if (val && val?.length) {
															setPreHarvestSeasons([...val.map((x) => x.value)])
														} else {
															setPreHarvestSeasons([])
														}
														setStorageReRenderKey(null)
														setUnavailableReRenderKey(null)
														setStorageReRenderKey(nanoid())
														setUnavailableReRenderKey(nanoid())
													}}
													onBlur={() => onBlured('harvest_season', preHarvestSeasons)}
													menuPortalTarget={document.body}
												/>
											)}
										</Col>
										<Col md='4' className='mb-3'>
											<Label className={`${errors.storage_season ? 'text-danger' : ''}`}>*Storage Season</Label>
											{/* <MultiSeasonSelect
										onSelected={onStorageSelected}
										onRemoved={onStorageRemoved}
										selectedValues={preStorageSeasons}
									/> */}
											{storageReRenderKey && (
												<Select
													className={`w-100`}
													multi={true}
													cacheOptions={false}
													style={commonSelectStyles}
													key={'storage_season' + storageReRenderKey}
													options={storageSeasonOptions}
													placeholder='Select storage seasons'
													name='storage_season'
													value={preStorageSeasons}
													onChange={(val) => {
														if (val && val?.length) {
															setPreStorageSeasons([...val.map((x) => x.value)])
														} else {
															setPreStorageSeasons([])
														}
														setHarvestReRenderKey(null)
														setUnavailableReRenderKey(null)
														setHarvestReRenderKey(nanoid())
														setUnavailableReRenderKey(nanoid())
													}}
													onBlur={() => onBlured('storage_season', preStorageSeasons)}
													menuPortalTarget={document.body}
												/>
											)}
										</Col>
										<Col md='4' className='mb-3'>
											<Label className=''>Unavailable Season</Label>
											{/* <MultiSeasonSelect
										onSelected={(list) => setUnavailableSeasons([...list])}
										onRemoved={(list) => setUnavailableSeasons([...list])}
										selectedValues={preUnavailableSeasons}
									/> */}
											{unavailableReRenderKey && (
												<Select
													className={`w-100`}
													multi={true}
													cacheOptions={false}
													style={commonSelectStyles}
													key={'unavailable_season' + unavailableReRenderKey}
													options={unavailableSeasonOptions}
													placeholder='Select unavailable seasons'
													name='unavailable_season'
													value={preUnavailableSeasons}
													onChange={(val) => {
														if (val && val?.length) {
															setPreUnavailableSeasons([...val.map((x) => x.value)])
														} else {
															setPreUnavailableSeasons([])
														}
														setHarvestReRenderKey(null)
														setStorageReRenderKey(null)
														setHarvestReRenderKey(nanoid())
														setStorageReRenderKey(nanoid())
													}}
													onBlur={() => onBlured('unavailable_season', preUnavailableSeasons)}
													menuPortalTarget={document.body}
												/>
											)}
										</Col>
									</Row>
									<Row className={`mt-3`} style={{border: `${imageErrorText ? 'solid 1px red' : 'none'}`}}>
										<Col md='3'>
											<Label className=''>Produce Image</Label>
										</Col>
										{(imageSrc || imageUrl) && (
											<Col md='4'>
												{imageChanging ? (
													<div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 200 }}>
														<span className='spinner-border text-success' style={{ fontSize: 22, width: 50, height: 50 }}></span>
														<br />
														<h6>Image changing...</h6>
													</div>
												) : (
													<>
														{imageProcessing ? (
															<div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 200 }}>
																<span className='spinner-border text-success' style={{ fontSize: 22, width: 50, height: 50 }}></span>
																<br />
																<h6>Image processing...</h6>
															</div>
														) : (
															<>
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
															</>
														)}		
													</>
												)}
											</Col>
										)}
										<input style={{ display: 'none' }} ref={inputImageFile} onChange={handleSelectImage} type='file' />
										<Col md='3' className='mt-2'>
											{editingImage ? (
												<>
													{imageProcessing ? (
														<div style={{ width: '60%' }}>
														</div>
													) : (
														<div style={{ width: '60%' }}>
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
																className='btn-post mt-2 w-100'
															>
																Cancel
															</Button>
														</div>
													)}
												</>
											) : (
												<>
													{imageChanging ? (
														<div style={{ width: '60%' }}>
														</div>
													) : (
														<div style={{ width: '75%' }}>
															<Button type='button' onClick={handleSelectImageClick} className='btn-post'>
																{imageSrc || imageUrl ? 'Edit Image' : 'Select Image'}
															</Button>
														</div>
													)}
												</>
											)}
										</Col>
									</Row>
									<hr className='suggestion-divider mt-5'></hr>
									<div>
										<Label>
											Are we missing a produce category/subcategory or type from out options? Drop us a message below
											and we will look at having it added in to our categories soon.
										</Label>
										<div className='mt-2'>
											<textarea
												type='text'
												style={{ width: '100%' }}
												placeholder='Type your produce suggestion here...'
												rows='2'
												value={suggestionText}
												onChange={(e) => setSuggestionText(e.target.value)}
											></textarea>
										</div>
										<Button type='button' disabled={sending} className='py-1 px-3 mt-2' onClick={onSuggestionClicked}>
											{sending ? 'Sending...' : 'Send'}
										</Button>
									</div>
									<div className='mt-5 d-flex justify-content-center'>
										<button
											type='button'
											disabled={isLoading}
											className='btn btn-solid btn-default-plan py-2 px-3'
											onClick={onSaveClicked}
										>
											<span className='px-2'>{isLoading ? 'Loading...' : 'Save'}</span>
											{isLoading && <span className='spinner-border spinner-border-sm mr-1'></span>}
										</button>
									</div>
								</form>
							</section>
						)}
					</ModalBody>
				</div>
			</Modal>
			<AlertModal
				isShow={isShowAlertModal}
				onToggle={(isShowAlertModal) => setShowAlertModal(!isShowAlertModal)}
				message={`Please complete all required fields.`}
			/>
		</>
	)
}

export default ProduceSellerModal
