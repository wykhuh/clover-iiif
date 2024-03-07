import Primitives from "src/components/Primitives";
import Slider from "src/components/Slider";
import Viewer from "src/components/Viewer";
import {
  parseAnnotationTarget,
  parseAnnotationsFromAnnotationResources,
  type AnnotationTargetExtended,
} from "src/lib/annotation-helpers";
import { createOpenSeadragonRect } from "src/lib/openseadragon-helpers";
import { type Plugin, type PluginInformationPanel } from "src/types/plugins";

export {
  Primitives,
  Slider,
  Viewer,
  parseAnnotationTarget,
  parseAnnotationsFromAnnotationResources,
  type AnnotationTargetExtended,
  createOpenSeadragonRect,
  type Plugin,
  type PluginInformationPanel,
};

export default Viewer;
