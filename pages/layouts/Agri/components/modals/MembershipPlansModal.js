import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import SignForm from "./SignFormModal";
import { membershipService } from '../../../../../services';
import Plan from "../../../../../components/common/plan";

const MembershipPlans = ({ modal, toggle }) => {
  const [sortedMembership, setSortedMembership] = useState(null);
  const [rows, setRows] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPlanData, setSelectedPlanData] = useState('');
  const [iAm, setIAm] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  useEffect(() => {
    membershipService.getMembership().then((res) => {
      const { membership_types = [] } = res;
      const sorted = membership_types.sort((a, b) => {
        if (parseFloat(a?.membership_year_priceNUM) < parseFloat(b?.membership_year_priceNUM)) return -1;
        if (parseFloat(a?.membership_year_priceNUM) > parseFloat(b?.membership_year_priceNUM)) return 1;
        return 0;
      });
      setSortedMembership(sorted);
    });
  }, []);

  useEffect(() => {
    const newRows = [];
    const plans = sortedMembership?.map(plan => plan?.name);
    newRows.push(plans);
    const price = sortedMembership?.map(plan => parseFloat(plan?.membership_month_priceNUM)?.toFixed(2));
    newRows.push(price);
    for (let i = 0; i < 5; i++) {
      const indexStr = (i + 1)?.toString()?.padStart(2, '0');
      const nameKey = `option_${indexStr}_name`;
      const valueKey = `option_${indexStr}_YN`;
      const option = sortedMembership?.map(plan => plan?.[valueKey]);
      option?.unshift(sortedMembership?.[0]?.[nameKey]);
      newRows.push(option);
    };

    setRows(newRows);
  }, [sortedMembership]);

  useEffect(() => {
  }, [iAm]);

  const onPlanSelect = (name) => {
    if (name) {
      const selectedPlanData = sortedMembership?.find(plan => plan?.name === name);
      setSelectedPlan(name);
      setSelectedPlanData(selectedPlanData);
      if (selectedPlanData?.name === 'Blue') {
        setShowSignupModal(true);
      }
    }
  }

  const onSubscribe = () => {
    setShowSignupModal(true);
  }

  const getIAmContent = () => {
    return (
      <ModalBody className="p-3 modal1">
        <Row className="compare-modal">
          <Col lg="12">
            <div className="modal-role-title">I am a ...</div>
            <div className="modal-role-description">
              <Button onClick={() => setIAm('buyer')} className="btn btn-purple btn-post btn-sm">Buyer</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={() => setIAm('seller')} className="btn btn-purple btn-post btn-sm">Seller</Button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    );
  };

  const getPlanContent = () => {
    return (
      <ModalBody className="p-3 show-grid plan-modal">
        <div className="modal-plan-title">{iAm.charAt(0).toUpperCase() + iAm.slice(1)} plans</div>
        <Plan rows={rows || []} onPlanSelect={onPlanSelect} />
      </ModalBody>
    );
  };

  const getMySubscriptionContent = () => {
    return (
      <>
        <ModalHeader className="subscriptionHeader">
          <div className="" id="modal-subscription-title">
            <a onClick={() => setSelectedPlan('')} href={'#'} className="link_back">
              <i
                className="fa fa-angle-left btnBack"
                aria-hidden="true"
                title="Subscription"
              ></i>
              Back
            </a>
          </div>
          <div className="modal-subscription-title">My Subscription</div>
        </ModalHeader>
        <ModalBody className="p-3 show-grid subscriptionModalBody">
          <Row>
            <Col xs={6} md={2}>
              Plan
            </Col>
            <Col xs={6} md={2}>
              Price
            </Col>
            <Col xs={6} md={2}>
              Per
            </Col>
            <Col xs={6} md={3}>
              Total Price Per Year
            </Col>
            <Col xs={6} md={3}>
              Subscibe
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={2}>
              {`${selectedPlanData?.name ?? ''} Annual`}
            </Col>
            <Col xs={6} md={2}>
              {parseFloat(selectedPlanData?.membership_year_priceNUM ?? 0)?.toFixed(2)}
            </Col>
            <Col xs={6} md={2}>
              Year
            </Col>
            <Col xs={6} md={3}>
              {parseFloat(selectedPlanData?.membership_year_priceNUM ?? '')?.toFixed(2)}
            </Col>
            <Col xs={6} md={3}>
              <Button onClick={() => onSubscribe()} className="btn btn-solid btn-gold-plan btn-subscription btn-post btn-sm">
                <i
                  className="fa fa-dollar"
                  aria-hidden="true"
                ></i>
                Subscription
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={2}>
              {`${selectedPlanData?.name} Monthly`}
            </Col>
            <Col xs={6} md={2}>
              {parseFloat(selectedPlanData?.membership_month_priceNUM ?? 0)?.toFixed(2)}
            </Col>
            <Col xs={6} md={2}>
              Month
            </Col>
            <Col xs={6} md={3}>
              {(parseFloat(selectedPlanData?.membership_month_priceNUM ?? '') * 12)?.toFixed(2)}
            </Col>
            <Col xs={6} md={3}>
              <Button onClick={() => onSubscribe()} className="btn btn-solid btn-gold-plan btn-subscription btn-post btn-sm">
                <i
                  className="fa fa-dollar"
                  aria-hidden="true"
                ></i>
                Subscription
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </>
    );
  };

  const getContent = () => {
    if (showSignupModal) {
      return null;
    }
    if (!iAm) {
      return getIAmContent();
    } else {
      if (!selectedPlan) {
        return getPlanContent();
      } else {
        return getMySubscriptionContent();
      }
    }
  };

  return (
    <>
      <Modal
        contentClassName='modal-role'
        modalClassName="modalRole"
        centered
        isOpen={modal}
        toggle={toggle}
        className={!iAm ? 'membership-modal' : 'plan-modal modal-xl'}
      >
        {getContent()}
      </Modal>
      {!!showSignupModal && <SignForm modal={showSignupModal} toggle={toggle} page="signup" iAm={iAm} selectedPlan={selectedPlan} />}
    </>
  );
};

export default MembershipPlans;
