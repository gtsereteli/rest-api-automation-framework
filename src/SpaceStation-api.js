const request = require("request-promise");

const baseUrl = "https://api.wheretheiss.at";
const prefix = "v1/satellites";
const stationId = "25544";

// Class representing a Wheretheiss api
class IssApi {
  // Constructor initializes default request options
  constructor() {
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Method to get details on ISS location
   *
   * @returns {Promise} - Promise representing ISS location details
   */
  getStation() {
    const path = `${baseUrl}/${prefix}/${stationId}`;
    return this.request.get({
      url: path,
    });
  }
}

module.exports = IssApi;
