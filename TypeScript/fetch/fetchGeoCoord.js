import { makeSearchURL } from "./utility.js";

export function fetchGeoCoord(query) {
  const geoURL = makeSearchURL('https://220.maxkuechen.com/geocoord/search', ['q'], [query]);
  return fetch(geoURL)
  .then(response => response.ok ? response.json() : Promise.reject(new Error(`Error in response: ${response.statusText}`)))
  .then(json => Array.isArray(json) && json.length > 0 ? 
  Promise.resolve({ 
  lon: Number.parseFloat(json[0].lon), 
  lat: Number.parseFloat(json[0].lat), 
  importances: json[0].importances.map(Number.parseFloat) }): 
  Promise.reject(new Error("No results")));
}

export function locationImportantEnough(place, importanceThreshold) {
  return fetchGeoCoord(place).then(fields => {
    if (fields.importances.length > 0) {
      const max = Math.max(...fields.importances);
      return Promise.resolve(max > importanceThreshold);
    } else{
      return Promise.reject(new Error("No importances found"));
    }
  });
}
