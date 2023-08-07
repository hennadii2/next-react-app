import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getFormClient } from '../../../../services/constants'
import { post } from '../../../../services/axios'
import getConfig from 'next/config'
import Select from 'react-select'
import vars from '../../../../helpers/utils/vars'
import styled from 'styled-components'
import { Row, Col } from 'antd-grid-layout'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

export const cardStyles = {
	borderRadius: 5,
	boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 0px, rgb(0 0 0 / 10%) 0px 0px 1px 0px',
}

const SelectCategory = ({ produceData, type, title = '', isTabletOrMobile }) => {
	const router = useRouter()

	const [subCategories, setSubCategories] = useState([])

	useEffect(() => {
		const getSubCategories = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'list_produce_types')
			formData.append('get_linked_data', '1')
			formData.append('refers_toISbb_agrix_produce_typesID', produceData.numeric_id)

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setSubCategories(response.data.list)
				} else if (response.data.error) {
					alert(response.data.message)
				}
			} catch (err) {
				alert(err.toString())
			}
		}

		getSubCategories()
	}, [produceData])

	useEffect(() => {
		setTimeout(() => {
			document.getElementById('producePageCategorySelect')?.click?.()
		}, 1000)
	}, [])

	const subCategoryOptions = subCategories
		?.map((item) => ({
			label: item.name,
			value: item.numeric_id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const onSubCategoryChanged = (subCategoryId, name) => {
		if (type === 'report') router.push(getValidUrl(`/report-sub/${subCategoryId}`))
		else if (type === 'produce') router.push(getValidUrl(`/produce-sub/${subCategoryId}/${name}`))
	}

	const otherStyles = isTabletOrMobile ? {} : { maxHeight: 400, overflowY: 'scroll' }

	return (
		<>
			{/* <div className={`${type === 'produce' ? 'produce-select-category' : 'report-select-category'}`}>
				<Select
					id='producePageCategorySelect'
					style={{ height: 38, width: 200, borderColor: '#ced4da' }}
					options={subCategoryOptions}
					name='userType'
					width='200px'
					defaultMenuIsOpen={true}
					menuIsOpen={true}
					isClearable={false}
					placeholder={
						<>
							<span style={{ verticalAlign: 'middle' }}>&#xf039;</span>&nbsp;&nbsp;{produceData.name}
						</>
					}
					onChange={(val) => {
						onSubCategoryChanged(val.value)
					}}
					menuPortalTarget={document.body}
				/>
			</div> */}

			<div style={{ ...cardStyles, backgroundColor: '#fff' }} className='p-3'>
				{title && <h4 className='text-center f-w-600 mt-2 mb-3'>{title}</h4>}
				<div style={otherStyles}>
					<Row wrap={true} gutter={[10, 4]}>
						{subCategoryOptions.map((item) => (
							<Col key={item.value}>
								<CatItem
									className='px-3 py-2'
									style={{ ...cardStyles }}
									onClick={() => onSubCategoryChanged(item.value, item.label)}
								>
									{item.label}
								</CatItem>
							</Col>
						))}
					</Row>
				</div>
			</div>
		</>
	)
}

export default SelectCategory

const CatItem = styled.div`
	cursor: pointer;
	border: 1px solid ${vars.secondaryColor};
	background-color: ${vars.secondaryColor};
	color: #fff;
	transition: all 0.3s ease-in-out;
	&:hover {
		background-color: #fff;
		color: ${vars.secondaryColor};
	}
`
