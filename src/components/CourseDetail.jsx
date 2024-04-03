import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoursePlayer from "./CoursePlayer";
const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [coursePlayerId, setcoursePlayerId] = useState();
  const [playCourse, setPlayCourse] = useState(false);

  const token = "8e0cea38d5de4113e0567e1f6a0ad487";

  useEffect(() => {
    // Fetch course details based on courseId
    const fetchData = async () => {
      const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/learningObjects/${courseId}`;
      try {
        const response = await axios.get(apiUrl);
        setCourse(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [courseId]);

  // function to play course/content passing ID in fluidic player
  const playVideo = (id) => {
    setPlayCourse(true);
    if (id) {
      setcoursePlayerId(id);
    } else {
      alert("Error while playing video");
    }
  };

  console.log("xourse", course);

  return (
    <>
      {playCourse ? (
        <CoursePlayer
          cid={coursePlayerId}
          goBackUrl={location.pathname}
          token={token}
        />
      ) : null}
      <div>
        <div>
          {course ? (
            <>
              <img
                src={course?.data?.attributes?.bannerUrl}
                alt="course image"
              />
              <h2>
                {" "}
                Course name: {course.data.attributes.localizedMetadata[0].name}
              </h2>
              <p>
                Description:{" "}
                {course.data.attributes.localizedMetadata[0].description}
              </p>
              <p>
                Overview: {course.data.attributes.localizedMetadata[0].overview}{" "}
              </p>
              <button onClick={() => playVideo(course?.data?.id)}>Play Course</button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseDetail;