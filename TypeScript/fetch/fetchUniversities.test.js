import { jest } from "@jest/globals";
import { fetchUniversities, universityNameLengthOrderAscending } from "./fetchUniversities.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

function mockSetup(){
  fetchMock.enableMocks();
};

function mockReset(){
  fetchMock.resetMocks();
  fetchMock.disableMocks();
};

describe("fetchUniversities", () => {

  // TODO
  it("should return the mock array of objects representing different universities without errors", async () => {
    mockSetup();

    const query = 'massachusetts';
    const mockRes = [{
        "state-province": null,
        "domains": [
          "uml.edu",
        "student.uml.edu"
        ],
        "web_pages": [
          "http://www.uml.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Lowell"
      },
      {
        "state-province": null,
        "domains": [
          "umass.edu"
        ],
        "web_pages": [
          "http://www.umass.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Amherst"
      },
      {
        "state-province": null,
        "domains": [
          "mit.edu"
        ],
        "web_pages": [
          "http://web.mit.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "Massachusetts Institute of Technology"
      }];
    fetchMock.mockResponse(JSON.stringify(mockRes));
    const uniArr = await fetchUniversities(query);
    expect(uniArr.length).toBe(3);
    expect(uniArr[0] === "University of Massachusetts at Lowell").toBeTruthy();
    expect(uniArr[1] === "University of Massachusetts at Amherst").toBeTruthy();
    expect(uniArr[2] === "Massachusetts Institute of Technology").toBeTruthy();

    mockReset();
  });

  it("should return actual fetched array of objects representing different universities with no errors", async () => {
    const query = "University of Massachusetts";
    const uniArr = await fetchUniversities(query);
    expect(uniArr.every(uni => uni.toLowerCase().includes(query.toLowerCase()))).toBeTruthy();
    //console.log(uniArr);
  });

  it("should return an empty array if there are no results", async () => {
    mockSetup();

    const query = 'University of Atlantis';
    const mockRes = [];
    fetchMock.mockResponse(JSON.stringify(mockRes));
    const uniArr = await fetchUniversities(query)
    expect(uniArr.length === 0).toBeTruthy();

    mockReset();
  });

  it("should throw an error with the status test of the response if res.ok is false", async () => {
    mockSetup();

    const query = 'response error';
    const mockErrorRes = { status: 400, statusText: "Expected mock error" }; 
    fetchMock.mockResponse(JSON.stringify({}), { status: mockErrorRes.status, statusText: mockErrorRes.statusText});
    try {
      await fetchUniversities(query).then(_arr => Promise.reject(new Error("unexpected result of no error")));
    } catch (err) {
      expect(err.message).toBe("Error in response: " + mockErrorRes.statusText);
    }

    mockReset();
  });
});

describe("universityNameLengthOrderAscending", () => {
  // TODO
  it("should return true if the university array is an empty string", async () => {
    mockSetup();

    const query = 'University of Atlantis';
    const mockRes = [];
    fetchMock.mockResponse(JSON.stringify(mockRes));
    const uniArr = await universityNameLengthOrderAscending(query);
    expect(uniArr).toBe(true);

    mockReset();
  });

  it("should return true if the university array does have strictly increasing lengths of the university names", async () => {
    mockSetup();

    const query = 'massachusetts';
    const mockRes = [{
        "state-province": null,
        "domains": [
          "umb.edu"
        ],
        "web_pages": [
          "https://www.umb.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts Boston"
      },
      {
        "state-province": null,
        "domains": [
          "uml.edu",
          "student.uml.edu"
        ],
        "web_pages": [
        "http://www.uml.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Lowell"
      },
      {
        "state-province": null,
        "domains": [
          "umass.edu"
        ],
        "web_pages": [
        "http://www.umass.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Amherst"
      },
      {
        "state-province": null,
        "domains": [
          "umassd.edu"
        ],
        "web_pages": [
          "http://www.umassd.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Dartmouth"
      }];
    fetchMock.mockResponse(JSON.stringify(mockRes));
    const uniArr = await universityNameLengthOrderAscending(query);
    expect(uniArr).toBe(true);

    mockReset();
  });

  it("should return false if the university array does not have strictly increasing lengths of the university names", async () => {
    mockSetup();

    const query = 'massachusetts';
    const mockRes = [{
        "state-province": null,
        "domains": [
          "umb.edu"
        ],
        "web_pages": [
          "https://www.umb.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts Boston"
      },
      {
        "state-province": null,
        "domains": [
          "umassd.edu"
        ],
        "web_pages": [
          "http://www.umassd.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Dartmouth"
      },
      {
        "state-province": null,
        "domains": [
          "uml.edu",
          "student.uml.edu"
        ],
        "web_pages": [
        "http://www.uml.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Lowell"
      },
      {
        "state-province": null,
        "domains": [
          "umass.edu"
        ],
        "web_pages": [
        "http://www.umass.edu/"
        ],
        "country": "United States",
        "alpha_two_code": "US",
        "name": "University of Massachusetts at Amherst"
      }];
    fetchMock.mockResponse(JSON.stringify(mockRes));
    const uniArr = await universityNameLengthOrderAscending(query);
    expect(uniArr).toBe(false);

    mockReset();
  });

  it("should propagate errors from fetchUniversities", async () => {
    mockSetup();

    const query = 'response error';
    const mockErrorRes = { status: 401, statusText: "Expected mock error" }; 
    fetchMock.mockResponse(JSON.stringify({}), { status: mockErrorRes.status, statusText: mockErrorRes.statusText });
    try {
      await universityNameLengthOrderAscending(query).then(_arr => Promise.reject(new Error("unexpected result of no error")));
    } catch (err) {
      expect(err.message).toBe("Error in response: " + mockErrorRes.statusText);
    }

    mockReset();
  });
});
