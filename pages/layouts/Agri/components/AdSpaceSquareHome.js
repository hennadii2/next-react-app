import React, { Fragment, useContext } from 'react'
import Slider from 'react-slick'
import { Slider4 } from '../../../../services/script'
import { Media, Container, Row, Col } from 'reactstrap'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const AdSpaceSquareHome = ({ premiumAdverts }) => {
	const router = useRouter()
	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const onPremiumAdClicked = (advert) => {		
		router.push(getValidUrl(`/seller/detail/${advert.userISbb_agrix_usersID}/${advert.userISbb_agrix_usersID_data.first_name}_${advert.userISbb_agrix_usersID_data.last_name}`))
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }} className='mt-5 blog-bg'>
			<section className='section-b-space slick-15 mx-3' style={{ width: '100%', maxWidth: 1000 }}>
				<Container>
					<h4 className='mb-4-5 mt-4 section-title text-center'>Featured Premium Sellers</h4>

					<Row className='pb-4'>
						{premiumAdverts.length < 4 ? (
							<Fragment>
								{premiumAdverts.map((advert) => {
									if (
										!['Active', 'Reactivated'].includes(
											advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived
										)
									) {
										return null
									}

									return (
										<Col md='4' key={advert._id}>
											<a href='#' className='linkCursor' onClick={() => onPremiumAdClicked(advert)}>
												<div className='d-flex justify-content-center'>
													<Media
														src={contentsUrl + advert.advert_image01ISfile}
														className='img-fluid-ads'
														alt='advert'
														height='280px'
														width='280px'
														style={{ objectFit: 'cover', borderRadius: 5 }}
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
									{premiumAdverts.map((advert) => {
										if (
											!['Active', 'Reactivated'].includes(
												advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived
											)
										) {
											return null
										}
										return (
											<Col md='12' key={advert._id}>
												<a href='#' className='linkCursor' onClick={() => onPremiumAdClicked(advert)}>
													<div className=''>
														<Media
															src={contentsUrl + advert.advert_image01ISfile}
															className='img-fluid-ads'
															alt='advert'
															height='280px'
															width='280px'
															style={{ objectFit: 'cover', borderRadius: 5 }}
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
	)
}
export default AdSpaceSquareHome
