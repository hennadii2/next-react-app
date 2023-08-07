import React, { useState, useContext, useEffect } from 'react'
import { Modal, ModalBody, Button } from 'reactstrap'
import SettingContext from '../../helpers/theme-setting/SettingContext'
import { AuthContext } from '../../helpers/auth/AuthContext'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import { Row, Col } from 'antd-grid-layout'
import { isEmpty } from '../../helpers/utils/helpers'
import { renderMembershipInfo } from '../../pages/layouts/Agri/components/seller/SellerAccountPlan'

const MembershipModal = (props) => {
	const { isShow, onClose, onGoBack, userTypeId, additionalInfo } = props

	const authContext = useContext(AuthContext)	
	const isAuthenticated = authContext.isAuthenticated
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered
	const user = authContext?.user

	const settingContext = useContext(SettingContext)
	const selectedRole = additionalInfo?.membership?.name?.toLowerCase?.() || ''
	let planTypes =
		settingContext.appData?.membership_types?.filter?.((item) => {
			if (item.code?.toLowerCase?.() === selectedRole) {
				return true
			}
			return false
		}) || []
	planTypes.sort((a, b) => parseFloat(a.membership_month_priceNUM) - parseFloat(b.membership_month_priceNUM))

	const userTypes = settingContext.appData.users_types
	const userType = userTypes.find((t) => t._id === userTypeId)

	const onMembershipClicked = (type) => {
		if (user?.isAuthenticated) {
			onAuthModalsTriggered('MembershipChange', type._id, type)
		} else {
			if (type.name === 'Blue') {
				onAuthModalsTriggered('register', type._id, type)
			} else {
				onAuthModalsTriggered('subscribe', type._id, type)
			}
		}
	}

	return (
		<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-xl mt-3' centered>
			<ModalBody style={{ paddingBottom: '2.3rem' }}>
				<div onClick={() => onGoBack()} className='go-back'>Go back</div>
				<CloseModalBtn
					onClick={() => onClose(!isShow)}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
				<h2 className='custom-title text-center mt-5' style={{ textTransform: 'capitalize' }}>
					{userType?.name} Subscription Plans
				</h2>
				{(!isAuthenticated) && (
					<div>
						<p className='text-center mt-4' style={{ fontSize: 16, color: '#000'}}>
							First month <span style={{ fontSize: 18, fontWeight: '700', color: '#20963d'}}>free</span> on all subscriptions
						</p>
						<p className='text-center' style={{ fontSize: 16, color: '#000'}}>
							Select one below to get started
						</p>
					</div>
				)}
				
				<div className='mx-5 mt-4-5'>
					<Row gutter={[20, 20]} justify='space-between'>
						{planTypes.map((type, mainIndex) => {
							if (type.code?.toLowerCase?.() !== selectedRole) return null
							const isPopular = type.name?.toLowerCase().includes('platinum')
							const amount = (Math.round(parseFloat(type.membership_month_priceNUM) * 100) / 100).toFixed(2)
							return (
								<Col span={24} md={6} key={mainIndex}>
									<div
										className='p-4'
										style={{
											position: 'relative',
											borderRadius: 5,
											backgroundColor: '#fff',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
										}}
									>
										{isPopular && <div className='custom-badge custom-badge-top custom-badge-dark'>MOST POPULAR</div>}
										<h4 style={{ fontSize: 24, marginBottom: 16, fontWeight: 'bold' }}>{type.name}</h4>

										<div style={{ display: 'flex' }}>
											<span style={{ fontSize: '1.15rem' }}>$</span>
											<span style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>{amount}</span>
										</div>

										<span className='text-muted' style={{ fontWeight: '500', fontSize: '1rem', lineHeight: '1.25rem' }}>
											{type.name === 'Blue' ? <>&nbsp;</> : 'Monthly'}
										</span>
										<div className='mb-4 mt-3'>{renderMembershipInfo(type)}</div>
										<button
											className={`btn btn-solid${!isPopular ? '-outline' : ''} btn-default-plan${
												!isPopular ? '-outline' : ''
											} btn-post${!isPopular ? '-outline' : ''}`}
											onClick={() => onMembershipClicked(type)}
										>
											Get {type.name}
										</button>
									</div>
								</Col>
							)
						})}
					</Row>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default MembershipModal
