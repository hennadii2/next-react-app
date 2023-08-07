import React, { useEffect, useState } from 'react'
import { Row, Col, Spinner, Alert } from 'reactstrap'
import { LinkPreview } from '@dhaiwat10/react-link-preview'
import { BsTelephone, BsGlobe } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { GoLocation } from 'react-icons/go'
import { FiPhone, FiMail, FiGlobe } from 'react-icons/fi'
import { MdOutlineLocationOn } from 'react-icons/md'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { BoxCard, isEmpty, addHttpsURL } from '../../../../../helpers/utils/helpers'
import { getScreenshot } from '../../../../../helpers/lib'

const emptyMsg = `This information has not been added yet`

const FavouriteSellerDescription = ({ seller, usersProduce }) => {
	const isBlueUser = seller.membershipISbb_agrix_membership_typesID_data && seller.membershipISbb_agrix_membership_typesID_data.name && seller.membershipISbb_agrix_membership_typesID_data.name === 'Blue'	
	const produces = []
	for (let prod of usersProduce) {
		const produce = produces.find(
			(p) => p.produce_sub_categoryISbb_agrix_produce_typesID === prod.produce_sub_categoryISbb_agrix_produce_typesID
		)
		if (!produce) produces.push(prod)
	}

	const [thumbnailUrl, setThumbnailUrl] = useState('')
	const [thumbnailImageUrl, setThumbnailImageUrl] = useState(null)
	const [isImageLoading, setIsImageLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		const getThumbnailImageUrl = async (url) => {
			setIsImageLoading(true)
			const res = await getScreenshot(url)
			setThumbnailImageUrl(res)
			setIsImageLoading(false)
		}
		const getThumbnailUrl = () => {
			let httpsurl = seller.website_url
			if (!seller.website_url.includes('https')) {
				httpsurl = 'https://' + httpsurl
			}
			setThumbnailUrl(httpsurl)
			getThumbnailImageUrl(httpsurl)
		}

		if (seller.website_url) getThumbnailUrl()
		else setError('Seller has no website.')
	}, [])

	const onWebsiteLinkClicked = () => {
		if (seller.website_url) {
			let httpsurl = seller.website_url
			if (!seller.website_url.includes('https')) {
				httpsurl = 'https://' + httpsurl
			}
			window.open(httpsurl, '_blank')
		}
	}

	const sellerName = seller.first_name + ' ' + seller.last_name

	return (
		<BoxCard className='my-5'>
			<div className='px-5 py-4'>
				{!isEmpty(produces) && (
					<div className='pt-3 pl-0 seller-produces'>
						{produces.map((prod) => (
							<span
								key={prod.numeric_id}
								className='mr-2'
								style={{ padding: '10px 15px', borderRadius: 35, backgroundColor: '#c6edd0' }}
							>
								{prod.produce_sub_categoryISbb_agrix_produce_typesID_data
									? prod.produce_sub_categoryISbb_agrix_produce_typesID_data.name
									: ''}
							</span>
						))}
					</div>
				)}
				<Row className='pt-3'>
					<Col md='8'>
						<h4 className='mb-3 mt-4' style={{ fontWeight: 'bold', fontSize: 20 }}>
							{seller.company || sellerName}
						</h4>
						<h6 style={{ fontSize: 17, lineHeight: 1.4 }}>{seller.companydescriptionISsmallplaintextbox ?? ''}</h6>						
					</Col>
					<Col md='4'></Col>
				</Row>
				<Row className='pt-3'>
					<Col md='6'>
						<h4 className='mb-3' style={{ fontWeight: 'bold', fontSize: 20 }}>
							Company Information
						</h4>
					</Col>
					<Col md='6'>						
					</Col>
				</Row>
				<Row className='pt-3'>
					<Col md='6'>
						<div className='my-4'>
							<Row className=''>
								<Col md='6'>
									<h6 className='mb-3'>
										<span className='d-flex align-items-center mb-1'>
											<IoPersonCircleOutline size={18} />
											&nbsp;Seller Name
										</span>
										<span style={{ fontSize: 20 }}>{sellerName || emptyMsg}</span>
									</h6>

									<h6 className='mb-3'>
										<span className='d-flex align-items-center mb-1'>
											<FiPhone />
											&nbsp;Tel
										</span>
										{seller.telephone ? (
											<a href={`tel:${seller.telephone}`} target="_blank"><span style={{ fontSize: 17 }}>{seller.telephone}</span></a>
										) : (
											<span style={{ fontSize: 17 }}>{emptyMsg}</span>
										)}
									</h6>

									<h6 className='mb-3'>
										<span className='d-flex align-items-center mb-1'>
											<FiMail />
											&nbsp;Email
										</span>
										{seller.company_email ? (
											<a href={`mailto:${seller.company_email}`} target="_blank"><span style={{ fontSize: 17 }}>{seller.company_email}</span></a>
										) : (
											<span style={{ fontSize: 17 }}>{emptyMsg}</span>
										)}
									</h6>
								</Col>
								<Col md='6'>
									<h6 className='mb-3'>
										<span className='d-flex align-items-center mb-1'>
											<FiGlobe />
											&nbsp;Website
										</span>
										<span className='ml-1' style={{ fontSize: 17 }}>
											{seller.website_url ? (
												<a href={`${addHttpsURL(seller.website_url)}`} target="_blank"><span style={{ fontSize: 17 }}>{seller.website_url}</span></a>
											) : (
												<span style={{ fontSize: 17 }}>{emptyMsg}</span>
											)}
										</span>
									</h6>

									<h6 className='mb-3'>
										<span className='d-flex align-items-center mb-1'>
											<MdOutlineLocationOn />
											&nbsp;Address
										</span>
										<span className='ml-0' style={{ fontSize: 17 }}>
											{seller.address_line_1 ?? ''}
										</span>
										<span className='ml-0' style={{ fontSize: 17 }}>
											{seller.address_line_2 ? `, ${seller.address_line_2}` : ''}
										</span>
										<span className='ml-0' style={{ fontSize: 17 }}>
											{seller.area_code ? `, ${seller.area_code}` : ''}
										</span>
										<span className='ml-0' style={{ fontSize: 17 }}>
											{seller.cityISbb_agrix_countriesID_data?.name ? `, ${seller.cityISbb_agrix_countriesID_data?.name}` : ''}
										</span>
										<span className='ml-0' style={{ fontSize: 17 }}>
											{seller.regionISbb_agrix_countriesID_data?.name ? `, ${seller.regionISbb_agrix_countriesID_data?.name}` : ''}
										</span>
										<span className='ml-0' style={{ fontSize: 17 }}>
											{seller.countryISbb_agrix_countriesID_data?.name ? `, ${seller.countryISbb_agrix_countriesID_data?.name}` : ''}
										</span>
									</h6>
								</Col>
							</Row>
						</div>
					</Col>
					<Col md='6' className='my-4'>
						<BoxCard>
							{(isImageLoading) ? (
								<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 30 }}>
									<span>Generating preview of the seller's website...  </span>
									<Spinner color='#9a9a9a' size={''}>
										Loading...
									</Spinner>
								</div>
							) : (
									(thumbnailImageUrl) ? (
										<a href='#' onClick={onWebsiteLinkClicked} style={{ display: 'block', cursor: 'pointer' }}>
											<img
												src={thumbnailImageUrl}
												className="img-fluid mb-4 mx-auto"
												alt={'Image'}
											/>
										</a>
									) : (
										<>
											{isBlueUser ? (
												<Alert color=''>
													<div>This user is not able to upload a website address on their current plan.</div>
												</Alert>
											) : (
												<Alert color='danger'>
													<h5 className='alert-heading'>No Thumbnail</h5>
													<div>Can't generate thumbnail of seller's website. Please check if the validate website info has been added.</div>
												</Alert>
											)}
										</>
									)
								)
							}
						</BoxCard>
					</Col>
				</Row>
			</div>
		</BoxCard>
	)
}

export default FavouriteSellerDescription
