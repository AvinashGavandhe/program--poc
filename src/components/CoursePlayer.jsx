import React, { useEffect, useRef } from "react";
// import styles from './CoursePlayer.module.scss';
import styles from "../components/coursePlayer.module.scss";
import { useNavigate } from "react-router-dom";
function CoursePlayer(props) {
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const { cid, goBackUrl, token } = props;
  console.log("goBackUrl", goBackUrl);
  //   const token = "098bb3cd3bee34a1bb1d584ee6155588";
  useEffect(() => {
    let url = `https://learningmanagereu.adobe.com/app/player?lo_id=${cid}&access_token=${token}`;
    // if (mid) {
    //   url = url + `&module_id=${mid}`;
    // }

    if (url && iframeRef?.current) {
      iframeRef.current.src = url;
      iframeRef.current.setAttribute("allowTransparency", "true");
      iframeRef.current.setAttribute("allowFullScreen", "true");
    }
    const closePlayer = (event) => {
      if (event.data === "status:close") {
        // window.document.body.style.overflowY = "auto";
        window.removeEventListener("message", closePlayer);
        navigate("/exit");
      }
    };
    window.addEventListener("message", closePlayer);
    return () => {
      //   window.document.body.style.overflowY = "auto";
      window.removeEventListener("message", closePlayer);
      navigate(goBackUrl);
    };
  }, [token, cid, goBackUrl]);

  return (
    <div className={styles["course-player-container"]}>
      <div className={styles["course-player-wrapper"]}>
        <iframe
          ref={iframeRef}
          id="pplayer_iframe"
          name="pfplayer_frame"
          title="Player"
          className={styles["course-player-iframe"]}
          style={{
            display: "block",
            background: "#000",
            border: "none",
            height: "70%",
            width: "60%",
          }}
        />
      </div>
    </div>
  );
}

export default CoursePlayer;
