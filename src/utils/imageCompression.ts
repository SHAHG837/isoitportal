/**
 * Client-Side Image Compression & Optimization Utility
 * Reduces high-resolution mobile camera photos (5-20MB) down to crisp, lightweight 
 * web-optimized JPEG data URLs (~40-90KB) so submissions never fail on mobile networks.
 */

export async function compressImageFile(
  file: File,
  maxDimension: number = 800,
  quality: number = 0.8
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    // If it's a PDF, we can't resize via canvas, return standard reader
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve({
          dataUrl: result,
          originalSize: file.size,
          compressedSize: result.length
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas 2D not supported
          resolve({
            dataUrl: e.target?.result as string,
            originalSize: file.size,
            compressedSize: (e.target?.result as string).length
          });
          return;
        }

        // Draw and compress
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          compressedSize: Math.round((compressedDataUrl.length * 3) / 4)
        });
      };

      img.onerror = () => {
        // Fallback
        resolve({
          dataUrl: e.target?.result as string,
          originalSize: file.size,
          compressedSize: (e.target?.result as string).length
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
