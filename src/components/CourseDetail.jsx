import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoursePlayer from "./CoursePlayer";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./coursedetails.css";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [coursePlayerId, setcoursePlayerId] = useState();
  const [playCourse, setPlayCourse] = useState(false);
  const [relatedContent, setRelatedContent] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [reply, setReply] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const token = "5a029156dfd2ca4a7a5340b8a5c545a7";
  const boardId = "2596";

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
      const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/learningObjects?page[limit]=10&filter.loTypes=course&sort=name&filter.tagName=${courseId}&filter.ignoreEnhancedLP=false`;

      const response = await axios.get(apiUrl);

      setRelatedContent(response?.data);
    };
    fetchRelatedContent();
  }, [courseId]);

  useEffect(() => {
    const fetchPost = async () => {
      const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/boards/${boardId}/posts?page[offset]=0&page[limit]=10&sort=-dateCreated`;

      const response = await axios.get(apiUrl);
      console.log("response-post", response?.data);
      setPosts(response?.data?.data);
    };
    fetchPost();
  }, []);

  // function to play course/content passing ID in fluidic player
  const playVideo = (id) => {
    setPlayCourse(true);
    if (id) {
      setcoursePlayerId(id);
    } else {
      alert("Error while playing video");
    }
  };

  console.log("Course-test", course);

  const dummyData = {
    data: {
      type: "post",
      attributes: {
        richText: `<p>${input}</p>`,
        state: "ACTIVE",
      },
    },
  };

  const handlePost = async () => {
    console.log("Hello post ");
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/boards/${boardId}/posts`;
    const response = await axios({
      method: "POST",
      url: apiUrl,
      data: dummyData,
    });
    const status = response;
    setInput("");
  };

  const handleComment = (postId) => {
    console.log("postid", postId);
  };

  const handleReply = (postId) => {
    // console.log("post", postId);
    // setShowComment(!showComment);
    // if (postId) {
    //   setReply(true);
    // }
    setSelectedPostId(postId);
  };

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
                src={course?.data.attributes.bannerUrl}
                alt="course image"
                height={200}
                width={800}
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
      <h2>Related Content</h2>

      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        {/* tab for related content  */}
        <Tab eventKey="related-content" title="Related Content">
          {relatedContent &&
            relatedContent?.data?.map((course) => {
              return (
                <>
                  <div className="card-container" key={course?.id}>
                    <div>
                      <Card style={{ width: "18rem" }}>
                        <Card.Img
                          variant="top"
                          src={course?.attributes?.bannerUrl}
                        />
                        <Card.Body>
                          <Card.Title>
                            {course?.attributes?.localizedMetadata[0]?.name}
                          </Card.Title>
                          <Card.Text>
                            {
                              course?.attributes?.localizedMetadata[0]
                                ?.description
                            }
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </>
              );
            })}
        </Tab>
        {/* Tab for discussion  */}
        <Tab eventKey="discussion" title="Discussion">
          <>
            <div className="btn-conversation">
              <button onClick={() => setShowInput(!showInput)}>
                Start a Conversation
              </button>
            </div>
            {showInput && (
              <div className="input-container">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                />
                <button onClick={handlePost}>Post</button>
              </div>
            )}
            <div>
              {posts &&
                posts?.map((post) => {
                  return (
                    <>
                      <p>{post?.attributes?.text}</p>
                      <div>
                        <button className="btn">Like</button>
                        <button
                          className="btn"
                          onClick={() => handleReply(post?.id)}
                        >
                          Reply
                        </button>
                      </div>
                      {selectedPostId === post?.id && (
                        <>
                          <input type="text" className="comment-input" />
                          <button onClick={() => handleComment(post?.id)}>
                            Comment
                          </button>
                        </>
                      )}
                    </>
                  );
                })}
            </div>
          </>
        </Tab>
        <Tab eventKey="my-notes" title="My Notes">
          Tab content for Contact
        </Tab>
      </Tabs>
    </>
  );
};

export default CourseDetail;
