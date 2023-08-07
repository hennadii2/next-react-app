import React, { useState, useEffect, useContext } from 'react'
import getConfig from 'next/config'
import {
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Container,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	Button,
} from 'reactstrap'
import {
	WhatsappShareButton,
	LinkedinShareButton,
	FacebookShareButton,
	TwitterShareButton,
	ViberShareButton,
	WhatsappIcon,
	FacebookIcon,
	LinkedinIcon,
	TwitterIcon,
	ViberIcon,
} from 'react-share'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { Row as ARow, Col as ACol } from 'antd-grid-layout'
import { BsBoxSeam, BsBuilding } from 'react-icons/bs'
import { MdLocationOn } from 'react-icons/md'
import PlaceholderImage from '../../public/assets/images/placeholder.webp'
import { GrLocation } from 'react-icons/gr'
import { BiCubeAlt } from 'react-icons/bi'
import Link from 'next/link'
import { getValidUrl } from '../../helpers/utils/helpers';

const emptyMsg = 'Information Unavailable'
const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

export const boxStyles = {
	borderRadius: 3,
	boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
}

const ReportDetailSeller = ({ isShow, onToggle, report }) => {
	const [isShareButtons, setShareButtons] = useState(false)
	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	useEffect(() => {
		const elements = document.getElementsByClassName('share-dropdown')
		for (let element of elements) {
			element.classList.remove('btn-secondary')
		}
	}, [])

	const onOpenPdfClicked = () => {
		const link = contentsUrl + report.upload_pdf01ISfile
		window.open(link)
	}

	// console.log(report)
	const title = report.title
	const shareUrl = window.location.origin + `/reports`

	return (
		<Modal centered isOpen={isShow} toggle={onToggle} className='modal-xl'>
			<ModalHeader toggle={onToggle}>{report.name}</ModalHeader>
			<ModalBody className='p-4'>
				<div style={{ ...boxStyles }} className='px-4 py-3'>
					<ARow gutter={[20, 20]}>
						<ACol span={24} md={10}>
							<div style={{ position: 'relative' }}>
								<img
									src={report.report_image01ISfile ? `${contentsUrl}${report.report_image01ISfile}` : PlaceholderImage}
									className='img-fluid-ads'
									style={{
										objectFit: 'cover',
										width: '100%',
										maxHeight: '450px',
										borderRadius: 5,
									}}
									alt={'Report'}
								/>
							</div>
						</ACol>
						<ACol span={24} md={14}>
							<div>
								<h5 style={{ fontWeight: 'bold', fontSize: 17 }}>Report Summary</h5>
								<div style={{ textAlign: 'justify', maxHeight: 180, overflow: 'auto' }}>
									<p className='p-0 m-0' style={{ fontSize: 16, lineHeight: 1.3 }}>
										{report.summaryISsmallplaintextbox}
									</p>
								</div>
								<div className='mt-3'>
									<div className='mb-2 d-flex align-items-center'>
										<div style={{ width: 25, height: 25 }} className='mr-2'>
											<BsBuilding size={25} />
										</div>
										<div>
											<p style={{ lineHeight: 1.4 }} className='m-0 p-0'>
												<Link href={getValidUrl(`/seller/detail/${report.userISbb_agrix_usersID}/${report.company}`)}>{report.company}</Link>
											</p>
										</div>
									</div>
									<div className='mb-2 d-flex align-items-center'>
										<div style={{ width: 25, height: 25 }} className='mr-2'>
											<GrLocation size={25} />
										</div>
										<div>
											<p style={{ lineHeight: 1.4 }} className='m-0 p-0'>
												{report.__location || emptyMsg}
											</p>
										</div>
									</div>
									<div className='mb-2 d-flex align-items-center'>
										<div style={{ width: 25, height: 25 }} className='mr-2'>
											<BiCubeAlt size={25} />
										</div>
										<div>
											<p style={{ lineHeight: 1.4 }} className='m-0 p-0'>
												{report.produce_categoryISbb_agrix_produce_typesID_data?.name || emptyMsg}
											</p>
										</div>
									</div>
								</div>
							</div>
						</ACol>
					</ARow>
				</div>

				<div style={{ ...boxStyles }} className='mt-4 px-4 py-3'>
					<h5 style={{ fontWeight: 'bold', fontSize: 17 }}>Report</h5>
					<div className='mb-3' style={{ textAlign: 'justify', maxHeight: 200, overflow: 'auto' }}>
						<p className='p-0 m-0' style={{ fontSize: 17, lineHeight: 1.4 }}>
							{report.report_textISsmallplaintextbox ?? ''}
						</p>
					</div>
					<div className='mb-3 d-flex'>
						{report.upload_pdf01ISfile && (
							<button className='btn btn-solid btn-default-plan btn-post btn-sm mr-2' onClick={onOpenPdfClicked}>
								{/* <i className='fa fa-paperclip' aria-hidden='true'></i> */}
								Open Additional Documentation
							</button>
						)}

						<Button className='mr-2' onClick={() => window.open(`/report/pdf/${report._id}`)}>
							Download this report
						</Button>

						<Dropdown
							direction='right'
							isOpen={isShareButtons}
							toggle={() => {
								setShareButtons(!isShareButtons)
							}}
						>
							<DropdownToggle className='btn btn-solid btn-default-plan btn-post btn-sm mr-2 share-dropdown'>
								{/* <i className='fa fa-share-square-o' aria-hidden='true'></i> */}
								Share
							</DropdownToggle>
							<DropdownMenu className='media-sharing'>
								<div className='pt-2'>
									<FacebookShareButton url={shareUrl} quote={title} className='ml-2'>
										<FacebookIcon size={26} round />
									</FacebookShareButton>
									<WhatsappShareButton url={shareUrl} quote={title} className='ml-1'>
										<WhatsappIcon size={26} round />
									</WhatsappShareButton>
									<LinkedinShareButton url={shareUrl} quote={title} className='ml-1'>
										<LinkedinIcon size={26} round />
									</LinkedinShareButton>
									<TwitterShareButton url={shareUrl} quote={title} className='ml-1'>
										<TwitterIcon size={26} round />
									</TwitterShareButton>
									<ViberShareButton url={shareUrl} quote={title} className='ml-1'>
										<ViberIcon size={26} round />
									</ViberShareButton>
								</div>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default ReportDetailSeller
