import React, { Fragment } from 'react'
import { Container, Col, Row, Media } from 'reactstrap'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import NoData from '../NoData/NoData'
import PlaceholderImage from '../../../../../public/assets/images/placeholder.webp'
import { MasterCollection } from '../OurSellersSpace'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const DashboardSeller = ({ sellersForBuyer }) => {
	const router = useRouter()
	const sellersFavourite = sellersForBuyer.filter((seller, index) => index < 6)

	const onCreate = () => {
		router.push('/buyer/favourite-seller')
	}

	const onFavouriteSellersClicked = () => {
		router.push('/buyer/favourite-seller')
	}

	return (
		<Container className='mt-5'>
			<h4 className='f-w-600 mb-4 dashboard-title'>My Latest Favorite Sellers</h4>
			{sellersForBuyer.length === 0 ? (
				<NoData
					description='Looks like you have no favorite sellers yet! Click below to discover some.'
					createLabel='Explore Sellers'
					onCreate={onCreate}
				/>
			) : (
				<Fragment>
					<Row className='partition4'>
						{sellersFavourite.map((seller, i) => {
							// console.log(seller)
							return <MasterCollection key={i} seller={seller} />
						})}
					</Row>
					<div className='d-flex justify-content-end'>
						<button
							type='button'
							className='btn btn-solid btn-default-plan py-2 px-2'
							onClick={onFavouriteSellersClicked}
						>
							See All Favourite Sellers
						</button>
					</div>
				</Fragment>
			)}
		</Container>
	)
}

export default DashboardSeller
