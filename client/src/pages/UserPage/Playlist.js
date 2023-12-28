import React from "react";
import { Table, Button } from "antd";
import {PlayCircleFilled} from '@ant-design/icons'

const PlaylistPage = () => {
  // Cập nhật dữ liệu giả lập để bao gồm tất cả thông tin cần thiết
  const playlistData = [
    {
      key: "1",
      title: "Rich Dad Poor Dad",
      voice: "Dad_01",
      // Bạn cần thêm URL hoặc đường dẫn tới file audio ở đây
      audioUrl: "http://example.com/audio/dad_01.mp3",
    },
    // Thêm các bản ghi khác tương tự như trên
  ];

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // Render a custom cell that includes the title and additional details like author and year
      render: (text, record) => (
        <div>
          <div>{record.title}</div>
          <div>{`Robert T.Kiyosaki, 1997`}</div>
        </div>
      ),
    },
    {
      title: "Voice",
      dataIndex: "voice",
      key: "voice",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          onClick={() => playAudio(record.audioUrl)}
        ><PlayCircleFilled/></Button>
      ),
    },
  ];

  // Hàm để phát audio
  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  return (
    <div style={{margin: '0px 100px 0px 100px'}}>
      <h1>Playlist</h1>
      <Table dataSource={playlistData} columns={columns} />
    </div>
  );
};

export default PlaylistPage;
