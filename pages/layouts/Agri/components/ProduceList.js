import React from 'react'
import { Container, Row, Col, Media } from 'reactstrap'
import Link from 'next/link'
import getConfig from 'next/config'
import { getValidUrl } from '../../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig()
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`

const CategoryContent = ({ img, title, link, height, bg }) => {
	let styles = {
		width: '100%',
		height: `${height ?? 200}px`,
	}
	if (bg) {
		styles = { ...styles, background: bg }
	} else {
		styles = {
			...styles,
			backgroundPosition: 'center center',
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat',
			backgroundImage: `url(${encodeURI(`${img}`)})`,
		}
	}
	return (
		<Col lg='4' className='produce-list-block mb-4'>
			<Link href={link}>
				<a href='#'>
					<div className={`collection-banner produce-card`}>
						<div className='img-part'>
							<Media alt={title}>
								<div style={styles} />
							</Media>
						</div>
						<div
							className='contain-banner banner-5'
							style={{ display: 'flex', justifyContent: 'center', padding: 0, background: 'rgba(0, 0, 0, .3)' }}
						>
							<div>
								<h4 style={{ marginBottom: 0 }}>{title}</h4>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</Col>
	)
}

const ProduceList = ({ sectionClass, itemHeight = 200, categories, type, bg, title }) => {
	return (
		<Container className='mt-5'>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<section className={sectionClass} style={{ width: '100%', maxWidth: 1200 }}>
					<h4 className='section-title mt-4 mb-4-5 text-center'>{title || 'Our Produce Categories'}</h4>
					<Row className='partition6'>
						{categories &&
							categories.map((data, i) => {
								return (
									<CategoryContent
										key={i}
										height={itemHeight}
										img={contentsUrl + '' + data.main_produce_image01ISfile}
										title={data.name}
										bg={bg}
										link={getValidUrl(`/${type}/${data.numeric_id}/${data.name}`)}
									/>
								)
							})}
					</Row>
				</section>
			</div>
		</Container>
	)
}

export default ProduceList
