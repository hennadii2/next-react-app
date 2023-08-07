import React, { useEffect, useState } from 'react'
import getConfig from 'next/config'
import ReportsAllList from '../../pages/layouts/Agri/components/ReportsAllList'
import { getFormClient } from '../../services/constants'
import { post } from '../../services/axios'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import NoData from '../../pages/layouts/Agri/components/NoData/NoData'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`
const apiUrl = `${publicRuntimeConfig.API_URL}`

const ReportsList = ({ seller, isShow, onToggle }) => {
	const [reports, setReports] = useState([])

	useEffect(() => {
		const getReports = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_reports')
			formData.append('get_linked_data', '1')
			formData.append('userISbb_agrix_usersID', seller.numeric_id)

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setReports(response.data.list)
				}
			} catch (err) {
				alert(err.toString())
			}
		}
		getReports()
	}, [])

	return (
		<Modal centered isOpen={isShow} toggle={onToggle} className={`${reports.length === 0 ? '' : 'modal-xl'}`}>
			<ModalHeader toggle={onToggle}>Reports from {seller.company}</ModalHeader>
			<ModalBody className='p-3'>
				{reports.length === 0 ? (
					<NoData description='There is no report created by seller!' createLabel='Close' onCreate={onToggle} />
				) : (
					<ReportsAllList
						reports={reports}
						imgMaxWidth={220}
						noSubtitle={true}
						styles={{ paddingTop: 10 }}
						className='section-b-space ratio_portrait mx-4'
					/>
				)}
			</ModalBody>
		</Modal>
	)
}

export default ReportsList
