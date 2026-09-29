// Uploads an image to Cloudinary using an unsigned preset and returns its secure URL.
export async function uploadImageToCloudinary(file) {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary is not configured. Add the Cloudinary environment variables.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    let response;
    try {
        response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
        );
    } catch (networkError) {
        throw new Error("Could not connect to Cloudinary. Check your internet connection.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Cloudinary rejected the configuration. Check that CLOUD_NAME is the value from Cloudinary Dashboard and UPLOAD_PRESET is an unsigned preset.");
        }

        throw new Error(data.error?.message || `Cloudinary upload failed (${response.status}).`);
    }

    if (!data.secure_url) {
        throw new Error("Cloudinary did not return an image URL.");
    }

    return data.secure_url;
}
