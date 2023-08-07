import React, { useState } from 'react'
import { withIronSession } from 'next-iron-session'
import CommonLayout from '../../components/layout/common-layout'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import { Eye } from 'react-feather'
import FavouriteFilter from '../layouts/Agri/components/buyer/FavouriteSellerFilter'
import FavouriteList from '../layouts/Agri/components/buyer/FavouriteSellerList'
import Breadcrumb from '../../components/common/breadcrumb'
import { listUsersProduce, listUsersFavourites, getSellers } from '../../helpers/lib'

const FavouriteSeller = ({ favouritesForBuyer, sellers, usersProduce }) => {
	const [filterObj, setFilterObj] = useState({})
	const favourites = favouritesForBuyer.filter((favourite) => favourite.fav_userISbb_agrix_usersID !== null)

	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='Favourite Seller' description='Buyer Panel' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					<Col sm='12'>
						<Card>
							<CardHeader>Find your favorite sellers here.</CardHeader>
							<CardBody className='mx-3'>
								<FavouriteFilter onFilter={(value) => setFilterObj(value)} />
								<FavouriteList
									favourites={favourites}
									filter={filterObj}
									sellers={sellers}
									usersProduce={usersProduce}
								/>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</CommonLayout>
	)
}

export default FavouriteSeller

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
		const usersProduce = await listUsersProduce('produce_categoryISbb_agrix_produce_typesID')

		return {
			props: {
				favouritesForBuyer,
				sellers,
				usersProduce,
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
