import {
  Navigator,
  Viewport,
  Wrapper,
} from "src/components/Viewer/ImageViewer/ImageViewer.styled";
import OpenSeadragon, { Options } from "openseadragon";
import React, { useEffect, useState } from "react";
import { ViewerContextStore, useViewerState } from "src/context/viewer-context";

import Controls from "src/components/Viewer/ImageViewer/Controls";
import { getInfoResponse } from "src/lib/iiif";
import { v4 as uuidv4 } from "uuid";

export type osdImageTypes = "tiledImage" | "simpleImage" | undefined;

interface OSDProps {
  uri: string | undefined;
  hasPlaceholder: boolean;
  imageType: osdImageTypes;
  osdViewerCallback?: (
    viewer: any,
    OpenSeadragon: any,
    vault: any,
    activeCanvas: any,
  ) => void;
}

const OSD: React.FC<OSDProps> = ({
  uri,
  hasPlaceholder,
  imageType,
  osdViewerCallback,
}) => {
  const [osdUri, setOsdUri] = useState<string>();
  const [osdInstance, setOsdInstance] = useState<string>();
  const viewerState: ViewerContextStore = useViewerState();
  const { configOptions, vault, activeCanvas } = viewerState;

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
          if (osdViewerCallback) {
            osdViewerCallback(viewer, OpenSeadragon, vault, activeCanvas);
          }
          break;
        case "tiledImage":
          getInfoResponse(osdUri).then((tileSource) => {
            const viewer = OpenSeadragon(config);
            viewer.addTiledImage({
              tileSource: tileSource,
            });
            if (osdViewerCallback) {
              osdViewerCallback(viewer, OpenSeadragon, vault, activeCanvas);
            }
          });
          break;
        default:
          console.warn(
            `Unable to render ${osdUri} in OpenSeadragon as type: "${imageType}"`,
          );
          break;
      }
    }
  }, [osdUri]);

  if (!osdInstance) return null;

  return (
    <Wrapper
      css={{
        backgroundColor: configOptions.canvasBackgroundColor,
        height: configOptions.canvasHeight,
      }}
    >
      <Controls hasPlaceholder={hasPlaceholder} options={config} />
      <Navigator id={`openseadragon-navigator-${osdInstance}`} />
      <Viewport id={`openseadragon-viewport-${osdInstance}`} />
    </Wrapper>
  );
};

export default OSD;
