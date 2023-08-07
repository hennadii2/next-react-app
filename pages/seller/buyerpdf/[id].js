import React, { useContext, useEffect, useState } from 'react'
import { withIronSession } from 'next-iron-session'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import SettingContext from '../../../helpers/theme-setting/SettingContext'
import getConfig from 'next/config'
import { getSellers, listUsersFavourites } from '../../../helpers/lib'

const styles = StyleSheet.create({
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
		width: 1000,
	},
	header: {
		width: '100%',
		fontSize: 8,
		lineHeight: 1.2,
		marginBottom: 30,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	title: {
		fontSize: 15,
		marginBottom: 6,
		textTransform: 'uppercase',
	},
	logo: {
		marginLeft: 'auto',
		width: 50,
	},
	info: {
		flexDirection: 'row',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 12,
		marginLeft: 5,
		fontWeight: 100,
		textDecoration: 'underline',
	},
	clientInfo: {
		fontSize: 8,
		width: 200,
		paddingRight: 10,
		lineHeight: 1.2,
	},
	email: {
		color: '#0000ff',
		textDecoration: 'underline',
	},
	text: {
		margin: 12,
		fontSize: 14,
		textAlign: 'justify',
		fontFamily: 'Times-Roman',
	},
	table: {
		fontSize: 8,
		marginBottom: 10,
		border: '0.5px solid #808080',
	},
	tableRow: {
		fontSize: 8,
		borderBottom: '0.5px solid #808080',
		flexDirection: 'row',
		minHeight: 15,
	},
	tableColumn: {
		flex: 1,
		padding: '3px 5px',
		borderRight: '0.5px solid #808080',
	},
})

const { publicRuntimeConfig } = getConfig()

// Create Document Component
const BuyerPdf = ({ sellers, usersFavourites }) => {
	const settingContext = useContext(SettingContext)
	const produce_types = settingContext.appData.produce_types
	const produce_sizes = settingContext.appData.produce_sizes
	const produce_packaging = settingContext.appData.produce_packaging
	const produce_farming_method = settingContext.appData.produce_farming_method

	const buyerFollowingProduces = usersFavourites.filter(
		(following) => following.fav_produceISbb_agrix_users_produceID !== null
	)

	const buyerFollowingSellers = usersFavourites.filter((following) => following.fav_userISbb_agrix_usersID !== null)

	return (
		<PDFViewer height={640} width='100%' showToolbar={true}>
			<Document>
				<Page style={styles.body} wrap size='A4'>
					<View style={styles.header}>
						<View>
							<Text style={styles.title}>Buyer Report</Text>
						</View>
					</View>
					<View style={styles.info}>
						<Text style={styles.subtitle}>Produce this buyer is following</Text>
					</View>
					<View style={styles.table}>
						{[
							{
								cells: [
									{ content: 'Produce', textAlign: 'center', width: '20%' },
									{ content: 'Size', textAlign: 'center', width: '20%' },
									{ content: 'Packaging', textAlign: 'center', width: '20%' },
									{
										content: 'Farming Method',
										textAlign: 'center',
										width: '20%',
									},
									{
										content: 'Season(Storage)',
										textAlign: 'center',
										width: '20%',
									},
								],
								backgroundColor: '#dbe5f1',
								textTransform: 'uppercase',
							},
							...buyerFollowingProduces.map((favouriteData) => ({
								cells: [
									{
										content: `${
											produce_types.find(
												(pt) =>
													pt.numeric_id ===
													favouriteData.fav_produceISbb_agrix_users_produceID_data
														.produce_sub_categoryISbb_agrix_produce_typesID
											)?.name
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											produce_sizes.find(
												(ps) =>
													ps.numeric_id ===
													favouriteData.fav_produceISbb_agrix_users_produceID_data.sizeISbb_agrix_produce_sizesID
											)?.name
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											produce_packaging.find(
												(pp) =>
													pp.numeric_id ===
													favouriteData.fav_produceISbb_agrix_users_produceID_data
														.packagingISbb_agrix_produce_packagingID
											)?.name
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											produce_farming_method.find(
												(pf) =>
													pf.numeric_id ===
													favouriteData.fav_produceISbb_agrix_users_produceID_data
														.farming_methodISbb_agrix_produce_farming_methodID
											)?.name
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											favouriteData?.fav_produceISbb_agrix_users_produceID_data?.produce_storage_season
												? JSON.parse(
														favouriteData?.fav_produceISbb_agrix_users_produceID_data?.produce_storage_season
												  ).join(',')
												: ''
										}`,
										width: '20%',
										textAlign: 'center',
									},
								],
							})),
						].map(({ cells, ...rowRestProps }, rowIndex, rowArr) => (
							<View
								key={rowIndex}
								style={[
									styles.tableRow,
									{
										borderBottom: rowIndex === rowArr.length - 1 ? 'none' : null,
										...rowRestProps,
									},
								]}
							>
								{cells.map(({ content, width, ...cellRestProps }, index, cellArr) => (
									<Text
										key={index}
										style={[
											styles.tableColumn,
											{
												borderRight: index === cellArr.length - 1 ? 'none' : null,
												flexBasis: width,
												maxWidth: width,
												...cellRestProps,
											},
										]}
									>
										{content}
									</Text>
								))}
							</View>
						))}
					</View>
					<View style={styles.info}>
						<Text style={styles.subtitle}>Sellers this buyer is following</Text>
					</View>
					<View style={styles.table}>
						{[
							{
								cells: [
									{ content: 'Seller', textAlign: 'center', width: '20%' },
									{ content: 'Email', textAlign: 'center', width: '20%' },
									{ content: 'Phone', textAlign: 'center', width: '20%' },
									{
										content: 'Company',
										textAlign: 'center',
										width: '20%',
									},
									{
										content: 'Location',
										textAlign: 'center',
										width: '20%',
									},
								],
								backgroundColor: '#dbe5f1',
								textTransform: 'uppercase',
							},
							...buyerFollowingSellers.map((followingSeller) => ({
								cells: [
									{
										content: `${
											sellers.find((s) => s.numeric_id === followingSeller.fav_userISbb_agrix_usersID)?.first_name +
											' ' +
											sellers.find((s) => s.numeric_id === followingSeller.fav_userISbb_agrix_usersID)?.last_name
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											sellers.find((s) => s.numeric_id === followingSeller.fav_userISbb_agrix_usersID)?.email
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											sellers.find((s) => s.numeric_id === followingSeller.fav_userISbb_agrix_usersID)?.telephone
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											sellers.find((s) => s.numeric_id === followingSeller.fav_userISbb_agrix_usersID)?.company
										}`,
										width: '20%',
										textAlign: 'center',
									},
									{
										content: `${
											sellers.find((s) => s.numeric_id === followingSeller.fav_userISbb_agrix_usersID)
												?.countryISbb_agrix_countriesID_data?.name
										}`,
										width: '20%',
										textAlign: 'center',
									},
								],
							})),
						].map(({ cells, ...rowRestProps }, rowIndex, rowArr) => (
							<View
								key={rowIndex}
								style={[
									styles.tableRow,
									{
										borderBottom: rowIndex === rowArr.length - 1 ? 'none' : null,
										...rowRestProps,
									},
								]}
							>
								{cells.map(({ content, width, ...cellRestProps }, index, cellArr) => (
									<Text
										key={index}
										style={[
											styles.tableColumn,
											{
												borderRight: index === cellArr.length - 1 ? 'none' : null,
												flexBasis: width,
												maxWidth: width,
												...cellRestProps,
											},
										]}
									>
										{content}
									</Text>
								))}
							</View>
						))}
					</View>
				</Page>
			</Document>
		</PDFViewer>
	)
}

export default BuyerPdf

export const getServerSideProps = withIronSession(
	async ({ params, req, res }) => {
		const buyerId = params.id
		const user = req.session.get('user')

		if (!user) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}

		const sellers = await getSellers()
		const usersFavourites = await listUsersFavourites(buyerId)

		return {
			props: {
				sellers,
				usersFavourites,
			},
		}
	},
	{
		cookieName: process.env.COOKIE_NAME,
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production' ? true : false,
		},
		password: process.env.APPLICATION_SECRET,
	}
)
