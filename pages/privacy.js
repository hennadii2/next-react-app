import React from 'react'
import CommonLayout from '../components/layout/common-layout'
import { Container } from 'styled-bootstrap-grid'
import Banner from './layouts/Agri/components/Banner'
import { getBanner } from '../helpers/lib'

const titleStyles = { fontSize: 20, fontWeight: 'bold' }

const Privacy = ({ banner }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<Banner banner={banner} searchBar={false} />
			<section className='section-b-space about-section'>
				<Container>
					<h4 className='section-title mb-3 mt-4 text-center'>Privacy Policy</h4>
					<div className='p-2 mb-4'>
						<p>
							Agrixchange.com has created this privacy policy in order to demonstrate our firm commitment to privacy.
							The following discloses the information gathering and dissemination practices for the Agrixchange.com
							Website/App.
						</p>
						<p>
							By using the Agrixchange.com site/ app and accepting the User Agreement you also agree to this Privacy
							Policy. If you do not agree to this Privacy Policy, you must not use the Agrixchange.com site. The terms
							"We," "Us," "Our," or "Agrixchange" includes Agrixchange.com and our affiliates.
						</p>
						<ol>
							<li>
								<h4 style={titleStyles} className='mb-3 mt-4'>
									1. What information do we collect?
								</h4>
								<p>
									Agrixchange collects your information when you register on the Agrixchange.com site and when you visit
									Agrixchange.com pages.
								</p>
								<ul>
									<li>
										<p>
											<strong>Personal Information:</strong> We may collect the following types of personal information
											in order to provide you with the use and access to the Agrixchange.com site, services and tools,
											and for any additional purposes set out in this Privacy Policy:
										</p>
										<p>
											Name, and contact information, such as email address, phone number, mobile telephone number,
											physical address, and (depending on the service used) sometimes financial information, such as
											bank account numbers.
										</p>
										<p>
											Transactional information based on your activities on the sites (such as bidding, buying, selling,
											item and content you generate or that relates to your account), billing and other information you
											provide to purchase an item.
										</p>
										<p>
											Personal information you provide to us through correspondence, chats, dispute resolution, or
											shared by you from other social applications, services or websites.
										</p>
										<p>
											Additional personal information we ask you to submit to authenticate yourself if we believe you
											are violating site policies (for example, we may ask you to send us an ID to answer additional
											questions online to help verify your identity).
										</p>
										<p>
											Information from your interaction with our sites, services, content and advertising, including,
											but not limited to, device ID, device type, location, geo-location information, computer and
											connection information, statistics on page views, traffic to and from the sites, ad data, IP
											address and standard web log information.
										</p>
									</li>
									<li>
										<p>
											<strong>Aggregate Information:</strong> Agrixchange.com collects non-identifying, general, generic
											and aggregate information to better design our Web site and services.
										</p>
									</li>
									<li>
										<p>
											<strong>Non-Personal Information:</strong> Agrixchange.com may collect non-personal information as
											you use Agrixchange.com. When you use the site, Agrixchange.com, third-party service providers
											(e.g. Google Analytics), and partners may receive and record non-personal information from
											cookies, server logs, and similar technology from your browser or mobile device, including your IP
											address.
										</p>
									</li>
									<li>
										<p>
											We may combine some Non-Personal Information with the Personal Information we collect. Where we do
											so, we will treat the combined information as Personal Information if the resulting combination
											may be used to readily identify or locate you in the same manner as Personal Information alone.
										</p>
									</li>
								</ul>
							</li>

							<li>
								<h4 style={titleStyles} className='mb-3 mt-4'>
									2. How do we store your information?
								</h4>
								<p>
									We use hosting provider Bluebox Web hosting, therefore your information may be transferred to and
									stored on servers in various locations both in and outside of the United States of America.
									Agrixchange.com maintains control of your information. We protect your information using technical and
									administrative security measures to reduce the risks of loss, misuse, unauthorized access, disclosure
									and alteration. Some of the safeguards we use are firewalls and data encryption, physical access
									controls to our data centres, and information access authorization controls.
								</p>
							</li>

							<li>
								<h4 style={titleStyles} className='mb-3 mt-4'>
									3. How do we use your Information?
								</h4>
								<p>
									When you use the Agrixchange.com site, we may request certain information. Agrixchange.com may share
									any of your personally identifiable or transactional information with any person or entity, as set out
									in this policy. Other third parties may receive your personally identifiable information or other
									transactional data including approximate location / geo-location information when you use the Seller
									or Buyer service and those with whom you have transactions and share that information. The information
									we collect is used to improve the content of our web site, used to notify consumers about updates to
									our web site and for communications, such as customer service as well as other paid for services
									within the framework of this site.
								</p>
								<p>
									<strong>Communications:</strong> We may send you a welcome email to verify your account and other
									transactional emails for operational purposes, such as billing, account management, or system
									maintenance. You may only stop those emails by terminating your account. We may also send you
									promotions, product announcements, surveys, newsletters, developer updates, product evaluations, and
									event information or other marketing or commercial e-mails. You can opt out of receiving these email
									communications from Agrixchange.com by emailing Support@Agrixchange.com.
								</p>
								<p>
									<strong>Marketing:</strong> You agree that we may use your personal information to tell you about our
									services and tools, deliver targeted marketing and promotional offers based on your communication
									preferences, and customize measure and improve our advertising.
								</p>
								<p>
									We may rent, sell, or share Personal Information about you with other people or non- affiliated
									companies for marketing purposes (including direct marketing purposes) without your permission. We may
									use and share Non-Personal Information for our marketing purposes, including, without limitation,
									marketing on other websites. For example, we may use the information to control the number of times
									you have seen an ad, deliver ads tailored to your interests, and measure the effectiveness of ad
									campaigns. You can prevent us from tailoring our ads to you on other websites by deleting your cookies
									(see below).
								</p>
							</li>
						</ol>
						<h4 style={titleStyles} className='mb-3 mt-4'>
							Sharing your Information
						</h4>
						<p>
							We disclose personal information to respond to legal requirements, enforce our policies, respond to claims
							that a listing or other content violates the rights of others, or protect anyone's rights, property, or
							safety. Such information will be disclosed in accordance with applicable laws and regulations. As stated
							above, we may disclose your personal information to third parties for their marketing purposes without
							your explicit consent.
						</p>
						<p>
							We may disclose personal information to our related bodies corporate and third party suppliers and service
							providers located overseas for some of the purposes listed above. We take reasonable steps to ensure that
							the overseas recipients of your personal information do not breach the privacy obligations relating to
							your personal information.
						</p>
						<p>
							We may disclose your personal information upon a business transition; At the sale or transfer of
							Agrixchange.com and/or all or part of its assets, your personal information may be among the items sold or
							transferred.
						</p>
						<p>We may disclose your personal information to entities located inside or outside of America.</p>
						<p>
							We may share aggregate data with advertisers and other third parties. Agrixchange.com uses
							industry-standard encryption technologies when transferring and receiving consumer and transaction data
							exchanged with our site.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Cookies
						</h4>
						<p>
							Cookies are pieces of data assigned by a web server that uniquely identify the browser on your PC.
							Agrixchange.com uses cookies called "persistent" cookies to enable the site to remember you on subsequent
							visits, speeding up or enhancing your experience of services or functions offered. Cookies also enable our
							systems to gather information about your navigational patterns through the site. You have the option to
							disable cookies at any time through your browsers. We may also store your website activity in cookies
							which may be used by third party vendors, including Google, to serve ads based on your behavior on our
							website.
						</p>
						<p>
							The third party vendors (e.g. Google Analytics) may receive and record non-personal information from
							cookies, server logs, and similar technology from your browser or mobile device, including your IP
							address. You may opt out of Google's use of cookies by visiting the Google advertising opt-out page. If
							you access our Services with your login credentials from a social networking site (e.g., Facebook or
							Twitter) or if you otherwise agree to associate your Agrixchange.com account with a social networking
							account, we may receive personal information about you from such social networking site, in accordance
							with the terms of use and privacy policy of the social networking site. For example, Facebook may share
							with us your friend list, birthday, information about the interests of you or your friends or other
							personal information, in order to help us establish your account, tailor services to you and find other
							current or potential site users that you know. We may add this information to the information we have
							already collected from you via other aspects of the Site. You are also subject to the social networking
							site's terms of use and privacy policy. We use the OAuth (open authorization) protocol to enable us to
							access this information without collecting your password when you agree allow another application to
							access your account information.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Accessing and updating your Information
						</h4>
						<p>
							You can update your information through your account profile settings. If you believe that personal
							information we hold about you is incorrect, incomplete or inaccurate, then you may amend it at anytime.
						</p>
						<p>
							We may charge you a fee to cover our administrative and other reasonable costs in providing the
							information to you. We will not charge for simply making the request and will not charge for making any
							corrections to your personal information.
						</p>
						<p>
							There may be instances where we cannot grant you access to the personal information we hold. For example,
							we may need to refuse access if granting access would interfere with the privacy of others or if it would
							result in a breach of confidentiality. If that happens, we will give you written reasons for any refusal.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Changes to our privacy policy
						</h4>
						<p>
							We may change this privacy policy from time to time. Any updated versions of this privacy policy will be
							posted on our website. Please review it regularly.
						</p>
						<p>This privacy policy was last updated on May 2022.</p>
					</div>
				</Container>
			</section>
		</CommonLayout>
	)
}

export default Privacy

export async function getStaticProps() {
	const banner = await getBanner()

	return {
		props: {
			banner,
		},
		revalidate: 60,
	}
}
