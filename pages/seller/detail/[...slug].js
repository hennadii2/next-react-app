import React from 'react'
import { withIronSession } from 'next-iron-session'
import { Container } from 'reactstrap'
import CommonLayout from '../../../components/layout/common-layout'
import FavouriteSellerBanner from '../../layouts/Agri/components/buyer/FavouriteSellerBanner'
import FavouriteSellerDescription from '../../layouts/Agri/components/buyer/FavouriteSellerDescription'
import FavouriteSellerProduce from '../../layouts/Agri/components/buyer/FavouriteSellerProduce'
import FavouriteSellerReports from '../../layouts/Agri/components/buyer/FavouriteSellerReports'
import Breadcrumb from '../../../components/common/breadcrumb'
import GraphicalArea from '../../layouts/Agri/components/GraphicalArea'
import { getSellerById, getSellers, listProducesByUserId, listUsersFavourites, lisUsersProducePricing } from '../../../helpers/lib'

const FavouriteSellerDetail = ({ seller, sellers, usersProduce, usersFavourites, pricingLogs }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='' description='Buyer Panel' parent='Dashboard' />
			<Container fluid={true}>
				<FavouriteSellerBanner seller={seller} sellers={sellers} usersFavourites={usersFavourites} usersProduce={usersProduce} />
				<FavouriteSellerDescription seller={seller} usersProduce={usersProduce} />
				<FavouriteSellerProduce
					seller={seller}
					usersProduce={usersProduce}
					usersFavourites={usersFavourites}
					pricingLogs={pricingLogs}
				/>
				<FavouriteSellerReports seller={seller}/>
				<GraphicalArea usersProduce={usersProduce} pricingLogs={pricingLogs} />
			</Container>
		</CommonLayout>
	)
}

export default FavouriteSellerDetail

export const getServerSideProps = withIronSession(
	async ({ params, req, res }) => {
		const slug = params.slug
		const sellerId = slug[0]
		const user = req.session.get('user')

		// if (!user) {
		// 	return {
		// 		redirect: {
		// 			destination: '/',
		// 			permanent: false,
		// 		},
		// 	}
		// }

		const seller = await getSellerById(sellerId)
		const sellers = await getSellers()
		const usersProduce = await listProducesByUserId(sellerId)
		const usersFavourites = user ? await listUsersFavourites(user.user._id) : []
		const pricingLogs = await lisUsersProducePricing()

		return {
			props: {
				seller,
				sellers,
				usersProduce,
				usersFavourites,
				pricingLogs,
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
