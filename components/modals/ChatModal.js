import React, { useContext, useEffect, useState } from 'react'
import getConfig from 'next/config'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
//import { Messenger } from '@weavy/uikit-react'
//import { WeavyClient, WeavyProvider } from '@weavy/uikit-react'
import Messenger from './Messenger/Messenger'

import { AuthContext } from '../../helpers/auth/AuthContext'
import { MessengerContext } from '../../helpers/messenger/MessengerContext'
import { noUserText } from '../../services/constants'
import { FaInfoCircle } from 'react-icons/fa'
import vars from '../../helpers/utils/vars'

const { publicRuntimeConfig } = getConfig()

const ChatModal = (props) => {
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const { isShow, onClose, additionalInfo } = props		

	return (
		<Modal isOpen={isShow} toggle={() => onClose(!isShow)} className='modal-xl mt-3' centered>
			<ModalHeader toggle={() => onClose(!isShow)}>Messages</ModalHeader>
			<ModalBody>
				<Messenger additionalInfo={additionalInfo} onClose={() => onClose(!isShow)}/>
			</ModalBody>
		</Modal>
	)
}

export default ChatModal
