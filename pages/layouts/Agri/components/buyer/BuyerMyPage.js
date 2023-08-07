import React, { useContext } from 'react'
import getConfig from 'next/config'
import { Media, Col, Row } from 'reactstrap'
import { Award } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import vars from '../../../../../helpers/utils/vars'
import { FiPhone, FiMail, FiGlobe } from 'react-icons/fi'
import { MdOutlineLocationOn } from 'react-icons/md'
import { IoPersonCircleOutline } from 'react-icons/io5'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const MyPageSetup = () => {
	const authContext = useContext(AuthContext)
	const user = authContext.user

	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	return (
		<section className='ratio_45 section-b-space pt-2'>
			<Row className='mt-1'>
				<Col md='6' className='d-flex align-items-center mt-2'>
					{user.companylogoISfile && (
						<Media
							src={contentsUrl + user.companylogoISfile}
							className='img-fluid'
							alt='company'
							style={{ objectFit: 'fill', width: '100%', borderRadius: 5 }}
						/>
					)}
				</Col>
				<Col md='6'>
					<h4 className={`${isTabletOrMobile ? 'mt-4' : 'ml-4'} dashboard-title f-w-600 mt-1 mb-4`}>
						{user.company ?? ''} Company Details
					</h4>
					<Row>
						<Col md='6'>
							<div className={`${isTabletOrMobile ? 'mt-4' : 'ml-4'}`}>
								<h6 className='mb-3'>
									<span className='d-flex align-items-center mb-1'>
										<IoPersonCircleOutline size={18} />
										&nbsp;Buyer Name
									</span>
									<span style={{ fontSize: 20 }}>{user.first_name + ' ' + user.last_name}</span>
								</h6>
								<h6 className='mb-3'>
									<span className='d-flex align-items-center mb-1'>
										<FiPhone />
										&nbsp;Tel
									</span>
									<span style={{ fontSize: 17 }}>{user.telephone ?? ''}</span>
								</h6>
								<h6 className='mb-3'>
									<span className='d-flex align-items-center mb-1'>
										<FiMail />
										&nbsp;Email
									</span>
									<span style={{ fontSize: 17 }}>{user.company_email ?? ''}</span>
								</h6>
								{/* <h6>Website: {user.website_url ?? ""}<Award color="#fd7e14"/></h6> */}
							</div>
						</Col>
						<Col md='6'>
							<h6 className='mb-3'>
								<span className='d-flex align-items-center mb-1'>
									<FiGlobe />
									&nbsp;Website
								</span>
								<span style={{ fontSize: 17 }}>{user.website_url ?? ''}</span>
							</h6>
							<h6 className='mb-3'>
								<span className='d-flex align-items-center mb-1'>
									<MdOutlineLocationOn size={18} />
									&nbsp;Address 1
								</span>
								<span style={{ fontSize: 17 }}>{user.address_line_1 ?? ''}</span>
							</h6>
							<h6 className='mb-3'>
								<span className='d-flex align-items-center mb-1'>
									<MdOutlineLocationOn size={18} />
									&nbsp;Address 2
								</span>
								<span style={{ fontSize: 17 }}>{user.address_line_2 ?? ''}</span>
							</h6>
						</Col>
					</Row>
				</Col>
			</Row>
			<h4 className='dashboard-title f-w-600 mt-4-5 mb-3'>Company Summary</h4>
			<p className='' style={{ fontSize: 16, lineHeight: 1.4 }}>
				{user.companysummaryISsmallplaintextbox ?? ''}
			</p>
			<h4 className='dashboard-title f-w-600 mt-4-5 mb-3'>Company Description</h4>
			<p className='' style={{ fontSize: 16, lineHeight: 1.4 }}>
				{user.companydescriptionISsmallplaintextbox ?? ''}
			</p>
		</section>
	)
}

export default MyPageSetup
