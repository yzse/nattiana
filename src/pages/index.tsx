import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createWorker, Worker } from 'tesseract.js';
// import { Button, Progress, Stack, Text, Spinner } from '@chakra-ui/react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [textResult, setTextResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const worker = useRef<Worker | null>(null);

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;
    setIsLoading(true);

    const worker = createWorker();
    await (await worker).load();
    await (await worker).loadLanguage("eng");
    await (await worker).initialize("eng");
    const { data } = await (await worker).recognize(selectedImage);
    setTextResult(data.text);
    setIsLoading(false);
  }, [selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [convertImageToText]);

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      setSelectedImage(files[0]);
    } else {
      setSelectedImage(null);
      setTextResult('');
    }
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

        <br />

        <div className={styles.description}>
          <p>ai natural wine recommender</p>
        </div>

        <div className={styles.grid}>
          <label htmlFor="capture" className="photo">
            <br />
            <p>scan wine label &rarr;</p>
            <input
              className={styles.hiddenInput}
              type="file"
              id="capture"
              accept="image/*"
              capture="environment"
              onChange={handleChangeImage}
              hidden
            />
          </label>
        </div>

        <br />
        <br />

        <div className="result">
          {isLoading ? (
            <div className={styles.loadingDot}></div>
          ) : textResult ? (
            <div className={styles.description}>
              <p>{textResult}</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
