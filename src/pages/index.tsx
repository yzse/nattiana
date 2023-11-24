import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
import { json } from 'stream/consumers';
// import OpenAI from 'openai';

// const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY , dangerouslyAllowBrowser: true});

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState<string | null>(null);

  const showImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      setSelectedImage(files[0]);
    } else {
      setSelectedImage(null);
    }
  };

  // convert image to url
  const handleUploadImage = async () => {
    if (!selectedImage) {
      console.log("No image selected");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result?.toString();
      try {
        console.log('starting fetch...')

        const response = await fetch('/api/openai', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('fetch complete')
        setGptResponse(await response.text());
        console.log('response set')

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
          {selectedImage && (
            <button onClick={handleUploadImage} disabled={isLoading}>
              {isLoading ? (<div className={styles.loadingDot}></div>) : ("🍷") }
            </button>
          )}
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