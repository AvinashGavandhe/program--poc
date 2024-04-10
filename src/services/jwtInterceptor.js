import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer f5d28545621b41599fea61831d17a0ce
    `,
  };
}
