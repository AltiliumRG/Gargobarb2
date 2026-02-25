export default function GalleryUploader({ images, setImages }) {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  return (
    <div>
      <label className="font-semibold block mb-2">Galería</label>
      <input type="file" multiple onChange={handleUpload} />
      <div className="grid grid-cols-3 gap-2 mt-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={URL.createObjectURL(img)}
            alt="preview"
            className="h-24 w-full object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}
