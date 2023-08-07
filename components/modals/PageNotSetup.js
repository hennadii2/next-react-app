import React, { useContext } from 'react'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import { useRouter } from 'next/router'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { AuthContext } from '../../helpers/auth/AuthContext'

const PageNotSetup = ({ modal, onToggle }) => {
	const router = useRouter()
	const authContext = useContext(AuthContext)
	const user = authContext.user

	const onGetStarted = () => {
		router.push({ pathname: `/${user.role === 'buyer' ? 'buyer' : 'seller'}/page`})
		onToggle()
	}

	const _message = 'It looks like you have not created your profile page yet'
	const _message2 = "Let's get started by setting up your page"

	return (
		<Modal isOpen={modal} toggle={onToggle} className='modal-md' centered>
			<ModalBody className='px-3 pb-2'>
				<CloseModalBtn
					onClick={onToggle}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
				<div
					className='my-4 px-5 mx-1 d-flex flex-column justify-content-center align-items-center'
					style={{ minHeight: 200 }}
				>
					<p className='text-center text-dark mb-4' style={{ fontSize: 22, lineHeight: 1.5 }}>
						Welcome
					</p>
					<p className='text-center text-dark mb-2' style={{ fontSize: 18, lineHeight: 1.4 }}>
						{_message}
					</p>
					<p className='text-center text-dark mb-4' style={{ fontSize: 18, lineHeight: 1.4 }}>
						{_message2}
					</p>
					<div className='d-flex justify-content-center'>						
						<button className='btn btn-solid btn-default-plan btn-post' onClick={onGetStarted}>
							Get Started
						</button>
					</div>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default PageNotSetup
