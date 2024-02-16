import Viewer from "docs/components/DynamicImports/Viewer";
import dynamic from "next/dynamic";
const AnnotationEditor = dynamic(
  () => import("src/plugins/AnnotationEditor/AnnotationEditor"),
  {
    ssr: false,
  },
);

function newspaper() {
  return (
    <Viewer
      iiifContent="http://localhost:3000/manifest/newspaper/newspaper_collection.json"
      plugins={[
        {
          component: AnnotationEditor,
          componentProps: {
            annotationServer: "http://localhost:3000/api/annotations/1",
            userId: "123",
          },
        },
      ]}
      options={{
        informationPanel: { open: true },
        canvasHeight: "640px",
        openSeadragon: {
          gestureSettingsMouse: {
            scrollToZoom: true,
          },
        },
      }}
    />
  );
}

export default newspaper;
