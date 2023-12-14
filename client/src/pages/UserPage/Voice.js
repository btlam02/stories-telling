import React, { useState, useRef, useContext } from "react";
import {Button, Input, Space} from "antd"
import {
    RightOutlined ,
    LeftOutlined , 
    AudioOutlined ,
} from '@ant-design/icons'
import { UserContext } from "../../context/UserContext";
import axios from "axios";
const sentences = [
  "Xuân sang cành lá đâm chồi, bao buồn vui qua rồi đưa con về với yên bình",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
  "Câu thứ hai để ghi âm.",
];

const AudioRecorder = () => {
    const {user} = useContext(UserContext)
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [recordingTitle, setRecordingTitle] = useState("");
    const [permission, setPermission] = useState(false);
    const [recording, setRecording] = useState(false);
    const [recordings, setRecordings] = useState(Array(sentences.length).fill(null));
    const mediaRecorderRef = useRef(null);
    const user_id = localStorage.getItem("id")
    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                mediaRecorderRef.current = new MediaRecorder(stream);
                setPermission(true);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = () => {
        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            mediaRecorderRef.current.ondataavailable = (event) => {
                const updatedRecordings = [...recordings];
                updatedRecordings[currentSentenceIndex] = URL.createObjectURL(event.data);
                setRecordings(updatedRecordings);
            };
        }
    };

    const nextSentence = () => {
        if (currentSentenceIndex < sentences.length - 1) {
            setCurrentSentenceIndex(currentSentenceIndex + 1);
        }
    };

    const previousSentence = () => {
        if (currentSentenceIndex > 0) {
            setCurrentSentenceIndex(currentSentenceIndex - 1);
        }
    };

    const uploadRecordings = async () => {
        const formData = new FormData();
        formData.append("title", recordingTitle);
        formData.append("userId", user_id); 
    
        // Use Promise.all to fetch and convert all recordings to blobs
        const blobPromises = recordings.map(async (recordingUrl, i) => {
            if (recordingUrl) {
                const response = await fetch(recordingUrl);
                const blob = await response.blob();
                formData.append('recording', blob, `${recordingTitle}-${i}.mp3`);
            }
        });
    
        try {
            // Wait for all blobs to be appended to formData
            await Promise.all(blobPromises);
    
            // Now send the formData with axios
            const response = await axios.post('http://localhost:8000/api/audio/new-audio', formData);
            console.log("Upload successful", response.data);
            // Handle successful upload here
        } catch (error) {
            console.error("Error uploading recordings: ", error);
            // Handle error here
        }
    };
    


    return (
        <div>
            <div style={{ textAlign: "left" }}> 
            <h2 >Audio Recorder</h2>
            <Input 
              type="text" 
              placeholder="Enter recording title..." 
              value={recordingTitle} 
              onChange={(e) => setRecordingTitle(e.target.value)} 
            />
            </div>
            <p>{sentences[currentSentenceIndex]}</p>
            <main>

                <div className="audio-controls">
                    {!permission && (
                        <Button onClick={getMicrophonePermission}>
                            <AudioOutlined />Get Microphone
                        </Button>
                    )}
                    {permission && !recording && (
                        <Button onClick={startRecording}>
                            Start Recording
                        </Button>
                    )}
                    {recording && (
                        <Button onClick={stopRecording}>
                            Stop Recording
                        </Button>
                    )}
                </div>
                <h1> </h1>
                {recordings[currentSentenceIndex] && (
                    <audio src={recordings[currentSentenceIndex]} controls />
                )}
                
                <div>
                    <Button onClick={previousSentence} disabled={currentSentenceIndex === 0}>
                    <LeftOutlined /> Previous Sentence
                    </Button>
                    <Button onClick={nextSentence} disabled={currentSentenceIndex === sentences.length - 1}>
                    Next Sentence<RightOutlined />
                    </Button>
                </div>
                <Button onClick={uploadRecordings} disabled={!recordingTitle}>
                    Save Recordings
                    </Button>
            </main>
        </div>
    );
};

export default AudioRecorder;
