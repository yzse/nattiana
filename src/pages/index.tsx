import Head from 'next/head';
import styles from '../styles/Home.module.css';

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

        <br />

        <div className={styles.description}>
          <p>
            ai natural wine recommender
          </p>
          </div>

        <div className={styles.grid}>
          
          <label htmlFor="capture" className="photo">
            <br />
            <p>scan wine label</p>
            <input className={styles.hiddenInput} type="file" id="capture" accept="image/*" capture="environment" hidden />
          </label>
        </div>
      </main>
    </div>
  )
}
