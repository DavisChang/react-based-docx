import { Excalidraw, WelcomeScreen, MainMenu } from "@excalidraw/excalidraw";
import { useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types.d.ts";
import "./index.css";

const Whiteboard = () => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const UIOptions = {
    canvasActions: {
      loadScene: false,
    },
    tools: { image: true },
  };

  return (
    <div>
      <h1>Whiteboard</h1>
      <button
        type="button"
        onClick={() => {
          if (!excalidrawAPI) {
            return;
          }
          const elements = excalidrawAPI.getSceneElements();
          excalidrawAPI.scrollToContent(elements[0], {
            fitToViewport: true,
          });
        }}
      >
        Fit to viewport, first element
      </button>

      <button
        type="button"
        onClick={() => {
          if (!excalidrawAPI) {
            return;
          }
          excalidrawAPI.resetScene();
        }}
      >
        resetScene
      </button>
      <hr />
      <div style={{ height: "500px" }} className="custom-styles">
        <Excalidraw
          UIOptions={UIOptions}
          excalidrawAPI={(api: ExcalidrawImperativeAPI) =>
            setExcalidrawAPI(api)
          }
        >
          <WelcomeScreen />
          <MainMenu>
            <MainMenu.ItemLink href="https://google.com">
              Google
            </MainMenu.ItemLink>
            <MainMenu.ItemLink href="https://excalidraw.com">
              Excalidraw
            </MainMenu.ItemLink>
          </MainMenu>
        </Excalidraw>
      </div>
    </div>
  );
};

export default Whiteboard;
