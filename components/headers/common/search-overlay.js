import React, { Fragment, useContext, useEffect, useState } from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row,
  Media,
  Label,
} from "reactstrap";
import { getFormClient } from "../../../services/constants";
import { post } from "../../../services/axios";
import { AuthContext } from "../../../helpers/auth/AuthContext";
import { getValidUrl } from '../../../helpers/utils/helpers';

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const SearchOverlay = () => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const isAuth = authContext.isAuthenticated;
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered;
  const onTarget = authContext.onTarget;

  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [produces, setProduces] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [noResult, setNoResult] = useState(false);

  useEffect(() => {
    const getProduceTypes = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_produce_types");
      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          const result = response.data.list;

          const categories = result.filter(
            (item) => item.refers_toISbb_agrix_produce_typesID === null
          );
          const categoryIds = categories.map((category) => category.numeric_id);
          setCategoryIds(categoryIds);

          let subCategories = [];
          for (let catId of categoryIds) {
            const subCats = result.filter(
              (item) => item.refers_toISbb_agrix_produce_typesID === catId
            );
            subCategories = [...subCategories, ...subCats];
          }
          const subCategoryIds = subCategories.map((sub) => sub.numeric_id);
          setSubCategoryIds(subCategoryIds);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    getProduceTypes();
  }, []);

  const onSearchClosed = () => {
    setNoResult(false);
    document.getElementById("search-overlay").style.display = "none";
  };

  const onKeyPressed = async (e) => {
    if (e.key === "Enter") {
      const searchVal = e.target.value;
      let formData = getFormClient();
      formData.append("api_method", "search");
      formData.append("search_text", searchVal);
      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          const result = response.data.results;
          if (
            result.sellers.length === 0 &&
            result.buyers.length === 0 &&
            result.produce_types.length === 0
          ) {
            setNoResult(true);
          } else {
            setSellers(result.sellers);
            setBuyers(result.buyers);
            setProduces(result.produce_types);
          }
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    }
  };

  const onSellerClicked = (seller) => {
    onSearchClosed();    
    router.push(getValidUrl(`/seller/detail/${seller.numeric_id}/${seller.name}`));
  };

  const onBuyerClicked = () => {};

  const onProduceClicked = (produce) => {
    onSearchClosed();
    if (categoryIds.includes(produce.numeric_id))
      router.push(getValidUrl(`/produce/${produce.numeric_id}/${produce.name}`));
    else if (subCategoryIds.includes(produce.numeric_id))
      router.push(getValidUrl(`/produce-sub/${produce.numeric_id}/${produce.name}`));
  };

  return (
    <div id="search-overlay" className="search-overlay">
      <div>
        <span
          className="closebtn"
          onClick={onSearchClosed}
          title="Close Overlay"
        >
          <i
            className="fa fa-arrow-left"
            aria-hidden="true"
            style={{ fontSize: 32 }}
          ></i>
        </span>
        <div className="overlay-content">
          <Container>
            <Button type="button" className="btn btn-primary">
              <i className="fa fa-search"></i>
            </Button>
            <FormGroup>
              <Input
                type="text"
                className="form-control"
                id="btnSearch"
                placeholder="Search..."
                onKeyUp={onKeyPressed}
              />
            </FormGroup>
          </Container>
          <Container
            style={{
              marginTop: "80px",
              backgroundColor: "white",
              opacity: 1,
              maxHeight: "500px",
              overflow: "auto",
            }}
          >
            {noResult && (
              <div className="d-flex justify-content-center my-5">
                <h3 className="font-weight-bold">Sorry, there is no result.</h3>
              </div>
            )}
            <Fragment>
              {sellers.length > 0 && (
                <div className="mt-3">
                  <Label style={{ fontSize: 18, fontWeight: "bold" }}>
                    Sellers
                  </Label>
                  <Row>
                    {sellers.map((seller) => (
                      <Col md="3" key={seller.numeric_id}>
                        <a
                          onClick={() => onSellerClicked(seller)}
                          style={{ cursor: "pointer" }}
                        >
                          <Media
                            src={
                              seller.companylogoISfile
                                ? contentsUrl + seller.companylogoISfile
                                : ""
                            }
                            className="img-fluid-ads"
                            alt={seller.company}
                            style={{
                              objectFit: "cover",
                              width: "90%",
                              height: "120px",
                              borderRadius: "5px",
                            }}
                          />
                          <Label>{seller.company}</Label>
                        </a>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Fragment>
            <Fragment>
              {buyers.length > 0 && (
                <div className="mt-3">
                  <Label style={{ fontSize: 18, fontWeight: "bold" }}>
                    Buyers
                  </Label>
                  <Row>
                    {buyers.map((buyer) => (
                      <Col md="3" key={buyer.numeric_id}>
                        <a href="#" onClick={onBuyerClicked}>
                          <Media
                            src={
                              buyer.companylogoISfile
                                ? contentsUrl + buyer.profilepictureISfile
                                : ""
                            }
                            className="img-fluid-ads"
                            alt={buyer.first_name + " " + buyer.last_name}
                            style={{
                              objectFit: "cover",
                              width: "90%",
                              height: "120px",
                              borderRadius: "5px",
                            }}
                          />
                          <Label>
                            {buyer.first_name + " " + buyer.last_name}
                          </Label>
                        </a>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Fragment>
            <Fragment>
              {produces.length > 0 && (
                <div className="mt-3">
                  <Label style={{ fontSize: 18, fontWeight: "bold" }}>
                    Produces
                  </Label>
                  <Row>
                    {produces.map(
                      (produce) =>
                        (categoryIds.includes(produce.numeric_id) ||
                          subCategoryIds.includes(produce.numeric_id)) && (
                          <Col md="3" key={produce.numeric_id}>
                            <a
                              onClick={() => onProduceClicked(produce)}
                              style={{ cursor: "pointer" }}
                            >
                              <Media
                                src={
                                  produce.main_produce_image01ISfile
                                    ? contentsUrl +
                                      produce.main_produce_image01ISfile
                                    : ""
                                }
                                className="img-fluid-ads"
                                alt={produce.name}
                                style={{
                                  objectFit: "cover",
                                  width: "90%",
                                  height: "120px",
                                  borderRadius: "5px",
                                }}
                              />
                              <Label>{produce.name}</Label>
                            </a>
                          </Col>
                        )
                    )}
                  </Row>
                </div>
              )}
            </Fragment>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
