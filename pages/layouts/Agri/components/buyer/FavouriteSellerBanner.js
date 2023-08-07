import React, { Fragment, useContext, useState, useEffect, useMemo } from 'react'
import getConfig from 'next/config'
import { Media, Row, Col } from 'reactstrap'
import { Award } from 'react-feather'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import ReportsListSeller from '../../../../../components/modals/ReportsListSeller'
import LineChartSeller from '../../../../../components/modals/LineChartSeller'
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5'
import Tooltip from 'react-simple-tooltip'
import BlueUserLogo from '../../../../../public/assets/images/BlueUserLogo.png'
import BlueUserCover from '../../../../../public/assets/images/BlueUserCover.jpg'
import { isEmpty } from '../../../../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const FavouriteSellerBanner = ({ seller, sellers, usersFavourites, usersProduce }) => {
	const isBlueUser = seller.membershipISbb_agrix_membership_typesID_data && seller.membershipISbb_agrix_membership_typesID_data.name && seller.membershipISbb_agrix_membership_typesID_data.name === 'Blue'
	const companyImage = isBlueUser ? BlueUserCover : contentsUrl + seller.companybannerISfile
	const logoImage = isBlueUser ? BlueUserLogo : `${contentsUrl}${seller.companylogoISfile}`
	const bannerBackground = {
		backgroundImage:
			'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' +
			companyImage +
			')',
	}

	const authContext = useContext(AuthContext)
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const user = authContext.user
	const isAuth = authContext.isAuthenticated;

	const isLoggedBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'

	const favourite = usersFavourites.find((uf) => uf.fav_userISbb_agrix_usersID === seller.numeric_id)
	const [currentFavouriteId, setCurrentFavouriteId] = useState(favourite ? favourite._id : null)

	const [reportsModal, setReportsModal] = useState(false)
	const [chartModal, setChartModal] = useState(false)

	const [favSellers, setFavSellers] = useState([])

	const initFavourites = useMemo(() => {
		let result = [];
		for (let s of sellers) {
			const f = usersFavourites.find((f) => f.fav_userISbb_agrix_usersID === s.numeric_id)
			const user_produce = usersProduce.filter((produce) => produce.userISbb_agrix_usersID === s.numeric_id)
			if (f) {
				result.push({
					...s,
					favourite_id: f._id,
					produce: user_produce,
				})
			}
		}
		return result
	}, [sellers, usersFavourites])

	const callPermissionLimit = () =>
		onAuthModalsTriggered('Permission', '', {
			backButton: true,
			message: 'Oops. You need to upgrade your subscription to follow more sellers!',
		})

	const onFavouriteClicked = async () => {
		let formData = getFormClient()
		if (currentFavouriteId) {
			formData.append('api_method', 'delete_users_favourites')
			formData.append('_id', currentFavouriteId)
		} else {

			if (isLoggedBlueUser) {
				// Blue
				if (favSellers.length >= 1) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Gold') {
				if (favSellers.length >= 5) {
					return callPermissionLimit()
				}
			} else if (user.subs?.membership_type === 'Platinum') {
				if (favSellers.length >= 20) {
					return callPermissionLimit()
				}
			}

			formData.append('api_method', 'add_users_favourites')
			formData.append('userISbb_agrix_usersID', user._id)
			formData.append('fav_userISbb_agrix_usersID', seller._id)
		}
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				const item = response.data.item
				if (currentFavouriteId) {
					setCurrentFavouriteId(null)
				} else {
					setCurrentFavouriteId(item._id)
				}
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	useEffect(() => {
		setFavSellers(initFavourites)
	}, [])

	return (
		<div>
			<section className='favourite-banner-panel' style={bannerBackground}>
				<div className='pt-4 d-flex justify-content-center'>
					<Media
						src={logoImage}
						className='img-fluid blur-up lazyload bg-img'
						alt='logo'
						width='165px'
						style={{ borderRadius: 7, height: '100%' }}
					/>
					<Award style={{ position: 'relative', right: 0, display: 'none' }} color='#fd7e14' />
				</div>
				<div className='seller-page-info p-3 d-flex align-items-center flex-column'>
					<h2 style={{ color: '#fff' }}>{seller.company}</h2>
					<h4 style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>
						{seller.first_name + ' ' + seller.last_name}
					</h4>
					<p style={{ fontSize: 17, lineHeight: 1.4, textAlign: 'center' }}>
						{seller.companysummaryISsmallplaintextbox}
					</p>
				</div>
				<Row className='favourite-banner-info w-100'>
					<Col md='8'>
						<ul>
							<li>
								<a
									className='linkCursor'
									href='#graphs'
									// onClick={() => setChartModal(!chartModal)}
								>
									<Tooltip content='Graphs' padding={10} radius={5} background='#021A49'>
										<i className='fa fa-bar-chart circle-icon'></i>
									</Tooltip>
								</a>
							</li>
							<li>
								<a href='#' className='linkCursor' onClick={() => setReportsModal(!reportsModal)}>
									<Tooltip content='Reports' padding={10} radius={5} background='#021A49'>
										<i className='fa fa-list-alt circle-icon'></i>
									</Tooltip>
								</a>
							</li>
						</ul>
					</Col>
					<Col md='4' className='d-flex justify-content-end' style={{ paddingRight: 50 }}>
						<button
							className={`btn btn-solid btn-default-plan btn-post ml-5 ${isAuth ? 'enabled' : 'disabled'}` }
							style={{ marginTop: 15 }}
							onClick={() => onAuthModalsTriggered('Chat', seller)}
							disabled={!isAuth ? true : false}
						>
							<i className='fa fa-comments mr-1' aria-hidden='true'></i>
							Message
						</button>
						{user.role === 'buyer' && (
							<button
								className={`btn btn-solid ${
									currentFavouriteId ? 'btn-default-plan' : 'btn-gray-plan'
								} btn-post ml-3 d-flex align-items-center`}
								style={{ marginTop: 15 }}
								onClick={onFavouriteClicked}
							>
								{currentFavouriteId ? <IoHeartSharp size={16} /> : <IoHeartOutline size={16} />}
								<span className='ml-1'>{currentFavouriteId ? 'Unfollow' : 'Follow'}</span>
							</button>
						)}
					</Col>
				</Row>
			</section>
			<ReportsListSeller isShow={reportsModal} onToggle={() => setReportsModal(!reportsModal)} seller={seller} />
			<LineChartSeller
				isShow={chartModal}
				onToggle={() => setChartModal(!chartModal)}
				usersProduce={usersProduce}
				seller={seller}
			/>
		</div>
	)
}

export default FavouriteSellerBanner
