import React, { useContext } from 'react'
import { Col, Row, Media, Container } from 'reactstrap'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { GrLocation } from 'react-icons/gr'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import NoContentCard from './NoContentCard'
import { useMediaQuery } from 'react-responsive'
import vars from '../../../../helpers/utils/vars'
import { getValidUrl, sortSellersByPlan } from '../../../../helpers/utils/helpers';
import BlueUserLogo from '../../../../public/assets/images/BlueUserLogo.png'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const MasterCollection = ({ sellerId, name, img, title, company, location, link, membership }) => {
	const router = useRouter()

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	const onSellerClicked = () => {		
		router.push(getValidUrl(`/seller/detail/${sellerId}/${name}`))
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
		<Col md='4' style={{ marginBottom: isTabletOrMobile ? 20 : 40 }}>
			<a href='#' className='linkCursor' onClick={onSellerClicked}>
				<div
					className={`collection-banner`}
					style={{
						minWidth: 300,
						position: 'relative',
						borderRadius: 5,
						boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
					}}
				>
					<div className='img-part'>
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
							<Media src={img} className='img-fluid-ads' alt={name} width='260' height='180' style={{ objectFit: 'contain' }} />
						) : (
							<Media
								src='/assets/images/empty.png'
								className='img-fluid-ads'
								alt={name}
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
								<GrLocation />
								<h6 className='ml-1'>{location}</h6>
							</div>
						)}
					</div>
				</div>
			</a>
		</Col>
	)
}

const SellersSpaceSmall = ({ caption, description, sectionClass, sellers, sellerProduces }) => {	
	let categorySellers = []
	for (let sellerProduce of sellerProduces) {
		const seller = sellers.find((s) => s.numeric_id === sellerProduce.userISbb_agrix_usersID)
		if (categorySellers.length > 0) {
			const categorySeller = categorySellers.find((cs) => cs.numeric_id === seller.numeric_id)
			if (!categorySeller) categorySellers.push(seller)
		} else {
			categorySellers.push(seller)
		}
	}
	categorySellers= sortSellersByPlan(categorySellers)

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<section className={sectionClass} style={{ width: '100%', maxWidth: 1000 }}>
				<Container>
					<h4 className='section-title mt-5 mb-4-5 text-center' style={{}}>
						{caption} {description}
					</h4>
					{categorySellers.length === 0 ? (
						<div className='d-flex justify-content-center'>
							<NoContentCard keyWord='sellers' className='mt-2 mb-5' />
						</div>
					) : null}
					<Row>
						{categorySellers.map((seller) => {
							const isBlueUser = seller.membershipISbb_agrix_membership_typesID_data && seller.membershipISbb_agrix_membership_typesID_data.name && seller.membershipISbb_agrix_membership_typesID_data.name === 'Blue'
							const imgUrl = isBlueUser ? BlueUserLogo : seller.companylogoISfile
													? contentsUrl + '' + seller.companylogoISfile
													: '/assets/images/empty.png'

							const countryName = seller.countryISbb_agrix_countriesID_data
								? seller.countryISbb_agrix_countriesID_data.name
								: ''
							const regionName = seller.regionISbb_agrix_countriesID_data
								? seller.regionISbb_agrix_countriesID_data.name
								: ''
							const cityName = seller.cityISbb_agrix_countriesID_data ? seller.cityISbb_agrix_countriesID_data.name : ''
							const membership = seller.membershipISbb_agrix_membership_typesID_data?.name || ''
							return (
								<MasterCollection
									key={seller._id}
									sellerId={seller.numeric_id}
									name={seller.name}
									img={imgUrl}
									membership={membership}
									link={seller.website_url}
									title={seller.first_name + ' ' + seller.last_name}
									company={seller.company}
									location={countryName + ' ' + regionName + ' ' + cityName}
								/>
							)
						})}
					</Row>
				</Container>
			</section>
		</div>
	)
}

export default SellersSpaceSmall
