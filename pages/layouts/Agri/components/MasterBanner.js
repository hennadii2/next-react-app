import React from 'react'
import { Col, Container, Row } from 'reactstrap'

const MasterBanner = ({ title, classes, bannerBackground, title1 }) => {
	const [one, two] = title?.split('.')
	return (
		<>
			<div style={{ position: 'relative' }}>
				<div style={bannerBackground} className={`home ${classes ? classes : 'text-center'}`}>
					<Container>
						<Row>
							<Col>
								<div className='slider-contain'>
									<div>
										<h2>{title1 || one}</h2>
										<br />
										<h4 style={{ marginBottom: 150 }}>{two}</h4>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		</>
	)
}

export default MasterBanner
