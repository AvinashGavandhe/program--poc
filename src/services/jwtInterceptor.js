import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer 00e511c4e99da588cef6ee5c13c5ed16
    `,
  };
}
