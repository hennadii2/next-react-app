import React, { Fragment, useEffect, useState, useContext } from 'react'
import SearchHeader from './searchHeader'
import UserMenu from './usermenu'
import Notification from '../../../pages/layouts/Agri/components/modals/NotificationModal'
import { AlignLeft, Bell, MessageSquare, MoreHorizontal } from 'react-feather'
import LogoImage from '../common/logo'
import NavBar from '../common/navbar'
import { AuthContext } from '../../../helpers/auth/AuthContext'
import { useMediaQuery } from 'react-responsive'
import vars from '../../../helpers/utils/vars'
import SettingContext from '../../../helpers/theme-setting/SettingContext'
import { MessengerContext } from '../../../helpers/messenger/MessengerContext'

const TopMenu = ({ role, logoName }) => {
	useEffect(() => {
		setTimeout(function () {
			document.querySelectorAll('.loader-wrapper').style = 'display:none'
		}, 2000)
	}, [])

	const settingsContext = useContext(SettingContext)
	const notificationList = settingsContext?.appData?.__notifications || []

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	const [sidebar, setSidebar] = useState(false)
	const [rightSidebar, setRightSidebar] = useState(true)
	const [navMenus, setNavMenus] = useState(false)

	const [showNotificationModal, setNotificationModal] = useState(false)

	const messengerContext = useContext(MessengerContext)

	const newCounts = messengerContext.newMessageCounts

	const [newMessageCounts, setNewMessageCounts] = useState(0)

	const notifications = () => {
		setNotificationModal(!showNotificationModal)
	}

	const openNav = () => {
		var openmyslide = document.getElementById('mySidenav')
		if (openmyslide) {
			openmyslide.classList.add('open-side')
		}
	}
	const openSearch = () => {
		document.getElementById('search-overlay').style.display = 'block'
	}

	const toggle = () => {
		setNavMenus((prevState) => ({
			navMenus: !prevState.navMenus,
		}))

		if (navMenus.navMenus) {
			console.log('TRUE=', navMenus)
			document.querySelector('.nav-menus').classList.remove('hide')
			document.querySelector('.nav-menus').classList.add('open')
		} else {
			console.log('FALSE=', navMenus)
			document.querySelector('.nav-menus').classList.remove('open')
			document.querySelector('.nav-menus').classList.add('hide')
		}
	}

	const showRightSidebar = () => {
		onAuthModalsTriggered('Chat')
		if (rightSidebar) {
			setRightSidebar(false)
			document.querySelector('.right-sidebar')?.classList.add('show')
		} else {
			setRightSidebar(true)
			document.querySelector('.right-sidebar')?.classList.remove('show')
		}
	}

	const openCloseSidebar = (e) => {
		e.preventDefault()
		if (sidebar) {
			setSidebar(false)
			document.querySelector('.page-main-header').classList.add('open')
			document.querySelector('.page-sidebar').classList.add('open')
		} else {
			setSidebar(true)
			document.querySelector('.page-main-header').classList.remove('open')
			document.querySelector('.page-sidebar').classList.remove('open')
		}
	}

	useEffect(() => {
		setNewMessageCounts(newCounts)		
    }, [newCounts]);

	return (
		<Fragment>
			{/* open */}
			<div className=''>
				<div className='main-header-right row'>
					<div className='main-header-left d-lg-none'>
						<div className='logo-wrapper'>
							<a href='index.html'></a>
						</div>
					</div>

					<div className='mobile-sidebar'>
						<div className='media-body text-right switch-sm'>
							<label className='switch'>
								<a href='#' onClick={openCloseSidebar} style={{ cursor: 'pointer' }}>
									<AlignLeft />
								</a>
							</label>
						</div>
					</div>

					{isAuth && !isTabletOrMobile && (
						<div className='d-flex justify-space-between align-items-center mt-2 ml-3 col'>
							<LogoImage logo={logoName} />
							<div className='main-nav-center' style={{ marginLeft: 'auto' }}>
								<NavBar />
							</div>
						</div>
					)}

					<div className={`nav-right ${isAuth ? '' : 'col'}`}>
						<ul className={'nav-menus ' + (navMenus ? 'open' : 'hide')}>
							<li>
								<a href='#' className='linkCursor' onClick={showRightSidebar}>
									<MessageSquare size={25} />
									{newMessageCounts > 0 ? (
										<span className='badge badge-pill badge-primary pull-right notification-badge'>
											{newMessageCounts}
										</span>
									) : null}
									{newMessageCounts > 0 ? <span className='dot'></span> : null}
								</a>
							</li>
							<li>
								<a href='#' className='linkCursor' onClick={notifications}>
									<Bell size={25} />
									{notificationList.length > 0 ? (
										<span className='badge badge-pill badge-primary pull-right notification-badge'>
											{notificationList.length}
										</span>
									) : null}
									{notificationList.length > 0 ? <span className='dot'></span> : null}
								</a>
							</li>
							<UserMenu role={role} />
						</ul>
						<div
							className='d-lg-none mobile-toggle'
							onClick={() => toggle()}
							style={{ marginLeft: 120, marginTop: 20 }}
						>
							<MoreHorizontal />
						</div>
					</div>
				</div>
			</div>
			<Notification modal={showNotificationModal} toggle={notifications} />
		</Fragment>
	)
}

export default TopMenu
