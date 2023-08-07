import React from 'react'
import CommonLayout from '../../components/layout/common-layout'
import ProduceBanner from '../layouts/Agri/components/ProduceBanner'
import ReportsAllList from '../layouts/Agri/components/ReportsAllList'
import ProduceList from '../layouts/Agri/components/ProduceList'
import SelectCategory from '../layouts/Agri/components/SelectCategory'
import {
	getProduceTypes,
	listReports,
	getCategories,
	listProduceTypes,
	getSellers,
	listUsersProduce,
} from '../../helpers/lib'

const Reports = ({ categories, reports, produceData, produceTypes, sellers, sellerProduces }) => {
	const tags = produceTypes.filter(
		(produceType) => produceType.refers_toISbb_agrix_produce_typesID === produceData.numeric_id
	)

	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<ProduceBanner produceData={produceData} tags={tags} sellers={sellers} sellerProduces={sellerProduces} />
			<ProduceList sectionClass='small-section' itemHeight={60} categories={categories} type='report' />
			<ReportsAllList reports={reports} imgMaxWidth={280} />
		</CommonLayout>
	)
}

export default Reports

export async function getServerSideProps({ params }) {
	const produceData = await getProduceTypes(params.id)
	const categories = await getCategories()
	const reports = await listReports('1', null, params.id)
	const produceTypes = await listProduceTypes()
	const sellers = await getSellers()
	const sellerProduces = await listUsersProduce('1', null, params.id)

	return {
		props: {
			produceData,
			categories,
			reports,
			produceTypes,
			sellers,
			sellerProduces,
		},
	}
}
