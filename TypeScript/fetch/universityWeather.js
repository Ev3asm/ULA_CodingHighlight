// Do not directly import these from your files. This allows the autograder to evaluate the functions in this
// file against the sample solution.
import { fetchCurrentTemperature, fetchGeoCoord, fetchUniversities } from "../include/exports.js";
import { Average } from "./utility.js";

export function fetchUniversityWeather(universityQuery, transformName = str => str) {
  // TODO

  return fetchUniversities(universityQuery)
    .then(uniArr => uniArr.length === 0 ? Promise.reject(new Error("No results found for query.")) : 
      Promise.all(uniArr.map(async uni => {
        const uniAndCoord = {name: uni, temp: await fetchGeoCoord(transformName(uni))
          .then(coord => fetchCurrentTemperature(coord)
            .then(temps => temps.temperature_2m.reduce((acc, e) => acc.add(e), new Average()).calcAvg()
            )
          )
        };
        return uniAndCoord;
      }))
    )
    .then(uniAndTempArr => {
      const avgTempResults = {totalAverage: 0};
      const totAvg = new Average();
      uniAndTempArr.forEach(uniAndTemp => {
        avgTempResults[uniAndTemp.name] = uniAndTemp.temp;
        totAvg.add(uniAndTemp.temp);
      })
      avgTempResults.totalAverage = totAvg.calcAvg();
      return avgTempResults;
    })
}

export function fetchUMassWeather() {
  return fetchUniversityWeather("University of Massachusetts", transformName => transformName.replace(" at ", " "));
}

export function fetchUMichWeather() {
  return fetchUniversityWeather("University of Michigan", transformName => transformName.replace(" at ", " "));
}
