import React from 'react';
import { Col, Row, Button } from "reactstrap";

const Plan = ({rows, onPlanSelect}) => {
    const plans = rows[0] || [];
    const price = rows[1] || [];
    const getOptionContent = (option, index) => {
        if (index === 0) {
          return (
            <div className="plan-heading mb-3">
              <h4 mt={3} className="mt-3 mb-3 plan-name">
                {option}
              </h4>
              <span className="text-small text-muted">Sample summary</span>
            </div>
          );
        }
    
        if (['1', '0'].includes(option)) {
          return option === '1' ? (
            <div className="pt-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0b8b0b" className="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </div>
          ) : null;
        }
    
        return option;
    };
    return (
        <>
            <Row>
            {/* <Col xs={6} md={1}></Col> */}
            <Col xs={6} md={2}></Col>
            {
                plans.map((plan, index) => (
                <Col xs={6} md={2} key={plan}>
                    <div className="plan-heading mb-3">
                    <h4 mt={3} className="mt-3 mb-3 plan-name">
                        {plan}
                    </h4>
                    <div className="d-flex align-items-start mb-3">
                        <span className="h3 plan-currency">$</span>
                        <span className="mb-0 plan-price">{price[index]}</span>
                    </div>
                    <span className="text-small text-muted">Per user, per month</span>
                    </div>
                    <Button className="btn btn-post btn-signup btn-lg mb-2" onClick={() => onPlanSelect(plan)}>
                        Get {plan}
                    </Button>
                </Col>
                ))
            }
            {/* <Col xs={6} md={1}></Col> */}
            </Row>
            {
                rows.slice(2).map((option, index) => (
                    <Row key={index}>
                        {/* <Col xs={6} md={1}></Col> */}
                        {
                        option?.map((op, ii) => (
                            <Col xs={6} md={2} key={ii}>
                                {getOptionContent(op, ii)}
                            </Col>          
                        ))
                        }
                        {/* <Col xs={6} md={1}></Col> */}
                    </Row>
                ))
            }
        </>
    );
};

export default Plan;