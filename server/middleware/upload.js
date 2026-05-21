import multer from 'multer';
import path from 'path';

// Store files in memory buffer, then upload to Cloudinary manually in the route
const storage = multer.memoryStorage();

const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tif', '.tiff',
  '.heic', '.heif', '.avif',
]);
const AUDIO_EXTENSIONS = new Set([
  '.mp3', '.m4a', '.aac', '.wav', '.ogg', '.flac', '.opus', '.weba',
]);

// Android browsers frequently mis-label image files as
// `application/octet-stream` or an empty mimetype — particularly HEIC files
// synced from iCloud, photos opened from Downloads, or anything routed through
// a third-party gallery picker. Falling back to the file extension catches
// those without opening the door to arbitrary file types.
function isAcceptableUpload(file) {
  const mime = (file.mimetype || '').toLowerCase();
  if (mime.startsWith('image/') || mime.startsWith('audio/')) return true;
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext) || AUDIO_EXTENSIONS.has(ext)) return true;
  return false;
}

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB — mobile photos can be large
  fileFilter(req, file, cb) {
    if (isAcceptableUpload(file)) {
      cb(null, true);
    } else {
      cb(new Error('Only image or audio files are allowed'));
    }
  },
});

export default upload;
