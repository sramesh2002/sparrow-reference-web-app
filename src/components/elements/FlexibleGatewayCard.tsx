import { useRouter } from "next/router";
import { Card, Col, Row, Typography } from "antd";
import NodeCard from "./FlexibleNodeCard";
import {
  asNumber,
  findCurrentReadingWithName,
  getFormattedLastSeenDate,
  getFormattedVoltageData,
} from "../presentation/uiHelpers";
import { GATEWAY_MESSAGE, ERROR_MESSAGE } from "../../constants/ui";
import { Gateway, GatewaySensorTypeNames } from "../../services/AppModel";

import styles from "../../styles/Home.module.scss";
import cardStyles from "../../styles/Card.module.scss";

interface GatewayProps {
  gateway: Gateway;
  index: number;
}

const GatewayCardComponent = (props: GatewayProps) => {
  const { index, gateway } = props;
  const { Text } = Typography;


  const router = useRouter();
  // todo - use urlBuilder to create the correct URL
  const gatewayUrl = `/${gateway.id.gatewayDeviceUID}/details`;
  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(gatewayUrl);
  };

  
  // we hard code some of the gateway readings for now. We will make this more open-ended in future with the site redesign
  const formattedGatewayVoltage = getFormattedVoltageData(
    asNumber(findCurrentReadingWithName(gateway, GatewaySensorTypeNames.VOLTAGE)?.reading?.value)
) || GATEWAY_MESSAGE.NO_VOLTAGE;


  const formattedLocation = findCurrentReadingWithName(gateway, GatewaySensorTypeNames.LOCATION) || GATEWAY_MESSAGE.NO_LOCATION;

  return (
    <>
      <span>Gateway</span>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} lg={12}>
          <Card
            headStyle={{ padding: "0" }}
            bodyStyle={{ padding: "0" }}
            className={cardStyles.cardStyle}
            hoverable
            onClick={handleCardClick}
            title={
              <>
                <Text
                  ellipsis={{
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    tooltip: `${gateway.name}`,
                  }}
                  data-testid={`gateway[${index}]-details`}
                >
                  {gateway.name}
                </Text>
                <span className={cardStyles.timestamp}>
                  Last updated{` `}
                  {gateway.lastSeen ? getFormattedLastSeenDate(new Date(gateway.lastSeen)) : GATEWAY_MESSAGE.NEVER_SEEN}
                </span>
                <div
                  data-testid="gateway-location"
                  className={cardStyles.locationWrapper}
                >
                  {/* todo - could have a LabelRenderer for a given sensor type/reading*/}
                  <span className={cardStyles.locationTitle}>
                    Location{` `}
                  </span>                  
                  <span className={cardStyles.location}>
                    {formattedLocation}
                  </span>
                </div>
              </>
            }
          >
            <Row
              justify="start"
              gutter={[16, 16]}
              className={cardStyles.cardContents}
            >
              <Col span={8}>
                Voltage
                <br />
                <span className="dataNumber">{formattedGatewayVoltage}</span>
              </Col>
            </Row>
          </Card>
        </Col>

      </Row>

      <h2 data-testid="node-header" className={styles.sectionSubTitle}>
        Nodes
      </h2>
      {gateway.nodes && gateway.nodes.length ? (
        <Row gutter={[16, 16]}>
          {Array.from(gateway.nodes).map((node, cardIndex) => (
            <Col xs={24} sm={24} lg={12} key={node.id.nodeID}>
              <NodeCard index={cardIndex} gateway={gateway} node={node} />
            </Col>
          ))}
        </Row>
      ) : (
        <h4 className={styles.errorMessage}>{ERROR_MESSAGE.NODES_NOT_FOUND}</h4>
      )}
    </>
  );
};

export default GatewayCardComponent;