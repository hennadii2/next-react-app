import React, { useState, Fragment } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs'
import { Save, DollarSign, Clipboard } from 'react-feather'

import MyAccounts from '../seller/SellerAccounts.js'

const Accounts = ({ membershipTypes }) => {
	return <MyAccounts membershipTypes={membershipTypes} />
}

export default Accounts
