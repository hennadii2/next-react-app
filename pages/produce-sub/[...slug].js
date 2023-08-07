import React from 'react'
import CommonLayout from '../../components/layout/common-layout'
import ProduceBanner from '../layouts/Agri/components/ProduceBanner'
import ProduceList from '../layouts/Agri/components/ProduceList'
import AdSpaceSquareProduce from '../layouts/Agri/components/AdSpaceSquareProduce'
import AdSpaceProduce from '../layouts/Agri/components/AdSpaceProduce'
import SellersSpaceSmall from '../layouts/Agri/components/SellersSpaceSmall'
import ReportSpace from '../layouts/Agri/components/ReportSpace'
import ProduceMap from '../layouts/Agri/components/ProduceMap'
import {
	listProduceTypes,
	getProduceTypes,
	getSellers,
	listReports,
	listAdverts,
	listUsersProduce,
} from '../../helpers/lib'
import getConfig from 'next/config'

// const { publicRuntimeConfig } = getConfig()
// const MAPBOX_TOKEN = `${publicRuntimeConfig.MAPBOX_TOKEN}`

const Produce = ({ produceData, produceTypes, premiumAdverts, planAdverts, reports, sellers, sellerProduces, produceSubCatId }) => {
	const tags = produceTypes.filter(
		(produceType) => produceType.refers_toISbb_agrix_produce_typesID === produceData.numeric_id
	)
	const categories = produceTypes.filter((produceType) => produceType.refers_toISbb_agrix_produce_typesID === null)

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

	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<ProduceBanner
				produceData={produceData}
				tags={tags}
				sellers={sellers}
				sellerProduces={sellerProduces}
				type='sub'
			/>
			<ProduceList sectionClass='small-section' itemHeight={60} bg='#021A49' categories={categories} type='produce' />
			<ProduceMap produceData={produceData} categories={categories} produceSubCatId={produceSubCatId}/>
			<div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
				<div className='mx-3' style={{ width: '100%', maxWidth: 1000 }}>
					<AdSpaceSquareProduce
						caption={'Featured Premium Adverts'}
						description=''
						premiumAdverts={activePremiumAdverts}
					/>
					<ReportSpace reports={reports} imgMaxWidth={280} size='normal' />
					<AdSpaceProduce
						caption={`Recent ${produceData ? produceData.name : ''} Adverts`}
						description=''
						sectionClass='slick-15 pt-0'
						planAdverts={activePlanAdverts}
					/>
				</div>
			</div>
			<SellersSpaceSmall
				caption={produceData ? produceData.name : ''}
				description='Seller'
				sectionClass='ratio_45 pt-0 mx-4'
				sellers={sellers}
				sellerProduces={sellerProduces}
			/>
		</CommonLayout>
	)
}

export default Produce

// export async function getStaticPaths() {
//     let produces = await listProduceTypes()
//     let paths = []
//     for (let produce of produces) {
//         if (produce.refers_toISbb_agrix_produce_typesID !== null) {
//             paths.push({ params: { id: produce.numeric_id }})
//         }
//     }

//     return {
//         paths,
//         fallback: false
//     }
// }

export async function getServerSideProps({ params }) {
	const slug = params.slug
	const produceSubCatId = slug[0]
	const produceData = await getProduceTypes(produceSubCatId)
	const produceTypes = await listProduceTypes()
	const premiumAdverts = await listAdverts('positionISbb_agrix_adverts_positionsID', null, null, '1', 'RAND()')
	const planAdverts = await listAdverts('produce_categoryISbb_agrix_produce_typesID', null, produceSubCatId, '2')
	const reports = await listReports('1', null, produceSubCatId)
	const sellers = await getSellers()
	const sellerProduces = await listUsersProduce('1', null, produceSubCatId)

	return {
		props: {
			produceData,
			produceTypes,
			premiumAdverts,
			planAdverts,
			reports,
			sellers,
			sellerProduces,
			produceSubCatId,
		},
	}
}
