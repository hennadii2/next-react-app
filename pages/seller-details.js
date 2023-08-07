import React from 'react';
import CommonLayout from '../components/layout/common-layout';
import { withApollo } from '../helpers/apollo/apollo';
import { Row, Container } from 'reactstrap';
import SellerPage from "./layouts/Agri/components/seller/SellerPage";

const SellerDetails = ({auth, user}) => {

    return (
        <CommonLayout title="collection" parent="home" sidebar={false} auth={auth} user={user}>
            <SellerPage />
        </CommonLayout>
    )
}

export default withApollo(SellerDetails);