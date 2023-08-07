import React, { Fragment, useContext } from 'react'
import getConfig from 'next/config'
import { Col, Media, Row } from 'reactstrap'
import { Award } from 'react-feather'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import { FiPhone, FiMail, FiGlobe } from 'react-icons/fi'
import { MdOutlineLocationOn } from 'react-icons/md'
import BlueUserLogo from '../../../../../public/assets/images/BlueUserLogo.png'
import BlueUserCover from '../../../../../public/assets/images/BlueUserCover.jpg'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const MyPageSetup = ({ countries }) => {
	const authContext = useContext(AuthContext)
	const user = authContext.user

	const country = countries.find((country) => country._id === user.countryISbb_agrix_countriesID)
	const region = countries.find((country) => country._id === user.regionISbb_agrix_countriesID)
	const city = countries.find((country) => country._id === user.cityISbb_agrix_countriesID)

	console.log('----------', user);

	const isBlueUser = user.membershipISbb_agrix_membership_typesID_data && user.membershipISbb_agrix_membership_typesID_data.name && user.membershipISbb_agrix_membership_typesID_data.name === 'Blue'

	const companyImage = isBlueUser ? BlueUserCover : contentsUrl + user.companybannerISfile
	const logoImageUrl = isBlueUser ? BlueUserLogo : user.companylogoISfile ? `${contentsUrl}${user.companylogoISfile}` : `/assets/images/empty.png`

	const bannerBackground = {
		backgroundImage:
			'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' +
			companyImage +
			')',
	}

	//setImgPath(`${baseUrl}/public/account/${state.companylogoISfile}`);

	return (
		<Fragment>
			<section className='category-banner-panel' style={bannerBackground}>
				<div className='seller-page-logo d-flex justify-content-center'>
					<Media
						src={logoImageUrl}
						alt='logo'
						className='img-fluid blur-up lazyload bg-img'
						style={{ borderRadius: 5, width: 165, height: 156 }}
					/>
					<Award style={{ display: 'none', position: 'relative', right: 0 }} color='#fd7e14' />
				</div>
				<div className='seller-page-info w-100'>
					<h3 className='text-center' style={{ fontSize: 22, fontWeight: 600, color: '#fff' }}>
						{user.company}
					</h3>
					<p className='text-center' style={{ fontSize: 20, color: '#fff' }}>
						{user.first_name + ' ' + user.last_name}
					</p>
				</div>
				<div className='img-part'>
				</div>
			</section>
			<section>
				<Row className='mb-4'>
					<Col md='8'>
						<div className='seller-info'>
							<h4 className='f-w-600 mb-4 mt-2 dashboard-title'>Company Summary</h4>
							<p className='mb-4-5' style={{ fontSize: 17, lineHeight: 1.4 }}>
								{user.companysummaryISsmallplaintextbox}
							</p>
							<h4 className='f-w-600 mb-4 mt-2 dashboard-title'>Company Description</h4>
							<p className='mb-3' style={{ fontSize: 17, lineHeight: 1.4 }}>
								{user.companydescriptionISsmallplaintextbox}
							</p>
						</div>
					</Col>
					<Col md='4'>
						<h4 className='f-w-600 mb-4 mt-2 dashboard-title'>Company Details</h4>
						{user.telephone && (
							<h6 className='mb-3'>
								<span className='d-flex align-items-center mb-1'>
									<FiPhone />
									&nbsp;Tel
								</span>
								<span className='pl-1' style={{ fontSize: 17 }}>
									{user.telephone ?? 'NA'}
								</span>
							</h6>
						)}
						{user.company_email && (
							<h6 className='mb-3'>
								<span className='d-flex align-items-center mb-1'>
									<FiMail />
									&nbsp;Email
								</span>
								<span className='pl-1' style={{ fontSize: 17 }}>
									{user.company_email ?? ''}
								</span>
							</h6>
						)}
						<h6 className='mb-3'>
							<span className='d-flex align-items-center mb-1'>
								<FiGlobe />
								&nbsp;Website
							</span>
							<span className='pl-1' style={{ fontSize: 17 }}>
								{user.website_url}
							</span>
						</h6>
						{(user.address_line_1 || user.address_line_2) && (
							<h6 className='mb-3'>
								<span className='d-flex align-items-center mb-1'>
									<MdOutlineLocationOn size={18} />
									&nbsp;Address
								</span>
								<div className='mt-1' style={{ fontSize: 17 }}>
									{user.address_line_1 ? (
										<p style={{ fontSize: 17 }} className='p-0 mb-2 pl-1'>
											{user.address_line_1}
										</p>
									) : (
										''
									)}
									{user.address_line_2 ? (
										<p style={{ fontSize: 17 }} className='p-0 mb-2 pl-1'>
											{user.address_line_2}
										</p>
									) : (
										''
									)}
									{user.area_code ? (
										<p style={{ fontSize: 17 }} className='p-0 mb-2 pl-1'>
											{user.area_code}{' '}
										</p>
									) : (
										''
									)}
									{city ? (
										<p style={{ fontSize: 17 }} className='p-0 mb-2 pl-1'>
											{city.name} (city)
										</p>
									) : (
										''
									)}
									{region ? (
										<p style={{ fontSize: 17 }} className='p-0 mb-2 pl-1'>
											{region.name} (region)
										</p>
									) : (
										''
									)}
									{country ? (
										<p style={{ fontSize: 17 }} className='p-0 mb-2 pl-1'>
											{country.name} (country)
										</p>
									) : (
										''
									)}
								</div>
							</h6>
						)}
					</Col>
				</Row>
			</section>
		</Fragment>
	)
}

export default MyPageSetup
