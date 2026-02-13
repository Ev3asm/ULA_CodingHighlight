import { jest } from "@jest/globals";
import { fetchUMichWeather, fetchUMassWeather, fetchUniversityWeather } from "./universityWeather.js";

const SECOND = 1000;
jest.setTimeout(40 * SECOND);

describe("fetchUMichWeather", () => {
  it("should return correct temperature", async () => {
    const UMich = await fetchUMichWeather();
    //console.log(UMich);  checking temps of every UMich
    expect(UMich.totalAverage).toBeCloseTo((UMich["University of Michigan-Flint"] + 
      UMich["University of Michigan - Ann Arbor"] + UMich["University of Michigan - Dearborn"]) / 3);
  });
});

describe("fetchUMassWeather", () => {
  it("should return correct temperature", async () => {
    const UMass = await fetchUMassWeather();
    //console.log(UMass);  checking temps of every UMass
    expect(UMass.totalAverage).toBeCloseTo((UMass["University of Massachusetts at Dartmouth"] + 
      UMass["University of Massachusetts at Lowell"] + UMass["University of Massachusetts at Amherst"]
    + UMass["University of Massachusetts Boston"]) / 4);
  });
});

describe("fetchUniversityWeather", () => {
  it("should cause no errors and have the correct results", async () => {
    const RIT = await fetchUniversityWeather("Rochester Institute of Technology");
    expect(RIT.totalAverage).toBeCloseTo((RIT["Rochester Institute of Technology"] + RIT["Rochester Institute of Technology, Dubai"]) / 2);
  });

  it("should reject with an error if there are no matching universities", async () => {
    try {
      fetchUniversityWeather("Fake University of Nowhere");
    } catch (error) {
      expect(error.message).toBe("No results found for query.");
    }
  });

  it("should reject if the university name and location do not match up", async () => {
    try {
      fetchUniversityWeather("Rochester Institute of Technology");
      fetchUniversityWeather("Rochester Institute of Technology, Fake Location");
    } catch (error) {
      expect(error.message).toBe("No results found for query.");
    }
  });
});
