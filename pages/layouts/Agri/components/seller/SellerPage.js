import React, { useState, Fragment } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Media, Row, Table } from 'reactstrap'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Save, Lock, Award, MessageCircle, Printer } from 'react-feather'
import banner from '../../../../../public/assets/images/home-banner/11.jpg'
import logo from '../../../../../public/assets/images/logos/8.png'
import logo1 from '../../../../../public/assets/images/ad-space/1159722007.jpg'

const Data = {
	img: '11.jpg',
	company: 'Seller Company Name',
	name: 'First Name and Last Name',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit,orem ipsum dolor sit amet, consectetur adipiscing elit',
}

const bannerBackground = {
	backgroundImage: 'url("/assets/images/home-banner/' + Data.img + '")',
}

const ProduceData = [
	{
		img: '/assets/images/ad-space/519183322.jpg',
		title: 'Pears',
		validity: 'Date to date',
		location: 'Location',
		type: 'Golden Delicious',
		size: 'Medium, Large',
		packaging: '12x1kg Econo, 11kg Jumble',
		farming: 'Common',
		season: 'Feburary, March, April',
		price: '$10',
		status: 'Unfollow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/531476778.jpg',
		title: 'Apples',
		validity: 'Date to date',
		location: 'Location',
		type: 'Golden Delicious',
		size: 'Medium, Large',
		packaging: '12x1kg Econo, 11kg Jumble',
		farming: 'Common',
		season: 'Feburary, March, April',
		price: '$10',
		status: 'Follow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/1251268379.jpg',
		title: 'Peas',
		validity: 'Date to date',
		location: 'Location',
		type: 'Golden Delicious',
		size: 'Medium, Large',
		packaging: '12x1kg Econo, 11kg Jumble',
		farming: 'Common',
		season: 'Feburary, March, April',
		price: '$10',
		status: 'Unfollow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/1284690585.jpg',
		title: 'Gartic',
		validity: 'Date to date',
		location: 'Location',
		type: 'Golden Delicious',
		size: 'Medium, Large',
		packaging: '12x1kg Econo, 11kg Jumble',
		farming: 'Common',
		season: 'Feburary, March, April',
		price: '$10',
		status: 'Follow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/1284690585.jpg',
		title: 'Avocado',
		validity: 'Date to date',
		location: 'Location',
		type: 'Golden Delicious',
		size: 'Medium, Large',
		packaging: '12x1kg Econo, 11kg Jumble',
		farming: 'Common',
		season: 'Feburary, March, April',
		price: '$10',
		status: 'Follow',
		link: '/',
	},
	{
		img: '/assets/images/ad-space/1284690585.jpg',
		title: 'Apple',
		validity: 'Date to date',
		location: 'Location',
		type: 'Golden Delicious',
		size: 'Medium, Large',
		packaging: '12x1kg Econo, 11kg Jumble',
		farming: 'Common',
		season: 'Feburary, March, April',
		price: '$10',
		status: 'Unfollow',
		link: '/',
	},
]

const statePie = {
	labels: ['New Harvest', 'Storage', 'Unavailable'],
	datasets: [
		{
			label: 'Rainfall',
			backgroundColor: ['#B21F00', '#C9DE00', '#2FDE00'],
			hoverBackgroundColor: ['#501800', '#4B5000', '#175000'],
			data: [65, 59, 80],
		},
	],
}

const stateLine = {
	scales: {
		xAxes: [
			{
				gridLines: {
					display: true,
				},
			},
		],
		yAxes: [
			{
				// stacked: true,
				gridLines: {
					display: true,
				},
				ticks: {
					beginAtZero: true,
					// Return an empty string to draw the tick line but hide the tick label
					// Return `null` or `undefined` to hide the tick line entirely
					userCallback(value) {
						// Convert the number to a string and splite the string every 3 charaters from the end
						value = value.toString()
						value = value.split(/(?=(?:...)*$)/)

						// Convert the array to a string and format the output
						value = value.join('.')
						return `Rp.${value}`
					},
				},
			},
		],
	},
	legend: {
		display: true,
	},
	tooltips: {
		enabled: false,
	},
}

const dataLine = {
	labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
	datasets: [
		{
			label: 'First',
			fill: false,
			borderColor: '#dc3545',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
			data: [33, 53, 85, 41, 44, 65],
		},
		{
			label: 'Second',
			fill: false,
			borderColor: 'rgba(75,192,192,1)',
			backgroundColor: 'rgba(53, 162, 235, 0.5)',
			data: [33, 25, 35, 51, 54, 76],
		},
	],
}

const LineChartOptions = {
	hAxis: {
		title: 'Time',
	},
	vAxis: {
		title: 'Popularity',
	},
	series: {
		1: { curveType: 'function' },
	},
}

const MasterCollection = ({
	img,
	title,
	validity,
	location,
	price,
	type,
	size,
	packaging,
	farming,
	season,
	link,
	followStatus,
}) => {
	return (
		<div className='col-md-4 mb-3'>
			<div className={`collection-banner`}>
				<div className='img-part'>
					<a href='#'>
						<Media src={img} className='img-fluid blur-up lazyload bg-img' alt='banner' />
					</a>
				</div>
			</div>
			<div className='ourseller-info produce-info'>
				<div>
					<h5>{title}</h5>
				</div>
				<div>
					<Row>
						<Col md='12'>
							<div className='pull-left'>
								<h5>
									Price: {price} &nbsp; <Lock color='#000000' />
								</h5>
								<h5>Validity: {location}</h5>
								<h5>{location}</h5>
							</div>
							<div className='pull-right'>
								<a href='#' className='linkCursor text-center'>
									<div>
										<i className={followStatus == 'Follow' ? 'fa fa-star follow' : 'fa fa-star unfollow'}></i>
									</div>
									<div>{followStatus}</div>
								</a>
							</div>
						</Col>
					</Row>
				</div>
				<div>
					<h6>Type: {type}</h6>
					<h6>Size: {size}</h6>
					<h6>Packaging: {packaging}</h6>
					<h6>Farming Method: {farming}</h6>
					<h6>Current Season: {season}</h6>
				</div>
				<div className='produce-info'>
					<ul>
						<li>
							<a href='#' className='linkCursor'>
								<i className='fa fa-bar-chart'></i>
							</a>
						</li>
						<li>
							<a href='#' className='linkCursor'>
								<i className='fa fa-list-alt'></i>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

const SellerPage = ({ sectionClass, caption }) => {
	return (
		<Fragment>
			<section className={`category-banner-panel`} style={bannerBackground}>
				<div className='pull-left'>
					<div className='seller-page-logo'>
						<Media src={logo} className='img-fluid blur-up lazyload bg-img' alt='logo' />
					</div>
					<div className='seller-page-info'>
						<h3>{Data.company}</h3>
						<p>{Data.name}</p>
						<p
							dangerouslySetInnerHTML={{
								__html: Data.description,
							}}
						></p>
					</div>
				</div>
				<div className='pull-right'>
					<div className='seller-page-award'>
						<Award color='#fd7e14' />
					</div>
				</div>
			</section>
			<section>
				<Row className='mb-2'>
					<Col md='6'>
						<Row className='mb-3'>
							<Col md='12'>
								<div className='seller-info pull-left'>
									<h5>Seller Name</h5>
								</div>
								<div className='pull-right'>
									<Award color='#fd7e14' /> Gold Seller Since 1999
								</div>
							</Col>
						</Row>
						<Row>
							<Col md='12'>
								<div className='seller-info'>
									<h6
										dangerouslySetInnerHTML={{
											__html: Data.description,
										}}
									></h6>
									<h6
										dangerouslySetInnerHTML={{
											__html: Data.description,
										}}
									></h6>
									<h6>Tel:+27 856 64596686</h6>
									<h6>
										Email:annie@apples.com
										<Award color='#fd7e14' />
									</h6>
									<h6>Website:www.anniesapples.com</h6>
									<h6>Address: 1 Annie Rd, Bossonova, KZN, South Affrica, 3610</h6>
									<h6></h6>
									<h6></h6>
								</div>
							</Col>
						</Row>
					</Col>
					<Col md='6'>
						<img src={logo1} alt='logo' className='img-fluid image_zoom_1 blur-up lazyloaded' />
					</Col>
				</Row>
			</section>
			<section className={`category-banner-panel1`}>
				<div className='ratio_45 section-b-space'>
					<Container>
						<Row className='partition4 mb-2'>
							<Col md='12'>
								<h5>Produce</h5>
							</Col>
						</Row>
						<Row>
							{ProduceData.map((data, index) => {
								return (
									<MasterCollection
										key={index}
										title={data.title}
										validity={data.validity}
										img={data.img}
										link={data.link}
										company={data.company}
										price={data.price}
										type={data.type}
										size={data.size}
										farming={data.farming}
										season={data.season}
										packaging={data.packaging}
										location={data.location}
										followStatus={data.status}
									/>
								)
							})}
						</Row>
					</Container>
				</div>
			</section>
			<section>
				<div>
					<Line data={dataLine} />
				</div>
				<div>
					<Pie
						data={statePie}
						options={{
							title: {
								display: true,
								text: 'Seller List',
								fontSize: 20,
							},
							legend: {
								display: true,
								position: 'right',
							},
						}}
					/>
				</div>
			</section>
		</Fragment>
	)
}

export default SellerPage
