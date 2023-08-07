import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SELLERMENUITEMS } from '../../constant/menu'
import { BUYERMENUITEMS } from '../../constant/menu'
import { HelpCircle } from 'react-feather'
import UserPermission from '../../modals/UserPermission'
import { useMediaQuery } from 'react-responsive'
import { AuthContext } from '../../../helpers/auth/AuthContext'
import vars from '../../../helpers/utils/vars'
import { isEmpty } from '../../../helpers/utils/helpers'

const Sidebar = ({ role, display }) => {
	const router = useRouter()
	let mainMenuItems = SELLERMENUITEMS

	const authContext = useContext(AuthContext)
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })
	if (display && isTabletOrMobile) {
		display = false
	}

	if (role == 'buyer') mainMenuItems = BUYERMENUITEMS

	const [mainmenu, setMainMenu] = useState(mainMenuItems)

	const [showRoleModal, setShowRoleModal] = useState(false)
	const [message, setMessage] = useState('')

	const currentUrl = `${window.location.pathname}${window.location.search}`

	useEffect(() => {
		const updatedMenu = mainmenu.map(m => {
			const active = currentUrl === m.path;
			if (active) {
				setNavActive(m);
			}
			return {
				...m,
				active
			}
		})
		setMainMenu(updatedMenu)
	}, [currentUrl])

	const setNavActive = (item) => {
		mainMenuItems.filter((menuItem) => {
			if (menuItem !== item) menuItem.active = false
			if (menuItem.children && menuItem.children.includes(item)) menuItem.active = true
			if (menuItem.children) {
				menuItem.children.filter((submenuItems) => {
					if (submenuItems !== item) {
						submenuItems.active = false
					}
					if (submenuItems.children) {
						submenuItems.children.map((childItem) => (childItem.active = false))
						if (submenuItems.children.includes(item)) {
							submenuItems.active = true
							menuItem.active = true
						}
					}
					return false
				})
			}
			return false
		})
		item.active = !item.active
		setMainMenu(mainMenuItems)
	}

	const callPermissionLimit = () =>
		onAuthModalsTriggered('Permission', '', {
			backButton: true,
			message: 'Oops. You need to upgrade your subscription plan in order to create reports!',
		})

	const onMenuItemClicked = (item) => {
		setNavActive(item)
		if (item.title === 'My Reports') {
			// if user's membership is blue plan
			if (isEmpty(user.subs) || user.subs?.membership_type === 'Blue') {
				// Blue
				return callPermissionLimit()
			} else router.push(item.path)
		} else if (item.title === 'Buyer Report') {
			router.push(item.path)
		} else {
			router.push(item.path)
		}
	}

	const mainMenu = mainmenu.map((menuItem, i) => (
		<li className={`${menuItem.active ? 'active' : ''}`} key={i}>
			{menuItem.sidebartitle ? <div className='sidebar-title'>{menuItem.sidebartitle}</div> : ''}
			{menuItem.type === 'sub' ? (
				<a className='sidebar-header linkCursor' href='#javaScript' onClick={() => setNavActive(menuItem)}>
					<menuItem.icon />
					<span>{menuItem.title}</span>
					<i className='fa fa-angle-right pull-right'></i>
				</a>
			) : (
				''
			)}
			{menuItem.type === 'link' ? (
				<a href='#'
					className={`sidebar-header linkCursor ${menuItem.active ? 'active' : ''}`}
					onClick={() => onMenuItemClicked(menuItem)}
				>
					<menuItem.icon />
					<span>{menuItem.title}</span>
					{menuItem.children ? <i className='fa fa-angle-right pull-right'></i> : ''}
				</a>
			) : (
				''
			)}
			{menuItem.children ? (
				<ul
					className={`sidebar-submenu ${menuItem.active ? 'menu-open' : ''}`}
					style={menuItem.active ? { opacity: 1, transition: 'opacity 500ms ease-in' } : {}}
				>
					{menuItem.children.map((childrenItem, index) => (
						<li key={index} className={childrenItem.children ? (childrenItem.active ? 'active' : '') : ''}>
							{childrenItem.type === 'sub' ? (
								<a href='#javaScript' onClick={() => setNavActive(childrenItem)}>
									<i className='fa fa-circle'></i>
									{childrenItem.title} <i className='fa fa-angle-right pull-right'></i>
								</a>
							) : (
								''
							)}

							{childrenItem.type === 'link' ? (
								<a href='#'
									to={`${process.env.PUBLIC_URL}${childrenItem.path}`}
									className={`${childrenItem.active ? 'active' : ''} linkCursor`}
									onClick={() => setNavActive(childrenItem)}
								>
									<i className='fa fa-circle'></i>
									{childrenItem.title}{' '}
								</a>
							) : (
								''
							)}
							{childrenItem.children ? (
								<ul className={`sidebar-submenu ${childrenItem.active ? 'menu-open' : 'active'}`}>
									{childrenItem.children.map((childrenSubItem, key) => (
										<li className={childrenSubItem.active ? 'active' : ''} key={key}>
											{childrenSubItem.type === 'link' ? (
												<a href='#'
													to={`${process.env.PUBLIC_URL}${childrenSubItem.path}`}
													className={childrenSubItem.active ? 'active' : ''}
													onClick={() => setNavActive(childrenSubItem)}
												>
													<i className='fa fa-circle'></i>
													{childrenSubItem.title}
												</a>
											) : (
												''
											)}
										</li>
									))}
								</ul>
							) : (
								''
							)}
						</li>
					))}
				</ul>
			) : (
				''
			)}
		</li>
	))

	return (
		<Fragment>
			<div style={{ zIndex: 10 }} className={display ? 'page-sidebar' : 'page-sidebar open'}>
				<div className='sidebar custom-scrollbar'>
					<ul className='sidebar-menu' style={{ paddingTop: 30 }}>
						{mainMenu}
					</ul>
				</div>
			</div>
			<UserPermission
				modal={showRoleModal}
				onToggle={(showRoleModal) => setShowRoleModal(!showRoleModal)}
				message={message}
				isBack={true}
			/>
		</Fragment>
	)
}

export default Sidebar
