// import { useBuilder } from "../../../context/BuilderContext";

// export default function HeroEditor({ section }) {
// const { updateSectionContent } = useBuilder();
// const content = section.content || {};

// const update = (key, value) => {
//   updateSectionContent(section.id, {
//     ...content,
//     [key]: value,
//   });
// };

// return (
//   <div className="space-y-4">

//     <input
//       value={content.title || ""}
//       onChange={(e) => update("title", e.target.value)}
//       placeholder="Título"
//       className="w-full bg-gray-800 p-2 rounded"
//     />

//     <input
//       value={content.subtitle || ""}
//       onChange={(e) => update("subtitle", e.target.value)}
//       placeholder="Subtítulo"
//       className="w-full bg-gray-800 p-2 rounded"
//     />

//     <input
//       value={content.image || ""}
//       onChange={(e) => update("image", e.target.value)}
//       placeholder="URL imagen hero"
//       className="w-full bg-gray-800 p-2 rounded"
//     />

//     <input
//       value={content.buttonText || ""}
//       onChange={(e) => update("buttonText", e.target.value)}
//       placeholder="Texto botón"
//       className="w-full bg-gray-800 p-2 rounded"
//     />
//   </div>
// );
// }
