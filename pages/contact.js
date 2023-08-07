import React from 'react'
import CommonLayout from '../components/layout/common-layout'
import { Row, Container } from 'reactstrap'
import Banner from './layouts/Agri/components/Banner'
import { Button, Col, Form, FormGroup, Input } from 'reactstrap'
import { getBanner } from '../helpers/lib'

const ContactUs = ({ banner }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<Banner banner={banner} searchBar={false} />
			<section className='section-b-space contact-section mt-3'>
				<Container>
					<h4 className='section-title mb-3 mt-4 text-center'>Contact Us</h4>

					<div className='container mb-5' data-aos='fade-up'>
						<div className='row mt-4-5'>
							{/* <div className='col-lg-4 d-flex'>
								<div className='info form-group'>
									<div className='address'>
										<i className='fa fa-map-marker'></i>
										<h4>Location:</h4>
										<p>Pantiles Chambers, 85 High Street, Tunbridge Wells,Kent,TN1 1XP United Kingdom</p>
									</div>

									<div className='email'>
										<i className='fa fa-envelope'></i>
										<h4>Email:</h4>
										<p>pauldev@BlueBoxOnline.com</p>
									</div>

									<div className='phone'>
										<i className='fa fa-phone'></i>
										<h4>Call:</h4>
										<p>+44 774 3703 574</p>
									</div>
								</div>
							</div> */}

							<div className='col-lg-12 d-flex' style={{ justifyContent: 'center' }}>
								<FormGroup className='email-form' style={{ maxWidth: 600 }}>
									<div className='row'>
										<div className='col-md-6 form-group'>
											<Input type='text' className='form-control' id='name' placeholder='Your Name' required />
										</div>
										<div className='col-md-6 form-group mt-3 mt-md-0'>
											<Input
												type='email'
												className='form-control'
												name='email'
												id='email'
												placeholder='Your Email'
												required
											/>
										</div>
									</div>
									<div className='form-group mt-3'>
										<Input
											type='text'
											className='form-control'
											name='subject'
											id='subject'
											placeholder='Subject'
											required
										/>
									</div>
									<div className='form-group mt-3'>
										<textarea
											className='form-control'
											name='message'
											rows='8'
											placeholder='Message'
											required
										></textarea>
									</div>
									<div className='text-center'>
										<button type='submit' className='btn btn-solid btn-default-plan btn-post'>
											Send Message
										</button>
									</div>
								</FormGroup>
							</div>
						</div>
					</div>
				</Container>
			</section>
		</CommonLayout>
	)
}

export default ContactUs

export async function getStaticProps() {
	const banner = await getBanner()

	return {
		props: {
			banner,
		},
		revalidate: 60,
	}
}
