import React from 'react'
import { Modal, ModalHeader, ModalBody, Table, Button } from 'reactstrap'
import { getColorStyles, Td, Th, Tr } from '../../pages/layouts/Agri/components/DashboardPlan'

const AdvertPositionSellerModal = ({ modal, onToggle, positions, onPositionSelected }) => {
	const modifiedPositions = positions.map(p => {
		let description = '';
		if (p.name === 'Standard') {
			description = "Promote your produce with our Standard Advert! This option allows you to target your advertisements specifically to the category of the produce you sell. This means your product will be showcased to an audience that is already interested in what you're offering. Why scatter your seeds in the wind when you can plant them in fertile ground? With our Standard Advert, your product will be displayed to a concentrated group of potential buyers who are specifically looking for your produce type. Reach the right audience at the right time, only with our Standard Advert!"
		} else if (p.name === 'Premium') {
			description = "Want to maximize your reach and visibility? Our Premium Advert option is just for you. This bigger, better advertisement package offers prime placement at the top of all categories across our site. It's like having your produce displayed at the front and center of the marketplace, visible to every visitor, regardless of what they're specifically looking for. Your product will gain unprecedented exposure, increasing the chances of connecting with diverse buyers. Make your product a household name in the agricultural community with our Premium Advert. Stand tall, stand out, and watch your business thrive!"
		}
		return {
			...p,
			description
		};
	})
	return (
		<Modal centered isOpen={modal} className='modal-lg' toggle={onToggle}>
			<ModalHeader toggle={onToggle}>Select your advert type</ModalHeader>
			<ModalBody className='m-4'>
				{/* <h5 className="f-w-600 mb-3">Create A New Advert</h5> */}
				{modifiedPositions.length === 0 ? (
					<div className='text-center'>
						<span style={{ fontSize: 18 }}>There is no position to display.</span>
						<br />
						<Button type='button' onClick={onToggle} color='primary' className='btn mt-3'>
							<span className='px-2'>Close</span>
						</Button>
					</div>
				) : (
					<div
						style={{
							backgroundColor: '#fff',
							borderRadius: 5,
							boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
						}}
					>
						<Table responsive style={{ marginBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
							<thead style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
								<Tr style={{ textAlign: 'center', backgroundColor: '#131b28' }}>
									<Th style={{ borderTopLeftRadius: 5 }}>Position</Th>
									<Th>Price per Month</Th>
									<Th>Width</Th>
									<Th>Height</Th>
									<Th style={{ borderTopRightRadius: 5 }}>Action</Th>
								</Tr>
							</thead>
							<tbody>
								{modifiedPositions.map((position) => (
									<>
										<tr key={position._id} style={{ textAlign: 'center' }}>
											<Td>
												<div className='d-flex justify-content-center'>
													<div
														style={{
															width: 'max-content',
															padding: '5px 15px',
															borderRadius: 25,
															backgroundColor: position?.name === 'Standard' ? '#8c8c8c' : '#20963d3d',
															color: position?.name === 'Standard' ? '#fff' : '#20963d',
														}}
													>
														{position?.name}
													</div>
												</div>
											</Td>
											<Td>{parseFloat(position.priceNUM).toFixed(2)}</Td>
											<Td>250</Td>
											<Td>{position.name === 'Premium' ? '250' : '150'}</Td>
											<Td className='d-flex justify-content-center'>
												<button
													className='btn btn-solid btn-default-plan btn-post btn-sm'
													onClick={() => onPositionSelected(position)}
												>
													{/* <i className='fa fa-dollar' aria-hidden='true'></i> */}
													Purchase
												</button>
											</Td>
										</tr>
										<tr>
											<td colspan='5'>
												<div>{position.description}</div>
											</td>
										</tr>
									</>
								))}
							</tbody>
						</Table>
					</div>
				)}
			</ModalBody>
		</Modal>
	)
}

export default AdvertPositionSellerModal
