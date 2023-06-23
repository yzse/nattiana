import React, { useState, useRef, useEffect } from "react";
// import { QrReader } from "react-qr-reader";
import styles from "../styles/Home.module.css";

function Scan() {
  const [data, setData] = useState("No result");
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    } else {
      console.error("Camera access not supported in this browser.");
    }
  }, []);

  const handleScan = (result) => {
    if (result) {
      setData(result);
    }
  };

  const handleError = (error) => {
    console.error("QR code scan error:", error);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <video ref={videoRef} id="player" controls autoPlay />
        {/* <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ display: "none" }}
        /> */}
        <p>{data}</p>
      </div>
    </div>
  );
}

export default Scan;
