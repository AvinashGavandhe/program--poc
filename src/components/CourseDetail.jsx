import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoursePlayer from "./CoursePlayer";
import Card from "react-bootstrap/Card";
import "./coursedetails.css";
const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [coursePlayerId, setcoursePlayerId] = useState();
  const [playCourse, setPlayCourse] = useState(false);
  const [relatedContent, setRelatedContent] = useState([]);

  const token = "3259c549e7f5663f6240bfa6be44ecef";

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

    const fetchRelatedContent = async () => {
      const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/learningObjects?page[limit]=10&filter.loTypes=course&sort=name&filter.tagName=related-content&filter.ignoreEnhancedLP=false`;

      const response = await axios.get(apiUrl);

      setRelatedContent(response?.data);
    };
    fetchRelatedContent();
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

  console.log("relatedcontent", relatedContent?.data);

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
              <button onClick={() => playVideo(course?.data?.id)}>
                Play Course
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      {relatedContent &&
        relatedContent?.data?.map((course) => {
          console.log("course", course);
          return (
            <div className="content-container" key={course?.id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" src={course?.attributes?.bannerUrl} />
                <Card.Body>
                  <Card.Title>
                    {course?.attributes?.localizedMetadata[0]?.name}
                  </Card.Title>
                  <Card.Text>
                    {course?.attributes?.localizedMetadata[0]?.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        })}
    </>
  );
};

export default CourseDetail;
