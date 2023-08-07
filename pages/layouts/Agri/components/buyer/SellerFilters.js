import React, { Fragment, useState } from 'react'
import { Container, Col, Form, FormGroup, Input, Label, Media, Row } from 'reactstrap'
import { Star } from 'react-feather'
import avatar from '../../../../../public/assets/images/user.png'
import SellerDetails from '../modals/SellerDetailModal'

const SellerData = [
	{
		img: '/assets/images/ad-space/519183322.jpg',
		title: 'Gold Buyer Since 1999',
		company: 'Company Name',
		location: 'Location',
		tag: 'Produce tag 1 Tag 2 etc',
		status: 'Follow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/531476778.jpg',
		title: 'Gold Buyer Since 1999',
		company: 'Company Name',
		location: 'Location',
		tag: 'Produce tag 1 Tag 2 etc',
		status: 'Unfollow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/1251268379.jpg',
		title: 'Gold Buyer Since 1999',
		company: 'Company Name',
		location: 'Location',
		tag: 'Produce tag 1 Tag 2 etc',
		status: 'Follow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/1284690585.jpg',
		title: 'Gold Buyer Since 1999',
		company: 'Company Name',
		location: 'Location',
		tag: 'Produce tag 1 Tag 2 etc',
		status: 'Follow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/1284690585.jpg',
		title: 'Gold Buyer Since 1999',
		company: 'Company Name',
		location: 'Location',
		tag: 'Produce tag 1 Tag 2 etc',
		status: 'Unfollow',
		link: '/',
	},
]

const MasterCollection = ({ img, company, location, tag, link, status, clickEvent }) => {
	return (
		<div className='col-md-4 mb-3'>
			<div className={`collection-banner`}>
				<div className='img-part'>
					<a className='linkCursor' href='../seller-details'>
						<Media src={img} className='img-fluid blur-up lazyload bg-img' alt='seller' />
					</a>
				</div>
			</div>
			<div className='ourseller-info produce-info'>
				<div>
					<h5>{company}</h5>
				</div>
				<div className='pull-left'>
					<h6>{location}</h6>
					<h6>{tag}</h6>
				</div>
				<div className='pull-right'>
					<a href='#' className='linkCursor text-center'>
						<div>
							<i className={status == 'Follow' ? 'fa fa-star follow' : 'fa fa-star unfollow'}></i>
						</div>
						<div>{status}</div>
					</a>
				</div>
			</div>
		</div>
	)
}

const SellerFilters = () => {
	const [showDetailsModal, setDetailsModal] = useState(false)
	const detailsForm = () => setDetailsModal(!showDetailsModal)

	return (
		<Fragment>
			<div className='ratio_45 section-b-space'>
				<Container>
					<Row className='partition4 mb-2'>
						<Col md='12'>
							<h5>My Sellers</h5>
						</Col>
					</Row>
					<Row>
						{SellerData.map((data, i) => {
							return (
								<MasterCollection
									key={i}
									img={data.img}
									link={data.link}
									company={data.company}
									tag={data.tag}
									location={data.location}
									status={data.status}
									clickEvent={detailsForm}
								/>
							)
						})}
					</Row>
				</Container>
			</div>
			<SellerDetails modal={showDetailsModal} toggle={detailsForm} />
		</Fragment>
	)
}

export default SellerFilters
