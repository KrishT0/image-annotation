import React, { useState, useRef } from "react";
// import data from "./data.json";

const ImageAnnotationTool = ({ imageSrc }) => {
  const [drawingData, setDrawingData] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);

  const imageRef = useRef(null);

  const reverseTransformArray = (inputArrays) => {
    return inputArrays.map((inputArray) => {
      return inputArray.map((point, index, array) => {
        const nextIndex = (index + 1) % array.length;
        return {
          start: { x: point.x, y: point.y },
          end:
            array[nextIndex] !== undefined
              ? { x: array[nextIndex].x, y: array[nextIndex].y }
              : { x: array[0].x, y: array[0].y },
        };
      });
    });
  };

  const transformArray = (inputArray) => {
    return inputArray.map((subArray) => subArray.map(({ start }) => start));
  };

  // Transform the imported data using reverseTransformArray and set it to savedPolygons
  // React.useEffect(() => {
  //   const transformedData = reverseTransformArray(); //add imported data to show periviously saved polygons
  //   setSavedPolygons(transformedData);
  // }, []); // Run the effect once on component mount

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
    const startPointsOnly = transformArray(savedPolygons);
    console.log("All Selected Start Points:", startPointsOnly);
    console.log(
      "All Selected Start Points (Reversed):",
      reverseTransformArray(startPointsOnly)
    );

    // Convert the startPointsOnly array to JSON and save it to a file
    const jsonData = JSON.stringify(startPointsOnly, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "coordinates.json";
    a.click();
  };
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        gap: "1rem",
      }}
    >
      <div>
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Annotated Image"
          style={{ maxWidth: "100%", height: "auto" }}
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
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        <button
          onClick={handleUndo}
          disabled={drawingData.length === 0}
          style={{
            cursor: "pointer",
            backgroundColor: "black",
            width: "5rem",
            height: "2rem",
            color: "white",
            borderRadius: "0.5rem",
            outline: "none",
          }}
        >
          Undo
        </button>
        <button
          onClick={handleDone}
          style={{
            cursor: "pointer",
            backgroundColor: "black",
            width: "5rem",
            height: "2rem",
            color: "white",
            borderRadius: "0.5rem",
            outline: "none",
          }}
        >
          Done
        </button>
        <button
          onClick={handleSendData}
          style={{
            cursor: "pointer",
            backgroundColor: "black",
            width: "5rem",
            height: "2rem",
            color: "white",
            borderRadius: "0.5rem",
            outline: "none",
          }}
        >
          Send Data
        </button>
      </div>
    </div>
  );
};

export default ImageAnnotationTool;
