import React, { useState, Fragment, useContext } from 'react'
import { Table } from 'reactstrap'
import { format } from 'date-fns'
import SettingContext from '../../../../../helpers/theme-setting/SettingContext'
import { Th, Tr, Td } from '../DashboardPlan'

const MyPrice = ({ pricinglogs, producesSeller, produces }) => {
	const settingContext = useContext(SettingContext)

	const packagings = settingContext.appData.produce_packaging
	const sizes = settingContext.appData.produce_sizes

	const formatDate = (dateStr) => {
		const date = dateStr.split(' ')[0]
		const year = parseInt(date.split('-')[0])
		const month = parseInt(date.split('-')[1])
		const day = parseInt(date.split('-')[2])

		return format(new Date(year, month - 1, day), 'dd MMM yyyy')
	}

	return (
		<Fragment>
			<div className='ratio_45' style={{ marginTop: 0 }}>
				<div
					style={{
						backgroundColor: '#fff',
						borderRadius: 5,
						boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
					}}
				>
					<Table responsive style={{ marginBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
						<thead style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
							<Tr style={{ backgroundColor: '#131b28' }}>
								<Th style={{ borderTopLeftRadius: 5 }}>Date Added</Th>
								<Th>Produce</Th>
								<Th>Type</Th>
								<Th>Packaging</Th>
								<Th>Size</Th>
								<Th>Price US$(FOB) / ton</Th>
								<Th>From Date</Th>
								<Th style={{ borderTopRightRadius: 5 }}>To Date</Th>
							</Tr>
						</thead>
						<tbody>
							{pricinglogs.map((log) => {
								const user_produce = producesSeller.find(
									(item) => item.numeric_id === log.produceISbb_agrix_users_produceID
								)
								const produce = produces.find(
									(p) => p.numeric_id === user_produce.produce_sub_categoryISbb_agrix_produce_typesID
								)
								// console.log(log, user_produce, produce)
								const type = produces.find((p) => p.numeric_id === user_produce.produce_typeISbb_agrix_produce_typesID)
								const packaging = packagings.find(
									(p) => p.numeric_id === user_produce.packagingISbb_agrix_produce_packagingID
								)
								const weight = packagings.find(
									(p) => p.numeric_id === user_produce.packaging_weightISbb_agrix_produce_packagingID
								)
								const size = sizes.find((s) => s.numeric_id === user_produce.sizeISbb_agrix_produce_sizesID)
								return (
									<tr key={log._id}>
										<Td>{formatDate(log._datemodified)}</Td>
										<Td>{produce?.name}</Td>
										<Td>{type?.name}</Td>
										<Td>
											{weight ? `${weight?.name}, ` : null}
											{packaging?.name}
										</Td>
										<Td>{size?.name}</Td>
										<Td>{parseFloat(log.priceNUM).toFixed(2)}</Td>
										<Td>{formatDate(log.from_date)}</Td>
										<Td>{formatDate(log.to_date)}</Td>
									</tr>
								)
							})}
						</tbody>
					</Table>
				</div>
			</div>
		</Fragment>
	)
}

export default MyPrice
