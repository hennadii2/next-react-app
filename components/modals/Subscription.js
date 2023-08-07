import React, { useState, useContext, useEffect } from 'react'
import { Modal, ModalBody, Table } from 'reactstrap'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import { AuthContext } from '../../helpers/auth/AuthContext'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { Th, Tr, Td } from '../../pages/layouts/Agri/components/DashboardPlan'
import vars from '../../helpers/utils/vars'

const SubscriptionModal = (props) => {
	const { isShow, onClose, onGoBack, membershipTypeId, userTypeId, additionalInfo } = props

	const settingContext = useContext(SettingContext)
	const planTypes = settingContext.appData.membership_types
	const planType = planTypes.find((plan) => plan._id === membershipTypeId)

	const authContext = useContext(AuthContext)
	const isAuthenticated = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const onBackClicked = () => {
		if (isAuthenticated) {
			onClose(!isShow)
		} else {
			onAuthModalsTriggered('membership', userTypeId, additionalInfo?.membership || {})
		}
	}

	const onSubscriptionClicked = (period = '', others = {}) => {
		if (isAuthenticated) {
			onAuthModalsTriggered('MembershipChange', membershipTypeId, { period, ...others })
		} else {
			onAuthModalsTriggered('register', membershipTypeId, { period, ...others })
		}
	}

	return (
		<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-lg' centered>
			<ModalBody className='px-4 pb-4'>
				<div className='mt-3'>
					<div onClick={() => onGoBack()} className='go-back'>Go back</div>
					<CloseModalBtn
						onClick={onBackClicked}
						styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
						iconProps={{ color: 'gray' }}
					/>

					<h3 className='text-center my-4' style={{ color: '#342b2b' }}>
						Choose your subscription type below
					</h3>
					{(!isAuthenticated) && (
						<div>
							<p className='text-center mt-4' style={{ fontSize: 16, color: '#000'}}>
								You will get your first month free on all subscriptions and will be charged after 30 days.
							</p>
						</div>
					)}
					<div className='mx-3'>
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
										<Th style={{ borderTopLeftRadius: 5 }}>Plan</Th>
										<Th>Price</Th>
										<Th>Per</Th>
										<Th>Total Price Per Year</Th>
										<Th style={{ borderTopRightRadius: 5 }}>Subscribe</Th>
									</Tr>
								</thead>
								<tbody>
									<tr style={{ textAlign: 'center' }}>
										<Td>{planType?.name} Annual</Td>
										<Td>${parseFloat(planType?.membership_year_priceNUM).toFixed(2)}</Td>
										<Td>Year</Td>
										<Td>
											<div style={{ position: 'relative' }}>
												${parseFloat(planType?.membership_year_priceNUM).toFixed(2)}
												<span
													style={{
														position: 'absolute',
														top: -10,
														right: 'auto',
														padding: '3px 6px',
														backgroundColor: vars.primaryColor,
														borderRadius: 25,
														fontSize: 8,
														color: '#fff',
													}}
												>
													Save
												</span>
											</div>
										</Td>
										<Td>
											<button
												className='btn btn-solid btn-default-plan btn-subscription btn-post btn-sm'
												onClick={() => onSubscriptionClicked('__yearly', planType || {})}
											>
												{/* <i className='fa fa-dollar' aria-hidden='true'></i> */}
												Subscribe now
											</button>
										</Td>
									</tr>
									<tr style={{ textAlign: 'center' }}>
										<Td>{planType?.name} Monthly</Td>
										<Td>${parseFloat(planType?.membership_month_priceNUM).toFixed(2)}</Td>
										<Td>Month</Td>
										<Td>${(parseFloat(planType?.membership_month_priceNUM) * 12).toFixed(2)}</Td>
										<Td>
											<button
												className='btn btn-solid btn-default-plan btn-subscription btn-post btn-sm'
												onClick={() => onSubscriptionClicked('__monthly', planType || {})}
											>
												{/* <i className='fa fa-dollar' aria-hidden='true'></i> */}
												Subscribe now
											</button>
										</Td>
									</tr>
								</tbody>
							</Table>
						</div>
					</div>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default SubscriptionModal
