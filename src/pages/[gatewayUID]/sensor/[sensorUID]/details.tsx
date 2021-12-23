import { GetServerSideProps, NextPage } from "next";
import { Input, Button, Tabs } from "antd";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import Form, { FormProps } from "../../../../components/elements/Form";
import getSensorDetailsData from "../../../../lib/sensorDetailsData";
import Sensor from "../../../../models/Sensor";
import VoltageChart from "../../../../components/charts/VoltageChart";
import styles from "../../../../styles/Form.module.scss";

type SensorDetailsData = {
  latestSensorData: Sensor;
  historicalSensorData: Sensor[];
};

const SensorDetails: NextPage<SensorDetailsData> = ({
  latestSensorData,
  historicalSensorData,
}) => {
  console.log(latestSensorData);
  const { TabPane } = Tabs;

  const formItems: FormProps[] = [
    {
      label: "Last Updated",
      contents: (
        <div className={styles.formData}>{latestSensorData?.lastActivity}</div>
      ),
    },
    {
      label: "Name",
      name: "name",
      tooltip: "What is the name of your sensor?",
      contents: <Input placeholder="Name of sensor" />,
    },
    {
      label: "Location",
      name: "location",
      tooltip: "Where is your sensor located?",
      contents: <Input placeholder="Sensor location" />,
    },
    {
      // todo question: do gateways have accessible names too?
      label: "Gateway",
      contents: <div className={styles.formData}>2nd Floor Gateway</div>,
    },
    {
      contents: (
        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      ),
    },
  ];

  const formOnFinish = (values: Store) => {
    console.log("Success:", values);
  };

  const formOnFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  const callback = (key: string) => {
    console.log(key);
  };

  // Using hardcoded voltage data temporarily
  const mockVoltageData = [
    {
      when: new Date("2021-11-19T18:46:09Z"),
      value: 2.835,
    },
    {
      when: new Date("2021-11-19T17:43:09Z"),
      value: 2.907,
    },
    {
      when: new Date("2021-11-19T17:06:22Z"),
      value: 2.849,
    },
    {
      when: new Date("2021-11-19T15:42:19Z"),
      value: 2.886,
    },
    {
      when: new Date("2021-11-19T14:42:00Z"),
      value: 2.921,
    },
    {
      when: new Date("2021-11-19T13:40:25Z"),
      value: 2.943,
    },
    {
      when: new Date("2021-11-19T12:40:28Z"),
      value: 2.958,
    },
    {
      when: new Date("2021-11-19T11:40:29Z"),
      value: 2.931,
    },
    {
      when: new Date("2021-11-19T09:41:09Z"),
      value: 2.895,
    },
    {
      when: new Date("2021-11-19T08:41:09Z"),
      value: 2.928,
    },
    {
      when: new Date("2021-11-19T07:40:29Z"),
      value: 2.921,
    },
    {
      when: new Date("2021-11-19T05:41:50Z"),
      value: 2.901,
    },
    {
      when: new Date("2021-11-19T03:41:51Z"),
      value: 2.931,
    },
    {
      when: new Date("2021-11-19T02:40:30Z"),
      value: 2.925,
    },
    {
      when: new Date("2021-11-19T01:40:31Z"),
      value: 2.925,
    },
    {
      when: new Date("2021-11-19T00:40:31Z"),
      value: 2.91,
    },
    {
      when: new Date("2021-11-18T22:39:29Z"),
      value: 3.6989999999999994,
    },
  ].reverse();

  return (
    <div>
      <h1>{latestSensorData.name}</h1>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Summary" key="1">
          <h2>Current Readings</h2>
          {/* none of this is styled b/c that's a separate story - just getting the api data to the client here */}
          <p>Last Seen: {latestSensorData.lastActivity}</p>
          <ul>
            <li>
              Temperature:&nbsp;
              {typeof latestSensorData.temperature === "string"
                ? `${latestSensorData.temperature}`
                : `${latestSensorData.temperature}°C`}
            </li>
            <li>
              Humidity:&nbsp;
              {typeof latestSensorData.humidity === "string"
                ? `${latestSensorData.humidity}`
                : `${latestSensorData.humidity}%`}
            </li>
            <li>
              Pressure:&nbsp;
              {typeof latestSensorData.pressure === "string"
                ? `${latestSensorData.pressure}`
                : `${latestSensorData.pressure / 1000} kPa`}
            </li>
            <li>
              Voltage:&nbsp;
              {typeof latestSensorData.voltage === "string"
                ? `${latestSensorData.voltage}`
                : `${latestSensorData.voltage}V`}
            </li>
          </ul>
          <h3>Voltage</h3>
          <VoltageChart data={mockVoltageData} />
        </TabPane>
        <TabPane tab="Device Details" key="2">
          <Form
            formItems={formItems}
            onFinish={formOnFinish}
            onFinishFailed={formOnFinishFailed}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SensorDetails;

export const getServerSideProps: GetServerSideProps<SensorDetailsData> =
  async ({ query }) => {
    const { gatewayUID, sensorUID } = query;

    const { latestSensorData } =
      // const { latestSensorData, historicalSensorData } =
      await getSensorDetailsData(gatewayUID, sensorUID);

    // return {
    //   props: { gateways, latestSensorData },
    // };
    return {
      props: { latestSensorData },
    };
  };
