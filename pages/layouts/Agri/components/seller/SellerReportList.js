import React, { useEffect, useState } from 'react'
import { Container, Col, Media, Row } from 'reactstrap'
import getConfig from 'next/config'
import { GrLocation } from 'react-icons/gr'
import vars from '../../../../../helpers/utils/vars'
import styled from 'styled-components'
import { isEmpty } from '../../../../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const infoUnavailableMsg = `Information Unavailable`

const SellerReportList = ({ checked, followings, filter, buyers, onBuyerSelected }) => {
	const [filteredFollowings, setFilteredFollowings] = useState(buyers)

	useEffect(() => {
		let temp_followings = [...buyers]
		if (filter.country) {
			temp_followings = temp_followings.filter((temp) => temp.countryISbb_agrix_countriesID === filter.country)
		}
		if (filter.region) {
			temp_followings = temp_followings.filter((temp) => temp.regionISbb_agrix_countriesID === filter.region)
		}
		if (filter.city) {
			temp_followings = temp_followings.filter((temp) => temp.cityISbb_agrix_countriesID === filter.city)
		}
		if (filter.buyer) {
			temp_followings = temp_followings.filter((temp) => {
				return (
					temp.first_name?.toLowerCase()?.includes(filter.buyer.toLowerCase()) ||
					temp.last_name?.toLowerCase()?.includes(filter.buyer.toLowerCase())
				)
			})
		}

		if (filter.checked) {
			const _result = followings
				.map((following) => {
					return temp_followings.find((buyer) => buyer.numeric_id === following.userISbb_agrix_usersID)
				})
				.filter((y) => !!y)
			temp_followings = _result
		}
		setFilteredFollowings(temp_followings)
	}, [filter])

	const checkFilterExist = () => {
		return filter.country || filter.region || filter.city || filter.buyer
	}

	return (
		<div className='ratio_45 section-b-space'>
			<Container>
				<div className='partition4 mb-2'>
					<h4 className='f-w-600 mb-4 dashboard-title'>Buyers</h4>
				</div>
				{isEmpty(filteredFollowings) && (
					<h3 className='text-center mb-5'>
						{checked
							? `${
									checkFilterExist()
										? 'There are no results for that search, try something else!'
										: 'No buyers are following you right now!'
							  }`
							: `${
									checkFilterExist()
										? 'There are no results for that search, try something else!'
										: 'Search in the filter above to find buyers on Agrixchange!'
							  }`}
					</h3>
				)}
				<Row>
					{filteredFollowings.map((data, i) => {
						const country_name = data.countryISbb_agrix_countriesID_data
							? data.countryISbb_agrix_countriesID_data.name
							: ''
						const region_name = data.regionISbb_agrix_countriesID_data
							? data.regionISbb_agrix_countriesID_data.name
							: ''
						const city_name = data.cityISbb_agrix_countriesID_data ? data.cityISbb_agrix_countriesID_data.name : ''

						const isFollowing = filter.checked
						const location = country_name + ' ' + region_name + ' ' + city_name

						return (
							<div className='col-md-4 mb-4' key={data.numeric_id}>
								<div
									style={{
										position: 'relative',
										borderRadius: 5,
										boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
									}}
									className='linkCursor'
									onClick={() => onBuyerSelected(data)}
								>
									<div className='collection-banner p-0'>
										{isFollowing ? <TagDiv className='tag-div'>Following you</TagDiv> : null}
										<div className='img-part' style={{}}>
											<Media
												src={
													data.companylogoISfile
														? contentsUrl + data.companylogoISfile
														: '/assets/images/empty.png'
												}
												className='img-fluid-ads'
												alt='seller'
												height='200px'
												width='280px'
												style={{ objectFit: 'contain', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
											/>
										</div>
										<div className='contain-banner ourseller-banner'>
											<h4>{data.first_name + ' ' + data.last_name}</h4>
										</div>
									</div>
									<div className='px-3 py-3'>
										<h5>Company: {data.company || infoUnavailableMsg}</h5>
										<div className='' style={{ display: 'flex', alignItems: 'center' }}>
											<div style={{ width: 15, height: 15 }} className='mr-1'>
												<GrLocation />
											</div>
											<h6 className='m-0'>{location.trim() || infoUnavailableMsg}</h6>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</Row>
			</Container>
		</div>
	)
}

export default SellerReportList

const TagDiv = styled.div`
	padding: 5px 15px;
	border-radius: 25px;
	position: absolute;
	top: 10px;
	left: 10px;
	background-color: #d5e2d5;
	color: ${vars.primaryColor};
`
