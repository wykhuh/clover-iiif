import t, { useReducer as ut, useRef as pt, useEffect as b, useCallback as te, createContext as ft, useContext as gt, cloneElement as ht, Fragment as vt, useState as w, useLayoutEffect as yt } from "react";
import { Vault as me } from "@iiif/vault";
import * as ue from "@radix-ui/react-collapsible";
import N from "openseadragon";
import { ErrorBoundary as xt } from "react-error-boundary";
import { createStitches as bt, createTheme as wt } from "@stitches/react";
import * as ne from "@radix-ui/react-tabs";
import Et from "sanitize-html";
import z from "hls.js";
import { v4 as Re } from "uuid";
import * as re from "@radix-ui/react-radio-group";
import { parse as St } from "node-webvtt";
import * as q from "@radix-ui/react-popover";
import * as U from "@radix-ui/react-select";
import { SelectValue as Ct, SelectIcon as kt, SelectPortal as It, SelectScrollUpButton as $t, SelectViewport as At, SelectGroup as Tt, SelectScrollDownButton as Mt, SelectItemText as zt, SelectItemIndicator as Rt } from "@radix-ui/react-select";
import * as Le from "@radix-ui/react-switch";
import * as G from "@radix-ui/react-form";
const Lt = (e) => {
  const n = e.toString().split(":"), r = Math.ceil(parseInt(n[0])), o = Math.ceil(parseInt(n[1])), i = Ot(Math.ceil(parseInt(n[2])), 2);
  let l = `${r !== 0 && o < 10 ? (o + "").padStart(2, "0") : o}:${i}`;
  return r !== 0 && (l = `${r}:${l}`), l;
}, Oe = (e) => {
  const n = new Date(e * 1e3).toISOString().substr(11, 8);
  return Lt(n);
}, Fe = (e, n) => {
  if (typeof e != "object" || e === null)
    return n;
  for (const r in n)
    typeof n[r] == "object" && n[r] !== null && !Array.isArray(n[r]) ? (e[r] || (e[r] = {}), e[r] = Fe(e[r], n[r])) : e[r] = n[r];
  return e;
}, Ve = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, Ot = (e, n) => String(e).padStart(n, "0"), Y = {
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
  ignoreCaptionLabels: [],
  informationPanel: {
    open: !0,
    renderAbout: !0,
    renderSupplementing: !0,
    renderToggle: !0,
    renderAnnotation: !0
  },
  openSeadragon: {},
  requestHeaders: { "Content-Type": "application/json" },
  showIIIFBadge: !0,
  showTitle: !0,
  withCredentials: !1
};
var ze;
const oe = {
  activeCanvas: "",
  activeManifest: "",
  collection: {},
  configOptions: Y,
  customDisplays: [],
  informationOpen: (ze = Y == null ? void 0 : Y.informationPanel) == null ? void 0 : ze.open,
  isLoaded: !1,
  vault: new me(),
  openSeadragonViewer: null
}, He = t.createContext(oe), Pe = t.createContext(oe);
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
        configOptions: Fe(e.configOptions, n.configOptions)
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
  initialState: e = oe,
  children: n
}) => {
  const [r, o] = ut(Ft, e);
  return /* @__PURE__ */ t.createElement(He.Provider, { value: r }, /* @__PURE__ */ t.createElement(
    Pe.Provider,
    {
      value: o
    },
    n
  ));
};
function k() {
  const e = t.useContext(He);
  if (e === void 0)
    throw new Error("useViewerState must be used within a ViewerProvider");
  return e;
}
function H() {
  const e = t.useContext(Pe);
  if (e === void 0)
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  return e;
}
const Be = (e, n, r, o) => {
  var l, s;
  const i = {
    canvas: void 0,
    accompanyingCanvas: void 0,
    annotationPage: void 0,
    annotations: []
  }, a = (d) => {
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
      const u = e.get(c.id);
      if (!u)
        return;
      switch (r) {
        case "painting":
          return d.target === n.id && d.motivation && d.motivation[0] === "painting" && o.includes(u.type) && (d.body = u), !!d;
        case "supplementing":
          return;
        default:
          throw new Error("Invalid annotation motivation.");
      }
    }
  };
  if (i.canvas = e.get(n), i.canvas && (i.annotationPage = e.get(i.canvas.items[0]), i.accompanyingCanvas = (l = i.canvas) != null && l.accompanyingCanvas ? e.get((s = i.canvas) == null ? void 0 : s.accompanyingCanvas) : void 0), i.annotationPage) {
    const d = e.get(i.annotationPage.items).map((u) => ({
      body: e.get(u.body[0].id),
      motivation: u.motivation,
      type: "Annotation"
    })), c = [];
    d.forEach((u) => {
      u.body.type === "Choice" ? u.body.items.forEach(
        (m) => c.push({
          ...u,
          id: m.id,
          body: e.get(m.id)
        })
      ) : c.push(u);
    }), i.annotations = c.filter(a);
  }
  return i;
}, Z = (e, n = "en") => {
  if (!e)
    return "";
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return e[n];
}, ee = (e, n) => {
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
}, Ht = (e, n, r) => {
  const o = e.get({
    id: n,
    type: "Canvas"
  });
  if (!(o != null && o.annotations) || !o.annotations[0])
    return [];
  const i = e.get(o.annotations[0]), a = e.get(i.items);
  return Array.isArray(a) ? a.filter((l) => {
    var s;
    if (l.body && (s = l.motivation) != null && s.includes("supplementing")) {
      let d = l.body;
      Array.isArray(d) && (d = d[0]);
      const c = e.get(d.id);
      if (c.format === r)
        return l.body = c, l;
    }
  }).map((l) => l.body) : [];
}, Pt = (e, n, r, o) => {
  const i = [];
  if (n.canvas && n.canvas.thumbnail.length > 0) {
    const s = e.get(
      n.canvas.thumbnail[0]
    );
    i.push(s);
  }
  if (n.annotations[0]) {
    if (n.annotations[0].thumbnail && n.annotations[0].thumbnail.length > 0) {
      const d = e.get(
        n.annotations[0].thumbnail[0]
      );
      i.push(d);
    }
    if (!n.annotations[0].body)
      return;
    const s = n.annotations[0].body;
    s.type === "Image" && i.push(s);
  }
  return i.length === 0 ? void 0 : {
    id: i[0].id,
    format: i[0].format,
    type: i[0].type,
    width: r,
    height: o
  };
}, Bt = async (e, n) => {
  const r = e.get({
    id: n,
    type: "Canvas"
  });
  if (!(r != null && r.annotations) || !r.annotations[0])
    return [];
  const o = e.get(r.annotations[0]);
  if (!o.items)
    return [];
  let i = [];
  if (o.items.length > 0)
    i = e.get(o.items);
  else {
    const l = await e.load(o.id);
    i = e.get(l.items);
  }
  const a = i.filter((l) => l.body !== void 0);
  return _t(e, a);
};
function _t(e, n) {
  const r = {};
  n.forEach((i) => {
    const a = i.body;
    if (Array.isArray(a))
      if (a.length === 1) {
        const c = e.get(
          a[0].id
        );
        if (c.format === "text/vtt")
          return;
        i.body = c;
      } else {
        const c = [];
        a.forEach((u) => {
          const m = e.get(u.id);
          m.format !== "text/vtt" && c.push(m);
        }), i.body = c;
      }
    else {
      const c = e.get(a.id);
      if (c.format === "text/vtt")
        return;
      i.body = c;
    }
    const l = i.label || { en: ["Annotation"] }, d = Object.values(l)[0][0];
    r[d] || (r[d] = []), r[d].push({
      body: i.body,
      target: i.target,
      motivation: i.motivation && i.motivation[0],
      localizedLabel: l
    });
  });
  const o = [];
  for (const [i, a] of Object.entries(r)) {
    const l = {
      id: i,
      label: a[0].localizedLabel,
      motivation: a[0].motivation,
      items: []
    };
    a.forEach((s) => {
      l.items.push({
        target: s.target,
        body: s.body
      });
    }), o.push(l);
  }
  return o;
}
function _e(e, n) {
  const r = {};
  return n.items.forEach((o) => {
    const i = e.get(o.id);
    if (i.label) {
      const a = Object.values(i.label);
      r[o.id] = a[0] && a[0][0];
    }
  }), r;
}
const We = async (e, n) => {
  if (e["@context"] !== "http://iiif.io/api/search/2/context.json")
    return {};
  if (!e.items)
    return {};
  const r = new me();
  await r.loadManifest(e);
  const o = r.get(e.items);
  if (o.length === 0)
    return {
      id: "Search Results",
      label: { en: ["Search Results"] },
      items: {}
    };
  o.forEach((a) => {
    if (!a.body)
      return;
    const l = a.body;
    if (Array.isArray(l) && l.length === 1) {
      const s = r.get(l[0]);
      a.body = s;
    }
  });
  const i = {
    id: "Search Results",
    label: { en: ["Search Results"] },
    motivation: o[0].motivation && o[0].motivation[0],
    items: {}
  };
  return o.forEach((a) => {
    const l = a.target;
    if (l && typeof l == "string") {
      const s = Object.keys(n).find(
        (d) => l.startsWith(d)
      );
      s && (i.items[n[s]] || (i.items[n[s]] = []), i.items[n[s]].push({
        target: a.target,
        body: a.body,
        canvas: s
      }));
    }
  }), i;
};
let V = window.OpenSeadragon;
if (!V && (V = N, !V))
  throw new Error("OpenSeadragon is missing.");
const xe = "http://www.w3.org/2000/svg";
V.Viewer && (V.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new pe(this), this._svgOverlayInfo);
});
const pe = function(e) {
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
pe.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new V.Point(0, 0), !0), n = this._viewer.viewport.getZoom(!0), r = this._viewer.viewport.getRotation(), o = this._viewer.viewport.getFlip(), i = this._viewer.viewport._containerInnerSize.x;
    let a = i * n;
    const l = a;
    o && (a = -a, e.x = -e.x + i), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + a + "," + l + ") rotate(" + r + ")"
    );
  },
  // ----------
  onClick: function(e, n) {
    new V.MouseTracker({
      element: e,
      clickHandler: n
    }).setTracking(!0);
  }
};
const Wt = (e) => new pe(e);
function be(e, n, r, o, i) {
  if (!e || !n)
    return;
  const a = 1 / n.width;
  o.forEach((l) => {
    if (typeof l.target == "string")
      l.target.includes("#xywh=") && Nt(
        l.target,
        e,
        r,
        a,
        i
      );
    else if (l.target && l.target.type === "SpecificResource") {
      const s = l.target.selector;
      typeof s == "object" && !Array.isArray(s) && (s.type === "PointSelector" ? jt(
        s,
        e,
        r,
        a,
        i
      ) : s.type === "SvgSelector" && Dt(
        s,
        e,
        r,
        a,
        i
      ));
    }
  });
}
function Nt(e, n, r, o, i) {
  const a = e.split("#xywh=");
  if (a && a[1]) {
    const [l, s, d, c] = a[1].split(",").map((u) => Number(u));
    Gt(
      n,
      l * o,
      s * o,
      d * o,
      c * o,
      r,
      i
    );
  }
}
function jt(e, n, r, o, i) {
  const a = e.x, l = e.y, s = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${a}" cy="${l}" r="20" />
    </svg>
  `;
  Ne(n, s, r, o, i);
}
function Dt(e, n, r, o, i) {
  if ("id" in e)
    return;
  const a = e.value;
  Ne(n, a, r, o, i);
}
function Gt(e, n, r, o, i, a, l) {
  const s = new N.Rect(n, r, o, i), d = document.createElement("div");
  if (a.annotationOverlays) {
    const { backgroundColor: c, opacity: u, borderType: m, borderColor: v, borderWidth: f } = a.annotationOverlays;
    d.style.backgroundColor = c, d.style.opacity = u, d.style.border = `${m} ${f} ${v}`, d.className = l;
  }
  e.addOverlay(d, s);
}
function qt(e) {
  if (!e)
    return null;
  const n = document.createElement("template");
  return n.innerHTML = e.trim(), n.content.children[0];
}
function Ne(e, n, r, o, i) {
  const a = qt(n);
  if (a)
    for (const l of a.children)
      je(e, l, r, o, i);
}
function je(e, n, r, o, i) {
  var a;
  if (n.nodeName === "#text")
    Zt(n);
  else {
    const l = Ut(n, r, o), s = Wt(e);
    s.node().append(l), (a = s._svg) == null || a.setAttribute("class", i), n.childNodes.forEach((d) => {
      je(e, d, r, o, i);
    });
  }
}
function Ut(e, n, r) {
  var d, c, u, m;
  let o = !1, i = !1, a = !1, l = !1;
  const s = document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.nodeName
  );
  if (e.attributes.length > 0)
    for (let v = 0; v < e.attributes.length; v++) {
      const f = e.attributes[v];
      switch (f.name) {
        case "fill":
          a = !0;
          break;
        case "stroke":
          o = !0;
          break;
        case "stroke-width":
          i = !0;
          break;
        case "fill-opacity":
          l = !0;
          break;
      }
      s.setAttribute(f.name, f.textContent);
    }
  return o || (s.style.stroke = (d = n.annotationOverlays) == null ? void 0 : d.borderColor), i || (s.style.strokeWidth = (c = n.annotationOverlays) == null ? void 0 : c.borderWidth), a || (s.style.fill = (u = n.annotationOverlays) == null ? void 0 : u.backgroundColor), l || (s.style.fillOpacity = (m = n.annotationOverlays) == null ? void 0 : m.opacity), s.setAttribute("transform", `scale(${r})`), s;
}
function Zt(e) {
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
function we(e, n) {
  if (!e)
    return;
  n.startsWith(".") || (n = "." + n);
  const r = document.querySelectorAll(n);
  r && r.forEach((o) => e.removeOverlay(o));
}
const ae = 209, Xt = {
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
    accent: `hsl(${ae} 100% 38.2%)`,
    accentMuted: `hsl(${ae} 80% 61.8%)`,
    accentAlt: `hsl(${ae} 80% 30%)`,
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
}, { styled: p, css: _o, keyframes: ge, createTheme: Wo } = bt({
  theme: Xt,
  media: fe
}), Jt = p("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}), Yt = p("p", {
  fontWeight: "bold",
  fontSize: "x-large"
}), Kt = p("span", {
  fontSize: "medium"
}), Qt = ({ error: e }) => {
  const { message: n } = e;
  return /* @__PURE__ */ t.createElement(Jt, { role: "alert" }, /* @__PURE__ */ t.createElement(Yt, { "data-testid": "headline" }, "Something went wrong"), n && /* @__PURE__ */ t.createElement(Kt, null, `Error message: ${n}`, " "));
}, De = p("div", {
  position: "relative",
  zIndex: "0"
}), Ge = p("div", {
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
  "@sm": {
    flexDirection: "column"
  }
}), qe = p("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  width: "61.8%",
  "@sm": {
    width: "100%"
  }
}), Ue = p(ue.Trigger, {
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
}), Ze = p(ue.Content, {
  width: "100%",
  display: "flex"
}), en = p("aside", {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  width: "38.2%",
  maxHeight: "100%",
  "@sm": {
    width: "100%"
  }
}), tn = p("div", {
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
      [`& ${Ge}`]: {
        flexGrow: "1"
      },
      [`& ${qe}`]: {
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
      [`& ${De}`]: {
        display: "none"
      },
      [`& ${Ue}`]: {
        margin: "1rem"
      },
      [`& ${Ze}`]: {
        height: "100%"
      }
    }
  }
}), nn = p(ne.Root, {
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
}), rn = p(ne.List, {
  display: "flex",
  flexGrow: "0",
  margin: "0 1.618rem",
  borderBottom: "4px solid #6663",
  "@sm": {
    margin: "0 1rem"
  }
}), K = p(ne.Trigger, {
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
}), Q = p(ne.Content, {
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
}), on = p("div", {
  position: "relative",
  height: "100%",
  width: "100%",
  overflowY: "scroll"
}), an = p("div", {
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
}), ln = p("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Xe = (e, n = "none") => {
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
}, O = (e, n = "none", r = ", ") => {
  const o = Xe(e, n);
  return Array.isArray(o) ? o.join(`${r}`) : o;
};
function sn(e) {
  return { __html: cn(e) };
}
function R(e, n) {
  const r = Object.keys(e).filter(
    (i) => n.includes(i) ? null : i
  ), o = new Object();
  return r.forEach((i) => {
    o[i] = e[i];
  }), o;
}
function cn(e) {
  return Et(e, {
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
const dn = p("span", {}), L = (e) => {
  const { as: n, label: r } = e, i = R(e, ["as", "label"]);
  return /* @__PURE__ */ t.createElement(dn, { as: n, ...i }, O(r, i.lang));
}, mn = (e, n = "200,", r = "full") => {
  Array.isArray(e) && (e = e[0]);
  const { id: o, service: i } = e;
  let a;
  if (!i)
    return o;
  if (Array.isArray(e.service) && e.service.length > 0 && (a = i[0]), a) {
    if (a["@id"])
      return `${a["@id"]}/${r}/${n}/0/default.jpg`;
    if (a.id)
      return `${a.id}/${r}/${n}/0/default.jpg`;
  }
}, Ee = p("img", { objectFit: "cover" }), un = (e) => {
  const n = pt(null), { contentResource: r, altAsLabel: o, region: i = "full" } = e;
  let a;
  o && (a = O(o));
  const s = R(e, ["contentResource", "altAsLabel"]), { type: d, id: c, width: u = 200, height: m = 200, duration: v } = r;
  b(() => {
    if (!c && !n.current || ["Image"].includes(d) || !c.includes("m3u8"))
      return;
    const y = new z();
    return n.current && (y.attachMedia(n.current), y.on(z.Events.MEDIA_ATTACHED, function() {
      y.loadSource(c);
    })), y.on(z.Events.ERROR, function(g, x) {
      if (x.fatal)
        switch (x.type) {
          case z.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${g} network error encountered, try to recover`
            ), y.startLoad();
            break;
          case z.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${g} media error encountered, try to recover`
            ), y.recoverMediaError();
            break;
          default:
            y.destroy();
            break;
        }
    }), () => {
      y && (y.detachMedia(), y.destroy());
    };
  }, [c, d]);
  const f = te(() => {
    if (!n.current)
      return;
    let y = 0, g = 30;
    if (v && (g = v), !c.split("#t=") && v && (y = v * 0.1), c.split("#t=").pop()) {
      const E = c.split("#t=").pop();
      E && (y = parseInt(E.split(",")[0]));
    }
    const x = n.current;
    x.autoplay = !0, x.currentTime = y, setTimeout(() => f(), g * 1e3);
  }, [v, c]);
  b(() => f(), [f]);
  const h = mn(
    r,
    `${u},${m}`,
    i
  );
  switch (d) {
    case "Image":
      return /* @__PURE__ */ t.createElement(
        Ee,
        {
          as: "img",
          alt: a,
          css: { width: u, height: m },
          key: c,
          src: h,
          ...s
        }
      );
    case "Video":
      return /* @__PURE__ */ t.createElement(
        Ee,
        {
          as: "video",
          css: { width: u, height: m },
          disablePictureInPicture: !0,
          key: c,
          loop: !0,
          muted: !0,
          onPause: f,
          ref: n,
          src: c
        }
      );
    default:
      return console.warn(
        `Resource type: ${d} is not valid or not yet supported in Primitives.`
      ), /* @__PURE__ */ t.createElement(t.Fragment, null);
  }
}, pn = p("a", {}), fn = (e) => {
  const { children: n, homepage: r } = e, i = R(e, ["children", "homepage"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, r && r.map((a) => {
    const l = O(
      a.label,
      i.lang
    );
    return /* @__PURE__ */ t.createElement(
      pn,
      {
        "aria-label": n ? l : void 0,
        href: a.id,
        key: a.id,
        ...i
      },
      n || l
    );
  }));
}, gn = {
  delimiter: ", "
}, he = ft(void 0), Je = () => {
  const e = gt(he);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, ve = ({
  children: e,
  initialState: n = gn
}) => {
  const r = hn(n, "delimiter");
  return /* @__PURE__ */ t.createElement(he.Provider, { value: { delimiter: r } }, e);
}, hn = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, vn = p("span", {}), Se = (e) => {
  const { as: n, markup: r } = e, { delimiter: o } = Je();
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = R(e, ["as", "markup"]), l = sn(
    O(r, a.lang, o)
  );
  return /* @__PURE__ */ t.createElement(vn, { as: n, ...a, dangerouslySetInnerHTML: l });
}, Ye = (e) => t.useContext(he) ? /* @__PURE__ */ t.createElement(Se, { ...e }) : /* @__PURE__ */ t.createElement(ve, null, /* @__PURE__ */ t.createElement(Se, { ...e })), yn = ({ as: e = "dd", lang: n, value: r }) => /* @__PURE__ */ t.createElement(Ye, { markup: r, as: e, lang: n }), xn = p("span", {}), bn = ({
  as: e = "dd",
  customValueContent: n,
  lang: r,
  value: o
}) => {
  var l;
  const { delimiter: i } = Je(), a = (l = Xe(o, r)) == null ? void 0 : l.map((s) => ht(n, {
    value: s
  }));
  return /* @__PURE__ */ t.createElement(xn, { as: e, lang: r }, a == null ? void 0 : a.map((s, d) => [
    d > 0 && `${i}`,
    /* @__PURE__ */ t.createElement(vt, { key: d }, s)
  ]));
}, Ke = (e) => {
  var s;
  const { item: n, lang: r, customValueContent: o } = e, { label: i, value: a } = n, l = (s = O(i)) == null ? void 0 : s.replace(" ", "-").toLowerCase();
  return /* @__PURE__ */ t.createElement("div", { role: "group", "data-label": l }, /* @__PURE__ */ t.createElement(L, { as: "dt", label: i, lang: r }), o ? /* @__PURE__ */ t.createElement(
    bn,
    {
      as: "dd",
      customValueContent: o,
      value: a,
      lang: r
    }
  ) : /* @__PURE__ */ t.createElement(yn, { as: "dd", value: a, lang: r }));
};
function wn(e, n) {
  const r = n.filter((o) => {
    const { matchingLabel: i } = o, a = Object.keys(o.matchingLabel)[0], l = O(i, a);
    if (O(e, a) === l)
      return !0;
  }).map((o) => o.Content);
  if (Array.isArray(r))
    return r[0];
}
const En = p("dl", {}), Sn = (e) => {
  const { as: n, customValueContent: r, metadata: o } = e;
  if (!Array.isArray(o))
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const i = Ve(e, "customValueDelimiter"), l = R(e, [
    "as",
    "customValueContent",
    "customValueDelimiter",
    "metadata"
  ]);
  return /* @__PURE__ */ t.createElement(
    ve,
    {
      ...typeof i == "string" ? { initialState: { delimiter: i } } : void 0
    },
    o.length > 0 && /* @__PURE__ */ t.createElement(En, { as: n, ...l }, o.map((s, d) => {
      const c = r ? wn(s.label, r) : void 0;
      return /* @__PURE__ */ t.createElement(
        Ke,
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
p("li", {});
p("ul", {});
const Cn = p("dl", {}), kn = (e) => {
  const { as: n, requiredStatement: r } = e;
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = Ve(e, "customValueDelimiter"), a = R(e, ["as", "customValueDelimiter", "requiredStatement"]);
  return /* @__PURE__ */ t.createElement(
    ve,
    {
      ...typeof o == "string" ? { initialState: { delimiter: o } } : void 0
    },
    /* @__PURE__ */ t.createElement(Cn, { as: n, ...a }, /* @__PURE__ */ t.createElement(Ke, { item: r, lang: a.lang }))
  );
}, In = p("li", {}), $n = p("ul", {}), An = (e) => {
  const { as: n, seeAlso: r } = e, i = R(e, ["as", "seeAlso"]);
  return /* @__PURE__ */ t.createElement($n, { as: n }, r && r.map((a) => {
    const l = O(
      a.label,
      i.lang
    );
    return /* @__PURE__ */ t.createElement(In, { key: a.id }, /* @__PURE__ */ t.createElement("a", { href: a.id, ...i }, l || a.id));
  }));
}, Tn = (e) => {
  const { as: n, summary: r } = e, i = R(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ t.createElement(Ye, { as: n, markup: r, ...i });
}, Qe = (e) => {
  const { thumbnail: n, region: r } = e, i = R(e, ["thumbnail"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, n && n.map((a) => /* @__PURE__ */ t.createElement(
    un,
    {
      contentResource: a,
      key: a.id,
      region: r,
      ...i
    }
  )));
}, Mn = ({
  homepage: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Homepage"), /* @__PURE__ */ t.createElement(fn, { homepage: e })), zn = ({
  id: e,
  htmlLabel: n,
  parent: r = "manifest"
}) => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, n), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank", id: `iiif-${r}-id` }, e)), Rn = ({
  metadata: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Sn, { metadata: e, id: `iiif-${n}-metadata` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), Ln = ({
  requiredStatement: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  kn,
  {
    requiredStatement: e,
    id: `iiif-${n}-required-statement`
  }
)) : /* @__PURE__ */ t.createElement(t.Fragment, null), On = ({ rights: e }) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Rights"), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank" }, e)) : /* @__PURE__ */ t.createElement(t.Fragment, null), Fn = ({ seeAlso: e }) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "See Also"), /* @__PURE__ */ t.createElement(An, { seeAlso: e })), Vn = ({
  summary: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Tn, { summary: e, as: "p", id: `iiif-${n}-summary` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), Hn = ({
  label: e,
  thumbnail: n
}) => (n == null ? void 0 : n.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  Qe,
  {
    altAsLabel: e || { none: ["resource"] },
    thumbnail: n,
    style: { backgroundColor: "#6663", objectFit: "cover" }
  }
)), Pn = () => {
  const e = k(), { activeManifest: n, vault: r } = e, [o, i] = w(), [a, l] = w([]), [s, d] = w([]), [c, u] = w([]);
  return b(() => {
    var v, f, h;
    const m = r.get(n);
    i(m), ((v = m.homepage) == null ? void 0 : v.length) > 0 && l(r.get(m.homepage)), ((f = m.seeAlso) == null ? void 0 : f.length) > 0 && d(r.get(m.seeAlso)), ((h = m.thumbnail) == null ? void 0 : h.length) > 0 && u(r.get(m.thumbnail));
  }, [n, r]), o ? /* @__PURE__ */ t.createElement(ln, null, /* @__PURE__ */ t.createElement(an, null, /* @__PURE__ */ t.createElement(Hn, { thumbnail: c, label: o.label }), /* @__PURE__ */ t.createElement(Vn, { summary: o.summary }), /* @__PURE__ */ t.createElement(Rn, { metadata: o.metadata }), /* @__PURE__ */ t.createElement(Ln, { requiredStatement: o.requiredStatement }), /* @__PURE__ */ t.createElement(On, { rights: o.rights }), /* @__PURE__ */ t.createElement(
    Mn,
    {
      homepage: a
    }
  ), /* @__PURE__ */ t.createElement(
    Fn,
    {
      seeAlso: s
    }
  ), /* @__PURE__ */ t.createElement(zn, { id: o.id, htmlLabel: "IIIF Manifest" }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, Bn = () => {
  function e(i) {
    return i.map((a) => {
      const l = a.identifier || Re();
      return { ...a, identifier: l };
    });
  }
  function n(i) {
    var d;
    const a = [], l = [], s = e(i);
    for (const c of s) {
      for (; l.length > 0 && l[l.length - 1].end <= c.start; )
        l.pop();
      l.length > 0 ? (l[l.length - 1].children || (l[l.length - 1].children = []), (d = l[l.length - 1].children) == null || d.push(c), l.push(c)) : (a.push(c), l.push(c));
    }
    return a;
  }
  function r(i, a = []) {
    return a.some(
      (l) => i.start >= l.start && i.end <= l.end
    );
  }
  function o(i = []) {
    return i.sort((a, l) => a.start - l.start);
  }
  return {
    addIdentifiersToParsedCues: e,
    createNestedCues: n,
    isChild: r,
    orderCuesByTime: o
  };
}, Ce = ge({
  from: { transform: "rotate(360deg)" },
  to: { transform: "rotate(0deg)" }
}), _n = p(re.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), et = p(re.Item, {
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
  background: "none",
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
      animationName: Ce,
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
      animationName: Ce,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    }
  }
}), Wn = ({ label: e, start: n, end: r }) => {
  const [o, i] = w(!1), a = document.getElementById(
    "clover-iiif-video"
  );
  b(() => (a == null || a.addEventListener("timeupdate", () => {
    const { currentTime: s } = a;
    i(n <= s && s < r);
  }), () => document.removeEventListener("timeupdate", () => {
  })), [r, n, a]);
  const l = () => {
    a && (a.pause(), a.currentTime = n, a.play());
  };
  return /* @__PURE__ */ t.createElement(
    et,
    {
      "aria-checked": o,
      "data-testid": "information-panel-cue",
      onClick: l,
      value: e
    },
    e,
    /* @__PURE__ */ t.createElement("strong", null, Oe(n))
  );
}, Nn = p("ul", {
  listStyle: "none",
  paddingLeft: "1rem",
  position: "relative",
  "&&:first-child": {
    paddingLeft: "0"
  },
  "& li ul": {
    [`& ${et}`]: {
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
}), tt = ({ items: e }) => /* @__PURE__ */ t.createElement(Nn, null, e.map((n) => {
  const { text: r, start: o, end: i, children: a, identifier: l } = n;
  return /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement(Wn, { label: r, start: o, end: i }), a && /* @__PURE__ */ t.createElement(tt, { items: a }));
})), jn = ({ resource: e }) => {
  const [n, r] = t.useState([]), { id: o, label: i } = e, { createNestedCues: a, orderCuesByTime: l } = Bn();
  return b(() => {
    o && fetch(o, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json"
      }
    }).then((s) => s.text()).then((s) => {
      const d = St(s).cues, c = l(d), u = a(c);
      r(u);
    }).catch((s) => console.error(o, s.toString()));
  }, [a, o, l]), /* @__PURE__ */ t.createElement(
    _n,
    {
      "aria-label": `navigate ${Z(i, "en")}`
    },
    /* @__PURE__ */ t.createElement(tt, { items: n })
  );
}, Dn = p("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), ke = p("div", {
  position: "relative",
  cursor: "pointer",
  padding: "0.5rem 1.618rem",
  lineHeight: "1.25em",
  "&:hover": {
    backgroundColor: "$secondaryMuted"
  }
});
function se(e, n, r, o) {
  if (!e.includes("#xywh="))
    return;
  const i = e.split("#xywh=");
  if (i && i[1]) {
    const [a, l, s, d] = i[1].split(",").map((m) => Number(m)), c = 1 / r.width, u = new N.Rect(
      a * c - s * c / 2 * (n - 1),
      l * c - d * c / 2 * (n - 1),
      s * c * n,
      d * c * n
    );
    o.viewport.fitBounds(u);
  }
}
function Gn(e, n, r, o) {
  const i = 1 / r.width, a = e.selector.x, l = e.selector.y, s = 40, d = 40, c = new N.Rect(
    a * i - s / 2 * i * n,
    l * i - d / 2 * i * n,
    s * i * n,
    d * i * n
  );
  o.viewport.fitBounds(c);
}
const qn = ({ item: e }) => {
  const n = k(), { openSeadragonViewer: r, vault: o, activeCanvas: i, configOptions: a } = n, l = o.get({
    id: i,
    type: "Canvas"
  });
  function s(u) {
    var f, h, y;
    if (!r)
      return;
    const m = JSON.parse(u.target.dataset.target), v = ((f = a.annotationOverlays) == null ? void 0 : f.zoomLevel) || 1;
    typeof m == "string" ? se(m, v, l, r) : ((h = m.selector) == null ? void 0 : h.type) === "PointSelector" ? Gn(m, v, l, r) : (y = m.selector) == null || y.type;
  }
  function d(u, m, v = 0) {
    if (u.format === "text/html")
      return /* @__PURE__ */ t.createElement("div", { key: v, dangerouslySetInnerHTML: { __html: u.value } });
    if (u.value)
      return /* @__PURE__ */ t.createElement("div", { key: v, "data-target": m }, u.value);
    if (u.type === "Image")
      return /* @__PURE__ */ t.createElement("img", { src: u.id, key: v, "data-target": m });
  }
  const c = JSON.stringify(e.target);
  return Array.isArray(e.body) ? /* @__PURE__ */ t.createElement(ke, { onClick: s, "data-target": c }, e.body.map((u, m) => d(u, c, m))) : /* @__PURE__ */ t.createElement(ke, { onClick: s, "data-target": c }, d(e.body, c));
}, Un = ({ resource: e }) => /* @__PURE__ */ t.createElement(Dn, null, e.items.map((n, r) => /* @__PURE__ */ t.createElement(qn, { key: r, item: n }))), Zn = p("ol", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  listStyle: "auto",
  margin: "0.5rem 1.618rem"
}), Ie = p("li", {
  position: "relative",
  cursor: "pointer",
  lineHeight: "1.5em",
  margin: "0 1.618rem",
  "&:hover": {
    backgroundColor: "$secondaryMuted"
  }
}), Xn = p("div", {
  margin: "0 1.618rem"
}), Jn = ({
  item: e,
  activeTarget: n,
  setActiveTarget: r
}) => {
  const o = H(), i = k(), { openSeadragonViewer: a, vault: l, activeCanvas: s, configOptions: d } = i, c = l.get({
    id: s,
    type: "Canvas"
  });
  b(() => {
    var h;
    if (!a || e.target != n)
      return;
    const f = ((h = d.annotationOverlays) == null ? void 0 : h.zoomLevel) || 1;
    typeof e.target == "string" && se(e.target, f, c, a);
  }, [a]);
  function u(f) {
    var g;
    if (!a)
      return;
    const h = JSON.parse(f.target.dataset.target), y = f.target.dataset.canvas;
    if (s === y) {
      const x = ((g = d.annotationOverlays) == null ? void 0 : g.zoomLevel) || 1;
      typeof h == "string" && se(h, x, c, a);
    } else
      o({
        type: "updateActiveCanvas",
        canvasId: y
      }), r(h);
  }
  function m(f, h, y, g = 0) {
    if (f.value)
      return /* @__PURE__ */ t.createElement("span", { key: g, "data-target": h, "data-canvas": y }, f.value);
  }
  const v = JSON.stringify(e.target);
  return Array.isArray(e.body) ? /* @__PURE__ */ t.createElement(
    Ie,
    {
      onClick: u,
      "data-target": v,
      "data-canvas": e.canvas
    },
    e.body.map(
      (f, h) => m(f, v, e.canvas, h)
    )
  ) : /* @__PURE__ */ t.createElement(
    Ie,
    {
      onClick: u,
      "data-target": v,
      "data-canvas": e.canvas
    },
    m(e.body, v, e.canvas)
  );
}, Yn = ({
  contentSearchResource: e
}) => {
  const [n, r] = w();
  return Object.keys(e.items).length === 0 ? /* @__PURE__ */ t.createElement(Xn, null, "No search results") : /* @__PURE__ */ t.createElement("div", null, Object.entries(e.items).map(
    ([o, i], a) => /* @__PURE__ */ t.createElement(Zn, { key: a }, o, i && i.map((l, s) => /* @__PURE__ */ t.createElement(
      Jn,
      {
        key: s,
        item: l,
        activeTarget: n,
        setActiveTarget: r
      }
    )))
  ));
}, Kn = ({
  activeCanvas: e,
  resources: n,
  annotationResources: r,
  contentSearchResource: o
}) => {
  var f;
  const i = k(), { configOptions: a } = i, { informationPanel: l } = a, [s, d] = w(), c = (l == null ? void 0 : l.renderAbout) || ((f = a == null ? void 0 : a.informationPanel) == null ? void 0 : f.renderAbout), u = l == null ? void 0 : l.renderSupplementing, m = l == null ? void 0 : l.renderAnnotation;
  b(() => {
    s || (c ? d("manifest-about") : n && (n == null ? void 0 : n.length) > 0 && !c ? d(n[0].id) : r && (r == null ? void 0 : r.length) > 0 && !c ? d(r[0].id) : o && d(o.id));
  }, [
    s,
    e,
    c,
    n,
    r,
    o
  ]);
  const v = (h) => {
    d(h);
  };
  return n ? /* @__PURE__ */ t.createElement(
    nn,
    {
      "data-testid": "information-panel",
      defaultValue: s,
      onValueChange: v,
      orientation: "horizontal",
      value: s,
      className: "clover-viewer-information-panel"
    },
    /* @__PURE__ */ t.createElement(rn, { "aria-label": "select chapter", "data-testid": "information-panel-list" }, c && /* @__PURE__ */ t.createElement(K, { value: "manifest-about" }, "About"), u && n && n.map(({ id: h, label: y }) => /* @__PURE__ */ t.createElement(K, { key: h, value: h }, /* @__PURE__ */ t.createElement(L, { label: y }))), m && r && r.map((h, y) => /* @__PURE__ */ t.createElement(K, { key: y, value: h.id }, /* @__PURE__ */ t.createElement(L, { label: h.label }))), o && /* @__PURE__ */ t.createElement(K, { value: o.id }, /* @__PURE__ */ t.createElement(L, { label: o.label }))),
    /* @__PURE__ */ t.createElement(on, null, c && /* @__PURE__ */ t.createElement(Q, { value: "manifest-about" }, /* @__PURE__ */ t.createElement(Pn, null)), u && n && n.map((h) => /* @__PURE__ */ t.createElement(Q, { key: h.id, value: h.id }, /* @__PURE__ */ t.createElement(jn, { resource: h }))), m && r && r.map((h) => /* @__PURE__ */ t.createElement(Q, { key: h.id, value: h.id }, /* @__PURE__ */ t.createElement(Un, { resource: h }))), o && /* @__PURE__ */ t.createElement(Q, { value: o.id }, /* @__PURE__ */ t.createElement(
      Yn,
      {
        contentSearchResource: o
      }
    )))
  ) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, nt = p("div", {
  position: "absolute",
  right: "1rem",
  top: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: "1"
}), Qn = p("input", {
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
}), ie = p("button", {
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
}), er = p("div", {
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
}), tr = p("div", {
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
        [`& ${nt}`]: {
          width: "calc(100% - 2rem)",
          "@sm": {
            width: "calc(100% - 2rem)"
          }
        }
      }
    }
  }
}), nr = (e, n) => {
  b(() => {
    function r(o) {
      o.key === e && n();
    }
    return window.addEventListener("keyup", r), () => window.removeEventListener("keyup", r);
  }, []);
}, rr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Back"), /* @__PURE__ */ t.createElement(
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
)), or = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Forward"), /* @__PURE__ */ t.createElement(
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
)), ar = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Close"), /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })), ir = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })), lr = ({
  handleCanvasToggle: e,
  handleFilter: n,
  activeIndex: r,
  canvasLength: o
}) => {
  const [i, a] = w(!1), [l, s] = w(!1), [d, c] = w(!1);
  b(() => {
    c(r === 0), r === o - 1 ? s(!0) : s(!1);
  }, [r, o]), nr("Escape", () => {
    a(!1), n("");
  });
  const u = () => {
    a((v) => !v), n("");
  }, m = (v) => n(v.target.value);
  return /* @__PURE__ */ t.createElement(tr, { isToggle: i }, /* @__PURE__ */ t.createElement(nt, null, i && /* @__PURE__ */ t.createElement(Qn, { autoFocus: !0, onChange: m, placeholder: "Search" }), !i && /* @__PURE__ */ t.createElement(er, null, /* @__PURE__ */ t.createElement(
    ie,
    {
      onClick: () => e(-1),
      disabled: d,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(rr, null)
  ), /* @__PURE__ */ t.createElement("span", null, r + 1, " of ", o), /* @__PURE__ */ t.createElement(
    ie,
    {
      onClick: () => e(1),
      disabled: l,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(or, null)
  )), /* @__PURE__ */ t.createElement(ie, { onClick: u, type: "button" }, i ? /* @__PURE__ */ t.createElement(ar, null) : /* @__PURE__ */ t.createElement(ir, null))));
}, sr = p(re.Root, {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  padding: "1.618rem",
  overflowX: "scroll",
  position: "relative",
  zIndex: "0"
}), cr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M256 112v288M400 256H112"
  }
), dr = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z" }), /* @__PURE__ */ t.createElement("path", { d: "M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z" }), /* @__PURE__ */ t.createElement("path", { d: "M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z" })), mr = () => /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" }), ur = () => /* @__PURE__ */ t.createElement("path", { d: "M416 64H96a64.07 64.07 0 00-64 64v256a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V128a64.07 64.07 0 00-64-64zm-80 64a48 48 0 11-48 48 48.05 48.05 0 0148-48zM96 416a32 32 0 01-32-32v-67.63l94.84-84.3a48.06 48.06 0 0165.8 1.9l64.95 64.81L172.37 416zm352-32a32 32 0 01-32 32H217.63l121.42-121.42a47.72 47.72 0 0161.64-.16L448 333.84z" }), pr = () => /* @__PURE__ */ t.createElement("path", { d: "M464 384.39a32 32 0 01-13-2.77 15.77 15.77 0 01-2.71-1.54l-82.71-58.22A32 32 0 01352 295.7v-79.4a32 32 0 0113.58-26.16l82.71-58.22a15.77 15.77 0 012.71-1.54 32 32 0 0145 29.24v192.76a32 32 0 01-32 32zM268 400H84a68.07 68.07 0 01-68-68V180a68.07 68.07 0 0168-68h184.48A67.6 67.6 0 01336 179.52V332a68.07 68.07 0 01-68 68z" }), rt = p("svg", {
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
}), fr = ({ children: e }) => /* @__PURE__ */ t.createElement("title", null, e), I = (e) => /* @__PURE__ */ t.createElement(
  rt,
  {
    ...e,
    "data-testid": "icon-svg",
    role: "img",
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg"
  },
  e.children
);
I.Title = fr;
I.Add = cr;
I.Audio = dr;
I.Close = mr;
I.Image = ur;
I.Video = pr;
const gr = ge({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), hr = ge({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), ot = p(q.Arrow, {
  fill: "$secondaryAlt"
}), vr = p(q.Close, {
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
}), yr = p(q.Content, {
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
  '&[data-side="top"]': { animationName: hr },
  '&[data-side="bottom"]': { animationName: gr },
  /**
   *
   */
  '&[data-align="end"]': {
    [`& ${ot}`]: {
      margin: "0 0.7rem"
    }
  }
}), xr = p(q.Trigger, {
  display: "inline-flex",
  padding: "0.5rem 0",
  margin: "0 0.5rem 0 0",
  cursor: "pointer",
  border: "none",
  background: "none",
  "> button, > span": {
    margin: "0"
  }
}), br = p(q.Root, {
  boxSizing: "content-box"
}), wr = (e) => /* @__PURE__ */ t.createElement(xr, { ...e }, e.children), Er = (e) => /* @__PURE__ */ t.createElement(yr, { ...e }, /* @__PURE__ */ t.createElement(ot, null), /* @__PURE__ */ t.createElement(vr, null, /* @__PURE__ */ t.createElement(I, { isSmall: !0 }, /* @__PURE__ */ t.createElement(I.Close, null))), e.children), X = ({ children: e }) => /* @__PURE__ */ t.createElement(br, null, e);
X.Trigger = wr;
X.Content = Er;
const ce = p("div", {
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
  [`${rt}`]: {
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
}), de = p("span", {
  display: "flex"
}), Sr = p("span", {
  display: "flex",
  width: "1.2111rem",
  height: "0.7222rem"
}), Cr = p("span", {
  display: "inline-flex",
  marginLeft: "5px",
  marginBottom: "-1px"
}), kr = p(re.Item, {
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
}), Ir = ({ type: e }) => {
  switch (e) {
    case "Sound":
      return /* @__PURE__ */ t.createElement(I.Audio, null);
    case "Image":
      return /* @__PURE__ */ t.createElement(I.Image, null);
    case "Video":
      return /* @__PURE__ */ t.createElement(I.Video, null);
    default:
      return /* @__PURE__ */ t.createElement(I.Image, null);
  }
}, $r = ({
  canvas: e,
  canvasIndex: n,
  isActive: r,
  thumbnail: o,
  type: i,
  handleChange: a
}) => /* @__PURE__ */ t.createElement(
  kr,
  {
    "aria-checked": r,
    "data-testid": "media-thumbnail",
    "data-canvas": n,
    onClick: () => a(e.id),
    value: e.id
  },
  /* @__PURE__ */ t.createElement("figure", null, /* @__PURE__ */ t.createElement("div", null, (o == null ? void 0 : o.id) && /* @__PURE__ */ t.createElement(
    "img",
    {
      src: o.id,
      alt: e != null && e.label ? Z(e.label) : ""
    }
  ), /* @__PURE__ */ t.createElement(de, null, /* @__PURE__ */ t.createElement(ce, { isIcon: !0, "data-testid": "thumbnail-tag" }, /* @__PURE__ */ t.createElement(Sr, null), /* @__PURE__ */ t.createElement(I, { "aria-label": i }, /* @__PURE__ */ t.createElement(Ir, { type: i })), ["Video", "Sound"].includes(i) && /* @__PURE__ */ t.createElement(Cr, null, Oe(e.duration))))), (e == null ? void 0 : e.label) && /* @__PURE__ */ t.createElement("figcaption", { "data-testid": "fig-caption" }, /* @__PURE__ */ t.createElement(L, { label: e.label })))
), Ar = (e) => e.body ? e.body.type : "Image", Tr = ({ items: e }) => {
  const n = H(), r = k(), { activeCanvas: o, vault: i } = r, [a, l] = w(""), [s, d] = w([]), [c, u] = w(0), m = t.useRef(null), v = "painting", f = (g) => {
    o !== g && n({
      type: "updateActiveCanvas",
      canvasId: g
    });
  };
  b(() => {
    if (!s.length) {
      const g = ["Image", "Sound", "Video"], x = e.map(
        (E) => Be(i, E, v, g)
      ).filter((E) => E.annotations.length > 0);
      d(x);
    }
  }, [e, s.length, i]), b(() => {
    s.forEach((g, x) => {
      g != null && g.canvas && g.canvas.id === o && u(x);
    });
  }, [o, s]), b(() => {
    const g = document.querySelector(
      `[data-canvas="${c}"]`
    );
    if (g instanceof HTMLElement && m.current) {
      const x = g.offsetLeft - m.current.offsetWidth / 2 + g.offsetWidth / 2;
      m.current.scrollTo({ left: x, behavior: "smooth" });
    }
  }, [c]);
  const h = (g) => l(g), y = (g) => {
    const x = s[c + g];
    x != null && x.canvas && f(x.canvas.id);
  };
  return /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
    lr,
    {
      handleFilter: h,
      handleCanvasToggle: y,
      activeIndex: c,
      canvasLength: s.length
    }
  ), /* @__PURE__ */ t.createElement(sr, { "aria-label": "select item", "data-testid": "media", ref: m }, s.filter((g) => {
    var x;
    if ((x = g.canvas) != null && x.label) {
      const E = Z(g.canvas.label);
      if (Array.isArray(E))
        return E[0].toLowerCase().includes(a.toLowerCase());
    }
  }).map((g, x) => {
    var E, A;
    return /* @__PURE__ */ t.createElement(
      $r,
      {
        canvas: g.canvas,
        canvasIndex: x,
        handleChange: f,
        isActive: o === ((E = g == null ? void 0 : g.canvas) == null ? void 0 : E.id),
        key: (A = g == null ? void 0 : g.canvas) == null ? void 0 : A.id,
        thumbnail: Pt(i, g, 200, 200),
        type: Ar(g.annotations[0])
      }
    );
  })));
}, at = p("button", {
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
}), it = p("button", {
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
}), lt = p(it, {
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
}), Mr = p("div", {
  position: "relative",
  zIndex: "0",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  "&:hover": {
    [`${lt}`]: {
      backgroundColor: "$accent"
    },
    [`${at}`]: {
      backgroundColor: "#6662",
      img: {
        filter: "brightness(0.85)"
      }
    }
  }
}), zr = p("div", {}), Rr = p("svg", {
  height: "19px",
  color: "$accent",
  fill: "$accent",
  stroke: "$accent",
  display: "flex",
  margin: "0.25rem 0.85rem"
}), Lr = p(U.Trigger, {
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
}), Or = p(U.Content, {
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
}), Fr = p(U.Item, {
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
}), Vr = p(U.Label, {
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
}), st = p(U.Root, {
  position: "relative",
  zIndex: "5",
  width: "100%"
}), le = ({ direction: e, title: n }) => {
  const r = () => /* @__PURE__ */ t.createElement("path", { d: "M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" }), o = () => /* @__PURE__ */ t.createElement("path", { d: "M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" });
  return /* @__PURE__ */ t.createElement(
    Rr,
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
}, ct = ({
  children: e,
  label: n,
  maxHeight: r,
  onValueChange: o,
  value: i
}) => /* @__PURE__ */ t.createElement(st, { onValueChange: o, value: i }, /* @__PURE__ */ t.createElement(Lr, { "data-testid": "select-button" }, /* @__PURE__ */ t.createElement(Ct, { "data-testid": "select-button-value" }), /* @__PURE__ */ t.createElement(kt, null, /* @__PURE__ */ t.createElement(le, { direction: "down", title: "select" }))), /* @__PURE__ */ t.createElement(It, null, /* @__PURE__ */ t.createElement(
  Or,
  {
    css: { maxHeight: `${r} !important` },
    "data-testid": "select-content"
  },
  /* @__PURE__ */ t.createElement($t, null, /* @__PURE__ */ t.createElement(le, { direction: "up", title: "scroll up for more" })),
  /* @__PURE__ */ t.createElement(At, null, /* @__PURE__ */ t.createElement(Tt, null, n && /* @__PURE__ */ t.createElement(Vr, null, /* @__PURE__ */ t.createElement(L, { "data-testid": "select-label", label: n })), e)),
  /* @__PURE__ */ t.createElement(Mt, null, /* @__PURE__ */ t.createElement(le, { direction: "down", title: "scroll down for more" }))
))), dt = (e) => /* @__PURE__ */ t.createElement(Fr, { ...e }, e.thumbnail && /* @__PURE__ */ t.createElement(Qe, { thumbnail: e.thumbnail }), /* @__PURE__ */ t.createElement(zt, null, /* @__PURE__ */ t.createElement(L, { label: e.label })), /* @__PURE__ */ t.createElement(Rt, null)), Hr = p("div", {
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
}), Pr = p("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Br = p("div", {
  width: "100%",
  height: "61.8vh",
  maxHeight: "100vh",
  background: "black",
  backgroundSize: "contain",
  color: "white",
  position: "relative",
  zIndex: "1",
  overflow: "hidden"
}), W = ({ id: e, label: n, children: r }) => /* @__PURE__ */ t.createElement(it, { id: e, "data-testid": "openseadragon-button" }, /* @__PURE__ */ t.createElement(
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
)), _r = p("div", {
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
}), Wr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M256 112v288M400 256H112"
  }
), Nr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 256H112"
  }
), jr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
  }
), Dr = () => /* @__PURE__ */ t.createElement("path", { d: "M448 440a16 16 0 01-12.61-6.15c-22.86-29.27-44.07-51.86-73.32-67C335 352.88 301 345.59 256 344.23V424a16 16 0 01-27 11.57l-176-168a16 16 0 010-23.14l176-168A16 16 0 01256 88v80.36c74.14 3.41 129.38 30.91 164.35 81.87C449.32 292.44 464 350.9 464 424a16 16 0 01-16 16z" }), $e = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
  }
), /* @__PURE__ */ t.createElement("path", { d: "M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z" })), Gr = ({
  hasPlaceholder: e,
  options: n
}) => /* @__PURE__ */ t.createElement(
  _r,
  {
    "data-testid": "openseadragon-controls",
    hasPlaceholder: e,
    id: "openseadragon-controls"
  },
  n.showZoomControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(W, { id: "zoomIn", label: "zoom in" }, /* @__PURE__ */ t.createElement(Wr, null)), /* @__PURE__ */ t.createElement(W, { id: "zoomOut", label: "zoom out" }, /* @__PURE__ */ t.createElement(Nr, null))),
  n.showFullPageControl && /* @__PURE__ */ t.createElement(W, { id: "fullPage", label: "full page" }, /* @__PURE__ */ t.createElement(jr, null)),
  n.showRotationControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(W, { id: "rotateRight", label: "rotate right" }, /* @__PURE__ */ t.createElement($e, null)), /* @__PURE__ */ t.createElement(W, { id: "rotateLeft", label: "rotate left" }, /* @__PURE__ */ t.createElement($e, null))),
  n.showHomeControl && /* @__PURE__ */ t.createElement(W, { id: "reset", label: "reset" }, /* @__PURE__ */ t.createElement(Dr, null))
), qr = (e) => fetch(`${e.replace(/\/$/, "")}/info.json`).then((n) => n.json()).then((n) => n).catch((n) => {
  console.error(
    `The IIIF tilesource ${e.replace(
      /\/$/,
      ""
    )}/info.json failed to load: ${n}`
  );
}), Ur = (e) => {
  let n, r;
  if (Array.isArray(e) && (n = e[0], n)) {
    let o;
    "@id" in n ? o = n["@id"] : o = n.id, r = o;
  }
  return r;
}, Zr = ({ uri: e, hasPlaceholder: n, imageType: r }) => {
  const [o, i] = w(), [a, l] = w(), s = k(), { configOptions: d } = s, c = H(), u = {
    id: `openseadragon-viewport-${a}`,
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
    navigatorId: `openseadragon-navigator-${a}`,
    gestureSettingsMouse: {
      clickToZoom: !0,
      dblClickToZoom: !0,
      pinchToZoom: !0,
      scrollToZoom: !0
    },
    ...d.openSeadragon,
    ajaxWithCredentials: d.withCredentials
  };
  return b(() => {
    e !== o && (i(e), l(Re()));
  }, [o, e]), b(() => {
    if (o)
      switch (r) {
        case "simpleImage":
          const m = N(u);
          m.addSimpleImage({
            url: o
          }), c({
            type: "updateOpenSeadragonViewer",
            openSeadragonViewer: m
          });
          break;
        case "tiledImage":
          qr(o).then((v) => {
            const f = N(u);
            f.addTiledImage({
              tileSource: v
            }), c({
              type: "updateOpenSeadragonViewer",
              openSeadragonViewer: f
            });
          });
          break;
        default:
          console.warn(
            `Unable to render ${o} in OpenSeadragon as type: "${r}"`
          );
          break;
      }
  }, [o]), a ? /* @__PURE__ */ t.createElement(
    Br,
    {
      css: {
        backgroundColor: d.canvasBackgroundColor,
        height: d.canvasHeight
      },
      className: "clover-viewer-osd-wrapper",
      "data-testid": "clover-viewer-osd-wrapper"
    },
    /* @__PURE__ */ t.createElement(Gr, { hasPlaceholder: n, options: u }),
    /* @__PURE__ */ t.createElement(Hr, { id: `openseadragon-navigator-${a}` }),
    /* @__PURE__ */ t.createElement(Pr, { id: `openseadragon-viewport-${a}` })
  ) : null;
}, Xr = ({
  painting: e,
  hasPlaceholder: n
}) => {
  const [r, o] = w(), [i, a] = w();
  return b(() => {
    Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0 ? (o("tiledImage"), a(Ur(e == null ? void 0 : e.service))) : (o("simpleImage"), a(e == null ? void 0 : e.id));
  }, [e]), /* @__PURE__ */ t.createElement(
    Zr,
    {
      uri: i,
      key: i,
      hasPlaceholder: n,
      imageType: r
    }
  );
}, Jr = ({
  isMedia: e,
  label: n,
  placeholderCanvas: r,
  setIsInteractive: o
}) => {
  const { vault: i } = k(), a = ee(i, r), l = a ? a[0] : void 0, s = n ? Z(n) : ["placeholder image"];
  return /* @__PURE__ */ t.createElement(
    at,
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
}, Yr = p("canvas", {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Kr = t.forwardRef(
  (e, n) => {
    const r = t.useRef(null), o = te(() => {
      var f, h;
      if ((f = n.current) != null && f.currentTime && ((h = n.current) == null ? void 0 : h.currentTime) > 0)
        return;
      const a = n.current;
      if (!a)
        return;
      const l = new AudioContext(), s = l.createMediaElementSource(a), d = l.createAnalyser(), c = r.current;
      if (!c)
        return;
      c.width = a.offsetWidth, c.height = a.offsetHeight;
      const u = c.getContext("2d");
      s.connect(d), d.connect(l.destination), d.fftSize = 256;
      const m = d.frequencyBinCount, v = new Uint8Array(m);
      setInterval(function() {
        i(
          d,
          u,
          m,
          v,
          c.width,
          c.height
        );
      }, 20);
    }, [n]);
    t.useEffect(() => {
      !n || !n.current || (n.current.onplay = o);
    }, [o, n]);
    function i(a, l, s, d, c, u) {
      const m = c / s * 2.6;
      let v, f = 0;
      a.getByteFrequencyData(d), l.fillStyle = "#000000", l.fillRect(0, 0, c, u);
      for (let h = 0; h < s; h++)
        v = d[h] * 2, l.fillStyle = "rgba(78, 42, 132, 1)", l.fillRect(f, u - v, m, v), f += m + 6;
    }
    return /* @__PURE__ */ t.createElement(Yr, { ref: r, role: "presentation" });
  }
), Qr = p("div", {
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
}), eo = ({ resource: e, ignoreCaptionLabels: n }) => {
  const r = Z(e.label, "en");
  return Array.isArray(r) && r.some((i) => n.includes(i)) ? null : /* @__PURE__ */ t.createElement(
    "track",
    {
      key: e.id,
      src: e.id,
      label: Array.isArray(r) ? r[0] : r,
      srcLang: "en",
      "data-testid": "player-track"
    }
  );
}, to = ({ allSources: e, resources: n, painting: r }) => {
  const [o, i] = t.useState(0), [a, l] = t.useState(), s = t.useRef(null), d = (r == null ? void 0 : r.type) === "Sound", c = k(), { activeCanvas: u, configOptions: m, vault: v } = c;
  return b(() => {
    if (!r.id || !s.current)
      return;
    if (s != null && s.current) {
      const y = s.current;
      y.src = r.id, y.load();
    }
    if (r.id.split(".").pop() !== "m3u8")
      return;
    const f = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      xhrSetup: function(y, g) {
        y.withCredentials = !!m.withCredentials;
      }
    }, h = new z(f);
    return h.attachMedia(s.current), h.on(z.Events.MEDIA_ATTACHED, function() {
      h.loadSource(r.id);
    }), h.on(z.Events.ERROR, function(y, g) {
      if (g.fatal)
        switch (g.type) {
          case z.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${y} network error encountered, try to recover`
            ), h.startLoad();
            break;
          case z.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${y} media error encountered, try to recover`
            ), h.recoverMediaError();
            break;
          default:
            h.destroy();
            break;
        }
    }), () => {
      if (h && s.current) {
        const y = s.current;
        h.detachMedia(), h.destroy(), y.currentTime = 0;
      }
    };
  }, [m.withCredentials, r.id]), b(() => {
    var x, E, A, T;
    const f = v.get(u), h = (x = f.accompanyingCanvas) != null && x.id ? ee(v, (E = f.accompanyingCanvas) == null ? void 0 : E.id) : null, y = (A = f.placeholderCanvas) != null && A.id ? ee(v, (T = f.placeholderCanvas) == null ? void 0 : T.id) : null;
    !!(h && y) ? l(o === 0 ? y[0].id : h[0].id) : (h && l(h[0].id), y && l(y[0].id));
  }, [u, o, v]), b(() => {
    if (s != null && s.current) {
      const f = s.current;
      return f == null || f.addEventListener(
        "timeupdate",
        () => i(f.currentTime)
      ), () => document.removeEventListener("timeupdate", () => {
      });
    }
  }, []), /* @__PURE__ */ t.createElement(
    Qr,
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
        poster: a,
        style: {
          maxHeight: m.canvasHeight,
          position: "relative",
          zIndex: "1"
        }
      },
      e.map((f) => /* @__PURE__ */ t.createElement("source", { src: f.id, type: f.format, key: f.id })),
      n.length > 0 && n.map((f) => /* @__PURE__ */ t.createElement(
        eo,
        {
          resource: f,
          ignoreCaptionLabels: m.ignoreCaptionLabels || [],
          key: f.id
        }
      )),
      "Sorry, your browser doesn't support embedded videos."
    ),
    d && /* @__PURE__ */ t.createElement(Kr, { ref: s })
  );
}, no = () => /* @__PURE__ */ t.createElement(
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
), ro = ({ isMedia: e }) => /* @__PURE__ */ t.createElement(
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
), oo = ({
  handleToggle: e,
  isInteractive: n,
  isMedia: r
}) => /* @__PURE__ */ t.createElement(
  lt,
  {
    onClick: e,
    isInteractive: n,
    isMedia: r,
    "data-testid": "placeholder-toggle"
  },
  n ? /* @__PURE__ */ t.createElement(no, null) : /* @__PURE__ */ t.createElement(ro, { isMedia: r })
), ao = ({
  activeCanvas: e,
  isMedia: n,
  painting: r,
  resources: o
}) => {
  var T, j, J;
  const [i, a] = t.useState(0), [l, s] = t.useState(!1), { configOptions: d, customDisplays: c, vault: u } = k(), m = u.get(e), v = (T = m == null ? void 0 : m.placeholderCanvas) == null ? void 0 : T.id, f = !!v, h = (r == null ? void 0 : r.length) > 1, y = v && !l && !n, g = () => s(!l), x = (C) => {
    const M = r.findIndex((F) => F.id === C);
    a(M);
  }, E = c.find((C) => {
    var P;
    let M = !1;
    const { canvasId: F, paintingFormat: D } = C.target;
    if (Array.isArray(F) && F.length > 0 && (M = F.includes(e)), Array.isArray(D) && D.length > 0) {
      const B = ((P = r[i]) == null ? void 0 : P.format) || "";
      M = !!(B && D.includes(B));
    }
    return M;
  }), A = (j = E == null ? void 0 : E.display) == null ? void 0 : j.component;
  return /* @__PURE__ */ t.createElement(Mr, { className: "clover-viewer-painting" }, /* @__PURE__ */ t.createElement(
    zr,
    {
      style: {
        backgroundColor: d.canvasBackgroundColor,
        maxHeight: d.canvasHeight
      }
    },
    v && !n && /* @__PURE__ */ t.createElement(
      oo,
      {
        handleToggle: g,
        isInteractive: l,
        isMedia: n
      }
    ),
    y && !n && /* @__PURE__ */ t.createElement(
      Jr,
      {
        isMedia: n,
        label: m == null ? void 0 : m.label,
        placeholderCanvas: v,
        setIsInteractive: s
      }
    ),
    !y && !E && (n ? /* @__PURE__ */ t.createElement(
      to,
      {
        allSources: r,
        painting: r[i],
        resources: o
      }
    ) : r && /* @__PURE__ */ t.createElement(
      Xr,
      {
        painting: r[i],
        hasPlaceholder: f,
        key: e
      }
    )),
    !y && A && /* @__PURE__ */ t.createElement(
      A,
      {
        id: e,
        annotationBody: r[i],
        ...E == null ? void 0 : E.display.componentProps
      }
    )
  ), h && /* @__PURE__ */ t.createElement(
    ct,
    {
      value: (J = r[i]) == null ? void 0 : J.id,
      onValueChange: x,
      maxHeight: "200px"
    },
    r == null ? void 0 : r.map((C) => /* @__PURE__ */ t.createElement(
      dt,
      {
        value: C == null ? void 0 : C.id,
        key: C == null ? void 0 : C.id,
        label: C == null ? void 0 : C.label
      }
    ))
  ));
}, io = ({
  activeCanvas: e,
  painting: n,
  resources: r,
  annotationResources: o,
  contentSearchResource: i,
  items: a,
  isAudioVideo: l
}) => {
  const { informationOpen: s, configOptions: d } = k(), { informationPanel: c } = d, u = (c == null ? void 0 : c.renderAbout) || (c == null ? void 0 : c.renderSupplementing) && r.length > 0 || (c == null ? void 0 : c.renderAnnotation) || i;
  return /* @__PURE__ */ t.createElement(
    Ge,
    {
      className: "clover-viewer-content",
      "data-testid": "clover-viewer-content"
    },
    /* @__PURE__ */ t.createElement(qe, null, /* @__PURE__ */ t.createElement(
      ao,
      {
        activeCanvas: e,
        isMedia: l,
        painting: n,
        resources: r
      }
    ), u && /* @__PURE__ */ t.createElement(Ue, null, /* @__PURE__ */ t.createElement("span", null, s ? "View Items" : "More Information")), a.length > 1 && /* @__PURE__ */ t.createElement(De, { className: "clover-viewer-media-wrapper" }, /* @__PURE__ */ t.createElement(Tr, { items: a, activeItem: 0 }))),
    s && u && /* @__PURE__ */ t.createElement(en, null, /* @__PURE__ */ t.createElement(Ze, null, /* @__PURE__ */ t.createElement(
      Kn,
      {
        activeCanvas: e,
        resources: r,
        annotationResources: o,
        contentSearchResource: i
      }
    )))
  );
}, lo = p(X.Trigger, {
  width: "30px",
  padding: "5px"
}), so = p(X.Content, {
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
}), co = p("span", {
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
}), mo = p("header", {
  display: "flex",
  backgroundColor: "transparent !important",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  [`> ${st}`]: {
    flexGrow: "1",
    flexShrink: "0"
  },
  form: {
    flexGrow: "0",
    flexShrink: "1"
  }
}), uo = p("div", {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  padding: "1rem",
  flexShrink: "0",
  flexGrow: "1"
}), po = () => {
  var d;
  const e = H(), n = k(), { activeManifest: r, collection: o, configOptions: i, vault: a } = n, l = i == null ? void 0 : i.canvasHeight, s = (c) => {
    e({
      type: "updateActiveManifest",
      manifestId: c
    });
  };
  return /* @__PURE__ */ t.createElement("div", { style: { margin: "0.75rem" } }, /* @__PURE__ */ t.createElement(
    ct,
    {
      label: o.label,
      maxHeight: l,
      value: r,
      onValueChange: s
    },
    (d = o == null ? void 0 : o.items) == null ? void 0 : d.map((c) => /* @__PURE__ */ t.createElement(
      dt,
      {
        value: c.id,
        key: c.id,
        thumbnail: c != null && c.thumbnail ? a.get(c == null ? void 0 : c.thumbnail) : void 0,
        label: c.label
      }
    ))
  ));
}, fo = (e, n = 2500) => {
  const [r, o] = w(), i = te(() => {
    navigator.clipboard.writeText(e).then(
      () => o("copied"),
      () => o("failed")
    );
  }, [e]);
  return b(() => {
    if (!r)
      return;
    const a = setTimeout(() => o(void 0), n);
    return () => clearTimeout(a);
  }, [r]), [r, i];
}, go = p("span", {
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
}), ho = ({ status: e }) => e ? /* @__PURE__ */ t.createElement(go, { "data-copy-status": e }, e) : null, Ae = ({
  textPrompt: e,
  textToCopy: n
}) => {
  const [r, o] = fo(n);
  return /* @__PURE__ */ t.createElement("button", { onClick: o }, e, " ", /* @__PURE__ */ t.createElement(ho, { status: r }));
}, vo = () => {
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
}, yo = p(Le.Root, {
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
}), xo = p(Le.Thumb, {
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
}), bo = p("label", {
  fontSize: "0.8333rem",
  fontWeight: "400",
  lineHeight: "1em",
  userSelect: "none",
  cursor: "pointer",
  paddingRight: "0.618rem"
}), wo = p("form", {
  display: "flex",
  flexShrink: "0",
  flexGrow: "1",
  alignItems: "center",
  marginLeft: "1.618rem"
}), Eo = () => {
  var i;
  const { configOptions: e } = k(), n = H(), [r, o] = w((i = e == null ? void 0 : e.informationPanel) == null ? void 0 : i.open);
  return b(() => {
    n({
      type: "updateInformationOpen",
      informationOpen: r
    });
  }, [r]), /* @__PURE__ */ t.createElement(wo, null, /* @__PURE__ */ t.createElement(bo, { htmlFor: "information-toggle", css: r ? { opacity: "1" } : {} }, "More Information"), /* @__PURE__ */ t.createElement(
    yo,
    {
      checked: r,
      onCheckedChange: () => o(!r),
      id: "information-toggle",
      "aria-label": "information panel toggle",
      name: "toggled?"
    },
    /* @__PURE__ */ t.createElement(xo, null)
  ));
}, mt = (e) => {
  const n = () => window.matchMedia ? window.matchMedia(e).matches : !1, [r, o] = w(n);
  return b(() => {
    const i = () => o(n);
    return window.addEventListener("resize", i), () => window.removeEventListener("resize", i);
  }), r;
}, So = ({ manifestId: e, manifestLabel: n }) => {
  const r = k(), { collection: o, configOptions: i } = r, { showTitle: a, showIIIFBadge: l, informationPanel: s } = i, d = l || (s == null ? void 0 : s.renderToggle), c = mt(fe.sm);
  return /* @__PURE__ */ t.createElement(mo, { className: "clover-viewer-header" }, o != null && o.items ? /* @__PURE__ */ t.createElement(po, null) : /* @__PURE__ */ t.createElement(co, { className: a ? "" : "visually-hidden" }, a && /* @__PURE__ */ t.createElement(L, { label: n, className: "label" })), d && /* @__PURE__ */ t.createElement(uo, null, l && /* @__PURE__ */ t.createElement(X, null, /* @__PURE__ */ t.createElement(lo, null, /* @__PURE__ */ t.createElement(vo, null)), /* @__PURE__ */ t.createElement(so, null, (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (u) => {
        u.preventDefault(), window.open(o.id, "_blank");
      }
    },
    "View Collection"
  ), /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (u) => {
        u.preventDefault(), window.open(e, "_blank");
      }
    },
    "View Manifest"
  ), " ", (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    Ae,
    {
      textPrompt: "Copy Collection URL",
      textToCopy: o.id
    }
  ), /* @__PURE__ */ t.createElement(
    Ae,
    {
      textPrompt: "Copy Manifest URL",
      textToCopy: e
    }
  ))), (s == null ? void 0 : s.renderToggle) && !c && /* @__PURE__ */ t.createElement(Eo, null)));
}, Co = (e = !1) => {
  const [n, r] = w(e);
  return yt(() => {
    if (!n)
      return;
    const o = document.documentElement.style.overflow;
    return document.documentElement.style.overflow = "hidden", () => {
      document.documentElement.style.overflow = o;
    };
  }, [n]), b(() => {
    n !== e && r(e);
  }, [e]), [n, r];
}, ko = ({
  searchServiceUrl: e,
  setContentSearchResource: n
}) => {
  const [r, o] = w(), i = k(), { vault: a, openSeadragonViewer: l, activeManifest: s } = i, d = a.get({
    id: s,
    type: "Manifest"
  }), c = _e(a, d);
  async function u(v) {
    if (v.preventDefault(), !l || !r || r.trim() === "")
      return;
    const f = e + "?q=" + r.trim(), y = await (await fetch(f)).json();
    We(y, c).then((g) => {
      n(g);
    }).catch((g) => console.log(g));
  }
  const m = (v) => {
    v.preventDefault(), o(v.target.value);
  };
  return /* @__PURE__ */ t.createElement("div", null, /* @__PURE__ */ t.createElement(G.Root, { onSubmit: u }, /* @__PURE__ */ t.createElement(G.Field, { name: "searchTerms", onChange: m }, /* @__PURE__ */ t.createElement(G.Label, null, "Search"), /* @__PURE__ */ t.createElement(
    G.Control,
    {
      placeholder: "Search",
      className: "nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current"
    }
  )), /* @__PURE__ */ t.createElement(G.Submit, null)));
}, Io = ({
  manifest: e,
  theme: n,
  iiifContentSearch: r
}) => {
  var ye;
  const o = k(), i = H(), {
    activeCanvas: a,
    informationOpen: l,
    vault: s,
    configOptions: d,
    openSeadragonViewer: c
  } = o, [u, m] = w(!1), [v, f] = w(!1), [h, y] = w([]), [g, x] = w([]), [E, A] = w([]), [T, j] = w(), [J, C] = Co(!1), M = mt(fe.sm), [F, D] = w(), P = te(
    (S) => {
      i({
        type: "updateInformationOpen",
        informationOpen: S
      });
    },
    [i]
  );
  b(() => {
    var S;
    (S = d == null ? void 0 : d.informationPanel) != null && S.open && P(!M);
  }, [
    M,
    (ye = d == null ? void 0 : d.informationPanel) == null ? void 0 : ye.open,
    P
  ]), b(() => {
    if (!M) {
      C(!1);
      return;
    }
    C(l);
  }, [l, M, C]), b(() => {
    const S = ee(s, a), $ = Ht(
      s,
      a,
      "text/vtt"
    );
    Bt(s, a).then((_) => {
      A(_);
    }), S && (f(
      ["Sound", "Video"].indexOf(S[0].type) > -1
    ), y(S)), x($), m(
      $.length !== 0 || E.length !== 0
    );
  }, [a, s, E.length]), b(() => {
    r !== void 0 && fetch(r).then((S) => S.json()).then((S) => {
      const $ = _e(s, e);
      return We(S, $);
    }).then((S) => {
      j(S);
    }).catch((S) => {
      console.log(S);
    });
  }, [r, e, s]), b(() => {
    if (!c || T === void 0)
      return;
    const S = s.get({
      id: a,
      type: "Canvas"
    });
    we(c, "content-search-annotations"), Object.values(T.items).forEach(($) => {
      const _ = $[0].canvas;
      _ && _ === a && be(
        c,
        S,
        d,
        $,
        "content-search-annotations"
      );
    });
  }, [c, T]), b(() => {
    var $;
    if (!c || E.length === 0)
      return;
    const S = s.get({
      id: a,
      type: "Canvas"
    });
    we(c, "annotation-overlay"), ($ = d.annotationOverlays) != null && $.renderOverlays && E.forEach((_) => {
      be(
        c,
        S,
        d,
        _.items,
        "annotation-overlay"
      );
    });
  }, [c, E]);
  const B = e.service.some(
    (S) => S.type === "SearchService2"
  );
  return b(() => {
    if (B) {
      const S = e.service.find(
        ($) => $.type === "SearchService2"
      );
      S && D(S.id);
    }
  }, [e, B]), /* @__PURE__ */ t.createElement(xt, { FallbackComponent: Qt }, /* @__PURE__ */ t.createElement(
    tn,
    {
      className: `${n} clover-viewer`,
      css: { background: d == null ? void 0 : d.background },
      "data-body-locked": J,
      "data-information-panel": u,
      "data-information-panel-open": l
    },
    /* @__PURE__ */ t.createElement(
      ue.Root,
      {
        open: l,
        onOpenChange: P
      },
      /* @__PURE__ */ t.createElement(
        So,
        {
          manifestLabel: e.label,
          manifestId: e.id
        }
      ),
      B && /* @__PURE__ */ t.createElement(
        ko,
        {
          searchServiceUrl: F,
          setContentSearchResource: j,
          activeCanvas: a
        }
      ),
      /* @__PURE__ */ t.createElement(
        io,
        {
          activeCanvas: a,
          painting: h,
          resources: g,
          annotationResources: E,
          contentSearchResource: T,
          items: e.items,
          isAudioVideo: v
        }
      )
    )
  ));
}, Te = {
  ignoreCache: !1,
  headers: {
    Accept: "application/json, text/javascript, text/plain"
  },
  timeout: 5e3,
  withCredentials: !1
};
function $o(e) {
  return {
    ok: e.status >= 200 && e.status < 300,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: e.responseText,
    json: () => JSON.parse(e.responseText)
  };
}
function Me(e, n = null) {
  return {
    ok: !1,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: n || e.statusText,
    json: () => JSON.parse(n || e.statusText)
  };
}
function Ao(e, n = Te) {
  const r = n.headers || Te.headers;
  return new Promise((o, i) => {
    const a = new XMLHttpRequest();
    a.open("get", e), a.withCredentials = n.withCredentials, r && Object.keys(r).forEach(
      (l) => a.setRequestHeader(l, r[l])
    ), a.onload = () => {
      o($o(a));
    }, a.onerror = () => {
      i(Me(a, "Failed to make request."));
    }, a.ontimeout = () => {
      i(Me(a, "Request took longer than expected."));
    }, a.send();
  });
}
const No = ({
  canvasIdCallback: e = () => {
  },
  customDisplays: n = [],
  customTheme: r,
  iiifContent: o,
  id: i,
  manifestId: a,
  options: l,
  iiifContentSearch: s
}) => {
  var c;
  let d = o;
  return i && (d = i), a && (d = a), /* @__PURE__ */ t.createElement(
    Vt,
    {
      initialState: {
        ...oe,
        customDisplays: n,
        informationOpen: !!((c = l == null ? void 0 : l.informationPanel) != null && c.open),
        vault: new me({
          customFetcher: (u) => Ao(u, {
            withCredentials: l == null ? void 0 : l.withCredentials,
            headers: l == null ? void 0 : l.requestHeaders
          }).then((m) => JSON.parse(m.data))
        })
      }
    },
    /* @__PURE__ */ t.createElement(
      To,
      {
        iiifContent: d,
        canvasIdCallback: e,
        customTheme: r,
        options: l,
        iiifContentSearch: s
      }
    )
  );
}, To = ({
  canvasIdCallback: e,
  customTheme: n,
  iiifContent: r,
  options: o,
  iiifContentSearch: i
}) => {
  const a = H(), l = k(), { activeCanvas: s, activeManifest: d, isLoaded: c, vault: u } = l, [m, v] = w(), [f, h] = w();
  let y = {};
  return n && (y = wt("custom", n)), b(() => {
    e && e(s);
  }, [s, e]), b(() => {
    d && u.loadManifest(d).then((g) => {
      h(g), a({
        type: "updateActiveCanvas",
        canvasId: g.items[0] && g.items[0].id
      });
    }).catch((g) => {
      console.error(`Manifest failed to load: ${g}`);
    }).finally(() => {
      a({
        type: "updateIsLoaded",
        isLoaded: !0
      });
    });
  }, [d, a, u]), b(() => {
    a({
      type: "updateConfigOptions",
      configOptions: o
    }), u.load(r).then((g) => {
      v(g);
    }).catch((g) => {
      console.error(
        `The IIIF resource ${r} failed to load: ${g}`
      );
    });
  }, [a, r, o, u]), b(() => {
    let g = [];
    (m == null ? void 0 : m.type) === "Collection" ? (a({
      type: "updateCollection",
      collection: m
    }), g = m.items.filter((x) => x.type === "Manifest").map((x) => x.id), g.length > 0 && a({
      type: "updateActiveManifest",
      manifestId: g[0]
    })) : (m == null ? void 0 : m.type) === "Manifest" && a({
      type: "updateActiveManifest",
      manifestId: m.id
    });
  }, [a, m]), c ? !f || !f.items ? (console.log(`The IIIF manifest ${r} failed to load.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : f.items.length === 0 ? (console.log(`The IIIF manifest ${r} does not contain canvases.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : /* @__PURE__ */ t.createElement(
    Io,
    {
      manifest: f,
      theme: y,
      key: f.id,
      iiifContentSearch: i
    }
  ) : /* @__PURE__ */ t.createElement(t.Fragment, null, "Loading");
};
export {
  No as default
};
//# sourceMappingURL=index.mjs.map
