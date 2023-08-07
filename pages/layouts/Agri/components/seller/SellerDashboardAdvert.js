import React, { Fragment } from 'react'
import { Container, Col, Row, Media } from 'reactstrap'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import NoData from '../NoData/NoData'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const SellerDashboardAdvert = ({ advertsForSeller }) => {
	const router = useRouter()

	const adverts = advertsForSeller.filter(
		(advert) =>
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Active' ||
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Reactivated'
	)

	const onCreate = () => {
		router.push('/seller/adverts')
	}

	const onAdvertBtnClicked = () => {
		router.push('/seller/adverts')
	}

	return (
		<Container className='mt-5'>
			<h5 className='f-w-600 mb-4 dashboard-title'>Active Adverts</h5>
			{advertsForSeller.length === 0 ? (
				<NoData
					description='Looks like you have not created your first advert yet! Click below to start.'
					createLabel='Create New Advert'
					onCreate={onCreate}
				/>
			) : adverts.length === 0 ? (
				<NoData
					description='Looks like you have no activated adverts yet! Click below to activate.'
					createLabel='View My Adverts'
					onCreate={onCreate}
				/>
			) : (
				<Fragment>
					<Row className='partition4'>
						{adverts.map((advert) => {
							// const isValidate = priceisInDateRange(price.from_date, price.to_date)
							return (
								<Col md='4' className='mb-3' key={advert.numeric_id}>
									<div
										className='collection-banner'
										style={{ cursor: 'pointer', borderRadius: 5, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
										onClick={onAdvertBtnClicked}
									>
										<div className='img-part'>
											<Media
												src={contentsUrl + advert.advert_image01ISfile}
												className='img-fluid-ads'
												alt='advert'
												height='200px'
												width='260px'
												style={{ objectFit: 'cover', borderRadius: 5 }}
											/>
										</div>
									</div>
								</Col>
							)
						})}
					</Row>
					<div className='d-flex justify-content-end'>
						<button type='button' className='btn btn-solid btn-default-plan py-2 px-2' onClick={onAdvertBtnClicked}>
							See All Adverts
						</button>
					</div>
				</Fragment>
			)}
		</Container>
	)
}

export default SellerDashboardAdvert
