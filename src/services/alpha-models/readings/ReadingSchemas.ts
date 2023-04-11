import HumiditySensorSchema from "./HumiditySensorSchema";
import PressureSensorSchema from "./PressureSensorSchema";
import TemperatureSensorSchema from "./TemperatureSensorSchema";
import SalinitySensorSchema from "./SalinitySensorSchema";
import VoltageSensorSchema from "./VoltageSensorSchema";
import CountSensorSchema from "./CountSensorSchema";
import TotalSensorSchema from "./TotalSensorSchema";

const ReadingSchemas = {
  humidity: HumiditySensorSchema,
  pressure: PressureSensorSchema,
  temperature: TemperatureSensorSchema,
  salinity: SalinitySensorSchema,
  voltage: VoltageSensorSchema,
  count: CountSensorSchema,
  total: TotalSensorSchema,
};

export default ReadingSchemas;
