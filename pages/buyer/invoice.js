import React from 'react'
import CommonLayout from '../../components/layout/common-layout'
import { withApollo } from '../../helpers/apollo/apollo'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import Invoice from '../layouts/Agri/components/seller/SellerInvoice'
import Breadcrumb from '../../components/common/breadcrumb'
import vars from '../../helpers/utils/vars'

const MyInvoice = ({ auth, user }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={true} auth={auth} user={user}>
			<Breadcrumb title='My Payments' description='Buyer Panel' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					<Col sm='12'>
						<Card>
							<CardHeader>{vars.paymentTitle}</CardHeader>
							<CardBody>
								<Invoice />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</CommonLayout>
	)
}

export default withApollo(MyInvoice)
