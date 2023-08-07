import React, { useState, useContext, useEffect } from 'react'
import { Form, FormGroup, Input } from 'reactstrap'
import { Spinner, Label, Button, Container } from 'reactstrap'
import { MessengerContext } from '../../../helpers/messenger/MessengerContext'
import moment from 'moment';
import 'moment-timezone';

const User = (props) => {

	const { user } = props

	const messengerContext = useContext(MessengerContext)
	const activeUser = messengerContext.activeUser
	const onActiveUser = messengerContext.onActiveUser

	const toLocalTime = (date) => {		
		const zone = 'Europe/London'
		const utcDate = moment.tz(date, zone).utc().format()
		const local = moment(utcDate).local().format('YYYY-MM-DD hh:mm:ss A')
		return local
	}

	return (
		<div 
			className={`user d-flex align-items-center justify-content-between ${(user.long_id === activeUser.long_id) ? 'active' : ''}`}
			onClick={() => {onActiveUser(user)}}
		>
			<div className='d-flex align-items-center'>
				<div className='avatar'>
					<img className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded" src={user.avatar} alt="user" />
				</div>
				<div className='content'>
					<div className='name'>{user.name}</div>
					<div className='status'>{user.status}</div>
				</div>
			</div>
			<div className='info'>
				{user.time && (
					<div className='time'>{toLocalTime(user.time)}</div>
				)}
				{user.newMessages.length > 0 && (
					<div className='new-message'>{user.newMessages.length}</div>
				)}
			</div>
		</div>
	)
}

export default User
