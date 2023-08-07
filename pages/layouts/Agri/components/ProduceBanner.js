import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import Info from './modals/InfoModal'
import ProduceGraphical from '../../../../components/modals/ProduceGraphical'
import ProduceSellerSearch from '../../../../components/modals/ProduceSellerSearch'
import getConfig from 'next/config'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import { post } from '../../../../services/axios'
import { getFormClient } from '../../../../services/constants'
import Tooltip from 'react-simple-tooltip'
import { useMediaQuery } from 'react-responsive'
import SearchHeader from '../../../../components/headers/seller/searchHeader'
import SearchOverlay from '../../../../components/modals/SearchOverlayModal'
import vars from '../../../../helpers/utils/vars'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const ProduceBanner = ({ produceData, tags, sellers, sellerProduces, searchBar = true, type = '' }) => {
	const caption = produceData ? produceData.name : ''
	const description = ''
	const imagePath = produceData?.main_produce_image01ISfile ?? ''
	const isMobileHide = tags && tags.length > 6
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const isAuth = authContext.isAuthenticated
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	const [favouriteId, setFavouriteId] = useState(null)
	const [showInfoModal, setInfoModal] = useState(false)
	const onSearched = (args) => {
		setSearchParams(args)
		setSearchModalShow(true)
	}

	const [searchModalShow, setSearchModalShow] = useState(false)
	const [searchParams, setSearchParams] = useState({
		searchText: '',
		id: '',
		country: '',
	})

	const infoForm = () => setInfoModal(!showInfoModal)

	const [showGraphicalModal, setGraphicalModal] = useState(false)

	const [showSearchModal, setSearchModal] = useState(false)

	const sectionStyle = useMemo(
		() => ({
			backgroundPosition: 'center center',
			backgroundSize: 'cover',
			backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${encodeURI(
				`${contentsUrl}${imagePath ?? ''}`
			)})`,
		}),
		[imagePath]
	)

	useEffect(() => {
		const getUsersFavourites = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_users_favourites')
			formData.append('userISbb_agrix_usersID', user._id)
			formData.append('get_linked_data', '1')

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					const favourites = response.data.list
					for (let favourite of favourites) {
						if (favourite.fav_produceISbb_agrix_users_produceID_data) {
							const favouriteProduceId =
								favourite.fav_produceISbb_agrix_users_produceID_data.produce_sub_categoryISbb_agrix_produce_typesID
							if (favouriteProduceId === produceData.numeric_id) setFavouriteId(favouriteProduceId)
						}
					}
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		if (isAuth) getUsersFavourites()
	}, [])

	const SearchElement =
		searchBar && !isTabletOrMobile ? (
			<div
				style={{
					position: 'absolute',
					bottom: -40,
					background: 'transparent',
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						background: '#fff',
						minWidth: '80%',
						borderRadius: 3,
						// overflow: 'hidden',
						boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px',
					}}
				>
					<div className='onhover-div' style={{ padding: '10px 15px' }}>
						<SearchHeader
							onSearch={onSearched}
							searchFieldCustomStyles={{ border: '1px solid #ccc', borderRadius: 4 }}
						/>
					</div>
				</div>
			</div>
		) : null

	const IconButtons = (
		<>
			<ul>
				{/* <li>
					<a onClick={infoForm} className='linkCursor'>
						<Tooltip content='Information' padding={10} radius={5} background='#021A49'>
							<i id='tooltip-info-icon' className='fa fa-info-circle circle-icon'></i>
						</Tooltip>
					</a>
				</li> */}
				<li>
					<a href='#' onClick={() => setGraphicalModal(true)} className='linkCursor'>
						<Tooltip content='Graphs' padding={10} radius={5} background='#021A49'>
							<i id='tooltip-chart-icon' className='fa fa-bar-chart circle-icon'></i>
						</Tooltip>
					</a>
				</li>
				<li>
					<a className='linkCursor' href='#report'>
						<Tooltip content='Reports' padding={10} radius={5} background='#021A49'>
							<i id='tooltip-list-icon' className='fa fa-list-alt circle-icon'></i>
						</Tooltip>
					</a>
				</li>
				<li>
					<a href='#' onClick={() => setSearchModal(true)} className='linkCursor'>
						<Tooltip content='Search&nbsp;Seller' padding={10} radius={5} background='#021A49'>
							<i id='tooltip-user-icon' className='fa fa-user-circle-o circle-icon'></i>
						</Tooltip>
					</a>
				</li>
			</ul>
		</>
	)

	return (
		<Fragment>
			<section
				className='category-banner-panel'
				style={{ ...sectionStyle, position: 'relative', minHeight: type === 'sub' ? 420 : 340 }}
			>
				{tags ? (
					<div
						className='category-banner-info w-100'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							top: type === 'sub' ? (user?.role === 'buyer' ? 80 : 100) : 40,
						}}
					>
						<h1 style={{ textAlign: 'center', textTransform: 'unset', color: '#fff' }}>{caption}</h1>
						{tags.length > 0 ? (
							<div className={`mb-2 mt-2 category-banner-tags-wrapper ${isMobileHide ? "mobile-hide" : ""}`}>
								{tags.map((tag) => (
									<span key={tag._id} className='category-banner-tag'>
										{tag.name}
									</span>
								))}
							</div>
						) : (
							<></>
						)}
						<p dangerouslySetInnerHTML={{ __html: description ?? '' }}></p>
						{IconButtons}
						{/* {user && user.role === 'buyer' && (
							<button
								className={`btn btn-solid ${favouriteId ? 'btn-default-plan' : 'btn-gray-plan'} btn-post`}
								style={{ marginTop: 30 }}
							>
								<i className='fa fa-users mr-2' aria-hidden='true'></i>
								{favouriteId ? 'Unfollow' : 'Follow'}
							</button>
						)} */}
					</div>
				) : (
					<div
						className='category-banner-info w-100'
						style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', top: 90 }}
					>
						<h1 style={{ textAlign: 'center', textTransform: 'unset', color: '#fff' }}>{caption}</h1>
						<p dangerouslySetInnerHTML={{ __html: description ?? '' }} />
						{IconButtons}
					</div>
				)}

				{SearchElement}
			</section>
			<Info modal={showInfoModal} toggle={infoForm} textData={produceData?.descriptionISsmallplaintextbox} />
			<ProduceGraphical
				isShow={showGraphicalModal}
				onToggle={() => setGraphicalModal(!showGraphicalModal)}
				produceData={produceData}
			/>
			<ProduceSellerSearch
				isShow={showSearchModal}
				onToggle={() => setSearchModal(!showSearchModal)}
				sellers={sellers}
				sellerProduces={sellerProduces}
			/>
			{searchBar && (
				<SearchOverlay
					isShow={searchModalShow}
					onToggle={() => setSearchModalShow(!searchModalShow)}
					searchParams={searchParams}
				/>
			)}
		</Fragment>
	)
}

export default ProduceBanner
