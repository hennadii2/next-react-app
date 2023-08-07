import React, { useContext, useEffect, useState } from "react";
import { withIronSession } from "next-iron-session";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { getMembershipLogById } from "../../../helpers/lib";
import moment from 'moment';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    width: 1000
  },
  header: {
    width: "100%",
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 30,
    marginTop: 80,
    flexDirection: "row",
    justifyContent: "start",
    paddingBottom: 30,
    borderBottom: '2px solid #85be00'
  },
  info: {
    marginBottom: 20,
  },
  bottom: {
    marginTop: 20,
    marginBottom: 20
  },
  item: {
    textAlign: 'right',
    marginBottom: 20
  },
  image: {
    width: 179,
    height: 34,
  },

  title: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 5,
    fontSize: 12,
    fontWeight: 'light',
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "between",
    width: '100%',
    marginBottom: 10,
    borderBottom: '1px solid #888888'
  },
  tableContent: {
    flexDirection: "row",
    justifyContent: "between",
    paddingBottom: 20,
    width: '100%',
    borderBottom: '1px solid #888888'
  },
  desc: {
    width: '80%'
  },
  amount: {
    width: '20%'
  }
});

// Create Document Component
const PaymentPdf = ({ payment }) => {
  console.log('payment', payment);
  const logoImage = `/assets/images/icon/logo.png`
  const info = 'Our prices are based on the USD package price. The amount charged in your local currency may change according to the exchange rate and other applicable charges. This means prices on future debits may be higher or lower than on past payments depending on the time of the payments and associated charges.'

  return (
    <PDFViewer height={800} width="100%" showToolbar={true}>
      <Document>
        <Page style={styles.body} wrap size="A4">
          <View style={styles.header}>
            <View>
              <Image src={logoImage} style={styles.image} className="img-fluid"></Image>
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.item}>
              <Text style={styles.title}>
                Payment Reference Number:
              </Text>
              <Text style={styles.content}>
                {payment.stripe_payment_ref
                  ? payment.stripe_payment_ref : ""}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>
                Date of Payment:
              </Text>
              <Text style={styles.content}>
                {payment._dateadded
                  ? moment(payment._dateadded).format('YYYY-MM-DD') : ""}
              </Text>
            </View>
          </View>
          <View style={styles.tableHeader}>
            <View style={styles.desc}>
              <Text style={styles.title}>
                Description
              </Text>
            </View>
            <View style={styles.amount}>
              <Text style={styles.title}>
                Amount Paid
              </Text>
            </View>
          </View>
          <View style={styles.tableContent}>
            <View style={styles.desc}>
              <Text style={styles.content}>
                {payment && payment.code_friendly && (
                  <Text style={styles.content}>
                    {`${payment.code_friendly}`}
                  </Text>
                )}
              </Text>
            </View>
            <View style={styles.amount}>
              {payment && payment.amountNUM && (
                <Text style={styles.content}>
                  {`$${(parseFloat(payment.amountNUM).toFixed(2))}`}
                </Text>
              )}
              
            </View>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.content}>
              {info}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PaymentPdf;

export const getServerSideProps = withIronSession(
  async ({ params, req, res }) => {
    const logId = params.id;

    const payment = await getMembershipLogById(logId);

    return {
      props: {
        payment,
      },
    };
  },
  {
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  }
);
