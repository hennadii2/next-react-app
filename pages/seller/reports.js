import React, { useContext, useState } from 'react'
import moment from 'moment'
import { withIronSession } from 'next-iron-session'
import { useRouter } from 'next/router'
import CommonLayout from '../../components/layout/common-layout'
import NoData from '../layouts/Agri/components/NoData/NoData'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import Reports from '../layouts/Agri/components/seller/SellerReports'
import Breadcrumb from '../../components/common/breadcrumb'
import ReportSellerModal from '../../components/modals/ReportSeller'
import { listReports } from '../../helpers/lib'
import DeleteModal from '../../components/modals/ConfirmModal'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import getConfig from 'next/config'
import { AuthContext } from '../../helpers/auth/AuthContext'
import vars from '../../helpers/utils/vars'
import { isEmpty } from '../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const MyReports = ({ reportsForSeller }) => {
	const authContext = useContext(AuthContext)
	const isAuthenticated = authContext.isAuthenticated
	const user = authContext.user
	const onAuthModalsTriggered = authContext.onAuthModalsTriggered

	const router = useRouter()

	const [caption, setCaption] = useState('')
	const [showReportAddModal, setReportAddModal] = useState(false)
	const [selectedReport, setSelectedReport] = useState(null)

	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleCreate = () => {
		setCaption('Add New Report')
		setReportAddModal(!showReportAddModal)
		setSelectedReport(null)
	}

	const handleEdit = (report) => {
		setCaption('Edit Report')
		setReportAddModal(!showReportAddModal)
		setSelectedReport(report)
	}

	const handleDelete = (report) => {
		setSelectedReport(report)
		setShowDeleteModal(true)
	}

	const deleteConfirm = async () => {
		setShowDeleteModal(!showDeleteModal)

		let formData = getFormClient()
		formData.append('api_method', 'delete_reports')
		formData.append('_id', selectedReport.numeric_id)
		formData.append('user_id', user._id)
		formData.append('session_id', user.session_id)

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				router.reload()
			} else if (response.data.error) {
				alert(response.data.message)
			}
		} catch (err) {
			alert(err.toString())
		}
	}

	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='My Reports' description='Seller Panel' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					{!reportsForSeller?.length ? (
						<Col sm='12'>
							<NoData
								description='You have not added a report yet, lets get started!'
								createLabel='Create New Report'
								onCreate={handleCreate}
							/>
						</Col>
					) : (
						<Col sm='12'>
							<Card>
								<CardHeader>
									<div>
										<div>{vars.sellerRTitle}</div>
										<div className='pull-right'>
											<button onClick={handleCreate} className='btn btn-solid btn-default-plan btn-post'>
												{/* <i className='fa fa-plus-circle' aria-hidden='true'></i> */}
												Add New Report
											</button>
										</div>
									</div>
								</CardHeader>
								<CardBody>
									<Reports reportsForSeller={reportsForSeller} onEdit={handleEdit} onDelete={handleDelete} />
								</CardBody>
							</Card>
						</Col>
					)}
				</Row>
			</Container>
			<ReportSellerModal
				reportsForSeller={reportsForSeller}
				modal={showReportAddModal}
				onToggle={(showReportAddModal) => setReportAddModal(!showReportAddModal)}
				caption={caption}
				selectedReport={selectedReport}
			/>
			<DeleteModal
				modal={showDeleteModal}
				toggle={(showDeleteModal) => setShowDeleteModal(!showDeleteModal)}
				onConfirm={deleteConfirm}
				caption='Delete Report'
				message='Are you sure to delete current report?'
			/>
		</CommonLayout>
	)
}

export default MyReports

export const getServerSideProps = withIronSession(
	async ({ req, res }) => {
		const user = req.session.get('user')

		if (!user) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}

		const reportsForSeller = await listReports('1', null, null, user.user._id)

		return {
			props: {
				reportsForSeller,
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
