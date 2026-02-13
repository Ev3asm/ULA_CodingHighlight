import { makeSearchURL } from "./utility.js";

// https://220.maxkuechen.com/universities/search?name=name+query+goes+here

export function fetchUniversities(query) {
  const searchURL = makeSearchURL('https://220.maxkuechen.com/universities/search', ['name'], [query]);
  //console.log(searchURL);
  return fetch(searchURL) // fetch the results
          .then(res => res.ok ? res.json() : Promise.reject(new Error(`Error in response: ${res.statusText}`))) // Check if there is error in response
          .then(json => Array.isArray(json)
          ? Promise.resolve(json) 
          : Promise.reject(new Error("No results found"))) // Reject if not array
          .then(uniArr => uniArr.map(e => e.name));
}

export function universityNameLengthOrderAscending(queryName) {
  let nameLength = -1;
  return fetchUniversities(queryName)
          .then((uniArr) => uniArr.every((uni) => {
            const retBool = uni.length > nameLength;
            nameLength = uni.length
            return retBool;
          }));
}
