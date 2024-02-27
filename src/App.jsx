import ImageAnotation from "./components";
import DrawingApp from "./components/line";
import { useState } from "react";
export default function App() {
  // const [image, setImage] = useState(null);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="container">
      {/* <input type="file" accept="image/*" onChange={handleImageChange} />
      {image ? (
        <ImageAnotation imageSrc={image} />
      ) : (
        <p>Select an image to annotate.</p>
      )} */}
      <ImageAnotation />
      {/* <DrawingApp /> */}
    </div>
  );
}
