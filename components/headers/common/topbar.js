import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../../helpers/auth/AuthContext'

const TopBar = ({ topClass = 'mb-1 mr-2 text-right' }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const user = authContext.user

	if (user?._id) return null

	return (
		// <div id="topHeader" className={`top-header ${topClass? topClass: ''}`}>
		<div className={topClass}>
			<button
				className='btn btn-solid btn-default-plan btn-post btn-sm mr-3'
				onClick={() => onAuthModalsTriggered('user_type')}
			>
				<i className='fa fa-user' aria-hidden='true'></i> Register
			</button>
			<button className='btn btn-solid btn-default-plan btn-post btn-sm' onClick={() => onAuthModalsTriggered('login')}>
				<i className='fa fa-sign-in' aria-hidden='true'></i> Login
			</button>
		</div>
		// </div>
	)
}

export default TopBar
