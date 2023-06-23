import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>nattiana</title>
        <meta name="description" content="nattiana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          nattiana
        </h1>

        <div className={styles.grid}>
          <label htmlFor="capture" className={styles.card}>
            <p>scan wine label</p>
            <input className={styles.hiddenInput} type="file" id="capture" accept="image" hidden />
          </label>
        </div>
        
      </main>

      <footer className={styles.footer}>
        <a 
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
