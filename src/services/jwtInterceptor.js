import axios from "axios";

export function jwtInterceptor() {
  console.log("Jwt called");
  axios.defaults.headers.common = {
    Authorization: `Bearer 8e0cea38d5de4113e0567e1f6a0ad487
    `,
  };
}
