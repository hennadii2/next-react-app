import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import { Container, Row, Col, Label } from 'reactstrap'
import getConfig from 'next/config'
import { AuthContext } from '../../../../../helpers/auth/AuthContext'
import { useContext } from 'react'
import { isEmpty } from '../../../../../helpers/utils/helpers'

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const SellerReportFollowing = ({ followings, buyers, onBuyerSelected, membershipId }) => {
	const authContext = useContext(AuthContext)
	const user = authContext.user
	const isBlueUser = isEmpty(user.subs) || user.subs?.membership_type === 'Blue'

	const reportFollowings = followings.map((following) => {
		return buyers.find((buyer) => buyer.numeric_id === following.userISbb_agrix_usersID)
	})

	const router = useRouter()

	const onPlan = () => {
		router.push({
			pathname: '/seller/account',
			query: { active: 'plan' },
		})
	}

	return (
		<>
			{/* <Container>
        <div className="mb-3">
          <h4>Following me:</h4>
        </div>
        {reportFollowings.map((following) => {
          const avatarUrl = following.profilepictureISfile
            ? contentsUrl + following.profilepictureISfile
            : "../../../../assets/images/user.png";
          return (
            <div
              className="mb-3 d-flex align-items-center"
              key={following.numeric_id}
              onClick={() => onBuyerSelected(following)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={avatarUrl}
                alt={`${following.first_name} ${following.last_name}`}
                className="user-avatar"
              />
              <h5 className="ml-2">
                {following.first_name + " " + following.last_name}
              </h5>
            </div>
          );
        })}
      </Container> */}
			{(isBlueUser) && (
				<Fragment>
					<div
						className='d-flex flex-column justify-content-center align-items-center'
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							width: '100%',
							height: '100%',
							zIndex: 9,
							backgroundColor: 'rgba(0, 0, 0, .4)',
						}}
					>
						<p className='text-center' style={{ color: '#fff', fontSize: 20, lineHeight: 1.5 }}>
							Your membership does not allow you to view this feature. Please upgrade to continue.
						</p>
						<div className='d-flex justify-content-center align-items-center'>
							<button className='btn btn-solid btn-default-plan btn-post mr-3' onClick={onPlan}>
								Membership Plans
							</button>
						</div>
					</div>
				</Fragment>
			)}
		</>
	)
}

export default SellerReportFollowing
