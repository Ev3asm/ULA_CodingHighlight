import { jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { fetchCurrentTemperature, tempAvgAboveAtCoords } from "./fetchCurrentTemperature.js";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

describe("fetchCurrentTemperature", () => {
  // TODO
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("should return an object following type specification", async () => {
    const mockResponse = {
      hourly: {
        time: ["2024-11-26T00:00", "2024-11-26T01:00"],
        temperature_2m: [13.1, 12.7],
      },
    };
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const testGeoCoord = { lon: 40, lat: 40, importances: [] };
    const result = await fetchCurrentTemperature(testGeoCoord);

    expect(typeof result).toEqual("object");
    expect(Array.isArray(result.time)).toBe(true);
    expect(Array.isArray(result.temperature_2m)).toBe(true);
    expect(typeof result.time[0]).toEqual("string");
    expect(typeof result.temperature_2m[0]).toEqual("number");
    expect(Object.keys(result).length).toBe(2);
  });

  it("should return an object with correct temperature data", async () => {
    const mockResponse = {
      hourly: {
        time: ["2024-11-26T00:00", "2024-11-26T01:00"],
        temperature_2m: [13.1, 12.7],
      },
    };
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const testGeoCoord = { lon: 40, lat: 40, importances: [] };
    const result = await fetchCurrentTemperature(testGeoCoord);

    expect(result).toBeDefined();
    expect(result.time).toEqual(["2024-11-26T00:00", "2024-11-26T01:00"]);
    expect(result.temperature_2m).toEqual([13.1, 12.7]);
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("tempAvgAboveAtCoords", () => {
  // TODO
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("should return true if the average is greater than input temp", async () => {
    const mockResponse = {
      hourly: {
        time: ["2024-11-27T00:00", "2024-11-27T01:00", "2024-11-27T02:00", "2024-11-27T03:00"],
        temperature_2m: [20.6, 21.7, 23.9, 20.1],
      },
    };
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const testGeoCoord = { lon: 40, lat: 40, importances: [] };
    const result = await tempAvgAboveAtCoords(testGeoCoord, 20);

    expect(result).toBe(true);
  });

  it("should return false if the average is less than input temp", async () => {
    const mockResponse = {
      hourly: {
        time: ["2024-11-27T00:00", "2024-11-27T01:00", "2024-11-27T02:00", "2024-11-27T03:00"],
        temperature_2m: [20.6, 21.7, 23.9, 20.1],
      },
    };
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const testGeoCoord = { lon: 40, lat: 40, importances: [] };
    const result = await tempAvgAboveAtCoords(testGeoCoord, 22);

    expect(result).toBe(false);
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
