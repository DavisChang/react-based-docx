import {
  Excalidraw,
  WelcomeScreen,
  MainMenu,
  restoreElements,
  convertToExcalidrawElements,
  MIME_TYPES,
} from "@excalidraw/excalidraw";
import { useRef, useState } from "react";
import type {
  BinaryFileData,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types.d.ts";
import "./index.css";
import { FileId } from "@excalidraw/excalidraw/types/element/types";

// Fetch the image and convert it to a Base64 data URL
const fetchImageAsDataURL = async (
  url: string
): Promise<{ dataURL: string; width: number; height: number }> => {
  const response = await fetch(url);
  const blob = await response.blob();

  // Convert blob to Base64 data URL
  const dataURL = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  // Get image dimensions
  return new Promise<{ dataURL: string; width: number; height: number }>(
    (resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ dataURL, width: img.width, height: img.height });
      };
      img.src = dataURL;
    }
  );
};

const Whiteboard = () => {
  const excalidrawContainerRef = useRef<HTMLDivElement>(null);
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const UIOptions = {
    canvasActions: {
      loadScene: false,
    },
    tools: { image: true },
  };

  const addImageFromUrl = async () => {
    const imageUrl = "http://localhost:5173/demo.png";
    const { dataURL, width, height } = await fetchImageAsDataURL(imageUrl);
    console.log("fetchImageAsDataURL:", { dataURL, width, height });

    const viewportWidth =
      excalidrawContainerRef?.current?.clientWidth || window.innerWidth;
    const viewportHeight =
      excalidrawContainerRef?.current?.clientHeight || window.innerHeight;
    const aspectRatio = height / width;

    const imageWidth = viewportWidth;
    const imageHeight = viewportWidth * aspectRatio;

    // Center horizontally and vertically
    const x = (viewportWidth - imageWidth) / 2;
    const y = (viewportHeight - imageHeight) / 2;

    const sceneData = {
      elements: restoreElements(
        convertToExcalidrawElements([
          {
            id: "image-1",
            type: "image",
            x,
            y,
            width: imageWidth,
            height: imageHeight,
            angle: 0,
            strokeColor: "transparent",
            backgroundColor: "transparent",
            strokeWidth: 0,
            roughness: 0,
            seed: 1,
            version: 1,
            versionNonce: 123456,
            isDeleted: false,
            fileId: "image-file-1" as FileId,
          },
        ]),
        null
      ),
    };

    const imagesArray: BinaryFileData[] = [
      {
        id: "image-file-1" as BinaryFileData["id"],
        dataURL: dataURL as BinaryFileData["dataURL"],
        mimeType: MIME_TYPES.jpg,
        created: Date.now(),
        lastRetrieved: Date.now(),
      },
    ];

    if (!excalidrawAPI) {
      return;
    }

    excalidrawAPI.addFiles(imagesArray);
    excalidrawAPI.updateScene(sceneData);
  };

  const fitToViewport = () => {
    if (!excalidrawAPI) {
      return;
    }
    const elements = excalidrawAPI.getSceneElements();
    excalidrawAPI.scrollToContent(elements[0], {
      fitToViewport: true,
    });
  };
  const resetScene = () => {
    if (!excalidrawAPI) {
      return;
    }
    excalidrawAPI.resetScene();
  };
  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h1>Whiteboard</h1>
        <button type="button" onClick={addImageFromUrl}>
          Add Image From ULR
        </button>
        <button type="button" onClick={fitToViewport}>
          Fit to viewport, first element
        </button>

        <button type="button" onClick={resetScene}>
          resetScene
        </button>
      </div>

      <div
        ref={excalidrawContainerRef}
        style={{ height: "500px" }}
        className="custom-styles"
      >
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
