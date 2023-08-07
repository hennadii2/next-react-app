import React, { useEffect, useState } from 'react'
import { withIronSession } from 'next-iron-session'
import getConfig from 'next/config'
import CommonLayout from '../../components/layout/common-layout'
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import FavouriteFilter from '../layouts/Agri/components/buyer/FavouriteProduceFilter'
import FavouriteList from '../layouts/Agri/components/buyer/FavouriteProduceList'
import Breadcrumb from '../../components/common/breadcrumb'
import { listUsersFavourites, getSellers, listUsersProduce, lisUsersProducePricing } from '../../helpers/lib'

const FavouriteProduce = ({ favouritesForBuyer, sellers, usersProduces, pricinglogs }) => {
	const [filterObj, setFilterObj] = useState({})
	const favourites = favouritesForBuyer.filter((favourite) => favourite.fav_produceISbb_agrix_users_produceID !== null)

	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='Favourite Produce' description='Buyer Panel' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					<Col sm='12'>
						<Card>
							<CardHeader>Find your favourite produce here.</CardHeader>
							<CardBody className='mx-3'>
								<FavouriteFilter onFilter={(value) => setFilterObj(value)} />
								<FavouriteList
									favourites={favourites}
									filter={filterObj}
									sellers={sellers}
									usersProduces={usersProduces}
									pricinglogs={pricinglogs}
								/>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</CommonLayout>
	)
}

export default FavouriteProduce

export const getServerSideProps = withIronSession(
	async ({ req, res }) => {
		const user = req.session.get('user')

		if (!user) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}

		const favouritesForBuyer = await listUsersFavourites(user.user._id)
		const sellers = await getSellers()
		const usersProduces = await listUsersProduce('1')
		const pricinglogs = await lisUsersProducePricing()

		return {
			props: {
				favouritesForBuyer,
				sellers,
				usersProduces,
				pricinglogs,
			},
		}
	},
	{
		cookieName: process.env.COOKIE_NAME,
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production' ? true : false,
		},
		password: process.env.APPLICATION_SECRET,
	}
)
