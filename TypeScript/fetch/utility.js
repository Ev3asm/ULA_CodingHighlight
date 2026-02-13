// Even if you do not use this file, do not delete it. The autograder will fail.

import { URL } from "url"; // Import the URL class from the url library

export function makeSearchURL(url, queryNames, queries) {
  // Construct a new URL object using the resource URL
  const searchURL = new URL(url);

  // Access the searchParams field of the constructed url
  // The field holds an instance of the URLSearchParams
  // Add a new "q" parameter with the value of the functions input
  queryNames.forEach((qName, index) => searchURL.searchParams.append(qName, queries[index]));

  return searchURL.toString(); // Return the resulting complete URL
}

export class Average{
  constructor(){
    this.num = 0;
    this.den = 0;
  }

  add(toAdd){
    this.num += toAdd;
    this.den++;
    return this;
  }
  
  calcAvg(){
    if (this.den === 0){
      return 0;
    } else {
      return this.num/this.den;
    }
  }
}