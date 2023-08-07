import React, { useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import getConfig from 'next/config'
import CloseModalBtn from '../../helpers/utils/CloseModalBtn'
import SearchHeader from '../headers/seller/searchHeader'
import SearchOverlay from './SearchOverlayModal'

const SearchModal = (props) => {
	const { isShow, onToggle } = props

	const onSearched = (args) => {
		setSearchParams(args)
		setSearchModalShow(true)
	}

	const [searchModalShow, setSearchModalShow] = useState(false)
	const [searchParams, setSearchParams] = useState({
		searchText: '',
		id: '',
		country: '',
	})

	return (
		<>
			<Modal centered isOpen={isShow} toggle={() => onToggle(!isShow)} style={{ marginTop: 15 }}>
				<CloseModalBtn
					onClick={() => onToggle(!isShow)}
					styles={{ backgroundColor: 'transparent', zIndex: 9, right: 10, top: 10 }}
					iconProps={{ color: 'gray' }}
				/>
				<ModalBody className='px-2 pt-2 show-grid custom-grid'>
					<h4 className='section-title text-center mt-4-5' style={{ fontWeight: '500', fontSize: 22 }}>
						Search
					</h4>
					<section className='ratio_45 section-b-space'>
						<SearchHeader
							onSearch={onSearched}
							searchFieldCustomStyles={{ border: '1px solid #ccc', borderRadius: 4 }}
							asModal={true}
						/>
					</section>
				</ModalBody>
			</Modal>
			<SearchOverlay
				isShow={searchModalShow}
				onToggle={() => setSearchModalShow(!searchModalShow)}
				searchParams={searchParams}
			/>
		</>
	)
}

export default SearchModal
