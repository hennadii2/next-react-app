import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { withApollo } from '../helpers/apollo/apollo'
import CommonLayout from '../components/layout/common-layout'

const AccessDeniedPage = ({ auth, user }) => {
	useEffect(() => {
		document.documentElement.style.setProperty('--theme-deafult', '#20963d')
	})

	return (
		<CommonLayout title='collection' parent='home' sidebar={true} auth={auth} user={user}>
			<section className='p-0'>
				<Container>
					<Row>
						<Col sm='12'>
							<div className='access-denied-section'>
								<h1>Access denied.</h1>
								<h2> We're sorry, please contact an administrator.</h2>
								<a href='/' className='btn btn-solid'>
									back to home
								</a>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</CommonLayout>
	)
}

export default withApollo(AccessDeniedPage)
