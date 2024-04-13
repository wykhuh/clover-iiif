import { useEditorState } from "src/plugins/AnnotationEditor/context/annotation-editor-context";
// import {} from // parseAnnotationTarget,
// // createOpenSeadragonRect
// "src/index";

export const MyImageLoaded = (openSeadragonViewer, configOptions, canvas) => {
  const editorState = useEditorState();
  const { clippingsActiveTarget } = editorState;
  console.log("clippingsActiveTarget 3", clippingsActiveTarget);

  if (!clippingsActiveTarget) return;
  if (!openSeadragonViewer) return;
  // const zoomLevel = configOptions.annotationOverlays?.zoomLevel || 1;
  // const target = Array.isArray(clippingsActiveTarget)
  //   ? clippingsActiveTarget[0]
  //   : clippingsActiveTarget;
  // const parsedAnnotationTarget = parseAnnotationTarget(target);
  // const { rect, id } = parsedAnnotationTarget;
  // if (rect) {
  //   // if (canvas.id === id) {
  //   //   const rect2 = createOpenSeadragonRect(
  //   //     canvas,
  //   //     parsedAnnotationTarget,
  //   //     zoomLevel,
  //   //   );
  //   //   openSeadragonViewer?.viewport.fitBounds(rect2);
  //   // }
  // }
  return <></>;
};
