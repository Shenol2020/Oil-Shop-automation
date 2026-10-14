// @ts-nocheck
// Image storage utility for managing product images in the frontend /images folder

const STORAGE_PREFIX = 'doc_pos_img_';

/**
 * Sanitizes a product name into a safe filename slug
 */
export function sanitizeFilename(name) {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 30);
}

/**
 * Compresses an image file using an HTML5 canvas to keep size optimal
 */
export function compressImage(file, maxWidth = 400, maxHeight = 400, quality = 0.75) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve('');
  });
}

/**
 * Saves an uploaded image file into public/images with a unique filename,
 * and returns the relative path string (e.g. '/images/img_1741234567_mobil.jpg')
 */
export async function saveUploadedImage(file, productName = 'product') {
  if (!file) return '';

  // Determine file extension
  let ext = 'jpg';
  if (file.type === 'image/png') ext = 'png';
  else if (file.type === 'image/webp') ext = 'webp';
  else if (file.name && file.name.includes('.')) {
    ext = file.name.split('.').pop().toLowerCase();
  }

  // Create a unique filename with timestamp
  const safeName = sanitizeFilename(productName);
  const uniqueFilename = `img_${Date.now()}_${safeName}.${ext}`;
  const relativePath = `/images/${uniqueFilename}`;

  // Compress and read image as data URL
  const dataUrl = await compressImage(file, 400, 400, 0.75);

  // Cache in browser storage mapped to relativePath
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${relativePath}`, dataUrl);
  } catch (e) {
    console.warn('LocalStorage quota exceeded for image caching:', e);
  }

  // Also post to Vite server upload endpoint to save physical file into public/images/
  try {
    await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: uniqueFilename,
        data: dataUrl
      })
    });
  } catch (err) {
    console.info('Vite upload handler fallback (image retained in frontend memory/storage):', err.message);
  }

  return relativePath;
}

/**
 * Resolves a product image path to a displayable URL
 */
export function getProductImageUrl(picPath, fallbackName = '') {
  if (!picPath || typeof picPath !== 'string' || picPath.trim() === '') {
    if (fallbackName) {
      const n = fallbackName.toLowerCase();
      if (n.includes('gear') || n.includes('trans') || n.includes('75w')) return '/gear_oil.jpg';
      if (n.includes('4l') || n.includes('can') || n.includes('drum') || n.includes('diesel')) return '/synthetic_4l.jpg';
      return '/hero_oil_can.jpg';
    }
    return '/hero_oil_can.jpg';
  }

  const trimmed = picPath.trim();
  
  // If it's already a Data URL or external HTTP URL, return directly
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Check if we have a locally cached high-res data URL for this path
  try {
    const cached = localStorage.getItem(`${STORAGE_PREFIX}${trimmed}`);
    if (cached) return cached;
  } catch (e) {
    // Ignore storage errors
  }

  // Return the public relative path (e.g. '/images/img_1741234567_mobil.jpg')
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
