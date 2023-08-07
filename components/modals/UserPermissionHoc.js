import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useRouter } from 'next/router'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { TiInfo } from 'react-icons/ti'
import vars from '../../helpers/utils/vars'

const cardStyles = {
	backgroundColor: '#fff',
	borderRadius: 5,
	padding: '1.5rem',
	boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
}

const UserPermissionHoc = ({
	modal,
	onToggle,
	message,
	asModal = true,
	children,
	checkPermission, // Give a function that will return true if user have the required permission
	cardCustomStyles = {},
	cardClassName = 'w-100',
}) => {
	const router = useRouter()

	const onPlan = () => {
		router.push({ pathname: '/seller/account', query: { active: 'plan' } })
	}

	const content = (
		<div className='my-4 mx-1 d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 200 }}>
			<TiInfo size={50} color={vars.secondaryColor} />
			<br />
			<p className='text-center text-dark' style={{ fontSize: 18, lineHeight: 2 }}>
				{message || 'You need to upgrade membership to access this feature.'}
			</p>
			<div className='d-flex justify-content-center'>
				<button className='btn btn-solid btn-default-plan btn-post' onClick={onPlan}>
					My Plan
				</button>
			</div>
		</div>
	)

	const value = checkPermission?.()

	if (value) return children

	if (!asModal) {
		return (
			<div style={{ ...cardStyles, ...cardCustomStyles }} className={cardClassName}>
				{content}
			</div>
		)
	}

	return (
		<Modal isOpen={modal} toggle={onToggle} className='modal-md' centered>
			<ModalBody className='px-2 pb-2'>
				<CloseModalBtn
					onClick={onToggle}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
				{content}
			</ModalBody>
		</Modal>
	)
}

export default UserPermissionHoc
