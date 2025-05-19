const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/supabase");

const spBucketName = process.env.SUPABASE_BUCKET_NAME;
if (!spBucketName) {
  throw new Error("SUPABASE_BUCKET_NAME is not defined in .env");
}

/**
 * Uploads an image buffer to Supabase Storage.
 * @param {Buffer} fileBuffer - The image buffer (from multer).
 * @param {string} originalName - Original file name.
 * @param {string} mimetype - MIME type (e.g., image/jpeg).
 * @returns {Object} { url, filename }
 */
const uploadImageToSupabase = async (fileBuffer, originalName, mimetype) => {
  const filename = `${uuidv4()}-${originalName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(spBucketName)
    .upload(filename, fileBuffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    throw new Error("Image upload failed");
  }

  const { data: urlData, error: urlError } = supabase.storage
    .from(spBucketName)
    .getPublicUrl(filename);

  if (urlError || !urlData?.publicUrl) {
    console.error(
      "Failed to generate public URL:",
      urlError?.message || "No URL returned"
    );
    throw new Error("Failed to get image public URL");
  }

  console.log("Image uploaded:", filename);
  return {
    url: urlData.publicUrl,
    filename,
  };
};

/**
 * Deletes an image from Supabase Storage.
 * @param {string} filename - The stored filename to delete.
 */
const deleteImageFromSupabase = async (filename) => {
  const { error } = await supabase.storage
    .from(spBucketName)
    .remove([filename]);

  if (error) {
    console.error("Delete error:", error.message);
    throw new Error("Image deletion failed");
  }

  console.log("Image deleted:", filename);
};

module.exports = {
  uploadImageToSupabase,
  deleteImageFromSupabase,
};
