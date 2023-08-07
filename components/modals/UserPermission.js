import React, { useContext } from 'react'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import { useRouter } from 'next/router'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { TiInfo } from 'react-icons/ti'
import vars from '../../helpers/utils/vars'
import { AuthContext } from '../../helpers/auth/AuthContext'

const UserPermission = ({ modal, onToggle, others }) => {
	const { backButton = false, planButton = true, message, backBtnLabel, backBtnClassName = 'mr-4' } = others || {}
	const router = useRouter()
	const authContext = useContext(AuthContext)
	const user = authContext.user

	const onPlan = () => {
		router.push({ pathname: `/${user.role === 'buyer' ? 'buyer' : 'seller'}/account`, query: { active: 'plan' } })
		onToggle()
	}

	const _message = message || 'You need to upgrade membership to access this feature.'

	return (
		<Modal isOpen={modal} toggle={onToggle} className='modal-md' centered>
			<ModalBody className='px-3 pb-2'>
				<CloseModalBtn
					onClick={onToggle}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
				<div
					className='my-4 mx-1 d-flex flex-column justify-content-center align-items-center'
					style={{ minHeight: 200 }}
				>
					<TiInfo size={50} color={vars.secondaryColor} />
					<br />
					<p className='text-center text-dark mb-4' style={{ fontSize: 18, lineHeight: 1.4 }}>
						{_message}
					</p>
					<div className='d-flex justify-content-center'>
						{backButton && (
							<Button onClick={onToggle} className={backBtnClassName}>
								{backBtnLabel || 'Back'}
							</Button>
						)}
						{planButton && (
							<button className='btn btn-solid btn-default-plan btn-post' onClick={onPlan}>
								My Plan
							</button>
						)}
					</div>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default UserPermission
