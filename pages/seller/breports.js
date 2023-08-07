import React, { useState, useContext } from 'react'
import { withIronSession } from 'next-iron-session'
import CommonLayout from '../../components/layout/common-layout'
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import SellerReportFollowing from '../layouts/Agri/components/seller/SellerReportFollowing'
import SellerReportFilter from '../layouts/Agri/components/seller/SellerReportFilter'
import SellerReportList from '../layouts/Agri/components/seller/SellerReportList'
import Breadcrumb from '../../components/common/breadcrumb'
import BuyerReportDetail from '../../components/modals/BuyerReportSeller'
import { listUsersFavourites, getBuyers } from '../../helpers/lib'
import UserPermission from '../../components/modals/UserPermission'
import { AuthContext } from '../../helpers/auth/AuthContext'
import vars from '../../helpers/utils/vars'

const BuyerReport = ({ buyersFollowingSeller, buyers }) => {
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const membershipId = user.membershipISbb_agrix_membership_typesID

	const [filterObj, setFilterObj] = useState({})
	const [checked, setChecked] = useState(true)

	const [showModal, setShowModal] = useState(false)
	const [selectedBuyer, setSelectedBuyer] = useState({})

	const onBuyerSelected = (buyer) => {
		setSelectedBuyer(buyer)
		setShowModal(true)
	}

	const onUserLimited = () => {
		setShowModal(false)
		onAuthModalsTriggered('Permission')
	}

	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='Manage Buyers' parent='Dashboard' />
			<Container fluid={true}>
				<Card>
					<CardHeader>
						<div>{vars.sellerReportTitle}</div>
					</CardHeader>
					<CardBody style={{ position: 'relative' }}>
						<SellerReportFollowing
							followings={buyersFollowingSeller}
							buyers={buyers}
							onBuyerSelected={onBuyerSelected}
							membershipId={membershipId}
						/>
						<SellerReportFilter
							onFilter={(value) => setFilterObj(value)}
							onCheck={(val) => {
								setChecked(val)
							}}
							membershipId={membershipId}
							onLimited={onUserLimited}
						/>
						<SellerReportList
							filter={filterObj}
							checked={checked}
							followings={buyersFollowingSeller}
							buyers={buyers}
							onBuyerSelected={onBuyerSelected}
							membershipId={membershipId}
						/>
					</CardBody>
				</Card>
				<BuyerReportDetail
					isShow={showModal}
					onToggle={(showModal) => setShowModal(!showModal)}
					buyer={selectedBuyer}
					onLimited={onUserLimited}
				/>
			</Container>
		</CommonLayout>
	)
}

export default BuyerReport

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

		const buyersFollowingSeller = await listUsersFavourites(null, user.user._id)
		const buyers = await getBuyers()

		return {
			props: {
				buyersFollowingSeller,
				buyers,
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
