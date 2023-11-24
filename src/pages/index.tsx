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

    // displays image
    setSelectedImage(files[0]);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', files[0]);

    // sends to aws
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@FORM DATA:', formData);

    try {
      const img_response = await fetch('/api/aws', {
        method: 'POST',
        body: formData
      });

      // get image url from aws - this should be a url string that gets sent to gpt
      const { imageUrl } = await img_response.json();
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@img_response:', img_response);

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
      if (!selectedImage) {
        console.log("No image selected");
        return;
      }
  
      setIsLoading(true);
  
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        // convert image to base64
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
          let responseText = await response.text();
          responseText = responseText.replace(/\"/g, '');
          setGptResponse(await responseText);
          console.log('response set')
  
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      };
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>Nattiana</title>
        <meta name="description" content="nattiana" />
        <link rel="icon" href="../favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Nattiana</h1>
        {/* <h2 className={styles.description}>Roast your wine taste.</h2> */}
        <h2 className={styles.description}> /// .</h2>

        <div className={styles.grid}>
          <label htmlFor="capture" className="photo">
            <p>Scan label &rarr;</p>
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
        <div className={styles.card}>
          {gptResponse && (
            <p>{gptResponse}</p>
          )}
        </div>

        {/* Regenerate response - only show if gptResponse is loaded */}
        {gptResponse && (
          <div className={styles.description}>
            <button onClick={regenerateResponse} disabled={isLoading}>
              🍷
            </button>
          </div>
        )}

      </main>
    </div>
  );
}