import React, { useEffect } from "react";

class HospitalAppointmentService {
  constructor() {
  
    this.ORIGIN = process.env.REACT_APP_ORIGIN;
    this.BASE_URL = process.env.REACT_APP_BASE_URL;
  }

  getHeaders = (token) => {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.ORIGIN,
        Authorization: "Bearer " + token,
      },
    };
  };

  getMsHeaders = () => {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.ORIGIN,
      },
    };
  };
}



export {
  HospitalAppointmentService
};
