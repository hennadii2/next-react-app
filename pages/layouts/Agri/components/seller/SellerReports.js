import React, { useState } from 'react'
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from 'reactstrap'
import { format } from 'date-fns'
import { Td, Th, Tr } from '../DashboardPlan'

const greenBadgeStyles = {
	padding: '5px 15px',
	borderRadius: 25,
	maxWidth: 'fit-content',
	backgroundColor: '#20963d3d',
	color: '#20963d',
}

const SellerReports = ({ reportsForSeller, onEdit, onDelete }) => {
	const initOpens = (reportsForSeller && reportsForSeller.length>0) ? reportsForSeller.map((report) => {
		return false
	}) : []
	const [opens, setOpens] = useState(initOpens)

	const onDropdownToggle = (index) => {
		const newOpens = opens.map((open, i) => {
			if (i === index) return !open
			return false
		})
		setOpens(newOpens)
	}

	const formatDate = (dateStr) => {
		const date = dateStr.split(' ')[0]
		const year = parseInt(date.split('-')[0])
		const month = parseInt(date.split('-')[1])
		const day = parseInt(date.split('-')[2])

		return format(new Date(year, month - 1, day), 'dd MMM yyyy')
	}

	return (
		<div
			style={{
				backgroundColor: '#fff',
				borderRadius: 5,
				boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
			}}
		>
			<Table responsive style={{ marginBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
				<thead style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
					<Tr style={{ textAlign: 'center', backgroundColor: '#131b28' }}>
						<Th style={{ borderTopLeftRadius: 5 }}>Date Added</Th>
						<Th>Produce</Th>
						<Th>Title</Th>
						<Th>Location</Th>
						<Th>Status</Th>
						<Th style={{ borderTopRightRadius: 5 }}>Action</Th>
					</Tr>
				</thead>
				<tbody>
					{reportsForSeller.length > 0 && reportsForSeller.map((report, i) => {
						const produceData = report.produce_sub_categoryISbb_agrix_produce_typesID_data
						const produceName = produceData ? produceData.name : ''
						const _status = report.statusISLIST_Draft_Approved_Declined_Archived || ''
						const isPending = _status.toLowerCase().includes('pending')

						return (
							<tr style={{ textAlign: 'center' }} key={report.numeric_id}>
								<Td>{formatDate(report._datemodified)}</Td>
								<Td>{produceName}</Td>
								<Td>{report.name}</Td>
								<Td>
									{(report.countryISbb_agrix_countriesID_data ? report.countryISbb_agrix_countriesID_data.name : '') +
										' ' +
										(report.regionISbb_agrix_countriesID_data ? report.regionISbb_agrix_countriesID_data.name : '') +
										' ' +
										(report.cityISbb_agrix_countriesID_data ? report.cityISbb_agrix_countriesID_data.name : '')}
								</Td>
								<Td>
									{_status && (
										<div className='d-flex justify-content-center'>
											{_status === 'Approved' ? (
												<div style={greenBadgeStyles}>Approved</div>
											) : (
												<div
													style={{
														padding: '5px 15px',
														borderRadius: 25,
														maxWidth: 'fit-content',
														backgroundColor: '#0000002e',
														color: '#000',
													}}
												>
													{_status}
												</div>
											)}
										</div>
									)}
								</Td>
								<Td className='d-flex justify-content-center'>
									<ButtonDropdown
										disabled={isPending}
										isOpen={opens[i]}
										toggle={() => onDropdownToggle(i)}
										direction='left'
										style={isPending ? { opacity: 0.2, pointerEvents: 'none' } : {}}
									>
										<DropdownToggle className='btn btn-solid btn-post border' style={{ borderRadius: 5 }}>
											Select
										</DropdownToggle>
										<DropdownMenu>
											<DropdownItem onClick={() => onEdit(report)}>Edit</DropdownItem>
											{_status === 'Draft' && <DropdownItem onClick={() => onEdit(report)}>Activate</DropdownItem>}
											<DropdownItem onClick={() => onDelete(report)}>Delete</DropdownItem>
										</DropdownMenu>
									</ButtonDropdown>
								</Td>
							</tr>
						)
					})}
				</tbody>
			</Table>
		</div>
	)
}

export default SellerReports
