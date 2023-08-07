import React, { useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { Slider4 } from "../../../../services/script";
import { Media, Container, Row, Col, Input, Button } from "reactstrap";

const SearchFilter = ({ sectionClass }) => {

  return (
      <section className={sectionClass}>
        <Container>
            <Col className="mb-3 map-filter">
                <Row>
                  <Col xs={6} md={6}>
                    <select className="form-control" id="userType" required="">
                        <option>Apple</option>
                        <option>Apricot</option>
                        <option>Artichokes</option>
                        <option>Asparagus</option>
                        <option>Avocado</option>
                        <option>Baby Corn</option>
                    </select>
                  </Col>
                  <Col xs={6} md={6}>
                    <select className="form-control" id="userType" required="">
                        <option>Variety</option>
                        <option>Variety 1</option>
                        <option>Variety 2</option>
                        <option>Variety 3</option>
                    </select>
                  </Col>
                </Row>
            </Col>                      
            <Col className="mb-2">
              Filter by:
            </Col>  
            <Col className="mb-3 map-filters">
                <Row>
                  <Col xs={6} md={3}>
                      <Input type="text" className="form-control" id="company" placeholder="Company"
                        required="" /> 
                  </Col>
                  <Col xs={6} md={2}>
                    <Input type="text" className="form-control" id="country" placeholder="Country"
                        required="" />
                  </Col>
                  <Col xs={6} md={2}>
                    <Input type="text" className="form-control" id="month" placeholder="Month"
                      required="" />  
                  </Col>
                  <Col xs={6} md={2}>
                    <select className="form-control" id="season" required="">
                      <option>Season</option>
                      <option>Season 1</option>
                      <option>Season 2</option>
                      <option>Season 3</option>
                    </select>
                  </Col>  
                  <Col xs={6} md={2}>
                    <Button className="btn btn-solid btn-platinum-plan btn-sm btn-post">
                              <i className='fa fa-search'></i>
                              Filter</Button>
                  </Col>
                </Row>
            </Col>
        </Container>
      </section>
  );
};
export default SearchFilter;
