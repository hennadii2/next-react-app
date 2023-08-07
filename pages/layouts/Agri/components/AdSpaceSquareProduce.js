import React, { useContext, Fragment } from 'react'
import Slider from 'react-slick'
import { Row, Col, Media } from 'reactstrap'
import { Slider4 } from '../../../../services/script'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import NoContentCard from './NoContentCard'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const AdSpaceSquareProduce = ({ caption, description, premiumAdverts }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const onPremiumAdClicked = (advert) => {		
		router.push(getValidUrl(`/seller/detail/${advert.userISbb_agrix_usersID}/${advert.userISbb_agrix_usersID_data.first_name}_${advert.userISbb_agrix_usersID_data.last_name}`))
	}

	return (
		<section className='small-section slick-15 pt-0 produce mt-5'>
			<h4 className='mb-4-5 pt-4 section-title text-center'>
				{caption} {description}
			</h4>
			{premiumAdverts.length === 0 ? (
				<div className='d-flex justify-content-center'>
					<NoContentCard keyWord='adverts' className='mt-2' />
				</div>
			) : null}
			{premiumAdverts.length < 4 ? (
				<Row>
					{premiumAdverts.map((advert) => (
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
					))}
				</Row>
			) : (
				<Slider {...Slider4} className='slide-4'>
					{premiumAdverts.map((advert) => (
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
					))}
				</Slider>
			)}
		</section>
	)
}
export default AdSpaceSquareProduce
