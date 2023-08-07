import React, { useEffect, useLayoutEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import '../public/assets/scss/app.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TapTop from '../components/common/widgets/Tap-Top'
import CartContextProvider from '../helpers/cart/CartContext'
import { WishlistContextProvider } from '../helpers/wishlist/WishlistContext'
import FilterProvider from '../helpers/filter/FilterProvider'
import SettingProvider from '../helpers/theme-setting/SettingProvider'
import AuthProvider from '../helpers/auth/AuthProvider'
import { CompareContextProvider } from '../helpers/Compare/CompareContext'
import { CurrencyContextProvider } from '../helpers/Currency/CurrencyContext'
import Helmet from 'react-helmet'
import { getFormClient } from '../services/constants'
import { post } from '../services/axios'
import getConfig from 'next/config'
import NextNProgress from 'nextjs-progressbar'
import vars from '../helpers/utils/vars'
import ScriptTag from 'react-script-tag'
import '@weavy/themes/dist/weavy-default.css'
import MessengerProvider from '../helpers/messenger/MessengerProvider'
import { Users } from 'react-feather'
import { getSellers, getBuyers, getUserById, listUsersMessages, validateSessioin } from '../helpers/lib'
import { contents_url, default_avatar } from '../services/constants'
import man from "../public/assets/images/user.png";
import * as _ from 'lodash';
import { auth } from 'firebase'

const { publicRuntimeConfig } = getConfig()
const apiUrl = `${publicRuntimeConfig.API_URL}`

export default function MyApp({ Component, pageProps }) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [appSettingData, setAppSettingData] = useState({})

	const [authInfo, setAuthInfo] = useState({})
	const [validSessionData, setValidSessionData] = useState({})
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [targetPath, setTargetPath] = useState('/dashboard')

	const [user, setUser] = useState({})
	const [chatUsers, setChatUsers] = useState([])
	const [chatContent, setChatContent] = useState([])
	const [isChatLoaded, setIsChatLoaded] = useState(false)
	const [activeUser, setActiveUser] = useState('')
	const [newMessageCounts, setNewMessageCounts] = useState(0)
	
	const onAuth = (info, isAuth) => {
		setAuthInfo(info)
		setIsAuthenticated(isAuth)
	}

	const onTarget = (val) => {
		setTargetPath(val)
	}

	const onUser = (newUser) => {
		const u = {
			long_id: newUser.long_id,
			_id: newUser._id,
			avatar: (newUser.profilepictureISfile) ? contents_url + newUser.profilepictureISfile : man,
			name: newUser.first_name + " " + newUser.last_name
		}
		setUser(u)
	}

	const onChatLoad = (val) => {
		setIsChatLoaded(val)
	}

	const onChatContent = (val) => {
		setChatContent(val)
	}

	const onNewMessageCounts = (val) => {
		setNewMessageCounts(val)
	}

	const onChatUsers = (users) => {
		setChatUsers(users)
		
		let c = 0
		if (users.length > 0) {
			users.forEach(u => {
				if (u.newMessages) {
					c += u.newMessages.length
				}
			});
		}
		onNewMessageCounts(c)
	}

	const setChatInfo = () => {
		let userStorage = localStorage.getItem('user')
		if (!userStorage) return
		const user = JSON.parse(userStorage)
		if (!user) return
		getChatUsers(user)			
	}

	const onActiveUser = (user) => {
		setActiveUser(user)			
	}

	const getChatUsers = async(user) => {
		onChatLoad(false)
		console.log("---------Start to load Chat---------")

		const userId = user.long_id
		const fromMessages = await listUsersMessages(null, userId)
		const toMessages = await listUsersMessages(userId, null)

		let chatUsers = []
		
		/**
		 * Get Users that the logged-in user got messages from
		 */
		
		let fromUsers = []
		if (fromMessages.length > 0) {
			fromMessages.forEach(m => {
				if (m.to_userISbb_agrix_usersID_data && m.to_userISbb_agrix_usersID_data._id && m.to_userISbb_agrix_usersID_data._id === userId) {
					if (m.userISbb_agrix_usersID_data && m.userISbb_agrix_usersID_data._id) {
						const fromUser = m.userISbb_agrix_usersID_data
						const addUser = {
							long_id: fromUser._id,
							_id: fromUser.numeric_id,
							avatar: (fromUser.profilepictureISfile) ? contents_url + fromUser.profilepictureISfile : man,
							name: fromUser.first_name + " " + fromUser.last_name,
							status: "",
							time: "",
							newMessages: [],
							chatContent: []
						}
						if (fromUsers.filter(u => u.long_id === addUser.long_id).length === 0) {
							fromUsers = [...fromUsers, addUser]
							if (chatUsers.filter(u => u.long_id === addUser.long_id).length === 0) {
								chatUsers = [...chatUsers, addUser]
							}
						}
					}
				}
			});
		}

		/**
		 * Get Users that the logged-in user got messages from
		 */
		
		let toUsers = []
		if (toMessages.length > 0) {
			toMessages.forEach(m => {
				if (m.userISbb_agrix_usersID_data && m.userISbb_agrix_usersID_data._id && m.userISbb_agrix_usersID_data._id === userId) {
					if (m.to_userISbb_agrix_usersID_data && m.to_userISbb_agrix_usersID_data._id) {
						const toUser = m.to_userISbb_agrix_usersID_data
						const addUser = {
							long_id: toUser._id,
							_id: toUser.numeric_id,
							avatar: (toUser.profilepictureISfile) ? contents_url + toUser.profilepictureISfile : man,
							name: toUser.first_name + " " + toUser.last_name,
							status: "",
							time: "",
							newMessages: [],
							chatContent: []
						}
						if (toUsers.filter(u => u.long_id === addUser.long_id).length === 0) {
							toUsers = [...toUsers, addUser]

							if (chatUsers.filter(u => u.long_id === addUser.long_id).length === 0) {
								chatUsers = [...chatUsers, addUser]
							}
						}
					}
				}
			});
		}

		if (chatUsers.length > 0) {
			chatUsers.forEach(u => {
				const messages1 = fromMessages.filter(m => m.userISbb_agrix_usersID_data._id === u.long_id)
				const messages2 = toMessages.filter(m => m.to_userISbb_agrix_usersID_data._id === u.long_id)
				const messagesAll = [...messages1, ...messages2]
				const newMessages = messages1.filter(m => m.seenYN === "0")

				const orderedNewMessages = _.orderBy(newMessages, i => i._dateadded, 'desc');
				const orderedMessages = _.orderBy(messagesAll, i => i._dateadded, 'desc');

				u.status = orderedMessages[0].messageISsmallplaintextbox
				u.time = orderedMessages[0]._dateadded
				u.newMessages = orderedNewMessages


				/**
				 * Get ready with Chat contents
				 */
				let messages = []

				const from = {
					long_id: user.long_id,
					_id: user._id,
					avatar: (user.profilepictureISfile) ? contents_url + user.profilepictureISfile : man,
					name: user.first_name + " " + user.last_name,
					newMessages: [],
					status: "",
					time: "",
					chatContent: []
				}
				const to = u				
				
				const sentMessages = messages2;
				
				if (sentMessages && sentMessages.length > 0) {
					sentMessages.forEach(m => {

						if (m.messageISsmallplaintextbox) {
							const message = {
								avatar: from.avatar,
								name: from.name,
								content: m.messageISsmallplaintextbox,
								time: m._dateadded,
								type: 'send'
							}
	
							messages = [...messages, message]
						}
						
					});
				}

				const gotMessages = messages1;

				if (gotMessages.length > 0) {
					gotMessages.forEach(m => {

						if (m.messageISsmallplaintextbox) {
							const message = {
								avatar: to.avatar,
								name: to.name,
								content: m.messageISsmallplaintextbox,
								time: m._dateadded,
								type: 'get'
							}
	
							messages = [...messages, message]
						}
						
					});
				}

				const newContent = _.orderBy(messages, i => i.time, 'asc')

				u.chatContent = newContent


			});
		}

		const newList = _.orderBy(chatUsers, u => u.time, 'desc');

		if (newList.length > 0) {
			onChatUsers(newList)
			onActiveUser(newList[0])
			onChatContent(newList[0].chatContent)
		} else {
			onChatUsers([])
			onActiveUser({})
			onChatContent([])
		}

		onChatLoad(true)
		console.log("--------END----------")
		
	}

	

	const getNotificationData = async () => {
		let userStorage = localStorage.getItem('user')
		if (!userStorage) return
		const user = JSON.parse(userStorage)
		if (!user) return
		console.log('Getting alerts...')
		let formData = getFormClient()
		formData.append('api_method', 'get_alerts')
		formData.append('session_id', user.session_id)
		formData.append('user_id', user._id)

		try {
			const response = await post(apiUrl, formData)
			if (response.data.message === 'SUCCESS') {
				setAppSettingData((prevData) => {
					return { ...prevData, __notifications: response.data?.alerts || [] }
				})
			}
		} catch (err) {
			console.log(err)
		}

		setChatInfo()
	}

	const handleRouteChangeComplete = (url, { shallow }) => {
		console.log(`App is changed to ${url} ${shallow ? 'with' : 'without'} shallow routing.`)
		getNotificationData()
	}

	useEffect(() => {
		const getAppSettingData = async () => {
			let formData = getFormClient()
			formData.append('api_method', 'app_settings')
			formData.append('app_version', '1')
			formData.append('device_info', '1')

			try {
				const response = await post(apiUrl, formData)
				if (response.data.message === 'SUCCESS') {
					setAppSettingData(response.data)
				} else if (response.data.error) {
					alert(response.data.message)
				}
				setIsLoading(false)
			} catch (err) {
				alert(err.toString())
			}
		}

		const setAuthUserInfo = async () => {
			let isAuthStorage = localStorage.getItem('isAuthenticated')
			if (isAuthStorage === 'done') {
				let userStorage = localStorage.getItem('user')
				const userData = JSON.parse(userStorage)
	
				const sessionData = await validateSessioin(userData.long_id, userData.session_id)
				console.log("session validate: ", sessionData)
	
				if (validSessionData) {
					onAuth(userData, true)
					onUser(userData)
					setValidSessionData(sessionData)
				} else {
					onAuth({}, false)
				}
				
			} else {
				console.log("session validate: Not set yet as it's not aunthenticated yet!")
			}
		}
		
		getAppSettingData()
		setAuthUserInfo()

		router.events.on('routeChangeComplete', handleRouteChangeComplete)

		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
		}
	}, [])

	useEffect(() => {
		if (!isAuthenticated) return
		getNotificationData()
	}, [isAuthenticated])


	return (
		<>
			{isLoading ? (
				<div className='loader-wrapper'>
					<div className='loader'></div>
				</div>
			) : (
				<>
					<Helmet>
						<meta name='viewport' content='width=device-width, initial-scale=1' />
						<title>Biggest Online Agricultural Marketplace - E-Market Platforms for Farmers</title>
					</Helmet>
					<NextNProgress color={vars.primaryColor} options={{ showSpinner: false }} />
					<div>
						<SettingProvider
							appData={appSettingData}
							updateAppData={(_data) => {
								setAppSettingData((prevData = {}) => {
									return { ...prevData, ..._data }
								})
							}}
						>
							{/* <CompareContextProvider>
                <CurrencyContextProvider>
                  <CartContextProvider>
                    <WishlistContextProvider>
                      <FilterProvider> */}
						<MessengerProvider
								user={user}
								chatUsers={chatUsers}
								chatContent={chatContent}
								isChatLoaded={isChatLoaded}
								activeUser={activeUser}
								newMessageCounts={newMessageCounts}
								onUser={onUser}
								onChatUsers={onChatUsers}
								onChatContent={onChatContent}
								onChatLoad={onChatLoad}
								onActiveUser={onActiveUser}
								onNewMessageCounts={onNewMessageCounts}
							>
							<AuthProvider
								user={authInfo}
								isAuthenticated={isAuthenticated}
								validSessionData={validSessionData}
								onAuth={onAuth}
								onTarget={onTarget}
								targetPath={targetPath}
							>
								
								<Component {...pageProps} />
								
							</AuthProvider>
						</MessengerProvider>
							{/* </FilterProvider>
                    </WishlistContextProvider>
                  </CartContextProvider>
                </CurrencyContextProvider>
              </CompareContextProvider> */}
						</SettingProvider>
						<ToastContainer />
						<TapTop />
					</div>
				</>
			)}
		</>
	)
}
