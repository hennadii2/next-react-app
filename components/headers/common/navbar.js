import React, { useState, useEffect, useContext } from 'react'
import { MENUITEMS } from '../../constant/menu'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { AuthContext } from '../../../helpers/auth/AuthContext'
import ProduceModal from '../../modals/ProduceModal'
import TopBar from './topbar'
import { useMediaQuery } from 'react-responsive'
import vars from '../../../helpers/utils/vars'
import { BiSearch } from 'react-icons/bi'
import SearchModal from '../../modals/SearchModal'
import { isEmpty } from '../../../helpers/utils/helpers'

const NavBar = () => {
	const { t } = useTranslation()

	const authContext = useContext(AuthContext)
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const isAuthenticated = authContext.isAuthenticated
	const user = authContext.user
	const onTarget = authContext.onTarget
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	const [navClose, setNavClose] = useState({ right: '0px' })
	const [isProduceModal, setIsProduceModal] = useState(false)
	const [searchModal, setSearchModal] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (window.innerWidth < 750) {
			setNavClose({ right: '-410px' })
		}
		if (window.innerWidth < 1199) {
			setNavClose({ right: '-300px' })
		}
	}, [])

	const openNav = () => {
		setNavClose({ right: '0px' })
	}

	const closeNav = () => {
		setNavClose({ right: '-410px' })
	}
	// eslint-disable-next-line

	const [activeNavIndex, setActiveNavIndex] = useState(0)

	useEffect(() => {
		let currentPath = router.asPath
		MENUITEMS.find((item, index) => {
			if (item.path && item.path === currentPath) {
				setActiveNavIndex(index)
			}
		})
	}, [])

	const openMblNav = (menu) => {
		if (menu.title === 'MEMBERSHIP PLANS') {
			if (isAuthenticated) {
				if (user.role === 'seller') {
					router.push({
						pathname: '/seller/account',
						query: { active: 'plan' },
					})
				} else if (user.role === 'buyer') {
					router.push({
						pathname: '/buyer/account',
						query: { active: 'plan' },
					})
				}
			} else {
				onTarget({
					pathname: '/account',
					query: { active: 'plan' },
				})
				onAuthModalsTriggered('user_type')
			}
		} else if (menu.title === 'PRODUCE') {
			setIsProduceModal(true)
		} else if (menu.title === 'REPORTS') {
			if (!isAuthenticated) {
				onTarget(menu.path)
				onAuthModalsTriggered('login')
			} else if (isEmpty(user.subs) || user.subs?.membership_type === 'Blue') {
				console.log(user)
				onAuthModalsTriggered('Permission', '', {
					backButton: true,
					message: 'Oops. You need to upgrade your subscription to view these!',
				})
			} else {
				router.push(menu.path)
			}
		} else {
			router.push(menu.path)
		}
	}

	return (
		<div className='main-navbar'>
			<div id='mainnav'>
				<div className='toggle-nav' onClick={openNav.bind(this)}>
					<i className='fa fa-bars sidebar-bar'></i>
				</div>
				<ul className='nav-menu' style={navClose}>
					<li className='back-btn' onClick={closeNav.bind(this)}>
						<div className='mobile-back text-right'>
							<span>Back navbar</span>
							<i className='fa fa-angle-right pl-2' aria-hidden='true'></i>
						</div>
					</li>
					{isTabletOrMobile && (
						<li>
							<div
								style={{
									boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px',
									border: `1px solid gray`,
									borderRadius: 25,
									maxWidth: '85%',
									cursor: 'pointer',
								}}
								className='nav-link mt-3 mb-4 ml-3 px-3 py-2 d-flex align-items-center'
								onClick={() => setSearchModal(true)}
							>
								<BiSearch className='mr-3' />
								<span>Search</span>
							</div>
						</li>
					)}
					{MENUITEMS.filter((x) => {
						if (authContext.isAuthenticated) {
							if (x.path !== '/about-us') return true
							return false
						} else {
							return true
						}
					}).map((menuItem, i) => {
						return (
							<li key={i}>
								<a href='#'
									className={`nav-link ${i === activeNavIndex ? 'active' : ''}`}
									onClick={() => {
										openMblNav(menuItem)
										setActiveNavIndex(i)
									}}
								>
									{' '}
									{t(menuItem.title)}
								</a>
							</li>
						)
					})}
					{isAuthenticated && (
						<li>
							<a href='#'
								className={`nav-link ${activeNavIndex === MENUITEMS.length ? 'active' : ''}`}
								onClick={() => {
									router.push({
										pathname: `/${user.role === 'seller' ? 'seller' : 'buyer'}/dashboard`,
										query: { active: 'plan' },
									})
									setActiveNavIndex(MENUITEMS.length)
								}}
							>
								{user.role === 'seller' ? 'SELLER' : 'BUYER'} DASHBOARD
							</a>
						</li>
					)}
					<li>{isTabletOrMobile && <TopBar topClass='text-left my-4 pl-3' />}</li>
				</ul>
			</div>

			<ProduceModal isShow={isProduceModal} onToggle={(val) => setIsProduceModal(val)} />
			<SearchModal isShow={searchModal} onToggle={(val) => setSearchModal(val)} />
		</div>
	)
}

export default NavBar
