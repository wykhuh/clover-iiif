import r, { createContext as G, useReducer as oe, useContext as S, useState as C, useRef as P, useEffect as x } from "react";
import { Vault as L } from "@iiif/vault";
import ie from "sanitize-html";
import { createStitches as ae } from "@stitches/react";
import "hls.js";
import q from "openseadragon";
import "@iiif/vault-helpers";
import { ErrorBoundary as le } from "react-error-boundary";
import { v4 as K } from "uuid";
import se from "@nulib/use-markdown";
import ce from "flexsearch";
const A = {
  annotations: [],
  manifest: void 0,
  searchString: void 0,
  options: {
    offset: 0
  },
  vault: new L()
};
function de(e, t) {
  switch (t.type) {
    case "updateAnnotations":
      return {
        ...e,
        annotations: t.payload
      };
    case "updateSearchString":
      return {
        ...e,
        searchString: t.payload
      };
    default:
      return e;
  }
}
const w = G({
  dispatch: () => null,
  state: A
}), ue = (e) => {
  const { children: t, manifest: n } = e, a = {
    ...A.options,
    ...e.options
  }, [o, i] = oe(de, A);
  return /* @__PURE__ */ r.createElement(
    w.Provider,
    {
      value: {
        state: { ...o, manifest: n, options: a },
        dispatch: i
      }
    },
    t
  );
}, me = (e, t = "none") => {
  if (!e)
    return null;
  if (typeof e == "string")
    return [e];
  if (!e[t]) {
    const n = Object.getOwnPropertyNames(e);
    if (n.length > 0)
      return e[n[0]];
  }
  return !e[t] || !Array.isArray(e[t]) ? null : e[t];
}, M = (e, t = "none", n = ", ") => {
  const a = me(e, t);
  return Array.isArray(a) ? a.join(`${n}`) : a;
};
function pe(e) {
  return { __html: he(e) };
}
function T(e, t) {
  const n = Object.keys(e).filter(
    (o) => t.includes(o) ? null : o
  ), a = new Object();
  return n.forEach((o) => {
    a[o] = e[o];
  }), a;
}
function he(e) {
  return ie(e, {
    allowedAttributes: {
      a: ["href"],
      img: ["alt", "src", "height", "width"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedTags: [
      "a",
      "b",
      "br",
      "i",
      "img",
      "p",
      "small",
      "span",
      "sub",
      "sup"
    ]
  });
}
const k = 209, ge = {
  colors: {
    /*
     * Black and dark grays in a light theme.
     * Must contrast to 4.5 or greater with `secondary`.
     */
    primary: "#1a1d1e",
    primaryMuted: "#26292b",
    primaryAlt: "#151718",
    /*
     * Key brand color(s).
     * Must contrast to 4.5 or greater with `secondary`.
     */
    accent: `hsl(${k} 100% 38.2%)`,
    accentMuted: `hsl(${k} 80% 61.8%)`,
    accentAlt: `hsl(${k} 80% 30%)`,
    /*
     * White and light grays in a light theme.
     * Must contrast to 4.5 or greater with `primary` and  `accent`.
     */
    secondary: "#FFFFFF",
    secondaryMuted: "#e6e8eb",
    secondaryAlt: "#c1c8cd"
  },
  fontSizes: {
    1: "12px",
    2: "13px",
    3: "15px",
    4: "17px",
    5: "19px",
    6: "21px",
    7: "27px",
    8: "35px",
    9: "59px"
  },
  lineHeights: {
    1: "12px",
    2: "13px",
    3: "15px",
    4: "17px",
    5: "19px",
    6: "21px",
    7: "27px",
    8: "35px",
    9: "59px"
  },
  sizes: {
    1: "5px",
    2: "10px",
    3: "15px",
    4: "20px",
    5: "25px",
    6: "35px",
    7: "45px",
    8: "65px",
    9: "80px"
  },
  space: {
    1: "5px",
    2: "10px",
    3: "15px",
    4: "20px",
    5: "25px",
    6: "35px",
    7: "45px",
    8: "65px",
    9: "80px"
  },
  radii: {
    1: "4px",
    2: "6px",
    3: "8px",
    4: "12px",
    round: "50%",
    pill: "9999px"
  },
  transitions: {
    all: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)"
  },
  zIndices: {
    1: "100",
    2: "200",
    3: "300",
    4: "400",
    max: "999"
  }
}, fe = {
  xxs: "(max-width: 349px)",
  xs: "(max-width: 575px)",
  sm: "(max-width: 767px)",
  md: "(max-width: 991px)",
  lg: "(max-width: 90rem)",
  xl: "(min-width: calc(90rem + 1px))"
}, { styled: d, css: Ut, keyframes: Xt, createTheme: Gt } = ae({
  theme: ge,
  media: fe
}), xe = d("span", {}), O = (e) => {
  const { as: t, label: n } = e, o = T(e, ["as", "label"]);
  return /* @__PURE__ */ r.createElement(xe, { as: t, ...o }, M(n, o.lang));
};
d("img", { objectFit: "cover" });
d("a", {});
const ve = {
  delimiter: ", "
}, F = G(void 0), we = () => {
  const e = S(F);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, ye = ({
  children: e,
  initialState: t = ve
}) => {
  const n = Se(t, "delimiter");
  return /* @__PURE__ */ r.createElement(F.Provider, { value: { delimiter: n } }, e);
}, Se = (e, t) => Object.hasOwn(e, t) ? e[t].toString() : void 0, Ee = d("span", {}), V = (e) => {
  const { as: t, markup: n } = e, { delimiter: a } = we();
  if (!n)
    return /* @__PURE__ */ r.createElement(r.Fragment, null);
  const i = T(e, ["as", "markup"]), l = pe(
    M(n, i.lang, a)
  );
  return /* @__PURE__ */ r.createElement(Ee, { as: t, ...i, dangerouslySetInnerHTML: l });
}, be = (e) => r.useContext(F) ? /* @__PURE__ */ r.createElement(V, { ...e }) : /* @__PURE__ */ r.createElement(ye, null, /* @__PURE__ */ r.createElement(V, { ...e }));
d("span", {});
d("dl", {});
d("li", {});
d("ul", {});
d("li", {});
d("ul", {});
d("dl", {});
d("li", {});
d("ul", {});
const Ce = (e) => {
  const { as: t, summary: n } = e, o = T(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ r.createElement(be, { as: t, markup: n, ...o });
}, _ = d("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
}), Ie = d("aside", {
  margin: "0",
  padding: "0",
  position: "relative",
  zIndex: 2,
  flexGrow: "1",
  flexShrink: "0",
  [`& ${_}`]: {
    position: "absolute",
    width: "50%",
    top: 0
  },
  "&.anchor": {
    [`& ${_}`]: {
      position: "fixed",
      width: "50%"
    }
  }
}), ke = d("header", {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "1",
  flexGrow: "1",
  flexShrink: "0",
  marginBottom: "1.618rem",
  strong: {
    fontWeight: "400",
    fontSize: "1.33rem"
  }
}), $e = d("section", {
  margin: "0",
  gap: "1rem"
}), ze = ({ label: e }) => /* @__PURE__ */ r.createElement(ke, null, /* @__PURE__ */ r.createElement("strong", null, /* @__PURE__ */ r.createElement(O, { label: e }))), Le = d("article", {
  transition: "all 0.382s ease-in-out",
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  gap: "2.618rem"
}), Y = d("div", {
  transition: "$all",
  width: "50%",
  opacity: 0,
  transform: "translateX(2.618rem)",
  zIndex: -1
}), Ae = d("div", {
  width: "50%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start"
}), _e = d("hr", {
  margin: "0",
  borderColor: "transparent",
  height: "1.618rem",
  position: "relative",
  zIndex: 0,
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "2.618rem",
  "&::before": {
    content: "attr(aria-label)",
    position: "absolute",
    right: "1.618rem",
    bottom: "0",
    zIndex: 1,
    display: "flex",
    fontSize: "0.7222rem",
    fontWeight: "400",
    lineHeight: "1rem",
    background: "inherit",
    opacity: 0.7
  },
  "&::after": {
    content: "",
    width: "100%",
    position: "absolute",
    zIndex: 0,
    height: "1px",
    background: "#6662"
  }
}), Be = d("div", {
  position: "relative",
  zIndex: "1",
  display: "flex",
  flexDirection: "column",
  gap: "2.618rem",
  "&[data-figures-visible='true']": {
    [`& ${Y}`]: {
      opacity: 1,
      zIndex: 0,
      transform: "translateX(0)"
    }
  }
}), Pe = ({
  canvas: e,
  canvasInfo: { current: t, total: n }
}) => /* @__PURE__ */ r.createElement("figcaption", null, /* @__PURE__ */ r.createElement("em", null, t, " / ", n), (e == null ? void 0 : e.label) && /* @__PURE__ */ r.createElement(O, { label: e == null ? void 0 : e.label }), (e == null ? void 0 : e.summary) && /* @__PURE__ */ r.createElement(Ce, { summary: e == null ? void 0 : e.summary, as: "p" }));
let y = window.OpenSeadragon;
if (!y && (y = q, !y))
  throw new Error("OpenSeadragon is missing.");
const W = "http://www.w3.org/2000/svg";
y.Viewer && (y.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new J(this), this._svgOverlayInfo);
});
const J = function(e) {
  const t = this;
  this._viewer = e, this._containerWidth = 0, this._containerHeight = 0, this._svg = document.createElementNS(W, "svg"), this._svg.style.position = "absolute", this._svg.style.left = 0, this._svg.style.top = 0, this._svg.style.width = "100%", this._svg.style.height = "100%", this._viewer.canvas.appendChild(this._svg), this._node = document.createElementNS(W, "g"), this._svg.appendChild(this._node), this._viewer.addHandler("animation", function() {
    t.resize();
  }), this._viewer.addHandler("open", function() {
    t.resize();
  }), this._viewer.addHandler("rotate", function() {
    t.resize();
  }), this._viewer.addHandler("flip", function() {
    t.resize();
  }), this._viewer.addHandler("resize", function() {
    t.resize();
  }), this.resize();
};
J.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new y.Point(0, 0), !0), t = this._viewer.viewport.getZoom(!0), n = this._viewer.viewport.getRotation(), a = this._viewer.viewport.getFlip(), o = this._viewer.viewport._containerInnerSize.x;
    let i = o * t;
    const l = i;
    a && (i = -i, e.x = -e.x + o), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + i + "," + l + ") rotate(" + n + ")"
    );
  },
  // ----------
  onClick: function(e, t) {
    new y.MouseTracker({
      element: e,
      clickHandler: t
    }).setTracking(!0);
  }
};
const Me = (e, t, n, a) => {
  var l, u;
  const o = {
    canvas: void 0,
    accompanyingCanvas: void 0,
    annotationPage: void 0,
    annotations: []
  }, i = (s) => {
    if (s) {
      if (!s.body || !s.motivation) {
        console.error(
          "Invalid annotation after Hyperion parsing: missing either 'body' or 'motivation'",
          s
        );
        return;
      }
      let p = s.body;
      Array.isArray(p) && (p = p[0]);
      const m = e.get(p.id);
      if (!m)
        return;
      switch (n) {
        case "painting":
          return s.target === t.id && s.motivation && s.motivation[0] === "painting" && a.includes(m.type) && (s.body = m), !!s;
        case "supplementing":
          return;
        default:
          throw new Error("Invalid annotation motivation.");
      }
    }
  };
  if (o.canvas = e.get(t), o.canvas && (o.annotationPage = e.get(o.canvas.items[0]), o.accompanyingCanvas = (l = o.canvas) != null && l.accompanyingCanvas ? e.get((u = o.canvas) == null ? void 0 : u.accompanyingCanvas) : void 0), o.annotationPage) {
    const s = e.get(o.annotationPage.items).map((m) => ({
      body: e.get(m.body[0].id),
      motivation: m.motivation,
      type: "Annotation"
    })), p = [];
    s.forEach((m) => {
      m.body.type === "Choice" ? m.body.items.forEach(
        (c) => p.push({
          ...m,
          id: c.id,
          body: e.get(c.id)
        })
      ) : p.push(m);
    }), o.annotations = p.filter(i);
  }
  return o;
}, Te = (e, t) => {
  const n = Me(
    e,
    { id: t, type: "Canvas" },
    "painting",
    ["Image", "Sound", "Video"]
  );
  if (n.annotations.length !== 0 && n.annotations && n.annotations)
    return n.annotations.map(
      (a) => a == null ? void 0 : a.body
    );
}, Oe = (e) => fetch(`${e.replace(/\/$/, "")}/info.json`).then((t) => t.json()).then((t) => t).catch((t) => {
  console.error(
    `The IIIF tilesource ${e.replace(
      /\/$/,
      ""
    )}/info.json failed to load: ${t}`
  );
}), Fe = (e) => {
  let t, n;
  if (Array.isArray(e) && (t = e[0], t)) {
    let a;
    "@id" in t ? a = t["@id"] : a = t.id, n = a;
  }
  return n;
};
var I = /* @__PURE__ */ ((e) => (e.TiledImage = "tiledImage", e.SimpleImage = "simpleImage", e))(I || {});
const Re = (e) => {
  const t = Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0, n = t ? Fe(e == null ? void 0 : e.service) : e == null ? void 0 : e.id, a = t ? I.TiledImage : I.SimpleImage;
  return {
    uri: n,
    imageType: a
  };
}, He = (e, t) => {
  const n = t ? I.TiledImage : I.SimpleImage;
  return {
    uri: e,
    imageType: n
  };
}, Ve = d("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}), We = d("p", {
  fontWeight: "bold",
  fontSize: "x-large"
}), De = d("span", {
  fontSize: "medium"
}), je = ({ error: e }) => {
  const { message: t } = e;
  return /* @__PURE__ */ r.createElement(Ve, { role: "alert" }, /* @__PURE__ */ r.createElement(We, { "data-testid": "headline" }, "Something went wrong"), t && /* @__PURE__ */ r.createElement(De, null, `Error message: ${t}`, " "));
}, B = d("div", {
  position: "absolute !important",
  zIndex: "1",
  top: "1rem",
  left: "1rem",
  width: "161.8px",
  height: "100px",
  backgroundColor: "#000D",
  boxShadow: "5px 5px 5px #0002",
  borderRadius: "3px",
  ".displayregion": {
    border: " 3px solid $accent !important",
    boxShadow: "0 0 3px #0006"
  },
  "@sm": {
    width: "123px",
    height: "76px"
  },
  "@xs": {
    width: "100px",
    height: "61.8px"
  }
}), Ne = d("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Ze = d("div", {
  width: "100%",
  height: "100%",
  maxHeight: "100vh",
  background: "transparent",
  backgroundSize: "contain",
  color: "white",
  position: "relative",
  zIndex: "0",
  overflow: "hidden",
  variants: {
    hasNavigator: {
      true: {
        [`${B}`]: {
          display: "block"
        }
      },
      false: {
        [`${B}`]: {
          display: "none"
        }
      }
    }
  }
}), Ue = d("button", {
  display: "flex",
  height: "2rem",
  width: "2rem",
  borderRadius: "2rem",
  padding: "0",
  margin: "0",
  fontFamily: "inherit",
  background: "none",
  backgroundColor: "$primary",
  border: "none",
  color: "white",
  cursor: "pointer",
  marginLeft: "0.618rem",
  filter: "drop-shadow(2px 2px 5px #0003)",
  transition: "$all",
  boxSizing: "content-box !important",
  "&:first-child": {
    marginLeft: "0"
  },
  "@xs": {
    marginBottom: "0.618rem",
    marginLeft: "0",
    "&:last-child": {
      marginBottom: "0"
    }
  },
  svg: {
    height: "60%",
    width: "60%",
    padding: "20%",
    fill: "$secondary",
    stroke: "$secondary",
    filter: "drop-shadow(2px 2px 5px #0003)",
    transition: "$all",
    boxSizing: "inherit"
  },
  "&:hover, &:focus": {
    backgroundColor: "$accent"
  },
  "&[data-button=rotate-right]": {
    "&:hover, &:focus": {
      svg: {
        rotate: "45deg"
      }
    }
  },
  "&[data-button=rotate-left]": {
    transform: "scaleX(-1)",
    "&:hover, &:focus": {
      svg: {
        rotate: "45deg"
      }
    }
  },
  "&[data-button=reset]": {
    "&:hover, &:focus": {
      svg: {
        rotate: "-15deg"
      }
    }
  }
}), b = ({ className: e, id: t, label: n, children: a }) => {
  const o = n.toLowerCase().replace(/\s/g, "-");
  return /* @__PURE__ */ r.createElement(
    Ue,
    {
      id: t,
      className: e,
      "data-testid": "openseadragon-button",
      "data-button": o
    },
    /* @__PURE__ */ r.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        "aria-labelledby": `${t}-svg-title`,
        "data-testid": "openseadragon-button-svg",
        focusable: "false",
        viewBox: "0 0 512 512",
        role: "img"
      },
      /* @__PURE__ */ r.createElement("title", { id: `${t}-svg-title` }, n),
      a
    )
  );
}, Xe = d("div", {
  position: "absolute",
  zIndex: "1",
  top: "1rem",
  right: "1rem",
  display: "flex",
  "@xs": {
    flexDirection: "column",
    zIndex: "2"
  },
  variants: {
    hasPlaceholder: {
      true: {
        right: "3.618rem",
        "@xs": {
          top: "3.618rem",
          right: "1rem"
        }
      },
      false: {
        right: "1rem",
        "@xs": {
          top: "1rem",
          right: "1rem"
        }
      }
    }
  }
}), Ge = {
  behavior: "smooth",
  block: "center"
}, v = {
  annotationOverlays: {
    backgroundColor: "#6666ff",
    borderColor: "#000099",
    borderType: "solid",
    borderWidth: "1px",
    opacity: "0.5",
    renderOverlays: !0,
    zoomLevel: 2
  },
  background: "transparent",
  canvasBackgroundColor: "#6662",
  canvasHeight: "500px",
  contentSearch: {
    searchResultsLimit: 20,
    overlays: {
      backgroundColor: "#ff6666",
      borderColor: "#990000",
      borderType: "solid",
      borderWidth: "1px",
      opacity: "0.5",
      renderOverlays: !0,
      zoomLevel: 4
    }
  },
  ignoreCaptionLabels: [],
  ignoreAnnotationOverlaysLabels: [],
  informationPanel: {
    vtt: {
      autoScroll: {
        enabled: !0,
        settings: Ge
      }
    },
    open: !0,
    renderAbout: !0,
    renderSupplementing: !0,
    renderToggle: !0,
    renderAnnotation: !0,
    renderContentSearch: !0
  },
  openSeadragon: {},
  requestHeaders: { "Content-Type": "application/json" },
  showDownload: !0,
  showIIIFBadge: !0,
  showTitle: !0,
  withCredentials: !1,
  localeText: {
    contentSearch: {
      tabLabel: "Search Results",
      formPlaceholder: "Enter search words",
      noSearchResults: "No search results",
      loading: "Loading...",
      moreResults: "more results"
    }
  }
};
function qe(e) {
  let t = {
    ...v.informationPanel.vtt.autoScroll
  };
  return typeof e == "object" && (t = "enabled" in e ? e : { enabled: !0, settings: e }), e === !1 && (t.enabled = !1), Ke(t.settings), t;
}
function Ke({ behavior: e, block: t }) {
  const n = ["auto", "instant", "smooth"], a = ["center", "end", "nearest", "start"];
  if (!n.includes(e))
    throw TypeError(`'${e}' not in ${n.join(" | ")}`);
  if (!a.includes(t))
    throw TypeError(`'${t}' not in ${a.join(" | ")}`);
}
var Z, U;
const Ye = qe(
  (U = (Z = v == null ? void 0 : v.informationPanel) == null ? void 0 : Z.vtt) == null ? void 0 : U.autoScroll
);
var X;
const Q = {
  activeCanvas: "",
  activeManifest: "",
  OSDImageLoaded: !1,
  collection: {},
  configOptions: v,
  customDisplays: [],
  plugins: [],
  isAutoScrollEnabled: Ye.enabled,
  isAutoScrolling: !1,
  isInformationOpen: (X = v == null ? void 0 : v.informationPanel) == null ? void 0 : X.open,
  isLoaded: !1,
  isUserScrolling: void 0,
  vault: new L(),
  contentSearchVault: new L(),
  openSeadragonViewer: null,
  viewerId: K()
}, Je = r.createContext(Q), Qe = r.createContext(Q);
function D() {
  const e = r.useContext(Je);
  if (e === void 0)
    throw new Error("useViewerState must be used within a ViewerProvider");
  return e;
}
function ee() {
  const e = r.useContext(Qe);
  if (e === void 0)
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  return e;
}
const et = () => /* @__PURE__ */ r.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M256 112v288M400 256H112"
  }
), tt = () => /* @__PURE__ */ r.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 256H112"
  }
), rt = () => /* @__PURE__ */ r.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
  }
), nt = () => /* @__PURE__ */ r.createElement("path", { d: "M448 440a16 16 0 01-12.61-6.15c-22.86-29.27-44.07-51.86-73.32-67C335 352.88 301 345.59 256 344.23V424a16 16 0 01-27 11.57l-176-168a16 16 0 010-23.14l176-168A16 16 0 01256 88v80.36c74.14 3.41 129.38 30.91 164.35 81.87C449.32 292.44 464 350.9 464 424a16 16 0 01-16 16z" }), j = () => /* @__PURE__ */ r.createElement(r.Fragment, null, /* @__PURE__ */ r.createElement(
  "path",
  {
    fill: "none",
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
  }
), /* @__PURE__ */ r.createElement("path", { d: "M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z" })), ot = ({
  _cloverViewerHasPlaceholder: e,
  config: t
}) => {
  const n = D(), {
    activeCanvas: a,
    configOptions: o,
    openSeadragonViewer: i,
    plugins: l,
    vault: u,
    activeManifest: s
  } = n, p = u.get({
    id: a,
    type: "Canvas"
  });
  function m() {
    return l.filter((c) => {
      var g;
      return (g = c.imageViewer) == null ? void 0 : g.menu;
    }).map((c, g) => {
      var f, E, R, H;
      const h = (E = (f = c.imageViewer) == null ? void 0 : f.menu) == null ? void 0 : E.component;
      return /* @__PURE__ */ r.createElement(
        h,
        {
          key: g,
          ...(H = (R = c == null ? void 0 : c.imageViewer) == null ? void 0 : R.menu) == null ? void 0 : H.componentProps,
          activeManifest: s,
          canvas: p,
          viewerConfigOptions: o,
          openSeadragonViewer: i,
          useViewerDispatch: ee,
          useViewerState: D
        }
      );
    });
  }
  return /* @__PURE__ */ r.createElement(
    Xe,
    {
      "data-testid": "clover-iiif-image-openseadragon-controls",
      hasPlaceholder: e
    },
    t.showZoomControl && /* @__PURE__ */ r.createElement(r.Fragment, null, /* @__PURE__ */ r.createElement(b, { id: t.zoomInButton, label: "zoom in" }, /* @__PURE__ */ r.createElement(et, null)), /* @__PURE__ */ r.createElement(b, { id: t.zoomOutButton, label: "zoom out" }, /* @__PURE__ */ r.createElement(tt, null))),
    t.showFullPageControl && /* @__PURE__ */ r.createElement(b, { id: t.fullPageButton, label: "full page" }, /* @__PURE__ */ r.createElement(rt, null)),
    t.showRotationControl && /* @__PURE__ */ r.createElement(r.Fragment, null, /* @__PURE__ */ r.createElement(b, { id: t.rotateRightButton, label: "rotate right" }, /* @__PURE__ */ r.createElement(j, null)), /* @__PURE__ */ r.createElement(b, { id: t.rotateLeftButton, label: "rotate left" }, /* @__PURE__ */ r.createElement(j, null))),
    t.showHomeControl && /* @__PURE__ */ r.createElement(b, { id: t.homeButton, label: "reset" }, /* @__PURE__ */ r.createElement(nt, null)),
    m()
  );
}, it = ({
  ariaLabel: e,
  config: t,
  uri: n,
  _cloverViewerHasPlaceholder: a,
  imageType: o,
  openSeadragonCallback: i
}) => {
  const [l, u] = C(), [s, p] = C(), m = ee(), c = P(!1);
  return x(() => (c.current || (c.current = !0, s || p(q(t))), () => s == null ? void 0 : s.destroy()), []), x(() => {
    s && i && i(s);
  }, [s, i]), x(() => {
    s && n !== l && (s == null || s.forceRedraw(), u(n));
  }, [s, l, n]), x(() => {
    if (l && s)
      switch (o) {
        case "simpleImage":
          s == null || s.addSimpleImage({
            url: l
          });
          break;
        case "tiledImage":
          Oe(l).then((g) => {
            try {
              if (!g)
                throw new Error(`No tile source found for ${l}`);
              s == null || s.addTiledImage({
                tileSource: g,
                success: () => {
                  typeof m == "function" && m({
                    type: "updateOSDImageLoaded",
                    OSDImageLoaded: !0
                  });
                }
              });
            } catch (h) {
              console.error(h);
            }
          });
          break;
        default:
          s == null || s.close(), console.warn(
            `Unable to render ${l} in OpenSeadragon as type: "${o}"`
          );
          break;
      }
  }, [o, l]), /* @__PURE__ */ r.createElement(
    Ze,
    {
      className: "clover-iiif-image-openseadragon",
      "data-testid": "clover-iiif-image-openseadragon",
      "data-openseadragon-instance": t.id,
      hasNavigator: t.showNavigator
    },
    /* @__PURE__ */ r.createElement(
      ot,
      {
        _cloverViewerHasPlaceholder: a,
        config: t
      }
    ),
    t.showNavigator && /* @__PURE__ */ r.createElement(
      B,
      {
        id: t.navigatorId,
        "data-testid": "clover-iiif-image-openseadragon-navigator"
      }
    ),
    /* @__PURE__ */ r.createElement(
      Ne,
      {
        id: t.id,
        "data-testid": "clover-iiif-image-openseadragon-viewport",
        role: "img",
        ...e && { "aria-label": e }
      }
    )
  );
};
function at(e) {
  return {
    id: `openseadragon-${e}`,
    navigatorId: `openseadragon-navigator-${e}`,
    loadTilesWithAjax: !0,
    fullPageButton: `fullPage-${e}`,
    homeButton: `reset-${e}`,
    rotateLeftButton: `rotateLeft-${e}`,
    rotateRightButton: `rotateRight-${e}`,
    zoomInButton: `zoomIn-${e}`,
    zoomOutButton: `zoomOut-${e}`,
    showNavigator: !0,
    showFullPageControl: !0,
    showHomeControl: !0,
    showRotationControl: !0,
    showZoomControl: !0,
    navigatorBorderColor: "transparent",
    gestureSettingsMouse: {
      clickToZoom: !0,
      dblClickToZoom: !0,
      pinchToZoom: !0,
      scrollToZoom: !1
    }
  };
}
const lt = ({
  _cloverViewerHasPlaceholder: e = !1,
  body: t,
  instanceId: n,
  isTiledImage: a = !1,
  label: o,
  src: i = "",
  openSeadragonCallback: l,
  openSeadragonConfig: u = {}
}) => {
  const s = n || K(), p = typeof o == "string" ? o : M(o), m = {
    ...at(s),
    ...u
  }, { imageType: c, uri: g } = t ? Re(t) : He(i, a);
  return g ? /* @__PURE__ */ r.createElement(le, { FallbackComponent: je }, /* @__PURE__ */ r.createElement(
    it,
    {
      _cloverViewerHasPlaceholder: e,
      ariaLabel: p,
      config: m,
      imageType: c,
      key: s,
      uri: g,
      openSeadragonCallback: l
    }
  )) : null;
}, st = d("div", {
  width: "100%",
  height: "400px",
  background: "#6662",
  backgroundSize: "contain",
  color: "white",
  position: "relative",
  zIndex: "1",
  overflow: "hidden"
}), ct = ({ body: e, label: t }) => /* @__PURE__ */ r.createElement(st, { "data-testid": "scroll-figure-image" }, /* @__PURE__ */ r.createElement(
  lt,
  {
    body: e,
    openSeadragonConfig: { showNavigator: !1, showHomeControl: !1 },
    ...t && { label: t }
  }
)), dt = d("figure", {
  figcaption: {
    display: "flex",
    flexDirection: "column",
    margin: "1.618rem 0 0",
    opacity: 0.9,
    em: {
      fontSize: "0.9em",
      fontStyle: "normal",
      opacity: 0.7
    }
  }
}), ut = ({ canvas: e, canvasInfo: t }) => {
  const { state: n } = S(w), { vault: a } = n, o = Te(a, e.id);
  return o ? /* @__PURE__ */ r.createElement(dt, null, o == null ? void 0 : o.map((i) => /* @__PURE__ */ r.createElement(ct, { body: i, key: i == null ? void 0 : i.id, label: e == null ? void 0 : e.label })), /* @__PURE__ */ r.createElement(Pe, { canvas: e, canvasInfo: t })) : null;
}, $ = "255, 197, 32", mt = d("div", {
  ul: {
    padding: "1rem"
  },
  li: {
    listStyleType: "disc",
    li: {
      listStyleType: "circle"
    }
  },
  "span.highlight": {
    position: "relative",
    fontWeight: "bold",
    "&::before": {
      top: "0",
      position: "absolute",
      display: "inline",
      content: "",
      width: "calc(100% + 4px)",
      height: "calc(100% + 2px) ",
      marginLeft: "-2px",
      borderRadius: "3px",
      border: `1px solid rgba(${$}, 0.2)`,
      borderBottom: `1px solid rgba(${$}, 0.618)`,
      boxShadow: "1px 1px 1px #6661"
    },
    "&::after": {
      left: "0",
      top: "0",
      position: "absolute",
      display: "inline",
      content: "",
      width: "calc(100% + 4px)",
      height: "calc(100% + 2px) ",
      marginLeft: "-2px",
      marginTop: "-1px",
      borderRadius: "3px",
      backgroundColor: `rgba(${$}, 0.2)`,
      zIndex: -1
    }
  }
}), pt = ({
  searchString: e = "",
  content: t,
  stringLength: n = 150
}) => {
  const a = t.toLowerCase().indexOf(e.toLowerCase());
  if (a !== -1) {
    let o = Math.max(0, a - n / 2), i = Math.min(
      t.length,
      a + e.length + n / 2
    );
    if (o > 0) {
      const l = t.lastIndexOf(" ", o + 1);
      o = l > 0 ? l + 1 : o;
    }
    if (i < t.length) {
      const l = t.indexOf(" ", i - 1);
      i = l > -1 ? l : i;
    }
    t = (o > 0 ? "... " : "") + t.substring(o, i) + (i < t.length ? " ..." : "");
  } else
    t = t.substring(0, n) + "...";
  return t;
}, te = ({
  body: e,
  stringLength: t,
  type: n = "content"
}) => {
  const { state: a } = S(w), { searchString: o } = a;
  let i = String(e.value);
  n == "snippet" && (i = pt({
    searchString: o,
    content: i,
    stringLength: t
  }));
  let l;
  const u = se(i);
  if (e.format === "text/plain") {
    const g = /\n/g;
    l = i == null ? void 0 : i.replace(g, "<br />");
  }
  if (e.format === "text/markdown" && (l = u == null ? void 0 : u.html), e.format === "text/html" && (l = i), o && l) {
    const g = new RegExp(`(${o})`, "gi");
    l = l == null ? void 0 : l.replace(
      g,
      (h) => `<span class="highlight">${h}</span>`
    );
  }
  const s = [e.id, n].join("-"), p = ["ar"].includes(String(e.language)), m = p ? "rtl" : "ltr", c = p ? "1.3em" : "1em";
  return l ? /* @__PURE__ */ r.createElement(
    mt,
    {
      dangerouslySetInnerHTML: { __html: l },
      "data-body-id": s,
      "data-testid": "scroll-item-body",
      id: s,
      dir: m,
      css: { fontSize: c }
    }
  ) : null;
}, ht = ({
  hasItemBreak: e,
  isLastItem: t,
  item: n,
  itemCount: a,
  itemNumber: o
}) => {
  var c;
  const { state: i } = r.useContext(w), { annotations: l, vault: u } = i, s = u == null ? void 0 : u.get(n), p = (c = l == null ? void 0 : l.filter((g) => g.target === n.id)) == null ? void 0 : c.map((g) => {
    var h;
    return (h = g == null ? void 0 : g.body) == null ? void 0 : h.map((f, E) => /* @__PURE__ */ r.createElement(
      te,
      {
        body: f,
        key: E
      }
    ));
  }), m = {
    current: o,
    total: a
  };
  return /* @__PURE__ */ r.createElement(
    Le,
    {
      "data-page-break": e,
      "data-page-number": o,
      "data-last-item": t
    },
    /* @__PURE__ */ r.createElement(Y, null, s && /* @__PURE__ */ r.createElement(ut, { canvas: s, canvasInfo: m })),
    /* @__PURE__ */ r.createElement(Ae, null, (s == null ? void 0 : s.label) && /* @__PURE__ */ r.createElement("strong", null, /* @__PURE__ */ r.createElement(O, { label: s == null ? void 0 : s.label }), " ", `(${m.current} / ${m.total})`), /* @__PURE__ */ r.createElement("div", null, p || /* @__PURE__ */ r.createElement("p", null, "[Blank]")), e && /* @__PURE__ */ r.createElement(_e, { "aria-label": "Page Break" }))
  );
}, gt = r.memo(ht), z = "255, 197, 32", ft = d("span", {
  fontWeight: "700"
}), xt = d("div", {
  display: "flex",
  gap: "0.25rem"
}), vt = d("div", {
  fontSize: "0.9rem",
  padding: "1rem 0.618rem"
}), wt = d("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  hr: {
    margin: "0.618rem",
    border: "none",
    borderBottom: "1px solid #6662"
  },
  button: {
    backgroundColor: "#6660",
    opacity: "0.7",
    transition: "$all",
    padding: "0.5rem 0.618rem",
    fontSize: "0.9rem",
    lineHeight: "1.1rem",
    textAlign: "left",
    borderRadius: "6px",
    border: "1px solid #6662",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    "&:hover": {
      opacity: "1",
      boxShadow: "5px 5px 13px #6662"
    },
    "&[data-result=true]": {
      backgroundColor: `rgba(${z}, 0.2)`,
      borderColor: `rgba(${z}, 0.2)`,
      opacity: "1",
      "&:hover": {
        backgroundColor: `rgba(${z}, 0.2)`
      }
    }
  }
}), re = d("input", {
  margin: "0",
  padding: "0 1rem 0 2rem",
  background: "none",
  zIndex: "2",
  height: "2rem",
  marginLeft: "1rem",
  marginTop: "1rem",
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
  fontSize: "1rem",
  borderRadius: "2rem",
  fontFamily: "inherit",
  backgroundColor: "$primary",
  border: "none",
  color: "$secondary",
  cursor: "text",
  filter: "drop-shadow(2px 2px 5px #0003)",
  transition: "$all",
  boxSizing: "content-box !important",
  flexGrow: "0",
  width: "100%",
  "&:placeholder": {
    color: "inherit"
  }
}), ne = d("span", {
  position: "absolute",
  zIndex: "3",
  width: "2rem",
  height: "2rem",
  padding: "8px",
  marginTop: "1rem",
  marginLeft: "1rem",
  color: "$secondary",
  fill: "$secondary",
  stroke: "$secondary",
  transition: "$all",
  cursor: "text"
}), yt = d("button", {
  opacity: "1",
  display: "flex",
  alignItems: "center",
  borderRadius: "2rem",
  width: "2rem",
  height: "2rem",
  alignSelf: "center",
  marginTop: "1rem",
  gap: "0.35rem",
  backgroundColor: "$accent",
  fill: "$secondary",
  flexShrink: "0",
  svg: {
    padding: "6px",
    color: "inherit",
    fill: "inherit"
  },
  '&[aria-disabled="true"]': {
    opacity: "0",
    display: "none"
  }
}), St = d("form", {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  width: "100%",
  variants: {
    isPanelExpanded: {
      true: {
        [`${ne}`]: {
          marginLeft: "0"
        },
        [`& ${re}`]: {
          marginLeft: "0",
          backgroundColor: "$primary",
          width: "auto",
          flexGrow: "1"
          //
        }
      },
      false: {
        //
      }
    }
  }
}), Et = d("div", {}), N = ({
  annotation: e,
  isResult: t
}) => {
  var o, i;
  const n = [(o = e == null ? void 0 : e.body) == null ? void 0 : o.id, "content"].join("-"), a = (l) => {
    var u;
    l && ((u = document.getElementById(l)) == null || u.scrollIntoView({ behavior: "smooth" }));
  };
  return /* @__PURE__ */ r.createElement(
    "button",
    {
      "data-result": t ? "true" : "false",
      onClick: () => a(n),
      key: n
    },
    /* @__PURE__ */ r.createElement(xt, null, /* @__PURE__ */ r.createElement(ft, null, e.motivation), /* @__PURE__ */ r.createElement("span", null, (i = e == null ? void 0 : e.body) == null ? void 0 : i.language)),
    /* @__PURE__ */ r.createElement(
      te,
      {
        body: e.body,
        stringLength: 144,
        type: "snippet"
      }
    )
  );
}, bt = ({
  results: e
}) => /* @__PURE__ */ r.createElement(wt, null, e.found.map((t) => /* @__PURE__ */ r.createElement(
  N,
  {
    annotation: t,
    isResult: !0,
    key: t.id
  }
)), /* @__PURE__ */ r.createElement("hr", null), e.notFound.map((t) => /* @__PURE__ */ r.createElement(
  N,
  {
    annotation: t,
    key: t.id
  }
))), Ct = {
  charset: "latin:extra, arabic:extra, cyrillic:extra, cjk:extra",
  optimize: !0,
  tokenize: "full",
  resolution: 9,
  document: {
    id: "id",
    index: "content"
  }
}, It = () => {
  var s;
  const { state: e } = S(w), { annotations: t, searchString: n = "" } = e, a = new ce.Document(Ct), o = [];
  t == null || t.forEach((p) => {
    var m;
    (m = p == null ? void 0 : p.body) == null || m.forEach((c) => {
      var h;
      const g = (h = c == null ? void 0 : c.value) == null ? void 0 : h.replace(/\n/g, "");
      o.push(c == null ? void 0 : c.id), a.add({
        id: c == null ? void 0 : c.id,
        content: g
      });
    });
  });
  function i(p) {
    return p.map((m) => t == null ? void 0 : t.filter((c) => c.body.find((g) => g.id === m)).map((c) => {
      const g = c.body.findIndex((h) => h.id === m);
      return {
        ...c,
        body: c.body[g]
      };
    }).shift());
  }
  const l = a == null ? void 0 : a.search(n).reduce((p, m) => [.../* @__PURE__ */ new Set([...p, ...m.result])], []), u = {
    found: i(l),
    notFound: i(
      o.filter((p) => !l.includes(p))
    )
  };
  return /* @__PURE__ */ r.createElement(Et, null, n && /* @__PURE__ */ r.createElement(vt, null, (s = u.found) == null ? void 0 : s.length, " results for ", /* @__PURE__ */ r.createElement("strong", null, n)), /* @__PURE__ */ r.createElement(bt, { results: u }));
}, kt = () => /* @__PURE__ */ r.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ r.createElement("title", null, "Search"), /* @__PURE__ */ r.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })), $t = () => /* @__PURE__ */ r.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ r.createElement("title", null, "Close"), /* @__PURE__ */ r.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })), zt = ({
  togglePanel: e,
  isPanelExpanded: t
}) => {
  const { dispatch: n, state: a } = S(w), { searchString: o } = a, i = P(null), l = () => i.current === document.activeElement && e(!0), u = () => {
    var h;
    return (h = i == null ? void 0 : i.current) == null ? void 0 : h.focus();
  }, s = () => {
    var h;
    (h = i.current) == null || h.blur(), p(), e(!1), n({
      payload: "",
      type: "updateSearchString"
    });
  }, p = () => {
    i.current && (i.current.value = "");
  }, m = (h) => {
    h.preventDefault(), s();
  }, c = (h) => {
    h.key === "Escape" && (h.preventDefault(), s());
  };
  x(() => (document == null || document.addEventListener("keydown", c), () => {
    document == null || document.removeEventListener("keydown", c);
  }), []), x(() => {
    if (i != null && i.current)
      return i.current.addEventListener("focus", l), i.current.addEventListener("blur", l), () => {
        i.current && (i.current.removeEventListener("focus", l), i.current.removeEventListener("blur", l));
      };
  }, []);
  const g = (h) => {
    var f;
    n({
      payload: (f = h == null ? void 0 : h.target) == null ? void 0 : f.value,
      type: "updateSearchString"
    });
  };
  return /* @__PURE__ */ r.createElement(
    St,
    {
      id: "scroll-search",
      autoComplete: "off",
      isPanelExpanded: t
    },
    /* @__PURE__ */ r.createElement(ne, { onClick: u }, /* @__PURE__ */ r.createElement(kt, null)),
    /* @__PURE__ */ r.createElement(
      re,
      {
        ref: i,
        name: "clover-search",
        type: "text",
        placeholder: "Search...",
        defaultValue: o,
        onChange: g
      }
    ),
    /* @__PURE__ */ r.createElement(
      yt,
      {
        "aria-disabled": !t,
        "aria-label": "Close search panel",
        onClick: m,
        disabled: !t
      },
      /* @__PURE__ */ r.createElement($t, null)
    )
  );
}, Lt = d("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "0",
  position: "relative",
  zIndex: "1",
  maxWidth: "100%",
  marginTop: "1rem",
  transition: "$all",
  variants: {
    isPanelExpanded: {
      true: {
        zIndex: 1,
        opacity: 1,
        transform: "translateX(0)"
      },
      false: {
        zIndex: -1,
        opacity: 0,
        transform: "translateX(-2.618rem)",
        transitionDelay: "0",
        transition: "none"
      }
    }
  }
}), At = (e) => {
  const [t, n] = C({ top: 0, left: 0 });
  return x(() => {
    const a = () => {
      if (e.current) {
        const o = e.current.getBoundingClientRect();
        n({
          top: o.top,
          left: o.left
        });
      }
    };
    return window.addEventListener("scroll", a), window.addEventListener("resize", a), a(), () => {
      window.removeEventListener("scroll", a), window.removeEventListener("resize", a);
    };
  }, [e]), t;
}, _t = ({
  isPanelExpanded: e,
  handlePanel: t
}) => {
  var g;
  const n = P(null), { state: a } = S(w), { options: o } = a, { offset: i } = o, { top: l } = At(n), u = l ? l < i : !1, s = (g = n == null ? void 0 : n.current) == null ? void 0 : g.offsetWidth, p = s && s * 0.5, m = p ? p - 315 : 180, c = {
    top: u ? i : 0,
    width: `calc(${p}px - 1.318rem)`,
    maxWidth: e ? "100%" : `${m}px`,
    minWidth: "130px"
  };
  return /* @__PURE__ */ r.createElement(
    Ie,
    {
      ref: n,
      className: u ? "anchor" : "",
      "data-testid": "scroll-panel"
    },
    /* @__PURE__ */ r.createElement(_, { style: c }, /* @__PURE__ */ r.createElement(
      zt,
      {
        togglePanel: t,
        isPanelExpanded: e
      }
    ), /* @__PURE__ */ r.createElement(
      Lt,
      {
        "data-testid": "scroll-panel-results",
        "data-panel-expanded": e,
        isPanelExpanded: e
      },
      e && /* @__PURE__ */ r.createElement(It, null)
    ))
  );
}, Bt = ({ items: e }) => {
  const [t, n] = C(!1), a = (o) => n(o);
  return /* @__PURE__ */ r.createElement(r.Fragment, null, /* @__PURE__ */ r.createElement(
    _t,
    {
      isPanelExpanded: t,
      handlePanel: a
    }
  ), /* @__PURE__ */ r.createElement(Be, { "data-figures-visible": !t }, e.map((o, i) => {
    const l = i + 1, u = l === e.length;
    return /* @__PURE__ */ r.createElement(
      gt,
      {
        item: o,
        hasItemBreak: l < e.length,
        isLastItem: u,
        key: o.id,
        itemCount: e.length,
        itemNumber: l
      }
    );
  })));
}, Pt = (e, t) => {
  const [n, a] = C([]);
  return x(() => {
    if (!t)
      return;
    const o = [];
    e == null || e.forEach((l) => {
      var s;
      const u = t.get(l);
      (s = u == null ? void 0 : u.annotations) == null || s.forEach(
        (p) => {
          var c;
          const m = t.get(p);
          (c = m == null ? void 0 : m.items) == null || c.forEach(
            (g) => {
              var f;
              const h = t.get(g);
              h && o.push({
                ...h,
                body: (f = h == null ? void 0 : h.body) == null ? void 0 : f.map((E) => t.get(E))
              });
            }
          );
        }
      );
    });
    const i = o.reduce(
      (l, u) => (l.some((s) => s.id === u.id) || l.push(u), l),
      []
    );
    a(i);
  }, [e, t]), n;
}, Mt = ({ iiifContent: e }) => {
  const [t, n] = C(), { state: a, dispatch: o } = S(w), { vault: i } = a, l = Pt(t == null ? void 0 : t.items, i);
  return x(() => {
    i && i.load(e).then((u) => u && n(u)).catch(
      (u) => console.error(`Manifest ${e} failed to load: ${u}`)
    );
  }, [e, i]), x(() => {
    o({
      type: "updateAnnotations",
      payload: l
    });
  }, [l, o]), t ? /* @__PURE__ */ r.createElement($e, null, t.label && /* @__PURE__ */ r.createElement(ze, { label: t.label }), t.items && /* @__PURE__ */ r.createElement(Bt, { items: t.items })) : null;
}, qt = ({
  iiifContent: e,
  options: t
}) => /* @__PURE__ */ r.createElement(ue, { options: t }, /* @__PURE__ */ r.createElement(Mt, { iiifContent: e }));
export {
  qt as default
};
//# sourceMappingURL=index.mjs.map
