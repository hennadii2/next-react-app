import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router";
import Link from "next/link";
import { Bar, Line, Pie } from "react-chartjs-2";
import Chart from 'react-google-charts'
import { ToastContainer } from "react-toastify";
import { Award, Printer, MessageCircle } from 'react-feather';
import {
    Media,
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Collapse,
    Button,
    Input,
    Label,
    Form,
    FormGroup,
    Container,
    Table
} from "reactstrap";

import logo from "../../../../../public/assets/images/banner.jpg";


const statePie = {
  labels: ['New Harvest', 'Storage', 'Unavailable'],
  datasets: [
    {
      label: 'Rainfall',
      backgroundColor: [
        '#B21F00',
        '#C9DE00',
        '#2FDE00',
      ],
      hoverBackgroundColor: [
      '#501800',
      '#4B5000',
      '#175000',
      ],
      data: [65, 59, 80]
    }
  ]
}

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};


const LineData = [
  ['x', 'Granny Smith', 'Pink Lady'],
  [0, 0, 0],
  [1, 10, 5],
  [2, 23, 15],
  [3, 17, 9],
  [4, 18, 10],
  [5, 9, 5],
  [6, 11, 3],
  [7, 27, 19],
]
const LineChartOptions = {
  hAxis: {
    title: 'Time',
  },
  vAxis: {
    title: 'Popularity',
  },
  series: {
    1: { curveType: 'function' },
  },
}

const SellerDetailsModal = ({ modal, toggle }) => {

    const handleToggle = (formType) => {
        setForm(formType); 
    };
    const hiddenToggle = (frm) => {
        toggle();
    };

    return (

        <div>
            <div id="sellerDetails">
              <Modal 
                  contentClassName = 'modal-seller-details'
                  modalClassName = "modalSellerDetails"
                  centered
                  isOpen={modal}                  
                  className='seller-details-modal'>
                  <div>
                      <ModalHeader toggle={toggle}>Seller</ModalHeader>                      
                      <ModalBody className="p-3">
                          <section className="ratio_45 section-b-space">
                            <Container>
                                <Row className="partition4">
                                    <Col md="12">                                            
                                        <Row className="mb-4">
                                            <Col md="12">
                                                <img
                                                    src={logo}
                                                    alt="logo"
                                                    className="img-fluid image_zoom_1 blur-up lazyloaded"
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Col md="6">
                                                <div className="buyer-info">
                                                    <h5>Company Name</h5>
                                                    <h5>First Name && Last Name</h5>
                                                </div>                                                
                                            </Col> 
                                            <Col md="6">
                                                
                                            </Col>                                       
                                        </Row>                                        
                                        <Row>                                   
                                            <Col md="6">
                                                <div className="buyer-info">
                                                    <h6>Location</h6>
                                                    <h6>Tag: Produce tag 1 Tag 2 etc</h6>
                                                </div>                                                
                                            </Col> 
                                            <Col md="6">

                                            </Col>                                       
                                        </Row>                                                                             
                                    </Col>                                
                                </Row>

                            </Container>
                            <Row className="mb-4">
                                <Col md="12" className="np">
                                    <div>
                                       <Chart
                                          width={'100%'}
                                          height={'410px'}
                                          chartType="LineChart"
                                          loader={<div>Loading Chart</div>}
                                          data={LineData}
                                          options={LineChartOptions}
                                          rootProps={{ 'data-testid': '2' }}
                                        />                                                     
                                    </div>
                                    <div>
                                          <Pie
                                              data={statePie}
                                              options={{
                                                title:{
                                                  display:true,
                                                  fontSize:20
                                                },
                                                legend:{
                                                  display:true,
                                                  position:'right'
                                                }
                                              }}
                                            />                                                     
                                    </div>                                                
                                </Col>
                            </Row>                             
                          </section>
                      </ModalBody>
                  </div>
              </Modal>
            </div>     
        </div>
    );
};

export default SellerDetailsModal;
