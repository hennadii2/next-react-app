import React from 'react'
import { withIronSession } from 'next-iron-session'
import CommonLayout from '../../components/layout/common-layout'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import MyAccounts from '../layouts/Agri/components/buyer/BuyerAccounts'
import Breadcrumb from '../../components/common/breadcrumb'
import { listCountries, getMembershipTypes } from '../../helpers/lib'

const MyAccount = ({ countries, membershipTypes }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='My Account' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					<Col sm='12'>
						<Card>
							<CardHeader>Description or section summary information</CardHeader>
							<CardBody>
								<MyAccounts membershipTypes={membershipTypes} />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</CommonLayout>
	)
}

export default MyAccount

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

		// const countries = await listCountries()
		const membershipTypes = await getMembershipTypes()

		return {
			props: { membershipTypes },
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
