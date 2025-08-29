// App.js
import { useState, useEffect } from 'react';
import './App.css';
import { Html5QrcodeScanner } from 'html5-qrcode';
import QRCode from 'react-qr-code';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [qrInput, setQrInput] = useState('');

  useEffect(() => {
    if (scanResult) return; 

    const success = (result) => {
      scanner.clear();
      setScanResult(result);
    };

    const error = (err) => {
      console.warn(err);
    };

    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 5, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(success, error);

    return () => {
      scanner.clear().catch((err) => console.warn(err));
    };
  }, [scanResult]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>QR Code Scanner</h1>

      {scanResult ? (
        <div>
          <strong>Success:</strong>{' '}
          <a
            href={scanResult.startsWith('http') ? scanResult : `http://${scanResult}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {scanResult}
          </a>
          <br />
          <button
            onClick={() => setScanResult(null)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Scan Again
          </button>
        </div>
      ) : (
        <div id="reader" style={{ marginBottom: '20px' }}></div>
      )}

      <hr style={{ margin: '40px 0' }} />

      <h2>QR Code Generator</h2>
      <input
        type="text"
        placeholder="Enter text or URL"
        value={qrInput}
        onChange={(e) => setQrInput(e.target.value)}
        style={{
          padding: '10px',
          width: '300px',
          fontSize: '16px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      {qrInput && (
        <div style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
          <QRCode
            value={qrInput}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>
      )}
    </div>
  );
}

export default App;