import React, {useState} from 'react';
import { useRouter } from "next/router";
import CommonLayout from '../../components/layout/common-layout';
import { withApollo } from '../../helpers/apollo/apollo';
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import ReportSpace from "../layouts/Agri/components/ReportSpace";
import Banner from "../layouts/Agri/components/ProduceBanner";
import ProduceList from "../layouts/Agri/components/ProduceList";

const MyReports = ({auth, user}) => {
    const { query } = useRouter();
    const GetCategory = (category) => {
        var categoryName = "Fruit and Veg"

        switch (category) {
            case "1": categoryName = "Fruit and Veg";break;
            case "2": categoryName = "Beans";break;
            case "3": categoryName = "Lentils";break;
            case "4": categoryName = "Cereals";break;
            case "5": categoryName = "Nuts";break;
            case "6": categoryName = "Spices";break;
        }
        return categoryName;
    };

    return (
        <CommonLayout title="collection" parent="home" sidebar={true} auth={auth} user={user}>
            <Container fluid={true}>
                <Banner />
                <ProduceList
                    sectionClass="section-b-space"
                />
                <Row>
                    <Col md='9'>                
                        <ReportSpace auth={auth} /> 
                    </Col>
                    <Col md='3'>
                    </Col>
                </Row>
            </Container>          
        </CommonLayout>
    )
}

export default withApollo(MyReports);