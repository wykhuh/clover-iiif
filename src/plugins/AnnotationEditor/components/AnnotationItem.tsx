import React, { useEffect } from "react";
import {
  type PluginInformationPanel,
  parseAnnotationTarget,
  createOpenSeadragonRect,
  type AnnotationTargetExtended,
} from "src/index";
import {
  AnnotationForEditor,
  AnnotationBodyForEditor,
} from "../types/annotation";
import { useEditorDispatch } from "../context/annotation-editor-context";

interface PropType extends PluginInformationPanel {
  annotation: AnnotationForEditor;
  setActiveTarget: React.Dispatch<
    React.SetStateAction<AnnotationTargetExtended | string | undefined>
  >;
  activeTarget?: AnnotationTargetExtended | string;
}

const AnnotationItem: React.FC<PropType> = ({
  annotation,
  viewerConfigOptions,
  canvas,
  openSeadragonViewer,
  useViewerDispatch,
  setActiveTarget,
  activeTarget,
}) => {
  const dispatch: any = useViewerDispatch();
  const editorDispatch: any = useEditorDispatch();

  // zoom to activeTarget when openSeadragonViewer changes
  useEffect(() => {
    if (!openSeadragonViewer) return;
    if (!annotation.target) return;
    if (annotation.target != activeTarget) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSeadragonViewer]);

  function handleClick() {
    if (!annotation.target) return;

    const zoomLevel = viewerConfigOptions.annotationOverlays?.zoomLevel || 1;

    const target = Array.isArray(annotation.target)
      ? annotation.target[0]
      : annotation.target;
    const parsedAnnotationTarget = parseAnnotationTarget(target);
    const { rect, id } = parsedAnnotationTarget;

    if (rect) {
      if (canvas.id === id) {
        const rect2 = createOpenSeadragonRect(
          canvas,
          parsedAnnotationTarget,
          zoomLevel,
        );
        openSeadragonViewer?.viewport.fitBounds(rect2);
      } else {
        dispatch({
          type: "updateActiveCanvas",
          canvasId: id,
        });
        editorDispatch({
          type: "updateClippingsActiveTarget",
          clippingsActiveTarget: target,
        });
        setActiveTarget(target);
      }
    }
  }

  function renderBody(body: AnnotationBodyForEditor, i: number) {
    if (typeof body === "string") {
      return (
        <div key={i} className="clipping-text">
          {body}
        </div>
      );
    } else if (body.type === "Image") {
      return <img src={body.value} key={i} className="clipping-image" />;
    } else if (body.type === "TextualBody") {
      return (
        <div key={i} className="clipping-text">
          {body.value}
        </div>
      );
    }
  }

  function processBody(
    body: AnnotationBodyForEditor | AnnotationBodyForEditor[],
  ) {
    if (Array.isArray(body)) {
      return body.map((body, i: number) => {
        return renderBody(body, i);
      });
    } else {
      return renderBody(body, 0);
    }
  }

  if (!annotation.body) return <></>;

  return (
    <div className="clipping" onClick={handleClick}>
      {processBody(annotation.body)}
    </div>
  );
};

export default AnnotationItem;

export function panToTarget(
  openSeadragonViewer,
  viewerConfigOptions,
  activeTarget,
  canvas,
) {
  if (!openSeadragonViewer) return;
  const zoomLevel = viewerConfigOptions.annotationOverlays?.zoomLevel || 1;

  const parsedAnnotationTarget = parseAnnotationTarget(activeTarget);
  const { rect, id } = parsedAnnotationTarget;

  if (rect) {
    if (canvas.id === id) {
      const rect2 = createOpenSeadragonRect(
        canvas,
        parsedAnnotationTarget,
        zoomLevel,
      );
      openSeadragonViewer?.viewport.fitBounds(rect2);
    }
  }
}
