import React, { Fragment, useContext } from 'react'
import Slider from 'react-slick'
import { Media, Container, Row, Col } from 'reactstrap'
import { Slider4 } from '../../../../services/script'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const AdSpace = ({ planAdverts }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const onAdClicked = (advert) => {
		router.push(getValidUrl(`/seller/detail/${advert.userISbb_agrix_usersID}/${advert.userISbb_agrix_usersID_data.first_name}_${advert.userISbb_agrix_usersID_data.last_name}`))
	}
	return (
		<Fragment>
			<div className='mt-5 blog-bg' style={{ display: 'flex', justifyContent: 'center' }}>
				<section className='section-b-space slick-15 mx-3' style={{ width: '100%', maxWidth: 1200 }}>
					<Container>
						<h4 className='section-title text-center mb-4-5 mt-4'>Latest Adverts from Our Sellers</h4>
						<Row className='pb-4'>
							{planAdverts.length < 4 ? (
								<Fragment>
									{planAdverts.map((advert) => {
										if (
											!['Active', 'Reactivated'].includes(
												advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived
											)
										) {
											return null
										}
										return (
											<Col md='4' key={advert._id} className='mb-1'>
												<a href='#' className='linkCursor' onClick={() => onAdClicked(advert)}>
													<div className='d-flex justify-content-center align-items-center' style={{ height: '280px' }}>
														<Media
															src={contentsUrl + advert.advert_image01ISfile}
															className='img-fluid-ads'
															height='auto'
															width='280px'
															style={{ objectFit: 'contain', borderRadius: 5 }}
															alt='advert'
														/>
														<span></span>
													</div>
												</a>
											</Col>
										)
									})}
								</Fragment>
							) : (
								<Col md='12'>
									<Slider {...Slider4} className='slide-4'>
										{planAdverts.map((advert) => {
											if (
												!['Active', 'Reactivated'].includes(
													advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived
												)
											) {
												return null
											}
											return (
												<Col md='12' key={advert._id}>
													<a className='linkCursor' onClick={() => onAdClicked(advert)}>
														<div className='d-flex justify-content-center align-items-center' style={{ height: '280px' }}>
															<Media
																src={contentsUrl + advert.advert_image01ISfile}
																className='img-fluid-ads'
																height='auto'
																width='280px'
																alt='advert'
																style={{ objectFit: 'contain', borderRadius: 5 }}
															/>
															<span></span>
														</div>
													</a>
												</Col>
											)
										})}
									</Slider>
								</Col>
							)}
						</Row>
					</Container>
				</section>
			</div>
		</Fragment>
	)
}
export default AdSpace
