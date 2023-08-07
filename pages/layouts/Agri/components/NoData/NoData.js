import React from 'react'

const NoData = ({ isAdvert = false, description, createLabel, onCreate }) => {
	return (
		<>
			<div className='no-data'>
				<div className='content-wrapper'>
					<div className='container'>
						{isAdvert ? (
							<div className='description'>
								<p style={{lineHeight: '1.5'}}>
									Don't miss out on this incredible opportunity to elevate your agricultural business. Click the Create New Advert Button above and unlock the potential for unparalleled growth and success.
								</p>
								<p style={{lineHeight: '1.5'}}>
									Why Advertise on AgriXchange.com?
								</p>
								<p style={{lineHeight: '1.5'}}>
									1. Extensive Reach: AgriXchange.com is a rapidly growing online platform dedicated to agriculture, attracting farmers and traders from all over the world. By advertising with us, you tap into our expansive network, connecting with potential buyers and partners you may not have reached otherwise.
								</p>
								<p style={{lineHeight: '1.5'}}>
									2. Targeted Audience: Our platform focuses solely on the agricultural sector, meaning your ads are seen by individuals actively seeking agricultural products and services. By presenting your offerings directly to your target market, you increase the likelihood of generating quality leads and driving conversions.
								</p>
								<p style={{lineHeight: '1.5'}}>
									3. Credibility and Trust: AgriXchange.com is a trusted name in the agricultural community. By associating your brand with our platform, you leverage our reputation and credibility, building trust among potential buyers. Gain a competitive edge by showcasing your commitment to quality and reliability.
								</p>
								<p style={{lineHeight: '1.5'}}>
									4. Cost-Effective Solution: Our advertising options are designed to suit various budgets, ensuring that businesses of all sizes can benefit from increased exposure. Choose the option that aligns with your goals and budget, and enjoy the remarkable returns on investment that Agrixchange.com can deliver.
								</p>
							</div>
						) : (
							<div className='description'>{description}</div>
						)}
						{onCreate && (
							<button className='btn btn-solid btn-default-plan btn-post' onClick={onCreate}>
								{createLabel}
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default NoData
