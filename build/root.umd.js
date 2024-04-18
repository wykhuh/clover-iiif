const Image = require("./image");
const Primitives = require("./primitives");
const Slider = require("./slider");
const Viewer = require("./viewer");
const {
  parseAnnotationTarget,
  parseAnnotationsFromAnnotationResources
} = require("./annotation_helpers");
const { createOpenSeadragonRect } = require("./openseadragon-helpers");

module.exports = {
  default: Viewer,
  Image,
  Primitives,
  Slider,
  Viewer,
  parseAnnotationTarget,
  parseAnnotationsFromAnnotationResources,
  createOpenSeadragonRect
};
