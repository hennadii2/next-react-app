import React, { Fragment, useContext, useState } from 'react'
import { Container, Col, Row, Media } from 'reactstrap'
import getConfig from 'next/config'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import { useRouter } from 'next/router'
import { GrLocation } from 'react-icons/gr'
import { isEmpty, sortSellersByPlan } from '../../../../helpers/utils/helpers'
import vars from '../../../../helpers/utils/vars'
import { getValidUrl } from '../../../../helpers/utils/helpers';
import BlueUserLogo from '../../../../public/assets/images/BlueUserLogo.png'

const infoUnavailableMsg = `Information Unavailable`
const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

export const MasterCollection = ({ seller }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const isBlueUser = seller.membershipISbb_agrix_membership_typesID_data && seller.membershipISbb_agrix_membership_typesID_data.name && seller.membershipISbb_agrix_membership_typesID_data.name === 'Blue'

	const sellerId = seller.numeric_id
	const title = seller.first_name + ' ' + seller.last_name
	const company = seller.company ?? ''
	const img = isBlueUser ? BlueUserLogo : seller.companylogoISfile
		? contentsUrl + '' + seller.companylogoISfile
		: '/assets/images/empty.png'

	const countryName = seller.countryISbb_agrix_countriesID_data?.name || ''
	const regionName = seller.regionISbb_agrix_countriesID_data?.name || ''
	const cityName = seller.cityISbb_agrix_countriesID_data?.name || ''

	const membership = seller.membershipISbb_agrix_membership_typesID_data?.name || ''
	const location = `${countryName ? `${countryName}` : ''}${regionName ? `, ${regionName}` : ''}${
		cityName ? `, ${cityName}` : ''
	}`.trim()
	// const tagsOrigin = seller.seller_produce.map((x) => x.produce_sub_category)
	// const tags = [...new Set(tagsOrigin)];

	const onSellerClicked = () => {
		router.push(getValidUrl(`/seller/detail/${sellerId}/${title}`))
	}

	const getColorStyles = () => {
		const _membership = membership.toLowerCase()
		switch (_membership) {
			case 'diamond':
				return { backgroundColor: '#b9f2ff', color: '#00bcd4' }
			case 'platinum':
				return { backgroundColor: '#E5E4E2', color: '#607d8b' }

			default:
				return { backgroundColor: _membership, color: '#fff' }
		}
	}

	return (
		<Col md='4' style={{ marginBottom: 40 }}>
			<a href='#' className='linkCursor' onClick={onSellerClicked}>
				<div
					className={`collection-banner`}
					style={{ position: 'relative', borderRadius: 5, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
				>
					<div className='img-part' style={{ backgroundColor: '#fff' }}>
						{membership ? (
							<div
								style={{
									padding: '5px 15px',
									borderRadius: 25,
									position: 'absolute',
									top: 10,
									left: 10,
									zIndex: 9,
									...getColorStyles(),
								}}
							>
								{membership}
							</div>
						) : null}
						{img ? (
							<Media src={img} className='img-fluid-ads' alt='advert' width='260' height='180' style={{ objectFit: 'contain' }} />
						) : (
							<Media
								src='/assets/images/empty.png'
								className='img-fluid-ads'
								alt='advert'
								width='260'
								height='180'
								style={{ objectFit: 'contain' }}
							/>
						)}
					</div>
					<div className='ourseller-info px-3 pb-3'>
						<h5 style={{ fontSize: 20, fontWeight: 'bold' }}>{company || title}</h5>
						{/* <h5 style={{ fontSize: 16 }}>{title}</h5> */}

						{location && (
							<div className='mt-1' style={{ display: 'flex', alignItems: 'center' }}>
								<div className='mr-2' style={{ width: 14, height: 14 }}>
									<GrLocation />
								</div>
								<h6>{location}</h6>
							</div>
						)}

						{/* {!isEmpty(tags) && (
							<div className='d-flex mt-2' style={{ flexWrap: 'wrap' }}>
								{tags.map((x, i) => (
									<span
										key={i}
										className='mr-1'
										style={{
											fontSize: 10,
											padding: '3px 10px',
											backgroundColor: 'rgb(136 217 145)',
											borderRadius: 10,
											color: '#000000a1',
											marginTop: 3,
											marginBottom: 3,
										}}
									>
										{x}
									</span>
								))}
							</div>
						)} */}
					</div>
				</div>
			</a>
		</Col>
	)
}

const OurSellersSpace = ({ sellers }) => {
	const sorted = sortSellersByPlan(sellers)
	// console.log('---------sellers', sellers);
	// console.log('---------sorted', sorted);
	return (
		<Fragment>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<section className='ratio_45 section-b-space mx-3' style={{ maxWidth: 1000 }}>
					<Container>
						<h4 className='section-title pt-5 mb-4-5 text-center' style={{}}>
							Most Recently Updated Listings
						</h4>
						<Row>
							{sorted.map((seller, i) => {
								// console.log(seller)
								return <MasterCollection key={i} seller={seller} />
							})}
						</Row>
					</Container>
				</section>
			</div>
		</Fragment>
	)
}

export default OurSellersSpace
