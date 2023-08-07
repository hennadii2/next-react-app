import React, { Fragment, useState, useEffect } from 'react'
import { Container, Media, ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import getConfig from 'next/config'
import ReportDetailSeller from '../../../../components/modals/ReportDetailSeller'
import { MasterReport } from './ReportSpace'
import { Row, Col } from 'antd-grid-layout'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const ReportSpace = ({
	reports: _reports,
	imgMaxWidth,
	noSubtitle = false,
	styles = {},
	className = 'section-b-space ratio_portrait mx-4 mt-4',
}) => {
	const reports = _reports.filter((r) => r.statusISLIST_Draft_Approved_Declined_Archived === 'Approved')

	return (
		<section id='report' className={className} style={styles}>
			<Container>
				<h4 className='section-title mb-4 text-center'>Recent Seller Reports</h4>
				{!noSubtitle && (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<p className='mb-4-5 text-center' style={{ maxWidth: 800 }}>
							See our most recent seller reports below, click “see more “to view all seller reports and filter by
							produce category.
						</p>
					</div>
				)}
				<Row gutter={[30, 18]}>
					{reports.map((report) => (
						<Col span={24} md={12} key={report._id}>
							<MasterReport report={report} imgMaxWidth={imgMaxWidth} wrapperStyles={{ margin: 0, padding: 20 }} />
						</Col>
					))}
				</Row>
			</Container>
		</section>
	)
}

export default ReportSpace
