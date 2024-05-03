import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer f4c0993b8e0ce19384083649345347a6
    `,
  };
}
