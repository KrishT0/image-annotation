import React, { useRef, useState } from "react";

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  };

  const drawLine = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #000" }}
        onMouseDown={startDrawing}
        onMouseMove={drawLine}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
};

export default DrawingApp;
