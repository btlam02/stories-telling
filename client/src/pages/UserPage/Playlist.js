import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal } from "antd";
import { PlayCircleFilled, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode.react";

const API_URL = process.env.REACT_APP_API_URL;

const PlaylistPage = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const [voiceTitle, setVoiceTitle] = useState("");

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const playlistResponse = await axios.get(`${API_URL}/api/playlist/${userId}`);
        if (playlistResponse.data && Array.isArray(playlistResponse.data.playlist)) {
          const playlistItems = playlistResponse.data.playlist;
  
          const storyFetchPromises = playlistItems.map(item =>
            axios.get(`${API_URL}/api/get-stories/${item.storyId}`)
          );
  
          const storyResponses = await Promise.all(storyFetchPromises);
          
          const allVoices = storyResponses.map((response, index) => {
            const storyData = response.data;
            const playlistItem = playlistItems[index];
            const voice = storyData.userVoices.find(v => v.voiceId === playlistItem.voiceId);
  
            return voice ? {
              key: `${playlistItem.storyId}__${playlistItem.voiceId}`,
              title: storyData.title,
              narrator: voice.narrator,
              audioUrl: `${API_URL}/${voice.audioUrl}`,
            } : null;
          }).filter(v => v !== null);
  
          setPlaylistData(allVoices);
        }
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      }
    };
  
    fetchPlaylistData();
  }, [userId]);
  
  

  const VoiceColumn = ({ voiceId }) => {
    const [voiceTitle, setVoiceTitle] = useState("Loading...");

    useEffect(() => {
      const fetchVoiceTitle = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/audio/${voiceId}`);
          if (response.data && response.data.length > 0) {
            // Giả sử title nằm ở phần tử đầu tiên của array trả về
            setVoiceTitle(response.data[0].title);
          } else {
            setVoiceTitle("N/A");
          }
        } catch (error) {
          console.error("Error fetching voice data:", error);
          setVoiceTitle("N/A");
        }
      };

      fetchVoiceTitle();
    }, [voiceId]);

    return <span>{voiceTitle}</span>;
  };

  const handleRemoveFromPlaylist = async (combinedKey) => {
    const [storyId, voiceId] = combinedKey.split("__");
    // Confirm xóa voice từ playlist
    Modal.confirm({
      title:
        "Are you sure you want to remove this voice from the story in the playlist?",
      content: "This action cannot be undone",
      okText: "Yes, remove it",
      cancelText: "No, keep it",
      onOk: async () => {
        try {
          const response = await axios.delete(
            `${API_URL}/api/playlist/${userId}/remove/${storyId}/${voiceId}`
          );
          if (response.status === 200) {
            // Cập nhật state để loại bỏ chỉ voice cụ thể khỏi playlist
            setPlaylistData((prevPlaylistData) =>
              prevPlaylistData.filter((item) => item.key !== combinedKey)
            );
          } else {
            console.error("Failed to remove voice from playlist");
          }
        } catch (error) {
          console.error("Error removing voice from story in playlist:", error);
        }
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Voice",
      dataIndex: "voiceId",
      key: "voiceId",
      render: (_, record) => {
        const [storyId, voiceId] = record.key.split("__");
        console.log(`storyId: ${storyId}, voiceId: ${voiceId}`);
        return <VoiceColumn voiceId={voiceId} />;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const [storyId, voiceId] = record.key.split("__");
        //console.log(`storyId: ${storyId}, voiceId: ${voiceId}`);
        return (
          <>
            <Button onClick={() => playAudio(record.audioUrl)}>
              <PlayCircleFilled />
            </Button>

            <Button
              onClick={() => handleRemoveFromPlaylist(record.key)}
              style={{ marginLeft: 8 }}
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  const playAudio = useCallback((audioUrl) => {
    console.log(`Trying to play audio from URL: ${audioUrl}`);
    setCurrentAudioUrl(audioUrl);
    setIsModalVisible(true);
  }, []);

  return (
    <div style={{ margin: "0px 100px" }}>
      <h2 style={{ textAlign: "Left" }}>My Playlist</h2>
      <Table dataSource={playlistData} columns={columns} />

      <Modal
        key={currentAudioUrl}
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
      <h3>SCAN QR CODE</h3>
      <QRCode value={window.location.href} size={128} level={"H"} />
      <h3> Hãy chia sẽ Playlist của bạn</h3>
    </div>
  );
};

export default PlaylistPage;
