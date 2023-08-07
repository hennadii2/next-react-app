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
import getConfig from "next/config";
import { getReports } from "../../../helpers/lib";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    width: 1000,
  },
  header: {
    width: "100%",
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  info: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 180,
  },
  meta: {
    marginLeft: 10,
  },
  text: {
    marginLeft: 12,
    fontSize: 12,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: 100,
    textDecoration: "underline",
  },
});

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

// Create Document Component
const ReportPdf = ({ report }) => {
  const imageUrl = contentsUrl + report.report_image01ISfile;

  const countryName = report.countryISbb_agrix_countriesID_data ? report.countryISbb_agrix_countriesID_data.name : ''
	const regionName = report.regionISbb_agrix_countriesID_data ? report.regionISbb_agrix_countriesID_data.name : ''
	const cityName = report.cityISbb_agrix_countriesID_data ? report.cityISbb_agrix_countriesID_data.name : ''
	// console.log(report)
	const location =
		countryName + `${countryName ? ', ' : ''}` + regionName + `${regionName && cityName ? ', ' : ''}` + cityName
	const company = report.userISbb_agrix_usersID_data?.company


  return (
    <PDFViewer height={640} width="100%" showToolbar={true}>
      <Document>
        <Page style={styles.body} wrap size="A4">
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{report.name}</Text>
            </View>
          </View>
          <View style={styles.info}>
            <Image src={imageUrl} style={styles.image}></Image>
            <View style={styles.meta}>
              <Text style={styles.subtitle}>
                Produce:{" "}
                {report.produce_sub_categoryISbb_agrix_produce_typesID_data
                  ? report.produce_sub_categoryISbb_agrix_produce_typesID_data
                      .name
                  : ""}
              </Text>
              <Text style={styles.subtitle}>
                Location:{" "}
                {location}
              </Text>
              <Text style={styles.subtitle}>
                Company:{" "}
                {company}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.subtitle}>Report Summary:</Text>
            <Text style={styles.text}>
              {report.summaryISsmallplaintextbox ?? ""}
            </Text>
          </View>
          <View>
            <Text style={styles.subtitle}>Report Text:</Text>
            <Text style={styles.text}>
              {report.report_textISsmallplaintextbox ?? ""}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReportPdf;

export const getServerSideProps = withIronSession(
  async ({ params, req, res }) => {
    const reportId = params.id;
    const user = req.session.get("user");
    const userId = user.long_id;

    if (!user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const report = await getReports(reportId, userId);

    return {
      props: {
        report,
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
