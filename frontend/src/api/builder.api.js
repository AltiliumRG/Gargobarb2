import api from "./axios";

export const updateSection = (id, data) =>
  api.put(`/site/sections/${id}`, data);

export const publishSite = (siteId) =>
  api.post(`/site/${siteId}/publish`);
