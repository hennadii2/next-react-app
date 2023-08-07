import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Media, ModalBody, Input, FormGroup, Button } from 'reactstrap'
import getConfig from 'next/config'
import { FaSearch } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const ProduceSellerSearch = ({ isShow, onToggle, sellers, sellerProduces }) => {
	const [produceSellers, setProduceSellers] = useState([])
	const [initSellers, setInitSellers] = useState([])
	const [searchTxt, setSearchTxt] = useState('')

	useEffect(() => {
		let categorySellers = []
		for (let sellerProduce of sellerProduces) {
			const seller = sellers.find((s) => s.numeric_id === sellerProduce.userISbb_agrix_usersID)
			if (categorySellers.length > 0) {
				const categorySeller = categorySellers.find((cs) => cs.numeric_id === seller.numeric_id)
				if (!categorySeller) categorySellers.push(seller)
			}
		}

		setProduceSellers(categorySellers)
		setInitSellers(categorySellers)
	}, [sellers, sellerProduces])

	const handleSearch = (event, fromInput = true) => {
		if (fromInput) {
			if (event.key !== 'Enter') return
		}

		const searchText = searchTxt
		const newSellers = initSellers.filter(
			(seller) =>
				seller.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
				seller.last_name.toLowerCase().includes(searchText.toLowerCase())
		)
		setProduceSellers(newSellers)
	}

	const getColorStyles = (membership) => {
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
		<Modal centered isOpen={isShow} toggle={onToggle} className='modal-xl'>
			<CloseModalBtn
				onClick={onToggle}
				styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
				iconProps={{ color: 'gray' }}
			/>
			<ModalBody className='p-5'>
				<div className='d-flex justify-content-center'>
					<form className='d-flex align-items-center'>
						<Input
							onChange={(e) => setSearchTxt(e.target.value)}
							placeholder='Search Sellers'
							type='search'
							className='form-control'
							onKeyDown={(e) => handleSearch(e, true)}
							style={{ minWidth: 200 }}
						/>
						<Button type='submit' color='success' className='ml-3' onClick={(e) => handleSearch(e, false)}>
							<FaSearch size={20} />
						</Button>
					</form>
				</div>
				<Row className='mt-4' style={{ maxHeight: 400, overflowY: 'auto' }}>
					{produceSellers.map((seller) => {
						const membership = seller?.membershipISbb_agrix_membership_typesID_data?.name
						const imgUrl = seller.companylogoISfile
							? contentsUrl + '' + seller.companylogoISfile
							: '/assets/images/empty.png'

						const countryName = seller.countryISbb_agrix_countriesID_data
							? seller.countryISbb_agrix_countriesID_data.name
							: ''
						const regionName = seller.regionISbb_agrix_countriesID_data
							? seller.regionISbb_agrix_countriesID_data.name
							: ''
						const cityName = seller.cityISbb_agrix_countriesID_data ? seller.cityISbb_agrix_countriesID_data.name : ''

						return (
							<Col md='4' className='mb-4' key={seller.numeric_id}>
								<div
									className={`collection-banner`}
									style={{ position: 'relative', borderRadius: 5, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
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
													...getColorStyles(membership),
												}}
											>
												{membership}
											</div>
										) : null}
										{imgUrl ? (
											<Media
												src={imgUrl}
												className='img-fluid-ads blur-up lazyload bg-img'
												alt='company'
												height='200px'
												width='260'
												style={{ objectFit: 'contain' }}
											/>
										) : (
											<Media
												src='/assets/images/empty.png'
												className='img-fluid-ads blur-up lazyload bg-img'
												alt='company'
												height='200px'
												width='260'
												style={{ objectFit: 'contain' }}
											/>
										)}
									</div>
									<div className='ourseller-info px-3 pb-3'>
										<h5 style={{ fontSize: 20, fontWeight: 'bold' }}>{seller.company}</h5>
										{/* <h6 className='ml-2'>{seller.first_name + ' ' + seller.last_name}</h6> */}
										<div className='mt-1' style={{ display: 'flex', alignItems: 'center' }}>
											<GrLocation />
											<h6 className='ml-1'>{countryName + ' ' + regionName + ' ' + cityName}</h6>
										</div>
									</div>
								</div>
							</Col>
						)
					})}
				</Row>
			</ModalBody>
		</Modal>
	)
}

export default ProduceSellerSearch
