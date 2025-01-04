import { Excalidraw } from "@excalidraw/excalidraw";

const Whiteboard = () => {
  return (
    <div>
      <h1>Whiteboard</h1>
      <div style={{ height: "500px" }}>
        <Excalidraw />
      </div>
    </div>
  );
};

export default Whiteboard;
