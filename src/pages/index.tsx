import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY , dangerouslyAllowBrowser: true});

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
    console.log("running!");
    if (!selectedImage) {
      console.log("No image selected");
      return;
    }

    console.log("selectedImage2", selectedImage);

    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result?.toString();

      if (!base64Image) {
        console.log("Failed to convert image to Base64");
        setIsLoading(false);
        return;
      }

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "system",
              content: "Here's a photo of a wine label. Roast the person having this wine. Sound like a sassy sommelier in brooklyn, new york. Make it fun, maybe even a little rude, end with a haiku. Keep it as 500 characters or less.",
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: base64Image,
                  }
                }
              ]
            },
          ],
          max_tokens: 4096,
        });

        console.log("GPT RESPONSE", response.choices[0]);
        setGptResponse(response.choices[0].message.content);

      } catch (error) {
        console.error("Error calling OpenAI:", error);
      } finally {
        setIsLoading(false);
      }
    };
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>nattiana</title>
        <meta name="description" content="nattiana" />
        <link rel="icon" href="../favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>nattiana</h1>

        <div className={styles.description}>
          <p>roast your wine taste</p>
        </div>

        <div className={styles.grid}>
          <label htmlFor="capture" className="photo">
            <p>scan wine label &rarr;</p>
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
        

        <br />
        <br />

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
        <div className={styles.grid}>
          <br />
          <br />
          <br />
          {selectedImage && (
            <button onClick={handleUploadImage} disabled={isLoading}>
              {isLoading ? (<div className={styles.loadingDot}></div>) : ("roast") }
            </button>
          )}
        </div>

        {/* print gpt response */}
        <div className={styles.description}>
          {gptResponse && (
            <p>{gptResponse}</p>
          )}
        </div>

      </main>
    </div>
  );
}