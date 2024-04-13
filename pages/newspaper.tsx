import Viewer from "docs/components/DynamicImports/Viewer";
import dynamic from "next/dynamic";
import InformationPanel from "src/plugins/AnnotationEditor/components/InformationPanel";
import {
  EditorProvider,
  useEditorState,
} from "src/plugins/AnnotationEditor/context/annotation-editor-context";
import { MyImageLoaded } from "src/plugins/AnnotationEditor/hooks/useImageLoaded";
const AnnotationEditor = dynamic(
  () => import("src/plugins/AnnotationEditor/components/AnnotationEditor"),
  {
    ssr: false,
  },
);

import { useEffect } from "react";

// const useImageLoaded = dynamic(
//   () => import("src/plugins/AnnotationEditor/hooks/useImageLoaded"),
//   {
//     ssr: false,
//   },
// );

// const AnnotationEditor = dynamic(
//   () => import("src/plugins/AnnotationEditor/components/AnnotationEditor"),
//   {
//     ssr: false,
//   },
// );

function Demo() {
  return <div>Demo info panel</div>;
}

function Foo(props) {
  return <EditorProvider>{RenderViewer(props)}</EditorProvider>;
}

function Newspaper() {
  const editorState = useEditorState();
  // const { clippingsActiveTarget } = editorState;
  useEffect(() => {
    console.log("clippingsActiveTarget 2", editorState);
  }, [editorState]);

  return <Foo editorState={editorState} />;
}

function RenderViewer(props) {
  console.log(props);
  // // const editorState = useEditorState();
  // const { clippingsActiveTarget } = editorState;
  // useEffect(() => {
  //   console.log("clippingsActiveTarget 1", editorState);
  // }, [editorState]);

  const base_url = "http://localhost:3000";
  return (
    <Viewer
      iiifContent={`${base_url}/api/newspaper/collection`}
      plugins={[
        {
          id: "AnnotationEditor",
          imageViewer: {
            // imageLoadedCallback: MyImageLoaded,
            // imageLoadedCallback: (
            //   openSeadragonViewer,
            //   configOptions,
            //   canvas,
            // ) => {
            //   // if (document) {
            //   //   debugger;
            //   //   useImageLoaded(openSeadragonViewer, configOptions, canvas);
            //   // }
            //   console.log(
            //     "plugin imageLoadedCallback",
            //     "openSeadragonViewer:",
            //     openSeadragonViewer,
            //     "configOptions:",
            //     configOptions,
            //     "canvas:",
            //     canvas,
            //     "clippingsActiveTarget:",
            //     clippingsActiveTarget,
            //   );
            // },
            context: props.editorState,
            menu: {
              component: AnnotationEditor,
              componentProps: {
                annotationServer: `${base_url}/api/annotationsByCanvas/1`,
                token: "123abc",
              },
            },
          },
          informationPanel: {
            component: InformationPanel,
            label: { none: ["my clip"] },
            componentProps: {
              annotationServer: `${base_url}/api/annotations/1`,
              token: "123abc",
            },
          },
        },
        {
          id: "demo",
          informationPanel: {
            label: { none: ["My demo"] },
            component: Demo,
          },
        },
      ]}
      options={{
        // ignoreAnnotationOverlaysLabels: ["Clippings"],
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

export default Newspaper;
