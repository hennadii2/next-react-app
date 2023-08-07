import React from 'react'
import { MdOutlineClose } from 'react-icons/md'

function CloseModalBtn({ onClick, styles = {}, iconProps = {} }) {
	return (
		<div
			onClick={onClick}
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: 25,
				width: 25,
				borderRadius: '50%',
				backgroundColor: 'gray',
				position: 'absolute',
				right: 15,
				cursor: 'pointer',
				zIndex: 9,
				...styles,
			}}
		>
			<MdOutlineClose color='#fff' size={16} {...iconProps} />
		</div>
	)
}

export default CloseModalBtn
