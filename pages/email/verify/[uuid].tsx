import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../../api/api';
import Head from 'next/head';
import styles from './email-verify.module.scss';

export default function EmailVerification() {
  const router = useRouter();
  const { uuid } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_verified'>('loading');
  const [message, setMessage] = useState('');
  
  const getStatusClass = () => {
    switch (status) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'already_verified':
        return styles.info;
      default:
        return '';
    }
  };

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uuid) return;

      try {
        const response = await api.auth.verifyEmail(uuid as string);
        setStatus('success');
        setMessage(response.message);
        
        const timer = setTimeout(() => {
          router.push('/profile');
        }, 3000);
        
        return () => clearTimeout(timer);
      } catch (error: any) {
        console.error('Verification error:', error);
        if (error.response?.data?.message === 'Email avval aktivlashtirilgan') {
          setStatus('already_verified');
          setMessage('Email avval aktivlashtirilgan');
        } else {
          setStatus('error');
          setMessage(error.response?.data?.message || 'Xatolik yuz berdi');
        }
      }
    };

    verifyEmail();
  }, [uuid, router]);

  const getContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className={styles.emailVerifyCard}>
            <div className={styles.loadingSpinner}></div>
            <h2 className={styles.title}>Email tasdiqlanmoqda...</h2>
          </div>
        );
      case 'success':
        return (
          <div className={styles.emailVerifyCard}>
            <h2 className={`${styles.title} ${styles.success}`}>Muvaffaqiyatli!</h2>
            <p className={styles.message}>{message}</p>
            <p className={styles.redirectText}>Profil sahifasiga yo'naltirilmoqda...</p>
          </div>
        );
      case 'already_verified':
        return (
          <div className={styles.emailVerifyCard}>
            <h2 className={`${styles.title} ${styles.info}`}>Email avval tasdiqlangan</h2>
            <p className={styles.message}>{message}</p>
            <button 
              className={styles.button}
              onClick={() => router.push('/profile')}
            >
              Profilga o'tish
            </button>
          </div>
        );
      case 'error':
        return (
          <div className={styles.emailVerifyCard}>
            <h2 className={`${styles.title} ${styles.error}`}>Xatolik yuz berdi</h2>
            <p className={styles.message}>
              {message || 'Email tasdiqlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.'}
            </p>
            <button 
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => window.location.reload()}
            >
              Qayta urinish
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Email Tasdiqlash | Phono</title>
        <meta name="description" content="Email manzilingizni tasdiqlang" />
      </Head>
      <div className={styles.emailVerifyContainer}>
        {getContent()}
      </div>
    </>
  );
}