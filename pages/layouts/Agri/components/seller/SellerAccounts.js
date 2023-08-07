import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs'
import { useRouter } from 'next/router'
import SellerAccountInfo from './SellerAccountInfo'
import SellerAccountPlan from './SellerAccountPlan'
import { Elements } from '@stripe/react-stripe-js'
import getStripePromise from '../../../../../helpers/utils/get-stripe'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'

const Accounts = ({ membershipTypes }) => {
	const router = useRouter()
	const authContext = useContext(AuthContext)
	const stripePublicKey = authContext.validSessionData.stripe_public_key
	const stripePromise = getStripePromise(stripePublicKey)

	const [tabIndex, setTabIndex] = useState(0)

	useEffect(() => {
		const active = router.query?.active
		if (active && active == 'plan') {
			setTabIndex(1)
		}
	}, [])

	return (
		<Fragment>
			<Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
				<TabList className='nav nav-tabs tab-coupon'>
					<Tab className='nav-link'>My Account Information</Tab>
					<Tab className='nav-link'>My Plan</Tab>
				</TabList>
				<TabPanel>
					<SellerAccountInfo />
				</TabPanel>
				<TabPanel>
					<Elements stripe={stripePromise}>
						<SellerAccountPlan membershipTypes={membershipTypes} />
					</Elements>
				</TabPanel>
			</Tabs>
		</Fragment>
	)
}

export default Accounts
