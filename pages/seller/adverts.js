import React, { useState } from 'react'
import { withIronSession } from 'next-iron-session'
import CommonLayout from '../../components/layout/common-layout'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import AdvertSellerModal from '../../components/modals/AdvertSeller'
import AdvertPositionSellerModal from '../../components/modals/AdvertPositionSeller'
import MyAdverts from '../layouts/Agri/components/seller/SellerAdverts'
import NoData from '../layouts/Agri/components/NoData/NoData'
import Breadcrumb from '../../components/common/breadcrumb'
import { listAdvertsByUserId, listAdvertsPositions } from '../../helpers/lib'
import vars from '../../helpers/utils/vars'

const MyAdvert = ({ advertsPositions, advertsForSeller }) => {
	const [showAdvertModal, setShowAdvertModal] = useState(false)
	const [caption, setCaption] = useState('')

	const [showAdvertPositionModal, setShowAdvertPosiotionModal] = useState(false)

	const [selectedAdvert, setSelectedAdvert] = useState(null)
	const [selectedPosition, setSelectedPosition] = useState({})

	const onCreate = () => setShowAdvertPosiotionModal(!showAdvertPositionModal)

	const onPositionSelected = (position) => {
		setSelectedPosition(position)
		setSelectedAdvert(null)
		setCaption('Create Advert')
		setShowAdvertPosiotionModal(!showAdvertPositionModal)
		setShowAdvertModal(!showAdvertModal)
	}

	const onEdit = (advert) => {
		setSelectedAdvert(advert)
		setCaption('Edit Advert')
		setSelectedPosition(
			advertsPositions.find((position) => position.numeric_id === advert.positionISbb_agrix_adverts_positionsID)
		)
		setShowAdvertModal(!showAdvertModal)
	}

	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='My Adverts' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					{!advertsForSeller?.length ? (
						<Col sm='12'>
							<NoData
								isAdvert={true}
								description='You have not added an advert yet, lets get started!'
								createLabel='Create New Advert'
								onCreate={onCreate}
							/>
						</Col>
					) : (
						<Col sm='12'>
							<Card>
								<CardHeader>
									<div>
										<div>{vars.sellerAdvertTitle}</div>
										<div className='pull-right'>
											<button onClick={onCreate} className='btn btn-solid btn-default-plan btn-post btn-sm'>
												{/* <i className='fa fa-plus-circle' aria-hidden='true'></i> */}
												Create New Advert
											</button>
										</div>
									</div>

									{/* <div className="pull-right mr-3"> 
                                    <button className="btn btn-solid btn-blue-plan btn-post btn-sm">
                                        <i className="fa fa-eye" aria-hidden="true"></i> Search
                                    </button>
                                </div> */}
								</CardHeader>
								<CardBody>
									<MyAdverts advertsForSeller={advertsForSeller} advertsPositions={advertsPositions} onEdit={onEdit} />
								</CardBody>
							</Card>
						</Col>
					)}
				</Row>
			</Container>
			<AdvertSellerModal
				modal={showAdvertModal}
				onToggle={(showAdvertModal) => setShowAdvertModal(!showAdvertModal)}
				caption={caption}
				selectedPosition={selectedPosition}
				selectedAdvert={selectedAdvert}
				positions={advertsPositions}
				setSelectedPosition={setSelectedPosition}
			/>
			<AdvertPositionSellerModal
				modal={showAdvertPositionModal}
				onToggle={(showAdvertPositionModal) => setShowAdvertPosiotionModal(!showAdvertPositionModal)}
				positions={advertsPositions}
				onPositionSelected={onPositionSelected}
			/>
		</CommonLayout>
	)
}

export default MyAdvert

export const getServerSideProps = withIronSession(
	async ({ req, res }) => {
		const user = req.session.get('user')

		if (!user) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}

		const advertsPositions = await listAdvertsPositions()
		const advertsForSeller = await listAdvertsByUserId(user.user._id)

		return {
			props: {
				advertsPositions,
				advertsForSeller,
			},
		}
	},
	{
		cookieName: process.env.COOKIE_NAME,
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production' ? true : false,
		},
		password: process.env.APPLICATION_SECRET,
	}
)
