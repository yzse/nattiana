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
  const [showInteraction2, setShowInteraction2] = useState(false);
  const [showInteraction3, setShowInteraction3] = useState(false);
  const [showInteraction4, setShowInteraction4] = useState(false);
  const [showInteraction5, setShowInteraction5] = useState(false);
  const [showInteraction6, setShowInteraction6] = useState(false);
  const [showInteraction7, setShowInteraction7] = useState(false);
  const [showGuessMessage, setShowGuessMessage] = useState(false);
  const [showBulletPoint, setShowBulletPoint] = useState(false);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showLine4, setShowLine4] = useState(false);
  const [showWine, setShowWine] = useState(false);
  const [showOptionsForInteraction2, setShowOptionsForInteraction2] = useState(false);
  const [showOptionsForInteraction3, setShowOptionsForInteraction3] = useState(false);
  const [showOptionsForInteraction5, setShowOptionsForInteraction5] = useState(false);

  const initialMessages = [
    "Oh honey, let's see what you're pretending to enjoy tonight (or day, you freak)...",
    "Analyzing your drink choice...",
    "Judging silently..."
  ];

  let readAndCompressImage: typeof readAndCompressImageType;

  // useEffect for dynamic import
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('browser-image-resizer').then((module) => {
        readAndCompressImage = module.readAndCompressImage;
      });
    }
  }, []);

  // useEffect for initial message sequence
  useEffect(() => {
    if (!parsedData) return;

    initialMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, message]);
    
        if (index === initialMessages.length - 1) {
          setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, `Oh, is that a ${parsedData.nameOfBeverage}? Really?`]);
    
            setTimeout(() => {
              setShowOptions(true);
            }, 2800);
          }, 3000);
        }
      }, 3000 * index);
    });

    return () => {
      setShowOptions(false);
    };
  }, [parsedData]);

  const handleUserResponse = (response: string) => {
    setIsOptionSelected(true);
    setUserResponses(prevResponses => [...prevResponses, response]);
  
    const nextStep = interactionStep + 1;
    setInteractionStep(nextStep);
   
    switch (nextStep) {
      case 1:
        setTimeout(() => {
          setShowInteraction2(true); 
        }, 1200);
        setShowOptionsForInteraction2(true); 
        break;
      case 2:
        setTimeout(() => {
          setShowInteraction3(true); 
        }, 1200);
        setShowOptionsForInteraction3(true); 
        break;
      case 3:
        setTimeout(() => {
          setShowInteraction4(true); 
        }, 1200);
        break;
      default:
        break;
    }
  
    setTimeout(() => {
      setShowOptions(true);
      setIsOptionSelected(false);
    }, 3500);
  };


  useEffect(() => {
    if (interactionStep === 3 && showInteraction4) {
      setTimeout(() => {
        setInteractionStep(4);
        setShowInteraction5(true);
      }, 3500);
    }

    // let me guess, you're into...
    if (interactionStep === 4 && showInteraction5) {
      setTimeout(() => {
        setShowGuessMessage(true);
        setShowInteraction6(true);
      }, 3500);
    
      setTimeout(() => {
        setShowBulletPoint(true);
      }, 7000);

      setTimeout(() => {
        setShowOptionsForInteraction5(true);
      }, 13000);
    }

    // historical fact
    if (interactionStep === 5 && showInteraction6) {
      setTimeout(() => {
        setInteractionStep(6);
        setShowInteraction7(true);
      }, 4500);
    }

    // closing lines
    const wait = 7000;
    if (interactionStep === 6 && showInteraction7) {
      setTimeout(() => setShowLine1(true), wait);
      setTimeout(() => setShowLine2(true), wait+3500);
      setTimeout(() => setShowLine3(true), wait+7000);
      setTimeout(() => setShowLine4(true), wait+11000);
      setTimeout(() => setShowWine(true), wait+12000);
    }
  }, [interactionStep, showInteraction4, showInteraction5, showInteraction6, showInteraction7]);



  
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

        {!selectedImage ? (
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
        ) : (
          <div className={styles.gridu}>
            <p>That's what you're having?</p>
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

        {/* initial sequence */}
        {messages.map((message, index) => (
          <div key={index} className={`${styles.typewriter} ${styles.monospace}`}>
            <p>{message}</p>
          </div>
        ))}

        {/* options for interaction 1 */}
        {showOptions && !isOptionSelected && interactionStep === 0 && (
          <div className={styles.options}>
            <button onClick={() => handleUserResponse("yeah, that's my style")}>yeah, that's my style</button>
            <button onClick={() => handleUserResponse("no, it's something else")}>no, it's something else</button>
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
        {interactionStep >= 1 && showInteraction2 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            Tell me, are you actually enjoying it or just trying to look cool?
          </div>
        )}

        {/* options for interaction 2 */}
        {interactionStep === 1 && !isOptionSelected && showInteraction2 && showOptionsForInteraction2 && (
            <div className={styles.options}>
              <button onClick={() => handleUserResponse("obsessed with it, actually")}>obsessed with it, actually</button>
              <button onClick={() => handleUserResponse("it's for the bereal")}>it's for the bereal</button>
            </div>
        )}

        {/* response 2 */}
        {interactionStep >= 1 && userResponses[1] && showInteraction2 && (
          <div className={`${styles.typewriterRes} ${styles.monospace}`}>
            <p>{userResponses[1]}</p>
          </div>
        )}

        {/* interaction 3 */}
        {interactionStep >= 2 && showInteraction3 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            So you’re a {parsedData?.category} person. Shocking. How's that going for you?
          </div>
        )}

        {/* options for interaction 3 */}
        {interactionStep === 2 && !isOptionSelected && showInteraction3 && showOptionsForInteraction3 && (
            <div className={styles.options}>
              <button onClick={() => handleUserResponse("better than you'd think")}>better than you'd think</button>
              <button onClick={() => handleUserResponse("let's not go there")}>let's not go there</button>
            </div>
        )}

        {/* response 3 */}
        {interactionStep >= 2 && userResponses[2] && showInteraction3 && (
          <div className={`${styles.typewriterRes} ${styles.monospace}`}>
            <p>{userResponses[2]}</p>
          </div>
        )}

        {/* interaction 4 */}
        {interactionStep >= 3 && showInteraction4 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            Let's keep that between us.
          </div>
        )}

        {/* interaction 5 */}
        {interactionStep >= 3 && showInteraction4 && showInteraction5 &&  ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            {parsedData?.comment}
          </div>
        )}

        {showGuessMessage && (
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            Let me guess, you're into...
          </div>
        )}
        
        {showBulletPoint && (
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            - {parsedData?.bulletPoints[0]}
            <br />
            - {parsedData?.bulletPoints[1]}
            <br />
            - {parsedData?.bulletPoints[2]}
          </div>
        )}

        {/* options for interaction 5 */}
        {interactionStep === 4 && !isOptionSelected && showOptionsForInteraction5 && (
            <div className={styles.options}>
              <button onClick={() => handleUserResponse("whatever you say")}>whatever you say</button>
              <button onClick={() => handleUserResponse("drag me more")}>drag me more</button>
            </div>
        )}

        {/* response 5 */}
        {interactionStep >= 4 && userResponses[3] && showInteraction5 && (
          <div className={`${styles.typewriterRes} ${styles.monospace}`}>
            <p>{userResponses[3]}</p>
          </div>
        )}

        {/* interaction 6 */}
        {interactionStep >= 4 && userResponses[3] && showInteraction6 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            How about a cheeky tidbit so you can impress your friends other than your drink choice?
          </div>
        )}

        {/* interaction 7 */}
        {interactionStep >= 4 && userResponses[3] && showInteraction7 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            - {parsedData?.historicalFact}
          </div>
        )}

        {/* closing line 1 */}
        {interactionStep >= 6 && showLine1 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            Still staring at your phone with that {parsedData?.nameOfBeverage}? You good?
          </div>
        )}

        {/* closing line 2 */}
        {interactionStep >= 6 && showLine2 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            Just kidding, I don't care. Good luck with that.
          </div>
        )}

        {/* closing line 3 */}
        {interactionStep >= 6 && showLine3 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            I digress, off to judge other people's drink choices.
          </div>
        )}

        {/* closing line 4 */}
        {interactionStep >= 6 && showLine4 && ( 
          <div className={`${styles.typewriter} ${styles.monospace}`}>
            Enjoyed the banter? Come back once you find something more tasteful.
          </div>
        )}

        {/* wine emoji */}
        {gptResponse && showWine && (
        <div className={styles.description}>
          <br />
          <img src="https://i.imgur.com/PTmtsWg.png" width="25" height="25"></img>
        </div>
        )}
        

      </main>
    </div>
  );
}