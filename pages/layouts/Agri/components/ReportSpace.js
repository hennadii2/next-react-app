import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import Slider from 'react-slick'
import { Slider2 } from '../../../../services/script'
import getConfig from 'next/config'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import { useRouter } from 'next/router'
import ReportDetailSeller from '../../../../components/modals/ReportDetailSeller'
import NoContentCard from './NoContentCard'
import { useMediaQuery } from 'react-responsive'
import vars from '../../../../helpers/utils/vars'
import PlaceholderImage from '../../../../public/assets/images/placeholder.webp'
import { isEmpty } from '../../../../helpers/utils/helpers'
import { BsBuilding } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'
import { BiCubeAlt, BiDiamond } from 'react-icons/bi'
import Link from 'next/link'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const emptyMsg = 'Information Unavailable'

export const MasterReport = ({ report, imgMaxWidth, size, wrapperStyles = {}, cardHeight }) => {
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })
	const router = useRouter()
	const MAX_LENGTH_1 = size === 'normal' ? 240 : 160
	const MAX_LENGTH_2 = size === 'normal' ? 550 : 350
	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const user = authContext.user
	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget
	const summary = report.summaryISsmallplaintextbox

	const [showDetail, setShowDetail] = useState(false)
	const [isShareButtons, setShareButtons] = useState(false)

	useEffect(() => {
		const elements = document.getElementsByClassName('media-share-dropdown')
		for (let element of elements) {
			element.classList.remove('btn-secondary')
		}
	}, [])

	const onMoreClicked = (e) => {
		e.preventDefault()
		if (!isAuth) {			
			onTarget(window.location.pathname)
			onAuthModalsTriggered('login')
		}
		else if (isBlueUser) {
			onAuthModalsTriggered('Permission', '', {
				backButton: true,
				message: 'Oops. You need to upgrade your subscription to view these!',
			})
		} else {
			setShowDetail(true)
		}
	}

	const onClickCompany = (id, name) => {
		const url=getValidUrl(`/seller/detail/${id}/${name}`)
		router.push(url)		
	}

	const formatedSummary = (
		<div className='text-dark' style={{ lineHeight: 1.3, textAlign: 'justify', position: 'relative' }}>
			{summary.length > MAX_LENGTH_2 ? (
				<span>{summary.substring(MAX_LENGTH_1 + 1, MAX_LENGTH_2) + '...'}</span>
			) : (
				<span>{summary}</span>
			)}
		</div>
	)

	const countryName = report.countryISbb_agrix_countriesID_data ? report.countryISbb_agrix_countriesID_data.name : ''
	const regionName = report.regionISbb_agrix_countriesID_data ? report.regionISbb_agrix_countriesID_data.name : ''
	const cityName = report.cityISbb_agrix_countriesID_data ? report.cityISbb_agrix_countriesID_data.name : ''
	// console.log(report)
	const location =
		countryName + `${countryName ? ', ' : ''}` + regionName + `${regionName && cityName ? ', ' : ''}` + cityName
	const company = report.userISbb_agrix_usersID_data?.company || emptyMsg

	return (
		<Fragment>
			<div
				className='report-wrapper'
				style={{
					borderRadius: 5,
					margin: 20,
					marginRight: 0,
					marginLeft: 0,
					boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
					maxWidth: 677,
					height: 'auto',
					backgroundColor: '#fff',
					...wrapperStyles,
				}}
			>
				<h4 className='mb-4 p-0 text-center pointer' style={{ color: '#2d2a25', fontWeight: 700 }} onClick={onMoreClicked}>
					{report.name}
				</h4>
				<ARow className='mb-4' gutter={[20, 0]} justify='space-between' style={{ height: '100%' }}>
					<ACol span={24} md={14} style={{ height: '100%' }}>
						<div
							onClick={onMoreClicked}
							style={{
								width: '100%',
								height: '100%',
								minHeight: 200,
								// maxWidth: isTabletOrMobile ? '100%' : imgMaxWidth,
								maxHeight: 200,
								backgroundImage: report.report_image01ISfile
									? `url(${contentsUrl + '' + report.report_image01ISfile})`
									: `url(${PlaceholderImage})`,
								backgroundColor: '#fff',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								backgroundSize: 'contain',
								borderRadius: 2,
							}}
							className='pointer'
						/>
					</ACol>
					<ACol span={24} md={10} className='mt-2' style={{ height: '100%' }}>
						<div className='mb-3 d-flex align-items-center'>
							<div style={{ width: 25, height: 25 }} className='mr-2'>
								<BsBuilding size={25} />
							</div>
							<div>
								<p style={{ lineHeight: 1.4 }} className='m-0 p-0'>
									<span className='link' onClick={(e) => onClickCompany(report.userISbb_agrix_usersID, company)}>{company}</span>
								</p>
							</div>
						</div>
						<div className='mb-3 d-flex align-items-center'>
							<div style={{ width: 25, height: 25 }} className='mr-2'>
								<GrLocation size={25} />
							</div>
							<div>
								<p style={{ lineHeight: 1.4 }} className='m-0 p-0'>
									{location || emptyMsg}
								</p>
							</div>
						</div>
						<div className='mb-3 d-flex align-items-center'>
							<div style={{ width: 25, height: 25 }} className='mr-2'>
								<BiCubeAlt size={25} />
							</div>
							<div>
								<p style={{ lineHeight: 1.4 }} className='m-0 p-0'>
									{report.produce_categoryISbb_agrix_produce_typesID_data?.name || emptyMsg}
								</p>
							</div>
						</div>
						<div className='mb-3 d-flex align-items-center'>
							<div style={{ width: 25, height: 25 }} className='mr-2'>
								<BiDiamond size={25} />
							</div>
							<div>
								<p style={{ lineHeight: 1.4 }} className='m-0 p-0'>
									{report.produce_sub_categoryISbb_agrix_produce_typesID_data?.name || emptyMsg}
								</p>
							</div>
						</div>
					</ACol>
				</ARow>
				<div className='mb-3'>
					<h4 className='mb-3' style={{ color: '#2d2a25', fontWeight: 600 }}>
						Report Summary
					</h4>
					{formatedSummary}
				</div>
				<ARow justify='end'>
					<Button onClick={onMoreClicked} size='lg' style={{ padding: '5px 10px' }}>
						See more
					</Button>
				</ARow>
			</div>
			<ReportDetailSeller
				isShow={showDetail}
				onToggle={() => setShowDetail(!showDetail)}
				report={{ ...report, __location: location, company }}
			/>
		</Fragment>
	)
}

const ReportSpace = ({ reports: _reports, imgMaxWidth, size, wrapperClassName, cardHeight = 310 }) => {
	const router = useRouter()
	const reports = _reports.filter((r) => r.statusISLIST_Draft_Approved_Declined_Archived === 'Approved')

	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })
	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const user = authContext.user
	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	const onAllClicked = () => {
		if (!isAuth) {
			onTarget('/reports')
			onAuthModalsTriggered('login')
		} else if (isBlueUser) {
			onAuthModalsTriggered('Permission', '', {
				backButton: true,
				message: 'Oops. You need to upgrade your subscription to view these!',
			})
		} else {
			router.push('/reports')
		}
	}

	return (
		<Fragment>
			<div className={wrapperClassName || 'mt-5'} style={{ display: 'flex', justifyContent: 'center' }}>
				<section
					id='report'
					className={`section-b-space ratio_portrait ${isTabletOrMobile ? '' : 'mx-4'}`}
					style={{ width: '100%', maxWidth: 1200 }}
				>
					<Container>
						<h4 className='section-title mb-3 text-center'>Recent Seller Reports</h4>
						{/* <div style={{ display: 'flex', justifyContent: 'center' }}>
						<p className='mb-4 text-center' style={{ maxWidth: 800 }}>
							See our most recent seller reports below, click “see more “to view all seller reports and filter by
							produce category.
						</p>
					</div> */}
						{reports.length === 0 ? (
							<div className='d-flex justify-content-center'>
								<NoContentCard keyWord='reports' className='mt-4-5' />
							</div>
						) : null}
						<Row>
							{reports.length < 3 ? (
								<>
									{reports.map((report) => (
										<Col md='6' key={report._id} className='category-m'>
											<MasterReport cardHeight={cardHeight} report={report} imgMaxWidth={imgMaxWidth} size={size} />
										</Col>
									))}
								</>
							) : (
								<Col>
									<Slider {...Slider2} className='slide-2 category-m slick-15'>
										{reports.map((report) => {
											return (
												<MasterReport
													cardHeight={cardHeight}
													key={report._id}
													report={report}
													imgMaxWidth={imgMaxWidth}
													size={size}
												/>
											)
										})}
									</Slider>
								</Col>
							)}
						</Row>
						{reports.length > 0 ? (
							<div className='text-right mt-3 mr-2'>
								<a href='#' onClick={onAllClicked} className='btn btn-solid btn-default-plan'>
									See all reports
								</a>
							</div>
						) : null}
					</Container>
				</section>
			</div>
		</Fragment>
	)
}

export default ReportSpace
