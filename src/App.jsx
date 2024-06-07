import ImageAnotation from "./components";
import { useState } from "react";
export default function App() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        height: "100vh",
      }}
    >
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image ? (
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <ImageAnotation imageSrc={image} />
        </div>
      ) : (
        <p>Select an image to annotate.</p>
      )}
    </div>
  );
}
