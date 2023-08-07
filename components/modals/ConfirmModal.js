import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

const ConfirmModal = ({ modal, toggle, onConfirm, caption, message }) => {
	return (
		<Modal isOpen={modal} toggle={toggle} className='modal-md' centered>
			<ModalHeader toggle={toggle}>{caption}</ModalHeader>
			<ModalBody className='px-4 pb-3'>
				<div className='my-4'>
					<p className='text-center text-dark' style={{ fontSize: 18 }}>
						{message}
					</p>
				</div>
				<div className='d-flex justify-content-center mb-4'>
					<button className='btn btn-solid btn-default-plan btn-post mr-3' onClick={onConfirm}>
						Ok
					</button>
					<button className='btn btn-solid btn-secondary btn-post' onClick={toggle}>
						Cancel
					</button>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default ConfirmModal
