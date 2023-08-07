import React, { useEffect, useState, useContext } from 'react';
import { Form, FormGroup, Input } from 'reactstrap';
import { Spinner, Label, Container, Button } from 'reactstrap';
import Message from './Message';
import User from './User';
import { MessengerContext } from '../../../helpers/messenger/MessengerContext'
import { AuthContext } from '../../../helpers/auth/AuthContext'
import { contents_url, noUserText, noChatText } from '../../../services/constants'
import { listUsersMessages, updateUsersMessages, addUsersMessages } from '../../../helpers/lib'
import man from "../../../public/assets/images/user.png";

const Messenger = (props) => {

	const {additionalInfo, onClose} = props

	const [text, setText] = useState('')
	const [isContentLoding, setIsContendLoading] = useState(false)
	const [newMessageCount, setNewMessageCount] = useState(0)
	const [isSending, setIsSending] = useState(false)
	const [isNoUser, setIsNoUser] = useState(true)
	const [errorMessage, setErrorMessage] = useState("")

	const authContext = useContext(AuthContext)
	const authUser = authContext.user

	const messengerContext = useContext(MessengerContext)

	const isChatLoaded = messengerContext.isChatLoaded
	const activeUser = messengerContext.activeUser
	const onUser = messengerContext.onUser
	const onChatUsers = messengerContext.onChatUsers
	const chatUsers = messengerContext.chatUsers
	const onActiveUser = messengerContext.onActiveUser
	const user = messengerContext.user
	const chatContent = messengerContext.chatContent
	const onChatContent = messengerContext.onChatContent
	

	const handleChange = (e) => {
		setText(e.target.value);
	}

	const handleInsertMessage = (e) => {
		if (e.type === 'click') {
			sendText(e)
		} else if (e.type === 'keydown' && e.key === 'Enter') {
			if (!e.shiftKey) {
				sendText(e)
			}
		}
    }

	const sendText = e => {
		e.preventDefault()
		e.stopPropagation()
		if (text === "") return
		sendMessage(text)
		setText("")
	};

	const handleClose = () => {
		onClose()
	}

	const sendMessage = async (text) => {
		
		const newTime = new Date()
		const newMessage = {
			avatar: user.avatar,
			name: user.name,
			content: text,
			time: newTime,
			type: 'send'
		}
		const newMessages = [...chatContent, newMessage]

		setIsSending(true)
		const response = await addUsersMessages(user.long_id, activeUser.long_id, text, authUser.long_id, authUser.session_id)
		setIsSending(false)
		
		if (response) {
			
			onChatContent(newMessages)
			updateChatUsers(newMessage)
			scrollToBottom('chatWrapper')
		} else {
			setErrorMessage('Failed to send')
		}
		
	}

	const updateChatUsers = (message) => {

		if (!message) {
			return
		}

		let newChatUsers = []

		if (chatUsers.length > 0) {
			chatUsers.forEach(u => {
				let newUser = u				
				if (u.long_id === activeUser.long_id) {
					newUser.status = message.content
					newUser.time = message.time
					newUser.chatContent = [...newUser.chatContent, message]
				}
				newChatUsers= [...newChatUsers, newUser]
			});
			
		}
				
		onChatUsers(newChatUsers)	
	}

	const scrollToBottom = (id) => {
		setTimeout(() => {
			const element = document.getElementById(id)
			if (element) {
				element.scrollTop = element.scrollHeight
			}
		}, 100)
   }

	const setUser = (newUser) => {
		const u = {
			long_id: newUser.long_id,
			_id: newUser._id,
			avatar: (newUser.profilepictureISfile) ? contents_url + newUser.profilepictureISfile : man,
			name: newUser.first_name + " " + newUser.last_name,
			newMessages: [],
			status: "",
			time: "",
			chatContent: []
		}
		onUser(u)
	}

	const getNewCounts = () => {
		if (activeUser.newMessages && activeUser.newMessages.length > 0) {
			const c = activeUser.newMessages.length
			setNewMessageCount(c)
		} else {
			setNewMessageCount(0)
		}
	}

	const clearNewMessage = async () => {
		scrollToBottom('chatWrapper')
		console.log("cleared")

		/**
		 * Update New Messages
		 */
		
		if ( activeUser.newMessages.length === 0) {
			return
		}

		let counts = 0;
		let newUser = activeUser
		let newChatUsers = chatUsers
		let removedMessageIds = []
		
		while (counts < activeUser.newMessages.length) {

			const res = await updateUsersMessages(activeUser.newMessages[counts], authUser.long_id, authUser.session_id)
			if (res) {
				removedMessageIds = [...removedMessageIds, activeUser.newMessages[counts]._id]
			}

			counts++
		}
		
		const newMessages = newUser.newMessages.filter(m => !removedMessageIds.includes(m._id))
		newUser.newMessages = newMessages
		newChatUsers.filter((u) => u.long_id === newUser.long_id)[0].newMessages = newMessages		

		onActiveUser(newUser)
		onChatUsers(newChatUsers)		
		getNewCounts()
		
	}

	const getChatConent = async () => {		
		
		const newChatUsers = chatUsers.filter(u => u.long_id === activeUser.long_id)

		if (newChatUsers.length > 0) {
			onChatContent(newChatUsers[0].chatContent)
		} else {
			onChatContent([])
		}
		
		scrollToBottom('chatWrapper')
	}

	useEffect(() => {

		if (!isChatLoaded) {
			console.log("not chat loaded yet")
			return
		}

		if (!user) {
			let isAuthStorage = localStorage.getItem('isAuthenticated')
			if (isAuthStorage === 'done') {
				let userStorage = localStorage.getItem('user')
				const newUser = JSON.parse(userStorage)
				setUser(newUser)
			}
		}

		if ( activeUser) {
			getNewCounts()
		} else {
			return
		}

		getChatConent()
		
    }, [isChatLoaded, activeUser]);

	useEffect(() => {

		const updateActiveUser = (user) => {
			const newUser = {
				long_id: user._id,
				_id: user.numeric_id,
				avatar: (user.profilepictureISfile) ? contents_url + user.profilepictureISfile : man,
				name: user.first_name + " " + user.last_name,
				newMessages: [],
				status: "",
				time: "",
				chatContent: []
			}
			
			/**
			 * Update List
			 */
			if (chatUsers.length > 0) {
				if (!chatUsers.some(u => u.long_id === newUser.long_id)) {
					const newChatUsers = [newUser, ...chatUsers]
					onChatUsers(newChatUsers)
				}

				/**
				 * Update activeUser
				 */
				if (activeUser.long_id !== newUser.long_id) {
					onActiveUser(newUser)
				}
			} else {
				onChatUsers([newUser])
				onActiveUser(newUser)
			}
			
		}

		if (additionalInfo.val) {
			updateActiveUser(additionalInfo.val)
		}
		
    }, [chatUsers]);

	return (
		<div>			
			{isChatLoaded && (
				(chatUsers && chatUsers.length > 0) ? (
					<div className='messenger-wrapper d-flex'>
						<div className='messenger-list'>
							<div className='messenger-list-title'>Your Conversations</div>
							<div className='users'>
								{(
									chatUsers.map((user, index) => (
										<User user={user} key={index}/>
									))
								)}
							</div>
						</div>
						<div className='messenger-room'>
							<div className='messenger-room-title'>Your Messages</div>
							<div className='chat-header d-flex align-items-center'>
								<div className='avatar'>
									<img className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded" src={activeUser.avatar} alt={'user'} />
								</div>
								<div className='name'>
									{activeUser.name}
								</div>
							</div>
							<div className='content-wrapper'>
								<div className='chat-content' id="chatWrapper">									
									{isContentLoding ? (
										<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 60 }}>
											<Spinner color='primary' size={''}>
												Loading...
											</Spinner>
										</div>
									) : (
											(chatContent.length > 0) ? (
												chatContent.map((m, i) => (
													<div key={i}>
														{newMessageCount > 0 && (
															<div className='new-messages' onClick={clearNewMessage}>{newMessageCount} New Messages</div>
														)}
														{errorMessage && (
															<div className='error-messages'>{errorMessage}</div>
														)}
														{isSending && (
															<div className='sending'>
																<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 30 }}>
																	<span>Sending...</span>
																	<Spinner color='#9a9a9a' size={''}>
																		Loading...
																	</Spinner>
																</div>
															</div>
														)}
														<Message message={m} isSending={isSending} errorMessage={errorMessage}/>
													</div>
													)
												)
											) : (
												<div className='no-chat'>
													{noChatText}
												</div>
											)
										)
									}
								</div>
								<div className={('message-editor-inputs d-flex')}>
									<div className={('message-editor-grow')}>
										<textarea
											className={('message-editor-textcontent')}
											value={text}
											onChange={handleChange}
											onKeyDown={handleInsertMessage}
											placeholder="Type your message here…"
										>
										</textarea>
									</div>
									<div className={('message-editor-buttons')}>
										<div className='send-btn' onClick={handleInsertMessage} >
											<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
												<path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
											</svg>
										</div>
									</div>
								</div>						
							</div>
						</div>
					</div>
				) : (
					<div className='no-messenger-wrapper'>
						<div>
							{noUserText}
						</div>
						<div className='btn btn-secondary' onClick={handleClose}>
							Close
						</div>
					</div>
				)
			)}
			{!isChatLoaded && (
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 60 }}>
					<Spinner color='primary' size={''}>
						Loading...
					</Spinner>
			</div>
			)}
		</div>
		
	)
}

export default Messenger
