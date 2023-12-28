import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState , useEffect } from 'react';
import { readAndCompressImage as readAndCompressImageType } from 'browser-image-resizer';

interface ParsedResponse {
  nameOfBeverage: string | undefined;
  category: string | undefined;
  comment: string | undefined;
  bulletPoints: string[];
  historicalFact: string | undefined;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResponse | null>(null);

  // interactive response
  const [messages, setMessages] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [interactionStep, setInteractionStep] = useState(0);


  let readAndCompressImage: typeof readAndCompressImageType;

  // useEffect for dynamic import
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('browser-image-resizer').then((module) => {
        readAndCompressImage = module.readAndCompressImage;
      });
    }
  }, []);

  // useEffect for message sequence
  useEffect(() => {
    if (!parsedData) return; // run only if parsedData is available

    const initialMessages = [
      "Oh honey, let's see what you're pretending to enjoy tonight (or day, you freak)...",
      "Analyzing your drink choice...",
      "Judging silently..."
    ];

    initialMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, message]);
    
        if (index === initialMessages.length - 1) {
          setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, `Oh, is that a ${parsedData.nameOfBeverage}? Really?`]);
    
            setTimeout(() => {
              setShowOptions(true);
            }, 1500);
          }, 2800);
        }
      }, 2800 * index);
    });

    return () => {
      setShowOptions(false);
    };
  }, [parsedData]);

  const handleUserResponse = (response: string) => {
    setIsOptionSelected(true); 
    setUserResponses(prevResponses => [...prevResponses, response]);
  
    setTimeout(() => {
      if (interactionStep === 0) {
        setInteractionStep(1);
        setTimeout(() => {
          setShowOptions(true);
          setIsOptionSelected(false);
        }, 1000);
      } else if (interactionStep === 1) {
        setInteractionStep(2);
        setTimeout(() => {
          setShowOptions(true);
          setIsOptionSelected(false);
        }, 1000);
      }
    }, 3000); 
  };
  

  const config = {
    quality: 0.4,
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

      // parse interactive response
      let responseText = await response.text();
      responseText = responseText.replace(/\"/g, '');
      setGptResponse(responseText);
      setParsedData(parseResponse(responseText));

    } catch (error) {
      console.error("Error:", error);

    } finally {
      setIsLoading(false);
    }
  }

  const parseResponse = (response: string): ParsedResponse => {
    // regex to split the string at each numbered section
    const parts = response.split(/(?=\d\.)/);

    // extract variables
    const nameOfBeverage = parts[0]?.substring(2).trim();
    const category = parts[1]?.substring(2).trim(); 
    const comment = parts[2]?.substring(2).trim(); 
    const bulletPointsRaw = parts[3]?.substring(2).trim(); 
    const historicalFact = parts[4]?.substring(2).trim(); 

    // further split and process the bullet points
    const bulletPoints = bulletPointsRaw ? bulletPointsRaw.split(' - ').slice(1).map(point => point.trim()) : [];

    return {
        nameOfBeverage,
        category,
        comment,
        bulletPoints,
        historicalFact
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
        <h1 className={styles.title}>Nattiana.</h1>
        <h2 className={styles.description}>  </h2>

        {!selectedImage && (
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
        )}

       {/* display user image */}
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

        {/* loading button */}
        <div className={styles.description}>
          {isLoading && <div className={styles.loadingDot}></div>}
        </div>

        {/* display initial messages */}
        {messages.map((message, index) => (
          <div key={index} className={`${styles.typewriter} ${styles.monospace}`}>
            <p>{message}</p>
          </div>
        ))}

        {/* options for interaction 1 */}
        {showOptions && !isOptionSelected && interactionStep === 0 && (
          <div className={styles.options}>
            <button onClick={() => handleUserResponse("yeah, that's my style")}>yeah, that's my style.</button>
            <button onClick={() => handleUserResponse("no, it's something else")}>no, it's something else.</button>
          </div>
        )}

        {/* response 1 */}
        {interactionStep > 0 && userResponses[0] && (
          <div className={`${styles.typewriterRes} ${styles.monospace}`}>
            <p>{userResponses[0]}</p>
          </div>
        )}

        {/* interaction 2 */}
        {/* check if user selected option for previous interaction*/}
        {interactionStep >= 1 && (
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            tell me, are you actually enjoying it or just trying to look cool?
          </div>
        )}

        {/* options for interaction 2 */}
        {showOptions && !isOptionSelected && interactionStep === 1 && (
            <div className={styles.options}>
              <button onClick={() => handleUserResponse("obsessed with it, actually")}>obsessed with it, actually.</button>
              <button onClick={() => handleUserResponse("just for the Instagram likes")}>just for the Instagram likes.</button>
            </div>
        )}

        {/* response 2 */}
        {interactionStep > 1 && userResponses[1] && (
          <div className={`${styles.typewriterRes} ${styles.monospace}`}>
            <p>{userResponses[1]}</p>
          </div>
        )}


        {/* wine emoji */}
        {gptResponse && (
        <div className={styles.description}>
          <img src="https://i.imgur.com/PTmtsWg.png" width="25" height="25"></img>
        </div>
        )}
        

      </main>
    </div>
  );
}