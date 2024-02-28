import t, { useReducer as ut, useState as S, useEffect as w, useRef as pt, useCallback as Y, createContext as ft, useContext as ht, cloneElement as gt, Fragment as vt, useLayoutEffect as yt } from "react";
import { Vault as le } from "@iiif/vault";
import * as me from "@radix-ui/react-collapsible";
import j from "openseadragon";
import { ErrorBoundary as xt } from "react-error-boundary";
import { createStitches as bt, createTheme as Et } from "@stitches/react";
import * as K from "@radix-ui/react-tabs";
import { v4 as Me } from "uuid";
import * as Q from "@radix-ui/react-radio-group";
import { parse as wt } from "node-webvtt";
import * as te from "@radix-ui/react-form";
import St from "sanitize-html";
import z from "hls.js";
import * as G from "@radix-ui/react-popover";
import * as q from "@radix-ui/react-select";
import { SelectValue as Ct, SelectIcon as kt, SelectPortal as It, SelectScrollUpButton as $t, SelectViewport as At, SelectGroup as Tt, SelectScrollDownButton as Mt, SelectItemText as Lt, SelectItemIndicator as zt } from "@radix-ui/react-select";
import * as Le from "@radix-ui/react-switch";
const Rt = (e) => {
  const n = e.toString().split(":"), r = Math.ceil(parseInt(n[0])), o = Math.ceil(parseInt(n[1])), a = Ot(Math.ceil(parseInt(n[2])), 2);
  let l = `${r !== 0 && o < 10 ? (o + "").padStart(2, "0") : o}:${a}`;
  return r !== 0 && (l = `${r}:${l}`), l;
}, ze = (e) => {
  const n = new Date(e * 1e3).toISOString().substr(11, 8);
  return Rt(n);
}, Re = (e, n) => {
  if (typeof e != "object" || e === null)
    return n;
  for (const r in n)
    typeof n[r] == "object" && n[r] !== null && !Array.isArray(n[r]) ? (e[r] || (e[r] = {}), e[r] = Re(e[r], n[r])) : e[r] = n[r];
  return e;
}, Oe = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, Ot = (e, n) => String(e).padStart(n, "0"), X = {
  annotationOverlays: {
    backgroundColor: "#ff6666",
    borderColor: "#990000",
    borderType: "solid",
    borderWidth: "1px",
    opacity: "0.5",
    renderOverlays: !0,
    zoomLevel: 2
  },
  background: "transparent",
  canvasBackgroundColor: "#6662",
  canvasHeight: "61.8vh",
  contentSearch: {
    searchResultsLimit: 20
  },
  ignoreCaptionLabels: [],
  informationPanel: {
    open: !0,
    renderAbout: !0,
    renderSupplementing: !0,
    renderToggle: !0,
    renderAnnotation: !0,
    renderContentSearch: !0
  },
  openSeadragon: {},
  requestHeaders: { "Content-Type": "application/json" },
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
var Te;
const ee = {
  activeCanvas: "",
  activeManifest: "",
  collection: {},
  configOptions: X,
  customDisplays: [],
  informationOpen: (Te = X == null ? void 0 : X.informationPanel) == null ? void 0 : Te.open,
  isLoaded: !1,
  vault: new le(),
  contentSearchVault: new le(),
  openSeadragonViewer: null
}, Fe = t.createContext(ee), Ve = t.createContext(ee);
function Ft(e, n) {
  switch (n.type) {
    case "updateActiveCanvas":
      return n.canvasId || (n.canvasId = ""), {
        ...e,
        activeCanvas: n.canvasId
      };
    case "updateActiveManifest":
      return {
        ...e,
        activeManifest: n.manifestId
      };
    case "updateCollection":
      return {
        ...e,
        collection: n.collection
      };
    case "updateConfigOptions":
      return {
        ...e,
        configOptions: Re(e.configOptions, n.configOptions)
      };
    case "updateInformationOpen":
      return {
        ...e,
        informationOpen: n.informationOpen
      };
    case "updateIsLoaded":
      return {
        ...e,
        isLoaded: n.isLoaded
      };
    case "updateOpenSeadragonViewer":
      return {
        ...e,
        openSeadragonViewer: n.openSeadragonViewer
      };
    default:
      throw new Error(`Unhandled action type: ${n.type}`);
  }
}
const Vt = ({
  initialState: e = ee,
  children: n
}) => {
  const [r, o] = ut(Ft, e);
  return /* @__PURE__ */ t.createElement(Fe.Provider, { value: r }, /* @__PURE__ */ t.createElement(
    Ve.Provider,
    {
      value: o
    },
    n
  ));
};
function $() {
  const e = t.useContext(Fe);
  if (e === void 0)
    throw new Error("useViewerState must be used within a ViewerProvider");
  return e;
}
function P() {
  const e = t.useContext(Ve);
  if (e === void 0)
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  return e;
}
const Ht = (e, n) => {
  const r = e.get({
    id: n,
    type: "Canvas"
  });
  return !(r != null && r.annotations) || !r.annotations[0] ? [] : e.get(r.annotations).filter((a) => !a.items || !a.items.length ? !1 : a).map((a) => {
    const i = a.label || { none: ["Annotations"] };
    return { ...a, label: i };
  });
}, He = async (e, n, r) => {
  let o;
  try {
    o = await e.load(n);
  } catch {
    return console.log("Could not load content search."), {};
  }
  return o.label == null && (o.label = { none: [r] }), o;
}, Be = (e, n, r, o) => {
  var l, s;
  const a = {
    canvas: void 0,
    accompanyingCanvas: void 0,
    annotationPage: void 0,
    annotations: []
  }, i = (d) => {
    if (d) {
      if (!d.body || !d.motivation) {
        console.error(
          "Invalid annotation after Hyperion parsing: missing either 'body' or 'motivation'",
          d
        );
        return;
      }
      let c = d.body;
      Array.isArray(c) && (c = c[0]);
      const h = e.get(c.id);
      if (!h)
        return;
      switch (r) {
        case "painting":
          return d.target === n.id && d.motivation && d.motivation[0] === "painting" && o.includes(h.type) && (d.body = h), !!d;
        case "supplementing":
          return;
        default:
          throw new Error("Invalid annotation motivation.");
      }
    }
  };
  if (a.canvas = e.get(n), a.canvas && (a.annotationPage = e.get(a.canvas.items[0]), a.accompanyingCanvas = (l = a.canvas) != null && l.accompanyingCanvas ? e.get((s = a.canvas) == null ? void 0 : s.accompanyingCanvas) : void 0), a.annotationPage) {
    const d = e.get(a.annotationPage.items).map((h) => ({
      body: e.get(h.body[0].id),
      motivation: h.motivation,
      type: "Annotation"
    })), c = [];
    d.forEach((h) => {
      h.body.type === "Choice" ? h.body.items.forEach(
        (m) => c.push({
          ...h,
          id: m.id,
          body: e.get(m.id)
        })
      ) : c.push(h);
    }), a.annotations = c.filter(i);
  }
  return a;
}, W = (e, n = "en") => {
  if (!e)
    return "";
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return e[n];
}, J = (e, n) => {
  const r = Be(
    e,
    { id: n, type: "Canvas" },
    "painting",
    ["Image", "Sound", "Video"]
  );
  if (r.annotations.length !== 0 && r.annotations && r.annotations)
    return r.annotations.map(
      (o) => o == null ? void 0 : o.body
    );
}, Bt = (e, n, r, o) => {
  const a = [];
  if (n.canvas && n.canvas.thumbnail.length > 0) {
    const s = e.get(
      n.canvas.thumbnail[0]
    );
    a.push(s);
  }
  if (n.annotations[0]) {
    if (n.annotations[0].thumbnail && n.annotations[0].thumbnail.length > 0) {
      const d = e.get(
        n.annotations[0].thumbnail[0]
      );
      a.push(d);
    }
    if (!n.annotations[0].body)
      return;
    const s = n.annotations[0].body;
    s.type === "Image" && a.push(s);
  }
  return a.length === 0 ? void 0 : {
    id: a[0].id,
    format: a[0].format,
    type: a[0].type,
    width: r,
    height: o
  };
};
let H = window.OpenSeadragon;
if (!H && (H = j, !H))
  throw new Error("OpenSeadragon is missing.");
const xe = "http://www.w3.org/2000/svg";
H.Viewer && (H.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new ue(this), this._svgOverlayInfo);
});
const ue = function(e) {
  const n = this;
  this._viewer = e, this._containerWidth = 0, this._containerHeight = 0, this._svg = document.createElementNS(xe, "svg"), this._svg.style.position = "absolute", this._svg.style.left = 0, this._svg.style.top = 0, this._svg.style.width = "100%", this._svg.style.height = "100%", this._viewer.canvas.appendChild(this._svg), this._node = document.createElementNS(xe, "g"), this._svg.appendChild(this._node), this._viewer.addHandler("animation", function() {
    n.resize();
  }), this._viewer.addHandler("open", function() {
    n.resize();
  }), this._viewer.addHandler("rotate", function() {
    n.resize();
  }), this._viewer.addHandler("flip", function() {
    n.resize();
  }), this._viewer.addHandler("resize", function() {
    n.resize();
  }), this.resize();
};
ue.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new H.Point(0, 0), !0), n = this._viewer.viewport.getZoom(!0), r = this._viewer.viewport.getRotation(), o = this._viewer.viewport.getFlip(), a = this._viewer.viewport._containerInnerSize.x;
    let i = a * n;
    const l = i;
    o && (i = -i, e.x = -e.x + a), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + i + "," + l + ") rotate(" + r + ")"
    );
  },
  // ----------
  onClick: function(e, n) {
    new H.MouseTracker({
      element: e,
      clickHandler: n
    }).setTracking(!0);
  }
};
const Pt = (e) => new ue(e), pe = (e) => {
  var r, o;
  let n = {
    id: typeof e == "string" ? e : e.source
  };
  if (typeof e == "string") {
    if (e.includes("#xywh=")) {
      const a = e.split("#xywh=");
      if (a && a[1]) {
        const [i, l, s, d] = a[1].split(",").map((c) => Number(c));
        n = {
          id: a[0],
          rect: {
            x: i,
            y: l,
            w: s,
            h: d
          }
        };
      }
    } else if (e.includes("#t=")) {
      const a = e.split("#t=");
      a && a[1] && (n = {
        id: a[0],
        t: a[1]
      });
    }
  } else
    typeof e == "object" && (((r = e.selector) == null ? void 0 : r.type) === "PointSelector" ? n = {
      id: e.source,
      point: {
        x: e.selector.x,
        y: e.selector.y
      }
    } : ((o = e.selector) == null ? void 0 : o.type) === "SvgSelector" && (n = {
      id: e.source,
      svg: e.selector.value
    }));
  return n;
};
function se(e, n, r, o, a) {
  if (!e)
    return;
  const i = 1 / n.width;
  o.forEach((l) => {
    if (!l.target)
      return;
    const s = pe(l.target), { point: d, rect: c, svg: h } = s;
    if (c) {
      const { x: m, y, w: p, h: v } = c;
      _t(
        e,
        m * i,
        y * i,
        p * i,
        v * i,
        r,
        a
      );
    }
    if (d) {
      const { x: m, y } = d, p = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${m}" cy="${y}" r="20" />
        </svg>
      `;
      be(e, p, r, i, a);
    }
    h && be(e, h, r, i, a);
  });
}
function Pe(e, n, r) {
  let o, a, i = 40, l = 40;
  n.rect && (o = n.rect.x, a = n.rect.y, i = n.rect.w, l = n.rect.h), n.point && (o = n.point.x, a = n.point.y);
  const s = 1 / e.width;
  return new j.Rect(
    o * s - i * s / 2 * (r - 1),
    a * s - l * s / 2 * (r - 1),
    i * s * r,
    l * s * r
  );
}
function _t(e, n, r, o, a, i, l) {
  const s = new j.Rect(n, r, o, a), d = document.createElement("div");
  if (i.annotationOverlays) {
    const { backgroundColor: c, opacity: h, borderType: m, borderColor: y, borderWidth: p } = i.annotationOverlays;
    d.style.backgroundColor = c, d.style.opacity = h, d.style.border = `${m} ${p} ${y}`, d.className = l;
  }
  e.addOverlay(d, s);
}
function Wt(e) {
  if (!e)
    return null;
  const n = document.createElement("template");
  return n.innerHTML = e.trim(), n.content.children[0];
}
function be(e, n, r, o, a) {
  const i = Wt(n);
  if (i)
    for (const l of i.children)
      _e(e, l, r, o, a);
}
function _e(e, n, r, o, a) {
  var i;
  if (n.nodeName === "#text")
    Dt(n);
  else {
    const l = Nt(n, r, o), s = Pt(e);
    s.node().append(l), (i = s._svg) == null || i.setAttribute("class", a), n.childNodes.forEach((d) => {
      _e(e, d, r, o, a);
    });
  }
}
function Nt(e, n, r) {
  var d, c, h, m;
  let o = !1, a = !1, i = !1, l = !1;
  const s = document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.nodeName
  );
  if (e.attributes.length > 0)
    for (let y = 0; y < e.attributes.length; y++) {
      const p = e.attributes[y];
      switch (p.name) {
        case "fill":
          i = !0;
          break;
        case "stroke":
          o = !0;
          break;
        case "stroke-width":
          a = !0;
          break;
        case "fill-opacity":
          l = !0;
          break;
      }
      s.setAttribute(p.name, p.textContent);
    }
  return o || (s.style.stroke = (d = n.annotationOverlays) == null ? void 0 : d.borderColor), a || (s.style.strokeWidth = (c = n.annotationOverlays) == null ? void 0 : c.borderWidth), i || (s.style.fill = (h = n.annotationOverlays) == null ? void 0 : h.backgroundColor), l || (s.style.fillOpacity = (m = n.annotationOverlays) == null ? void 0 : m.opacity), s.setAttribute("transform", `scale(${r})`), s;
}
function Dt(e) {
  e.textContent && (e.textContent.includes(`
`) || console.log(
    "nodeName:",
    e.nodeName,
    ", textContent:",
    e.textContent,
    ", childNodes.length",
    e.childNodes.length
  ));
}
function jt(e, n) {
  if (!e)
    return;
  n.startsWith(".") || (n = "." + n);
  const r = document.querySelectorAll(n);
  r && r.forEach((o) => e.removeOverlay(o));
}
const ne = 209, Gt = {
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
    accent: `hsl(${ne} 100% 38.2%)`,
    accentMuted: `hsl(${ne} 80% 61.8%)`,
    accentAlt: `hsl(${ne} 80% 30%)`,
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
}, { styled: u, css: Uo, keyframes: he, createTheme: Zo } = bt({
  theme: Gt,
  media: fe
}), qt = u("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}), Ut = u("p", {
  fontWeight: "bold",
  fontSize: "x-large"
}), Zt = u("span", {
  fontSize: "medium"
}), Xt = ({ error: e }) => {
  const { message: n } = e;
  return /* @__PURE__ */ t.createElement(qt, { role: "alert" }, /* @__PURE__ */ t.createElement(Ut, { "data-testid": "headline" }, "Something went wrong"), n && /* @__PURE__ */ t.createElement(Zt, null, `Error message: ${n}`, " "));
}, We = u("div", {
  position: "relative",
  zIndex: "0"
}), Ne = u("div", {
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
  "@sm": {
    flexDirection: "column"
  }
}), De = u("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  width: "61.8%",
  "@sm": {
    width: "100%"
  }
}), je = u(me.Trigger, {
  display: "none",
  border: "none",
  padding: "0",
  transition: "$all",
  opacity: "1",
  background: "#6663",
  margin: "1rem 0",
  borderRadius: "6px",
  "&[data-information-panel='false']": {
    opacity: "0",
    marginTop: "-59px"
  },
  "@sm": {
    display: "flex",
    "> span": {
      display: "flex",
      flexGrow: "1",
      fontSize: "0.8333em",
      justifyContent: "center",
      padding: "0.5rem",
      fontFamily: "inherit"
    }
  }
}), Ge = u(me.Content, {
  width: "100%",
  display: "flex"
}), Jt = u("aside", {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  width: "38.2%",
  maxHeight: "100%",
  "@sm": {
    width: "100%"
  }
}), Yt = u("div", {
  display: "flex",
  flexDirection: "column",
  fontSmooth: "auto",
  webkitFontSmoothing: "antialiased",
  "> div": {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    justifyContent: "flex-start",
    "@sm": {
      [`& ${Ne}`]: {
        flexGrow: "1"
      },
      [`& ${De}`]: {
        flexGrow: "0"
      }
    }
  },
  "@sm": {
    padding: "0"
  },
  "&[data-information-panel-open='true']": {
    "@sm": {
      position: "fixed",
      height: "100%",
      width: "100%",
      top: "0",
      left: "0",
      zIndex: "2500000000",
      [`& ${We}`]: {
        display: "none"
      },
      [`& ${je}`]: {
        margin: "1rem"
      },
      [`& ${Ge}`]: {
        height: "100%"
      }
    }
  }
}), Kt = u(K.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  flexGrow: "1",
  flexShrink: "0",
  position: "relative",
  zIndex: "1",
  maskImage: "linear-gradient(180deg, rgba(0, 0, 0, 1) calc(100% - 2rem), transparent 100%)",
  "@sm": {
    marginTop: "0.5rem",
    boxShadow: "none"
  }
}), Qt = u(K.List, {
  display: "flex",
  flexGrow: "0",
  margin: "0 1.618rem",
  borderBottom: "4px solid #6663",
  "@sm": {
    margin: "0 1rem"
  }
}), re = u(K.Trigger, {
  display: "flex",
  position: "relative",
  padding: "0.5rem 1rem",
  background: "none",
  backgroundColor: "transparent",
  fontFamily: "inherit",
  border: "none",
  opacity: "0.7",
  fontSize: "1rem",
  marginRight: "1rem",
  lineHeight: "1rem",
  whiteSpace: "nowrap",
  cursor: "pointer",
  fontWeight: 400,
  transition: "$all",
  "&::after": {
    width: "0",
    height: "4px",
    content: "",
    position: "absolute",
    bottom: "-4px",
    left: "0",
    transition: "$all"
  },
  "&[data-state='active']": {
    opacity: "1",
    fontWeight: 700,
    "&::after": {
      width: "100%",
      backgroundColor: "$accent"
    }
  }
}), oe = u(K.Content, {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  position: "absolute",
  top: "0",
  left: "0",
  "&[data-state='active']": {
    width: "100%",
    height: "calc(100% - 2rem)",
    padding: "1.618rem 0"
  }
}), en = u("div", {
  position: "relative",
  height: "100%",
  width: "100%",
  overflowY: "scroll"
}), qe = {
  position: "relative",
  cursor: "pointer",
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  textAlign: "left",
  margin: "0",
  padding: "0.5rem 1.618rem",
  fontFamily: "inherit",
  lineHeight: "1.25em",
  fontSize: "1rem",
  color: "inherit",
  border: "none",
  background: "none"
}, Ue = u("button", {
  textAlign: "left",
  "&:hover": {
    color: "$accent"
  }
}), tn = u("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), nn = u("div", {
  ...qe
}), rn = u("div", {
  "&:hover": {
    color: "$accent"
  }
}), Ee = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(Ue, { onClick: n }, e), on = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(
  rn,
  {
    dangerouslySetInnerHTML: { __html: e },
    onClick: n
  }
), an = () => {
  function e(a) {
    return a.map((i) => {
      const l = i.identifier || Me();
      return { ...i, identifier: l };
    });
  }
  function n(a) {
    var d;
    const i = [], l = [], s = e(a);
    for (const c of s) {
      for (; l.length > 0 && l[l.length - 1].end <= c.start; )
        l.pop();
      l.length > 0 ? (l[l.length - 1].children || (l[l.length - 1].children = []), (d = l[l.length - 1].children) == null || d.push(c), l.push(c)) : (i.push(c), l.push(c));
    }
    return i;
  }
  function r(a, i = []) {
    return i.some(
      (l) => a.start >= l.start && a.end <= l.end
    );
  }
  function o(a = []) {
    return a.sort((i, l) => i.start - l.start);
  }
  return {
    addIdentifiersToParsedCues: e,
    createNestedCues: n,
    isChild: r,
    orderCuesByTime: o
  };
}, we = he({
  from: { transform: "rotate(360deg)" },
  to: { transform: "rotate(0deg)" }
}), ln = u(Q.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), Ze = u(Q.Item, {
  ...qe,
  "@sm": {
    padding: "0.5rem 1rem",
    fontSize: "0.8333rem"
  },
  "&::before": {
    content: "",
    width: "12px",
    height: "12px",
    borderRadius: "12px",
    position: "absolute",
    backgroundColor: "$primaryMuted",
    opacity: "0",
    left: "8px",
    marginTop: "3px",
    boxSizing: "content-box",
    "@sm": {
      content: "unset"
    }
  },
  "&::after": {
    content: "",
    width: "4px",
    height: "6px",
    position: "absolute",
    backgroundColor: "$secondary",
    opacity: "0",
    clipPath: "polygon(100% 50%, 0 100%, 0 0)",
    left: "13px",
    marginTop: "6px",
    boxSizing: "content-box",
    "@sm": {
      content: "unset"
    }
  },
  strong: {
    marginLeft: "1rem"
  },
  "&:hover": {
    color: "$accent",
    "&::before": {
      backgroundColor: "$accent",
      opacity: "1"
    },
    "&::after": {
      content: "",
      width: "4px",
      height: "6px",
      position: "absolute",
      backgroundColor: "$secondary",
      clipPath: "polygon(100% 50%, 0 100%, 0 0)",
      opacity: "1"
    }
  },
  "&[aria-checked='true']": {
    backgroundColor: "#6663",
    "&::before": {
      content: "",
      width: "6px",
      height: "6px",
      position: "absolute",
      backgroundColor: "transparent",
      border: "3px solid $accentMuted",
      borderRadius: "12px",
      left: "8px",
      marginTop: "4px",
      opacity: "1",
      animation: "1s linear infinite",
      animationName: we,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    },
    "&::after": {
      content: "",
      width: "6px",
      height: "6px",
      position: "absolute",
      backgroundColor: "transparent",
      border: "3px solid $accent",
      clipPath: "polygon(100% 0, 100% 100%, 0 0)",
      borderRadius: "12px",
      left: "8px",
      marginTop: "4px",
      opacity: "1",
      animation: "1.5s linear infinite",
      animationName: we,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    }
  }
}), sn = ({ label: e, start: n, end: r }) => {
  const [o, a] = S(!1), i = document.getElementById(
    "clover-iiif-video"
  );
  w(() => (i == null || i.addEventListener("timeupdate", () => {
    const { currentTime: s } = i;
    a(n <= s && s < r);
  }), () => document.removeEventListener("timeupdate", () => {
  })), [r, n, i]);
  const l = () => {
    i && (i.pause(), i.currentTime = n, i.play());
  };
  return /* @__PURE__ */ t.createElement(
    Ze,
    {
      "aria-checked": o,
      "data-testid": "information-panel-cue",
      onClick: l,
      value: e
    },
    e,
    /* @__PURE__ */ t.createElement("strong", null, ze(n))
  );
}, cn = u("ul", {
  listStyle: "none",
  paddingLeft: "1rem",
  position: "relative",
  "&&:first-child": {
    paddingLeft: "0"
  },
  "& li ul": {
    [`& ${Ze}`]: {
      backgroundColor: "unset",
      "&::before": {
        content: "none"
      },
      "&::after": {
        content: "none"
      }
    }
  },
  "&:first-child": {
    margin: "0 0 1.618rem"
  }
}), Xe = ({ items: e }) => /* @__PURE__ */ t.createElement(cn, null, e.map((n) => {
  const { text: r, start: o, end: a, children: i, identifier: l } = n;
  return /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement(sn, { label: r, start: o, end: a }), i && /* @__PURE__ */ t.createElement(Xe, { items: i }));
})), dn = ({
  label: e,
  vttUri: n
}) => {
  const [r, o] = t.useState([]), { createNestedCues: a, orderCuesByTime: i } = an(), [l, s] = t.useState();
  return w(() => {
    n && fetch(n, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json"
      }
    }).then((d) => d.text()).then((d) => {
      const c = wt(d).cues, h = i(c), m = a(h);
      o(m);
    }).catch((d) => {
      console.error(n, d.toString()), s(d);
    });
  }, [n]), /* @__PURE__ */ t.createElement(
    ln,
    {
      "data-testid": "annotation-item-vtt",
      "aria-label": `navigate ${W(e, "en")}`
    },
    l && /* @__PURE__ */ t.createElement("div", { "data-testid": "error-message" }, "Network Error: ", l.toString()),
    /* @__PURE__ */ t.createElement(Xe, { items: r })
  );
}, mn = ({
  caption: e,
  handleClick: n,
  imageUri: r
}) => /* @__PURE__ */ t.createElement(Ue, { onClick: n }, /* @__PURE__ */ t.createElement("img", { src: r, alt: `A visual annotation for ${e}` }), /* @__PURE__ */ t.createElement("span", null, e)), un = ({ annotation: e }) => {
  var p, v;
  const { target: n } = e, r = $(), { openSeadragonViewer: o, vault: a, activeCanvas: i, configOptions: l } = r, s = e.body.map((g) => a.get(g.id)), d = ((p = s.find((g) => g.format)) == null ? void 0 : p.format) || "", c = ((v = s.find((g) => g.value)) == null ? void 0 : v.value) || "", h = a.get({
    id: i,
    type: "Canvas"
  });
  function m() {
    var k;
    if (!n)
      return;
    const g = ((k = l.annotationOverlays) == null ? void 0 : k.zoomLevel) || 1, f = pe(n), { point: x, rect: b, svg: E } = f;
    if (x || b || E) {
      const A = Pe(
        h,
        f,
        g
      );
      o == null || o.viewport.fitBounds(A);
    }
  }
  function y() {
    var g, f;
    switch (d) {
      case "text/plain":
        return /* @__PURE__ */ t.createElement(
          Ee,
          {
            value: c,
            handleClick: m
          }
        );
      case "text/html":
        return /* @__PURE__ */ t.createElement(
          on,
          {
            value: c,
            handleClick: m
          }
        );
      case "text/vtt":
        return /* @__PURE__ */ t.createElement(
          dn,
          {
            label: s[0].label,
            vttUri: s[0].id || ""
          }
        );
      case ((g = d.match(/^image\//)) == null ? void 0 : g.input):
        const x = ((f = s.find((b) => {
          var E;
          return !((E = b.id) != null && E.includes("vault://"));
        })) == null ? void 0 : f.id) || "";
        return /* @__PURE__ */ t.createElement(
          mn,
          {
            caption: c,
            handleClick: m,
            imageUri: x
          }
        );
      default:
        return /* @__PURE__ */ t.createElement(
          Ee,
          {
            value: c,
            handleClick: m
          }
        );
    }
  }
  return /* @__PURE__ */ t.createElement(nn, null, y());
}, pn = ({ annotationPage: e }) => {
  var a;
  const n = $(), { vault: r } = n;
  if (!e || !e.items || ((a = e.items) == null ? void 0 : a.length) === 0)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = e.items.map((i) => r.get(i.id));
  return o ? /* @__PURE__ */ t.createElement(tn, { "data-testid": "annotation-page" }, o == null ? void 0 : o.map((i) => /* @__PURE__ */ t.createElement(un, { key: i.id, annotation: i }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, fn = u("button", {
  textAlign: "left",
  "&:hover": {
    color: "$accent"
  }
}), hn = u("li", {
  margin: "0.25rem 0"
}), gn = u("ol", {
  listStyleType: "auto",
  marginBottom: "1rem",
  listStylePosition: "inside"
}), vn = u("div", {
  marginBottom: "1rem",
  input: {
    background: "#efefef",
    padding: ".25rem"
  }
}), yn = u("div", {
  margin: "0.5rem 1.618rem"
}), xn = u("div", {
  fontWeight: "bold"
}), bn = u("div", {
  marginBottom: "1rem"
}), En = ({
  value: e,
  handleClick: n,
  target: r,
  canvas: o
}) => /* @__PURE__ */ t.createElement(
  fn,
  {
    onClick: n,
    "data-target": r,
    "data-canvas": o
  },
  e
), wn = ({
  annotation: e,
  activeTarget: n,
  setActiveTarget: r
}) => {
  var b;
  const o = P(), a = $(), {
    openSeadragonViewer: i,
    vault: l,
    contentSearchVault: s,
    activeCanvas: d,
    configOptions: c
  } = a, h = l.get({
    id: d,
    type: "Canvas"
  }), y = ((b = e.body.map((E) => s.get(E.id)).find((E) => E.value)) == null ? void 0 : b.value) || "";
  let p;
  e.target && typeof e.target == "string" && (p = e.target);
  let v;
  if (p) {
    const E = p.split("#xywh");
    E.length > 1 && (v = E[0]);
  }
  function g() {
    var L;
    const E = ((L = c.annotationOverlays) == null ? void 0 : L.zoomLevel) || 1, k = pe(p), { point: A, rect: M, svg: C } = k;
    if (A || M || C) {
      const R = Pe(
        h,
        k,
        E
      );
      i == null || i.viewport.fitBounds(R);
    }
  }
  w(() => {
    i && p == n && g();
  }, [i]);
  function f(E) {
    if (!i)
      return;
    const k = JSON.parse(E.target.dataset.target), A = E.target.dataset.canvas;
    d === A ? g() : (o({
      type: "updateActiveCanvas",
      canvasId: A
    }), r(k));
  }
  const x = JSON.stringify(p);
  return /* @__PURE__ */ t.createElement(hn, null, /* @__PURE__ */ t.createElement(
    En,
    {
      target: x,
      canvas: v,
      value: y,
      handleClick: f
    }
  ));
}, Sn = ({ annotationPage: e }) => {
  var m, y, p;
  const n = $(), { contentSearchVault: r, configOptions: o } = n, [a, i] = S(), l = (m = o.contentSearch) == null ? void 0 : m.searchResultsLimit, s = (y = o.localeText) == null ? void 0 : y.contentSearch;
  function d(v) {
    const g = {};
    return v.items.forEach((f) => {
      const x = r.get(
        f.id
      );
      let b = "";
      if (x.label) {
        const E = W(x.label);
        E && (b = E[0]);
      }
      g[b] == null && (g[b] = []), g[b].push(x);
    }), g;
  }
  function c(v) {
    return (l ? v.slice(0, l) : v).map((f, x) => /* @__PURE__ */ t.createElement(
      wn,
      {
        key: x,
        annotation: f,
        activeTarget: a,
        setActiveTarget: i
      }
    ));
  }
  function h(v) {
    if (l) {
      const g = v.length - l;
      if (g > 0)
        return /* @__PURE__ */ t.createElement(bn, null, g, " ", s == null ? void 0 : s.moreResults);
    }
  }
  return !e || !e.items || ((p = e.items) == null ? void 0 : p.length) === 0 ? /* @__PURE__ */ t.createElement("p", null, s == null ? void 0 : s.noSearchResults) : /* @__PURE__ */ t.createElement(t.Fragment, null, Object.entries(d(e)).map(
    ([v, g], f) => /* @__PURE__ */ t.createElement("div", { key: f }, /* @__PURE__ */ t.createElement(xn, { className: "content-search-results-title" }, v), /* @__PURE__ */ t.createElement(gn, { className: "content-search-results" }, c(g)), h(g))
  ));
}, Cn = ({
  searchServiceUrl: e,
  setContentSearchResource: n,
  setLoading: r
}) => {
  var y;
  const [o, a] = S(), i = $(), { contentSearchVault: l, openSeadragonViewer: s, configOptions: d } = i, c = (y = d.localeText) == null ? void 0 : y.contentSearch;
  async function h(p) {
    p.preventDefault();
    const v = c == null ? void 0 : c.tabLabel;
    if (!s)
      return;
    if (!o || o.trim() === "") {
      n({
        label: { none: [v] }
      });
      return;
    }
    r(!0);
    const g = e + "?q=" + o.trim();
    He(l, g, v).then(
      (f) => {
        n(f), r(!1);
      }
    );
  }
  const m = (p) => {
    p.preventDefault(), a(p.target.value);
  };
  return /* @__PURE__ */ t.createElement(vn, null, /* @__PURE__ */ t.createElement(te.Root, { onSubmit: h, className: "content-search-form" }, /* @__PURE__ */ t.createElement(te.Field, { name: "searchTerms", onChange: m }, /* @__PURE__ */ t.createElement(te.Control, { placeholder: c == null ? void 0 : c.formPlaceholder }))));
}, kn = ({
  searchServiceUrl: e,
  setContentSearchResource: n,
  activeCanvas: r,
  annotationPage: o
}) => {
  const [a, i] = S(!1);
  return /* @__PURE__ */ t.createElement(yn, null, /* @__PURE__ */ t.createElement(
    Cn,
    {
      searchServiceUrl: e,
      setContentSearchResource: n,
      activeCanvas: r,
      setLoading: i
    }
  ), !a && /* @__PURE__ */ t.createElement(Sn, { annotationPage: o }), a && /* @__PURE__ */ t.createElement("span", null, "Loading..."));
}, In = u("div", {
  padding: " 0 1.618rem 2rem",
  display: "flex",
  flexDirection: "column",
  overflow: "scroll",
  position: "absolute",
  fontWeight: "400",
  fontSize: "1rem",
  zIndex: "0",
  img: {
    maxWidth: "100px",
    maxHeight: "100px",
    objectFit: "contain",
    color: "transparent",
    margin: "0 0 1rem",
    borderRadius: "3px",
    backgroundColor: "$secondaryMuted"
  },
  video: {
    display: "none"
  },
  "a, a:visited": {
    color: "$accent"
  },
  p: {
    fontSize: "1rem",
    lineHeight: "1.45em",
    margin: "0"
  },
  dl: {
    margin: "0",
    dt: {
      fontWeight: "700",
      margin: "1rem 0 0.25rem"
    },
    dd: {
      margin: "0"
    }
  },
  ".manifest-property-title": {
    fontWeight: "700",
    margin: "1rem 0 0.25rem"
  },
  "ul, ol": {
    padding: "0",
    margin: "0",
    li: {
      fontSize: "1rem",
      lineHeight: "1.45em",
      listStyle: "none",
      margin: "0.25rem 0 0.25rem"
    }
  }
}), $n = u("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Je = (e, n = "none") => {
  if (!e)
    return null;
  if (typeof e == "string")
    return [e];
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return !e[n] || !Array.isArray(e[n]) ? null : e[n];
}, F = (e, n = "none", r = ", ") => {
  const o = Je(e, n);
  return Array.isArray(o) ? o.join(`${r}`) : o;
};
function An(e) {
  return { __html: Tn(e) };
}
function O(e, n) {
  const r = Object.keys(e).filter(
    (a) => n.includes(a) ? null : a
  ), o = new Object();
  return r.forEach((a) => {
    o[a] = e[a];
  }), o;
}
function Tn(e) {
  return St(e, {
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
const Mn = u("span", {}), B = (e) => {
  const { as: n, label: r } = e, a = O(e, ["as", "label"]);
  return /* @__PURE__ */ t.createElement(Mn, { as: n, ...a }, F(r, a.lang));
}, Ln = (e, n = "200,", r = "full") => {
  Array.isArray(e) && (e = e[0]);
  const { id: o, service: a } = e;
  let i;
  if (!a)
    return o;
  if (Array.isArray(e.service) && e.service.length > 0 && (i = a[0]), i) {
    if (i["@id"])
      return `${i["@id"]}/${r}/${n}/0/default.jpg`;
    if (i.id)
      return `${i.id}/${r}/${n}/0/default.jpg`;
  }
}, Se = u("img", { objectFit: "cover" }), zn = (e) => {
  const n = pt(null), { contentResource: r, altAsLabel: o, region: a = "full" } = e;
  let i;
  o && (i = F(o));
  const s = O(e, ["contentResource", "altAsLabel"]), { type: d, id: c, width: h = 200, height: m = 200, duration: y } = r;
  w(() => {
    if (!c && !n.current || ["Image"].includes(d) || !c.includes("m3u8"))
      return;
    const g = new z();
    return n.current && (g.attachMedia(n.current), g.on(z.Events.MEDIA_ATTACHED, function() {
      g.loadSource(c);
    })), g.on(z.Events.ERROR, function(f, x) {
      if (x.fatal)
        switch (x.type) {
          case z.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${f} network error encountered, try to recover`
            ), g.startLoad();
            break;
          case z.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${f} media error encountered, try to recover`
            ), g.recoverMediaError();
            break;
          default:
            g.destroy();
            break;
        }
    }), () => {
      g && (g.detachMedia(), g.destroy());
    };
  }, [c, d]);
  const p = Y(() => {
    if (!n.current)
      return;
    let g = 0, f = 30;
    if (y && (f = y), !c.split("#t=") && y && (g = y * 0.1), c.split("#t=").pop()) {
      const b = c.split("#t=").pop();
      b && (g = parseInt(b.split(",")[0]));
    }
    const x = n.current;
    x.autoplay = !0, x.currentTime = g, setTimeout(() => p(), f * 1e3);
  }, [y, c]);
  w(() => p(), [p]);
  const v = Ln(
    r,
    `${h},${m}`,
    a
  );
  switch (d) {
    case "Image":
      return /* @__PURE__ */ t.createElement(
        Se,
        {
          as: "img",
          alt: i,
          css: { width: h, height: m },
          key: c,
          src: v,
          ...s
        }
      );
    case "Video":
      return /* @__PURE__ */ t.createElement(
        Se,
        {
          as: "video",
          css: { width: h, height: m },
          disablePictureInPicture: !0,
          key: c,
          loop: !0,
          muted: !0,
          onPause: p,
          ref: n,
          src: c
        }
      );
    default:
      return console.warn(
        `Resource type: ${d} is not valid or not yet supported in Primitives.`
      ), /* @__PURE__ */ t.createElement(t.Fragment, null);
  }
}, Rn = u("a", {}), On = (e) => {
  const { children: n, homepage: r } = e, a = O(e, ["children", "homepage"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, r && r.map((i) => {
    const l = F(
      i.label,
      a.lang
    );
    return /* @__PURE__ */ t.createElement(
      Rn,
      {
        "aria-label": n ? l : void 0,
        href: i.id,
        key: i.id,
        ...a
      },
      n || l
    );
  }));
}, Fn = {
  delimiter: ", "
}, ge = ft(void 0), Ye = () => {
  const e = ht(ge);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, ve = ({
  children: e,
  initialState: n = Fn
}) => {
  const r = Vn(n, "delimiter");
  return /* @__PURE__ */ t.createElement(ge.Provider, { value: { delimiter: r } }, e);
}, Vn = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, Hn = u("span", {}), Ce = (e) => {
  const { as: n, markup: r } = e, { delimiter: o } = Ye();
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const i = O(e, ["as", "markup"]), l = An(
    F(r, i.lang, o)
  );
  return /* @__PURE__ */ t.createElement(Hn, { as: n, ...i, dangerouslySetInnerHTML: l });
}, Ke = (e) => t.useContext(ge) ? /* @__PURE__ */ t.createElement(Ce, { ...e }) : /* @__PURE__ */ t.createElement(ve, null, /* @__PURE__ */ t.createElement(Ce, { ...e })), Bn = ({ as: e = "dd", lang: n, value: r }) => /* @__PURE__ */ t.createElement(Ke, { markup: r, as: e, lang: n }), Pn = u("span", {}), _n = ({
  as: e = "dd",
  customValueContent: n,
  lang: r,
  value: o
}) => {
  var l;
  const { delimiter: a } = Ye(), i = (l = Je(o, r)) == null ? void 0 : l.map((s) => gt(n, {
    value: s
  }));
  return /* @__PURE__ */ t.createElement(Pn, { as: e, lang: r }, i == null ? void 0 : i.map((s, d) => [
    d > 0 && `${a}`,
    /* @__PURE__ */ t.createElement(vt, { key: d }, s)
  ]));
}, Qe = (e) => {
  var s;
  const { item: n, lang: r, customValueContent: o } = e, { label: a, value: i } = n, l = (s = F(a)) == null ? void 0 : s.replace(" ", "-").toLowerCase();
  return /* @__PURE__ */ t.createElement("div", { role: "group", "data-label": l }, /* @__PURE__ */ t.createElement(B, { as: "dt", label: a, lang: r }), o ? /* @__PURE__ */ t.createElement(
    _n,
    {
      as: "dd",
      customValueContent: o,
      value: i,
      lang: r
    }
  ) : /* @__PURE__ */ t.createElement(Bn, { as: "dd", value: i, lang: r }));
};
function Wn(e, n) {
  const r = n.filter((o) => {
    const { matchingLabel: a } = o, i = Object.keys(o.matchingLabel)[0], l = F(a, i);
    if (F(e, i) === l)
      return !0;
  }).map((o) => o.Content);
  if (Array.isArray(r))
    return r[0];
}
const Nn = u("dl", {}), Dn = (e) => {
  const { as: n, customValueContent: r, metadata: o } = e;
  if (!Array.isArray(o))
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = Oe(e, "customValueDelimiter"), l = O(e, [
    "as",
    "customValueContent",
    "customValueDelimiter",
    "metadata"
  ]);
  return /* @__PURE__ */ t.createElement(
    ve,
    {
      ...typeof a == "string" ? { initialState: { delimiter: a } } : void 0
    },
    o.length > 0 && /* @__PURE__ */ t.createElement(Nn, { as: n, ...l }, o.map((s, d) => {
      const c = r ? Wn(s.label, r) : void 0;
      return /* @__PURE__ */ t.createElement(
        Qe,
        {
          customValueContent: c,
          item: s,
          key: d,
          lang: l == null ? void 0 : l.lang
        }
      );
    }))
  );
};
u("li", {});
u("ul", {});
const jn = u("dl", {}), Gn = (e) => {
  const { as: n, requiredStatement: r } = e;
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = Oe(e, "customValueDelimiter"), i = O(e, ["as", "customValueDelimiter", "requiredStatement"]);
  return /* @__PURE__ */ t.createElement(
    ve,
    {
      ...typeof o == "string" ? { initialState: { delimiter: o } } : void 0
    },
    /* @__PURE__ */ t.createElement(jn, { as: n, ...i }, /* @__PURE__ */ t.createElement(Qe, { item: r, lang: i.lang }))
  );
}, qn = u("li", {}), Un = u("ul", {}), Zn = (e) => {
  const { as: n, seeAlso: r } = e, a = O(e, ["as", "seeAlso"]);
  return /* @__PURE__ */ t.createElement(Un, { as: n }, r && r.map((i) => {
    const l = F(
      i.label,
      a.lang
    );
    return /* @__PURE__ */ t.createElement(qn, { key: i.id }, /* @__PURE__ */ t.createElement("a", { href: i.id, ...a }, l || i.id));
  }));
}, Xn = (e) => {
  const { as: n, summary: r } = e, a = O(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ t.createElement(Ke, { as: n, markup: r, ...a });
}, et = (e) => {
  const { thumbnail: n, region: r } = e, a = O(e, ["thumbnail"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, n && n.map((i) => /* @__PURE__ */ t.createElement(
    zn,
    {
      contentResource: i,
      key: i.id,
      region: r,
      ...a
    }
  )));
}, Jn = ({
  homepage: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Homepage"), /* @__PURE__ */ t.createElement(On, { homepage: e })), Yn = ({
  id: e,
  htmlLabel: n,
  parent: r = "manifest"
}) => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, n), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank", id: `iiif-${r}-id` }, e)), Kn = ({
  metadata: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Dn, { metadata: e, id: `iiif-${n}-metadata` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), Qn = ({
  requiredStatement: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  Gn,
  {
    requiredStatement: e,
    id: `iiif-${n}-required-statement`
  }
)) : /* @__PURE__ */ t.createElement(t.Fragment, null), er = ({ rights: e }) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Rights"), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank" }, e)) : /* @__PURE__ */ t.createElement(t.Fragment, null), tr = ({ seeAlso: e }) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "See Also"), /* @__PURE__ */ t.createElement(Zn, { seeAlso: e })), nr = ({
  summary: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Xn, { summary: e, as: "p", id: `iiif-${n}-summary` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), rr = ({
  label: e,
  thumbnail: n
}) => (n == null ? void 0 : n.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  et,
  {
    altAsLabel: e || { none: ["resource"] },
    thumbnail: n,
    style: { backgroundColor: "#6663", objectFit: "cover" }
  }
)), or = () => {
  const e = $(), { activeManifest: n, vault: r } = e, [o, a] = S(), [i, l] = S([]), [s, d] = S([]), [c, h] = S([]);
  return w(() => {
    var y, p, v;
    const m = r.get(n);
    a(m), ((y = m.homepage) == null ? void 0 : y.length) > 0 && l(r.get(m.homepage)), ((p = m.seeAlso) == null ? void 0 : p.length) > 0 && d(r.get(m.seeAlso)), ((v = m.thumbnail) == null ? void 0 : v.length) > 0 && h(r.get(m.thumbnail));
  }, [n, r]), o ? /* @__PURE__ */ t.createElement($n, null, /* @__PURE__ */ t.createElement(In, null, /* @__PURE__ */ t.createElement(rr, { thumbnail: c, label: o.label }), /* @__PURE__ */ t.createElement(nr, { summary: o.summary }), /* @__PURE__ */ t.createElement(Kn, { metadata: o.metadata }), /* @__PURE__ */ t.createElement(Qn, { requiredStatement: o.requiredStatement }), /* @__PURE__ */ t.createElement(er, { rights: o.rights }), /* @__PURE__ */ t.createElement(
    Jn,
    {
      homepage: i
    }
  ), /* @__PURE__ */ t.createElement(
    tr,
    {
      seeAlso: s
    }
  ), /* @__PURE__ */ t.createElement(Yn, { id: o.id, htmlLabel: "IIIF Manifest" }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, ar = ({
  activeCanvas: e,
  annotationResources: n,
  searchServiceUrl: r,
  setContentSearchResource: o,
  contentSearchResource: a
}) => {
  const i = $(), {
    configOptions: { informationPanel: l }
  } = i, [s, d] = S(), c = l == null ? void 0 : l.renderAbout, h = l == null ? void 0 : l.renderAnnotation, m = l == null ? void 0 : l.renderContentSearch;
  w(() => {
    s || (m ? d("manifest-content-search") : c ? d("manifest-about") : n && (n == null ? void 0 : n.length) > 0 && !c && d(n[0].id));
  }, [
    e,
    s,
    c,
    m,
    n,
    a
  ]);
  const y = (p) => {
    d(p);
  };
  return /* @__PURE__ */ t.createElement(
    Kt,
    {
      "data-testid": "information-panel",
      defaultValue: s,
      onValueChange: y,
      orientation: "horizontal",
      value: s,
      className: "clover-viewer-information-panel"
    },
    /* @__PURE__ */ t.createElement(Qt, { "aria-label": "select chapter", "data-testid": "information-panel-list" }, m && a && /* @__PURE__ */ t.createElement(re, { value: "manifest-content-search" }, /* @__PURE__ */ t.createElement(B, { label: a.label })), c && /* @__PURE__ */ t.createElement(re, { value: "manifest-about" }, "About"), h && n && n.map((p, v) => /* @__PURE__ */ t.createElement(re, { key: v, value: p.id }, /* @__PURE__ */ t.createElement(B, { label: p.label })))),
    /* @__PURE__ */ t.createElement(en, null, m && a && /* @__PURE__ */ t.createElement(oe, { value: "manifest-content-search" }, /* @__PURE__ */ t.createElement(
      kn,
      {
        searchServiceUrl: r,
        setContentSearchResource: o,
        activeCanvas: e,
        annotationPage: a
      }
    )), c && /* @__PURE__ */ t.createElement(oe, { value: "manifest-about" }, /* @__PURE__ */ t.createElement(or, null)), h && n && n.map((p) => /* @__PURE__ */ t.createElement(oe, { key: p.id, value: p.id }, /* @__PURE__ */ t.createElement(pn, { annotationPage: p }))))
  );
}, tt = u("div", {
  position: "absolute",
  right: "1rem",
  top: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: "1"
}), ir = u("input", {
  flexGrow: "1",
  border: "none",
  backgroundColor: "$secondaryMuted",
  color: "$primary",
  marginRight: "1rem",
  height: "2rem",
  padding: "0 1rem",
  borderRadius: "2rem",
  fontFamily: "inherit",
  fontSize: "1rem",
  lineHeight: "1rem",
  boxShadow: "inset 1px 1px 2px #0003",
  "&::placeholder": {
    color: "$primaryMuted"
  }
}), ae = u("button", {
  display: "flex",
  background: "none",
  border: "none",
  width: "2rem !important",
  height: "2rem !important",
  padding: "0",
  margin: "0",
  fontWeight: "700",
  borderRadius: "2rem",
  backgroundColor: "$accent",
  color: "$secondary",
  cursor: "pointer",
  boxSizing: "content-box !important",
  transition: "$all",
  svg: {
    height: "60%",
    width: "60%",
    padding: "20%",
    fill: "$secondary",
    stroke: "$secondary",
    opacity: "1",
    filter: "drop-shadow(5px 5px 5px #000D)",
    boxSizing: "inherit",
    transition: "$all"
  },
  "&:disabled": {
    backgroundColor: "transparent",
    boxShadow: "none",
    svg: { opacity: "0.25" }
  }
}), lr = u("div", {
  display: "flex",
  marginRight: "0.618rem",
  backgroundColor: "$accentAlt",
  borderRadius: "2rem",
  boxShadow: "5px 5px 5px #0003",
  color: "$secondary",
  alignItems: "center",
  "> span": {
    display: "flex",
    margin: "0 0.5rem",
    fontSize: "0.7222rem"
  }
}), sr = u("div", {
  display: "flex",
  position: "relative",
  zIndex: "1",
  width: "100%",
  padding: "0",
  transition: "$all",
  variants: {
    isToggle: {
      true: {
        paddingTop: "2.618rem",
        [`& ${tt}`]: {
          width: "calc(100% - 2rem)",
          "@sm": {
            width: "calc(100% - 2rem)"
          }
        }
      }
    }
  }
}), cr = (e, n) => {
  w(() => {
    function r(o) {
      o.key === e && n();
    }
    return window.addEventListener("keyup", r), () => window.removeEventListener("keyup", r);
  }, []);
}, dr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Back"), /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M244 400L100 256l144-144M120 256h292"
  }
)), mr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Forward"), /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M268 112l144 144-144 144M392 256H100"
  }
)), ur = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Close"), /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })), pr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })), fr = ({
  handleCanvasToggle: e,
  handleFilter: n,
  activeIndex: r,
  canvasLength: o
}) => {
  const [a, i] = S(!1), [l, s] = S(!1), [d, c] = S(!1);
  w(() => {
    c(r === 0), r === o - 1 ? s(!0) : s(!1);
  }, [r, o]), cr("Escape", () => {
    i(!1), n("");
  });
  const h = () => {
    i((y) => !y), n("");
  }, m = (y) => n(y.target.value);
  return /* @__PURE__ */ t.createElement(sr, { isToggle: a }, /* @__PURE__ */ t.createElement(tt, null, a && /* @__PURE__ */ t.createElement(ir, { autoFocus: !0, onChange: m, placeholder: "Search" }), !a && /* @__PURE__ */ t.createElement(lr, null, /* @__PURE__ */ t.createElement(
    ae,
    {
      onClick: () => e(-1),
      disabled: d,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(dr, null)
  ), /* @__PURE__ */ t.createElement("span", null, r + 1, " of ", o), /* @__PURE__ */ t.createElement(
    ae,
    {
      onClick: () => e(1),
      disabled: l,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(mr, null)
  )), /* @__PURE__ */ t.createElement(ae, { onClick: h, type: "button" }, a ? /* @__PURE__ */ t.createElement(ur, null) : /* @__PURE__ */ t.createElement(pr, null))));
}, hr = u(Q.Root, {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  padding: "1.618rem",
  overflowX: "scroll",
  position: "relative",
  zIndex: "0"
}), gr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M256 112v288M400 256H112"
  }
), vr = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z" }), /* @__PURE__ */ t.createElement("path", { d: "M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z" }), /* @__PURE__ */ t.createElement("path", { d: "M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z" })), yr = () => /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" }), xr = () => /* @__PURE__ */ t.createElement("path", { d: "M416 64H96a64.07 64.07 0 00-64 64v256a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V128a64.07 64.07 0 00-64-64zm-80 64a48 48 0 11-48 48 48.05 48.05 0 0148-48zM96 416a32 32 0 01-32-32v-67.63l94.84-84.3a48.06 48.06 0 0165.8 1.9l64.95 64.81L172.37 416zm352-32a32 32 0 01-32 32H217.63l121.42-121.42a47.72 47.72 0 0161.64-.16L448 333.84z" }), br = () => /* @__PURE__ */ t.createElement("path", { d: "M464 384.39a32 32 0 01-13-2.77 15.77 15.77 0 01-2.71-1.54l-82.71-58.22A32 32 0 01352 295.7v-79.4a32 32 0 0113.58-26.16l82.71-58.22a15.77 15.77 0 012.71-1.54 32 32 0 0145 29.24v192.76a32 32 0 01-32 32zM268 400H84a68.07 68.07 0 01-68-68V180a68.07 68.07 0 0168-68h184.48A67.6 67.6 0 01336 179.52V332a68.07 68.07 0 01-68 68z" }), nt = u("svg", {
  display: "inline-flex",
  variants: {
    isLarge: {
      true: {
        height: "4rem",
        width: "4rem"
      }
    },
    isMedium: {
      true: {
        height: "2rem",
        width: "2rem"
      }
    },
    isSmall: {
      true: {
        height: "1rem",
        width: "1rem"
      }
    }
  }
}), Er = ({ children: e }) => /* @__PURE__ */ t.createElement("title", null, e), T = (e) => /* @__PURE__ */ t.createElement(
  nt,
  {
    ...e,
    "data-testid": "icon-svg",
    role: "img",
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg"
  },
  e.children
);
T.Title = Er;
T.Add = gr;
T.Audio = vr;
T.Close = yr;
T.Image = xr;
T.Video = br;
const wr = he({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), Sr = he({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), rt = u(G.Arrow, {
  fill: "$secondaryAlt"
}), Cr = u(G.Close, {
  position: "absolute",
  right: "0",
  top: "0",
  padding: "0.5rem",
  margin: "0",
  cursor: "pointer",
  border: "none",
  background: "none",
  fill: "inherit",
  "&:hover": {
    opacity: "0.75"
  }
}), kr = u(G.Content, {
  border: "none",
  backgroundColor: "white",
  fill: "inhrerit",
  padding: "1rem 2rem 1rem 1rem",
  width: "auto",
  minWidth: "200px",
  maxWidth: "350px",
  borderRadius: "3px",
  boxShadow: "5px 5px 13px #0002",
  /**
   * Animate toggle
   */
  animationDuration: "0.3s",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  '&[data-side="top"]': { animationName: Sr },
  '&[data-side="bottom"]': { animationName: wr },
  /**
   *
   */
  '&[data-align="end"]': {
    [`& ${rt}`]: {
      margin: "0 0.7rem"
    }
  }
}), Ir = u(G.Trigger, {
  display: "inline-flex",
  padding: "0.5rem 0",
  margin: "0 0.5rem 0 0",
  cursor: "pointer",
  border: "none",
  background: "none",
  "> button, > span": {
    margin: "0"
  }
}), $r = u(G.Root, {
  boxSizing: "content-box"
}), Ar = (e) => /* @__PURE__ */ t.createElement(Ir, { ...e }, e.children), Tr = (e) => /* @__PURE__ */ t.createElement(kr, { ...e }, /* @__PURE__ */ t.createElement(rt, null), /* @__PURE__ */ t.createElement(Cr, null, /* @__PURE__ */ t.createElement(T, { isSmall: !0 }, /* @__PURE__ */ t.createElement(T.Close, null))), e.children), U = ({ children: e }) => /* @__PURE__ */ t.createElement($r, null, e);
U.Trigger = Ar;
U.Content = Tr;
const ce = u("div", {
  // Reset
  boxSizing: "border-box",
  // Custom
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "5px",
  padding: "$1",
  marginBottom: "$2",
  marginRight: "$2",
  backgroundColor: "$lightGrey",
  color: "$richBlack50",
  textTransform: "uppercase",
  fontSize: "$2",
  objectFit: "contain",
  lineHeight: "1em !important",
  "&:last-child": {
    marginRight: "0"
  },
  [`${nt}`]: {
    position: "absolute",
    left: "$1",
    height: "$3",
    width: "$3"
  },
  variants: {
    isIcon: {
      true: { position: "relative", paddingLeft: "$5" }
    }
  }
}), de = u("span", {
  display: "flex"
}), Mr = u("span", {
  display: "flex",
  width: "1.2111rem",
  height: "0.7222rem"
}), Lr = u("span", {
  display: "inline-flex",
  marginLeft: "5px",
  marginBottom: "-1px"
}), zr = u(Q.Item, {
  display: "flex",
  flexShrink: "0",
  margin: "0 1.618rem 0 0",
  padding: "0",
  cursor: "pointer",
  background: "none",
  border: "none",
  fontFamily: "inherit",
  lineHeight: "1.25em",
  fontSize: "1rem",
  textAlign: "left",
  "&:last-child": {
    marginRight: "1rem"
  },
  figure: {
    margin: "0",
    width: "161.8px",
    "> div": {
      position: "relative",
      display: "flex",
      backgroundColor: "$secondaryAlt",
      width: "inherit",
      height: "100px",
      overflow: "hidden",
      borderRadius: "3px",
      transition: "$all",
      img: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "blur(0)",
        transform: "scale3d(1, 1, 1)",
        transition: "$all",
        color: "transparent"
      },
      [`& ${de}`]: {
        position: "absolute",
        right: "0",
        bottom: "0",
        [`& ${ce}`]: {
          margin: "0",
          paddingLeft: "0",
          fontSize: "0.7222rem",
          backgroundColor: "#000d",
          color: "$secondary",
          fill: "$secondary",
          borderBottomLeftRadius: "0",
          borderTopRightRadius: "0"
        }
      }
    },
    figcaption: {
      marginTop: "0.5rem",
      fontWeight: "400",
      fontSize: "0.8333rem",
      display: "-webkit-box",
      overflow: "hidden",
      MozBoxOrient: "vertical",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: "5",
      "@sm": {
        fontSize: "0.8333rem"
      }
    }
  },
  "&[aria-checked='true']": {
    figure: {
      "> div": {
        backgroundColor: "$primaryAlt",
        "&::before": {
          position: "absolute",
          zIndex: "1",
          color: "$secondaryMuted",
          content: "Active Item",
          textTransform: "uppercase",
          fontWeight: "700",
          fontSize: "0.6111rem",
          letterSpacing: "0.03rem",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          textShadow: "5px 5px 5px #0003"
        },
        img: {
          opacity: "0.3",
          transform: "scale3d(1.1, 1.1, 1.1)",
          filter: "blur(2px)"
        },
        [`& ${de}`]: {
          [`& ${ce}`]: {
            backgroundColor: "$accent"
          }
        }
      }
    },
    figcaption: {
      fontWeight: "700"
    }
  }
}), Rr = ({ type: e }) => {
  switch (e) {
    case "Sound":
      return /* @__PURE__ */ t.createElement(T.Audio, null);
    case "Image":
      return /* @__PURE__ */ t.createElement(T.Image, null);
    case "Video":
      return /* @__PURE__ */ t.createElement(T.Video, null);
    default:
      return /* @__PURE__ */ t.createElement(T.Image, null);
  }
}, Or = ({
  canvas: e,
  canvasIndex: n,
  isActive: r,
  thumbnail: o,
  type: a,
  handleChange: i
}) => /* @__PURE__ */ t.createElement(
  zr,
  {
    "aria-checked": r,
    "data-testid": "media-thumbnail",
    "data-canvas": n,
    onClick: () => i(e.id),
    value: e.id
  },
  /* @__PURE__ */ t.createElement("figure", null, /* @__PURE__ */ t.createElement("div", null, (o == null ? void 0 : o.id) && /* @__PURE__ */ t.createElement(
    "img",
    {
      src: o.id,
      alt: e != null && e.label ? W(e.label) : ""
    }
  ), /* @__PURE__ */ t.createElement(de, null, /* @__PURE__ */ t.createElement(ce, { isIcon: !0, "data-testid": "thumbnail-tag" }, /* @__PURE__ */ t.createElement(Mr, null), /* @__PURE__ */ t.createElement(T, { "aria-label": a }, /* @__PURE__ */ t.createElement(Rr, { type: a })), ["Video", "Sound"].includes(a) && /* @__PURE__ */ t.createElement(Lr, null, ze(e.duration))))), (e == null ? void 0 : e.label) && /* @__PURE__ */ t.createElement("figcaption", { "data-testid": "fig-caption" }, /* @__PURE__ */ t.createElement(B, { label: e.label })))
), Fr = (e) => e.body ? e.body.type : "Image", Vr = ({ items: e }) => {
  const n = P(), r = $(), { activeCanvas: o, vault: a } = r, [i, l] = S(""), [s, d] = S([]), [c, h] = S(0), m = t.useRef(null), y = "painting", p = (f) => {
    o !== f && n({
      type: "updateActiveCanvas",
      canvasId: f
    });
  };
  w(() => {
    if (!s.length) {
      const f = ["Image", "Sound", "Video"], x = e.map(
        (b) => Be(a, b, y, f)
      ).filter((b) => b.annotations.length > 0);
      d(x);
    }
  }, [e, s.length, a]), w(() => {
    s.forEach((f, x) => {
      f != null && f.canvas && f.canvas.id === o && h(x);
    });
  }, [o, s]), w(() => {
    const f = document.querySelector(
      `[data-canvas="${c}"]`
    );
    if (f instanceof HTMLElement && m.current) {
      const x = f.offsetLeft - m.current.offsetWidth / 2 + f.offsetWidth / 2;
      m.current.scrollTo({ left: x, behavior: "smooth" });
    }
  }, [c]);
  const v = (f) => l(f), g = (f) => {
    const x = s[c + f];
    x != null && x.canvas && p(x.canvas.id);
  };
  return /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
    fr,
    {
      handleFilter: v,
      handleCanvasToggle: g,
      activeIndex: c,
      canvasLength: s.length
    }
  ), /* @__PURE__ */ t.createElement(hr, { "aria-label": "select item", "data-testid": "media", ref: m }, s.filter((f) => {
    var x;
    if ((x = f.canvas) != null && x.label) {
      const b = W(f.canvas.label);
      if (Array.isArray(b))
        return b[0].toLowerCase().includes(i.toLowerCase());
    }
  }).map((f, x) => {
    var b, E;
    return /* @__PURE__ */ t.createElement(
      Or,
      {
        canvas: f.canvas,
        canvasIndex: x,
        handleChange: p,
        isActive: o === ((b = f == null ? void 0 : f.canvas) == null ? void 0 : b.id),
        key: (E = f == null ? void 0 : f.canvas) == null ? void 0 : E.id,
        thumbnail: Bt(a, f, 200, 200),
        type: Fr(f.annotations[0])
      }
    );
  })));
}, ot = u("button", {
  background: "none",
  border: "none",
  cursor: "zoom-in",
  width: "100%",
  height: "100%",
  margin: "0",
  padding: "0",
  transition: "$all",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    color: "transparent",
    transition: "$all"
  },
  variants: {
    isMedia: {
      true: {
        cursor: "pointer"
      }
    }
  }
}), at = u("button", {
  display: "flex",
  height: "2rem",
  width: "2rem",
  borderRadius: "2rem",
  padding: "0",
  margin: "0",
  fontFamily: "inherit",
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
  marginLeft: "0.618rem",
  backgroundColor: "$primary",
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
  "&#rotateRight": {
    "&:hover, &:focus": {
      svg: {
        rotate: "45deg"
      }
    }
  },
  "&#rotateLeft": {
    transform: "scaleX(-1)",
    "&:hover, &:focus": {
      svg: {
        rotate: "45deg"
      }
    }
  },
  "&#reset": {
    "&:hover, &:focus": {
      svg: {
        rotate: "-15deg"
      }
    }
  }
}), it = u(at, {
  position: "absolute",
  width: "2rem",
  top: "1rem",
  right: "1rem",
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  transition: "$all",
  borderRadius: "50%",
  backgroundColor: "$accent",
  cursor: "pointer",
  "&:hover, &:focus": {
    backgroundColor: "$accent !important"
  },
  variants: {
    isInteractive: {
      true: {
        "&:hover": {
          opacity: "1"
        }
      },
      false: {}
    },
    isMedia: {
      true: {
        cursor: "pointer !important"
      }
    }
  },
  compoundVariants: [
    {
      isInteractive: !1,
      isMedia: !0,
      css: {
        top: "50%",
        right: "50%",
        width: "4rem",
        height: "4rem",
        transform: "translate(50%,-50%)"
      }
    }
  ]
}), Hr = u("div", {
  position: "relative",
  zIndex: "0",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  "&:hover": {
    [`${it}`]: {
      backgroundColor: "$accent"
    },
    [`${ot}`]: {
      backgroundColor: "#6662",
      img: {
        filter: "brightness(0.85)"
      }
    }
  }
}), Br = u("div", {}), Pr = u("svg", {
  height: "19px",
  color: "$accent",
  fill: "$accent",
  stroke: "$accent",
  display: "flex",
  margin: "0.25rem 0.85rem"
}), _r = u(q.Trigger, {
  fontSize: "1.25rem",
  fontWeight: "400",
  fontFamily: "inherit",
  alignSelf: "flex-start",
  flexGrow: "1",
  cursor: "pointer",
  transition: "$all",
  border: "1px solid #6663",
  boxShadow: "2px 2px 5px #0001",
  borderRadius: "3px",
  display: "flex",
  alignItems: "center",
  paddingLeft: "0.5rem",
  width: "100%",
  "@sm": {
    fontSize: "1rem"
  }
}), Wr = u(q.Content, {
  borderRadius: "3px",
  boxShadow: "3px 3px 8px #0003",
  backgroundColor: "$secondary",
  marginTop: "2.25rem",
  marginLeft: "6px",
  paddingBottom: "0.25rem",
  maxHeight: "calc(61.8vh - 2.5rem) !important",
  borderTopLeftRadius: "0",
  border: "1px solid $secondaryMuted",
  maxWidth: "90vw"
}), Nr = u(q.Item, {
  display: "flex",
  alignItems: "center",
  fontFamily: "inherit",
  padding: "0.25rem 0.5rem",
  color: "$primary",
  fontWeight: "400",
  fontSize: "0.8333rem",
  cursor: "pointer",
  backgroundColor: "$secondary",
  width: "calc(100% - 1rem)",
  "> span": {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  '&[data-state="checked"]': {
    fontWeight: "700",
    color: "$primary !important"
  },
  "&:hover": {
    color: "$accent"
  },
  img: {
    width: "31px",
    height: "31px",
    marginRight: "0.5rem",
    borderRadius: "3px"
  }
}), Dr = u(q.Label, {
  color: "$primaryMuted",
  fontFamily: "inherit",
  fontSize: "0.85rem",
  padding: "0.5rem 1rem 0.5rem 0.5rem",
  display: "flex",
  alignItems: "center",
  marginBottom: "0.25rem",
  borderRadius: "3px",
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",
  borderBottomRightRadius: "0",
  backgroundColor: "$secondaryMuted"
}), lt = u(q.Root, {
  position: "relative",
  zIndex: "5",
  width: "100%"
}), ie = ({ direction: e, title: n }) => {
  const r = () => /* @__PURE__ */ t.createElement("path", { d: "M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" }), o = () => /* @__PURE__ */ t.createElement("path", { d: "M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" });
  return /* @__PURE__ */ t.createElement(
    Pr,
    {
      xmlns: "http://www.w3.org/2000/svg",
      focusable: "false",
      viewBox: "0 0 512 512",
      role: "img"
    },
    /* @__PURE__ */ t.createElement("title", null, n),
    e === "up" && /* @__PURE__ */ t.createElement(r, null),
    e === "down" && /* @__PURE__ */ t.createElement(o, null)
  );
}, st = ({
  children: e,
  label: n,
  maxHeight: r,
  onValueChange: o,
  value: a
}) => /* @__PURE__ */ t.createElement(lt, { onValueChange: o, value: a }, /* @__PURE__ */ t.createElement(_r, { "data-testid": "select-button" }, /* @__PURE__ */ t.createElement(Ct, { "data-testid": "select-button-value" }), /* @__PURE__ */ t.createElement(kt, null, /* @__PURE__ */ t.createElement(ie, { direction: "down", title: "select" }))), /* @__PURE__ */ t.createElement(It, null, /* @__PURE__ */ t.createElement(
  Wr,
  {
    css: { maxHeight: `${r} !important` },
    "data-testid": "select-content"
  },
  /* @__PURE__ */ t.createElement($t, null, /* @__PURE__ */ t.createElement(ie, { direction: "up", title: "scroll up for more" })),
  /* @__PURE__ */ t.createElement(At, null, /* @__PURE__ */ t.createElement(Tt, null, n && /* @__PURE__ */ t.createElement(Dr, null, /* @__PURE__ */ t.createElement(B, { "data-testid": "select-label", label: n })), e)),
  /* @__PURE__ */ t.createElement(Mt, null, /* @__PURE__ */ t.createElement(ie, { direction: "down", title: "scroll down for more" }))
))), ct = (e) => /* @__PURE__ */ t.createElement(Nr, { ...e }, e.thumbnail && /* @__PURE__ */ t.createElement(et, { thumbnail: e.thumbnail }), /* @__PURE__ */ t.createElement(Lt, null, /* @__PURE__ */ t.createElement(B, { label: e.label })), /* @__PURE__ */ t.createElement(zt, null)), jr = u("div", {
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
}), Gr = u("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), qr = u("div", {
  width: "100%",
  height: "61.8vh",
  maxHeight: "100vh",
  background: "black",
  backgroundSize: "contain",
  color: "white",
  position: "relative",
  zIndex: "1",
  overflow: "hidden"
}), _ = ({ id: e, label: n, children: r }) => /* @__PURE__ */ t.createElement(at, { id: e, "data-testid": "openseadragon-button" }, /* @__PURE__ */ t.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    "aria-labelledby": `${e}-svg-title`,
    "data-testid": "openseadragon-button-svg",
    focusable: "false",
    viewBox: "0 0 512 512",
    role: "img"
  },
  /* @__PURE__ */ t.createElement("title", { id: `${e}-svg-title` }, n),
  r
)), Ur = u("div", {
  position: "absolute",
  zIndex: "1",
  top: "1rem",
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
}), Zr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M256 112v288M400 256H112"
  }
), Xr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 256H112"
  }
), Jr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
  }
), Yr = () => /* @__PURE__ */ t.createElement("path", { d: "M448 440a16 16 0 01-12.61-6.15c-22.86-29.27-44.07-51.86-73.32-67C335 352.88 301 345.59 256 344.23V424a16 16 0 01-27 11.57l-176-168a16 16 0 010-23.14l176-168A16 16 0 01256 88v80.36c74.14 3.41 129.38 30.91 164.35 81.87C449.32 292.44 464 350.9 464 424a16 16 0 01-16 16z" }), ke = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
  }
), /* @__PURE__ */ t.createElement("path", { d: "M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z" })), Kr = ({
  hasPlaceholder: e,
  options: n
}) => /* @__PURE__ */ t.createElement(
  Ur,
  {
    "data-testid": "openseadragon-controls",
    hasPlaceholder: e,
    id: "openseadragon-controls"
  },
  n.showZoomControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(_, { id: "zoomIn", label: "zoom in" }, /* @__PURE__ */ t.createElement(Zr, null)), /* @__PURE__ */ t.createElement(_, { id: "zoomOut", label: "zoom out" }, /* @__PURE__ */ t.createElement(Xr, null))),
  n.showFullPageControl && /* @__PURE__ */ t.createElement(_, { id: "fullPage", label: "full page" }, /* @__PURE__ */ t.createElement(Jr, null)),
  n.showRotationControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(_, { id: "rotateRight", label: "rotate right" }, /* @__PURE__ */ t.createElement(ke, null)), /* @__PURE__ */ t.createElement(_, { id: "rotateLeft", label: "rotate left" }, /* @__PURE__ */ t.createElement(ke, null))),
  n.showHomeControl && /* @__PURE__ */ t.createElement(_, { id: "reset", label: "reset" }, /* @__PURE__ */ t.createElement(Yr, null))
), Qr = (e) => fetch(`${e.replace(/\/$/, "")}/info.json`).then((n) => n.json()).then((n) => n).catch((n) => {
  console.error(
    `The IIIF tilesource ${e.replace(
      /\/$/,
      ""
    )}/info.json failed to load: ${n}`
  );
}), eo = (e) => {
  let n, r;
  if (Array.isArray(e) && (n = e[0], n)) {
    let o;
    "@id" in n ? o = n["@id"] : o = n.id, r = o;
  }
  return r;
}, to = ({
  uri: e,
  hasPlaceholder: n,
  imageType: r,
  annotationResources: o
}) => {
  var f, x;
  const [a, i] = S(), [l, s] = S(), d = $(), { configOptions: c, vault: h, activeCanvas: m } = d, y = P(), p = h.get({
    id: m,
    type: "Canvas"
  }), v = {
    id: `openseadragon-viewport-${l}`,
    loadTilesWithAjax: !0,
    fullPageButton: "fullPage",
    homeButton: "reset",
    rotateLeftButton: "rotateLeft",
    rotateRightButton: "rotateRight",
    zoomInButton: "zoomIn",
    zoomOutButton: "zoomOut",
    showNavigator: !0,
    showFullPageControl: !0,
    showHomeControl: !0,
    showRotationControl: !0,
    showZoomControl: !0,
    navigatorBorderColor: "transparent",
    navigatorId: `openseadragon-navigator-${l}`,
    gestureSettingsMouse: {
      clickToZoom: !0,
      dblClickToZoom: !0,
      pinchToZoom: !0,
      scrollToZoom: !0
    },
    ...c.openSeadragon,
    ajaxWithCredentials: c.withCredentials
  }, g = [];
  return (x = (f = o[0]) == null ? void 0 : f.items) == null || x.forEach((b) => {
    const E = h.get(b.id);
    g.push(E);
  }), w(() => {
    e !== a && (i(e), s(Me()));
  }, [a, e]), w(() => {
    var b;
    if (a)
      switch (r) {
        case "simpleImage":
          const E = j(v);
          E.addSimpleImage({
            url: a
          }), y({
            type: "updateOpenSeadragonViewer",
            openSeadragonViewer: E
          }), (b = c.annotationOverlays) != null && b.renderOverlays && se(
            E,
            p,
            c,
            g,
            "annotation-overlay"
          );
          break;
        case "tiledImage":
          Qr(a).then((k) => {
            var M;
            const A = j(v);
            A.addTiledImage({
              tileSource: k
            }), y({
              type: "updateOpenSeadragonViewer",
              openSeadragonViewer: A
            }), (M = c.annotationOverlays) != null && M.renderOverlays && se(
              A,
              p,
              c,
              g,
              "annotation-overlay"
            );
          });
          break;
        default:
          console.warn(
            `Unable to render ${a} in OpenSeadragon as type: "${r}"`
          );
          break;
      }
  }, [a]), l ? /* @__PURE__ */ t.createElement(
    qr,
    {
      css: {
        backgroundColor: c.canvasBackgroundColor,
        height: c.canvasHeight
      },
      className: "clover-viewer-osd-wrapper",
      "data-testid": "clover-viewer-osd-wrapper"
    },
    /* @__PURE__ */ t.createElement(Kr, { hasPlaceholder: n, options: v }),
    /* @__PURE__ */ t.createElement(jr, { id: `openseadragon-navigator-${l}` }),
    /* @__PURE__ */ t.createElement(Gr, { id: `openseadragon-viewport-${l}` })
  ) : null;
}, no = ({
  painting: e,
  hasPlaceholder: n,
  annotationResources: r
}) => {
  const [o, a] = S(), [i, l] = S();
  return w(() => {
    Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0 ? (a("tiledImage"), l(eo(e == null ? void 0 : e.service))) : (a("simpleImage"), l(e == null ? void 0 : e.id));
  }, [e]), /* @__PURE__ */ t.createElement(
    to,
    {
      uri: i,
      key: i,
      hasPlaceholder: n,
      imageType: o,
      annotationResources: r
    }
  );
}, ro = ({
  isMedia: e,
  label: n,
  placeholderCanvas: r,
  setIsInteractive: o
}) => {
  const { vault: a } = $(), i = J(a, r), l = i ? i[0] : void 0, s = n ? W(n) : ["placeholder image"];
  return /* @__PURE__ */ t.createElement(
    ot,
    {
      onClick: () => o(!0),
      isMedia: e,
      className: "clover-viewer-placeholder"
    },
    /* @__PURE__ */ t.createElement(
      "img",
      {
        src: (l == null ? void 0 : l.id) || "",
        alt: s.join(),
        height: l == null ? void 0 : l.height,
        width: l == null ? void 0 : l.width
      }
    )
  );
}, oo = u("canvas", {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), ao = t.forwardRef(
  (e, n) => {
    const r = t.useRef(null), o = Y(() => {
      var p, v;
      if ((p = n.current) != null && p.currentTime && ((v = n.current) == null ? void 0 : v.currentTime) > 0)
        return;
      const i = n.current;
      if (!i)
        return;
      const l = new AudioContext(), s = l.createMediaElementSource(i), d = l.createAnalyser(), c = r.current;
      if (!c)
        return;
      c.width = i.offsetWidth, c.height = i.offsetHeight;
      const h = c.getContext("2d");
      s.connect(d), d.connect(l.destination), d.fftSize = 256;
      const m = d.frequencyBinCount, y = new Uint8Array(m);
      setInterval(function() {
        a(
          d,
          h,
          m,
          y,
          c.width,
          c.height
        );
      }, 20);
    }, [n]);
    t.useEffect(() => {
      !n || !n.current || (n.current.onplay = o);
    }, [o, n]);
    function a(i, l, s, d, c, h) {
      const m = c / s * 2.6;
      let y, p = 0;
      i.getByteFrequencyData(d), l.fillStyle = "#000000", l.fillRect(0, 0, c, h);
      for (let v = 0; v < s; v++)
        y = d[v] * 2, l.fillStyle = "rgba(78, 42, 132, 1)", l.fillRect(p, h - y, m, y), p += m + 6;
    }
    return /* @__PURE__ */ t.createElement(oo, { ref: r, role: "presentation" });
  }
), io = u("div", {
  position: "relative",
  backgroundColor: "$primaryAlt",
  display: "flex",
  flexGrow: "0",
  flexShrink: "1",
  maxHeight: "500px",
  zIndex: "1",
  video: {
    backgroundColor: "transparent",
    objectFit: "contain",
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: "1"
  }
}), lo = ({ resource: e, ignoreCaptionLabels: n }) => {
  const r = W(e.label, "en");
  return Array.isArray(r) && r.some((a) => n.includes(a)) ? null : /* @__PURE__ */ t.createElement(
    "track",
    {
      key: e.id,
      src: e.id,
      label: Array.isArray(r) ? r[0] : r,
      srcLang: "en",
      "data-testid": "player-track"
    }
  );
}, so = ({
  allSources: e,
  annotationResources: n,
  painting: r
}) => {
  const [o, a] = t.useState(0), [i, l] = t.useState(), s = t.useRef(null), d = (r == null ? void 0 : r.type) === "Sound", c = $(), { activeCanvas: h, configOptions: m, vault: y } = c;
  return w(() => {
    if (!r.id || !s.current)
      return;
    if (s != null && s.current) {
      const g = s.current;
      g.src = r.id, g.load();
    }
    if (r.id.split(".").pop() !== "m3u8")
      return;
    const p = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      xhrSetup: function(g, f) {
        g.withCredentials = !!m.withCredentials;
      }
    }, v = new z(p);
    return v.attachMedia(s.current), v.on(z.Events.MEDIA_ATTACHED, function() {
      v.loadSource(r.id);
    }), v.on(z.Events.ERROR, function(g, f) {
      if (f.fatal)
        switch (f.type) {
          case z.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${g} network error encountered, try to recover`
            ), v.startLoad();
            break;
          case z.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${g} media error encountered, try to recover`
            ), v.recoverMediaError();
            break;
          default:
            v.destroy();
            break;
        }
    }), () => {
      if (v && s.current) {
        const g = s.current;
        v.detachMedia(), v.destroy(), g.currentTime = 0;
      }
    };
  }, [m.withCredentials, r.id]), w(() => {
    var x, b, E, k;
    const p = y.get(h), v = (x = p.accompanyingCanvas) != null && x.id ? J(y, (b = p.accompanyingCanvas) == null ? void 0 : b.id) : null, g = (E = p.placeholderCanvas) != null && E.id ? J(y, (k = p.placeholderCanvas) == null ? void 0 : k.id) : null;
    !!(v && g) ? l(o === 0 ? g[0].id : v[0].id) : (v && l(v[0].id), g && l(g[0].id));
  }, [h, o, y]), w(() => {
    if (s != null && s.current) {
      const p = s.current;
      return p == null || p.addEventListener(
        "timeupdate",
        () => a(p.currentTime)
      ), () => document.removeEventListener("timeupdate", () => {
      });
    }
  }, []), /* @__PURE__ */ t.createElement(
    io,
    {
      css: {
        backgroundColor: m.canvasBackgroundColor,
        maxHeight: m.canvasHeight,
        position: "relative"
      },
      "data-testid": "player-wrapper",
      className: "clover-viewer-player-wrapper"
    },
    /* @__PURE__ */ t.createElement(
      "video",
      {
        id: "clover-iiif-video",
        key: r.id,
        ref: s,
        controls: !0,
        height: r.height,
        width: r.width,
        crossOrigin: "anonymous",
        poster: i,
        style: {
          maxHeight: m.canvasHeight,
          position: "relative",
          zIndex: "1"
        }
      },
      e.map((p) => /* @__PURE__ */ t.createElement("source", { src: p.id, type: p.format, key: p.id })),
      (n == null ? void 0 : n.length) > 0 && n.map((p) => {
        const v = [];
        return p.items.forEach((g) => {
          y.get(
            g.id
          ).body.forEach((x) => {
            const b = y.get(
              x.id
            );
            v.push(b);
          });
        }), v.map((g) => /* @__PURE__ */ t.createElement(
          lo,
          {
            resource: g,
            ignoreCaptionLabels: m.ignoreCaptionLabels || [],
            key: g.id
          }
        ));
      }),
      "Sorry, your browser doesn't support embedded videos."
    ),
    d && /* @__PURE__ */ t.createElement(ao, { ref: s })
  );
}, co = () => /* @__PURE__ */ t.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    "aria-labelledby": "close-svg-title",
    focusable: "false",
    viewBox: "0 0 512 512",
    role: "img"
  },
  /* @__PURE__ */ t.createElement("title", { id: "close-svg-title" }, "close"),
  /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })
), mo = ({ isMedia: e }) => /* @__PURE__ */ t.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    "aria-labelledby": "open-svg-title",
    focusable: "false",
    viewBox: "0 0 512 512",
    role: "img"
  },
  /* @__PURE__ */ t.createElement("title", { id: "open-svg-title" }, "open"),
  e ? /* @__PURE__ */ t.createElement("path", { d: "M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z" }) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "m456.69,421.39l-94.09-94.09c22.65-30.16,34.88-66.86,34.84-104.58,0-96.34-78.38-174.72-174.72-174.72S48,126.38,48,222.72s78.38,174.72,174.72,174.72c37.72.04,74.42-12.19,104.58-34.84l94.09,94.09c10.29,9.2,26.1,8.32,35.3-1.98,8.48-9.49,8.48-23.83,0-33.32Zm-233.97-73.87c-68.89-.08-124.72-55.91-124.8-124.8h0c0-68.93,55.87-124.8,124.8-124.8s124.8,55.87,124.8,124.8-55.87,124.8-124.8,124.8Z" }), /* @__PURE__ */ t.createElement("path", { d: "m279.5,197.76h-3.35s-28.47,0-28.47,0v-31.82c-.77-13.79-12.57-24.33-26.36-23.56-12.71.71-22.85,10.86-23.56,23.56v3.35h0v28.47h-31.82c-13.79.77-24.33,12.57-23.56,26.36.71,12.71,10.86,22.85,23.56,23.56h3.35s28.47,0,28.47,0v31.82c.77,13.79,12.57,24.33,26.36,23.56,12.71-.71,22.85-10.86,23.56-23.56v-3.35h0v-28.47h31.82c13.79-.77,24.33-12.57,23.56-26.36-.71-12.71-10.86-22.85-23.56-23.56Z" }))
), uo = ({
  handleToggle: e,
  isInteractive: n,
  isMedia: r
}) => /* @__PURE__ */ t.createElement(
  it,
  {
    onClick: e,
    isInteractive: n,
    isMedia: r,
    "data-testid": "placeholder-toggle"
  },
  n ? /* @__PURE__ */ t.createElement(co, null) : /* @__PURE__ */ t.createElement(mo, { isMedia: r })
), po = ({
  activeCanvas: e,
  annotationResources: n,
  isMedia: r,
  painting: o
}) => {
  var k, A, M;
  const [a, i] = t.useState(0), [l, s] = t.useState(!1), { configOptions: d, customDisplays: c, vault: h } = $(), m = h.get(e), y = (k = m == null ? void 0 : m.placeholderCanvas) == null ? void 0 : k.id, p = !!y, v = (o == null ? void 0 : o.length) > 1, g = y && !l && !r, f = () => s(!l), x = (C) => {
    const L = o.findIndex((R) => R.id === C);
    i(L);
  }, b = c.find((C) => {
    var N;
    let L = !1;
    const { canvasId: R, paintingFormat: V } = C.target;
    if (Array.isArray(R) && R.length > 0 && (L = R.includes(e)), Array.isArray(V) && V.length > 0) {
      const D = ((N = o[a]) == null ? void 0 : N.format) || "";
      L = !!(D && V.includes(D));
    }
    return L;
  }), E = (A = b == null ? void 0 : b.display) == null ? void 0 : A.component;
  return /* @__PURE__ */ t.createElement(Hr, { className: "clover-viewer-painting" }, /* @__PURE__ */ t.createElement(
    Br,
    {
      style: {
        backgroundColor: d.canvasBackgroundColor,
        maxHeight: d.canvasHeight
      }
    },
    y && !r && /* @__PURE__ */ t.createElement(
      uo,
      {
        handleToggle: f,
        isInteractive: l,
        isMedia: r
      }
    ),
    g && !r && /* @__PURE__ */ t.createElement(
      ro,
      {
        isMedia: r,
        label: m == null ? void 0 : m.label,
        placeholderCanvas: y,
        setIsInteractive: s
      }
    ),
    !g && !b && (r ? /* @__PURE__ */ t.createElement(
      so,
      {
        allSources: o,
        painting: o[a],
        annotationResources: n
      }
    ) : o && /* @__PURE__ */ t.createElement(
      no,
      {
        painting: o[a],
        hasPlaceholder: p,
        key: e,
        annotationResources: n
      }
    )),
    !g && E && /* @__PURE__ */ t.createElement(
      E,
      {
        id: e,
        annotationBody: o[a],
        ...b == null ? void 0 : b.display.componentProps
      }
    )
  ), v && /* @__PURE__ */ t.createElement(
    st,
    {
      value: (M = o[a]) == null ? void 0 : M.id,
      onValueChange: x,
      maxHeight: "200px"
    },
    o == null ? void 0 : o.map((C) => /* @__PURE__ */ t.createElement(
      ct,
      {
        value: C == null ? void 0 : C.id,
        key: C == null ? void 0 : C.id,
        label: C == null ? void 0 : C.label
      }
    ))
  ));
}, fo = ({
  activeCanvas: e,
  annotationResources: n,
  searchServiceUrl: r,
  setContentSearchResource: o,
  contentSearchResource: a,
  isAudioVideo: i,
  items: l,
  painting: s
}) => {
  const { informationOpen: d, configOptions: c } = $(), { informationPanel: h } = c, m = (h == null ? void 0 : h.renderAbout) || (h == null ? void 0 : h.renderAnnotation) && n.length > 0 || a;
  return /* @__PURE__ */ t.createElement(
    Ne,
    {
      className: "clover-viewer-content",
      "data-testid": "clover-viewer-content"
    },
    /* @__PURE__ */ t.createElement(De, null, /* @__PURE__ */ t.createElement(
      po,
      {
        activeCanvas: e,
        annotationResources: n,
        isMedia: i,
        painting: s
      }
    ), m && /* @__PURE__ */ t.createElement(je, null, /* @__PURE__ */ t.createElement("span", null, d ? "View Items" : "More Information")), l.length > 1 && /* @__PURE__ */ t.createElement(We, { className: "clover-viewer-media-wrapper" }, /* @__PURE__ */ t.createElement(Vr, { items: l, activeItem: 0 }))),
    d && m && /* @__PURE__ */ t.createElement(Jt, null, /* @__PURE__ */ t.createElement(Ge, null, /* @__PURE__ */ t.createElement(
      ar,
      {
        activeCanvas: e,
        annotationResources: n,
        searchServiceUrl: r,
        setContentSearchResource: o,
        contentSearchResource: a
      }
    )))
  );
}, ho = u(U.Trigger, {
  width: "30px",
  padding: "5px"
}), go = u(U.Content, {
  display: "flex",
  flexDirection: "column",
  fontSize: "0.8333rem",
  border: "none",
  boxShadow: "2px 2px 5px #0003",
  zIndex: "2",
  button: {
    display: "flex",
    textDecoration: "none",
    marginBottom: "0.5em",
    color: "$accentAlt",
    cursor: "pointer",
    background: "$secondary",
    border: "none",
    "&:last-child": {
      marginBottom: "0"
    }
  }
}), vo = u("span", {
  fontSize: "1.33rem",
  alignSelf: "flex-start",
  flexGrow: "0",
  flexShrink: "1",
  padding: "1rem",
  "@sm": {
    fontSize: "1rem"
  },
  "&.visually-hidden": {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0"
  }
}), yo = u("header", {
  display: "flex",
  backgroundColor: "transparent !important",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  [`> ${lt}`]: {
    flexGrow: "1",
    flexShrink: "0"
  },
  form: {
    flexGrow: "0",
    flexShrink: "1"
  }
}), xo = u("div", {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  padding: "1rem",
  flexShrink: "0",
  flexGrow: "1"
}), bo = () => {
  var d;
  const e = P(), n = $(), { activeManifest: r, collection: o, configOptions: a, vault: i } = n, l = a == null ? void 0 : a.canvasHeight, s = (c) => {
    e({
      type: "updateActiveManifest",
      manifestId: c
    });
  };
  return /* @__PURE__ */ t.createElement("div", { style: { margin: "0.75rem" } }, /* @__PURE__ */ t.createElement(
    st,
    {
      label: o.label,
      maxHeight: l,
      value: r,
      onValueChange: s
    },
    (d = o == null ? void 0 : o.items) == null ? void 0 : d.map((c) => /* @__PURE__ */ t.createElement(
      ct,
      {
        value: c.id,
        key: c.id,
        thumbnail: c != null && c.thumbnail ? i.get(c == null ? void 0 : c.thumbnail) : void 0,
        label: c.label
      }
    ))
  ));
}, Eo = (e, n = 2500) => {
  const [r, o] = S(), a = Y(() => {
    navigator.clipboard.writeText(e).then(
      () => o("copied"),
      () => o("failed")
    );
  }, [e]);
  return w(() => {
    if (!r)
      return;
    const i = setTimeout(() => o(void 0), n);
    return () => clearTimeout(i);
  }, [r]), [r, a];
}, wo = u("span", {
  display: "flex",
  alignContent: "center",
  alignItems: "center",
  padding: "0.125rem 0.25rem 0",
  marginTop: "-0.125rem",
  marginLeft: "0.5rem",
  backgroundColor: "$accent",
  color: "$secondary",
  borderRadius: "3px",
  fontSize: "0.6111rem",
  textTransform: "uppercase",
  lineHeight: "1em"
}), So = ({ status: e }) => e ? /* @__PURE__ */ t.createElement(wo, { "data-copy-status": e }, e) : null, Ie = ({
  textPrompt: e,
  textToCopy: n
}) => {
  const [r, o] = Eo(n);
  return /* @__PURE__ */ t.createElement("button", { onClick: o }, e, " ", /* @__PURE__ */ t.createElement(So, { status: r }));
}, Co = () => {
  const e = "#ed1d33", n = "#2873ab";
  return /* @__PURE__ */ t.createElement("svg", { viewBox: "0 0 493.35999 441.33334", id: "iiif-logo", version: "1.1" }, /* @__PURE__ */ t.createElement("title", null, "IIIF Manifest Options"), /* @__PURE__ */ t.createElement("g", { transform: "matrix(1.3333333,0,0,-1.3333333,0,441.33333)" }, /* @__PURE__ */ t.createElement("g", { transform: "scale(0.1)" }, /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "M 65.2422,2178.75 775.242,1915 773.992,15 65.2422,276.25 v 1902.5"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "m 804.145,2640.09 c 81.441,-240.91 -26.473,-436.2 -241.04,-436.2 -214.558,0 -454.511,195.29 -535.9527,436.2 -81.4335,240.89 26.4805,436.18 241.0387,436.18 214.567,0 454.512,-195.29 535.954,-436.18"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: e },
      d: "M 1678.58,2178.75 968.578,1915 969.828,15 1678.58,276.25 v 1902.5"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: e },
      d: "m 935.082,2640.09 c -81.437,-240.91 26.477,-436.2 241.038,-436.2 214.56,0 454.51,195.29 535.96,436.2 81.43,240.89 -26.48,436.18 -241.04,436.18 -214.57,0 -454.52,-195.29 -535.958,-436.18"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "m 1860.24,2178.75 710,-263.75 -1.25,-1900 -708.75,261.25 v 1902.5"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "m 2603.74,2640.09 c 81.45,-240.91 -26.47,-436.2 -241.03,-436.2 -214.58,0 -454.52,195.29 -535.96,436.2 -81.44,240.89 26.48,436.18 241.03,436.18 214.57,0 454.51,-195.29 535.96,-436.18"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: e },
      d: "m 3700.24,3310 v -652.5 c 0,0 -230,90 -257.5,-142.5 -2.5,-247.5 0,-336.25 0,-336.25 l 257.5,83.75 V 1690 l -258.61,-92.5 V 262.5 L 2735.24,0 v 2360 c 0,0 -15,850 965,950"
    }
  ))));
}, ko = u(Le.Root, {
  all: "unset",
  height: "2rem",
  width: "3.236rem",
  backgroundColor: "#6663",
  borderRadius: "9999px",
  position: "relative",
  WebkitTapHighlightColor: "transparent",
  cursor: "pointer",
  "&:focus": {
    boxShadow: "0 0 0 2px $secondaryAlt"
  },
  '&[data-state="checked"]': {
    backgroundColor: "$accent",
    boxShadow: "inset 2px 2px 5px #0003"
  }
}), Io = u(Le.Thumb, {
  display: "block",
  height: "calc(2rem - 12px)",
  width: "calc(2rem - 12px)",
  backgroundColor: "$secondary",
  borderRadius: "100%",
  boxShadow: "2px 2px 5px #0001",
  transition: "$all",
  transform: "translateX(6px)",
  willChange: "transform",
  '&[data-state="checked"]': {
    transform: "translateX(calc(1.236rem + 6px))"
  }
}), $o = u("label", {
  fontSize: "0.8333rem",
  fontWeight: "400",
  lineHeight: "1em",
  userSelect: "none",
  cursor: "pointer",
  paddingRight: "0.618rem"
}), Ao = u("form", {
  display: "flex",
  flexShrink: "0",
  flexGrow: "1",
  alignItems: "center",
  marginLeft: "1.618rem"
}), To = () => {
  var a;
  const { configOptions: e } = $(), n = P(), [r, o] = S((a = e == null ? void 0 : e.informationPanel) == null ? void 0 : a.open);
  return w(() => {
    n({
      type: "updateInformationOpen",
      informationOpen: r
    });
  }, [r]), /* @__PURE__ */ t.createElement(Ao, null, /* @__PURE__ */ t.createElement($o, { htmlFor: "information-toggle", css: r ? { opacity: "1" } : {} }, "More Information"), /* @__PURE__ */ t.createElement(
    ko,
    {
      checked: r,
      onCheckedChange: () => o(!r),
      id: "information-toggle",
      "aria-label": "information panel toggle",
      name: "toggled?"
    },
    /* @__PURE__ */ t.createElement(Io, null)
  ));
}, dt = (e) => {
  const n = () => window.matchMedia ? window.matchMedia(e).matches : !1, [r, o] = S(n);
  return w(() => {
    const a = () => o(n);
    return window.addEventListener("resize", a), () => window.removeEventListener("resize", a);
  }), r;
}, Mo = ({ manifestId: e, manifestLabel: n }) => {
  const r = $(), { collection: o, configOptions: a } = r, { showTitle: i, showIIIFBadge: l, informationPanel: s } = a, d = l || (s == null ? void 0 : s.renderToggle), c = dt(fe.sm);
  return /* @__PURE__ */ t.createElement(yo, { className: "clover-viewer-header" }, o != null && o.items ? /* @__PURE__ */ t.createElement(bo, null) : /* @__PURE__ */ t.createElement(vo, { className: i ? "" : "visually-hidden" }, i && /* @__PURE__ */ t.createElement(B, { label: n, className: "label" })), d && /* @__PURE__ */ t.createElement(xo, null, l && /* @__PURE__ */ t.createElement(U, null, /* @__PURE__ */ t.createElement(ho, null, /* @__PURE__ */ t.createElement(Co, null)), /* @__PURE__ */ t.createElement(go, null, (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (h) => {
        h.preventDefault(), window.open(o.id, "_blank");
      }
    },
    "View Collection"
  ), /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (h) => {
        h.preventDefault(), window.open(e, "_blank");
      }
    },
    "View Manifest"
  ), " ", (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    Ie,
    {
      textPrompt: "Copy Collection URL",
      textToCopy: o.id
    }
  ), /* @__PURE__ */ t.createElement(
    Ie,
    {
      textPrompt: "Copy Manifest URL",
      textToCopy: e
    }
  ))), (s == null ? void 0 : s.renderToggle) && !c && /* @__PURE__ */ t.createElement(To, null)));
}, Lo = (e = !1) => {
  const [n, r] = S(e);
  return yt(() => {
    if (!n)
      return;
    const o = document.documentElement.style.overflow;
    return document.documentElement.style.overflow = "hidden", () => {
      document.documentElement.style.overflow = o;
    };
  }, [n]), w(() => {
    n !== e && r(e);
  }, [e]), [n, r];
}, zo = ({
  manifest: e,
  theme: n,
  iiifContentSearch: r
}) => {
  var D;
  const o = $(), a = P(), {
    activeCanvas: i,
    informationOpen: l,
    vault: s,
    contentSearchVault: d,
    configOptions: c,
    openSeadragonViewer: h
  } = o, [m, y] = S(!1), [p, v] = S(!1), [g, f] = S([]), [x, b] = S([]), [E, k] = S(), [A, M] = Lo(!1), C = dt(fe.sm), [L, R] = S(), V = Y(
    (I) => {
      a({
        type: "updateInformationOpen",
        informationOpen: I
      });
    },
    [a]
  );
  w(() => {
    var I;
    (I = c == null ? void 0 : c.informationPanel) != null && I.open && V(!C);
  }, [
    C,
    (D = c == null ? void 0 : c.informationPanel) == null ? void 0 : D.open,
    V
  ]), w(() => {
    if (!C) {
      M(!1);
      return;
    }
    M(l);
  }, [l, C, M]), w(() => {
    const I = J(s, i);
    I && (v(
      ["Sound", "Video"].indexOf(I[0].type) > -1
    ), f(I)), b(Ht(s, i)), y(x.length !== 0);
  }, [i, x.length, s]), w(() => {
    var I, Z, ye;
    r !== void 0 && ((I = c.informationPanel) == null ? void 0 : I.renderContentSearch) !== !1 && He(
      d,
      r,
      (ye = (Z = c.localeText) == null ? void 0 : Z.contentSearch) == null ? void 0 : ye.tabLabel
    ).then((mt) => {
      k(mt);
    });
  }, [r, d, c]), w(() => {
    if (!h || !E)
      return;
    const I = s.get({
      id: i,
      type: "Canvas"
    });
    jt(h, "content-search-overlay"), Ro(
      d,
      E,
      h,
      I,
      c
    );
  }, [
    d,
    c,
    h,
    i,
    s,
    E
  ]);
  const N = e.service.some(
    (I) => I.type === "SearchService2"
  );
  return w(() => {
    if (N) {
      const I = e.service.find(
        (Z) => Z.type === "SearchService2"
      );
      I && R(I.id);
    }
  }, [e, N]), /* @__PURE__ */ t.createElement(xt, { FallbackComponent: Xt }, /* @__PURE__ */ t.createElement(
    Yt,
    {
      className: `${n} clover-viewer`,
      css: { background: c == null ? void 0 : c.background },
      "data-body-locked": A,
      "data-information-panel": m,
      "data-information-panel-open": l
    },
    /* @__PURE__ */ t.createElement(
      me.Root,
      {
        open: l,
        onOpenChange: V
      },
      /* @__PURE__ */ t.createElement(
        Mo,
        {
          manifestLabel: e.label,
          manifestId: e.id
        }
      ),
      /* @__PURE__ */ t.createElement(
        fo,
        {
          activeCanvas: i,
          painting: g,
          annotationResources: x,
          searchServiceUrl: L,
          setContentSearchResource: k,
          contentSearchResource: E,
          items: e.items,
          isAudioVideo: p
        }
      )
    )
  ));
};
function Ro(e, n, r, o, a) {
  var l;
  const i = [];
  (l = n == null ? void 0 : n.items) == null || l.forEach((s) => {
    const d = e.get(s.id);
    typeof d.target == "string" && d.target.startsWith(o.id) && i.push(d);
  }), r && se(
    r,
    o,
    a,
    i,
    "content-search-overlay"
  );
}
const $e = {
  ignoreCache: !1,
  headers: {
    Accept: "application/json, text/javascript, text/plain"
  },
  timeout: 5e3,
  withCredentials: !1
};
function Oo(e) {
  return {
    ok: e.status >= 200 && e.status < 300,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: e.responseText,
    json: () => JSON.parse(e.responseText)
  };
}
function Ae(e, n = null) {
  return {
    ok: !1,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: n || e.statusText,
    json: () => JSON.parse(n || e.statusText)
  };
}
function Fo(e, n = $e) {
  const r = n.headers || $e.headers;
  return new Promise((o, a) => {
    const i = new XMLHttpRequest();
    i.open("get", e), i.withCredentials = n.withCredentials, r && Object.keys(r).forEach(
      (l) => i.setRequestHeader(l, r[l])
    ), i.onload = () => {
      o(Oo(i));
    }, i.onerror = () => {
      a(Ae(i, "Failed to make request."));
    }, i.ontimeout = () => {
      a(Ae(i, "Request took longer than expected."));
    }, i.send();
  });
}
const Xo = ({
  canvasIdCallback: e = () => {
  },
  customDisplays: n = [],
  customTheme: r,
  iiifContent: o,
  id: a,
  manifestId: i,
  options: l,
  iiifContentSearch: s
}) => {
  var c;
  let d = o;
  return a && (d = a), i && (d = i), /* @__PURE__ */ t.createElement(
    Vt,
    {
      initialState: {
        ...ee,
        customDisplays: n,
        informationOpen: !!((c = l == null ? void 0 : l.informationPanel) != null && c.open),
        vault: new le({
          customFetcher: (h) => Fo(h, {
            withCredentials: l == null ? void 0 : l.withCredentials,
            headers: l == null ? void 0 : l.requestHeaders
          }).then((m) => JSON.parse(m.data))
        })
      }
    },
    /* @__PURE__ */ t.createElement(
      Vo,
      {
        iiifContent: d,
        canvasIdCallback: e,
        customTheme: r,
        options: l,
        iiifContentSearch: s
      }
    )
  );
}, Vo = ({
  canvasIdCallback: e,
  customTheme: n,
  iiifContent: r,
  options: o,
  iiifContentSearch: a
}) => {
  const i = P(), l = $(), { activeCanvas: s, activeManifest: d, isLoaded: c, vault: h } = l, [m, y] = S(), [p, v] = S();
  let g = {};
  return n && (g = Et("custom", n)), w(() => {
    e && e(s);
  }, [s, e]), w(() => {
    d && h.loadManifest(d).then((f) => {
      v(f), i({
        type: "updateActiveCanvas",
        canvasId: f.items[0] && f.items[0].id
      });
    }).catch((f) => {
      console.error(`Manifest failed to load: ${f}`);
    }).finally(() => {
      i({
        type: "updateIsLoaded",
        isLoaded: !0
      });
    });
  }, [d, i, h]), w(() => {
    i({
      type: "updateConfigOptions",
      configOptions: o
    }), h.load(r).then((f) => {
      y(f);
    }).catch((f) => {
      console.error(
        `The IIIF resource ${r} failed to load: ${f}`
      );
    });
  }, [i, r, o, h]), w(() => {
    let f = [];
    (m == null ? void 0 : m.type) === "Collection" ? (i({
      type: "updateCollection",
      collection: m
    }), f = m.items.filter((x) => x.type === "Manifest").map((x) => x.id), f.length > 0 && i({
      type: "updateActiveManifest",
      manifestId: f[0]
    })) : (m == null ? void 0 : m.type) === "Manifest" && i({
      type: "updateActiveManifest",
      manifestId: m.id
    });
  }, [i, m]), c ? !p || !p.items ? (console.log(`The IIIF manifest ${r} failed to load.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : p.items.length === 0 ? (console.log(`The IIIF manifest ${r} does not contain canvases.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : /* @__PURE__ */ t.createElement(
    zo,
    {
      manifest: p,
      theme: g,
      key: p.id,
      iiifContentSearch: a
    }
  ) : /* @__PURE__ */ t.createElement(t.Fragment, null, "Loading");
};
export {
  Xo as default
};
//# sourceMappingURL=index.mjs.map
