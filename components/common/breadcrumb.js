import React from 'react'
import { Home } from 'react-feather'
import { Col, Container, Row } from 'reactstrap'
import Link from 'next/link'
import styled from 'styled-components'

const Breadcrumb = ({ title, description, parent }) => {
	return (
		<Container fluid={true}>
			<Wrapper className='page-header'>
				<Row>
					<Col lg='6'>
						<div className='page-header-left'>
							<h3 style={{ fontFamily: 'Lato, sans-serif' }}>
								{title}
								<small style={{ display: 'none' }}>{description}</small>
							</h3>
						</div>
					</Col>
					<Col lg='6'></Col>
				</Row>
			</Wrapper>
		</Container>
	)
}

export default Breadcrumb

const Wrapper = styled.div`
	padding-top: 45px !important;
	padding-bottom: 25px !important;
	padding-left: 10px !important;
`
