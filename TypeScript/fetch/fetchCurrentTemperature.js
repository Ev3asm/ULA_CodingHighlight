import { makeSearchURL } from "./utility";

export function fetchCurrentTemperature(coords) {
  // TODO
  const tempURL = makeSearchURL(
    "https://220.maxkuechen.com/currentTemperature/forecast",
    ["latitude", "longitude", "hourly", "temperature_unit"],
    [coords.lat, coords.lon, "temperature_2m", "fahrenheit"]
  );
  //const URL = 'https://220.maxkuechen.com/currentTemperature/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&temperature_unit=fahrenheit';
  //console.log(tempURL);
  return fetch(tempURL) //Fetches results
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(`Error in response: ${res.statusText}`))))
    .then(data => {
      const { time, temperature_2m } = data.hourly;
      return { time, temperature_2m }; //Fulfills the Promise with an object
    });
}

export function tempAvgAboveAtCoords(coords, temp) {
  // TODO
  return fetchCurrentTemperature(coords) //Fetches a fulfilled Promise
    .then(tempReading => {
      const { temperature_2m } = tempReading;
      const averageTemp = temperature_2m.reduce((acc, e) => acc + e, 0) / temperature_2m.length; //Calculates average temperature
      return averageTemp > temp;
    });
}
