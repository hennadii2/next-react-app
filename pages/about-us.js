import React from 'react'
import axios from 'axios'
import CommonLayout from '../components/layout/common-layout'
import { Container } from 'styled-bootstrap-grid'
import Banner from './layouts/Agri/components/Banner'
import { getFormServer } from '../services/constants'
import { server_domain } from '../services/constants'

const AboutUs = ({ banner }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<Banner banner={banner} searchBar={false} />
			<section className='section-b-space about-section'>
				<Container>
					<h4 className='section-title mb-3 mt-4 text-center'>About Us</h4>
					<div className='p-2 mb-4'>
						<p className='text-center'>
							We connect buyer and sellers of Fresh Produce. Want to engage with the world of agriculture, Want a simple
							reliable platform to keep your customer in the know about you, your company and your produce?
						</p>
						<p className='text-center'>
							Agrixchange.net gives you the solutions you need to buy, sell and connect, Everyday! We have been involved
							the agriculture industry for 15 years, and seen what you go through, its a tough Market. Buyers and
							sellers want the same thing, always, PROFIT! Agriculture is the one arena were infomation really does make
							the difference.
						</p>
						<p className='text-center'>
							In an industry where prices change daily, we keep you on the pulse. Agrixchange.net is here to make your
							life easier, Allowing you to Prepare for that pricing Opportunity. Sometimes its not the price, If you are
							the only one with the stock! Agrixchange.net is here to help you manage your risk.
						</p>
						<p className='text-center'>
							We have the solution to put your updated prices in the hands of REAL Buyers from around the globe.
							Agrixchange.net is the easiest way to get frequently updated pricing from several countries though-out the
							year direct to the buyer. In a manner that fits in with your busy lifestyle. Quote by Seneca- "Luck is
							what happens when preparation meets opportunity.
						</p>
					</div>
				</Container>
			</section>
		</CommonLayout>
	)
}

export default AboutUs

const getBanner = async () => {
	let formData = getFormServer()
	formData.append('api_method', 'get_content')
	formData.append('name', 'homepage')

	try {
		const response = await axios.request({
			url: server_domain,
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: formData,
		})
		if (response.data.message === 'SUCCESS') {
			return response.data.content
		} else if (response.data.error) {
			console.log(response.data.error)
		}
	} catch (err) {
		console.log(err.toString())
	}
	return {}
}

export async function getStaticProps() {
	let banner = await getBanner()

	return {
		props: {
			banner,
		},
		revalidate: 60,
	}
}
