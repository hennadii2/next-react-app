import React, { useContext } from 'react'
import Slider from 'react-slick'
import { Slider4 } from '../../../../services/script'
import { Media, Container, Row, Col } from 'reactstrap'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import NoContentCard from './NoContentCard'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const AdSpaceProduce = ({ caption, description, sectionClass, planAdverts, rowNum }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const onAdClicked = (advert) => {		
		router.push(getValidUrl(`/seller/detail/${advert.userISbb_agrix_usersID}/${advert.userISbb_agrix_usersID_data.first_name}_${advert.userISbb_agrix_usersID_data.last_name}`))
	}

	return (
		<section className={sectionClass}>
			<h4 className='mb-4-5 mt-5 section-title text-center'>
				{caption} {description}
			</h4>
			{planAdverts.length === 0 ? (
				<div className='d-flex justify-content-center'>
					<NoContentCard keyWord='adverts' className='mt-3' />
				</div>
			) : null}
			{planAdverts.length < 4 ? (
				<Row>
					{planAdverts.map((advert) => (
						<Col md='4' key={advert._id}>
							<a href='#' className='linkCursor' onClick={() => onAdClicked(advert)}>
								<div className='d-flex justify-content-center align-items-center' style={{ height: '280px' }}>
									<Media
										src={contentsUrl + advert.advert_image01ISfile}
										className='img-fluid-ads'
										alt='advert'
										height='auto'
										width='280px'
										style={{ objectFit: 'contain', borderRadius: 5 }}
									/>
								</div>
							</a>
						</Col>
					))}
				</Row>
			) : (
				<Slider {...Slider4} className='slide-4'>
					{planAdverts.map((advert) => (
						<Col md='12' key={advert._id}>
							<a href='#' className='linkCursor' onClick={() => onAdClicked(advert)}>
								<div className='d-flex justify-content-center align-items-center' style={{ height: '280px' }}>
									<Media
										src={contentsUrl + advert.advert_image01ISfile}
										className='img-fluid-ads'
										alt='advert'
										height='auto'
										width='280px'
										style={{ objectFit: 'contain', borderRadius: 5 }}
									/>
								</div>
							</a>
						</Col>
					))}
				</Slider>
			)}
		</section>
	)
}
export default AdSpaceProduce
