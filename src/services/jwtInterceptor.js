import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer 3259c549e7f5663f6240bfa6be44ecef
    `,
  };
}
