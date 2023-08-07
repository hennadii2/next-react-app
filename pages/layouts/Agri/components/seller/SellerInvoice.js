import React, { useState, Fragment, useContext } from 'react'
import { Table } from 'reactstrap'
import { toast } from 'react-toastify'
import { getFormClient, server_domain } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import { Td, Th, Tr } from '../DashboardPlan'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import vars from '../../../../../helpers/utils/vars'
import { format } from 'date-fns'
import NoData from '../NoData/NoData'
import { isEmpty, formatPrice } from '../../../../../helpers/utils/helpers'
import { BsFilePdf } from 'react-icons/bs'

const MyInvoice = ({}) => {
	const [loading, setLoading] = useState(false)
	const [list, setList] = useState([])

	const authContext = useContext(AuthContext)
	const user = authContext.user

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

	const formatDate = (dateModified, dateAdded ) => {
		const dateStr = (dateModified) ? dateModified : dateAdded
		if (!dateStr) return 'Information Unavailable'
		const date = dateStr.split(' ')[0]
		const year = parseInt(date.split('-')[0])
		const month = parseInt(date.split('-')[1])
		const day = parseInt(date.split('-')[2])

		return format(new Date(year, month - 1, day), 'dd MMM yyyy')
	}

	const getData = async () => {
		setLoading(true)

		let formData = getFormClient()
		formData.append('api_method', 'list_membership_log')
		formData.append('userISbb_agrix_usersID', user._id)
		formData.append('get_linked_data', 1)

		try {
			const response = await post(server_domain, formData)
			if (response.data?.message === vars.listEmptyMsg) {
				return setLoading(false)
			}
			if (response.data.message === 'SUCCESS') {
				console.log("response.data?.list", response.data?.list)
				const responseList = response.data?.list || []
				if (responseList.length > 0) {
					const result = responseList.filter(item => (parseFloat(item.amountNUM) > 0))
					setList(result)
				} else {
					setList([])
				}
			} else if (response.data.error) {
				somethingWrong(response.data.message)
			}
		} catch (err) {
			somethingWrong(err.toString())
		} finally {
			setLoading(false)
		}
	}

	React.useEffect(() => {
		getData()
	}, [])

	if (loading) {
		return (
			<div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 200 }}>
				<span className='spinner-border text-success' style={{ fontSize: 22, width: 50, height: 50 }}></span>
				<br />
				<h6>Loading...</h6>
			</div>
		)
	}

	const getType = (_key) => {
		const key = _key ? _key.toLowerCase() : ''
		if (!key) return ''
		if (key.includes('logo')) {
			return 'Logo Design'
		} else if (key.includes('banner')) {
			return 'Banner Design'
		} else if (key.includes('mem')) {
			return 'Membership'
		} else if (key.includes('advert-p')) {
			return 'Premium Advert'
		} else if (key.includes('advert-s')) {
			return 'Standard Advert'
		} else if (key.includes('advertp')) {
			return 'Advert Subscription'
		} else if (key.includes('purch_advert')) {
			return 'Ad Design'
		} else if (key.includes('card-')) {
			return 'Verify Saved Card'
		}  else return _key
	}

	const _map = {}
	list.forEach((item) => {
		_map[item.stripe_payment_ref] = item
	})
	const _list = Object.values(_map)

	const downloadPDF = item => {
		window.open(`/payment/pdf/${item._id}`)
	}

	return (
		<Fragment>
			{isEmpty(_list) && <NoData description={`You don't have any payment history yet.`} />}
			{_list.map((item, index) => {
				// console.log(item)
				return (
					<div
						key={index}
						style={{
							backgroundColor: '#fff',
							borderRadius: 5,
							boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
						}}
						className='mb-3'
					>
						<Table responsive style={{ marginBottom: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
							<thead style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
								<Tr style={{ textAlign: 'center', backgroundColor: '#131b28' }}>
									<Th style={{ borderTopLeftRadius: 5 }}>Date of Payment</Th>
									<Th>Amount Paid</Th>
									<Th>Transaction Type</Th>
									<Th style={{ borderTopRightRadius: 5 }}>Status</Th>
									<Th style={{ borderTopRightRadius: 5 }}>Action</Th>
								</Tr>
							</thead>
							<tbody>
								<tr style={{ textAlign: 'center' }}>
									<Td>{formatDate(item._datemodified, item._dateadded)}</Td>
									<Td>{formatPrice(item.amountNUM)}</Td>
									<Td>{getType(item.code)}</Td>
									<Td className='d-flex justify-content-center'>
										<div
											style={{
												padding: '5px 15px',
												borderRadius: 25,
												maxWidth: 'fit-content',
												backgroundColor: '#20963d3d',
												color: '#20963d',
											}}
										>
											Paid
										</div>
									</Td>
									<Td>
										<span onClick={() =>downloadPDF(item)} style={{cursor: 'pointer'}}>
											<BsFilePdf size={25} />
										</span>
									</Td>
								</tr>
							</tbody>
						</Table>
					</div>
				)
			})}
		</Fragment>
	)
}

export default MyInvoice
