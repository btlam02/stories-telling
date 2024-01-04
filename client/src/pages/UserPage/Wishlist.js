import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  message,
  Select,
  Progress,
  Tooltip,
  Modal,
  Input,
} from "antd";
import {
  PlayCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  PlayCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [generatedStories, setGeneratedStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null); // Trạng thái để lưu câu chuyện đã chọn để thêm vào bảng thứ hai
  const userId = localStorage.getItem("id");
  const [voices, setVoices] = useState([]);
  const [voiceSelections, setVoiceSelections] = useState({});
  const [voiceId, setVoiceId] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleVoiceChange = (voiceId, storyId) => {
    setVoiceSelections((prevSelections) => ({
      ...prevSelections,
      [storyId]: voiceId,
    }));
  };

  useEffect(() => {
    // Fetch voices using the userId, this should return an array of voice objects
    const fetchVoices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/audio/list/${userId}`
        );
        // If voiceId is a direct property of the voice object, this is correct.
        // If it's nested inside another object, you need to adjust the path accordingly.
        setVoices(response.data);
      } catch (error) {
        console.error("Error fetching voices:", error);
        message.error("Failed to fetch voices.");
      }
    };

    fetchVoices();
  }, [userId]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const hideSearch = () => {
    setIsSearchVisible(false);
    setSearchText("");
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
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
            description: story.description,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  }, [userId]);

  const titleFilters = Array.from(
    new Set(wishlist.map((story) => story.title[0].toUpperCase()))
  ).map((letter) => ({
    text: letter,
    value: letter,
  }));

  const filteredWishlist = wishlist.filter((story) =>
    story.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const removeFromWishlist = (storyId) => {
    Modal.confirm({
      title: "Are you sure you want to remove this story from your wishlist?",
      content: "This action cannot be undone",
      okText: "Yes, remove it",
      cancelText: "No, keep it",
      onOk: () => {
        axios
          .delete(
            `http://localhost:8000/api/wishlist/${userId}/remove/${storyId}`
          )
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
      },
    });
  };

  const generateAudio = async (sessionId, text) => {
    const response = await axios.post(
      "https://research.vinbase.ai/voiceclone/infer",
      {
        session: sessionId,
        text: text,
        pitch: 1,
        speed: 1.0,
        lang: "vi",
      },
      {
        headers: {
          Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.infer_status) {
      return response.data.full_audio;
    } else {
      throw new Error("Audio generation failed");
    }
  };

  const retrieveAudio = async (audioPath) => {
    const response = await axios.get(
      `https://research.vinbase.ai/voiceclone/getaudio?filename=${audioPath}`,
      {
        headers: {
          Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
        },
        responseType: "blob",
      }
    );

    return URL.createObjectURL(response.data);
  };


  //
  const generateStory = async (storyId, storyDescription) => {
    const selectedVoiceId = voiceSelections[storyId];
    const story = wishlist.find((s) => s._id === storyId);
  
    if (!selectedVoiceId) {
      message.warning("Please select a voice to generate the story.");
      return;
    }
  
    if (!story) {
      message.error("Story not found.");
      return;
    }
  
    // Kiểm tra xem GIỌNG ĐỌC CỤ THỂ đã được tạo cho câu chuyện này chưa
    const voiceGenerated = story.userVoices.some(
      (voice) =>
        voice.voiceId === selectedVoiceId &&
        voice.status === "completed" // Bỏ điều kiện kiểm tra userId ở đây
    );
  
    if (voiceGenerated) {
      message.info("This story has already been generated with the selected voice.");
      return;
    }


    // Tiếp tục thực hiện generate story nếu giọng chưa được generated
    try {
      setLoading(true);
      setLoadingProgress(30);

      const audioPath = await generateAudio(selectedVoiceId, storyDescription);
      setLoadingProgress(60);

      const audioUrl = await retrieveAudio(audioPath);
      setLoadingProgress(90);

      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const formData = new FormData();
      formData.append("storyId", storyId);
      formData.append("userId", userId);
      formData.append("voiceId", selectedVoiceId);
      formData.append("audioFile", audioBlob, "story-audio.wav");

      const uploadResponse = await axios.post(
        `http://localhost:8000/api/stories/${storyId}/upload-audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        message.success("Story generated and saved successfully.");

        setWishlist((prevWishlist) =>
          prevWishlist.map((storyItem) => {
            if (storyItem._id === storyId) {
              // Cập nhật trạng thái của giọng đọc cụ thể
              const newUserVoices = storyItem.userVoices.map((voice) =>
                voice.voiceId === selectedVoiceId
                  ? { ...voice, status: "completed" }
                  : voice
              );
              return { ...storyItem, userVoices: newUserVoices };
            }
            return storyItem;
          })
        );
        const newVoice = {
          ...uploadResponse.data.newVoice, 
          status: "completed", 
          voiceId: selectedVoiceId, 
          userId: userId 
        };
        updateVoiceStatus(storyId, newVoice);
      } else {
        message.error("Failed to save the generated story.");
      }
    } catch (error) {
      console.error("Error in voice cloning process:", error);
      message.error("Failed to generate story.");
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  };


  // Ví dụ về cập nhật trạng thái sau khi tạo giọng đọc thành công:
// Giả sử bạn đã nhận được phản hồi từ server với thông tin giọng đọc mới đã tạo.

const updateVoiceStatus = (storyId, newVoice) => {
  setWishlist(currentWishlist =>
    currentWishlist.map(story => {
      if (story._id === storyId) {
        // Kiểm tra nếu voice đã tồn tại trong userVoices
        const voiceIndex = story.userVoices.findIndex(v => v.voiceId === newVoice.voiceId);
        if (voiceIndex > -1) {
          // Cập nhật voice hiện tại
          const updatedVoices = [...story.userVoices];
          updatedVoices[voiceIndex] = { ...updatedVoices[voiceIndex], ...newVoice };
          return { ...story, userVoices: updatedVoices };
        } else {
          // Thêm voice mới
          return { ...story, userVoices: [...story.userVoices, newVoice] };
        }
      }
      return story;
    })
  );
  // Cập nhật các state khác nếu cần
  // ...
};


  const addToPlaylist = async (storyId) => {
    try {
      await axios.post(`http://localhost:8000/api/playlist/add`, {
        userId,
        storyId,
      });
      message.success("Story added to playlist.");
    } catch (error) {
      console.error("Error adding to playlist:", error);
      message.error("Failed to add to playlist.");
    }
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
      title: isSearchVisible ? (
        <Input
          placeholder="Search by title"
          onChange={handleSearch}
          onBlur={hideSearch} // Thêm sự kiện onBlur
          autoFocus
        />
      ) : (
        <Button
          icon={<SearchOutlined />}
          onClick={() => setIsSearchVisible(true)}
        />
      ),
      dataIndex: "title",
      key: "title",
      // Lọc dữ liệu dựa trên searchText
      onFilter: (value, record) =>
        record.title.toLowerCase().includes(searchText.toLowerCase()),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },

    {
      title: "Voice",
      key: "voice",
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          onChange={(value) => handleVoiceChange(value, record._id)}
          value={voiceSelections[record._id]}
        >
          {voices.map((voice) => (
            <Option key={voice._id} value={voice.voiceId || voice._id}>
              {voice.title}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        const userId = localStorage.getItem("id");
        const selectedVoiceId = voiceSelections[record._id];
    
        // Kiểm tra xem câu chuyện này đã được generated với giọng đọc đã chọn chưa
        const voiceGenerated = record.userVoices.some(
          (voice) => voice.voiceId === selectedVoiceId && voice.status === "completed"
        );
        const isGenerating = loading && selectedStoryId === record._id;
    
        return (
          <>
            {!selectedVoiceId && (
              <Tooltip title="Select a voice first">
                <Button icon={<PlayCircleOutlined />} disabled />
              </Tooltip>
            )}
    
            {selectedVoiceId && !voiceGenerated && (
              <Tooltip title="Generate Story">
                <Button
                  icon={<PlayCircleFilled />}
                  loading={isGenerating}
                  onClick={() => generateStory(record._id, record.description)}
                  disabled={isGenerating}
                />
              </Tooltip>
            )}
    
            {selectedVoiceId && voiceGenerated && (
              <Tooltip title="Add to Playlist">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => addToPlaylist(record._id)}
                  disabled={isGenerating}
                />
              </Tooltip>
            )}
    
            <Tooltip title="Remove from Wishlist">
              <Button
                onClick={() => removeFromWishlist(record._id)}
                disabled={isGenerating}
                style={{ marginLeft: 5 }}
              >
                {<DeleteOutlined />}
              </Button>
            </Tooltip>
          </>
        );
      },
    }
    
  ];

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ margin: "50px 100px 0px 105px" }}>
        <h2>My Wishlist</h2>
        <Table
          columns={wishlistColumns}
          dataSource={filteredWishlist}
          rowKey="_id"
        />
      </div>
    </div>
  );
};

export default WishlistPage;
