import React, { useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Table, Button, Container } from 'reactstrap'
import { AuthContext } from '../../../../helpers/auth/AuthContext'
import styled from 'styled-components'
import vars from '../../../../helpers/utils/vars'
import { isEmpty } from '../../../../helpers/utils/helpers'

export const getColorStyles = (membership = '') => {
	const _membership = membership.toLowerCase()
	switch (_membership) {
		case 'diamond':
			return { backgroundColor: '#b9f2ff', color: '#00bcd4' }
		case 'platinum':
			return { backgroundColor: '#E5E4E2', color: '#607d8b' }

		default:
			return { backgroundColor: _membership, color: '#fff' }
	}
}

const DashboardPlan = ({ membershipTypes }) => {
	const router = useRouter()
	const authContext = useContext(AuthContext)
	const user = authContext.user

	const goToMyPlan = () => {
		if (user.role === 'seller') {
			router.push({
				pathname: '/seller/account',
				query: { active: 'plan' },
			})
		} else if (user.role === 'buyer') {
			router.push({
				pathname: '/buyer/account',
				query: { active: 'plan' },
			})
		}
	}

	const userMembershipTypeId = user.membershipISbb_agrix_membership_typesID
	const activeMembership = membershipTypes.find((membership) => membership._id === userMembershipTypeId)
	const { subs } = user

	const yearAmount = useMemo(() => {
		if (!activeMembership || !subs || !subs.cycle_period) {
			return ''
		}
		let result = parseFloat(activeMembership?.membership_year_priceNUM).toFixed(2)
		if (subs.cycle_period !== 'Yearly') {
			result = parseFloat(activeMembership?.membership_month_priceNUM * 12).toFixed(2)
		}
		return result
	}, [activeMembership, subs])

	if (isEmpty(subs)) {
		return (
			<h4 className='f-w-600 mb-4 dashboard-title' style={{ color: 'red' }}>
				Malformed data found. No user.subs info available.
			</h4>
		)
	}

	return (
		<Container className='attribute-blocks mb-4-5'>
			<h4 className='f-w-600 mb-4 dashboard-title'>Current Subscription Plan</h4>
			<div
				style={{
					backgroundColor: '#fff',
					borderRadius: 5,
					boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
				}}
			>
				<Table responsive style={{ marginBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
					<thead style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
						<Tr style={{ backgroundColor: vars.blackColor }}>
							<Th style={{ borderTopLeftRadius: 5 }}>Plan</Th>
							<Th>Price</Th>
							<Th>Per</Th>
							<Th>Total Price Per Year</Th>
							<Th>Renewal Date</Th>
							<Th style={{ borderTopRightRadius: 5 }}></Th>
						</Tr>
					</thead>
					<tbody>
						<tr>
							<Td>
								<div
									style={{
										padding: '8px 15px',
										borderRadius: 25,
										maxWidth: 'fit-content',
										...getColorStyles(subs.membership_type),
									}}
								>
									{subs.membership_type}
								</div>
							</Td>
							<Td>{parseFloat(subs.list_price).toFixed(2)}</Td>
							<Td>{subs.cycle_period}</Td>
							<Td>{yearAmount}</Td>
							<Td>{subs.to_date}</Td>
							<Td className='d-flex justify-content-center'>
								<button className='btn btn-post btn-solid btn-default-plan mr-2' onClick={goToMyPlan}>
									Upgrade
								</button>
								<Button onClick={goToMyPlan}>View all plans</Button>
							</Td>
						</tr>
					</tbody>
				</Table>
			</div>
		</Container>
	)
}

export default DashboardPlan

export const Tr = styled.tr`
	background-color: ${vars.primaryColor};
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
`
export const Th = styled.th`
	border-top: none !important;
	border-bottom: none !important;
	color: #fff;
`
export const Td = styled.td`
	vertical-align: middle !important;
	font-weight: 500;
`
