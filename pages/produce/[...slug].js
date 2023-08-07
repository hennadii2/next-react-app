import React, { useContext } from 'react'
import CommonLayout from '../../components/layout/common-layout'
import { Container, Tooltip } from 'reactstrap'

import ProduceBanner from '../layouts/Agri/components/ProduceBanner'
import ProduceList from '../layouts/Agri/components/ProduceList'
import AdSpaceSquare from '../layouts/Agri/components/AdSpaceSquare'
import AdSpaceSmall from '../layouts/Agri/components/AdSpaceSmall'
import SellersSpaceSmall from '../layouts/Agri/components/SellersSpaceSmall'
import SelectCategory from '../layouts/Agri/components/SelectCategory'
import ReportSpace from '../layouts/Agri/components/ReportSpace'
import {
	getCategories,
	getProduceTypes,
	getSellers,
	listReports,
	listAdverts,
	listUsersProduce,
} from '../../helpers/lib'
import { useMediaQuery } from 'react-responsive'
import { Row, Col } from 'antd-grid-layout'
import vars from '../../helpers/utils/vars'
import { AuthContext } from '../../helpers/auth/AuthContext'

const Produce = ({ produceData, categories, premiumAdverts, planAdverts, reports, sellerProduces, sellers }) => {
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

	const authContext = useContext(AuthContext)
	const isAuth = authContext.isAuthenticated
	const isTabletOrMobile = useMediaQuery({ query: vars.MEDIA_QUERIES.TABLET_MOBILE })

	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<ProduceBanner produceData={produceData} tags={null} sellers={sellers} sellerProduces={sellerProduces} />
			<ProduceList sectionClass='small-section' bg='#021A49' itemHeight={60} categories={categories} type='produce' />
			<Container>
				<Row gutter={[20, 20]}>
					<Col span={24} md={19}>
						<div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
							<div className='mx-3' style={{ width: '100%', maxWidth: 1000 }}>
								<AdSpaceSquare
									caption={'Featured Premium Adverts'}
									description=''
									premiumAdverts={activePremiumAdverts}
								/>
								<ReportSpace
									cardHeight={345}
									reports={reports}
									imgMaxWidth={280}
									size='normal'
									wrapperClassName='mt-2'
								/>
								<AdSpaceSmall
									caption={`Recent ${produceData ? produceData.name : ''} Adverts`}
									description=''
									sectionClass='slick-15 pt-0'
									planAdverts={activePlanAdverts}
								/>
								<SellersSpaceSmall
									onlyContent={true}
									caption={produceData ? produceData.name : ''}
									description='Seller'
									sectionClass={isTabletOrMobile ? `ratio_45 pt-3 w-100` : `ratio_45 pt-3 mx-3 mb-4-5 w-100`}
									sellers={sellers}
									sellerProduces={sellerProduces}
								/>
							</div>
						</div>
					</Col>
					<Col span={24} md={5}>
						<div
							style={
								isTabletOrMobile
									? { marginBottom: '2rem' }
									: { position: 'sticky', top: vars.authHeaderSize + (isAuth ? 30 : 70) }
							}
						>
							<SelectCategory
								produceData={produceData}
								type='produce'
								title={`${produceData?.name || ''} Sub-categories`}
								isTabletOrMobile={isTabletOrMobile}
							/>
						</div>
					</Col>
				</Row>
			</Container>
		</CommonLayout>
	)
}

export default Produce

// export async function getStaticPaths() {
//     const categories = await getCategories()
//     const paths = categories.map(category=>{
//         return ({params: { id: category.numeric_id }})
//     })

//     return {
//         paths,
//         fallback: false
//     }
// }

export async function getServerSideProps({ params }) {
	const slug = params.slug
	const id = slug[0]
	const produceData = await getProduceTypes(id)
	const categories = await getCategories()
	const premiumAdverts = await listAdverts('positionISbb_agrix_adverts_positionsID', null, null, '1', 'RAND()')
	const planAdverts = await listAdverts('produce_categoryISbb_agrix_produce_typesID', id, null, '2')
	const reports = await listReports('1', id)
	const sellerProduces = await listUsersProduce('1', id)
	const sellers = await getSellers()

	return {
		props: {
			produceData,
			categories,
			premiumAdverts,
			planAdverts,
			reports,
			sellerProduces,
			sellers,
		},
	}
}
