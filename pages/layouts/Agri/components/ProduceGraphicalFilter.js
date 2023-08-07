import React, { useState, useEffect } from 'react'
import { Col, Input, Row, Label } from 'reactstrap'
import Select from 'react-select'

const maxFilterTagsLength = 4
const ProduceGraphicalFilter = ({ initialValue, usersProduce, onFilter }) => {
	// console.log('-----------initialValue', initialValue);
	let produceTemplates = []
	for (let prod1 of usersProduce) {
		const same_produces = usersProduce.filter(
			(pd) => pd.produce_sub_categoryISbb_agrix_produce_typesID === prod1.produce_sub_categoryISbb_agrix_produce_typesID
		)
		// console.log('--------same_produces', prod1, same_produces);
		const tags = same_produces.map((sp) =>
			Object.assign(
				{},
				{
					numeric_id: sp.numeric_id,
					value: sp.numeric_id,
					label: sp.produce_typeISbb_agrix_produce_typesID_data
					? sp.produce_typeISbb_agrix_produce_typesID_data.name
					: sp.produce_sub_categoryISbb_agrix_produce_typesID,
					tag_name: sp.produce_typeISbb_agrix_produce_typesID_data
						? sp.produce_typeISbb_agrix_produce_typesID_data.name
						: '',
				}
			)
		)
		const item = {
			produce: {
				numeric_id: prod1.produce_sub_categoryISbb_agrix_produce_typesID,
				name: prod1.produce_sub_categoryISbb_agrix_produce_typesID_data
					? prod1.produce_sub_categoryISbb_agrix_produce_typesID_data.name
					: '',
			},
			tags: tags,
		}

		const template = produceTemplates.find((pt) => pt.produce.name === item.produce.name)
		if (!template) produceTemplates.push(item)
	}

	const [produce, setProduce] = useState('')
	const [tag, setTag] = useState('')
	const [tagOptions, setTagOptions] = useState([])

	const produceOptions = produceTemplates.map((item) => ({
		label: item.produce.name,
		value: item.produce.numeric_id,
	}))


	const onProduceChanged = (produce) => {
		console.log(produce)
		setProduce(produce)
		if (!produce) {
			//onFilter(produce)
			return
		}
		const produceTemplate = produceTemplates.find((pt) => pt.produce.numeric_id === produce)
		if (produceTemplate) {
			const produceTags = produceTemplate.tags
			setTagOptions(produceTags)
			onTagChanged(produceTags[0].value)
		} else {
			return
		}

		//onFilter(produce)
	}


	const onTagChanged = (val) => {		
		// console.log(val)
		setTag(val);
		onFilter(val)
	}

	useEffect(() => {
		//onFilter(selectedTagData)
	}, [tag])

	const setupInit = val => {
		if (!val) {
			return
		}

		const sP = usersProduce.find(p => p.numeric_id === val);
		onProduceChanged(sP.produce_sub_categoryISbb_agrix_produce_typesID);

	};

	React.useEffect(() => {
		initialValue && setupInit(initialValue)
	}, [])

	return (
		<form className='needs-validation' style={{ background: 'white' }}>
			<Row className='pt-5 pb-3'>
				<Col md='2 d-flex justify-content-end'>
					<Label style={{ fontSize: 16, marginTop: 5 }}>Filter Produce:</Label>
				</Col>
				<Col md='3'>
					<Select
						className={`w-100`}
						style={{ height: 38, borderColor: '#ced4da' }}
						options={produceOptions}
						placeholder='Select produce'
						name='produce'
						value={produce}
						onChange={(val) => {
							onProduceChanged(val?.value)
						}}
						menuPortalTarget={document.body}
					/>
				</Col>
				<Col md='3'>
					<Select
						className={`w-100`}
						style={{ height: 38, borderColor: '#ced4da' }}
						options={tagOptions}
						placeholder='Select tag'
						name='tag'
						value={tag}
						onChange={(val) => {
							onTagChanged(val?.value)
						}}
						menuPortalTarget={document.body}
					/>
				</Col>
			</Row>
		</form>
	)
}

export default ProduceGraphicalFilter
