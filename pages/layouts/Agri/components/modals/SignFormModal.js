import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useRouter } from 'next/router';
import { Alert } from '../../../../../components/common/Alert';
import {
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Label,
} from "reactstrap";

import { userService, membershipService, alertService } from '../../../../../services';


const SignForm = ({ modal, toggle, page, selectedPlan, iAm }) => {

  const [state, setState] = useState({
    email: "",
    password: "",
    subscription: selectedPlan,
  });

  const [form, setForm] = useState(page);
  const [subscriptions, setSubscriptions] = useState([]);
  useEffect(() => {
    membershipService.getMembership().then((res) => {
      setSubscriptions(res.membership_types);
    });
  }, []);

  useEffect(() => {
    setState({
      ...state,
      subscription: selectedPlan,
    });
  }, [selectedPlan]);

  const handleToggle = (formType) => {
    setForm(formType);
  };
  const hiddenToggle = (frm) => {
    toggle();
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value
    });
  }

  // form validation rules
  const validationSigninSchema = Yup.object().shape({
    login_email: Yup.string().required(''),
    login_password: Yup.string().required(''),
  });

  const validationSignupSchema = Yup.object().shape({
    first_name: Yup.string().required(''),
    last_name: Yup.string().required(''),
    email: Yup.string().required(''),
    password: Yup.string().required(''),
    confirmPassword: Yup.string().required(''),
    typeISbb_agrix_users_typesID: Yup.string().required(''),
    membershipISbb_agrix_membership_typesID: Yup.string().required('')
  });

  const formSigninOptions = { resolver: yupResolver(validationSigninSchema) };
  const formSignupOptions = { resolver: yupResolver(validationSignupSchema) };

  // get functions to build form with useForm() hook
  const { register, formState, handleSubmit } = useForm(formSigninOptions);
  const { register: register2, formState: formState2, handleSubmit: handleSubmit2 } = useForm(formSignupOptions);

  const { errors } = formState;
  const { errors: errors2 } = formState2;

  const router = useRouter();

  function onSignin({ login_email, login_password }) {
    return userService.login(login_email, login_password)
      .then((user) => {
        if(!user){
          alert('login failed');
        }else{
          var role = 'buyer';
          // get return url from query parameters or default to '/'
          if (user.typeISbb_agrix_users_typesID === "1")
            role = 'admin';
          else if (user.typeISbb_agrix_users_typesID === "2")
            role = 'seller';
          else
            role = 'buyer';

          window.location.href = "/" + role + "/dashboard";
        }
      })
      .catch(alertService.error);
  }

  function onSubmit(user) {
    return userService.register(user)
      .then((user) => {
        handleToggle("signin");
        alertService.success('Thank you for registering, please login below', { keepAfterRouteChange: true });
      })
      .catch(alertService.error);

  }

  return (

    <div>
      <div id="signinForm">
        <Modal
          contentClassName='modal-signin'
          modalClassName="modalSignin"
          centered
          isOpen={modal}
          toggle={() => hiddenToggle(form)}
          className='signin-modal modal-md'>
          <div className={form == "signin" ? "show" : "hide"}>
            <ModalHeader className="signFormHeader border-0 bg-dark px-4">
              Sign in
            </ModalHeader>
            <ModalBody className="p-3 show-grid">
              <form onSubmit={handleSubmit(onSignin)}>
                <Col className="mb-3">
                  <Alert />
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <i className="fa fa-envelope-o position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                    <input type="text" {...register('login_email')} className={`form-control ${errors.login_email ? 'is-invalid' : ''}`} name="login_email" placeholder="Email" />
                    <div className="invalid-feedback">{errors.login_email?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <i className="fa fa-lock position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                    <input type="password" {...register('login_password')} className={`form-control ${errors.login_password ? 'is-invalid' : ''}`} id="login_password" name="login_password" placeholder="Enter password" />
                    <div className="invalid-feedback">{errors.login_password?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <Input className="form-check-input" type="checkbox" id="keep-signed" />
                    <Label className="form-check-label fs-sm" for="keep-signed">Keep me signed in</Label>
                  </div>

                  <a href='#' className="nav-link-style fs-ms signLink" onClick={() => handleToggle("forgot")}>Forgot password?</a>
                </Col>
                <Col md="4" className="mb-4 offset-4">
                  <Button disabled={formState.isSubmitting} className="btn btn-signup btn-post btn-lg">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Sign in
                  </Button>
                  {/*<Button onClick={OnSigninEvent} className="btn btn-signup btn-post btn-lg">Sign in</Button>*/}
                </Col>
                <Col className="mb-5">
                  Don't have an account? <a href='#' className="signLink" onClick={() => handleToggle("signup")}>Sign up</a>
                </Col>
              </form>
            </ModalBody>
          </div>
          <div className={form == "signup" ? "show" : "hide"}>
            <ModalHeader className="signFormHeader border-0 bg-dark px-4">
              Sign up
            </ModalHeader>
            <ModalBody className="p-3 show-grid">
              <form onSubmit={handleSubmit2(onSubmit)}>
                <Col className="mb-3">
                  <Alert />
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <input type="text" name="first_name" {...register2('first_name')} className={`form-control ${errors2.fname ? 'is-invalid' : ''}`} placeholder="First Name*" />
                    <div className="invalid-feedback">{errors2.fname?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <input type="text" name="last_name" {...register2('last_name')} className={`form-control ${errors2.lname ? 'is-invalid' : ''}`} placeholder="Last Name*" />
                    <div className="invalid-feedback">{errors2.lname?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <input type="text" name="email" {...register2('email')} className={`form-control ${errors2.email ? 'is-invalid' : ''}`} placeholder="Email*" />
                    <div className="invalid-feedback">{errors2.email?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <input type="password" name="password" {...register2('password')} className={`form-control ${errors2.password ? 'is-invalid' : ''}`} placeholder="Enter password*" />
                    <div className="invalid-feedback">{errors2.password?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <input type="password" name="confirmPassword" {...register2('confirmPassword')} className={`form-control ${errors2.confirmPassword ? 'is-invalid' : ''}`} placeholder="Enter Confirm password*" />
                    <div className="invalid-feedback">{errors2.confirmPassword?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <select className={`form-control ${errors2.typeISbb_agrix_users_typesID ? 'is-invalid' : ''}`} name="typeISbb_agrix_users_typesID" {...register2('typeISbb_agrix_users_typesID')} value={iAm} >
                      <option value='2'>Seller</option>
                      <option value='3'>Buyer</option>
                    </select>
                    <div className="invalid-feedback">{errors2.typeISbb_agrix_users_typesID?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="input-group">
                    <select name="membershipISbb_agrix_membership_typesID" {...register2('membershipISbb_agrix_membership_typesID')} className={`form-control ${errors2.membershipISbb_agrix_membership_typesID ? 'is-invalid' : ''}`} onChange={handleChange} value={state.subscription}>
                      {subscriptions.map(item => (
                        <option key={item.name} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{errors2.membershipISbb_agrix_membership_typesID?.message}</div>
                  </div>
                </Col>
                <Col className="mb-3">
                  <Label className={state.subscription === "Blue" ? "form-check-label show" : "form-check-label hide"}>
                    Please select which payment gateway you would like to use.
                  </Label>
                  <Label className={state.subscription === "Gold" || state.subscription === "Platinum" ? "form-check-label show" : "form-check-label hide"}>
                    You have chosen {state.subscription} plan.
                  </Label>
                </Col>
                <Col className="mb-3">
                  <div className="form-check">
                    <Input className="form-check-input" type="checkbox" id="keep-signed" />
                    <Label className="form-check-label fs-sm" for="keep-signed">

                      <a className="signLink" href="{/terms}">Agree to accept Terms and Conditions</a>

                    </Label>
                  </div>
                </Col>
                <Col md="4" className="mb-4 offset-4">
                  <Button disabled={formState.isSubmitting} className="btn btn-signup btn-post btn-lg">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Sign up
                  </Button>
                </Col>
                <Col className="mb-5">
                  Already have an account? <a className="signLink" onClick={() => handleToggle("signin")}>Sign in</a>
                </Col>
              </form>
            </ModalBody>
          </div>
          <div className={form == "forgot" ? "show" : "hide"}>
            <ModalHeader className="signFormHeader border-0 bg-dark px-4">
              Forgot your password?
            </ModalHeader>
            <ModalBody className="p-3 show-grid">
              <Col className="mb-4">
                Change your password by typing in your email below - you will be sent a reset password email
              </Col>
              <Col className="mb-3">

                <Input type="text" className="form-control" id="email" placeholder="Email"
                  required="" />
              </Col>


              <Col className="mb-4">
                <Button className="btn btn-signup btn-post btn-lg">Send email</Button>
              </Col>
              <Col className="mb-3">
                <a onClick={() => handleToggle('signin')} href={'#'} className="link_back signLink">
                  <i
                    className="fa fa-angle-left btnBack"
                    aria-hidden="true"
                    title="Subscription"
                  ></i>
                  Back
                </a>
              </Col>
            </ModalBody>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SignForm;
