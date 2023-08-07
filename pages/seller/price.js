import React, { useState } from 'react'
import { withIronSession } from 'next-iron-session'
import CommonLayout from '../../components/layout/common-layout'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import Price from '../layouts/Agri/components/seller/SellerPrice'
import Breadcrumb from '../../components/common/breadcrumb'
import PriceSellerModal from '../../components/modals/PriceSeller'
import NoData from '../layouts/Agri/components/NoData/NoData'
import { lisUsersProducePricing, listProducesByUserId, listProduceTypes } from '../../helpers/lib'
import vars from '../../helpers/utils/vars'

const MyPrice = ({ pricelogsForSeller, producesForSeller, produces }) => {
	const [showPriceAddModal, setShowPriceAddModal] = useState(false)
	const handleCreate = () => setShowPriceAddModal(!showPriceAddModal)

	return (
		<CommonLayout title='collection' parent='home' sidebar={true}>
			<Breadcrumb title='Price Log' description='Seller Panel' parent='Dashboard' />
			<Container fluid={true}>
				<Row>
					{!pricelogsForSeller?.length ? (
						<Col sm='12'>
							<NoData
								description='You have not added a price yet, lets get started!'
								createLabel='Add Price'
								onCreate={handleCreate}
							/>
						</Col>
					) : (
						<Col sm='12'>
							<Card>
								<CardHeader>
									<div>
										<div> {vars.sellerPriceTitle}</div>
										<div className='pull-right'>
											<button onClick={handleCreate} className='btn btn-solid btn-default-plan btn-post'>
												{/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
												Add New Pricing
											</button>
										</div>
									</div>

									{/* <div className="pull-right mr-3">
                                    <button
                                        className="btn btn-secondary btn-classic border-0"
                                    >
                                        <i className="fa fa-eye" aria-hidden="true"></i> Search
                                    </button>
                                </div>                     */}
								</CardHeader>
								<CardBody>
									<Price pricinglogs={pricelogsForSeller} producesSeller={producesForSeller} produces={produces} />
								</CardBody>
							</Card>
						</Col>
					)}
				</Row>
			</Container>
			<PriceSellerModal
				modal={showPriceAddModal}
				toggle={(showPriceAddModal) => setShowPriceAddModal(!showPriceAddModal)}
				producesForSeller={producesForSeller}
				produces={produces}
				pricinglogs={pricelogsForSeller}
			/>
		</CommonLayout>
	)
}

export default MyPrice

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

		const produces = await listProduceTypes()
		const pricelogs = await lisUsersProducePricing()
		const producesForSeller = await listProducesByUserId(user.user._id)

		let pricelogsForSeller = []
		for (let produce of producesForSeller) {
			const pricingsForSeller = pricelogs.filter(
				(price) => price.produceISbb_agrix_users_produceID === produce.numeric_id
			)
			pricelogsForSeller = [...pricelogsForSeller, ...pricingsForSeller]
		}

		return {
			props: {
				pricelogsForSeller,
				producesForSeller,
				produces,
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
