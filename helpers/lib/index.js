import axios from 'axios'
import getConfig from 'next/config'
import { getFormServer, previewImageURL } from '../../services/constants'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

export const listReports = async (linked_data, category_id, subcategory_id, user_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_reports')
	if (linked_data) formData.append('get_linked_data', linked_data)
	if (category_id) formData.append('produce_categoryISbb_agrix_produce_typesID', category_id)
	if (subcategory_id) formData.append('produce_sub_categoryISbb_agrix_produce_typesID', subcategory_id)
	if (user_id) formData.append('userISbb_agrix_usersID', user_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const getReports = async (id, user_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'get_reports')
	formData.append('get_linked_data', '1')
	formData.append('_id', id)
	formData.append('user_id', user_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.item
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const getAllUsers = async (type, limit, user_ids) => {
	let formData = getFormServer()
	formData.append('api_method', 'get_all_users')
	type && formData.append(type, '1') // type = sellers / buyers
	limit && formData.append('limit', limit)
	user_ids && formData.append('user_ids', user_ids)
	
	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			const users = response.data.list.filter(u => u.temporary_userYN === "0")
			return users
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}
export const getSellers = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'list_users')
	formData.append('typeISbb_agrix_users_typesID', '2')
	formData.append('get_linked_data', '1')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const getBuyers = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'list_users')
	formData.append('typeISbb_agrix_users_typesID', '3')
	formData.append('get_linked_data', '1')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const getSellerById = async (id) => {
	let formData = getFormServer()
	formData.append('api_method', 'get_users')
	formData.append('_id', id)
	formData.append('get_linked_data', '1')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.item
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return {}
}

export const getBanner = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'get_content')
	formData.append('name', 'homepage')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.content
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return {}
}

export const getCategories = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'get_produce_categories')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.categories
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const listProduceTypes = async (refer_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_produce_types')
	if (refer_id) formData.append('refers_toISbb_agrix_produce_typesID', refer_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const getProduceTypes = async (id) => {
	let formData = getFormServer()
	formData.append('api_method', 'get_produce_types')
	formData.append('_id', id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.item
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return {}
}

export const listAdvertsPositions = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'list_adverts_positions')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const listAdverts = async (linked_data, category_id, subcategory_id, position_id, order_by) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_adverts')
	if (linked_data) formData.append('get_linked_data', '1')
	if (category_id) formData.append('produce_categoryISbb_agrix_produce_typesID', category_id)
	if (subcategory_id) formData.append('produce_sub_categoryISbb_agrix_produce_typesID', subcategory_id)
	if (position_id) formData.append('positionISbb_agrix_adverts_positionsID', position_id)
	if (order_by) formData.append('order_by', order_by)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const listAdvertsByUserId = async (user_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_adverts')
	formData.append('userISbb_agrix_usersID', user_id)
	formData.append('get_linked_data', '1')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const listCountries = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'list_countries')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const getMembershipTypes = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'get_membership_types')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.membership_types
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const listUsersProduce = async (linked_data, category_id, subcategory_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_users_produce')
	if (linked_data) formData.append('get_linked_data', linked_data)
	if (category_id) formData.append('produce_categoryISbb_agrix_produce_typesID', category_id)
	if (subcategory_id) formData.append('produce_sub_categoryISbb_agrix_produce_typesID', subcategory_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const listProducesByUserId = async (user_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_users_produce')
	formData.append('userISbb_agrix_usersID', user_id)
	formData.append('get_linked_data', '1')

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const lisUsersProducePricing = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'list_users_produce_pricing')
	formData.append('get_linked_data', 1)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const listUsersFavourites = async (user_id, fav_user_id, fav_prod_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_users_favourites')
	formData.append('get_linked_data', '1')
	if (user_id) formData.append('userISbb_agrix_usersID', user_id)
	if (fav_user_id) formData.append('fav_userISbb_agrix_usersID', fav_user_id)
	if (fav_prod_id) formData.append('fav_produceISbb_agrix_users_produceID', fav_prod_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const getUserById = async (id) => {
	let formData = getFormServer()
	formData.append('api_method', 'get_user')
	formData.append('_id', id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS' && response.data.long_id && response.data.long_id === id) {
			return response.data
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return {}
}

export const listUsersMessages = async (from_id = null, to_id = null, isNew = false) => {
	let formData = getFormServer()
	formData.append('api_method', 'list_users_messages')
	if (from_id) formData.append('userISbb_agrix_usersID', from_id)
	if (to_id) formData.append('to_userISbb_agrix_usersID', to_id)
	formData.append('get_linked_data', 1)
	if (isNew) formData.append('seenYN', 0)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.list
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return []
}

export const addUsersMessages = async (from_id, to_id, message, user_id, session_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'add_users_messages')
	formData.append('userISbb_agrix_usersID', from_id)
	formData.append('to_userISbb_agrix_usersID', to_id)
	formData.append('messageISsmallplaintextbox', message)
	formData.append('user_id', user_id)
	formData.append('session_id', session_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return true
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return false
}

export const updateUsersMessages = async (message, user_id, session_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'update_users_messages')
	formData.append('_id', message._id)
	formData.append('seenYN', 1)
	formData.append('messageISsmallplaintextbox', message.messageISsmallplaintextbox)
	formData.append('userISbb_agrix_usersID', message.userISbb_agrix_usersID)
	formData.append('to_userISbb_agrix_usersID', message.to_userISbb_agrix_usersID)
	formData.append('user_id', user_id)
	formData.append('session_id', session_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return true
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return false
}

export const validateSessioin = async (user_id, session_id) => {
	let formData = getFormServer()
	formData.append('api_method', 'validate_session')	
	formData.append('user_id', user_id)
	formData.append('session_id', session_id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return false
}

export const getScreenshot = async (websiteURL) => {
	try {
		const response = await axios.request({
			url: previewImageURL + websiteURL,
			method: 'GET',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})

		if (response.data && response.data.screenshot) {
			return response.data.screenshot
		} else {
			console.log(response)
		}		
	} catch (err) {
		console.log(err.toString())
	}
	return null
}

export const getMembershipLogById = async (id) => {
	let formData = getFormServer()
	formData.append('api_method', 'get_membership_log')
	formData.append('get_linked_data', '1')
	formData.append('_id', id)

	try {
		const response = await axios.request({
			url: apiUrl,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.item
		} else if (response.data.error) {
			console.log(response.data.error)
			return {}
		}
	} catch (err) {
		console.log(err.toString())
		return {}
	}
}