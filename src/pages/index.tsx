import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState<string | null>(null);

  const showImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files[0]) {
      console.log("No image selected");
      setSelectedImage(null);
      return;
    }

    setSelectedImage(files[0]);
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(files[0]); // Use the selected file directly
    reader.onloadend = async () => {
      const base64Image = reader.result?.toString();

      if (!base64Image) {
        console.log("Failed to convert image to Base64");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let responseText = await response.text();
        responseText = responseText.replace(/\"/g, ''); // Remove double quotes
        setGptResponse(responseText);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nattiana</title>
        <meta name="description" content="nattiana" />
        <link rel="icon" href="../favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Nattiana</h1>

        <div className={styles.description}>
          <p>Roast your wine taste.</p>
        </div>

        <div className={styles.grid}>
          <label htmlFor="capture" className="photo">
            <p>Scan wine label &rarr;</p>
            <input
              className={styles.hiddenInput}
              type="file"
              id="capture"
              accept="image/*"
              capture="environment"
              onChange={showImage}
              hidden
            />
          </label>
        </div>

       {/* display image */}
        <div>
        <br />
          {selectedImage && (
            <img 
              src={URL.createObjectURL(selectedImage)} 
              alt="Selected" 
              className={styles.selectedImage}
            />
          )}
        </div>

        {/* display button only after image is shown*/}
        <div className={styles.description}>
          {isLoading && <div className={styles.loadingDot}></div>}
        </div>

        {/* print gpt response*/}
        <div className={styles.card}>
          {gptResponse && (
            <p>{gptResponse}</p>
          )}
        </div>

      </main>
    </div>
  );
}