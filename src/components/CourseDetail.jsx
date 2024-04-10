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
  // const [showComment, setShowComment] = useState(false);
  // const [reply, setReply] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comment, setComment] = useState("");
  const [commentsArray, setCommentsArray] = useState([]);
  const [isBookmarkContent, setIsBookmarkContent] = useState(false);

  const token = "f5d28545621b41599fea61831d17a0ce";
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

  const dummyComment = {
    data: {
      type: "comment",
      attributes: {
        dateCreated: "2023-03-10T10:53:15.000Z",
        dateUpdated: "2023-03-10T10:53:15.000Z",
        downVote: 0,
        replyCount: 0,
        richText: `<p>${comment}</p>`,
        state: "ACTIVE",
        text: `<p>${comment}</p>`,
        upVote: 0,
      },
    },
  };

  const getComment = async (postId) => {
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/posts/${postId}/comments?page[offset]=0&page[limit]=10&sort=-dateUpdated`;

    const response = await axios.get(apiUrl);
    console.log("comment", response?.data?.data);
    setCommentsArray(response?.data?.data);
  };

  const handlePost = async () => {
    console.log("Hello post", input);
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/boards/${boardId}/posts`;
    const response = await axios({
      method: "POST",
      url: apiUrl,
      data: dummyData,
    });
    const status = response;
    setInput("");
  };

  const handleComment = async (postId) => {
    console.log("comment", comment);
    // https://learningmanagereu.adobe.com/primeapi/v2/posts/19051/comments
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/posts/${postId}/comments`;
    const response = await axios({
      method: "POST",
      url: apiUrl,
      data: dummyComment,
    });
    const status = response;
    setComment("");
  };

  const handleReply = (postId) => {
    // console.log("post", postId);
    // setShowComment(!showComment);
    // if (postId) {
    //   setReply(true);
    // }
    getComment(postId);
    setSelectedPostId(postId);
  };

  const handleBookmark = async () => {
    console.log("course", courseId);
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/learningObjects/${courseId}/bookmark`;
    try {
      const response = await axios.post(apiUrl);
      console.log("bookmark", response);
      if (response?.status == 201) {
        console.log("test-bookmark");
        setIsBookmarkContent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (commentId) => {
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/comments/${commentId}/vote?action=UP`;
    const response = await axios({
      method: "POST",
      url: apiUrl,
      data: dummyData,
    });
    const status = response;
    console.log("status", status);
  };

  const handleDisLike =async(commentId) => {
    const apiUrl = `https://learningmanagereu.adobe.com/primeapi/v2/comments/${commentId}/vote?action=DOWN`;
    const response = await axios({
      method: "POST",
      url: apiUrl,
      data: dummyData,
    });
    const status = response;
    console.log("status", status);

  }

  // console.log("id", isBookmarkContent);

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
              <div>
                <button className="btn">Share</button>
                {isBookmarkContent ? (
                  <button className="btn">Bookmarked</button>
                ) : (
                  <button className="btn" onClick={handleBookmark}>
                    Bookmark
                  </button>
                )}
              </div>
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
              <h2>Posts</h2>
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
                          <div>
                            <input
                              type="text"
                              className="comment-input"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                              className="btn"
                              onClick={() => handleComment(post?.id)}
                            >
                              Comment
                            </button>
                          </div>
                          <div className="comment-section">
                            {commentsArray?.map((comment) => {
                              console.log("id", comment);
                              return (
                                <>
                                  <h6>{comment?.attributes.richText}</h6>
                                  {/* like */}

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-hand-thumbs-up"
                                    viewBox="0 0 16 16"
                                    onClick={() => handleLike(comment?.id)}
                                  >
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                                  </svg>
                                  {/* dislike  */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-hand-thumbs-up-fill"
                                    viewBox="0 0 16 16"
                                    onClick={() => handleDisLike(comment?.id)}
                                  >
                                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                                  </svg>
                                </>
                              );
                            })}
                          </div>
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
