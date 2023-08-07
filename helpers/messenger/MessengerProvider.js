import React from 'react'
import { MessengerContext } from './MessengerContext'

const MessengerProvider = (props) => {

	return (
		<MessengerContext.Provider value={{ ...props }}>
			{props.children}
		</MessengerContext.Provider>
	)
}

export default MessengerProvider
