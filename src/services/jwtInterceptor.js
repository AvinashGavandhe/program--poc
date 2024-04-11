import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer 15971f8775c9c5783b24ae068415c84e
    `,
  };
}
