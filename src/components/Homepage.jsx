import { useEffect, useState } from "react";
import axios from "axios";
import "./homepage.css";
import Accordion from "react-bootstrap/Accordion";
import CoursePlayer from "./CoursePlayer";
import { useLocation, Link } from "react-router-dom";

const Homepage = () => {
  const [response, setResponse] = useState();
  const [playCourse, setPlayCourse] = useState(false);
  const [resourceData, setResourceData] = useState([]);
  const [courseDetails, setCourseDetails] = useState();
  const [programDetailObject, setProgramDetailObject] = useState({});
  const [jobAids, setJobAids] = useState();
  const [courseId, setCourseId] = useState();
  const [badgeId, setBadgeId] = useState();
  const [badgeResponse, setBadgeResponse] = useState();

  let location = useLocation();
  const token = "f5d28545621b41599fea61831d17a0ce";
  const cid = "learningProgram:60466";

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/learningObjects/${cid}?include=enrollment.loResourceGrades%2CsubLOs.enrollment.loResourceGrades%2Cenrollment.loInstance.loResources.resources%2Cinstances.loResources.resources%2Cskills.skillLevel.skill%2CsubLOs.instances.subLoInstances%2CsubLOs.instances.loResources.resources%2CsubLOs.subLOs%2csupplementaryResources%2CsupplementaryLOs`;
      try {
        const response = await axios.get(apiUrl);
        setResponse(response?.data);
        console.log("response?.data", response?.data);
        const program = response?.data?.data?.relationships?.instances?.data;
        const programDetails = {};
        if (program) {
          for (let i = 0; i < program.length; i++) {
            const programList = response?.data?.included?.find(
              (ele) => ele.id == program[i].id
            );
            programDetails.name =
              response?.data?.data?.attributes?.localizedMetadata[0]?.name;
            programDetails.overview =
              response?.data?.data?.attributes?.localizedMetadata[0]?.overview;
            programDetails.bannerImage =
              response?.data?.data?.attributes?.bannerUrl;
            programDetails.completionDeadline =
              programList?.attributes.completionDeadline;
            programDetails.enrollmentDeadline =
              programList?.attributes.enrollmentDeadline;
          }
          setProgramDetailObject(programDetails);
        }
        console.log("programDetails", programDetails);
        // get the resources details
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

        // get the week details and course under it
        const res = response?.data?.data?.relationships?.subLOs?.data;
        const courseList = [];
        for (let i = 0; i < res.length; i++) {
          const temp = {};
          const LPDetails = response?.data?.included?.find(
            (ele) => ele.id == res[i].id
          );

          temp.name = LPDetails?.attributes?.localizedMetadata[0]?.name;
          temp.overview = LPDetails?.attributes?.localizedMetadata[0]?.overview;
          temp.id = LPDetails?.id;
          // temp.tag = LPDetails?.attributes?.tags[0];
          temp.supplementaryResources =
            LPDetails?.relationships?.supplementaryResources ?? null;
          console.log("Temp0", temp);
          let courseArray = [];
          const learningPathCourseDetails = response?.data?.included?.find(
            (ele) => ele?.id === temp?.id
          );
          if (learningPathCourseDetails) {
            const subLos =
              learningPathCourseDetails?.relationships?.subLOs?.data;
            if (subLos) {
              for (let i = 0; i < subLos.length; i++) {
                const courseAttributes = {};
                const course = response?.data?.included?.find(
                  (ele) => ele.id === subLos[i]?.id
                );
                courseAttributes.name =
                  course?.attributes?.localizedMetadata[0].name;
                courseAttributes.id = course?.id;
                courseAttributes.description =
                  course?.attributes?.localizedMetadata[0]?.description;
                courseArray.push(courseAttributes);
              }
            }
          }
          temp.courseArray = courseArray;

          // get the instance details
          const LPInstanceDetails = response?.data?.included?.find(
            (ele) => ele?.id === temp?.id
          );
          const instanceObject = {};
          if (LPInstanceDetails) {
            const instances = LPInstanceDetails?.relationships?.instances?.data;
            if (instances) {
              for (let i = 0; i < instances.length; i++) {
                const instanceDetails = response?.data?.included?.find(
                  (ele) => ele.id === instances[i]?.id
                );
                instanceObject.enrollmentDeadline =
                  instanceDetails?.attributes?.enrollmentDeadline;
              }
            }
          }

          //  get badge details
          const badge = response?.data?.included;
          badge.map((badgeItem) => {
            // console.log("badgeItem", index ,badgeItem);
            if (badgeItem?.relationships?.badge) {
              console.log(
                "badge ID",
                badgeItem?.relationships?.badge?.data?.id
              );
              setBadgeId(badgeItem?.relationships?.badge?.data?.id);
            }
          });
          const spData =
            courseArray?.relationships?.supplementaryResources?.data;
          const spList = [];
          if (spData?.length > 0) {
            const sp = {};
            for (let j = 0; j < spData?.length; j++) {
              const res = response?.data?.included?.find(
                (ele) => ele?.id == spData[j]?.id
              );
              sp.name = res?.attributes?.name;
              sp.location = res?.attributes?.location;
              spList.push(sp);
            }
          }
          temp.supplementaryResources = spList;
          temp.enrollmentDeadline = instanceObject?.enrollmentDeadline;
          courseList.push(temp);
          setCourseDetails(courseList);
        }

        const jobAidsID =
          response?.data?.data?.relationships?.supplementaryLOs?.data[0].id;
        setJobAids(jobAidsID);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  // useEffect for badge API call
  useEffect(() => {
    const badgeData = async () => {
      if (badgeId) {
        const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/badges/${badgeId}`;
        try {
          const response = await axios.get(apiUrl);
          setBadgeResponse(response?.data);
          console.log("Badge Data", response?.data);
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    badgeData();
  }, [badgeId]);

  function formatEnrollmentDeadlineForProgram(enrollmentDeadline) {
    const sevenDaysBefore = new Date(enrollmentDeadline);
    sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 21); // Subtract 21 days
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return sevenDaysBefore.toLocaleString("en-US", options);
  }

  function formatCompletionDeadlineForProgram(enrollmentDeadline) {
    const sevenDaysBefore = new Date(enrollmentDeadline);
    sevenDaysBefore.setDate(sevenDaysBefore.getDate());
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return sevenDaysBefore.toLocaleString("en-US", options);
  }

  function formatEnrollmentDeadline(enrollmentDeadline) {
    const sevenDaysBefore = new Date(enrollmentDeadline);
    sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7); // Subtract 7 days
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return sevenDaysBefore.toLocaleString("en-US", options);
  }

  const hasWeekStart = (enrollmentDeadline) => {
    if (enrollmentDeadline) {
      const startDate = new Date(enrollmentDeadline);
      startDate.setDate(startDate.getDate() - 7);
      console.log("StartDate", startDate);
      const currentDate = new Date();
      console.log("current Date", currentDate);

      return startDate <= currentDate;
    }
    return false;
  };

  // function to play course/content passing ID in fluidic player
  const playVideo = (id) => {
    setPlayCourse(true);
    if (id) {
      setCourseId(id);
    } else {
      alert("Error while playing video");
    }
  };

  // function for bookmarkContent we need to implement in next page
  const bookmarkContent = async (courseID) => {
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/learningObjects/${courseID}/bookmark`;
    try {
      const response = await axios.post(apiUrl);
      console.log("response-book", response);
      if (response?.status == 201) {
        console.log("test-bookmark");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle enrollment
  // const handleEnrollment = async (loId, instanceId) => {
  //   console.log("loid", loId, instanceId);
  //   console.log("response?.data?.attributes?.id", response?.data?.id);
  //   const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/enrollments?loId=${loId}&loInstanceId=${instanceId}`;
  //   try {
  //     const response = await axios.get(apiUrl);
  //     console.log("response?.data-book", response?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // setResponse(response?.data);
  // };

  const handleUnenrollment = async (enrollmentId) => {
    console.log("unenrollment", enrollmentId);
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/enrollments/${enrollmentId}`;
    try {
      const response = await axios.delete(apiUrl);
      console.log("response?.data-book", response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      {playCourse ? (
        <CoursePlayer
          cid={courseId}
          goBackUrl={location.pathname}
          token={token}
        />
      ) : null}
      <div className="title-container">
        <h3>Programs</h3>
        <img
          src={programDetailObject.bannerImage}
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
        <h2>Program Name: {programDetailObject?.name}</h2>

        <div className="description">
          <p>Description: {programDetailObject?.overview}</p>
        </div>
        <div className="dateDetails">
          <p>
            Enrollment start from:{" "}
            {formatEnrollmentDeadlineForProgram(
              programDetailObject?.enrollmentDeadline
            )}
          </p>
          <p>
            Completion Deadline:
            {formatCompletionDeadlineForProgram(
              programDetailObject?.completionDeadline
            )}
          </p>
        </div>
        <div className="btn-container">
          <button onClick={() => playVideo(jobAids)}>Play Trailer Video</button>
        </div>
        <div>
          <div className="badge">
            {badgeResponse ? (
              <div>
                <p style={{ color: "black" }}>
                  {badgeResponse?.data?.attributes?.name}
                </p>
                <img
                  src={badgeResponse?.data?.attributes?.imageUrl}
                  alt=""
                  height={200}
                  width={200}
                />
              </div>
            ) : null}

            <div className="enrollment">
              {/* <button
                onClick={() =>
                  handleEnrollment(
                    response?.data?.id,
                    response?.data?.relationships?.instances?.data[0]?.id
                  )
                }
              >
                Enroll Now
              </button> */}
              {true && (
                <button
                  onClick={() =>
                    handleUnenrollment(
                      response?.data?.relationships?.enrollment?.data?.id
                    )
                  }
                >
                  Unenroll from this program
                </button>
              )}
            </div>

            <div className="unenrollment"></div>
          </div>
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
        <div className="section">
          {courseDetails &&
            courseDetails.map((week) => {
              return (
                <>
                  <Accordion>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <h2>{week?.name}</h2>
                        <p>
                          {formatEnrollmentDeadline(week?.enrollmentDeadline)}
                        </p>
                        <p>
                          {hasWeekStart(week.enrollmentDeadline)
                            ? "enabled"
                            : "disabled"}
                        </p>
                      </Accordion.Header>
                      {week?.courseArray?.map((course) => {
                        return (
                          <div key={course?.id}>
                            <Link to={`/course/${course?.id}`}>
                              <Accordion.Body style={{ color: "red" }}>
                                <h4 onClick={() => playVideo(course?.id)}>
                                  {course?.name}
                                </h4>
                                <p>{course?.description}</p>
                                <button
                                  onClick={() => bookmarkContent(course?.id)}
                                >
                                  Bookmark
                                </button>
                                <hr />
                              </Accordion.Body>
                            </Link>
                          </div>
                        );
                      })}
                    </Accordion.Item>
                  </Accordion>
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
