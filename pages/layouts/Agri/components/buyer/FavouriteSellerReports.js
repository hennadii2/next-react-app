import React, { Fragment, useContext, useState,useEffect } from 'react'
import getConfig from 'next/config'
import { Container, Row, Col } from 'reactstrap'
import ReportsListSeller from '../../../../../components/modals/ReportsListSeller'
import { getFormClient } from '../../../../../services/constants'
import { post } from '../../../../../services/axios'
import ReportsAllList from '../../../../../pages/layouts/Agri/components/ReportsAllList'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

const FavouriteSellerReports = ({ seller }) => {
	const [reportsModal, setReportsModal] = useState(false)
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
					const results = response.data.list.sort((a, b) => Date.parse(b._dateadded) - Date.parse(a._dateadded))
					const temp = results.filter((r) => r.statusISLIST_Draft_Approved_Declined_Archived === 'Approved')
					if (temp.length > 2) {
						setReports([temp[0], temp[1]])
					} else {
						setReports(temp)
					}
				}
			} catch (err) {
				alert(err.toString())
			}
		}
		getReports()
	}, [])

	
	return (
		<div>
			<Container>
				<ReportsAllList
					reports={reports}
					imgMaxWidth={220}
					noSubtitle={true}
					styles={{ paddingTop: 10 }}
					className='section-b-space ratio_portrait mx-4'
				/>
				
				{reports.length > 2 ? (
					<div className='text-right mt-3 mr-2'>
						<a href='#' onClick={()=> setReportsModal(!reportsModal)} className='btn btn-solid btn-default-plan'>
							See all reports
						</a>
					</div>
				) : null}
			</Container>
			<ReportsListSeller isShow={reportsModal} onToggle={() => setReportsModal(!reportsModal)} seller={seller} />
		</div>
	)
}

export default FavouriteSellerReports
