import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Media, Col, Container, Row, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import getConfig from 'next/config'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { getValidUrl } from '../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const ProduceModal = (props) => {
	const { isShow, onToggle } = props
	const router = useRouter()

	const [categories, setCategories] = useState([])

	useEffect(() => {
		const getCategories = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'get_produce_categories')

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setCategories(response.data.categories)
				} else if (response.data.error) {
					alert(response.data.message)
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		getCategories()
	}, [])

	const onCategoryClicked = (category_id, name) => {
		onToggle(!isShow)
		router.push(getValidUrl(`/produce/${category_id}/${name}`))
	}

	return (
		<Modal centered isOpen={isShow} toggle={() => onToggle(!isShow)} style={{ marginTop: 15 }}>
			{/* <ModalHeader
                className="border-0 d-flex justify-content-center"
                toggle={() => onToggle(!isShow)}
            >
                Choose a Produce Category Below
            </ModalHeader> */}
			<CloseModalBtn
				onClick={() => onToggle(!isShow)}
				styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
				iconProps={{ color: 'gray' }}
			/>
			<ModalBody className='px-2 pt-2 show-grid custom-grid'>
				<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
					Choose a Produce Category Below
				</h4>
				<section className='ratio_45 section-b-space'>
					<Container>
						<Row>
							{categories.map((category) => (
								<Col sm='6' md='6' className='produce-list-block mb-3' key={category._id}>
									<a href='#' onClick={() => onCategoryClicked(category.numeric_id, category.name)}>
										<div className='collection-banner produce-card'>
											<div className='img-part'>
												<Media alt={category.name}>
													<div
														style={{
															backgroundPosition: 'center center',
															backgroundSize: 'cover',
															backgroundRepeat: 'no-repeat',
															backgroundImage: `url(${encodeURI(
																`${contentsUrl + category.main_produce_image01ISfile}`
															)})`,
															width: '100%',
															height: '150px',
														}}
													></div>
												</Media>
											</div>
											<div
												className='contain-banner banner-5'
												style={{
													display: 'flex',
													justifyContent: 'center',
													padding: 0,
													background: 'rgba(0, 0, 0, .3)',
												}}
											>
												<div>
													<h4 style={{ marginBottom: 0, textAlign: 'center' }}>{category.name}</h4>
												</div>
											</div>
										</div>
									</a>
								</Col>
							))}
						</Row>
					</Container>
				</section>
			</ModalBody>
		</Modal>
	)
}

export default ProduceModal
