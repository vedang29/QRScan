import { useState, useEffect } from 'react';
import './App.css';
import { Html5QrcodeScanner } from 'html5-qrcode';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [qrInput, setQrInput] = useState('');

  useEffect(() => {
    if (scanResult) return;

    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 5, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (result) => {
        scanner.clear();
        setScanResult(result);
      },
      (error) => console.warn(error)
    );

    return () => {
      scanner.clear().catch((err) => console.warn(err));
    };
  }, [scanResult]);

  // ✅ NEW: Download Original PNG
  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');

    const svg = document.querySelector('#qr-gen svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        saveAs(blob, 'qrcode.png');
      }, 'image/png');
    };
  };

  // ✅ Existing: Download Compressed WebP
  const handleGenerateQRCode = async () => {
    const canvas = document.createElement('canvas');

    const svg = document.querySelector('#qr-gen svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'qrcode.png');

        try {
          const response = await fetch('http://localhost:3001/compress', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Compression failed');

          const compressedBlob = await response.blob();
          saveAs(compressedBlob, 'qrcode.webp');
        } catch (error) {
          console.error('Compression Error:', error);
        }
      }, 'image/png');
    };
  };

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
        <div id="qr-gen" style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
          <QRCode
            value={qrInput}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>
      )}
      <br />
      {qrInput && (
        <>
          <button
            onClick={handleDownloadPNG}
            style={{
              marginTop: '20px',
              marginRight: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#6c757d',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Download as PNG
          </button>

          <button
            onClick={handleGenerateQRCode}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#28a745',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Download as Compressed WebP
          </button>
        </>
      )}
    </div>
  );
}

export default App;
