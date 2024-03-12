import { useEffect, useState } from "react";
import axios from "axios";
import "./homepage.css";
import Accordion from "react-bootstrap/Accordion";
import CoursePlayer from "./CoursePlayer";
import { useLocation } from "react-router-dom";

const Homepage = () => {
  const [response, setResponse] = useState();
  const [playCourse, setPlayCourse] = useState(false);
  const [resourceData, setResourceData] = useState([]);
  const [courseDetails, setCourseDetails] = useState();
  let location = useLocation();
  const token = "cccf80201d23556175a9b66ad31e8738";
  const cid = "learningProgram:59671";
  // const cid = "learningProgram:59654";
  // const cid = "course:2153078";
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/learningObjects/${cid}?include=enrollment.loResourceGrades%2CsubLOs.enrollment.loResourceGrades%2Cenrollment.loInstance.loResources.resources%2Cinstances.loResources.resources%2Cskills.skillLevel.skill%2CsubLOs.instances.subLoInstances%2CsubLOs.instances.loResources.resources%2CsubLOs.supplementaryResources%2CsupplementaryResources`;
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setResponse(response?.data);
        console.log("response?.data", response?.data);
        const responseData =
          response?.data?.data?.relationships?.hasOwnProperty(
            "supplementaryResources"
          )
            ? response?.data?.data?.relationships?.supplementaryResources?.data
            : [];
        const resourcePDFLink = [];
        const documentArray = [];
        responseData?.forEach((ele) => {
          const finalArr = responseData.find((item) => item.id == ele?.id);
          resourcePDFLink.push(finalArr);
          const data = response?.data?.included.find(
            (item) => item.id == ele.id
          );
          documentArray.push(data);
        });
        setResourceData(documentArray);

        const res = response?.data?.data?.relationships?.subLOs?.data;
        const courseList = [];
        for (let i = 0; i < res.length; i++) {
          const temp = {};
          const courseDetails = response?.data?.included?.find(
            (ele) => ele.id == res[i].id
          );
          console.log("courseDetails", courseDetails);
          temp.name = courseDetails?.attributes?.localizedMetadata[0]?.name;
          temp.overview =
            courseDetails?.attributes?.localizedMetadata[0]?.overview;
          temp.id = courseDetails?.id;
          // temp.image = courseDetails?.attributes?.imageUrl;
          // temp.supplementaryResources =
          //   courseDetails?.relationships?.supplementaryResources ?? null;
          const spData =
            courseDetails?.relationships?.supplementaryResources?.data;

          // console.log("Testing",spData)
          const spList = [];
          if (spData?.length > 0) {
            const sp = {};
            for (let j = 0; j < spData?.length; j++) {
              console.log("res", response?.data?.included);
              const res = response?.data?.included?.find(
                (ele) => ele?.id == spData[j]?.id
              );
              console.log("testing..", res);
              sp.name = res?.attributes?.name;
              sp.location = res?.attributes?.location;
              spList.push(sp);
            }
          }
          temp.supplementaryResources = spList;

          courseList.push(temp);
          console.log("listing", courseList);
          setCourseDetails(courseList);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);
  console.log("course", courseDetails);
  return (
    <div className="container">
      {playCourse ? (
        <CoursePlayer cid={cid} goBackUrl={location.pathname} token={token} />
      ) : null}
      <div className="title-container">
        <h3>Programs</h3>
        <img
          src={response?.data?.attributes?.bannerUrl}
          alt=""
          style={{ height: "100px", width: "100px" }}
        />
        <p>banner Image</p>

        <img
          src={response?.data?.attributes?.imageUrl}
          alt="cover-image"
          style={{ height: "100px", width: "100px" }}
        />
        <p>cover Image</p>
        <h2>
          Program Name: {response?.data?.attributes?.localizedMetadata[0].name}
        </h2>

        <div className="description">
          <p>
            Description:{" "}
            {response?.data?.attributes?.localizedMetadata[0].overview}
          </p>
        </div>
        <div className="btn-container">
          <button
            onClick={() => {
              setPlayCourse((prev) => !prev);
            }}
          >
            Play Course
          </button>
        </div>
        <div>
          <p>Class Resources</p>
          {resourceData &&
            resourceData?.map((ele) => {
              return (
                <a
                  key={ele?.attributes?.name}
                  href={ele?.attributes?.location}
                  target="_blank"
                >
                  {ele?.attributes?.name}
                </a>
              );
            })}
        </div>
      </div>
      <div className="list-container">
        {response?.data?.attributes?.sections.map((section) => (
          <div key={section.sectionId} className="section">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h3>{section.localizedMetadata[0].name}</h3>
                </Accordion.Header>
                <Accordion.Body>
                  {courseDetails
                    .filter((course) => section.loIds.includes(course.id))
                    .map((course) => (
                      <div key={course.id} className="course-details">
                        <h2>{course.name}</h2>
                        <div className="description">
                          <p>{course.overview}</p>
                        </div>
                        <div>
                          <p>Course Attachment</p>
                          <a href={course.supplementaryResources[0]?.location} target="_blank">
                            {course.supplementaryResources[0]?.name}  
                          </a>
                        </div>
                        <hr />
                      </div>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
