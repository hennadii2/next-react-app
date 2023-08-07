import React from 'react'
import { withIronSession } from 'next-iron-session'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import DashboardPlan from '../layouts/Agri/components/DashboardPlan'
import DashboardProduce from '../layouts/Agri/components/buyer/DashboardProduce'
import DashboardSeller from '../layouts/Agri/components/buyer/DashboardSeller'
import {
	getMembershipTypes,
	listUsersFavourites,
	getSellers,
	lisUsersProducePricing,
	listUsersProduce,
	getAllUsers,
} from '../../helpers/lib'
import CommonLayout from '../../components/layout/common-layout'
import Breadcrumb from '../../components/common/breadcrumb'
import vars from '../../helpers/utils/vars'

const Dashboard = ({ membershipTypes, favourites, sellers, sellersForBuyer = [], pricinglogs, usersProduces }) => {
	const producesForBuyer = favourites.filter((favourite) => favourite.fav_produceISbb_agrix_users_produceID !== null)

	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='Dashboard' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					<Col sm='12'>
						<Card>
							<CardHeader>{vars.dashboardTitle}</CardHeader>
							<CardBody>
								<DashboardPlan membershipTypes={membershipTypes} />
								<DashboardProduce
									producesForBuyer={producesForBuyer}
									usersProduces={usersProduces}
									pricinglogs={pricinglogs}
									sellers={sellers}
								/>
								<DashboardSeller sellersForBuyer={sellersForBuyer} sellers={sellers} />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</CommonLayout>
	)
}

export default Dashboard

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

		const membershipTypes = await getMembershipTypes()
		const favourites = await listUsersFavourites(user.user._id)
		const usersProduces = await listUsersProduce('1')
		const sellers = await getSellers()
		let sellersForBuyer = []
		let fav_seller_ids = favourites
			.filter((favourite) => favourite.fav_userISbb_agrix_usersID !== null)
			.map((x) => x.fav_userISbb_agrix_usersID)
		if (fav_seller_ids.length) {
			sellersForBuyer = await getAllUsers('sellers', 50, fav_seller_ids)
		}
		// console.log(sellersForBuyer)
		const pricinglogs = await lisUsersProducePricing()

		return {
			props: {
				membershipTypes,
				usersProduces,
				favourites,
				sellers,
				pricinglogs,
				sellersForBuyer,
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
