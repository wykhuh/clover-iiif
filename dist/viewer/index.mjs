import t, { useReducer as it, useState as C, useEffect as E, useRef as lt, useCallback as q, createContext as st, useContext as ct, cloneElement as dt, Fragment as mt, useLayoutEffect as ut } from "react";
import { Vault as ke } from "@iiif/vault";
import * as oe from "@radix-ui/react-collapsible";
import { ErrorBoundary as pt } from "react-error-boundary";
import { createStitches as ft, createTheme as ht } from "@stitches/react";
import * as U from "@radix-ui/react-tabs";
import { v4 as Ie } from "uuid";
import * as Z from "@radix-ui/react-radio-group";
import { parse as gt } from "node-webvtt";
import _ from "openseadragon";
import vt from "sanitize-html";
import z from "hls.js";
import * as W from "@radix-ui/react-popover";
import * as N from "@radix-ui/react-select";
import { SelectValue as yt, SelectIcon as xt, SelectPortal as bt, SelectScrollUpButton as wt, SelectViewport as Et, SelectGroup as Ct, SelectScrollDownButton as St, SelectItemText as kt, SelectItemIndicator as It } from "@radix-ui/react-select";
import * as $e from "@radix-ui/react-switch";
const $t = (e) => {
  const n = e.toString().split(":"), r = Math.ceil(parseInt(n[0])), o = Math.ceil(parseInt(n[1])), a = At(Math.ceil(parseInt(n[2])), 2);
  let s = `${r !== 0 && o < 10 ? (o + "").padStart(2, "0") : o}:${a}`;
  return r !== 0 && (s = `${r}:${s}`), s;
}, Ae = (e) => {
  const n = new Date(e * 1e3).toISOString().substr(11, 8);
  return $t(n);
}, Te = (e, n) => {
  if (typeof e != "object" || e === null)
    return n;
  for (const r in n)
    typeof n[r] == "object" && n[r] !== null && !Array.isArray(n[r]) ? (e[r] || (e[r] = {}), e[r] = Te(e[r], n[r])) : e[r] = n[r];
  return e;
}, Me = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, At = (e, n) => String(e).padStart(n, "0"), j = {
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
  ignoreAnnotationOverlaysLabels: [],
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
var Se;
const X = {
  activeCanvas: "",
  activeManifest: "",
  collection: {},
  configOptions: j,
  customDisplays: [],
  plugins: [],
  informationOpen: (Se = j == null ? void 0 : j.informationPanel) == null ? void 0 : Se.open,
  isLoaded: !1,
  vault: new ke(),
  openSeadragonViewer: null
}, ze = t.createContext(X), Le = t.createContext(X);
function Tt(e, n) {
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
        configOptions: Te(e.configOptions, n.configOptions)
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
const Mt = ({
  initialState: e = X,
  children: n
}) => {
  const [r, o] = it(Tt, e);
  return /* @__PURE__ */ t.createElement(ze.Provider, { value: r }, /* @__PURE__ */ t.createElement(
    Le.Provider,
    {
      value: o
    },
    n
  ));
};
function I() {
  const e = t.useContext(ze);
  if (e === void 0)
    throw new Error("useViewerState must be used within a ViewerProvider");
  return e;
}
function O() {
  const e = t.useContext(Le);
  if (e === void 0)
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  return e;
}
const zt = async (e, n) => {
  const r = e.get({
    id: n,
    type: "Canvas"
  });
  if (!(r != null && r.annotations) || !r.annotations[0])
    return [];
  const a = e.get(r.annotations).filter((s) => s.items ? s : !1), i = [];
  for (const s of a)
    if (s.items.length > 0) {
      const l = s.label || { none: ["Annotations"] };
      i.push({ ...s, label: l });
    } else {
      let l = {};
      try {
        l = await e.load(s.id);
      } catch (d) {
        console.log(d);
      }
      if (l.items && l.items.length > 0) {
        const d = l.label || {
          none: ["Annotations"]
        };
        i.push({ ...l, label: d });
      }
    }
  return i;
}, Pe = (e, n, r, o) => {
  var s, l;
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
      const p = e.get(c.id);
      if (!p)
        return;
      switch (r) {
        case "painting":
          return d.target === n.id && d.motivation && d.motivation[0] === "painting" && o.includes(p.type) && (d.body = p), !!d;
        case "supplementing":
          return;
        default:
          throw new Error("Invalid annotation motivation.");
      }
    }
  };
  if (a.canvas = e.get(n), a.canvas && (a.annotationPage = e.get(a.canvas.items[0]), a.accompanyingCanvas = (s = a.canvas) != null && s.accompanyingCanvas ? e.get((l = a.canvas) == null ? void 0 : l.accompanyingCanvas) : void 0), a.annotationPage) {
    const d = e.get(a.annotationPage.items).map((p) => ({
      body: e.get(p.body[0].id),
      motivation: p.motivation,
      type: "Annotation"
    })), c = [];
    d.forEach((p) => {
      p.body.type === "Choice" ? p.body.items.forEach(
        (m) => c.push({
          ...p,
          id: m.id,
          body: e.get(m.id)
        })
      ) : c.push(p);
    }), a.annotations = c.filter(i);
  }
  return a;
}, B = (e, n = "en") => {
  if (!e)
    return "";
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return e[n];
}, G = (e, n) => {
  const r = Pe(
    e,
    { id: n, type: "Canvas" },
    "painting",
    ["Image", "Sound", "Video"]
  );
  if (r.annotations.length !== 0 && r.annotations && r.annotations)
    return r.annotations.map(
      (o) => o == null ? void 0 : o.body
    );
}, Lt = (e, n, r, o) => {
  const a = [];
  if (n.canvas && n.canvas.thumbnail.length > 0) {
    const l = e.get(
      n.canvas.thumbnail[0]
    );
    a.push(l);
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
    const l = n.annotations[0].body;
    l.type === "Image" && a.push(l);
  }
  return a.length === 0 ? void 0 : {
    id: a[0].id,
    format: a[0].format,
    type: a[0].type,
    width: r,
    height: o
  };
}, K = 209, Pt = {
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
    accent: `hsl(${K} 100% 38.2%)`,
    accentMuted: `hsl(${K} 80% 61.8%)`,
    accentAlt: `hsl(${K} 80% 30%)`,
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
}, ae = {
  xxs: "(max-width: 349px)",
  xs: "(max-width: 575px)",
  sm: "(max-width: 767px)",
  md: "(max-width: 991px)",
  lg: "(max-width: 90rem)",
  xl: "(min-width: calc(90rem + 1px))"
}, { styled: u, css: Mo, keyframes: ie, createTheme: zo } = ft({
  theme: Pt,
  media: ae
}), Ft = u("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}), Ot = u("p", {
  fontWeight: "bold",
  fontSize: "x-large"
}), Rt = u("span", {
  fontSize: "medium"
}), Vt = ({ error: e }) => {
  const { message: n } = e;
  return /* @__PURE__ */ t.createElement(Ft, { role: "alert" }, /* @__PURE__ */ t.createElement(Ot, { "data-testid": "headline" }, "Something went wrong"), n && /* @__PURE__ */ t.createElement(Rt, null, `Error message: ${n}`, " "));
}, Fe = u("div", {
  position: "relative",
  zIndex: "0"
}), Oe = u("div", {
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
  "@sm": {
    flexDirection: "column"
  }
}), Re = u("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  width: "61.8%",
  "@sm": {
    width: "100%"
  }
}), Ve = u(oe.Trigger, {
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
}), He = u(oe.Content, {
  width: "100%",
  display: "flex"
}), Ht = u("aside", {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  width: "38.2%",
  maxHeight: "100%",
  "@sm": {
    width: "100%"
  }
}), Bt = u("div", {
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
      [`& ${Oe}`]: {
        flexGrow: "1"
      },
      [`& ${Re}`]: {
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
      [`& ${Fe}`]: {
        display: "none"
      },
      [`& ${Ve}`]: {
        margin: "1rem"
      },
      [`& ${He}`]: {
        height: "100%"
      }
    }
  }
}), _t = u(U.Root, {
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
}), Wt = u(U.List, {
  display: "flex",
  flexGrow: "0",
  margin: "0 1.618rem",
  borderBottom: "4px solid #6663",
  "@sm": {
    margin: "0 1rem"
  }
}), J = u(U.Trigger, {
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
}), Q = u(U.Content, {
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
}), Nt = u("div", {
  position: "relative",
  height: "100%",
  width: "100%",
  overflowY: "scroll"
}), Be = {
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
}, _e = u("button", {
  textAlign: "left",
  "&:hover": {
    color: "$accent"
  }
}), Dt = u("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), jt = u("div", {
  ...Be
}), Gt = u("div", {
  "&:hover": {
    color: "$accent"
  }
}), ue = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(_e, { onClick: n }, e), qt = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(
  Gt,
  {
    dangerouslySetInnerHTML: { __html: e },
    onClick: n
  }
), Ut = () => {
  function e(a) {
    return a.map((i) => {
      const s = i.identifier || Ie();
      return { ...i, identifier: s };
    });
  }
  function n(a) {
    var d;
    const i = [], s = [], l = e(a);
    for (const c of l) {
      for (; s.length > 0 && s[s.length - 1].end <= c.start; )
        s.pop();
      s.length > 0 ? (s[s.length - 1].children || (s[s.length - 1].children = []), (d = s[s.length - 1].children) == null || d.push(c), s.push(c)) : (i.push(c), s.push(c));
    }
    return i;
  }
  function r(a, i = []) {
    return i.some(
      (s) => a.start >= s.start && a.end <= s.end
    );
  }
  function o(a = []) {
    return a.sort((i, s) => i.start - s.start);
  }
  return {
    addIdentifiersToParsedCues: e,
    createNestedCues: n,
    isChild: r,
    orderCuesByTime: o
  };
}, pe = ie({
  from: { transform: "rotate(360deg)" },
  to: { transform: "rotate(0deg)" }
}), Zt = u(Z.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), We = u(Z.Item, {
  ...Be,
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
      animationName: pe,
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
      animationName: pe,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    }
  }
}), Xt = ({ label: e, start: n, end: r }) => {
  const [o, a] = C(!1), i = document.getElementById(
    "clover-iiif-video"
  );
  E(() => (i == null || i.addEventListener("timeupdate", () => {
    const { currentTime: l } = i;
    a(n <= l && l < r);
  }), () => document.removeEventListener("timeupdate", () => {
  })), [r, n, i]);
  const s = () => {
    i && (i.pause(), i.currentTime = n, i.play());
  };
  return /* @__PURE__ */ t.createElement(
    We,
    {
      "aria-checked": o,
      "data-testid": "information-panel-cue",
      onClick: s,
      value: e
    },
    e,
    /* @__PURE__ */ t.createElement("strong", null, Ae(n))
  );
}, Yt = u("ul", {
  listStyle: "none",
  paddingLeft: "1rem",
  position: "relative",
  "&&:first-child": {
    paddingLeft: "0"
  },
  "& li ul": {
    [`& ${We}`]: {
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
}), Ne = ({ items: e }) => /* @__PURE__ */ t.createElement(Yt, null, e.map((n) => {
  const { text: r, start: o, end: a, children: i, identifier: s } = n;
  return /* @__PURE__ */ t.createElement("li", { key: s }, /* @__PURE__ */ t.createElement(Xt, { label: r, start: o, end: a }), i && /* @__PURE__ */ t.createElement(Ne, { items: i }));
})), Kt = ({
  label: e,
  vttUri: n
}) => {
  const [r, o] = t.useState([]), { createNestedCues: a, orderCuesByTime: i } = Ut(), [s, l] = t.useState();
  return E(() => {
    n && fetch(n, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json"
      }
    }).then((d) => d.text()).then((d) => {
      const c = gt(d).cues, p = i(c), m = a(p);
      o(m);
    }).catch((d) => {
      console.error(n, d.toString()), l(d);
    });
  }, [n]), /* @__PURE__ */ t.createElement(
    Zt,
    {
      "data-testid": "annotation-item-vtt",
      "aria-label": `navigate ${B(e, "en")}`
    },
    s && /* @__PURE__ */ t.createElement("div", { "data-testid": "error-message" }, "Network Error: ", s.toString()),
    /* @__PURE__ */ t.createElement(Ne, { items: r })
  );
}, De = (e) => {
  var r, o, a, i, s;
  let n = {
    id: typeof e == "string" ? e : e.source
  };
  if (typeof e == "string") {
    if (e.includes("#xywh=")) {
      const l = e.split("#xywh=");
      if (l && l[1]) {
        const [d, c, p, m] = l[1].split(",").map((h) => Number(h));
        n = {
          id: l[0],
          rect: {
            x: d,
            y: c,
            w: p,
            h: m
          }
        };
      }
    } else if (e.includes("#t=")) {
      const l = e.split("#t=");
      l && l[1] && (n = {
        id: l[0],
        t: l[1]
      });
    }
  } else if (typeof e == "object") {
    if (((r = e.selector) == null ? void 0 : r.type) === "PointSelector")
      n = {
        id: e.source,
        point: {
          x: e.selector.x,
          y: e.selector.y
        }
      };
    else if (((o = e.selector) == null ? void 0 : o.type) === "SvgSelector")
      n = {
        id: e.source,
        svg: e.selector.value
      };
    else if (((a = e.selector) == null ? void 0 : a.type) === "FragmentSelector" && (i = e.selector) != null && i.value.includes("xywh=") && e.source.type == "Canvas" && e.source.id) {
      const l = (s = e.selector) == null ? void 0 : s.value.split("xywh=");
      if (l && l[1]) {
        const [d, c, p, m] = l[1].split(",").map((h) => Number(h));
        n = {
          id: e.source.id,
          rect: {
            x: d,
            y: c,
            w: p,
            h: m
          }
        };
      }
    }
  }
  return n;
}, Jt = (e, n, r) => {
  const o = [];
  return e.filter((a) => {
    if (a.label) {
      const i = B(a.label);
      if (Array.isArray(i))
        return !i.some(
          (s) => {
            var l;
            return (l = r.ignoreAnnotationOverlaysLabels) == null ? void 0 : l.includes(s);
          }
        );
    }
    return !0;
  }).forEach((a) => {
    var i;
    (i = a == null ? void 0 : a.items) == null || i.forEach((s) => {
      const l = n.get(s.id);
      o.push(l);
    });
  }), o;
};
let R = window.OpenSeadragon;
if (!R && (R = _, !R))
  throw new Error("OpenSeadragon is missing.");
const fe = "http://www.w3.org/2000/svg";
R.Viewer && (R.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new le(this), this._svgOverlayInfo);
});
const le = function(e) {
  const n = this;
  this._viewer = e, this._containerWidth = 0, this._containerHeight = 0, this._svg = document.createElementNS(fe, "svg"), this._svg.style.position = "absolute", this._svg.style.left = 0, this._svg.style.top = 0, this._svg.style.width = "100%", this._svg.style.height = "100%", this._viewer.canvas.appendChild(this._svg), this._node = document.createElementNS(fe, "g"), this._svg.appendChild(this._node), this._viewer.addHandler("animation", function() {
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
le.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new R.Point(0, 0), !0), n = this._viewer.viewport.getZoom(!0), r = this._viewer.viewport.getRotation(), o = this._viewer.viewport.getFlip(), a = this._viewer.viewport._containerInnerSize.x;
    let i = a * n;
    const s = i;
    o && (i = -i, e.x = -e.x + a), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + i + "," + s + ") rotate(" + r + ")"
    );
  },
  // ----------
  onClick: function(e, n) {
    new R.MouseTracker({
      element: e,
      clickHandler: n
    }).setTracking(!0);
  }
};
const Qt = (e) => new le(e);
function he(e, n, r, o) {
  if (!e)
    return;
  const a = 1 / n.width;
  o.forEach((i) => {
    if (!i.target)
      return;
    const s = De(i.target), { point: l, rect: d, svg: c } = s;
    if (d) {
      const { x: p, y: m, w: h, h: v } = d;
      tn(
        e,
        p * a,
        m * a,
        h * a,
        v * a,
        r
      );
    }
    if (l) {
      const { x: p, y: m } = l, h = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${p}" cy="${m}" r="20" />
        </svg>
      `;
      ge(e, h, r, a);
    }
    c && ge(e, c, r, a);
  });
}
function en(e, n, r) {
  let o, a, i = 40, s = 40;
  n.rect && (o = n.rect.x, a = n.rect.y, i = n.rect.w, s = n.rect.h), n.point && (o = n.point.x, a = n.point.y);
  const l = 1 / e.width;
  return new _.Rect(
    o * l - i * l / 2 * (r - 1),
    a * l - s * l / 2 * (r - 1),
    i * l * r,
    s * l * r
  );
}
function tn(e, n, r, o, a, i) {
  const s = new _.Rect(n, r, o, a), l = document.createElement("div");
  if (i.annotationOverlays) {
    const { backgroundColor: d, opacity: c, borderType: p, borderColor: m, borderWidth: h } = i.annotationOverlays;
    l.style.backgroundColor = d, l.style.opacity = c, l.style.border = `${p} ${h} ${m}`, l.className = "annotation-overlay";
  }
  e.addOverlay(l, s);
}
function nn(e) {
  if (!e)
    return null;
  const n = document.createElement("template");
  return n.innerHTML = e.trim(), n.content.children[0];
}
function ge(e, n, r, o) {
  const a = nn(n);
  if (a)
    for (const i of a.children)
      je(e, i, r, o);
}
function je(e, n, r, o) {
  var a;
  if (n.nodeName === "#text")
    on(n);
  else {
    const i = rn(n, r, o), s = Qt(e);
    s.node().append(i), (a = s._svg) == null || a.setAttribute("class", "annotation-overlay"), n.childNodes.forEach((l) => {
      je(e, l, r, o);
    });
  }
}
function rn(e, n, r) {
  var d, c, p, m;
  let o = !1, a = !1, i = !1, s = !1;
  const l = document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.nodeName
  );
  if (e.attributes.length > 0)
    for (let h = 0; h < e.attributes.length; h++) {
      const v = e.attributes[h];
      switch (v.name) {
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
          s = !0;
          break;
      }
      l.setAttribute(v.name, v.textContent);
    }
  return o || (l.style.stroke = (d = n.annotationOverlays) == null ? void 0 : d.borderColor), a || (l.style.strokeWidth = (c = n.annotationOverlays) == null ? void 0 : c.borderWidth), i || (l.style.fill = (p = n.annotationOverlays) == null ? void 0 : p.backgroundColor), s || (l.style.fillOpacity = (m = n.annotationOverlays) == null ? void 0 : m.opacity), l.setAttribute("transform", `scale(${r})`), l;
}
function on(e) {
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
const an = ({
  caption: e,
  handleClick: n,
  imageUri: r
}) => /* @__PURE__ */ t.createElement(_e, { onClick: n }, /* @__PURE__ */ t.createElement("img", { src: r, alt: `A visual annotation for ${e}` }), /* @__PURE__ */ t.createElement("span", null, e)), ln = ({ annotation: e }) => {
  var v, y;
  const { target: n } = e, r = I(), { openSeadragonViewer: o, vault: a, activeCanvas: i, configOptions: s } = r, l = e.body.map((f) => a.get(f.id)), d = ((v = l.find((f) => f.format)) == null ? void 0 : v.format) || "", c = ((y = l.find((f) => f.value)) == null ? void 0 : y.value) || "", p = a.get({
    id: i,
    type: "Canvas"
  });
  function m() {
    var S;
    if (!n)
      return;
    const f = ((S = s.annotationOverlays) == null ? void 0 : S.zoomLevel) || 1, g = De(n), { point: b, rect: w, svg: x } = g;
    if (b || w || x) {
      const $ = en(
        p,
        g,
        f
      );
      o == null || o.viewport.fitBounds($);
    }
  }
  function h() {
    var f, g;
    switch (d) {
      case "text/plain":
        return /* @__PURE__ */ t.createElement(
          ue,
          {
            value: c,
            handleClick: m
          }
        );
      case "text/html":
        return /* @__PURE__ */ t.createElement(
          qt,
          {
            value: c,
            handleClick: m
          }
        );
      case "text/vtt":
        return /* @__PURE__ */ t.createElement(
          Kt,
          {
            label: l[0].label,
            vttUri: l[0].id || ""
          }
        );
      case ((f = d.match(/^image\//)) == null ? void 0 : f.input):
        const b = ((g = l.find((w) => {
          var x;
          return !((x = w.id) != null && x.includes("vault://"));
        })) == null ? void 0 : g.id) || "";
        return /* @__PURE__ */ t.createElement(
          an,
          {
            caption: c,
            handleClick: m,
            imageUri: b
          }
        );
      default:
        return /* @__PURE__ */ t.createElement(
          ue,
          {
            value: c,
            handleClick: m
          }
        );
    }
  }
  return /* @__PURE__ */ t.createElement(jt, null, h());
}, sn = ({ annotationPage: e }) => {
  var a;
  const n = I(), { vault: r } = n;
  if (!e || !e.items || ((a = e.items) == null ? void 0 : a.length) === 0)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = e.items.map((i) => r.get(i.id));
  return o ? /* @__PURE__ */ t.createElement(Dt, { "data-testid": "annotation-page" }, o == null ? void 0 : o.map((i) => /* @__PURE__ */ t.createElement(ln, { key: i.id, annotation: i }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, cn = u("div", {
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
}), dn = u("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Ge = (e, n = "none") => {
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
  const o = Ge(e, n);
  return Array.isArray(o) ? o.join(`${r}`) : o;
};
function mn(e) {
  return { __html: un(e) };
}
function L(e, n) {
  const r = Object.keys(e).filter(
    (a) => n.includes(a) ? null : a
  ), o = new Object();
  return r.forEach((a) => {
    o[a] = e[a];
  }), o;
}
function un(e) {
  return vt(e, {
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
const pn = u("span", {}), V = (e) => {
  const { as: n, label: r } = e, a = L(e, ["as", "label"]);
  return /* @__PURE__ */ t.createElement(pn, { as: n, ...a }, F(r, a.lang));
}, fn = (e, n = "200,", r = "full") => {
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
}, ve = u("img", { objectFit: "cover" }), hn = (e) => {
  const n = lt(null), { contentResource: r, altAsLabel: o, region: a = "full" } = e;
  let i;
  o && (i = F(o));
  const l = L(e, ["contentResource", "altAsLabel"]), { type: d, id: c, width: p = 200, height: m = 200, duration: h } = r;
  E(() => {
    if (!c && !n.current || ["Image"].includes(d) || !c.includes("m3u8"))
      return;
    const f = new z();
    return n.current && (f.attachMedia(n.current), f.on(z.Events.MEDIA_ATTACHED, function() {
      f.loadSource(c);
    })), f.on(z.Events.ERROR, function(g, b) {
      if (b.fatal)
        switch (b.type) {
          case z.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${g} network error encountered, try to recover`
            ), f.startLoad();
            break;
          case z.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${g} media error encountered, try to recover`
            ), f.recoverMediaError();
            break;
          default:
            f.destroy();
            break;
        }
    }), () => {
      f && (f.detachMedia(), f.destroy());
    };
  }, [c, d]);
  const v = q(() => {
    if (!n.current)
      return;
    let f = 0, g = 30;
    if (h && (g = h), !c.split("#t=") && h && (f = h * 0.1), c.split("#t=").pop()) {
      const w = c.split("#t=").pop();
      w && (f = parseInt(w.split(",")[0]));
    }
    const b = n.current;
    b.autoplay = !0, b.currentTime = f, setTimeout(() => v(), g * 1e3);
  }, [h, c]);
  E(() => v(), [v]);
  const y = fn(
    r,
    `${p},${m}`,
    a
  );
  switch (d) {
    case "Image":
      return /* @__PURE__ */ t.createElement(
        ve,
        {
          as: "img",
          alt: i,
          css: { width: p, height: m },
          key: c,
          src: y,
          ...l
        }
      );
    case "Video":
      return /* @__PURE__ */ t.createElement(
        ve,
        {
          as: "video",
          css: { width: p, height: m },
          disablePictureInPicture: !0,
          key: c,
          loop: !0,
          muted: !0,
          onPause: v,
          ref: n,
          src: c
        }
      );
    default:
      return console.warn(
        `Resource type: ${d} is not valid or not yet supported in Primitives.`
      ), /* @__PURE__ */ t.createElement(t.Fragment, null);
  }
}, gn = u("a", {}), vn = (e) => {
  const { children: n, homepage: r } = e, a = L(e, ["children", "homepage"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, r && r.map((i) => {
    const s = F(
      i.label,
      a.lang
    );
    return /* @__PURE__ */ t.createElement(
      gn,
      {
        "aria-label": n ? s : void 0,
        href: i.id,
        key: i.id,
        ...a
      },
      n || s
    );
  }));
}, yn = {
  delimiter: ", "
}, se = st(void 0), qe = () => {
  const e = ct(se);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, ce = ({
  children: e,
  initialState: n = yn
}) => {
  const r = xn(n, "delimiter");
  return /* @__PURE__ */ t.createElement(se.Provider, { value: { delimiter: r } }, e);
}, xn = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, bn = u("span", {}), ye = (e) => {
  const { as: n, markup: r } = e, { delimiter: o } = qe();
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const i = L(e, ["as", "markup"]), s = mn(
    F(r, i.lang, o)
  );
  return /* @__PURE__ */ t.createElement(bn, { as: n, ...i, dangerouslySetInnerHTML: s });
}, Ue = (e) => t.useContext(se) ? /* @__PURE__ */ t.createElement(ye, { ...e }) : /* @__PURE__ */ t.createElement(ce, null, /* @__PURE__ */ t.createElement(ye, { ...e })), wn = ({ as: e = "dd", lang: n, value: r }) => /* @__PURE__ */ t.createElement(Ue, { markup: r, as: e, lang: n }), En = u("span", {}), Cn = ({
  as: e = "dd",
  customValueContent: n,
  lang: r,
  value: o
}) => {
  var s;
  const { delimiter: a } = qe(), i = (s = Ge(o, r)) == null ? void 0 : s.map((l) => dt(n, {
    value: l
  }));
  return /* @__PURE__ */ t.createElement(En, { as: e, lang: r }, i == null ? void 0 : i.map((l, d) => [
    d > 0 && `${a}`,
    /* @__PURE__ */ t.createElement(mt, { key: d }, l)
  ]));
}, Ze = (e) => {
  var l;
  const { item: n, lang: r, customValueContent: o } = e, { label: a, value: i } = n, s = (l = F(a)) == null ? void 0 : l.replace(" ", "-").toLowerCase();
  return /* @__PURE__ */ t.createElement("div", { role: "group", "data-label": s }, /* @__PURE__ */ t.createElement(V, { as: "dt", label: a, lang: r }), o ? /* @__PURE__ */ t.createElement(
    Cn,
    {
      as: "dd",
      customValueContent: o,
      value: i,
      lang: r
    }
  ) : /* @__PURE__ */ t.createElement(wn, { as: "dd", value: i, lang: r }));
};
function Sn(e, n) {
  const r = n.filter((o) => {
    const { matchingLabel: a } = o, i = Object.keys(o.matchingLabel)[0], s = F(a, i);
    if (F(e, i) === s)
      return !0;
  }).map((o) => o.Content);
  if (Array.isArray(r))
    return r[0];
}
const kn = u("dl", {}), In = (e) => {
  const { as: n, customValueContent: r, metadata: o } = e;
  if (!Array.isArray(o))
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = Me(e, "customValueDelimiter"), s = L(e, [
    "as",
    "customValueContent",
    "customValueDelimiter",
    "metadata"
  ]);
  return /* @__PURE__ */ t.createElement(
    ce,
    {
      ...typeof a == "string" ? { initialState: { delimiter: a } } : void 0
    },
    o.length > 0 && /* @__PURE__ */ t.createElement(kn, { as: n, ...s }, o.map((l, d) => {
      const c = r ? Sn(l.label, r) : void 0;
      return /* @__PURE__ */ t.createElement(
        Ze,
        {
          customValueContent: c,
          item: l,
          key: d,
          lang: s == null ? void 0 : s.lang
        }
      );
    }))
  );
};
u("li", {});
u("ul", {});
const $n = u("dl", {}), An = (e) => {
  const { as: n, requiredStatement: r } = e;
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = Me(e, "customValueDelimiter"), i = L(e, ["as", "customValueDelimiter", "requiredStatement"]);
  return /* @__PURE__ */ t.createElement(
    ce,
    {
      ...typeof o == "string" ? { initialState: { delimiter: o } } : void 0
    },
    /* @__PURE__ */ t.createElement($n, { as: n, ...i }, /* @__PURE__ */ t.createElement(Ze, { item: r, lang: i.lang }))
  );
}, Tn = u("li", {}), Mn = u("ul", {}), zn = (e) => {
  const { as: n, seeAlso: r } = e, a = L(e, ["as", "seeAlso"]);
  return /* @__PURE__ */ t.createElement(Mn, { as: n }, r && r.map((i) => {
    const s = F(
      i.label,
      a.lang
    );
    return /* @__PURE__ */ t.createElement(Tn, { key: i.id }, /* @__PURE__ */ t.createElement("a", { href: i.id, ...a }, s || i.id));
  }));
}, Ln = (e) => {
  const { as: n, summary: r } = e, a = L(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ t.createElement(Ue, { as: n, markup: r, ...a });
}, Xe = (e) => {
  const { thumbnail: n, region: r } = e, a = L(e, ["thumbnail"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, n && n.map((i) => /* @__PURE__ */ t.createElement(
    hn,
    {
      contentResource: i,
      key: i.id,
      region: r,
      ...a
    }
  )));
}, Pn = ({
  homepage: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Homepage"), /* @__PURE__ */ t.createElement(vn, { homepage: e })), Fn = ({
  id: e,
  htmlLabel: n,
  parent: r = "manifest"
}) => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, n), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank", id: `iiif-${r}-id` }, e)), On = ({
  metadata: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(In, { metadata: e, id: `iiif-${n}-metadata` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), Rn = ({
  requiredStatement: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  An,
  {
    requiredStatement: e,
    id: `iiif-${n}-required-statement`
  }
)) : /* @__PURE__ */ t.createElement(t.Fragment, null), Vn = ({ rights: e }) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Rights"), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank" }, e)) : /* @__PURE__ */ t.createElement(t.Fragment, null), Hn = ({ seeAlso: e }) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "See Also"), /* @__PURE__ */ t.createElement(zn, { seeAlso: e })), Bn = ({
  summary: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Ln, { summary: e, as: "p", id: `iiif-${n}-summary` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), _n = ({
  label: e,
  thumbnail: n
}) => (n == null ? void 0 : n.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  Xe,
  {
    altAsLabel: e || { none: ["resource"] },
    thumbnail: n,
    style: { backgroundColor: "#6663", objectFit: "cover" }
  }
)), Wn = () => {
  const e = I(), { activeManifest: n, vault: r } = e, [o, a] = C(), [i, s] = C([]), [l, d] = C([]), [c, p] = C([]);
  return E(() => {
    var h, v, y;
    const m = r.get(n);
    a(m), ((h = m.homepage) == null ? void 0 : h.length) > 0 && s(r.get(m.homepage)), ((v = m.seeAlso) == null ? void 0 : v.length) > 0 && d(r.get(m.seeAlso)), ((y = m.thumbnail) == null ? void 0 : y.length) > 0 && p(r.get(m.thumbnail));
  }, [n, r]), o ? /* @__PURE__ */ t.createElement(dn, null, /* @__PURE__ */ t.createElement(cn, null, /* @__PURE__ */ t.createElement(_n, { thumbnail: c, label: o.label }), /* @__PURE__ */ t.createElement(Bn, { summary: o.summary }), /* @__PURE__ */ t.createElement(On, { metadata: o.metadata }), /* @__PURE__ */ t.createElement(Rn, { requiredStatement: o.requiredStatement }), /* @__PURE__ */ t.createElement(Vn, { rights: o.rights }), /* @__PURE__ */ t.createElement(
    Pn,
    {
      homepage: i
    }
  ), /* @__PURE__ */ t.createElement(
    Hn,
    {
      seeAlso: l
    }
  ), /* @__PURE__ */ t.createElement(Fn, { id: o.id, htmlLabel: "IIIF Manifest" }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
};
function Nn(e) {
  const n = [], r = [];
  return e.forEach((o) => {
    var i, s, l;
    (i = o.informationPanel) != null && i.component && n.push(o);
    const a = (l = (s = o == null ? void 0 : o.informationPanel) == null ? void 0 : s.componentProps) == null ? void 0 : l.annotationServer;
    a && r.push(a);
  }), { pluginsWithInfoPanel: n, pluginsAnnotationPageIds: r };
}
function xe(e, n, r = void 0) {
  var i, s;
  const o = (s = (i = e == null ? void 0 : e.informationPanel) == null ? void 0 : i.componentProps) == null ? void 0 : s.annotationServer;
  let a = [];
  if (o && n && n.length > 0) {
    const l = n == null ? void 0 : n.find((d) => d.id === o);
    l && (r ? a = l.items.map((d) => {
      const c = r.get(d.id);
      return {
        ...c,
        body: c.body.map((p) => r.get(p.id))
      };
    }) : a = l.items);
  }
  return a;
}
const Dn = ({
  activeCanvas: e,
  annotationResources: n
}) => {
  const r = I(), { vault: o, openSeadragonViewer: a, configOptions: i, plugins: s, activeManifest: l } = r, { informationPanel: d } = i, [c, p] = C(), m = d == null ? void 0 : d.renderAbout, h = d == null ? void 0 : d.renderAnnotation, v = o.get({
    id: e,
    type: "Canvas"
  }), { pluginsWithInfoPanel: y, pluginsAnnotationPageIds: f } = Nn(s);
  function g(x, S) {
    var k, T;
    if (xe(x, n).length === 0 && ((k = x.informationPanel) == null ? void 0 : k.displayIfNoAnnotations) === !1)
      return /* @__PURE__ */ t.createElement(t.Fragment, null);
    const M = ((T = x.informationPanel) == null ? void 0 : T.label) || { none: [x.id] };
    return /* @__PURE__ */ t.createElement(J, { key: S, value: x.id }, /* @__PURE__ */ t.createElement(V, { label: M }));
  }
  function b(x, S) {
    var k, T, P;
    const $ = (k = x == null ? void 0 : x.informationPanel) == null ? void 0 : k.component;
    if ($ === void 0)
      return /* @__PURE__ */ t.createElement(t.Fragment, null);
    const M = xe(
      x,
      n,
      o
    );
    return M.length === 0 && ((T = x.informationPanel) == null ? void 0 : T.displayIfNoAnnotations) === !1 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(Q, { key: S, value: x.id }, /* @__PURE__ */ t.createElement(
      $,
      {
        annotations: M,
        ...(P = x == null ? void 0 : x.informationPanel) == null ? void 0 : P.componentProps,
        activeManifest: l,
        canvas: v,
        viewerConfigOptions: i,
        openSeadragonViewer: a,
        useViewerDispatch: O,
        useViewerState: I
      }
    ));
  }
  E(() => {
    c || (m ? p("manifest-about") : n && (n == null ? void 0 : n.length) > 0 && !m && p(n[0].id));
  }, [e, m, n]);
  const w = (x) => {
    p(x);
  };
  return /* @__PURE__ */ t.createElement(
    _t,
    {
      "data-testid": "information-panel",
      defaultValue: c,
      onValueChange: w,
      orientation: "horizontal",
      value: c,
      className: "clover-viewer-information-panel"
    },
    /* @__PURE__ */ t.createElement(Wt, { "aria-label": "select chapter", "data-testid": "information-panel-list" }, m && /* @__PURE__ */ t.createElement(J, { value: "manifest-about" }, "About"), h && n && n.filter((x) => !f.includes(x.id)).map((x, S) => /* @__PURE__ */ t.createElement(J, { key: S, value: x.id }, /* @__PURE__ */ t.createElement(V, { label: x.label }))), y && y.map((x, S) => g(x, S))),
    /* @__PURE__ */ t.createElement(Nt, null, m && /* @__PURE__ */ t.createElement(Q, { value: "manifest-about" }, /* @__PURE__ */ t.createElement(Wn, null)), h && n && n.filter((x) => !f.includes(x.id)).map((x) => /* @__PURE__ */ t.createElement(Q, { key: x.id, value: x.id }, /* @__PURE__ */ t.createElement(sn, { annotationPage: x }))), y && y.map(
      (x, S) => b(x, S)
    ))
  );
}, Ye = u("div", {
  position: "absolute",
  right: "1rem",
  top: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: "1"
}), jn = u("input", {
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
}), ee = u("button", {
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
}), Gn = u("div", {
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
}), qn = u("div", {
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
        [`& ${Ye}`]: {
          width: "calc(100% - 2rem)",
          "@sm": {
            width: "calc(100% - 2rem)"
          }
        }
      }
    }
  }
}), Un = (e, n) => {
  E(() => {
    function r(o) {
      o.key === e && n();
    }
    return window.addEventListener("keyup", r), () => window.removeEventListener("keyup", r);
  }, []);
}, Zn = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Back"), /* @__PURE__ */ t.createElement(
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
)), Xn = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Forward"), /* @__PURE__ */ t.createElement(
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
)), Yn = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Close"), /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })), Kn = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })), Jn = ({
  handleCanvasToggle: e,
  handleFilter: n,
  activeIndex: r,
  canvasLength: o
}) => {
  const [a, i] = C(!1), [s, l] = C(!1), [d, c] = C(!1);
  E(() => {
    c(r === 0), r === o - 1 ? l(!0) : l(!1);
  }, [r, o]), Un("Escape", () => {
    i(!1), n("");
  });
  const p = () => {
    i((h) => !h), n("");
  }, m = (h) => n(h.target.value);
  return /* @__PURE__ */ t.createElement(qn, { isToggle: a }, /* @__PURE__ */ t.createElement(Ye, null, a && /* @__PURE__ */ t.createElement(jn, { autoFocus: !0, onChange: m, placeholder: "Search" }), !a && /* @__PURE__ */ t.createElement(Gn, null, /* @__PURE__ */ t.createElement(
    ee,
    {
      onClick: () => e(-1),
      disabled: d,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(Zn, null)
  ), /* @__PURE__ */ t.createElement("span", null, r + 1, " of ", o), /* @__PURE__ */ t.createElement(
    ee,
    {
      onClick: () => e(1),
      disabled: s,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(Xn, null)
  )), /* @__PURE__ */ t.createElement(ee, { onClick: p, type: "button" }, a ? /* @__PURE__ */ t.createElement(Yn, null) : /* @__PURE__ */ t.createElement(Kn, null))));
}, Qn = u(Z.Root, {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  padding: "1.618rem",
  overflowX: "scroll",
  position: "relative",
  zIndex: "0"
}), er = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M256 112v288M400 256H112"
  }
), tr = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z" }), /* @__PURE__ */ t.createElement("path", { d: "M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z" }), /* @__PURE__ */ t.createElement("path", { d: "M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z" })), nr = () => /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" }), rr = () => /* @__PURE__ */ t.createElement("path", { d: "M416 64H96a64.07 64.07 0 00-64 64v256a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V128a64.07 64.07 0 00-64-64zm-80 64a48 48 0 11-48 48 48.05 48.05 0 0148-48zM96 416a32 32 0 01-32-32v-67.63l94.84-84.3a48.06 48.06 0 0165.8 1.9l64.95 64.81L172.37 416zm352-32a32 32 0 01-32 32H217.63l121.42-121.42a47.72 47.72 0 0161.64-.16L448 333.84z" }), or = () => /* @__PURE__ */ t.createElement("path", { d: "M464 384.39a32 32 0 01-13-2.77 15.77 15.77 0 01-2.71-1.54l-82.71-58.22A32 32 0 01352 295.7v-79.4a32 32 0 0113.58-26.16l82.71-58.22a15.77 15.77 0 012.71-1.54 32 32 0 0145 29.24v192.76a32 32 0 01-32 32zM268 400H84a68.07 68.07 0 01-68-68V180a68.07 68.07 0 0168-68h184.48A67.6 67.6 0 01336 179.52V332a68.07 68.07 0 01-68 68z" }), Ke = u("svg", {
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
}), ar = ({ children: e }) => /* @__PURE__ */ t.createElement("title", null, e), A = (e) => /* @__PURE__ */ t.createElement(
  Ke,
  {
    ...e,
    "data-testid": "icon-svg",
    role: "img",
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg"
  },
  e.children
);
A.Title = ar;
A.Add = er;
A.Audio = tr;
A.Close = nr;
A.Image = rr;
A.Video = or;
const ir = ie({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), lr = ie({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), Je = u(W.Arrow, {
  fill: "$secondaryAlt"
}), sr = u(W.Close, {
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
}), cr = u(W.Content, {
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
  '&[data-side="top"]': { animationName: lr },
  '&[data-side="bottom"]': { animationName: ir },
  /**
   *
   */
  '&[data-align="end"]': {
    [`& ${Je}`]: {
      margin: "0 0.7rem"
    }
  }
}), dr = u(W.Trigger, {
  display: "inline-flex",
  padding: "0.5rem 0",
  margin: "0 0.5rem 0 0",
  cursor: "pointer",
  border: "none",
  background: "none",
  "> button, > span": {
    margin: "0"
  }
}), mr = u(W.Root, {
  boxSizing: "content-box"
}), ur = (e) => /* @__PURE__ */ t.createElement(dr, { ...e }, e.children), pr = (e) => /* @__PURE__ */ t.createElement(cr, { ...e }, /* @__PURE__ */ t.createElement(Je, null), /* @__PURE__ */ t.createElement(sr, null, /* @__PURE__ */ t.createElement(A, { isSmall: !0 }, /* @__PURE__ */ t.createElement(A.Close, null))), e.children), D = ({ children: e }) => /* @__PURE__ */ t.createElement(mr, null, e);
D.Trigger = ur;
D.Content = pr;
const ne = u("div", {
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
  [`${Ke}`]: {
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
}), re = u("span", {
  display: "flex"
}), fr = u("span", {
  display: "flex",
  width: "1.2111rem",
  height: "0.7222rem"
}), hr = u("span", {
  display: "inline-flex",
  marginLeft: "5px",
  marginBottom: "-1px"
}), gr = u(Z.Item, {
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
      [`& ${re}`]: {
        position: "absolute",
        right: "0",
        bottom: "0",
        [`& ${ne}`]: {
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
        [`& ${re}`]: {
          [`& ${ne}`]: {
            backgroundColor: "$accent"
          }
        }
      }
    },
    figcaption: {
      fontWeight: "700"
    }
  }
}), vr = ({ type: e }) => {
  switch (e) {
    case "Sound":
      return /* @__PURE__ */ t.createElement(A.Audio, null);
    case "Image":
      return /* @__PURE__ */ t.createElement(A.Image, null);
    case "Video":
      return /* @__PURE__ */ t.createElement(A.Video, null);
    default:
      return /* @__PURE__ */ t.createElement(A.Image, null);
  }
}, yr = ({
  canvas: e,
  canvasIndex: n,
  isActive: r,
  thumbnail: o,
  type: a,
  handleChange: i
}) => /* @__PURE__ */ t.createElement(
  gr,
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
      alt: e != null && e.label ? B(e.label) : ""
    }
  ), /* @__PURE__ */ t.createElement(re, null, /* @__PURE__ */ t.createElement(ne, { isIcon: !0, "data-testid": "thumbnail-tag" }, /* @__PURE__ */ t.createElement(fr, null), /* @__PURE__ */ t.createElement(A, { "aria-label": a }, /* @__PURE__ */ t.createElement(vr, { type: a })), ["Video", "Sound"].includes(a) && /* @__PURE__ */ t.createElement(hr, null, Ae(e.duration))))), (e == null ? void 0 : e.label) && /* @__PURE__ */ t.createElement("figcaption", { "data-testid": "fig-caption" }, /* @__PURE__ */ t.createElement(V, { label: e.label })))
), xr = (e) => e.body ? e.body.type : "Image", br = ({ items: e }) => {
  const n = O(), r = I(), { activeCanvas: o, vault: a } = r, [i, s] = C(""), [l, d] = C([]), [c, p] = C(0), m = t.useRef(null), h = "painting", v = (g) => {
    o !== g && n({
      type: "updateActiveCanvas",
      canvasId: g
    });
  };
  E(() => {
    if (!l.length) {
      const g = ["Image", "Sound", "Video"], b = e.map(
        (w) => Pe(a, w, h, g)
      ).filter((w) => w.annotations.length > 0);
      d(b);
    }
  }, [e, l.length, a]), E(() => {
    l.forEach((g, b) => {
      g != null && g.canvas && g.canvas.id === o && p(b);
    });
  }, [o, l]), E(() => {
    const g = document.querySelector(
      `[data-canvas="${c}"]`
    );
    if (g instanceof HTMLElement && m.current) {
      const b = g.offsetLeft - m.current.offsetWidth / 2 + g.offsetWidth / 2;
      m.current.scrollTo({ left: b, behavior: "smooth" });
    }
  }, [c]);
  const y = (g) => s(g), f = (g) => {
    const b = l[c + g];
    b != null && b.canvas && v(b.canvas.id);
  };
  return /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
    Jn,
    {
      handleFilter: y,
      handleCanvasToggle: f,
      activeIndex: c,
      canvasLength: l.length
    }
  ), /* @__PURE__ */ t.createElement(Qn, { "aria-label": "select item", "data-testid": "media", ref: m }, l.filter((g) => {
    var b;
    if ((b = g.canvas) != null && b.label) {
      const w = B(g.canvas.label);
      if (Array.isArray(w))
        return w[0].toLowerCase().includes(i.toLowerCase());
    }
  }).map((g, b) => {
    var w, x;
    return /* @__PURE__ */ t.createElement(
      yr,
      {
        canvas: g.canvas,
        canvasIndex: b,
        handleChange: v,
        isActive: o === ((w = g == null ? void 0 : g.canvas) == null ? void 0 : w.id),
        key: (x = g == null ? void 0 : g.canvas) == null ? void 0 : x.id,
        thumbnail: Lt(a, g, 200, 200),
        type: xr(g.annotations[0])
      }
    );
  })));
}, Qe = u("button", {
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
}), et = u("button", {
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
}), tt = u(et, {
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
}), wr = u("div", {
  position: "relative",
  zIndex: "0",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  "&:hover": {
    [`${tt}`]: {
      backgroundColor: "$accent"
    },
    [`${Qe}`]: {
      backgroundColor: "#6662",
      img: {
        filter: "brightness(0.85)"
      }
    }
  }
}), Er = u("div", {}), Cr = u("svg", {
  height: "19px",
  color: "$accent",
  fill: "$accent",
  stroke: "$accent",
  display: "flex",
  margin: "0.25rem 0.85rem"
}), Sr = u(N.Trigger, {
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
}), kr = u(N.Content, {
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
}), Ir = u(N.Item, {
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
}), $r = u(N.Label, {
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
}), nt = u(N.Root, {
  position: "relative",
  zIndex: "5",
  width: "100%"
}), te = ({ direction: e, title: n }) => {
  const r = () => /* @__PURE__ */ t.createElement("path", { d: "M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" }), o = () => /* @__PURE__ */ t.createElement("path", { d: "M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" });
  return /* @__PURE__ */ t.createElement(
    Cr,
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
}, rt = ({
  children: e,
  label: n,
  maxHeight: r,
  onValueChange: o,
  value: a
}) => /* @__PURE__ */ t.createElement(nt, { onValueChange: o, value: a }, /* @__PURE__ */ t.createElement(Sr, { "data-testid": "select-button" }, /* @__PURE__ */ t.createElement(yt, { "data-testid": "select-button-value" }), /* @__PURE__ */ t.createElement(xt, null, /* @__PURE__ */ t.createElement(te, { direction: "down", title: "select" }))), /* @__PURE__ */ t.createElement(bt, null, /* @__PURE__ */ t.createElement(
  kr,
  {
    css: { maxHeight: `${r} !important` },
    "data-testid": "select-content"
  },
  /* @__PURE__ */ t.createElement(wt, null, /* @__PURE__ */ t.createElement(te, { direction: "up", title: "scroll up for more" })),
  /* @__PURE__ */ t.createElement(Et, null, /* @__PURE__ */ t.createElement(Ct, null, n && /* @__PURE__ */ t.createElement($r, null, /* @__PURE__ */ t.createElement(V, { "data-testid": "select-label", label: n })), e)),
  /* @__PURE__ */ t.createElement(St, null, /* @__PURE__ */ t.createElement(te, { direction: "down", title: "scroll down for more" }))
))), ot = (e) => /* @__PURE__ */ t.createElement(Ir, { ...e }, e.thumbnail && /* @__PURE__ */ t.createElement(Xe, { thumbnail: e.thumbnail }), /* @__PURE__ */ t.createElement(kt, null, /* @__PURE__ */ t.createElement(V, { label: e.label })), /* @__PURE__ */ t.createElement(It, null)), Ar = u("div", {
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
}), Tr = u("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Mr = u("div", {
  width: "100%",
  height: "61.8vh",
  maxHeight: "100vh",
  background: "black",
  backgroundSize: "contain",
  color: "white",
  position: "relative",
  zIndex: "1",
  overflow: "hidden"
}), H = ({ id: e, label: n, children: r }) => /* @__PURE__ */ t.createElement(et, { id: e, "data-testid": "openseadragon-button" }, /* @__PURE__ */ t.createElement(
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
)), zr = u("div", {
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
}), Lr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M256 112v288M400 256H112"
  }
), Pr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 256H112"
  }
), Fr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
  }
), Or = () => /* @__PURE__ */ t.createElement("path", { d: "M448 440a16 16 0 01-12.61-6.15c-22.86-29.27-44.07-51.86-73.32-67C335 352.88 301 345.59 256 344.23V424a16 16 0 01-27 11.57l-176-168a16 16 0 010-23.14l176-168A16 16 0 01256 88v80.36c74.14 3.41 129.38 30.91 164.35 81.87C449.32 292.44 464 350.9 464 424a16 16 0 01-16 16z" }), be = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
  }
), /* @__PURE__ */ t.createElement("path", { d: "M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z" })), Rr = ({
  hasPlaceholder: e,
  options: n
}) => {
  const r = I(), {
    activeCanvas: o,
    configOptions: a,
    openSeadragonViewer: i,
    plugins: s,
    vault: l,
    activeManifest: d
  } = r, c = l.get({
    id: o,
    type: "Canvas"
  });
  function p() {
    return s.filter((m) => m.menu).map((m, h) => {
      var y, f;
      const v = (y = m.menu) == null ? void 0 : y.component;
      return /* @__PURE__ */ t.createElement(
        v,
        {
          key: h,
          ...(f = m == null ? void 0 : m.menu) == null ? void 0 : f.componentProps,
          activeManifest: d,
          canvas: c,
          viewerConfigOptions: a,
          openSeadragonViewer: i,
          useViewerDispatch: O,
          useViewerState: I
        }
      );
    });
  }
  return /* @__PURE__ */ t.createElement(
    zr,
    {
      "data-testid": "openseadragon-controls",
      hasPlaceholder: e,
      id: "openseadragon-controls"
    },
    n.showZoomControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(H, { id: "zoomIn", label: "zoom in" }, /* @__PURE__ */ t.createElement(Lr, null)), /* @__PURE__ */ t.createElement(H, { id: "zoomOut", label: "zoom out" }, /* @__PURE__ */ t.createElement(Pr, null))),
    n.showFullPageControl && /* @__PURE__ */ t.createElement(H, { id: "fullPage", label: "full page" }, /* @__PURE__ */ t.createElement(Fr, null)),
    n.showRotationControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(H, { id: "rotateRight", label: "rotate right" }, /* @__PURE__ */ t.createElement(be, null)), /* @__PURE__ */ t.createElement(H, { id: "rotateLeft", label: "rotate left" }, /* @__PURE__ */ t.createElement(be, null))),
    n.showHomeControl && /* @__PURE__ */ t.createElement(H, { id: "reset", label: "reset" }, /* @__PURE__ */ t.createElement(Or, null)),
    p()
  );
}, Vr = (e) => fetch(`${e.replace(/\/$/, "")}/info.json`).then((n) => n.json()).then((n) => n).catch((n) => {
  console.error(
    `The IIIF tilesource ${e.replace(
      /\/$/,
      ""
    )}/info.json failed to load: ${n}`
  );
}), Hr = (e) => {
  let n, r;
  if (Array.isArray(e) && (n = e[0], n)) {
    let o;
    "@id" in n ? o = n["@id"] : o = n.id, r = o;
  }
  return r;
}, Br = ({
  uri: e,
  hasPlaceholder: n,
  imageType: r,
  annotationResources: o
}) => {
  const [a, i] = C(), [s, l] = C(), d = I(), { configOptions: c, vault: p, activeCanvas: m } = d, h = O(), v = p.get({
    id: m,
    type: "Canvas"
  }), y = {
    id: `openseadragon-viewport-${s}`,
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
    navigatorId: `openseadragon-navigator-${s}`,
    gestureSettingsMouse: {
      clickToZoom: !0,
      dblClickToZoom: !0,
      pinchToZoom: !0,
      scrollToZoom: !0
    },
    ...c.openSeadragon,
    ajaxWithCredentials: c.withCredentials
  }, f = Jt(
    o,
    p,
    c
  );
  return E(() => {
    e !== a && (i(e), l(Ie()));
  }, [a, e]), E(() => {
    var g;
    if (a)
      switch (r) {
        case "simpleImage":
          const b = _(y);
          b.addSimpleImage({
            url: a
          }), h({
            type: "updateOpenSeadragonViewer",
            openSeadragonViewer: b
          }), (g = c.annotationOverlays) != null && g.renderOverlays && he(b, v, c, f);
          break;
        case "tiledImage":
          Vr(a).then((w) => {
            var S;
            const x = _(y);
            x.addTiledImage({
              tileSource: w
            }), h({
              type: "updateOpenSeadragonViewer",
              openSeadragonViewer: x
            }), (S = c.annotationOverlays) != null && S.renderOverlays && he(x, v, c, f);
          });
          break;
        default:
          console.warn(
            `Unable to render ${a} in OpenSeadragon as type: "${r}"`
          );
          break;
      }
  }, [a]), s ? /* @__PURE__ */ t.createElement(
    Mr,
    {
      css: {
        backgroundColor: c.canvasBackgroundColor,
        height: c.canvasHeight
      },
      className: "clover-viewer-osd-wrapper",
      "data-testid": "clover-viewer-osd-wrapper"
    },
    /* @__PURE__ */ t.createElement(Rr, { hasPlaceholder: n, options: y }),
    /* @__PURE__ */ t.createElement(Ar, { id: `openseadragon-navigator-${s}` }),
    /* @__PURE__ */ t.createElement(Tr, { id: `openseadragon-viewport-${s}` })
  ) : null;
}, _r = ({
  painting: e,
  hasPlaceholder: n,
  annotationResources: r
}) => {
  const [o, a] = C(), [i, s] = C();
  return E(() => {
    Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0 ? (a("tiledImage"), s(Hr(e == null ? void 0 : e.service))) : (a("simpleImage"), s(e == null ? void 0 : e.id));
  }, [e]), /* @__PURE__ */ t.createElement(
    Br,
    {
      uri: i,
      key: i,
      hasPlaceholder: n,
      imageType: o,
      annotationResources: r
    }
  );
}, Wr = ({
  isMedia: e,
  label: n,
  placeholderCanvas: r,
  setIsInteractive: o
}) => {
  const { vault: a } = I(), i = G(a, r), s = i ? i[0] : void 0, l = n ? B(n) : ["placeholder image"];
  return /* @__PURE__ */ t.createElement(
    Qe,
    {
      onClick: () => o(!0),
      isMedia: e,
      className: "clover-viewer-placeholder"
    },
    /* @__PURE__ */ t.createElement(
      "img",
      {
        src: (s == null ? void 0 : s.id) || "",
        alt: l.join(),
        height: s == null ? void 0 : s.height,
        width: s == null ? void 0 : s.width
      }
    )
  );
}, Nr = u("canvas", {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Dr = t.forwardRef(
  (e, n) => {
    const r = t.useRef(null), o = q(() => {
      var v, y;
      if ((v = n.current) != null && v.currentTime && ((y = n.current) == null ? void 0 : y.currentTime) > 0)
        return;
      const i = n.current;
      if (!i)
        return;
      const s = new AudioContext(), l = s.createMediaElementSource(i), d = s.createAnalyser(), c = r.current;
      if (!c)
        return;
      c.width = i.offsetWidth, c.height = i.offsetHeight;
      const p = c.getContext("2d");
      l.connect(d), d.connect(s.destination), d.fftSize = 256;
      const m = d.frequencyBinCount, h = new Uint8Array(m);
      setInterval(function() {
        a(
          d,
          p,
          m,
          h,
          c.width,
          c.height
        );
      }, 20);
    }, [n]);
    t.useEffect(() => {
      !n || !n.current || (n.current.onplay = o);
    }, [o, n]);
    function a(i, s, l, d, c, p) {
      const m = c / l * 2.6;
      let h, v = 0;
      i.getByteFrequencyData(d), s.fillStyle = "#000000", s.fillRect(0, 0, c, p);
      for (let y = 0; y < l; y++)
        h = d[y] * 2, s.fillStyle = "rgba(78, 42, 132, 1)", s.fillRect(v, p - h, m, h), v += m + 6;
    }
    return /* @__PURE__ */ t.createElement(Nr, { ref: r, role: "presentation" });
  }
), jr = u("div", {
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
}), Gr = ({ resource: e, ignoreCaptionLabels: n }) => {
  const r = B(e.label, "en");
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
}, qr = ({
  allSources: e,
  annotationResources: n,
  painting: r
}) => {
  const [o, a] = t.useState(0), [i, s] = t.useState(), l = t.useRef(null), d = (r == null ? void 0 : r.type) === "Sound", c = I(), { activeCanvas: p, configOptions: m, vault: h } = c;
  return E(() => {
    if (!r.id || !l.current)
      return;
    if (l != null && l.current) {
      const f = l.current;
      f.src = r.id, f.load();
    }
    if (r.id.split(".").pop() !== "m3u8")
      return;
    const v = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      xhrSetup: function(f, g) {
        f.withCredentials = !!m.withCredentials;
      }
    }, y = new z(v);
    return y.attachMedia(l.current), y.on(z.Events.MEDIA_ATTACHED, function() {
      y.loadSource(r.id);
    }), y.on(z.Events.ERROR, function(f, g) {
      if (g.fatal)
        switch (g.type) {
          case z.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${f} network error encountered, try to recover`
            ), y.startLoad();
            break;
          case z.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${f} media error encountered, try to recover`
            ), y.recoverMediaError();
            break;
          default:
            y.destroy();
            break;
        }
    }), () => {
      if (y && l.current) {
        const f = l.current;
        y.detachMedia(), y.destroy(), f.currentTime = 0;
      }
    };
  }, [m.withCredentials, r.id]), E(() => {
    var b, w, x, S;
    const v = h.get(p), y = (b = v.accompanyingCanvas) != null && b.id ? G(h, (w = v.accompanyingCanvas) == null ? void 0 : w.id) : null, f = (x = v.placeholderCanvas) != null && x.id ? G(h, (S = v.placeholderCanvas) == null ? void 0 : S.id) : null;
    !!(y && f) ? s(o === 0 ? f[0].id : y[0].id) : (y && s(y[0].id), f && s(f[0].id));
  }, [p, o, h]), E(() => {
    if (l != null && l.current) {
      const v = l.current;
      return v == null || v.addEventListener(
        "timeupdate",
        () => a(v.currentTime)
      ), () => document.removeEventListener("timeupdate", () => {
      });
    }
  }, []), /* @__PURE__ */ t.createElement(
    jr,
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
        ref: l,
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
      e.map((v) => /* @__PURE__ */ t.createElement("source", { src: v.id, type: v.format, key: v.id })),
      (n == null ? void 0 : n.length) > 0 && n.map((v) => {
        const y = [];
        return v.items.forEach((f) => {
          h.get(
            f.id
          ).body.forEach((b) => {
            const w = h.get(
              b.id
            );
            y.push(w);
          });
        }), y.map((f) => /* @__PURE__ */ t.createElement(
          Gr,
          {
            resource: f,
            ignoreCaptionLabels: m.ignoreCaptionLabels || [],
            key: f.id
          }
        ));
      }),
      "Sorry, your browser doesn't support embedded videos."
    ),
    d && /* @__PURE__ */ t.createElement(Dr, { ref: l })
  );
}, Ur = () => /* @__PURE__ */ t.createElement(
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
), Zr = ({ isMedia: e }) => /* @__PURE__ */ t.createElement(
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
), Xr = ({
  handleToggle: e,
  isInteractive: n,
  isMedia: r
}) => /* @__PURE__ */ t.createElement(
  tt,
  {
    onClick: e,
    isInteractive: n,
    isMedia: r,
    "data-testid": "placeholder-toggle"
  },
  n ? /* @__PURE__ */ t.createElement(Ur, null) : /* @__PURE__ */ t.createElement(Zr, { isMedia: r })
), Yr = ({
  activeCanvas: e,
  annotationResources: n,
  isMedia: r,
  painting: o
}) => {
  var S, $, M;
  const [a, i] = t.useState(0), [s, l] = t.useState(!1), { configOptions: d, customDisplays: c, vault: p } = I(), m = p.get(e), h = (S = m == null ? void 0 : m.placeholderCanvas) == null ? void 0 : S.id, v = !!h, y = (o == null ? void 0 : o.length) > 1, f = h && !s && !r, g = () => l(!s), b = (k) => {
    const T = o.findIndex((P) => P.id === k);
    i(T);
  }, w = c.find((k) => {
    var de;
    let T = !1;
    const { canvasId: P, paintingFormat: Y } = k.target;
    if (Array.isArray(P) && P.length > 0 && (T = P.includes(e)), Array.isArray(Y) && Y.length > 0) {
      const me = ((de = o[a]) == null ? void 0 : de.format) || "";
      T = !!(me && Y.includes(me));
    }
    return T;
  }), x = ($ = w == null ? void 0 : w.display) == null ? void 0 : $.component;
  return /* @__PURE__ */ t.createElement(wr, { className: "clover-viewer-painting" }, /* @__PURE__ */ t.createElement(
    Er,
    {
      style: {
        backgroundColor: d.canvasBackgroundColor,
        maxHeight: d.canvasHeight
      }
    },
    h && !r && /* @__PURE__ */ t.createElement(
      Xr,
      {
        handleToggle: g,
        isInteractive: s,
        isMedia: r
      }
    ),
    f && !r && /* @__PURE__ */ t.createElement(
      Wr,
      {
        isMedia: r,
        label: m == null ? void 0 : m.label,
        placeholderCanvas: h,
        setIsInteractive: l
      }
    ),
    !f && !w && (r ? /* @__PURE__ */ t.createElement(
      qr,
      {
        allSources: o,
        painting: o[a],
        annotationResources: n
      }
    ) : o && /* @__PURE__ */ t.createElement(
      _r,
      {
        painting: o[a],
        hasPlaceholder: v,
        key: e,
        annotationResources: n
      }
    )),
    !f && x && /* @__PURE__ */ t.createElement(
      x,
      {
        id: e,
        annotationBody: o[a],
        ...w == null ? void 0 : w.display.componentProps
      }
    )
  ), y && /* @__PURE__ */ t.createElement(
    rt,
    {
      value: (M = o[a]) == null ? void 0 : M.id,
      onValueChange: b,
      maxHeight: "200px"
    },
    o == null ? void 0 : o.map((k) => /* @__PURE__ */ t.createElement(
      ot,
      {
        value: k == null ? void 0 : k.id,
        key: k == null ? void 0 : k.id,
        label: k == null ? void 0 : k.label
      }
    ))
  ));
}, Kr = ({
  activeCanvas: e,
  annotationResources: n,
  isAudioVideo: r,
  items: o,
  painting: a
}) => {
  const { informationOpen: i, configOptions: s } = I(), { informationPanel: l } = s, d = (l == null ? void 0 : l.renderAbout) || (l == null ? void 0 : l.renderAnnotation) && n.length > 0;
  return /* @__PURE__ */ t.createElement(
    Oe,
    {
      className: "clover-viewer-content",
      "data-testid": "clover-viewer-content"
    },
    /* @__PURE__ */ t.createElement(Re, null, /* @__PURE__ */ t.createElement(
      Yr,
      {
        activeCanvas: e,
        annotationResources: n,
        isMedia: r,
        painting: a
      }
    ), d && /* @__PURE__ */ t.createElement(Ve, null, /* @__PURE__ */ t.createElement("span", null, i ? "View Items" : "More Information")), o.length > 1 && /* @__PURE__ */ t.createElement(Fe, { className: "clover-viewer-media-wrapper" }, /* @__PURE__ */ t.createElement(br, { items: o, activeItem: 0 }))),
    i && d && /* @__PURE__ */ t.createElement(Ht, null, /* @__PURE__ */ t.createElement(He, null, /* @__PURE__ */ t.createElement(
      Dn,
      {
        activeCanvas: e,
        annotationResources: n
      }
    )))
  );
}, Jr = u(D.Trigger, {
  width: "30px",
  padding: "5px"
}), Qr = u(D.Content, {
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
}), eo = u("span", {
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
}), to = u("header", {
  display: "flex",
  backgroundColor: "transparent !important",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  [`> ${nt}`]: {
    flexGrow: "1",
    flexShrink: "0"
  },
  form: {
    flexGrow: "0",
    flexShrink: "1"
  }
}), no = u("div", {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  padding: "1rem",
  flexShrink: "0",
  flexGrow: "1"
}), ro = () => {
  var d;
  const e = O(), n = I(), { activeManifest: r, collection: o, configOptions: a, vault: i } = n, s = a == null ? void 0 : a.canvasHeight, l = (c) => {
    e({
      type: "updateActiveManifest",
      manifestId: c
    });
  };
  return /* @__PURE__ */ t.createElement("div", { style: { margin: "0.75rem" } }, /* @__PURE__ */ t.createElement(
    rt,
    {
      label: o.label,
      maxHeight: s,
      value: r,
      onValueChange: l
    },
    (d = o == null ? void 0 : o.items) == null ? void 0 : d.map((c) => /* @__PURE__ */ t.createElement(
      ot,
      {
        value: c.id,
        key: c.id,
        thumbnail: c != null && c.thumbnail ? i.get(c == null ? void 0 : c.thumbnail) : void 0,
        label: c.label
      }
    ))
  ));
}, oo = (e, n = 2500) => {
  const [r, o] = C(), a = q(() => {
    navigator.clipboard.writeText(e).then(
      () => o("copied"),
      () => o("failed")
    );
  }, [e]);
  return E(() => {
    if (!r)
      return;
    const i = setTimeout(() => o(void 0), n);
    return () => clearTimeout(i);
  }, [r]), [r, a];
}, ao = u("span", {
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
}), io = ({ status: e }) => e ? /* @__PURE__ */ t.createElement(ao, { "data-copy-status": e }, e) : null, we = ({
  textPrompt: e,
  textToCopy: n
}) => {
  const [r, o] = oo(n);
  return /* @__PURE__ */ t.createElement("button", { onClick: o }, e, " ", /* @__PURE__ */ t.createElement(io, { status: r }));
}, lo = () => {
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
}, so = u($e.Root, {
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
}), co = u($e.Thumb, {
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
}), mo = u("label", {
  fontSize: "0.8333rem",
  fontWeight: "400",
  lineHeight: "1em",
  userSelect: "none",
  cursor: "pointer",
  paddingRight: "0.618rem"
}), uo = u("form", {
  display: "flex",
  flexShrink: "0",
  flexGrow: "1",
  alignItems: "center",
  marginLeft: "1.618rem"
}), po = () => {
  var a;
  const { configOptions: e } = I(), n = O(), [r, o] = C((a = e == null ? void 0 : e.informationPanel) == null ? void 0 : a.open);
  return E(() => {
    n({
      type: "updateInformationOpen",
      informationOpen: r
    });
  }, [r]), /* @__PURE__ */ t.createElement(uo, null, /* @__PURE__ */ t.createElement(mo, { htmlFor: "information-toggle", css: r ? { opacity: "1" } : {} }, "More Information"), /* @__PURE__ */ t.createElement(
    so,
    {
      checked: r,
      onCheckedChange: () => o(!r),
      id: "information-toggle",
      "aria-label": "information panel toggle",
      name: "toggled?"
    },
    /* @__PURE__ */ t.createElement(co, null)
  ));
}, at = (e) => {
  const n = () => window.matchMedia ? window.matchMedia(e).matches : !1, [r, o] = C(n);
  return E(() => {
    const a = () => o(n);
    return window.addEventListener("resize", a), () => window.removeEventListener("resize", a);
  }), r;
}, fo = ({ manifestId: e, manifestLabel: n }) => {
  const r = I(), { collection: o, configOptions: a } = r, { showTitle: i, showIIIFBadge: s, informationPanel: l } = a, d = s || (l == null ? void 0 : l.renderToggle), c = at(ae.sm);
  return /* @__PURE__ */ t.createElement(to, { className: "clover-viewer-header" }, o != null && o.items ? /* @__PURE__ */ t.createElement(ro, null) : /* @__PURE__ */ t.createElement(eo, { className: i ? "" : "visually-hidden" }, i && /* @__PURE__ */ t.createElement(V, { label: n, className: "label" })), d && /* @__PURE__ */ t.createElement(no, null, s && /* @__PURE__ */ t.createElement(D, null, /* @__PURE__ */ t.createElement(Jr, null, /* @__PURE__ */ t.createElement(lo, null)), /* @__PURE__ */ t.createElement(Qr, null, (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (p) => {
        p.preventDefault(), window.open(o.id, "_blank");
      }
    },
    "View Collection"
  ), /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (p) => {
        p.preventDefault(), window.open(e, "_blank");
      }
    },
    "View Manifest"
  ), " ", (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    we,
    {
      textPrompt: "Copy Collection URL",
      textToCopy: o.id
    }
  ), /* @__PURE__ */ t.createElement(
    we,
    {
      textPrompt: "Copy Manifest URL",
      textToCopy: e
    }
  ))), (l == null ? void 0 : l.renderToggle) && !c && /* @__PURE__ */ t.createElement(po, null)));
}, ho = (e = !1) => {
  const [n, r] = C(e);
  return ut(() => {
    if (!n)
      return;
    const o = document.documentElement.style.overflow;
    return document.documentElement.style.overflow = "hidden", () => {
      document.documentElement.style.overflow = o;
    };
  }, [n]), E(() => {
    n !== e && r(e);
  }, [e]), [n, r];
}, go = ({ manifest: e, theme: n }) => {
  var S;
  const r = I(), o = O(), { activeCanvas: a, informationOpen: i, vault: s, configOptions: l } = r, [d, c] = C(!1), [p, m] = C(!1), [h, v] = C([]), [y, f] = C([]), [g, b] = ho(!1), w = at(ae.sm), x = q(
    ($) => {
      o({
        type: "updateInformationOpen",
        informationOpen: $
      });
    },
    [o]
  );
  return E(() => {
    var $;
    ($ = l == null ? void 0 : l.informationPanel) != null && $.open && x(!w);
  }, [
    w,
    (S = l == null ? void 0 : l.informationPanel) == null ? void 0 : S.open,
    x
  ]), E(() => {
    if (!w) {
      b(!1);
      return;
    }
    b(i);
  }, [i, w, b]), E(() => {
    const $ = G(s, a);
    $ && (m(
      ["Sound", "Video"].indexOf($[0].type) > -1
    ), v($)), zt(s, a).then((M) => {
      f(M), c(M.length !== 0);
    });
  }, [a, y.length, s]), /* @__PURE__ */ t.createElement(pt, { FallbackComponent: Vt }, /* @__PURE__ */ t.createElement(
    Bt,
    {
      className: `${n} clover-viewer`,
      css: { background: l == null ? void 0 : l.background },
      "data-body-locked": g,
      "data-information-panel": d,
      "data-information-panel-open": i
    },
    /* @__PURE__ */ t.createElement(
      oe.Root,
      {
        open: i,
        onOpenChange: x
      },
      /* @__PURE__ */ t.createElement(
        fo,
        {
          manifestLabel: e.label,
          manifestId: e.id
        }
      ),
      /* @__PURE__ */ t.createElement(
        Kr,
        {
          activeCanvas: a,
          painting: h,
          annotationResources: y,
          items: e.items,
          isAudioVideo: p
        }
      )
    )
  ));
}, Ee = {
  ignoreCache: !1,
  headers: {
    Accept: "application/json, text/javascript, text/plain"
  },
  timeout: 5e3,
  withCredentials: !1
};
function vo(e) {
  return {
    ok: e.status >= 200 && e.status < 300,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: e.responseText,
    json: () => JSON.parse(e.responseText)
  };
}
function Ce(e, n = null) {
  return {
    ok: !1,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: n || e.statusText,
    json: () => JSON.parse(n || e.statusText)
  };
}
function yo(e, n = Ee) {
  const r = n.headers || Ee.headers;
  return new Promise((o, a) => {
    const i = new XMLHttpRequest();
    i.open("get", e), i.withCredentials = n.withCredentials, r && Object.keys(r).forEach(
      (s) => i.setRequestHeader(s, r[s])
    ), i.onload = () => {
      o(vo(i));
    }, i.onerror = () => {
      a(Ce(i, "Failed to make request."));
    }, i.ontimeout = () => {
      a(Ce(i, "Request took longer than expected."));
    }, i.send();
  });
}
const Lo = ({
  canvasIdCallback: e = () => {
  },
  customDisplays: n = [],
  plugins: r = [],
  customTheme: o,
  iiifContent: a,
  id: i,
  manifestId: s,
  options: l
}) => {
  var c;
  let d = a;
  return i && (d = i), s && (d = s), /* @__PURE__ */ t.createElement(
    Mt,
    {
      initialState: {
        ...X,
        customDisplays: n,
        plugins: r,
        informationOpen: !!((c = l == null ? void 0 : l.informationPanel) != null && c.open),
        vault: new ke({
          customFetcher: (p) => yo(p, {
            withCredentials: l == null ? void 0 : l.withCredentials,
            headers: l == null ? void 0 : l.requestHeaders
          }).then((m) => JSON.parse(m.data))
        })
      }
    },
    /* @__PURE__ */ t.createElement(
      xo,
      {
        iiifContent: d,
        canvasIdCallback: e,
        customTheme: o,
        options: l
      }
    )
  );
}, xo = ({
  canvasIdCallback: e,
  customTheme: n,
  iiifContent: r,
  options: o
}) => {
  const a = O(), i = I(), { activeCanvas: s, activeManifest: l, isLoaded: d, vault: c } = i, [p, m] = C(), [h, v] = C();
  let y = {};
  return n && (y = ht("custom", n)), E(() => {
    e && e(s);
  }, [s, e]), E(() => {
    l && c.loadManifest(l).then((f) => {
      v(f), a({
        type: "updateActiveCanvas",
        canvasId: f.items[0] && f.items[0].id
      });
    }).catch((f) => {
      console.error(`Manifest failed to load: ${f}`);
    }).finally(() => {
      a({
        type: "updateIsLoaded",
        isLoaded: !0
      });
    });
  }, [l, a, c]), E(() => {
    a({
      type: "updateConfigOptions",
      configOptions: o
    }), c.load(r).then((f) => {
      m(f);
    }).catch((f) => {
      console.error(
        `The IIIF resource ${r} failed to load: ${f}`
      );
    });
  }, [a, r, o, c]), E(() => {
    let f = [];
    (p == null ? void 0 : p.type) === "Collection" ? (a({
      type: "updateCollection",
      collection: p
    }), f = p.items.filter((g) => g.type === "Manifest").map((g) => g.id), f.length > 0 && a({
      type: "updateActiveManifest",
      manifestId: f[0]
    })) : (p == null ? void 0 : p.type) === "Manifest" && a({
      type: "updateActiveManifest",
      manifestId: p.id
    });
  }, [a, p]), d ? !h || !h.items ? (console.log(`The IIIF manifest ${r} failed to load.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : h.items.length === 0 ? (console.log(`The IIIF manifest ${r} does not contain canvases.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : /* @__PURE__ */ t.createElement(go, { manifest: h, theme: y, key: h.id }) : /* @__PURE__ */ t.createElement(t.Fragment, null, "Loading");
};
export {
  Lo as default
};
//# sourceMappingURL=index.mjs.map
