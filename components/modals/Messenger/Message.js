import React, { useState } from 'react'
import { Form, FormGroup, Input } from 'reactstrap'
import { Spinner, Label, Button, Container } from 'reactstrap'
import moment from 'moment';
import 'moment-timezone';

const Message = (props) => {
	
	const { message } = props
	const type = message.type

	const toLocalTime = (date) => {		
		const zone = 'Europe/London'
		const utcDate = moment.tz(date, zone).utc().format()
		const local = moment(utcDate).local().format('YYYY-MM-DD hh:mm:ss A')
		return local
	}
	
	const wrapperClass = `${type} message-wrap d-flex align-items-center`

	return (
		<div className={wrapperClass}>
			<div className='inner d-flex'>
				<div className='avatar'>
					<img className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded" src={message.avatar} alt="message" />
				</div>
				<div className='content'>
					<div className='d-flex header'>
						<div className='name'>{message.name}</div>
						<div className='time'>{toLocalTime(message.time)}</div>
					</div>
					<div className='message'>
						{message.content}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Message
