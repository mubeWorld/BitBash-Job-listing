import { useEffect, useState } from 'react';

const Timer = ({ onTimeout }) => {
  const [status, setStatus] = useState('waiting'); 

  useEffect(() => {
    const timer = setTimeout(async () => {
      setStatus('sent');
      if (onTimeout) {
        await onTimeout(); 
      }
    }, 3 * 60 * 1000); 

    return () => clearTimeout(timer); 
  }, [onTimeout]);

  return (
    <div
      style={{
        display: 'inline-block',
        backgroundColor: status === 'sent' ? '#4caf50' : '#f0ad4e',
        color: 'white',
        padding: '0.4rem 1rem',
        borderRadius: '1rem',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
      }}
    >
      {status === 'waiting' ? 'Waiting 3 minutes…' : 'Request sent ✅'}
    </div>
  );
};

export default Timer;
