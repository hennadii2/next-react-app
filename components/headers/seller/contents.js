import React, { useContext } from 'react'
import { ShoppingBag, Download, AlertCircle } from 'react-feather'
import { Media, Col } from 'reactstrap'
import { AuthContext } from '../../../helpers/auth/AuthContext'
import vars from '../../../helpers/utils/vars'
import { useMediaQuery } from 'react-responsive'

const Contents = () => {
	const authContext = useContext(AuthContext)
	const isAuthenticated = authContext.isAuthenticated
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	return (
		<div>
			<div className='page-wrapper'>
				<Header />
				<div className='page-body-wrapper'>
					<Sidebar />
					<RightSidebar />
					<div
						className='page-body'
						style={
							isAuthenticated && !isTabletOrMobile
								? {
										minHeight: `calc(100vh - ${vars.authHeaderSize})`,
										marginTop: vars.authHeaderSize,
								  }
								: {}
						}
					>
						{props.children}
					</div>
					<Footer />
				</div>
			</div>
			<div className='btn-light custom-theme' onClick={() => ChangeRtl(side.divName)}>
				{side.divName}
			</div>
		</div>
	)
}

export default Contents
