import React, { useContext } from 'react'
import CommonLayout from '../components/layout/common-layout'
import Banner from './layouts/Agri/components/Banner'
import ReportsAllList from './layouts/Agri/components/ReportsAllList'
import ProduceList from './layouts/Agri/components/ProduceList'
import { getBanner, listReports, getCategories } from '../helpers/lib'
import { AuthContext } from '../helpers/auth/AuthContext'

const Reports = ({ categories, reports, banner }) => {
	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const onTarget = authContext.onTarget

	React.useEffect(() => {
		if (!isAuth) {
			onTarget(window.location.pathname)
			onAuthModalsTriggered('login')
		}
	}, [])

	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<Banner banner={banner} title1={'Agrixchange Seller Reports'} />
			<ProduceList
				title='Produce Reports Categories'
				// sectionClass='section-b-space'
				categories={categories}
				type='report'
				bg='#021A49'
				itemHeight={60}
			/>
			{isAuth ? (
				<ReportsAllList reports={reports} imgMaxWidth={280} noSubtitle={true} />
			) : (
				<div className='d-flex flex-column align-items-center' style={{ paddingBottom: 100 }}>
					<h3 className='mt-5 text-center'>Please login to view the reports.</h3>
					<br />
					<button
						className='btn btn-solid btn-default-plan btn-post btn-sm'
						onClick={() => {
							onTarget(window.location.pathname)
							onAuthModalsTriggered('login')
						}}
					>
						<i className='fa fa-sign-in' aria-hidden='true'></i> Login
					</button>
				</div>
			)}
		</CommonLayout>
	)
}

export default Reports

export async function getServerSideProps() {
	const categories = await getCategories()
	const reports = await listReports('1')
	const banner = await getBanner()

	return {
		props: {
			categories,
			reports,
			banner,
		},
	}
}
