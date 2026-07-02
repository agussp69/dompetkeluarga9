/**
 * Utility to compress image files on the client side using HTML5 Canvas.
 * Compresses the image if it is larger than a specified threshold (default 500 KB).
 */
export async function compressProfileImage(
  file: File,
  maxDimension = 1200,
  quality = 0.82,
  sizeThresholdBytes = 500 * 1024 // 500 KB
): Promise<{ file: File; originalSize: number; compressedSize: number; compressed: boolean }> {
  const originalSize = file.size;

  // If the file is smaller than the threshold, skip compression
  if (originalSize <= sizeThresholdBytes) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressed: false,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize the image if it exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback to original file if canvas context is not available
          resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            compressed: false,
          });
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob with JPEG format and quality setting
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                compressed: false,
              });
              return;
            }

            // Create a new File object
            const extension = "jpg";
            const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const newFileName = `${originalNameWithoutExt}_compressed.${extension}`;

            const compressedFile = new File([blob], newFileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            // Double check: if compressed file is somehow larger, return original file
            if (compressedFile.size >= originalSize) {
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                compressed: false,
              });
            } else {
              resolve({
                file: compressedFile,
                originalSize,
                compressedSize: compressedFile.size,
                compressed: true,
              });
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        // Fallback to original file on image load error
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          compressed: false,
        });
      };
    };

    reader.onerror = () => {
      // Fallback to original file on file read error
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        compressed: false,
      });
    };
  });
}
