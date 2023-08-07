import React, { useState, useContext } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { AuthContext } from '../../helpers/auth/AuthContext'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'

const UserTypeModal = (props) => {
	const { isShow, onClose } = props
	const authContext = useContext(AuthContext)
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const settingContext = useContext(SettingContext)
	const types = settingContext.appData.users_types
	const userTypes = types.filter((type) => type.name !== 'Admin')

	return (
		<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-md' centered>
			<ModalHeader className='border-0 '>
				<CloseModalBtn
					onClick={() => onClose(!isShow)}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
			</ModalHeader>
			<ModalBody className='px-4 pb-3'>
				<div className='mb-4'>
					<h4
						className='section-title text-center mt-4'
						style={{ fontWeight: '500', fontSize: 22, lineHeight: 1.3, textTransform: 'unset' }}
					>
						Please select below whether you would like to create a Buyers Account or a Sellers Account
					</h4>
				</div>
				<div className='d-flex justify-content-center mb-4'>
					<button
						className='btn btn-solid btn-default-plan btn-sm mr-3 px-5'
						onClick={() => onAuthModalsTriggered('membership', userTypes[0]._id, userTypes[0])}
					>
						{userTypes[0].name}
					</button>
					<button
						className='btn btn-solid btn-default-plan btn-sm px-5'
						onClick={() => onAuthModalsTriggered('membership', userTypes[1]._id, userTypes[1])}
					>
						{userTypes[1].name}
					</button>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default UserTypeModal
