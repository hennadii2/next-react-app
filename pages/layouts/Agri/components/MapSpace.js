import React, { useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { Slider4 } from "../../../../services/script";
import { Media, Container, Row, Col } from "reactstrap";
import { Map, GoogleApiWrapper } from 'google-map-react';


const MapSpace = ({ sectionClass }) => {

  return (
      <section className={sectionClass}>
        <Container>
          <Row>
            <Col md="12">
              <h4 className="section-title">Map</h4>
            </Col>
            <Col md="12">
              
            </Col>
          </Row>
        </Container>
      </section>
  );
};
export default MapSpace;
