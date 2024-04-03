import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer 29fcc2284e20a980a52e660051587b6b
    `,
  };
}
