import React, { useState, useRef } from "react";

const ImageAnnotationTool = () => {
  const [drawingData, setDrawingData] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);

  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (startPoint) {
      // Draw line if startPoint exists
      setDrawingData((prevData) => [
        ...prevData,
        { start: startPoint, end: { x: offsetX, y: offsetY } },
      ]);
      setStartPoint({ x: offsetX, y: offsetY });
    } else {
      // Set startPoint if it doesn't exist
      setDrawingData([
        { start: { x: offsetX, y: offsetY }, end: { x: offsetX, y: offsetY } },
      ]);
      setStartPoint({ x: offsetX, y: offsetY });
    }
  };

  const handleUndo = () => {
    if (drawingData.length > 0) {
      // Remove the last drawn line segment
      setDrawingData((prevData) => prevData.slice(0, -1));

      // If there are points left, update the startPoint to the last drawn point
      if (drawingData.length > 1) {
        setStartPoint({
          x: drawingData[drawingData.length - 2].end.x,
          y: drawingData[drawingData.length - 2].end.y,
        });
      } else {
        // If no points left, reset startPoint to null
        setStartPoint(null);
      }
    }
  };

  const calculateHighlightPoints = () => {
    const points = drawingData.map((line) => [line.start.x, line.start.y]);

    if (points.length >= 3) {
      // Add the last line's end point to close the shape for highlighting
      points.push([
        drawingData[drawingData.length - 1].end.x,
        drawingData[drawingData.length - 1].end.y,
      ]);
    }

    return points;
  };

  const handleDone = () => {
    if (drawingData.length > 0) {
      // Include the last dot when clicking "Done"
      const completedPolygon = [
        ...drawingData,
        {
          start: drawingData[drawingData.length - 1].end,
          end: drawingData[0].start,
        },
      ];

      // Save the drawn polygon to the list of saved polygons
      setSavedPolygons((prevPolygons) => [...prevPolygons, completedPolygon]);
    }

    // Reset drawingData and startPoint for a new polygon
    setDrawingData([]);
    setStartPoint(null);
  };

  const handleSendData = () => {
    console.log("All Selected Areas:", savedPolygons);
  };

  return (
    <div
      style={{
        position: "relative",
        cursor: `url('.././cursor.png'), auto`,
      }}
    >
      <img
        ref={imageRef}
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Annotated Image"
        style={{ maxWidth: "60%", height: "auto" }}
        onMouseDown={handleMouseDown}
      />

      {drawingData.map((line, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: line.start.y,
            left: line.start.x,
            width: Math.sqrt(
              Math.pow(line.end.x - line.start.x, 2) +
                Math.pow(line.end.y - line.start.y, 2)
            ),
            height: 2,
            backgroundColor: "red",
            transform: `rotate(${Math.atan2(
              line.end.y - line.start.y,
              line.end.x - line.start.x
            )}rad)`,
            transformOrigin: "0 0",
            pointerEvents: "none",
          }}
        />
      ))}
      {startPoint && (
        <div
          style={{
            position: "absolute",
            top: startPoint.y - 2,
            left: startPoint.x - 2,
            width: 4,
            height: 4,
            backgroundColor: "red",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      )}

      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
        width="100%"
        height="100%"
      >
        {/* Saved Polygons */}
        {savedPolygons.map((polygon, polyIndex) => (
          <polygon
            key={polyIndex}
            fill="rgba(0, 255, 0, 0.3)"
            points={polygon
              .flatMap((point) => [point.start.x, point.start.y])
              .join(" ")}
          />
        ))}

        {/* Highlight Polygon */}
        <polygon
          fill="rgba(0, 255, 0, 0.3)"
          points={calculateHighlightPoints().flat().join(" ")}
        />
      </svg>

      <button onClick={handleUndo} disabled={drawingData.length === 0}>
        Undo
      </button>
      <button onClick={handleDone}>Done</button>
      <button onClick={handleSendData}>Send Data</button>
    </div>
  );
};

export default ImageAnnotationTool;
