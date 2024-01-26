import {
  Navigator,
  Viewport,
  Wrapper,
} from "src/components/Viewer/ImageViewer/ImageViewer.styled";
import OpenSeadragon, { Options } from "openseadragon";
import React, { useEffect, useState } from "react";
import {
  ViewerContextStore,
  useViewerState,
  useViewerDispatch,
} from "src/context/viewer-context";

import Controls from "src/components/Viewer/ImageViewer/Controls";
import { getInfoResponse } from "src/lib/iiif";
import { v4 as uuidv4 } from "uuid";

export type osdImageTypes = "tiledImage" | "simpleImage" | undefined;
interface OSDProps {
  uri: string | undefined;
  hasPlaceholder: boolean;
  imageType: osdImageTypes;
}

const OSD: React.FC<OSDProps> = ({ uri, hasPlaceholder, imageType }) => {
  const [osdUri, setOsdUri] = useState<string>();
  const [osdInstance, setOsdInstance] = useState<string>();
  const viewerState: ViewerContextStore = useViewerState();
  const { configOptions } = viewerState;
  const dispatch: any = useViewerDispatch();

  const config: Options = {
    id: `openseadragon-viewport-${osdInstance}`,
    loadTilesWithAjax: true,
    fullPageButton: "fullPage",
    homeButton: "reset",
    rotateLeftButton: "rotateLeft",
    rotateRightButton: "rotateRight",
    zoomInButton: "zoomIn",
    zoomOutButton: "zoomOut",
    showNavigator: true,
    showFullPageControl: true,
    showHomeControl: true,
    showRotationControl: true,
    showZoomControl: true,
    navigatorBorderColor: "transparent",
    navigatorId: `openseadragon-navigator-${osdInstance}`,
    gestureSettingsMouse: {
      clickToZoom: true,
      dblClickToZoom: true,
      pinchToZoom: true,
      scrollToZoom: true,
    },
    ...configOptions.openSeadragon,
    ajaxWithCredentials: configOptions.withCredentials,
  };

  useEffect(() => {
    if (uri !== osdUri) {
      setOsdUri(uri);
      setOsdInstance(uuidv4());
    }
  }, [osdUri, uri]);

  useEffect(() => {
    if (osdUri) {
      switch (imageType) {
        case "simpleImage":
          const viewer = OpenSeadragon(config);
          viewer.addSimpleImage({
            url: osdUri,
          });
          dispatch({
            type: "updateOpenSeadragonViewer",
            openSeadragonViewer: viewer,
          });
          break;
        case "tiledImage":
          getInfoResponse(osdUri).then((tileSource) => {
            const viewer = OpenSeadragon(config);
            // console.log("OSD", viewer?.id);

            // viewer.addHandler("page", () => {
            //   console.log("page");
            // });
            // viewer.addHandler("canvas-enter", (a) => {
            //   console.log("canvas-enter:", a.eventSource.id);
            // });
            // viewer.addHandler("close", () => {
            //   console.log("close");
            // });
            // viewer.addHandler("before-destroy", () => {
            //   console.log("before-destroy");
            // });
            // viewer.addHandler("destroy", () => {
            //   console.log("destroy");
            // });
            // viewer.addHandler("open", () => {
            //   console.log("open");
            // });
            // viewer.addHandler("update-tile", () => {
            //   console.log("update-tile");
            // });
            // viewer.addHandler("tile-loaded", (a, b, c, d) => {
            //   console.log("tile-loaded:", a.eventSource.id);
            // });
            // viewer.addHandler("tile-drawn", () => {
            //   console.log("tile-drawn");
            // });

            // viewer.addHandler("update-viewport", () => {
            //   console.log("update-viewport");
            // });
            viewer.addTiledImage({
              tileSource: tileSource,
            });
            dispatch({
              type: "updateOpenSeadragonViewer",
              openSeadragonViewer: viewer,
            });
          });
          break;
        default:
          console.warn(
            `Unable to render ${osdUri} in OpenSeadragon as type: "${imageType}"`,
          );
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [osdUri]);

  if (!osdInstance) return null;

  return (
    <Wrapper
      css={{
        backgroundColor: configOptions.canvasBackgroundColor,
        height: configOptions.canvasHeight,
      }}
      className="clover-viewer-osd-wrapper"
      data-testid="clover-viewer-osd-wrapper"
    >
      <Controls hasPlaceholder={hasPlaceholder} options={config} />
      <Navigator id={`openseadragon-navigator-${osdInstance}`} />
      <Viewport id={`openseadragon-viewport-${osdInstance}`} />
    </Wrapper>
  );
};

export default OSD;
