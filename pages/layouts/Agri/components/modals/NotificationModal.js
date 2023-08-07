import React, { useState, useContext } from 'react'
import { Modal, ModalHeader, ModalBody, Table, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import getConfig from 'next/config'

import { Td, Th, Tr } from '../DashboardPlan'
import SettingContext from '../../../../../helpers/theme-setting/SettingContext'
import { Row } from 'antd-grid-layout'
import { getFormClient } from '../../../../../services/constants'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import { post } from '../../../../../services/axios'
import vars from '../../../../../helpers/utils/vars'
import { FaInfoCircle } from 'react-icons/fa'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const somethingWrong = (msg) => {
	toast.error(msg || 'Something went wrong!', {
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
	})
}

const Notifications = ({ modal, toggle }) => {
	const settingsContext = useContext(SettingContext)
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const notificationList = settingsContext?.appData?.__notifications || []
	const [loading, setLoading] = useState(false)
	// console.log(notificationList)

	const markAllRead = async () => {
		setLoading(true)

		let formData = getFormClient()
		formData.append('api_method', 'mark_alerts_as_read')
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)

		try {
			const response = await post(apiUrl, formData)
			console.log(response.data)
			if (response.data.message === 'SUCCESS') {
				settingsContext.updateAppData({ __notifications: [] })
				toggle()
			} else if (response.data.error) {
				somethingWrong(response.data.message)
			}
		} catch (err) {
			somethingWrong(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<div id='notification'>
				<Modal
					size='large'
					contentClassName='modal-price'
					modalClassName='modalPrice'
					centered
					isOpen={modal}
					style={{ minWidth: '80%' }}
					className='modal-lg'
				>
					<div>
						<ModalHeader toggle={toggle}>Notifications</ModalHeader>
						<ModalBody className='p-3'>
							{notificationList.length === 0 ? (
								<>
									<h2 className='text-center mt-3'>
										<FaInfoCircle color={vars.secondaryColor} />
									</h2>
									<h3 className='mb-5 mt-3 text-center'>You don't have any notifications.</h3>
								</>
							) : (
								<>
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
													<Th style={{ borderTopLeftRadius: 5 }}>Notification</Th>
													<Th>From</Th>
													<Th style={{ borderTopRightRadius: 5 }}>Date-Time</Th>
												</Tr>
											</thead>
											<tbody>
												{notificationList.map((item, i) => {
													const { from_userISbb_agrix_usersID: fromId, from_user_name } = item
													return (
														<tr key={item._id}>
															<Td>
																{item.msgISsmallplaintextbox}
																{item.button_name && item.button_url && (
																	<a href={item.button_url} target={'_blank'} style={{ marginTop: 20, width: 130, display: 'block' }}>
																		<span style={{ borderStyle: "solid", borderWidth: 1, borderColor:'red', color: 'red', backgroundColor: "#fff", padding: '5px 10px', borderRadius: 20}}>{item.button_name}</span>
																	</a>																	
																)}
																
															</Td>
															<Td>
																{fromId === null || fromId === 0 || fromId === '0'
																	? 'Agrixchange Admin'
																	: from_user_name}
															</Td>
															<Td>{item._dateadded}</Td>
														</tr>
													)
												})}
											</tbody>
										</Table>
									</div>

									<Row justify='center' className='mt-4'>
										<Button onClick={() => markAllRead()} disabled={loading}>
											{loading ? 'Processing...' : 'Mark As Read'}
										</Button>
									</Row>
								</>
							)}
						</ModalBody>
					</div>
				</Modal>
			</div>
		</div>
	)
}

export default Notifications
