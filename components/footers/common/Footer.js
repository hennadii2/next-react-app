import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Form, FormGroup, Input, Button, Collapse } from 'reactstrap'
import LogoImage from '../../headers/common/logo'
import { AuthContext } from '../../../helpers/auth/AuthContext'
import getConfig from 'next/config'
import CookieConsent from "react-cookie-consent"

const { publicRuntimeConfig } = getConfig()
const appVersion = `${publicRuntimeConfig.APP_VERSION}`

const MasterFooter = ({ footerClass }) => {
	const authContext = useContext(AuthContext)
	const [isOpen, setIsOpen] = useState()
	const [collapse, setCollapse] = useState(0)
	const width = window.innerWidth < 750

	useEffect(() => {
		const changeCollapse = () => {
			if (window.innerWidth < 750) {
				setCollapse(0)
				setIsOpen(false)
			} else setIsOpen(true)
		}

		window.addEventListener('resize', changeCollapse)

		return () => {
			window.removeEventListener('resize', changeCollapse)
		}
	}, [])

	return (
		<div>
			<footer>
				<section className={footerClass}>
					<Container fluid=''>
						<div className='main-footer text-center'>
							<div className='footer-contant'>
								<ul>
									{authContext.isAuthenticated && (
										<li>
											<Link href={`/about-us`}>
												<a href='#'>About Us</a>
											</Link>
										</li>
									)}
									<li>
										<Link href={`/privacy`}>
											<a href='#'>Privacy Policy</a>
										</Link>
									</li>
									<li>
										<Link href={`/terms`}>
											<a href='#'>Terms of Use</a>
										</Link>
									</li>
									<li>
										<Link href={`/contact`}>
											<a href='#'>Contact</a>
										</Link>
									</li>
								</ul>
							</div>
							<div className='footer-end'>
								<p>
									<i className='fa fa-copyright' aria-hidden='true'></i> {new Date().getFullYear()} Agrixchange. All
									Rights Reserved <small>(V{appVersion})</small>
								</p>
							</div>
							<div className='footer-social'>
								<ul>
									<li>
										<a href='https://www.facebook.com' target='_blank'>
											<i className='fa fa-facebook-square' aria-hidden='true'></i>
										</a>
									</li>
									<li>
										<a href='https://twitter.com/AgriXchangecom' target='_blank'>
											<i className='fa fa-twitter' aria-hidden='true'></i>
										</a>
									</li>
									<li>
										<a href='https://instagram.com/agrixchange?igshid=MzNlNGNkZWQ4Mg==' target='_blank'>
											<i className='fa fa-linkedin-square' aria-hidden='true'></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
						<CookieConsent
							location="bottom"
							buttonText="Got it!"
							cookieName="agrixCookie"
							style={{ background: "#2B373B" }}
							buttonStyle={{ color: "#fff", backgroundColor: "#475458" }}
							expires={150}
							>
							<div className='d-flex text-white  justify-content-center'>
								<div className="mr-3">This website uses cookies to ensure you get the best experience on our website.</div>
								<div className='h-100'>
									<a href={'/privacy'} target='_blank' className=''>
										<span className='text-white' style={{textDecoration: 'underline'}}>Visit our website</span>
									</a>
								</div>
							</div>
						</CookieConsent>
					</Container>
				</section>
			</footer>
		</div>
	)
}
export default MasterFooter
