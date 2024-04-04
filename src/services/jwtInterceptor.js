import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer 59ec802573a233608370a4cceac4077b
    `,
  };
}
