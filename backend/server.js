// server.js (Node.js backend)
import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import cors from 'cors';

const app = express();
const upload = multer();
app.use(cors());

app.post('/compress', upload.single('image'), async (req, res) => {
  try {
    const compressed = await sharp(req.file.buffer)
      .webp({ quality: 85, effort: 1, lossless: false })
      .toBuffer();

    res.type('image/webp').send(compressed);
  } catch (err) {
    console.error(err);
    res.status(500).send('Compression failed');
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
