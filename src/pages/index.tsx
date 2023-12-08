import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState , useEffect } from 'react';
import { readAndCompressImage as readAndCompressImageType } from 'browser-image-resizer';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState<string | null>(null);

  let readAndCompressImage: typeof readAndCompressImageType;


  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import the browser-image-resizer library
      import('browser-image-resizer').then((module) => {
        readAndCompressImage = module.readAndCompressImage;
      });
    }
  }, []);


  const config = {
    quality: 0.5,
    maxWidth: 800,
    maxHeight: 600,
    autoRotate: true,
    debug: true,
  };

  const showImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files[0] || !readAndCompressImage) {
      console.log("No image selected or resizer not loaded");
      setSelectedImage(null);
      return;
    }

    // resize image
    const resizedImageBlob = await readAndCompressImage(files[0], config);
    const resizedImageFile = new File([resizedImageBlob], files[0].name, {
      type: resizedImageBlob.type,
      lastModified: Date.now(),
    });

    // setSelectedImage(files[0]);
    setSelectedImage(resizedImageFile);
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', resizedImageFile);
    
    try {
      const img_response = await fetch('/api/aws', {
        method: 'POST',
        body: formData
      });

      const responseData = await img_response.json();
      const imageUrl = responseData.url;
      setImageUrl(imageUrl);

      // send image url to gpt
      const response = await fetch('/api/openai', {
        method: 'POST',
        body: JSON.stringify({ image: imageUrl }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // clean up response string
      let responseText = await response.text();
      responseText = responseText.replace(/\"/g, '');
      setGptResponse(responseText);

    } catch (error) {
      console.error("Error:", error);

    } finally {
      setIsLoading(false);
    }
  }

  const regenerateResponse = async () => {
      if (!imageUrl) {
        console.log("No image URL available");
        return;
      }
  
      setIsLoading(true);

      // get another response from gpt with the same image
      const response = await fetch('/api/openai', {
        method: 'POST',
        body: JSON.stringify({ image: imageUrl }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // clean up response string
      let responseText = await response.text();
      responseText = responseText.replace(/\"/g, '');
      setGptResponse(responseText);
      setIsLoading(false);
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Nattiana</title>
        <meta name="description" content="nattiana" />
        <link rel="icon" href="../favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Nattiana.</h1>
        <h2 className={styles.description}>  </h2>

        <div className={styles.grid}>
          <label htmlFor="capture" className="photo">
            <p>Scan drink label &rarr;</p>
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
        <div className={styles.grid}>
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
        {gptResponse && (
        <div className={`${styles.typewriter} ${styles.monospace}`}>
          <p>{gptResponse}</p>
        </div>
        )}  

        {/* regenerate response - only show if gptResponse is loaded */}
        {gptResponse && (
          <div className={styles.description}>
            <img src="https://i.imgur.com/PTmtsWg.png" width="30" height="30"></img>
          </div>
        )}
        


      </main>
    </div>
  );
}