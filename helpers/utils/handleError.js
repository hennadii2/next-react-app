/*
  Detail Error Log of AJAX req 
*/
// import React from 'react'
// import { CloseCircleOutlined } from '@ant-design/icons'

const handleError = (error, notify = false, filename) => {
	if (filename) {
		console.log(`AJAX Req Error in ${filename}`)
	} else {
		console.log('AJAX Req Error')
	}
	console.log('===============Error Info==================')
	let title = 'ERROR'
	let msg = 'Something went wrong. Check your internet connection and try again!'
	if (error.response) {
		console.log('Error Data: ', error.response.data)
		console.log('Error Status Code: ', error.response.status)
		console.log('Error Headers: ', error.response.headers)
		// Server responded with a status code that falls out of the range of 2xx
		const { error: errorMsg, error_description, message } = error.response.data
		if (errorMsg) {
			msg = errorMsg
			if (msg === 'invalid_token' && error.response.status === 401) {
				// Kick to login page
				setTimeout(() => window.location.reload(), 2000)
				title = 'Account archived'
				msg = 'Please contact support.'
			} else if (msg === 'invalid_grant') {
				msg =
					'Refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.'
				// Remove token from local storage
				// localStorage.removeItem(keys.accessToken)
			} else if (msg === 'untrusted_source') {
				msg = error_description
			}
		} else if (error.response.status === 404) {
			msg = "Sorry, can't find the data you're looking for."
		} else if (message) {
			msg = message
		}
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		console.log('Error: no response was received\n------------------\n', error.request)
	} else {
		// Something happened in setting up the request that triggered an Error
		console.log('Error: setting up the request\n-------------------\n', error.message)
	}
	console.log('Error Config:\n-----------------\n', error.config)
	console.log('==============End Error Info=============')
	const finalMsg = msg.replace('ERROR Error:', '').replace('Error:', '')
	// if (finalMsg && notify) {
	// 	notification.error({
	// 		message: title,
	// 		description: finalMsg,
	// 		duration: 6,
	// 		// closeIcon: <CloseCircleOutlined />,
	// 	})
	// }
	return finalMsg
}

export default handleError
