import Image from "./image";
import Primitives from "./primitives";
import Scroll from "./scroll";
import Slider from "./slider";
import Viewer from "./viewer";
import {
  parseAnnotationTarget,
  parseAnnotationsFromAnnotationResources,
} from "./annotation-helpers";
import { createOpenSeadragonRect } from "./openseadragon-helpers";

export {
  Image,
  Primitives,
  Scroll,
  Slider,
  Viewer,
  parseAnnotationTarget,
  parseAnnotationsFromAnnotationResources,
  createOpenSeadragonRect
};

export default Viewer;
