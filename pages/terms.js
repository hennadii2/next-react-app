import React from 'react'
import CommonLayout from '../components/layout/common-layout'
import { Container } from 'styled-bootstrap-grid'
import Banner from './layouts/Agri/components/Banner'
import { getBanner } from '../helpers/lib'

const titleStyles = { fontSize: 20, fontWeight: 'bold' }

const TermsOfUse = ({ banner }) => {
	return (
		<CommonLayout title='collection' parent='home' sidebar={false}>
			<Banner banner={banner} searchBar={false} />
			<section className='section-b-space about-section'>
				<Container>
					<h4 className='section-title mb-3 mt-4 text-center'>Terms Of Use</h4>
					<div className='p-2 mb-4'>
						<h4 style={titleStyles} className='mb-3'>
							User Agreement
						</h4>
						<p>This Agreement was last modified on 17th June 2017.</p>
						<p>
							This User Agreement describes the terms and conditions on which you are allowed to use our Website and our
							Services. We have incorporated by reference all linked information.
						</p>
						<h4 style={titleStyles} className='mb-3 mt-4'>
							In This User Agreement:
						</h4>
						<p>
							<strong>"Account"</strong> means the account you open when you register on the Website.
						</p>
						<p>
							<strong>"Buyer"</strong> means a User that investigates and purchases Seller Services or items from
							Sellers or identifies a Seller through the Website.
						</p>
						<p>
							<strong>"Agrixchange.com", "we", "our",</strong> or <strong>"us"</strong> means Agrixchange.com
						</p>
						<p>
							<strong>"Inactive Account"</strong> means a User Account that has not been logged into for a continuous 12
							month period.
						</p>
						<p>
							<strong>"Intellectual Property Rights"</strong> means any and all intellectual property rights, existing
							worldwide and the subject matter of such rights, including: (a) patents, copyright, rights in circuit
							layouts (or similar rights), registered designs, registered and unregistered trade marks, and any right to
							have confidential information kept confidential; and (b) any application or right to apply for
							registration of any of the rights referred to in paragraph (a), whether or not such rights are registered
							or capable of being registered and whether existing under any laws, at common law or in equity.
						</p>
						<p>
							<strong>"Listing"</strong> means a product offered by seller via the Website.
						</p>
						<p>
							<strong>"Seller"</strong> means a User that offers and provides Products or services or identifies as a
							Seller through the Website.
						</p>
						<p>
							<strong>"Seller Services"</strong> means all services or products provided by Sellers.
						</p>
						<p>
							<strong>"User", "you"</strong> or <strong>"your"</strong> means an individual who visits or uses the
							website
						</p>
						<p>
							<strong>"User Contract"</strong> means : (1) this User Agreement; (2) any other contractual provisions
							accepted by both the Seller and Buyer uploaded to the Website.
						</p>
						<p>
							<strong>"Website"</strong> means the websites operated by Agrixchange.com and available at:
							Agrixchange.com and any related Agrixchange.com service, tool or application.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Overview
						</h4>
						<p>By accessing and/or using the Website, you agree to the following terms with Agrixchange.com.</p>
						<p>
							We may amend this User Agreement and any linked information from time to time by posting amended terms on
							the Website.
						</p>
						<p>
							The Website is an online venue where Users buy and sell Seller Services and items. Buyers and Sellers must
							register for an Account in order to buy or sell Seller Services and/or items. The Website enables Users to
							connect buyers to sellers.
						</p>
						<h4 style={titleStyles} className='mb-3 mt-4'>
							Scope
						</h4>
						<p>
							Before using the Agrixchange.com Website, we recommend that you read the whole User Agreement, the Website
							policies and all linked information.
						</p>
						<p>
							You must read and accept all of the terms in, and linked to, this User Agreement. the Agrixchange.com
							Privacy Policy and all Website policies. We strongly recommend that, as you read this User Agreement, you
							understand the implications and its applications. By accepting this User Agreement, you agree that this
							User Agreement will apply whenever you use the Agrixchange.com Website, or when you use the tools we make
							available to interact with the Agrixchange.com Website. Some Agrixchange.com Websites may have additional
							or other terms that we provide to you when you use those services.
						</p>
						<h4 style={titleStyles} className='mb-3 mt-4'>
							Eligibility
						</h4>
						<p>You will not use the Agrixchange.com Website if you:</p>
						<ol>
							<li>
								<p className='mb-1'>1. are not able to form legally binding contracts; or</p>
							</li>
							<br />
							<li>
								<p className='mb-1'>2. are under the age of 16; or</p>
							</li>
							<li>
								<p className='mb-1'>
									3. a person barred from receiving and rendering services under the laws of the applicable
									jurisdiction; or
								</p>
							</li>
							<li>
								<p className='mb-1'>4. are suspended from using the Agrixchange.com Website.</p>
							</li>
						</ol>
						<p>
							Subject to your local laws, a person over 15 but under 18 can use an adult's account with the permission
							of the account holder. However, the account holder is responsible for everything done with that account.
						</p>
						<p>
							Users may provide a business name or a company name, which is to be associated with the User's Account.
							Users acknowledge and agree that where a business name or company name is associated with their Account,
							this User Agreement is a contract with the User as an individual (not the business or company) and Users
							remain solely responsible for all activity undertaken in respect of their Account.
						</p>
						<p>We may, at our absolute discretion, refuse to register a person or corporate entity as a User.</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Using Agrixchange.com
						</h4>
						<p>While using the Agrixchange.com Website, you will not:</p>
						<ol>
							<li>
								<p className='mb-1'>1. post content or items in inappropriate categories or areas on our websites;</p>
							</li>
							<br />
							<li>
								<p className='mb-1'>2. infringe any laws, third party rights or our policies;</p>
							</li>
							<li>
								<p className='mb-1'>
									3. circumvent or manipulate our fee structure, the billing process, or fees owed to Agrixchange.com;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									4. post false, inaccurate, misleading, defamatory or offensive content (including personal
									information);
								</p>
							</li>
							<li>
								<p className='mb-1'>
									5. take any action that may undermine the feedback or reputation systems (such as displaying,
									importing or exporting feedback information or using it for purposes unrelated to the Agrixchange.com
									Website);
								</p>
							</li>
							<li>
								<p className='mb-1'>
									6. transfer your Agrixchange.com account and User name to another party without our consent;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									7. distribute or post spam, unsolicited, or bulk electronic communications, chain letters, or pyramid
									schemes;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									8. distribute viruses or any other technologies that may harm Agrixchange.com, the Website, or the
									interests or property of Agrixchange.com users (including their Intellectual Property Rights, privacy
									and publicity rights) or is unlawful, threatening, abusive, defamatory, invasive of privacy, vulgar,
									obscene, profane or which may harass or cause distress or inconvenience to, or incite hatred of, any
									person;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									9. attempt to modify, translate, adapt, edit, decompile, disassemble, or reverse engineer any software
									programs used by us in connection with the Agrixchange.com Website;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									10. copy, modify or distribute rights or content from the Agrixchange.com Website or Agrixchange.com's
									copyrights and trademarks; or
								</p>
							</li>
							<li>
								<p className='mb-1'>
									11. harvest or otherwise collect information about Users, including email addresses, without their
									consent.
								</p>
							</li>
						</ol>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Fees And Services
						</h4>
						<p>
							We charge fees for certain services, such as introduction fees or listing upgrades and memberships. When
							you use a service that has a fee, you have an opportunity to review and accept the fees that you will be
							charged, which we may change from time to time and will update you by placing on our Website. We may
							choose to temporarily change the fees for our services for promotional events (for example, discounts on
							memberships) or new services, and such changes are effective when we post the temporary promotional event
							or new service on the Websites.
						</p>
						<p>Unless otherwise stated, all fees are quoted in United States Dollars.</p>
						<h4 style={titleStyles} className='mb-3 mt-4'>
							Promotion
						</h4>
						<p>
							We may display your company or business name, logo, images or other media, and public description of your
							profile as part of the Agrixchange.com Services and/or other marketing materials relating to the
							Agrixchange.com Website, except where you have explicitly requested that we do not do this and we have
							agreed to such request.
						</p>
						<h4 style={titleStyles} className='mb-3 mt-4'>
							Content
						</h4>
						<p>
							When you give us content, you grant us a non-exclusive, worldwide, perpetual, irrevocable, royalty-free,
							sub licensable (through multiple tiers) right to exercise any and all copyright, trademark, publicity, and
							database rights (but no other rights) you have in the content, in any media known now or in the future.
						</p>
						<p>
							You acknowledge and agree that: (1) we only act as a portal for the online distribution and publication of
							User content. We make no warranty that User content is actually made available on the Website. We have the
							right (but not the obligation) to take any action deemed appropriate by us with respect to your User
							content; (2) we have no responsibility or liability for the deletion or failure to store any content,
							whether or not the content was actually made available on the Website; and (3) any and all content
							submitted to the Website is subject to our approval. We may reject, approve or modify your User content at
							our sole discretion.
						</p>
						<p>You represent and warrant that your content:</p>
						<ol>
							<li>
								<p className='mb-1'>
									1. will not infringe upon or misappropriate any copyright, patent, trademark, trade secret, or other
									intellectual property right or proprietary right or right of publicity or privacy of any person;
								</p>
							</li>
							<br />
							<li>
								<p className='mb-1'>2. will not violate any law or regulation;</p>
							</li>
							<li>
								<p className='mb-1'>3. will not be defamatory or trade libellous;</p>
							</li>
							<li>
								<p className='mb-1'>4. will not be obscene or contain child pornography </p>
							</li>
							<li>
								<p className='mb-1'>
									5. will not contain the development, design, manufacture or production of missiles, or nuclear,
									chemical or biological weapons
								</p>
							</li>
							<li>
								<p className='mb-1'>6. will not contain material linked to terrorist activities</p>
							</li>
							<li>
								<p className='mb-1'>
									7. will not include incomplete, false or inaccurate information about User or any other individual;
									and
								</p>
							</li>
							<li>
								<p className='mb-1'>
									8. will not contain any viruses or other computer programming routines that are intended to damage,
									detrimentally interfere with, surreptitiously intercept or expropriate any system, data or personal
									information.
								</p>
							</li>
						</ol>
						<p>
							You acknowledge and agree that we may use or transfer your personal information. If you wish to withdraw
							your consent, you acknowledge and agree that we may be unable to provide you with access to the Website
							and Agrixchange.com Services and may close your Account.
						</p>
						<p>
							Information on the Website may contain general information about legal, financial, health and other
							matters. The information is not advice, and should not be treated as such. You must not rely on the
							information on the Website as an alternative to professional advice. If you have specific questions about
							any matter you should consult your professional adviser.
						</p>
						<p>
							We provide unmonitored access to third party content, including User feedback and articles with original
							content and opinions (or links to such third party content). We only act as a portal and have no liability
							based on, or related to, third party content on the Website, whether arising under the laws of copyright
							or other intellectual property, defamation, libel, privacy, obscenity, or any other legal discipline.
						</p>
						<p>
							The Website may contain links to other third party websites. We do not control the websites to which we
							link from the Website. We do not endorse the content, products, services, practices, policies or
							performance of the websites we link to from the Website. Use of third party content, links to third party
							content and/or websites is at your risk.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Advertising
						</h4>
						<p>
							Any website address posted on the Website, including in a listing, listing description, the situation
							report, must relate to a specific produce, or service on the Website. An example of a permissible website
							address would be the official business website.
						</p>
						<p>
							We may display sponsor advertisements and promotions on the Website. You acknowledge and agree that we
							shall not be responsible for any loss or damage of any kind incurred by you as a result of the presence of
							such advertisements/ promotions in the Website or your subsequent dealings with the Advertisers.
							Furthermore, you acknowledge and agree that content of sponsor advertisements or promotions is protected
							by copyrights, trademarks, service marks, patents or other intellectual property or proprietary rights and
							laws. Unless expressly authorized by Agrixchange.com or third party right holders, you agree not to
							modify, sell, distribute, appropriate or create derivative works based on such advertisement/promotions.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Identity / Know Your Customer
						</h4>
						<p>
							You authorize us, directly or through third parties, to make any inquiries we consider necessary to
							validate your identity. You must, at our request: (1) provide further information to us, which may include
							your date of birth and other information that will allow us to reasonably identify you; (2) take steps to
							confirm ownership of your email address or financial instruments; or (3) verify your information against
							third party databases or through other sources.
						</p>
						<p>
							You must also, at our request, provide copies of identification documents (such as your drivers' licence).
							We may also ask you to provide photographic identification holding a sign with a code that we provide as
							an additional identity verification step.
						</p>
						<p>Business certification and permits may also be requested.</p>
						<p>
							We reserve the right to close, suspend, or limit access to your Account, the Website and/or
							Agrixchange.com Services in the event we are unable to obtain or verify to our satisfaction the
							information which we request under this section.
						</p>
						<p>
							If you are not Agrixchange.com verified you may not be able to list your Agrixchange.com account, and
							other restrictions may apply. We reserve the right to close an Inactive Account.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Right To Refuse Service
						</h4>
						<p>
							We may close, suspend or limit your access to your Account without reason. Without limiting the foregoing,
							we may close, suspend or limit your access to your Account:
						</p>
						<ol>
							<li>
								<p className='mb-1'>
									1. if we determine that you have breached, or are acting in breach of, this User Agreement;
								</p>
							</li>
							<br />
							<li>
								<p className='mb-1'>
									2. if we determine that you have engaged, or are engaging, in fraudulent, or illegal activities;
								</p>
							</li>
							<li>
								<p className='mb-1'>3. you do not respond to account verification requests;</p>
							</li>
							<li>
								<p className='mb-1'>
									4. you do not complete account verification when requested within 3 months of the date of request;
								</p>
							</li>
							<li>
								<p className='mb-1'>5. to manage any risk of loss to us, a User, or any other person; or</p>
							</li>
							<li>
								<p className='mb-1'>6. for other similar reasons.</p>
							</li>
						</ol>
						<p>
							If we close your Account due to your breach of this User Agreement, you may also become liable for certain
							fees as described in this User Agreement. In the event that we close your Account, you will have no claim
							whatsoever against us in respect of any such suspension or termination of your Account.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Currencies
						</h4>
						<p>
							Some of the Websites will display rates in the local currency of that Website, in addition to the actual
							amount. These rates are based on a conversion from the originating currency using indicative market
							exchange rates. You understand and agree that these rates are only indicative and the amount specified in
							the origin currency is the actual amount.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Release
						</h4>
						<p>
							If you have a dispute with one or more Users, you release us (and our officers, directors, agents,
							subsidiaries, joint ventures and employees) from claims, demands and damages (actual and consequential) of
							every kind and nature, known and unknown, arising out of or in any way connected with such disputes.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Access And Interference
						</h4>
						<p>
							You agree that you will not use any robot, spider, scraper or other automated means to access the
							Agrixchange.com Website for any purpose without our express written permission.
						</p>
						<p>Additionally, you agree that you will not:</p>
						<ol>
							<li>
								<p className='mb-1'>
									1. take any action that imposes or may impose (in our sole discretion, exercised reasonably) an
									unreasonable or disproportionately large load on our infrastructure;
								</p>
							</li>
							<br />
							<li>
								<p className='mb-1'>
									2. interfere with, damage, manipulate, disrupt, disable, modify, overburden, or impair any device,
									software system or network connected to or used (by you or us) in relation to the Agrixchange.com
									Website or your Account, or assist any other person to do any of these things, or take any action that
									imposes, or may impose, in our discretion, an unreasonable or disproportionately large load on our
									infrastructure; copy, reproduce, modify, create derivative works from, distribute, or publicly display
									any content (except for your information) from the website's without the prior express written
									permission of Agrixchange.com and the appropriate third party, as applicable;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									3. interfere or attempt to interfere with the proper working of the website's, services or tools, or
									any activities conducted on or with the website's, services or tools; or
								</p>
							</li>
							<li>
								<p className='mb-1'>
									4. bypass our robot exclusion headers or other measures we may use to prevent or restrict access to
									the Website.
								</p>
							</li>
						</ol>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Closing Your Account
						</h4>
						<p>You may close your Account at any time. The option is located in the Account Settings.</p>
						<p>Account closure is subject to:</p>
						<ol>
							<li>
								<p className='mb-1'>1. paying any outstanding fees owing on the Account.</p>
							</li>
						</ol>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Privacy
						</h4>
						<p>
							We use your information as described in the Agrixchange.com Privacy Policy. If you object to your
							information being transferred or sold or used in this way then you may not use our services.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Indemnity
						</h4>
						<p>
							You will indemnify us (and our officers, directors, agents, subsidiaries, joint ventures and employees)
							against any claim or demand, including legal fees and costs, made against us by any third party due to or
							arising out of your breach of this Agreement, or your infringement of any law or the rights of a third
							party in the course of using the Agrixchange.com Website and Agrixchange.com Services.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Security
						</h4>
						<p>
							You must immediately notify us upon becoming aware of any unauthorized access or any other security breach
							to the Website, your Account or the Agrixchange.com Services and do everything possible to mitigate the
							unauthorized access or security breach (including preserving evidence and notifying appropriate
							authorities). You are solely responsible for securing your password. We will not be liable for any loss or
							damage arising from unauthorized access of your account resulting from your failure to secure your
							password.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							No Insurance Or Warranty
						</h4>
						<p>We do not offer any form of insurance, or other Buyer or Seller protection.</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							No Warranty as to Verification of Seller or buyer.
						</h4>
						<p>
							The verification of sellers on Agrixchange.com serves to safeguard buyers by ensuring sellers are legally
							registered companies. Inspections of the companies may be carried out by both Agrixchange.com and/or
							independent verification companies. Agrixchange.com does not verify the authenticity of any goods listed
							for sale by sellers (including without limitation to “Gold Suppliers” or “Platinum Suppliers” or verified
							suppliers) or the authority of sellers to offer any listed goods for sale. Agrixchange.com does not and
							cannot guarantee the authenticity or genuineness of any of goods listed for sale by sellers or the good
							standing of any buyer.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							No Warranty As To Each User's Purported Identity
						</h4>
						<p>
							Because User identification on the internet is difficult, we cannot and do not confirm each User's
							purported identity. We may provide information about a User, such as a strength or risk score,
							geographical location, or third party background check or verification of identity or credentials.
							However, such information is based solely on data that the User submits and we provide such information
							solely for the convenience of Users and the provision of such information is not an introduction,
							endorsement or recommendation by us.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							No Warranty As To Content On The Website
						</h4>
						<p>
							The Website is a dynamic time-sensitive website. As such, information on the Website will change
							frequently. It is possible that some information could be considered offensive, harmful, inaccurate or
							misleading or mislabelled or deceptively labelled accidentals by us or accidentally or purposefully by a
							third party.
						</p>
						<p>
							Our Services, the Website and all content on it are provided on an 'as is', 'with all faults' and 'as
							available' basis and without warranties of any kind either express or implied. Without limiting the
							foregoing, we make no representation or warranty about:
						</p>

						<ol>
							<li>
								<p className='mb-1'>1. the Website or any Seller Services or Agrixchange.com Services;</p>
							</li>
							<br />
							<li>
								<p className='mb-1'>
									2. the accuracy, reliability, availability, veracity, timeliness or content of the Website or any
									Seller Services or Agrixchange.com Services;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									3. whether the Website or Seller Services or Agrixchange.com Services will be up-to-date,
									uninterrupted, secure, error-free or non-misleading;
								</p>
							</li>
							<li>
								<p className='mb-1'>4. whether defects in the Website will be corrected;</p>
							</li>
							<li>
								<p className='mb-1'>
									5. whether the Website, the Seller Services or the Agrixchange.com Services or any data, content or
									material will be backed up or whether business continuity arrangements are in place in respect of the
									Website, Seller Services or Agrixchange.com Services;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									6. any third party agreements or any guarantee of business gained by you through the Website, Seller
									Services or Agrixchange.com Services or us; or
								</p>
							</li>
							<li>
								<p className='mb-1'>
									7. the Website, Seller Services or Agrixchange.com Services or infrastructure on which they are based,
									being error or malicious code free, secure, confidential or performing at any particular standard or
									having any particular function.
								</p>
							</li>
						</ol>
						<p>
							To the extent permitted by law, we specifically disclaim any implied warranties of title, merchantability,
							fitness for a particular purpose, quality, suitability and non-infringement.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Limitation Of Liability
						</h4>
						<p>
							In no event shall we, our related entities, our affiliates or staff be liable, whether in contract,
							warranty, tort (including negligence), or any other form of liability, for:
						</p>

						<ol>
							<li>
								<p className='mb-1'>
									1. any indirect, special, incidental or consequential damages that may be incurred by you;
								</p>
							</li>
							<br />
							<li>
								<p className='mb-1'>
									2. any loss of income, business or profits (whether direct or indirect) that may be incurred by you;
								</p>
							</li>
							<li>
								<p className='mb-1'>
									3. any claim, damage, or loss which may be incurred by you as a result of any of your transactions
									involving the Website.
								</p>
							</li>
						</ol>
						<p>
							The limitations on our liability to you above shall apply whether or not we, our related entities, our
							affiliates or staff have been advised of the possibility of such losses or damages arising.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Jurisdiction Limitations
						</h4>
						<p>
							As some jurisdictions do not allow some of the exclusions or limitations as established above, some of
							these exclusions or limitations may not apply to you. In that event, the liability will be limited as far
							as legally possible under the applicable legislation.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							No Class Actions
						</h4>
						<p>
							You and we agree that you and we will only be permitted to bring claims against the other only on an
							individual basis and not as a plaintiff or class member in any purported class or representative action or
							proceeding. Unless both you and we agree otherwise, the arbitrator may not consolidate or join more than
							one person's or party's claims and may not otherwise preside over any form of a consolidated,
							representative, or class proceeding. In addition, the arbitrator may award relief (including monetary,
							injunctive, and declaratory relief) only in favour of the individual party seeking relief and only to the
							extent necessary to provide relief necessitated by that party's individual claim(s). Any relief awarded
							cannot affect other Users.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Notices
						</h4>
						<p>
							Legal notices must be served on Agrixchange.com (in the case of Agrixchange.com) or to the email address
							you provide to Agrixchange.com during the registration process (in your case). Notice will be deemed given
							24 hours after email is sent, unless the sending party is notified that the email address is invalid or
							that the email has not been delivered. Alternatively, we may give you legal notice by mail to the address
							provided by you during the registration process. In such case, notice will be deemed given three days
							after the date of mailing.
						</p>
						<p>Any notices to Agrixchange.com must be given by registered ordinary post or by registered airmail.</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Severability
						</h4>
						<p>
							The provisions of this User Agreement are severable, and if any provision of this User Agreement is held
							to be invalid or unenforceable, such provision may be removed and the remaining provisions will be
							enforced. This Agreement may be assigned by us to an associated entity at any time, or to a third party
							without your consent in the event of a sale or other transfer of some or all of our assets. In the event
							of any sale or transfer you will remain bound by this User Agreement.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Interpretation
						</h4>
						<p>
							Headings are for reference purposes only and in no way define, limit, construe or describe the scope or
							extent of such section.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							No Waiver
						</h4>
						<p>
							Our failure to act with respect to an anticipated or actual breach by you or others does not waive our
							right to act with respect to subsequent or similar breaches. Nothing in this section shall exclude or
							restrict your liability arising out of fraud or fraudulent misrepresentation.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Communications
						</h4>
						<p>
							You consent to receive notices and information from us in respect of the Website and Services by
							electronic communication. You may withdraw this consent at any time, but if you do so we may choose to
							suspend or close your Account.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Additional Terms
						</h4>
						<p>
							It is important to read and understand all our policies as they provide the rules for trading on the
							Agrixchange.com website.
						</p>
						<p>
							Each of these policies may be changed from time to time. Changes take effect when we post them on the
							Agrixchange.com website. When using particular services on our website, you are subject to any posted
							policies or rules applicable to services you use through the website, which may be posted from time to
							time. All such policies or rules are incorporated into this User Agreement.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							General
						</h4>
						<p>
							This Agreement contains the entire understanding and agreement between you and Agrixchange.com. The
							following Sections survive any termination of this Agreement: Fees And Services (with respect to fees owed
							for our services), Release, Content, No Warranty As To Content, Limitation Of Liability, Indemnity, No
							Class Actions.
						</p>

						<h4 style={titleStyles} className='mb-3 mt-4'>
							Feedback
						</h4>
						<p>
							If you have any questions about this User Agreement or if you wish to report breaches of this User
							Agreement, please contact us by emailing us via the Contact Us page.
						</p>
					</div>
				</Container>
			</section>
		</CommonLayout>
	)
}

export default TermsOfUse

export async function getStaticProps() {
	const banner = await getBanner()

	return {
		props: {
			banner,
		},
		revalidate: 60,
	}
}
