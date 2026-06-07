import React, { useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import style from "./Post.module.css";

import {
  Campaign,
  Description,
  CloudUpload,
  Videocam,
  RadioButtonChecked,
  StopCircle,
  Preview,
  Send,
  Image as ImageIcon,
  VideoLibrary,
  AutoAwesome,
} from "@mui/icons-material";

const Post = () => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [inputMode, setInputMode] = useState("upload");
  const [previewUrl, setPreviewUrl] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const videoPreviewRef = useRef(null);

  const { pid } = useParams();
  const navigate = useNavigate();

  const influencerId = sessionStorage.getItem("iid");

  const resetMediaState = () => {
    setFile(null);
    setRecordedBlob(null);
    setPreviewUrl("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
    setRecordedBlob(null);

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaStreamRef.current = stream;
      recordedChunksRef.current = [];

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });

        const recordedFile = new File([blob], "recorded-post.webm", {
          type: "video/webm",
        });

        setRecordedBlob(blob);
        setFile(recordedFile);
        setPreviewUrl(URL.createObjectURL(blob));

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      alert("Could not access camera/microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Description required");
      return;
    }

    if (!file) {
      alert("Please upload or record a file");
      return;
    }

    if (!influencerId) {
      alert("Influencer not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("file", file);
    formData.append("influencer", influencerId);
    formData.append("product", pid);

    try {
      await axios.post("http://127.0.0.1:8000/post/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post Added");

      setDescription("");
      resetMediaState();

      navigate("/influencer/mypost");
    } catch (err) {
      console.error(err);
      alert("Failed to add post");
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <Campaign />
          </div>

          <div>
            <h1>Create Post</h1>
            <p>Create creator content by uploading media or recording instantly</p>
          </div>
        </div>

        <div className={style.heroBadges}>
          <div className={style.badge}>
            <AutoAwesome fontSize="small" />
            <span>Creator Studio</span>
          </div>

          <div className={style.badge}>
            <VideoLibrary fontSize="small" />
            <span>Media Ready</span>
          </div>
        </div>
      </div>

      <form className={style.layout} onSubmit={handleSubmit}>
        {/* LEFT SIDE */}
        <div className={style.leftCard}>
          <div className={style.sectionHeader}>
            <h3>Post Details</h3>
            <p>Add your content description and choose media input mode</p>
          </div>

          <div className={style.field}>
            <label>Description</label>
            <div className={style.textareaWrap}>
              <Description className={style.inputIconTop} />
              <textarea
                className={style.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write an engaging caption or post description..."
                required
              />
            </div>
          </div>

          <div className={style.field}>
            <label>Choose Input Mode</label>

            <div className={style.modeGrid}>
              <button
                type="button"
                className={`${style.modeCard} ${
                  inputMode === "upload" ? style.modeCardActive : ""
                }`}
                onClick={() => {
                  setInputMode("upload");
                  if (isRecording) stopRecording();
                  setRecordedBlob(null);
                }}
              >
                <CloudUpload className={style.modeIcon} />
                <span className={style.modeTitle}>Upload Media</span>
                <small>Select image or video from device</small>
              </button>

              <button
                type="button"
                className={`${style.modeCard} ${
                  inputMode === "record" ? style.modeCardActive : ""
                }`}
                onClick={() => {
                  setInputMode("record");
                  resetMediaState();
                }}
              >
                <Videocam className={style.modeIcon} />
                <span className={style.modeTitle}>Record Video</span>
                <small>Use camera and upload recorded clip</small>
              </button>
            </div>
          </div>

          {inputMode === "upload" && (
            <div className={style.field}>
              <label>Upload Image / Video</label>

              <label className={style.uploadBox}>
                <CloudUpload className={style.uploadIcon} />
                <span className={style.uploadTitle}>Click to choose media</span>
                <span className={style.uploadSub}>
                  Supports image and video files
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className={style.hiddenInput}
                />
              </label>

              {file && (
                <div className={style.filePill}>
                  {file.type?.startsWith("image/") ? (
                    <ImageIcon fontSize="small" />
                  ) : (
                    <VideoLibrary fontSize="small" />
                  )}
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          )}

          {inputMode === "record" && (
            <div className={style.field}>
              <label>Record Video</label>

              <div className={style.recordCard}>
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  muted
                  playsInline
                  className={style.liveVideo}
                />

                <div className={style.recordActions}>
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className={`${style.actionBtn} ${style.recordBtn}`}
                    >
                      <RadioButtonChecked fontSize="small" />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className={`${style.actionBtn} ${style.stopBtn}`}
                    >
                      <StopCircle fontSize="small" />
                      Stop Recording
                    </button>
                  )}

                  <div className={style.recordStatus}>
                    <span
                      className={`${style.dot} ${
                        isRecording ? style.dotLive : ""
                      }`}
                    />
                    {isRecording ? "Recording..." : "Ready to record"}
                  </div>
                </div>
              </div>

              {recordedBlob && (
                <div className={style.filePill}>
                  <VideoLibrary fontSize="small" />
                  <span>recorded-post.webm</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className={style.rightCard}>
          <div className={style.sectionHeader}>
            <h3>Preview</h3>
            <p>Preview your selected media before submitting</p>
          </div>

          <div className={style.previewCard}>
            {previewUrl ? (
              <>
                <div className={style.previewLabel}>
                  <Preview fontSize="small" />
                  <span>Media Preview</span>
                </div>

                {file?.type?.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className={style.previewImage}
                  />
                ) : (
                  <video src={previewUrl} controls className={style.previewVideo} />
                )}
              </>
            ) : (
              <div className={style.emptyPreview}>
                <Preview className={style.emptyPreviewIcon} />
                <h4>No Preview Available</h4>
                <p>Upload an image/video or record a video to preview it here</p>
              </div>
            )}
          </div>

          <div className={style.summaryCard}>
            <h4>Post Summary</h4>

            <div className={style.summaryRow}>
              <span>Input Mode</span>
              <strong>{inputMode === "upload" ? "Upload" : "Record"}</strong>
            </div>

            <div className={style.summaryRow}>
              <span>Description</span>
              <strong>
                {description.trim() ? `${description.length} chars` : "Empty"}
              </strong>
            </div>

            <div className={style.summaryRow}>
              <span>Media</span>
              <strong>{file ? "Selected" : "Not selected"}</strong>
            </div>
          </div>

          <button type="submit" className={style.submitBtn}>
            <Send fontSize="small" />
            Submit Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Post;