// import { useBuilder } from "../../../context/BuilderContext";

// export default function GalleryEditor({ section }) {
//   const { updateSectionContent } = useBuilder();
//   const content = section.content || {};
//   const images = content.images || [];

//   const updateImages = (newImages) => {
//     updateSectionContent(section.id, {
//       ...content,
//       images: newImages,
//     });
//   };

//   const addImage = () => {
//     updateImages([...images, ""]);
//   };

//   const updateImage = (i, value) => {
//     const updated = [...images];
//     updated[i] = value;
//     updateImages(updated);
//   };

//   const removeImage = (i) => {
//     updateImages(images.filter((_,index)=>index!==i));
//   };

//   return (
//     <div className="space-y-3">

//       {images.map((img, i) => (
//         <div key={i} className="flex gap-2">

//           <input
//             value={img}
//             onChange={(e)=>updateImage(i,e.target.value)}
//             className="flex-1 bg-gray-800 p-2 rounded"
//             placeholder="URL imagen"
//           />

//           <button
//             onClick={()=>removeImage(i)}
//             className="text-red-400"
//           >
//             X
//           </button>

//         </div>
//       ))}

//       <button
//         onClick={addImage}
//         className="bg-yellow-500 px-4 py-2 rounded text-black"
//       >
//         + Agregar imagen
//       </button>

//     </div>
//   );
// }
