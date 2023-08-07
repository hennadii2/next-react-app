import React, { useState, useEffect } from "react";
import {
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
} from "reactstrap";
import Chart from "react-google-charts";

const LineChartOptions = {
  hAxis: {
    title: "12 Months of the Year",
    textPosition: ["out"],
  },
  vAxis: {
    textPosition: ["in"],
    title: "Price",
  },
  series: {
    1: { curveType: "function" },
  },
};

const LineData = [
  ["x", "Price"],
  ["Jan", Math.random() * 100],
  ["Feb", Math.random() * 100],
  ["Mar", Math.random() * 100],
  ["Apr", Math.random() * 100],
  ["May", Math.random() * 100],
  ["Jun", Math.random() * 100],
  ["Jul", Math.random() * 100],
  ["Aug", Math.random() * 100],
  ["Sep", Math.random() * 100],
  ["Oct", Math.random() * 100],
  ["Nov", Math.random() * 100],
  ["Dec", Math.random() * 100],
];

const LineChart = ({ isShow, onToggle, usersProduce, seller }) => {
  // const produceOptions = usersProduce.map((produce) => (
  //   <option key={produce.numeric_id} value={produce.numeric_id}>
  //     {produce.produce_sub_categoryISbb_agrix_produce_typesID_data
  //       ? produce.produce_sub_categoryISbb_agrix_produce_typesID_data.name
  //       : ""}
  //   </option>
  // ));

  const produceTemplates = [];
  for (let prod1 of usersProduce) {
    const same_produces = usersProduce.filter(
      (pd) =>
        pd.produce_sub_categoryISbb_agrix_produce_typesID ===
        prod1.produce_sub_categoryISbb_agrix_produce_typesID
    );
    const tags = same_produces.map((sp) =>
      Object.assign(
        {},
        {
          numeric_id: sp.numeric_id,
          tag_name: sp.produce_typeISbb_agrix_produce_typesID_data
            ? sp.produce_typeISbb_agrix_produce_typesID_data.name
            : "",
        }
      )
    );
    const item = {
      produce: {
        numeric_id: prod1.numeric_id,
        name: prod1.produce_sub_categoryISbb_agrix_produce_typesID_data
          ? prod1.produce_sub_categoryISbb_agrix_produce_typesID_data.name
          : "",
      },
      tags: tags,
    };

    const template = produceTemplates.find(
      (pt) => pt.produce.name === item.produce.name
    );
    if (!template) produceTemplates.push(item);
  }

  const [produce, setProduce] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const produceOptions = produceTemplates.map((pt) => (
    <option key={pt.produce.numeric_id} value={pt.produce.numeric_id}>
      {pt.produce.name}
    </option>
  ));

  const tagOptions = tags.map((tag) => (
    <option key={tag.numeric_id} value={tag.numeric_id}>
      {tag.tag_name}
    </option>
  ));

  const onProduceChanged = (e) => {
    const produce = e.target.value;
    setProduce(produce);
    const produceTemplate = produceTemplates.find(
      (pt) => pt.produce.numeric_id === produce
    );
    setTags(produceTemplate.tags);
  };

  return (
    <Modal centered isOpen={isShow} toggle={onToggle} className="modal-lg">
      <ModalHeader toggle={onToggle}>{seller.company}</ModalHeader>
      <ModalBody className="p-3">
        <Row>
          <Col>
            <Label className="pl-2">Produces</Label>
            <Input type="select" value={produce} onChange={onProduceChanged}>
              <option value="" hidden>
                -Select Produce-
              </option>
              {produceOptions}
            </Input>
          </Col>
          <Col>
            <Label className="pl-2">Tags</Label>
            <Input
              type="select"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="" hidden>
                -Select Tag-
              </option>
              {tagOptions}
            </Input>
          </Col>
        </Row>
        <div>
          <Chart
            width="100%"
            height="350px"
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={LineData}
            options={LineChartOptions}
            rootProps={{ "data-testid": "2" }}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default LineChart;
