import React, { useState, useEffect } from "react";
import axios from "axios";

const AudioList = () => {
  const [audios, setAudios] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/audio/list?userId=${userId}`
        );
        setAudios(response.data);
        if (response.data.length > 0) {
          setSelectedAudio(response.data[0]._id); // Automatically select the first audio
        }
      } catch (error) {
        console.error("Error fetching audios: ", error);
      }
    };

    if (userId) {
      fetchAudios();
    }
  }, [userId]);

  const handleAudioChange = (event) => {
    setSelectedAudio(event.target.value);
  };

  return (
    <div>
      <div>
        <h2>List Audios</h2>
        <select value={selectedAudio} onChange={handleAudioChange}>
          {audios.map((audio) => (
            <option key={audio._id} value={audio._id}>
              {audio.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        {audios
          .filter((audio) => audio._id === selectedAudio)
          .map((audio) => (
            <div key={audio._id}>
              <h3>{audio.title}</h3>
              <div>
                {audio.recordings?.map((recording) => (
                  <audio
                    key={recording._id}
                    src={`http://localhost:8000/${recording.url}`}
                    controls
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AudioList;
