import React from 'react'
import CommonLayout from '../../components/layout/common-layout'
import ProduceBanner from '../layouts/Agri/components/ProduceBanner'
import ReportsAllList from '../layouts/Agri/components/ReportsAllList'
import ProduceList from '../layouts/Agri/components/ProduceList'
import SelectCategory from '../layouts/Agri/components/SelectCategory'
import { getProduceTypes, listReports, getCategories, getSellers, listUsersProduce } from '../../helpers/lib'

const Reports = ({ categories, reports, produceData, sellers, sellerProduces }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<ProduceBanner produceData={produceData} tags={null} sellers={sellers} sellerProduces={sellerProduces} />
			<ProduceList
				sectionClass='small-section'
				title='Produce Report Categories'
				itemHeight={60}
				categories={categories}
				type='report'
				bg='#021A49'
			/>
			{/* <SelectCategory produceData={produceData} type='report' /> */}
			<ReportsAllList
				reports={reports}
				imgMaxWidth={280}
				noSubtitle={true}
				className='mx-4 pb-5'
				styles={{ marginTop: 10 }}
			/>
		</CommonLayout>
	)
}

export default Reports

export async function getServerSideProps({ params }) {
	const slug = params.slug
	const id = slug[0]
	const produceData = await getProduceTypes(id)
	const categories = await getCategories()
	const reports = await listReports('1', id)
	const sellers = await getSellers()
	const sellerProduces = await listUsersProduce('1', id)

	return {
		props: {
			produceData,
			categories,
			reports,
			sellers,
			sellerProduces,
		},
	}
}
