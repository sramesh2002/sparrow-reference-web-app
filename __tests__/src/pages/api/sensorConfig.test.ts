/**
 * @jest-environment node
 */
 import { createMocks, RequestMethod } from "node-mocks-http";
 import type { NextApiRequest, NextApiResponse } from "next";
 import sensorConfigHandler from "../../../../src/pages/api/gateway/[gatewayUID]/sensor/[macAddress]/config";
 import {HTTP_STATUS, HTTP_HEADER} from '../../../../src/constants/http';
 
 describe("/api/gateway/[gatewayUID]/sensor/[macAddress]/config API Endpoint", () => {
   const authToken = process.env.HUB_AUTH_TOKEN;
   const gatewayUID = process.env.HUB_DEVICE_UID;
   const macAddress = process.env.HUB_SENSOR_MAC;
 
   function mockRequestResponse (method:RequestMethod="GET") {
     const { req, res }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
     req.headers = {
       [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
       [HTTP_HEADER.SESSION_TOKEN]: authToken,
     };
     req.query = { gatewayUID, macAddress };
     return {req, res};
   }
 
   it("GET should return a successful response from Notehub", async () => {
     const {req, res} = mockRequestResponse();
     await sensorConfigHandler(req, res);

     expect(res.statusCode).toBe(200);
     expect(res.getHeaders()).toEqual({
       'content-type': HTTP_HEADER.CONTENT_TYPE_JSON 
     });
     expect(res.statusMessage).toEqual("OK");
   });

   it("POST should return a successful response from Notehub", async () => {
    const {req, res} = mockRequestResponse("POST");
    req.body = { loc: "TEST_LOCATION", name: "TEST_NAME" }
    await sensorConfigHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({
      'content-type': HTTP_HEADER.CONTENT_TYPE_JSON 
    });
    expect(res.statusMessage).toEqual("OK");
  });

  it("POST should return a 400 if Sensor MAC is missing", async () => {
    const {req, res} = mockRequestResponse("POST");
    req.body = {} // Equivalent to a null Sensor MAC
    await sensorConfigHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.getHeaders()).toEqual({
      'content-type': HTTP_HEADER.CONTENT_TYPE_JSON 
    });
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ err: HTTP_STATUS.INVALID_CONFIG_BODY });
  });
 
   it("should return a 204 if Sensor Config cannot be found", async () => {
     const {req, res} = mockRequestResponse();
     // Pass a MAC address string that almost certainly won't exist
     req.query.macAddress = "not_a_real_sensor_mac";
 
     await sensorConfigHandler(req, res);
 
     expect(res.statusCode).toBe(204);
     // eslint-disable-next-line no-underscore-dangle
     expect(res._getJSONData()).toEqual({ err: HTTP_STATUS.NOT_FOUND_CONFIG });
   });
 
   it("should return a 400 if Sensor MAC is missing", async () => {
     const {req, res} = mockRequestResponse();
     req.query = { gatewayUID }; // Equivalent to a null sensor MAC
 
     await sensorConfigHandler(req, res);
 
     expect(res.statusCode).toBe(400);
     // eslint-disable-next-line no-underscore-dangle
     expect(res._getJSONData()).toEqual({ err: HTTP_STATUS.INVALID_SENSOR_MAC });
   });
 });
 