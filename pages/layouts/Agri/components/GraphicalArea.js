import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Col, Label, Row, Input } from 'reactstrap'
import PriceLineGraph from './PriceLineGraph'
import PriceLineGraph2 from './PriceLineGraph2'
import ProduceGraphicalFilter from './ProduceGraphicalFilter'
import SeasonalPieChart from './SeasonalPieChart'
import { getFormClient } from '../../../../services/constants'
import { post } from '../../../../services/axios'
import { useRouter } from 'next/router'
import getConfig from 'next/config'
import { BoxCard } from '../../../../helpers/utils/helpers'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import SettingContext from '../../../../helpers/theme-setting/SettingContext'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const msg = `In order to view Sellers pricing information, you need to have a Buyers account. Please click below to log out of your sellers account, and create a buyers account.`
const nonLoggedInmsg = `In order to view Sellers pricing information, you need to have a Buyers account. Please click below to sign-up and create an account.`
const msgEl = (
	<h3 className='text-center' style={{ color: '#fff', maxWidth: 500 }}>
		{msg}
	</h3>
)
const nonLoggedmsgEl = (
	<h3 className='text-center' style={{ color: '#fff', maxWidth: 500 }}>
		{nonLoggedInmsg}
	</h3>
)

const GraphicalArea = ({ usersProduce, pricingLogs }) => {
	const router = useRouter()
	const initialValue = usersProduce[0]?.numeric_id || ''
	const [lineGraphProduce, setLineGraphProduce] = useState([])
	const [pieChartProduce, setPieChartProduce] = useState(initialValue)

	const authContext = useContext(AuthContext)
	const onAuth = authContext.onAuth
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	// const settingContext = useContext(SettingContext)
	// const types = settingContext.appData.users_types
	// const buyerType = types.filter((type) => type.name === 'Buyer')[0]

	const setLineData = (data) => {
		setLineGraphProduce(data)
	}

	const onLogoutClicked = async () => {
		// removing session variable
		const apiResponse = await fetch('/api/logout', { method: 'POST' })

		if (apiResponse.ok) {
			if (router.asPath === '/') {
				localStorage.removeItem('isAuthenticated')
				localStorage.removeItem('user')
				onAuth({}, false)
				router.push('/')
			} else {
				router.push({
					pathname: '/',
					query: { auth: 'logout' },
				})
			}
		}
		onSignupClicked()
	}

	const onSignupClicked = async () => {
		onAuthModalsTriggered('user_type')
	}

	const getOverlayContent = () => {
		if (!authContext.isAuthenticated) {
			const btn = (
				<button
					type='button'
					className='mt-4 btn btn-solid btn-default-plan btn-post btn-sm'
					onClick={() => {
						// onAuthModalsTriggered('membership', buyerType._id, buyerType)
						onSignupClicked()
					}}
				>
					Sign-Up
				</button>
			)
			return (
				<>
					{nonLoggedmsgEl}
					{btn}
					<div className='p-4' />
				</>
			)
		} 
		else if (user.role !== 'buyer') {
			const btn = (
				<button
					type='button'
					className='mt-4 btn btn-solid btn-default-plan btn-post btn-sm'
					onClick={() => {
						// onAuthModalsTriggered('membership', buyerType._id, buyerType)
						onLogoutClicked()
					}}
				>
					Sign-Up as a buyer
				</button>
			)
			return (
				<>
					{msgEl}
					{btn}
					<div className='p-4' />
				</>
			)
		} else {
			return null
		}
	}

	const onChangeFilter = (val) => {
		if (val) {
			if (Array.isArray(val)) { // when select Tag
				return;
			} else { // when change Produce
				setPieChartProduce(val);
			}
		}
		
	};

	const overlayContent = getOverlayContent()
	const overlayStyles = overlayContent ? { position: 'relative' } : {}
	const finalOverlayContent = overlayContent ? (
		<div
			className='d-flex flex-column justify-content-center align-items-center'
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: '100%',
				height: '100%',
				zIndex: 9,
				backgroundColor: 'rgba(0, 0, 0, .5)',
			}}
		>
			{overlayContent}
		</div>
	) : null

	return (
		<div id='graphs'>
			<BoxCard className='my-5' style={overlayStyles}>
				<div className='p-3' />
				<h3 className='text-center'>Price Log Graph</h3>
				<p className='text-center mb-0'>Use the filters below to see the price trends for this sellers produce.</p>
				<ProduceGraphicalFilter
					initialValue={initialValue}
					usersProduce={usersProduce}
					onFilter={(val) => setLineData(val)}
				/>
				<PriceLineGraph2 lineData={lineGraphProduce} pricelogs={pricingLogs} graphTitle='' />
				<div className='p-3' />
				{finalOverlayContent}
			</BoxCard>
			<BoxCard style={overlayStyles}>
				<div className='p-3' />
				<h3 className='text-center'>Seasonal Pie Chart</h3>
				<p className='text-center mb-0'>Use the filters below to see the different seasons for a selected produce.</p>
				<ProduceGraphicalFilter
					initialValue={initialValue}
					usersProduce={usersProduce}
					onFilter={(val) => onChangeFilter(val)}
				/>
				<SeasonalPieChart usersProduce={usersProduce} numeric_id={pieChartProduce} graphTitle='' />
				<div className='p-3' />
				{finalOverlayContent}
			</BoxCard>
			<div className='p-4' />
		</div>
	)
}

export default GraphicalArea
