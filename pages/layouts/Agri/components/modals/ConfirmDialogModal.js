import React, { useState } from "react";
import { Redirect } from "react-router";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
//import { Edit, CheckSquare, Slash, Save, Upload, Bookmark } from 'react-feather';
import {
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Label,
    Form,
    FormGroup,
    Container,
} from "reactstrap";


const ConfirmDialog = ({ modal, toggle, caption, data }) => {    

    const handleYes = (index) => {
        
    };

    const handleNo = (index) => {
        
    };

    return (

        <div>
            <div id="advert-add-modal">
              <Modal 
                  contentClassName = 'modal-advert'
                  modalClassName = "modalAdvert"
                  centered
                  isOpen={modal}
                  className='advert-add-modal modal-dialog'>
                  <div>
                      <ModalBody className="p-3">
                          <section className="ratio_45 section-b-space">
                            <Container>
                                <Row className="compare-modal">  
                                    <Col lg="12">  
                                        <div className="modal-role-title">{caption}</div>
                                        <div className="modal-role-description text-center">
                                            <Button onClick={toggle} className="btn btn-solid btn-blue-border btn-blue-plan btn-post btn-md">No</Button>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                            <Button onClick={() => handleYes(data)} className="btn btn-solid btn-blue-plan btn-post btn-md">Yes</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                          </section>
                      </ModalBody>
                  </div>
              </Modal>
            </div>     
        </div>
    );
};

export default ConfirmDialog;
