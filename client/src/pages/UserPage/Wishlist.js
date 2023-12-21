import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message } from "antd";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [generatedStories, setGeneratedStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null); // Trạng thái để lưu câu chuyện đã chọn để thêm vào bảng thứ hai
  const userId = localStorage.getItem("id");

  useEffect(() => {
    // Fetch the user's wishlist
    axios
      .get(`http://localhost:8000/api/wishlist/${userId}`)
      .then((response) => {
        console.log(response.data.stories);
        setWishlist(
          response.data.stories.map((story) => ({
            ...story,
            imageUrl: story.imageUrl
              ? `http://localhost:8000/${story.imageUrl}`
              : null,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  }, [userId]);

  const removeFromWishlist = (storyId) => {
    axios
      .delete(`http://localhost:8000/api/wishlist/${userId}/remove/${storyId}`)
      .then((response) => {
        if (response.status === 200) {
          message.success("Removed from wishlist.");
          setWishlist((prevWishlist) =>
            prevWishlist.filter((story) => story._id !== storyId)
          );
        } else {
          message.error("Failed to remove from wishlist.");
        }
      })
      .catch((error) => {
        console.error("Error removing from wishlist:", error);
        message.error("Failed to remove from wishlist.");
      });
  };

  const generateStory = (storyId) => {
    axios
      .post(`http://localhost:8000/api/generate/story/${storyId}`)
      .then((response) => {
        if (response.status === 200) {
          message.success("Story generated successfully.");
          setGeneratedStories((prevGeneratedStories) => [
            ...prevGeneratedStories,
            response.data.story,
          ]);
          setSelectedStoryId(response.data.story._id); // Lưu ID của câu chuyện đã tạo thành công
          removeFromWishlist(storyId);
        } else {
          message.error("Failed to generate story.");
        }
      })
      .catch((error) => {
        console.error("Error generating story:", error);
        message.error("Failed to generate story.");
      });
  };

  const addToPlaylist = (storyId) => {
    // Thêm câu chuyện vào danh sách phát
    // Thực hiện logic tương tự như chức năng Remove from Wishlist
    // Tùy chỉnh theo nhu cầu của bạn
    // ...
  };

  const wishlistColumns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <img src={imageUrl} alt="Story" style={{ maxWidth: "50px" }} />
        ) : (
          "No image"
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            icon={
              <span role="img" aria-label="Generate">
                🎧
              </span>
            }
            style={{ marginRight: 16 }}
            onClick={() => generateStory(record._id)}
          >
            Generate
          </Button>
          <Button
            type="danger"
            icon={
              <span role="img" aria-label="Remove from Wishlist">
                ❌
              </span>
            }
            onClick={() => removeFromWishlist(record._id)}
          >
            Remove from Wishlist
          </Button>
          {selectedStoryId === record._id && (
            <Button
              type="primary"
              icon={
                <span role="img" aria-label="Move to Generated">
                  ➡️
                </span>
              }
              style={{ marginLeft: 16 }}
              onClick={() => {
                const selectedStory = wishlist.find(
                  (story) => story._id === selectedStoryId
                );
                if (selectedStory) {
                  setGeneratedStories((prevGeneratedStories) => [
                    ...prevGeneratedStories,
                    selectedStory,
                  ]);
                  setSelectedStoryId(null);
                }
              }}
            >
              Move to Generated
            </Button>
          )}
        </>
      ),
    },
  ];

  const generatedColumns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <img src={imageUrl} alt="Story" style={{ maxWidth: "50px" }} />
        ) : (
          "No image"
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            icon={
              <span role="img" aria-label="Add to Playlist">
                ➕
              </span>
            }
            style={{ marginRight: 16 }}
            onClick={() => addToPlaylist(record._id)}
          >
            Add to Playlist
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{margin:'100px 200px 0px 300px' }}>
        <h2>My Wishlist</h2>    
        <Table columns={wishlistColumns} dataSource={wishlist} rowKey="_id" />
      </div>
      <div style={{margin:'0px 200px 100px 300px' }}>
        <h2>Generated Stories</h2>
        <Table columns={generatedColumns} dataSource={generatedStories} rowKey="_id" />
      </div>
    </div>
  );
};

export default WishlistPage;
