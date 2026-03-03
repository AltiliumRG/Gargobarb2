import api from "./api";

export const uploadSiteImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return api.post("/uploads/site-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};