import React, { Fragment, useState } from 'react'
import Slider from 'react-slick'
import MasterBanner from './MasterBanner'
import getConfig from 'next/config'
import { Container } from 'reactstrap'
import { useMediaQuery } from 'react-responsive'

import SearchHeader from '../../../../components/headers/seller/searchHeader'
import SearchOverlay from '../../../../components/modals/SearchOverlayModal'
import vars from '../../../../helpers/utils/vars'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const Banner = (props) => {
	const { searchBar = true } = props
	const [searchModalShow, setSearchModalShow] = useState(false)
	const [searchParams, setSearchParams] = useState({
		searchText: '',
		id: '',
		country: '',
	})
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	const openSearch = () => {
		document.getElementById('search-overlay').style.display = 'block'
	}

	const onSearched = (args) => {
		setSearchParams(args)
		setSearchModalShow(true)
	}

	const { banner } = props
	const bannerUrl = contentsUrl + banner.image01ISfile

	const bannerBackground = {
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
		backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${encodeURI(`${bannerUrl}`)})`,
	}

	return (
		<Fragment>
			<section className='p-0' style={{ position: 'relative' }} id='headSectionWithBanner'>
				<Slider className='slide-1 home-slider no-arrow'>
					<MasterBanner
						title1={props.title1}
						bannerBackground={bannerBackground}
						title={banner.contentISsmallplaintextbox}
						classes='p-center text-center'
					/>
				</Slider>

				{searchBar && !isTabletOrMobile && (
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
				)}
			</section>

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

export default Banner
