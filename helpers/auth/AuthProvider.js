import React, { useState } from 'react'
import { AuthContext } from './AuthContext'
import UserTypeModal from '../../components/modals/UserType'
import MembershipModal from '../../components/modals/Membership'
import SigninForm from '../../components/modals/SigninForm'
import SignupForm from '../../components/modals/SignupForm'
import ChangeCardFrom from '../../components/modals/ChangeCardFrom'
import SubscriptionModal from '../../components/modals/Subscription'
import getStripePromise from '../../helpers/utils/get-stripe'
import { Elements } from '@stripe/react-stripe-js'
import LogoBannerPurchaseForm from '../../components/modals/LogoBannerPurchaseForm'
import PaymentForm from '../../components/modals/PaymentForm'
import ChatModal from '../../components/modals/ChatModal'
import UserPermission from '../../components/modals/UserPermission'
import PageNotSetup from '../../components/modals/PageNotSetup'
import MembershipChangeModal from '../../components/modals/MembershipChangeModal'

const AuthProvider = (props) => {
	const stripePublicKey = props.validSessionData.stripe_public_key
	const stripePromise = getStripePromise(stripePublicKey)
	const [isLoginModal, setIsLoginModal] = useState(false)
	const [isUserTypeModal, setIsUserTypeModal] = useState(false)
	const [isMembershipModal, setIsMembershipModal] = useState(false)
	const [isSubscriptionModal, setIsSubscriptionModal] = useState(false)
	const [isRegisterModal, setIsRegisterModal] = useState(false)
	const [isChangeCardModal, setIsChangeCardModal] = useState(false)
	const [isCardChanged, setIsCardChanged] = useState(false)
	const [isLogoBannerPurchaseModal, setIsLogoBannerPurchaseModal] = useState(false)
	const [isPaymentModal, setIsPaymentModal] = useState(false)
	const [isChatModal, setIsChatModal] = useState(false)
	const [isPermissionModal, setIsPermissionModal] = useState(false)
	const [isMembershipChangeModal, setIsMembershipChangeModal] = useState(false)
	const [isPageNotSetupModal, setIsPageNotSetupModal] = useState(false)

	const [userTypeId, setUserTypeId] = useState('')
	const [membershipTypeId, setMembershipTypeId] = useState('')
	const [msg, setMsg] = useState('')
	const [info, setInfo] = useState({})

	const onAuthModalsTriggered = (name, val, others = {}) => {
		setInfo({ ...info, [name]: others })
		if (name === 'login') {
			setIsLoginModal(true)
			if (val) setMsg(val)
			setIsRegisterModal(false)
		} else if (name === 'user_type') {
			setIsUserTypeModal(true)
			setIsLoginModal(false)
		} else if (name === 'membership') {
			setUserTypeId(val)
			setIsUserTypeModal(false)
			setIsSubscriptionModal(false)
			setIsMembershipModal(true)
		} else if (name === 'subscribe') {
			setMembershipTypeId(val)
			setIsMembershipModal(false)
			setIsSubscriptionModal(true)
		} else if (name === 'register') {
			setMembershipTypeId(val)
			setIsMembershipModal(false)
			setIsSubscriptionModal(false)
			setIsRegisterModal(true)
		} else if (name === 'LogoBannerPurchase') {
			setIsLogoBannerPurchaseModal(true)
		} else if (name === 'Payment') {
			setIsPaymentModal(true)
		} else if (name === 'Chat') {
			setInfo({ ...info, val })
			setIsChatModal(true)
		} else if (name === 'Permission') {
			setIsPermissionModal(true)
		} else if (name === 'MembershipChange') {
			setIsUserTypeModal(false)
			setIsMembershipChangeModal(true)
		} else if (name === 'ChangeCard') {			
			setIsChangeCardModal(true)
		} else if (name === 'pageNotSetup') {			
			setIsPageNotSetupModal(true)
		}
	}

	return (
		<AuthContext.Provider value={{ ...props, onAuthModalsTriggered: onAuthModalsTriggered }}>
			{props.children}
			<UserTypeModal isShow={isUserTypeModal} onClose={() => setIsUserTypeModal(false)} additionalInfo={info} />
			<MembershipModal
				isShow={isMembershipModal}
				onClose={() => setIsMembershipModal(false)}
				onGoBack={() => {setIsMembershipModal(false); setIsUserTypeModal(true);}}
				userTypeId={userTypeId}
				additionalInfo={info}
			/>

			<SubscriptionModal
				isShow={isSubscriptionModal}
				onClose={() => setIsSubscriptionModal(false)}
				onGoBack={() => {setIsSubscriptionModal(false); setIsMembershipModal(true);}}
				userTypeId={userTypeId}
				membershipTypeId={membershipTypeId}
				additionalInfo={info}
			/>
			<SigninForm
				isShow={isLoginModal}
				msg={msg}
				onClose={(val, status) => {
					if (status === 'logged-in') setMsg('')
					setIsLoginModal(false)
				}}
				additionalInfo={info}
			/>

			{props.isAuthenticated && (
				<ChatModal isShow={isChatModal} onClose={() => setIsChatModal(false)} additionalInfo={info} />
			)}

			<SignupForm
				isShow={isRegisterModal}
				onClose={() => setIsRegisterModal(false)}
				onGoBack={() => {setIsRegisterModal(false); setIsSubscriptionModal(true);}}
				userTypeId={userTypeId}
				membershipTypeId={membershipTypeId}
				additionalInfo={info}
			/>

			{stripePromise && (
				<Elements stripe={stripePromise}>								
					<LogoBannerPurchaseForm
						isShow={isLogoBannerPurchaseModal}
						onClose={() => setIsLogoBannerPurchaseModal(false)}
						additionalInfo={info}
					/>
					<PaymentForm isShow={isPaymentModal} onClose={() => setIsPaymentModal(false)} additionalInfo={info} />
					<MembershipChangeModal
						isShow={isMembershipChangeModal}
						onClose={() => setIsMembershipChangeModal(false)}
						additionalInfo={info}
					/>
				</Elements>
			)}

			<UserPermission
				modal={isPermissionModal}
				onToggle={() => setIsPermissionModal(!isPermissionModal)}
				others={info?.Permission || {}}
			/>
			<PageNotSetup
				modal={isPageNotSetupModal}
				onToggle={() => setIsPageNotSetupModal(!isPageNotSetupModal)}
			/>
		</AuthContext.Provider>
	)
}

export default AuthProvider
