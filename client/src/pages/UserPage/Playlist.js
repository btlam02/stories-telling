import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import { PlayCircleFilled } from "@ant-design/icons";
import axios from "axios";

const PlaylistPage = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/playlist/${userId}`
        );
        // Assuming response.data.stories is the array of story objects
        const stories = response.data.stories || [];
        const formattedData = stories
          .map((story) => {
            // Find the userVoice for the current user
            const userVoice = story.userVoices.find(
              (voice) => voice.userId === userId
            );
            return {
              key: story._id,
              title: story.title,
              voice: userVoice ? userVoice.narrator : "N/A", // Fallback to 'N/A' if not found
              audioUrl: userVoice ? `http://localhost:8000/${userVoice.audioUrl}` : "", // Fallback to empty string if not found

            };
          })
          .filter((item) => item.audioUrl); // Filter out any items without an audio URL
        setPlaylistData(formattedData);
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      }
    };

    fetchPlaylistData();
  }, [userId]);




  
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Voice",
      dataIndex: "voice",
      key: "voice",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => playAudio(record.audioUrl)}>
          <PlayCircleFilled />
        </Button>
      ),
    },
  ];

  const playAudio = (audioUrl) => {
    console.log(`Trying to play audio from URL: ${audioUrl}`); // Debugging line
    setCurrentAudioUrl(audioUrl);
    setIsModalVisible(true);
  };
  
  

  return (
    <div style={{ margin: "0px 100px" }}>
      <h1>Playlist</h1>
      <Table dataSource={playlistData} columns={columns} />

      <Modal
      title="Audio Player"
      visible={isModalVisible}
      onOk={() => setIsModalVisible(false)}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <audio controls autoPlay>
        <source src={currentAudioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </Modal>
    </div>
  );
};

export default PlaylistPage;
