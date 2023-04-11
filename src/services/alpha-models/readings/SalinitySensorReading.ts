import Reading from "./Reading";
import SalinitySensorSchema from "./SalinitySensorSchema";

class SalinitySensorReading implements Reading<number> {
  schema: SalinitySensorSchema;

  value: number;

  captured: string;

  constructor(options: { value: number; captured: string }) {
    this.schema = SalinitySensorSchema;
    this.value = options.value;
    this.captured = options.captured;
  }
}

export default SalinitySensorReading;
