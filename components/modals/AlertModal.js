import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

const AlertModal = (props) => {
	const { isShow, onToggle, message } = props

	return (
		<Modal isOpen={isShow} toggle={onToggle} centered>
			<ModalHeader className='border-0' toggle={onToggle}>
				<span style={{ color: 'black', fontSize: 20 }}>Alert</span>
			</ModalHeader>
			<ModalBody>
				<div className='mb-4'>
					<p className='text-center text-dark' style={{ fontSize: 16 }}>
						{message}
					</p>
				</div>
				<div className='d-flex justify-content-center mb-4'>
					<button className='btn btn-secondary' size='sm' onClick={onToggle}>
						Close
					</button>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default AlertModal
