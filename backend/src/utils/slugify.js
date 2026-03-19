/**
 * Converts a string into a URL-friendly slug.
 * Handles accents, special characters, and multiple spaces.
 * 
 * @param {string} text - The text to slugify
 * @returns {string} - The cleaned slug
 */
function slugify(text) {
  if (!text) return "";
  
  return text
    .toString()
    .normalize("NFD")               // Separate accents from letters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start
    .replace(/-+$/, "");            // Trim - from end
}

module.exports = slugify;
