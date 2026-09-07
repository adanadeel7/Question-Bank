import cloudinary from "./cloudinary.js";

function uploadBufferToCloudinary(buffer : Buffer): Promise<{url :string; publicId: string}> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "questions" },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(buffer);
    });
}

export { uploadBufferToCloudinary }
