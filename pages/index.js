import React, { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Banner from './layouts/Agri/components/Banner'
import ProduceList from './layouts/Agri/components/ProduceList'
import ReportSpace from './layouts/Agri/components/ReportSpace'
import OurSellersSpace from './layouts/Agri/components/OurSellersSpace'
import AdSpaceSquareHome from './layouts/Agri/components/AdSpaceSquareHome'
import AdSpace from './layouts/Agri/components/AdSpace'
import CommonLayout from '../components/layout/common-layout'
import { AuthContext } from '../helpers/auth/AuthContext'
import { getBanner, listReports, getSellers, listAdverts, getCategories, getAllUsers } from '../helpers/lib'

const Agri = ({ categories, premiumAdverts, planAdverts, reports, sellers, banner }) => {
	const router = useRouter()
	const authContext = useContext(AuthContext)
	const onAuth = authContext.onAuth

	const activePremiumAdverts = premiumAdverts.filter(
		(advert) =>
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Active' ||
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Reactivated'
	)

	const activePlanAdverts = planAdverts.filter(
		(advert) =>
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Active' ||
			advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived === 'Reactivated'
	)

	useEffect(() => {
		const auth = router.query?.auth
		if (auth && auth === 'logout') {
			localStorage.removeItem('isAuthenticated')
			localStorage.removeItem('user')
			onAuth({}, false)
			router.push('/')
		}
	}, [])

	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<Banner banner={banner} />
			<ProduceList categories={categories} type='produce' />
			<AdSpaceSquareHome premiumAdverts={activePremiumAdverts} />
			<ReportSpace reports={reports} imgMaxWidth={280} size='normal' />
			<AdSpace planAdverts={activePlanAdverts} />
			<OurSellersSpace sellers={sellers} />
		</CommonLayout>
	)
}

export default Agri

export async function getServerSideProps() {
	const categories = await getCategories()
	const premiumAdverts = await listAdverts('positionISbb_agrix_adverts_positionsID', null, null, '1', 'RAND()')
	const planAdverts = await listAdverts('positionISbb_agrix_adverts_positionsID', null, null, '2')
	const reports = await listReports('1')
	//const sellers = await getAllUsers('sellers', 50)
	const sellers = await getSellers()
	const banner = await getBanner()

	return {
		props: {
			categories,
			premiumAdverts,
			planAdverts,
			reports,
			sellers,
			banner,
		},
	}
}
