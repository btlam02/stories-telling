import React, { useState, useEffect } from "react";
import axios from "axios";

const AudioList = () => {
    const [audios, setAudios] = useState([]);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/audio/list');
                setAudios(response.data);
            } catch (error) {
                console.error("Error fetching audios: ", error);
            }
        };

        fetchAudios();
    }, []);

    return (
        <div>
            <h2>List Audios</h2>
            {audios.map(audio => (
                <div key={audio._id}>
                    <h3>{audio.title}</h3>
                    {/* Giả sử audio.url là đường dẫn đến file âm thanh */}
                    <div>
                        {audio.recordings.map((recording) => (
                            <audio key={recording._id} src={`http://localhost:8000/${recording.url}`} controls />
                        ))}
                    </div>
                    <audio src={audio.url} controls />
                </div>
            ))}
        </div>
    );
};

export default AudioList;
