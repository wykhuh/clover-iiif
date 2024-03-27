import {
  Navigator,
  Viewport,
  Wrapper,
} from "src/components/Image/Image.styled";
import OpenSeadragon, { Options } from "openseadragon";
import React, { useEffect, useState } from "react";

import Controls from "src/components/Image/Controls/Controls";
import { OpenSeadragonImageTypes } from "src/types/open-seadragon";
import { getInfoResponse } from "src/lib/iiif";

interface OSDProps {
  _cloverViewerHasPlaceholder: boolean;
  ariaLabel?: string | null;
  config: Options;
  uri: string | undefined;
  imageType: OpenSeadragonImageTypes;
  openSeadragonCallback?: (viewer: OpenSeadragon.Viewer) => void;
  imageLoadedCallback?: (viewer: OpenSeadragon.Viewer) => void;
}

const OSD: React.FC<OSDProps> = ({
  ariaLabel,
  config,
  uri,
  _cloverViewerHasPlaceholder,
  imageType,
  openSeadragonCallback,
  imageLoadedCallback,
}) => {
  const [osdUri, setOsdUri] = useState<string>();
  const [openSeadragon, setOpenSeadragon] = useState<OpenSeadragon.Viewer>();

  useEffect(() => {
    if (!openSeadragon) setOpenSeadragon(OpenSeadragon(config));

    return () => openSeadragon?.destroy();
  }, []);

  useEffect(() => {
    if (openSeadragon && openSeadragonCallback)
      openSeadragonCallback(openSeadragon);
  }, [openSeadragon, openSeadragonCallback]);

  useEffect(() => {
    if (uri !== osdUri) setOsdUri(uri);
  }, [osdUri, uri]);

  useEffect(() => {
    if (osdUri && openSeadragon) {
      switch (imageType) {
        case "simpleImage":
          openSeadragon.addSimpleImage({
            url: osdUri,
          });
          break;
        case "tiledImage":
          getInfoResponse(osdUri).then((tileSource) => {
            try {
              if (!tileSource)
                throw new Error(`No tile source found for ${osdUri}`);

              openSeadragon.addTiledImage({
                tileSource: tileSource,
                success: () => {
                  if (imageLoadedCallback) {
                    imageLoadedCallback(openSeadragon);
                  }
                },
              });
            } catch (e) {
              console.error(e);
            }
          });
          break;
        default:
          openSeadragon.close();
          console.warn(
            `Unable to render ${osdUri} in OpenSeadragon as type: "${imageType}"`,
          );
          break;
      }
    }
  }, [imageType, osdUri, openSeadragon]);

  return (
    <Wrapper
      className="clover-iiif-image-openseadragon"
      data-testid="clover-iiif-image-openseadragon"
      data-openseadragon-instance={config.id}
      hasNavigator={config.showNavigator}
    >
      <Controls
        _cloverViewerHasPlaceholder={_cloverViewerHasPlaceholder}
        config={config}
      />
      {config.showNavigator && (
        <Navigator
          id={config.navigatorId}
          data-testid="clover-iiif-image-openseadragon-navigator"
        />
      )}
      <Viewport
        id={config.id}
        data-testid="clover-iiif-image-openseadragon-viewport"
        role="img"
        {...(ariaLabel && { "aria-label": ariaLabel })}
      />
    </Wrapper>
  );
};

export default OSD;
