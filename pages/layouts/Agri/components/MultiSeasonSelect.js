import React from 'react'
import Multiselect from 'multiselect-react-dropdown'
import { seasonOptions } from '../../../../services/constants'

const MultiSeasonSelect = ({ selectedValues, onSelected, onRemoved, placeholder }) => {
	return (
		<Multiselect
			isObject={false}
			showCheckbox
			options={seasonOptions}
			selectedValues={selectedValues}
			hidePlaceholder={placeholder ? false : true}
			placeholder={placeholder}
			avoidHighlightFirstOption
			style={{
				searchBox: {
					maxHeight: '40px',
					overflowY: 'auto',
					background: '#007bff',
					color: 'white',
				},
				option: {
					height: '30px',
					paddingTop: '2px',
					width: '100%',
				},
				optionContainer: {
					opacity: 1,
					background: 'white',
				},
			}}
			onSelect={onSelected}
			onRemove={onRemoved}
		/>
	)
}

export default MultiSeasonSelect
