import React, { useContext } from 'react'
import { AuthContext } from '../../../../helpers/auth/AuthContext'

function NoContentCard({ keyWord = '', children, styles = {}, className = '' }) {
	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	return (
		<div
			style={{
				backgroundColor: '#fff',
				borderRadius: 5,
				width: 'max-content',
				boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
				...styles,
			}}
			className={'d-flex flex-column align-items-center px-5 py-4 ' + className}
		>
			{children || (
				<>
					<h3 style={{ textAlign: 'center' }}>It looks like there are no {keyWord} for this produce yet.</h3>
					{!isAuth && <h3 style={{ textAlign: 'center' }}>Login or sign up below to add one.</h3>}
				</>
			)}

			{!isAuth && (
				<button
					className='btn btn-solid btn-default-plan btn-post btn-sm mt-3'
					onClick={() => onAuthModalsTriggered('login')}
				>
					<i className='fa fa-sign-in' aria-hidden='true'></i> Login
				</button>
			)}
		</div>
	)
}

export default NoContentCard
