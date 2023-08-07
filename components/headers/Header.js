import React, { useEffect, useContext, useMemo } from 'react'
import NavBar from './common/navbar'
import TopBar from './common/topbar'
import TopMenu from './seller/topmenu'
import { Media, Container, Row, Col } from 'reactstrap'
import LogoImage from './common/logo'
import { AuthContext } from '../../helpers/auth/AuthContext'
import { useMediaQuery } from 'react-responsive'
import vars from '../../helpers/utils/vars'

const Header = ({ logoName, headerClass, role }) => {
	useEffect(() => {
		setTimeout(function () {
			document.querySelectorAll('.loader-wrapper').style = 'display:none'
		}, 2000)
	}, [])

	const authContext = useContext(AuthContext)
	const isAuthenticated = authContext.isAuthenticated
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const user = authContext.user

	const path = window.location.pathname

	useEffect(() => {
		if (!user || !isAuthenticated || window.location.search === '?auth=logout') {
			return;
		}

		const isPageNotSetup = !(
			user?.companybannerISfile ||
			user?.companybannerISfile ||
			user?.companylogoISfile ||
			user?.companysummaryISsmallplaintextbox
		);

		const isPath = (path !== `/${user?.role}/page`);

		if (isPageNotSetup && isPath) {
			onAuthModalsTriggered('pageNotSetup')
		}
	}, [user, path, isAuthenticated])

	return (
		<div
			className='page-main-header'
			style={isAuthenticated ? { height: isTabletOrMobile ? '' : vars.authHeaderSize } : {}}
		>
			<header id='sticky' className={`${headerClass}`}>
				{/* <div className='mobile-fix-option'></div> */}
				<div className='mx-4 mt-3'>
					{role === 'free' ? null : <TopMenu topClass='top-header' role={role} logoName={logoName} />}
				</div>
				{(!isAuthenticated || isTabletOrMobile) && (
					<Container>
						<Row>
							<Col xs={12} md={12}>
								<div className='main-menu border-section border-top-0 border-bottom-0'>
									<div className='menu-left'>
										<div className='navbar'>
											<LogoImage logo={logoName} />
										</div>
									</div>
									<div className='main-nav-center'>
										<NavBar />
									</div>
									<div className='menu-right pull-right'>
										<div>
											<div className='icon-nav'>
												<ul className='nav-menus open'>
													{!isTabletOrMobile && <TopBar />}
												</ul>
											</div>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				)}
			</header>
		</div>
	)
}

export default Header
