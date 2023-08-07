import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const server_domain = publicRuntimeConfig.API_URL
export const contents_url = publicRuntimeConfig.CONTENTS_URL
export const apikey = publicRuntimeConfig.API_KEY
export const apisecret = publicRuntimeConfig.API_SECRET
export const default_avatar = "https://agrixchangedev.blueboxonline.com/portal/vunwfcrgsa/custom_modules/uploads/2022Jul/agrix_62d66437356e4.jpg"
// export const token = "dff0197768ba6725a346769fb485f46f"
export const noUserText = "Looks like you have no conversations yet, message a seller (or buyer) from their profile"
export const noChatText = "Type a message below to start a conversation..."

const screenshot_api_url = "https://shot.screenshotapi.net/screenshot"
const screenshot_api_token = "N090DJF-X69MXC6-P6386FR-G51AKG5"
export const previewImageURL = `${screenshot_api_url}?token=${screenshot_api_token}&url=`

export const getFormServer = () => {
	let formData = new URLSearchParams()
	formData.append('apikey', apikey)
	formData.append('apisecret', apisecret)

	return formData
}

export const getFormClient = () => {
	let formData = new FormData()
	formData.append('apikey', apikey)
	formData.append('apisecret', apisecret)

	return formData
}

export const seasonOptions = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

export const getCurrentMonthName = () => {
	const month = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const d = new Date()
	return month[d.getMonth()]
}
