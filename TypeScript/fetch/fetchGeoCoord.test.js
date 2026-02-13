import { jest } from "@jest/globals";
import { fetchGeoCoord, locationImportantEnough } from "./fetchGeoCoord.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

describe("fetchGeoCoord", () => {

  it("should return correctly the first geoCoord object considering possible second result", async () => {
     const query = "boston";  
     const location = await fetchGeoCoord(query);  
     expect(Math.floor(location.lon)).toEqual(-72); 
     expect(Math.floor(location.lat)).toEqual(42);
     expect(location.importances.length).toEqual(5);
  });

   it("should return correct value for no results", () => { 
     const query = "random area";
     try{
      fetchGeoCoord(query);
     } catch (error){
      expect(error.message).toBe("No results");
     }
   });

});

describe("locationImportantEnough", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  
  it("should reject area that isn't important enough", async () => { 
    const place = "toronto";
    const mockResponse = [{ lon: -79.4, lat: 43.7, importances: [6, 6, 6] }];; 
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const result = await locationImportantEnough(place, 7);
    expect(result).toBe(false);
  });

  it("should accept area that is important enough", async () => { 
    const place = "cleveland";
    const mockResponse = [{ lon: -81.6, lat: 41.4, importances: [8, 7, 6] }]; 
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const result = await locationImportantEnough(place, 2);
    expect(result).toBe(true);
  });

  it("should return false if importances field is empty", () => { 
    const place = "false";
    const mockResponse = [{ lon: -36.6, lat: 7.4, importances: [] }];  
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const result = locationImportantEnough(place, 2);
    return expect(result).rejects.toThrow("No importances found")
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
