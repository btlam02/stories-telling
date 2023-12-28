import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Select } from "antd";
const { Option } = Select;

const WishlistPage = () => {


  const baseUrl = "http://localhost:8000/api"
  const [wishlist, setWishlist] = useState([]);
  const [generatedStories, setGeneratedStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null); // Trạng thái để lưu câu chuyện đã chọn để thêm vào bảng thứ hai
  const userId = localStorage.getItem("id");
  const [voices, setVoices] = useState([]);
  const [voiceSelections, setVoiceSelections] = useState({});



  const handleVoiceChange = (value, storyId) => {
    setVoiceSelections((prevSelections) => ({
      ...prevSelections,
      [storyId]: value, // Cập nhật voiceId được chọn cho storyId
    }));
  };

  const handleGenerate = (storyId) => {
    const voiceId = voiceSelections[storyId]; // Lấy voiceId từ state
    if (!voiceId) {
      message.warning("Please select a voice to generate the story.");
      return;
    }

    // Gọi API để generate câu chuyện với giọng đọc được chọn
    axios
      .post(`http://localhost:8000/api/generate/story`, {
        storyId: storyId,
        voiceId: voiceId,
      })
      .then((response) => {
        // Kiểm tra phản hồi và cập nhật UI tương ứng
        if (response.data.success) {
          message.success("Story generated successfully.");
          // Cập nhật danh sách generated stories nếu cần
        } else {
          message.error("Failed to generate story.");
        }
      })
      .catch((error) => {
        console.error("Error generating story:", error);
        message.error("Failed to generate story.");
      });
  };

  useEffect(() => {
    // Fetch voices using the userId, this should return an array of voice objects
    const fetchVoices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/audio/list/${userId}`
        );
        setVoices(response.data); // Assuming response.data is an array of voice objects with id and name
      } catch (error) {
        console.error("Error fetching voices:", error);
        message.error("Failed to fetch voices.");
      }
    };

    fetchVoices();
  }, [userId]);





 


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

  const fetchVoiceFile = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      return new File([blob], "voiceFile.wav", { type: 'audio/wav' });
    } catch (error) {
      console.error("Error fetching voice file:", error);
      throw error;
    }
  };
  


  const validateVoice = async (voiceFile, sessionId) => {
    const formData = new FormData();
    formData.append("selectedFile", voiceFile); 
    formData.append("data", JSON.stringify({
      session: sessionId,
      youtubeURL: "",
      checkedOverwrite: "true",
    }));
  
    try {
      const response = await axios.post(
        "https://research.vinbase.ai/voiceclone/validate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
          },
        }
      );
      if (response.data.validate_status) {
        return response.data.session;
      } else {
        throw new Error("Voice validation failed");
      }
    } catch (error) {
      console.error("Error during voice validation:", error);
      throw error;
    }
  };
  

  const trainVoiceModel = async (sessionId) => {
    const response = await axios.post(
      "https://research.vinbase.ai/voiceclone/train",
      {
        session: sessionId,
        trainingTime: 0,
        aligner: "",
        denoiser: "",
        asr: "",
        speakerrate: "",
        balance: "",
        duration: "",
        checkedRetrain: "False",
      },
      {
        headers: {
          Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.train_status) {
      return true;
    } else {
      throw new Error("Voice training failed");
    }
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



  const generateStory = async (storyId) => {
    const voiceId = voiceSelections[storyId];
    if (!voiceId) {
      message.warning("Please select a voice to generate the story.");
      return;
    }
    const selectedVoice = voices.find(voice => voice._id === voiceId);
    if (!selectedVoice) {
      message.error("Selected voice not found.");
      return;
    }

    const baseUrl = "http://localhost:8000/";
    const relativeFilePath = selectedVoice.recordings[0].url;
    const fullFileUrl = new URL(relativeFilePath, baseUrl).href;


    try {
      const voiceFile = await fetchVoiceFile(fullFileUrl);
      const sessionId = voiceId;
      await validateVoice(voiceFile, sessionId);
      await trainVoiceModel(sessionId);
      const storyText = 'Tôi không biết tôi là ai hết'; // Replace with actual story text
      const audioPath = await generateAudio(sessionId, storyText);
      await retrieveAudio(audioPath);
      message.success("Story generated successfully.");
      // Update UI as needed
    } catch (error) {
      console.error("Error in voice cloning process:", error);
      message.error("Failed to generate story.");
    }
  };

  const addToPlaylist = (storyId) => {

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
      title: "Voice",
      key: "voice",
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          onChange={(value) => handleVoiceChange(value, record._id)}
          value={voiceSelections[record._id]} // Set the current value for each Select
        >
          {voices.map((voice) => (
            <Option key={voice._id} value={voice._id}>
              {voice.title} {/* Displaying the voice name */}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            icon={<span role="img" aria-label="Generate"></span>}
            style={{ marginRight: 16 }}
            onClick={() => generateStory(record._id)}
          >
            Generate
          </Button>
          <Button
            type="danger"
            icon={<span role="img" aria-label="Remove from Wishlist"></span>}
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
      <div style={{ margin: "100px 200px 0px 300px" }}>
        <h2>My Wishlist</h2>
        <Table columns={wishlistColumns} dataSource={wishlist} rowKey="_id" />
      </div>
      <div style={{ margin: "0px 200px 100px 300px" }}>
        <h2>Generated Stories</h2>
        <Table
          columns={generatedColumns}
          dataSource={generatedStories}
          rowKey="_id"
        />
      </div>
    </div>
  );
};

export default WishlistPage;
