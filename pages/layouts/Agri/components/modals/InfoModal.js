import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import { Search } from 'react-feather'
import {
	Media,
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Collapse,
	Container,
	Button,
	Input,
	Label,
	Table,
	Form,
	FormGroup,
} from 'reactstrap'
import CloseModalBtn from '../../../../../helpers/utils/CloseModalBtn'

const SellerSearch = ({ modal, toggle, textData = '' }) => {
	return (
		<div>
			<div>
				<Modal
					contentClassName='modal-search'
					modalClassName='modalSearchReports'
					centered
					isOpen={modal}
					toggle={toggle}
					className='search-seller-modal'
				>
					<div>
						<CloseModalBtn
							onClick={toggle}
							styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
							iconProps={{ color: 'gray' }}
						/>
						<div className='d-flex justify-content-center'>
							<span style={{ position: 'absolute', top: 32 }}>
								<i style={{ fontSize: 40 }} id='tooltip-info-icon' className='fa fa-info-circle circle-icon' />
							</span>
						</div>
						<ModalBody className='p-3 mt-5'>
							<section className='ratio_45 section-b-space'>
								<Container>
									<Row>
										<Col className='col-md-4'></Col>
									</Row>
									<Row>
										<Col className='col-md-12'>
											<p className='m-0 p-0' style={{ fontSize: 17, lineHeight: 1.4 }}>
												{textData}
											</p>
										</Col>
									</Row>
								</Container>
							</section>
						</ModalBody>
					</div>
				</Modal>
			</div>
		</div>
	)
}

export default SellerSearch
