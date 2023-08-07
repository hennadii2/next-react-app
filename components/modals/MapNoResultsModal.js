import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

const MapNoResultsModal = ({ modal, toggle, message }) => {
	return (
		<Modal isOpen={modal} toggle={toggle} className='modal-md map-search' centered>
			<ModalHeader toggle={toggle}></ModalHeader>
			<ModalBody className='px-4 pb-3'>
				<div className='my-4'>
					<p className='text-center text-danger' style={{ fontSize: 18 }}>
						{message}
					</p>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default MapNoResultsModal
