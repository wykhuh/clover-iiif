import t, { useReducer as Qe, useRef as et, useEffect as E, useCallback as q, createContext as tt, useContext as nt, cloneElement as rt, Fragment as ot, useState as S, useLayoutEffect as at } from "react";
import R from "openseadragon";
import { Vault as be } from "@iiif/vault";
import * as re from "@radix-ui/react-collapsible";
import { ErrorBoundary as it } from "react-error-boundary";
import { createStitches as lt, createTheme as st } from "@stitches/react";
import * as U from "@radix-ui/react-tabs";
import ct from "sanitize-html";
import M from "hls.js";
import { v4 as we } from "uuid";
import * as Z from "@radix-ui/react-radio-group";
import { parse as dt } from "node-webvtt";
import * as B from "@radix-ui/react-popover";
import * as _ from "@radix-ui/react-select";
import { SelectValue as mt, SelectIcon as ut, SelectPortal as pt, SelectScrollUpButton as gt, SelectViewport as ft, SelectGroup as ht, SelectScrollDownButton as vt, SelectItemText as yt, SelectItemIndicator as xt } from "@radix-ui/react-select";
import * as Ee from "@radix-ui/react-switch";
const bt = (e) => {
  const n = e.toString().split(":"), r = Math.ceil(parseInt(n[0])), o = Math.ceil(parseInt(n[1])), i = wt(Math.ceil(parseInt(n[2])), 2);
  let l = `${r !== 0 && o < 10 ? (o + "").padStart(2, "0") : o}:${i}`;
  return r !== 0 && (l = `${r}:${l}`), l;
}, Se = (e) => {
  const n = new Date(e * 1e3).toISOString().substr(11, 8);
  return bt(n);
}, Ce = (e, n) => {
  if (typeof e != "object" || e === null)
    return n;
  for (const r in n)
    typeof n[r] == "object" && n[r] !== null && !Array.isArray(n[r]) ? (e[r] || (e[r] = {}), e[r] = Ce(e[r], n[r])) : e[r] = n[r];
  return e;
}, ke = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, wt = (e, n) => String(e).padStart(n, "0"), j = {
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
var xe;
const X = {
  activeCanvas: "",
  activeManifest: "",
  collection: {},
  configOptions: j,
  customDisplays: [],
  informationOpen: (xe = j == null ? void 0 : j.informationPanel) == null ? void 0 : xe.open,
  isLoaded: !1,
  vault: new be(),
  openSeadragonViewer: null
}, Ie = t.createContext(X), $e = t.createContext(X);
function Et(e, n) {
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
        configOptions: Ce(e.configOptions, n.configOptions)
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
const St = ({
  initialState: e = X,
  children: n
}) => {
  const [r, o] = Qe(Et, e);
  return /* @__PURE__ */ t.createElement(Ie.Provider, { value: r }, /* @__PURE__ */ t.createElement(
    $e.Provider,
    {
      value: o
    },
    n
  ));
};
function $() {
  const e = t.useContext(Ie);
  if (e === void 0)
    throw new Error("useViewerState must be used within a ViewerProvider");
  return e;
}
function P() {
  const e = t.useContext($e);
  if (e === void 0)
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  return e;
}
const Ae = (e, n, r, o) => {
  var l, s;
  const i = {
    canvas: void 0,
    accompanyingCanvas: void 0,
    annotationPage: void 0,
    annotations: []
  }, a = (c) => {
    if (c) {
      if (!c.body || !c.motivation) {
        console.error(
          "Invalid annotation after Hyperion parsing: missing either 'body' or 'motivation'",
          c
        );
        return;
      }
      let d = c.body;
      Array.isArray(d) && (d = d[0]);
      const g = e.get(d.id);
      if (!g)
        return;
      switch (r) {
        case "painting":
          return c.target === n.id && c.motivation && c.motivation[0] === "painting" && o.includes(g.type) && (c.body = g), !!c;
        case "supplementing":
          return;
        default:
          throw new Error("Invalid annotation motivation.");
      }
    }
  };
  if (i.canvas = e.get(n), i.canvas && (i.annotationPage = e.get(i.canvas.items[0]), i.accompanyingCanvas = (l = i.canvas) != null && l.accompanyingCanvas ? e.get((s = i.canvas) == null ? void 0 : s.accompanyingCanvas) : void 0), i.annotationPage) {
    const c = e.get(i.annotationPage.items).map((g) => ({
      body: e.get(g.body[0].id),
      motivation: g.motivation,
      type: "Annotation"
    })), d = [];
    c.forEach((g) => {
      g.body.type === "Choice" ? g.body.items.forEach(
        (u) => d.push({
          ...g,
          id: u.id,
          body: e.get(u.id)
        })
      ) : d.push(g);
    }), i.annotations = d.filter(a);
  }
  return i;
}, W = (e, n = "en") => {
  if (!e)
    return "";
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return e[n];
}, G = (e, n) => {
  const r = Ae(
    e,
    { id: n, type: "Canvas" },
    "painting",
    ["Image", "Sound", "Video"]
  );
  if (r.annotations.length !== 0 && r.annotations && r.annotations)
    return r.annotations.map(
      (o) => o == null ? void 0 : o.body
    );
}, Ct = (e, n, r) => {
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
      let c = l.body;
      Array.isArray(c) && (c = c[0]);
      const d = e.get(c.id);
      if (d.format === r)
        return l.body = d, l;
    }
  }).map((l) => l.body) : [];
}, kt = (e, n, r, o) => {
  const i = [];
  if (n.canvas && n.canvas.thumbnail.length > 0) {
    const s = e.get(
      n.canvas.thumbnail[0]
    );
    i.push(s);
  }
  if (n.annotations[0]) {
    if (n.annotations[0].thumbnail && n.annotations[0].thumbnail.length > 0) {
      const c = e.get(
        n.annotations[0].thumbnail[0]
      );
      i.push(c);
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
}, It = (e, n) => {
  const r = e.get({
    id: n,
    type: "Canvas"
  });
  if (!(r != null && r.annotations) || !r.annotations[0])
    return [];
  const o = e.get(r.annotations[0]), i = e.get(o.items);
  if (!Array.isArray(i))
    return [];
  const a = i.filter((c) => {
    var d;
    if (c.body && !((d = c.motivation) != null && d.includes("supplementing"))) {
      const g = c.body;
      if (Array.isArray(g))
        if (g.length === 1) {
          const u = e.get(
            g[0].id
          );
          c.body = u;
        } else {
          const u = [];
          g.forEach((f) => {
            const m = e.get(f.id);
            u.push(m);
          }), c.body = u;
        }
      else {
        const u = e.get(g.id);
        c.body = u;
      }
      return c;
    }
  }), l = {};
  a.forEach((c) => {
    const d = c.label || { en: ["Annotation"] }, u = Object.values(d)[0][0];
    l[u] || (l[u] = []), l[u].push({
      body: c.body,
      target: c.target,
      motivation: c.motivation && c.motivation[0],
      localizedLabel: d
    });
  });
  const s = [];
  for (const [c, d] of Object.entries(l)) {
    const g = {
      id: c,
      label: d[0].localizedLabel,
      motivation: d[0].motivation,
      items: []
    };
    d.forEach((u) => {
      g.items.push({
        target: u.target,
        body: u.body
      });
    }), s.push(g);
  }
  return s;
}, J = 209, $t = {
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
    accent: `hsl(${J} 100% 38.2%)`,
    accentMuted: `hsl(${J} 80% 61.8%)`,
    accentAlt: `hsl(${J} 80% 30%)`,
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
}, oe = {
  xxs: "(max-width: 349px)",
  xs: "(max-width: 575px)",
  sm: "(max-width: 767px)",
  md: "(max-width: 991px)",
  lg: "(max-width: 90rem)",
  xl: "(min-width: calc(90rem + 1px))"
}, { styled: p, css: bo, keyframes: ae, createTheme: wo } = lt({
  theme: $t,
  media: oe
}), At = p("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}), Tt = p("p", {
  fontWeight: "bold",
  fontSize: "x-large"
}), Mt = p("span", {
  fontSize: "medium"
}), zt = ({ error: e }) => {
  const { message: n } = e;
  return /* @__PURE__ */ t.createElement(At, { role: "alert" }, /* @__PURE__ */ t.createElement(Tt, { "data-testid": "headline" }, "Something went wrong"), n && /* @__PURE__ */ t.createElement(Mt, null, `Error message: ${n}`, " "));
}, Te = p("div", {
  position: "relative",
  zIndex: "0"
}), Me = p("div", {
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
  "@sm": {
    flexDirection: "column"
  }
}), ze = p("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  width: "61.8%",
  "@sm": {
    width: "100%"
  }
}), Re = p(re.Trigger, {
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
}), Le = p(re.Content, {
  width: "100%",
  display: "flex"
}), Rt = p("aside", {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  width: "38.2%",
  maxHeight: "100%",
  "@sm": {
    width: "100%"
  }
}), Lt = p("div", {
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
      [`& ${Me}`]: {
        flexGrow: "1"
      },
      [`& ${ze}`]: {
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
      [`& ${Te}`]: {
        display: "none"
      },
      [`& ${Re}`]: {
        margin: "1rem"
      },
      [`& ${Le}`]: {
        height: "100%"
      }
    }
  }
}), Ot = p(U.Root, {
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
}), Ft = p(U.List, {
  display: "flex",
  flexGrow: "0",
  margin: "0 1.618rem",
  borderBottom: "4px solid #6663",
  "@sm": {
    margin: "0 1rem"
  }
}), Y = p(U.Trigger, {
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
}), K = p(U.Content, {
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
}), Vt = p("div", {
  position: "relative",
  height: "100%",
  width: "100%",
  overflowY: "scroll"
}), Ht = p("div", {
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
}), Pt = p("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Oe = (e, n = "none") => {
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
}, L = (e, n = "none", r = ", ") => {
  const o = Oe(e, n);
  return Array.isArray(o) ? o.join(`${r}`) : o;
};
function Bt(e) {
  return { __html: _t(e) };
}
function z(e, n) {
  const r = Object.keys(e).filter(
    (i) => n.includes(i) ? null : i
  ), o = new Object();
  return r.forEach((i) => {
    o[i] = e[i];
  }), o;
}
function _t(e) {
  return ct(e, {
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
const Wt = p("span", {}), O = (e) => {
  const { as: n, label: r } = e, i = z(e, ["as", "label"]);
  return /* @__PURE__ */ t.createElement(Wt, { as: n, ...i }, L(r, i.lang));
}, Nt = (e, n = "200,", r = "full") => {
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
}, ce = p("img", { objectFit: "cover" }), Dt = (e) => {
  const n = et(null), { contentResource: r, altAsLabel: o, region: i = "full" } = e;
  let a;
  o && (a = L(o));
  const s = z(e, ["contentResource", "altAsLabel"]), { type: c, id: d, width: g = 200, height: u = 200, duration: f } = r;
  E(() => {
    if (!d && !n.current || ["Image"].includes(c) || !d.includes("m3u8"))
      return;
    const x = new M();
    return n.current && (x.attachMedia(n.current), x.on(M.Events.MEDIA_ATTACHED, function() {
      x.loadSource(d);
    })), x.on(M.Events.ERROR, function(v, h) {
      if (h.fatal)
        switch (h.type) {
          case M.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${v} network error encountered, try to recover`
            ), x.startLoad();
            break;
          case M.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${v} media error encountered, try to recover`
            ), x.recoverMediaError();
            break;
          default:
            x.destroy();
            break;
        }
    }), () => {
      x && (x.detachMedia(), x.destroy());
    };
  }, [d, c]);
  const m = q(() => {
    if (!n.current)
      return;
    let x = 0, v = 30;
    if (f && (v = f), !d.split("#t=") && f && (x = f * 0.1), d.split("#t=").pop()) {
      const b = d.split("#t=").pop();
      b && (x = parseInt(b.split(",")[0]));
    }
    const h = n.current;
    h.autoplay = !0, h.currentTime = x, setTimeout(() => m(), v * 1e3);
  }, [f, d]);
  E(() => m(), [m]);
  const y = Nt(
    r,
    `${g},${u}`,
    i
  );
  switch (c) {
    case "Image":
      return /* @__PURE__ */ t.createElement(
        ce,
        {
          as: "img",
          alt: a,
          css: { width: g, height: u },
          key: d,
          src: y,
          ...s
        }
      );
    case "Video":
      return /* @__PURE__ */ t.createElement(
        ce,
        {
          as: "video",
          css: { width: g, height: u },
          disablePictureInPicture: !0,
          key: d,
          loop: !0,
          muted: !0,
          onPause: m,
          ref: n,
          src: d
        }
      );
    default:
      return console.warn(
        `Resource type: ${c} is not valid or not yet supported in Primitives.`
      ), /* @__PURE__ */ t.createElement(t.Fragment, null);
  }
}, jt = p("a", {}), Gt = (e) => {
  const { children: n, homepage: r } = e, i = z(e, ["children", "homepage"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, r && r.map((a) => {
    const l = L(
      a.label,
      i.lang
    );
    return /* @__PURE__ */ t.createElement(
      jt,
      {
        "aria-label": n ? l : void 0,
        href: a.id,
        key: a.id,
        ...i
      },
      n || l
    );
  }));
}, qt = {
  delimiter: ", "
}, ie = tt(void 0), Fe = () => {
  const e = nt(ie);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, le = ({
  children: e,
  initialState: n = qt
}) => {
  const r = Ut(n, "delimiter");
  return /* @__PURE__ */ t.createElement(ie.Provider, { value: { delimiter: r } }, e);
}, Ut = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, Zt = p("span", {}), de = (e) => {
  const { as: n, markup: r } = e, { delimiter: o } = Fe();
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = z(e, ["as", "markup"]), l = Bt(
    L(r, a.lang, o)
  );
  return /* @__PURE__ */ t.createElement(Zt, { as: n, ...a, dangerouslySetInnerHTML: l });
}, Ve = (e) => t.useContext(ie) ? /* @__PURE__ */ t.createElement(de, { ...e }) : /* @__PURE__ */ t.createElement(le, null, /* @__PURE__ */ t.createElement(de, { ...e })), Xt = ({ as: e = "dd", lang: n, value: r }) => /* @__PURE__ */ t.createElement(Ve, { markup: r, as: e, lang: n }), Jt = p("span", {}), Yt = ({
  as: e = "dd",
  customValueContent: n,
  lang: r,
  value: o
}) => {
  var l;
  const { delimiter: i } = Fe(), a = (l = Oe(o, r)) == null ? void 0 : l.map((s) => rt(n, {
    value: s
  }));
  return /* @__PURE__ */ t.createElement(Jt, { as: e, lang: r }, a == null ? void 0 : a.map((s, c) => [
    c > 0 && `${i}`,
    /* @__PURE__ */ t.createElement(ot, { key: c }, s)
  ]));
}, He = (e) => {
  var s;
  const { item: n, lang: r, customValueContent: o } = e, { label: i, value: a } = n, l = (s = L(i)) == null ? void 0 : s.replace(" ", "-").toLowerCase();
  return /* @__PURE__ */ t.createElement("div", { role: "group", "data-label": l }, /* @__PURE__ */ t.createElement(O, { as: "dt", label: i, lang: r }), o ? /* @__PURE__ */ t.createElement(
    Yt,
    {
      as: "dd",
      customValueContent: o,
      value: a,
      lang: r
    }
  ) : /* @__PURE__ */ t.createElement(Xt, { as: "dd", value: a, lang: r }));
};
function Kt(e, n) {
  const r = n.filter((o) => {
    const { matchingLabel: i } = o, a = Object.keys(o.matchingLabel)[0], l = L(i, a);
    if (L(e, a) === l)
      return !0;
  }).map((o) => o.Content);
  if (Array.isArray(r))
    return r[0];
}
const Qt = p("dl", {}), en = (e) => {
  const { as: n, customValueContent: r, metadata: o } = e;
  if (!Array.isArray(o))
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const i = ke(e, "customValueDelimiter"), l = z(e, [
    "as",
    "customValueContent",
    "customValueDelimiter",
    "metadata"
  ]);
  return /* @__PURE__ */ t.createElement(
    le,
    {
      ...typeof i == "string" ? { initialState: { delimiter: i } } : void 0
    },
    o.length > 0 && /* @__PURE__ */ t.createElement(Qt, { as: n, ...l }, o.map((s, c) => {
      const d = r ? Kt(s.label, r) : void 0;
      return /* @__PURE__ */ t.createElement(
        He,
        {
          customValueContent: d,
          item: s,
          key: c,
          lang: l == null ? void 0 : l.lang
        }
      );
    }))
  );
};
p("li", {});
p("ul", {});
const tn = p("dl", {}), nn = (e) => {
  const { as: n, requiredStatement: r } = e;
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = ke(e, "customValueDelimiter"), a = z(e, ["as", "customValueDelimiter", "requiredStatement"]);
  return /* @__PURE__ */ t.createElement(
    le,
    {
      ...typeof o == "string" ? { initialState: { delimiter: o } } : void 0
    },
    /* @__PURE__ */ t.createElement(tn, { as: n, ...a }, /* @__PURE__ */ t.createElement(He, { item: r, lang: a.lang }))
  );
}, rn = p("li", {}), on = p("ul", {}), an = (e) => {
  const { as: n, seeAlso: r } = e, i = z(e, ["as", "seeAlso"]);
  return /* @__PURE__ */ t.createElement(on, { as: n }, r && r.map((a) => {
    const l = L(
      a.label,
      i.lang
    );
    return /* @__PURE__ */ t.createElement(rn, { key: a.id }, /* @__PURE__ */ t.createElement("a", { href: a.id, ...i }, l || a.id));
  }));
}, ln = (e) => {
  const { as: n, summary: r } = e, i = z(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ t.createElement(Ve, { as: n, markup: r, ...i });
}, Pe = (e) => {
  const { thumbnail: n, region: r } = e, i = z(e, ["thumbnail"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, n && n.map((a) => /* @__PURE__ */ t.createElement(
    Dt,
    {
      contentResource: a,
      key: a.id,
      region: r,
      ...i
    }
  )));
}, sn = ({
  homepage: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Homepage"), /* @__PURE__ */ t.createElement(Gt, { homepage: e })), cn = ({
  id: e,
  htmlLabel: n,
  parent: r = "manifest"
}) => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, n), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank", id: `iiif-${r}-id` }, e)), dn = ({
  metadata: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(en, { metadata: e, id: `iiif-${n}-metadata` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), mn = ({
  requiredStatement: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  nn,
  {
    requiredStatement: e,
    id: `iiif-${n}-required-statement`
  }
)) : /* @__PURE__ */ t.createElement(t.Fragment, null), un = ({ rights: e }) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Rights"), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank" }, e)) : /* @__PURE__ */ t.createElement(t.Fragment, null), pn = ({ seeAlso: e }) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "See Also"), /* @__PURE__ */ t.createElement(an, { seeAlso: e })), gn = ({
  summary: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(ln, { summary: e, as: "p", id: `iiif-${n}-summary` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), fn = ({
  label: e,
  thumbnail: n
}) => (n == null ? void 0 : n.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  Pe,
  {
    altAsLabel: e || { none: ["resource"] },
    thumbnail: n,
    style: { backgroundColor: "#6663", objectFit: "cover" }
  }
)), hn = () => {
  const e = $(), { activeManifest: n, vault: r } = e, [o, i] = S(), [a, l] = S([]), [s, c] = S([]), [d, g] = S([]);
  return E(() => {
    var f, m, y;
    const u = r.get(n);
    i(u), ((f = u.homepage) == null ? void 0 : f.length) > 0 && l(r.get(u.homepage)), ((m = u.seeAlso) == null ? void 0 : m.length) > 0 && c(r.get(u.seeAlso)), ((y = u.thumbnail) == null ? void 0 : y.length) > 0 && g(r.get(u.thumbnail));
  }, [n, r]), o ? /* @__PURE__ */ t.createElement(Pt, null, /* @__PURE__ */ t.createElement(Ht, null, /* @__PURE__ */ t.createElement(fn, { thumbnail: d, label: o.label }), /* @__PURE__ */ t.createElement(gn, { summary: o.summary }), /* @__PURE__ */ t.createElement(dn, { metadata: o.metadata }), /* @__PURE__ */ t.createElement(mn, { requiredStatement: o.requiredStatement }), /* @__PURE__ */ t.createElement(un, { rights: o.rights }), /* @__PURE__ */ t.createElement(
    sn,
    {
      homepage: a
    }
  ), /* @__PURE__ */ t.createElement(
    pn,
    {
      seeAlso: s
    }
  ), /* @__PURE__ */ t.createElement(cn, { id: o.id, htmlLabel: "IIIF Manifest" }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, vn = () => {
  function e(i) {
    return i.map((a) => {
      const l = a.identifier || we();
      return { ...a, identifier: l };
    });
  }
  function n(i) {
    var c;
    const a = [], l = [], s = e(i);
    for (const d of s) {
      for (; l.length > 0 && l[l.length - 1].end <= d.start; )
        l.pop();
      l.length > 0 ? (l[l.length - 1].children || (l[l.length - 1].children = []), (c = l[l.length - 1].children) == null || c.push(d), l.push(d)) : (a.push(d), l.push(d));
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
}, me = ae({
  from: { transform: "rotate(360deg)" },
  to: { transform: "rotate(0deg)" }
}), yn = p(Z.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), Be = p(Z.Item, {
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
      animationName: me,
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
      animationName: me,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    }
  }
}), xn = ({ label: e, start: n, end: r }) => {
  const [o, i] = S(!1), a = document.getElementById(
    "clover-iiif-video"
  );
  E(() => (a == null || a.addEventListener("timeupdate", () => {
    const { currentTime: s } = a;
    i(n <= s && s < r);
  }), () => document.removeEventListener("timeupdate", () => {
  })), [r, n, a]);
  const l = () => {
    a && (a.pause(), a.currentTime = n, a.play());
  };
  return /* @__PURE__ */ t.createElement(
    Be,
    {
      "aria-checked": o,
      "data-testid": "information-panel-cue",
      onClick: l,
      value: e
    },
    e,
    /* @__PURE__ */ t.createElement("strong", null, Se(n))
  );
}, bn = p("ul", {
  listStyle: "none",
  paddingLeft: "1rem",
  position: "relative",
  "&&:first-child": {
    paddingLeft: "0"
  },
  "& li ul": {
    [`& ${Be}`]: {
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
}), _e = ({ items: e }) => /* @__PURE__ */ t.createElement(bn, null, e.map((n) => {
  const { text: r, start: o, end: i, children: a, identifier: l } = n;
  return /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement(xn, { label: r, start: o, end: i }), a && /* @__PURE__ */ t.createElement(_e, { items: a }));
})), wn = ({ resource: e }) => {
  const [n, r] = t.useState([]), { id: o, label: i } = e, { createNestedCues: a, orderCuesByTime: l } = vn();
  return E(() => {
    o && fetch(o, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json"
      }
    }).then((s) => s.text()).then((s) => {
      const c = dt(s).cues, d = l(c), g = a(d);
      r(g);
    }).catch((s) => console.error(o, s.toString()));
  }, [a, o, l]), /* @__PURE__ */ t.createElement(
    yn,
    {
      "aria-label": `navigate ${W(i, "en")}`
    },
    /* @__PURE__ */ t.createElement(_e, { items: n })
  );
}, En = p("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), ue = p("div", {
  position: "relative",
  cursor: "pointer",
  padding: "0.5rem 1.618rem",
  lineHeight: "1.25em",
  "&:hover": {
    backgroundColor: "$secondaryMuted"
  }
}), Sn = ({ item: e }) => {
  const n = $(), { openSeadragonViewer: r, vault: o, activeCanvas: i, configOptions: a } = n, l = o.get({
    id: i,
    type: "Canvas"
  });
  function s(u, f) {
    const m = document.createElement("div");
    m.style.backgroundColor = "rgba(0,100,200,.25)", u.addOverlay(m, f);
  }
  function c(u) {
    var y, x, v;
    if (!r)
      return;
    const f = JSON.parse(u.target.dataset.target), m = ((y = a.annotationOverlays) == null ? void 0 : y.zoomLevel) || 1;
    if (typeof f == "string") {
      if (!f.includes("#xywh="))
        return;
      const h = f.split("#xywh=");
      if (h && h[1]) {
        const [b, w, k, T] = h[1].split(",").map((F) => Number(F)), I = 1 / l.width, C = new R.Rect(
          b * I - k * I / 2 * (m - 1),
          w * I - T * I / 2 * (m - 1),
          k * I * m,
          T * I * m
        );
        r.viewport.fitBounds(C);
      }
    } else if (((x = f.selector) == null ? void 0 : x.type) === "PointSelector") {
      const h = 1 / l.width, b = f.selector.x, w = f.selector.y, k = 40, T = 40, I = new R.Rect(
        b * h - k / 2 * h * m,
        w * h - T / 2 * h * m,
        k * h * m,
        T * h * m
      );
      r.viewport.fitBounds(I);
    } else if (((v = f.selector) == null ? void 0 : v.type) === "SvgSelector") {
      const h = document.querySelector(".annotation-overlay");
      if (h) {
        const b = h.getBBox(), w = new R.Rect(
          250 * (1 / l.width),
          500 * (1 / l.height),
          1300 * (1 / l.width),
          950 * (1 / l.height)
        );
        console.log("bbox", b), console.log("rect", w), s(r, w);
      }
    }
  }
  function d(u, f, m = 0) {
    if (u.format === "text/html")
      return /* @__PURE__ */ t.createElement("div", { key: m, dangerouslySetInnerHTML: { __html: u.value } });
    if (u.value)
      return /* @__PURE__ */ t.createElement("div", { key: m, "data-target": f }, u.value);
    if (u.type === "Image")
      return /* @__PURE__ */ t.createElement("img", { src: u.id, key: m, "data-target": f });
  }
  const g = JSON.stringify(e.target);
  return Array.isArray(e.body) ? /* @__PURE__ */ t.createElement(ue, { onClick: c, "data-target": g }, e.body.map((u, f) => d(u, g, f))) : /* @__PURE__ */ t.createElement(ue, { onClick: c, "data-target": g }, d(e.body, g));
}, Cn = ({ resource: e }) => /* @__PURE__ */ t.createElement(En, null, e.items.map((n, r) => /* @__PURE__ */ t.createElement(Sn, { key: r, item: n }))), kn = ({
  activeCanvas: e,
  resources: n,
  annotationResources: r
}) => {
  var f;
  const o = $(), { configOptions: i } = o, { informationPanel: a } = i, [l, s] = S(), c = (a == null ? void 0 : a.renderAbout) || ((f = i == null ? void 0 : i.informationPanel) == null ? void 0 : f.renderAbout), d = a == null ? void 0 : a.renderSupplementing, g = a == null ? void 0 : a.renderAnnotation;
  E(() => {
    c ? s("manifest-about") : n && (n == null ? void 0 : n.length) > 0 && !c ? s(n[0].id) : r && (r == null ? void 0 : r.length) > 0 && !c && s(r[0].id);
  }, [e, c, n, r]);
  const u = (m) => {
    s(m);
  };
  return n ? /* @__PURE__ */ t.createElement(
    Ot,
    {
      "data-testid": "information-panel",
      defaultValue: l,
      onValueChange: u,
      orientation: "horizontal",
      value: l
    },
    /* @__PURE__ */ t.createElement(Ft, { "aria-label": "select chapter", "data-testid": "information-panel-list" }, c && /* @__PURE__ */ t.createElement(Y, { value: "manifest-about" }, "About"), d && n && n.map(({ id: m, label: y }) => /* @__PURE__ */ t.createElement(Y, { key: m, value: m }, /* @__PURE__ */ t.createElement(O, { label: y }))), g && r && r.map((m, y) => /* @__PURE__ */ t.createElement(Y, { key: y, value: m.id }, /* @__PURE__ */ t.createElement(O, { label: m.label })))),
    /* @__PURE__ */ t.createElement(Vt, null, c && /* @__PURE__ */ t.createElement(K, { value: "manifest-about" }, /* @__PURE__ */ t.createElement(hn, null)), d && n && n.map((m) => /* @__PURE__ */ t.createElement(K, { key: m.id, value: m.id }, /* @__PURE__ */ t.createElement(wn, { resource: m }))), g && r && r.map((m) => /* @__PURE__ */ t.createElement(K, { key: m.id, value: m.id }, /* @__PURE__ */ t.createElement(Cn, { resource: m }))))
  ) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, We = p("div", {
  position: "absolute",
  right: "1rem",
  top: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: "1"
}), In = p("input", {
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
}), Q = p("button", {
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
}), $n = p("div", {
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
}), An = p("div", {
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
        [`& ${We}`]: {
          width: "calc(100% - 2rem)",
          "@sm": {
            width: "calc(100% - 2rem)"
          }
        }
      }
    }
  }
}), Tn = (e, n) => {
  E(() => {
    function r(o) {
      o.key === e && n();
    }
    return window.addEventListener("keyup", r), () => window.removeEventListener("keyup", r);
  }, []);
}, Mn = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Back"), /* @__PURE__ */ t.createElement(
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
)), zn = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Forward"), /* @__PURE__ */ t.createElement(
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
)), Rn = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Close"), /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })), Ln = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })), On = ({
  handleCanvasToggle: e,
  handleFilter: n,
  activeIndex: r,
  canvasLength: o
}) => {
  const [i, a] = S(!1), [l, s] = S(!1), [c, d] = S(!1);
  E(() => {
    d(r === 0), r === o - 1 ? s(!0) : s(!1);
  }, [r, o]), Tn("Escape", () => {
    a(!1), n("");
  });
  const g = () => {
    a((f) => !f), n("");
  }, u = (f) => n(f.target.value);
  return /* @__PURE__ */ t.createElement(An, { isToggle: i }, /* @__PURE__ */ t.createElement(We, null, i && /* @__PURE__ */ t.createElement(In, { autoFocus: !0, onChange: u, placeholder: "Search" }), !i && /* @__PURE__ */ t.createElement($n, null, /* @__PURE__ */ t.createElement(
    Q,
    {
      onClick: () => e(-1),
      disabled: c,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(Mn, null)
  ), /* @__PURE__ */ t.createElement("span", null, r + 1, " of ", o), /* @__PURE__ */ t.createElement(
    Q,
    {
      onClick: () => e(1),
      disabled: l,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(zn, null)
  )), /* @__PURE__ */ t.createElement(Q, { onClick: g, type: "button" }, i ? /* @__PURE__ */ t.createElement(Rn, null) : /* @__PURE__ */ t.createElement(Ln, null))));
}, Fn = p(Z.Root, {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  padding: "1.618rem",
  overflowX: "scroll",
  position: "relative",
  zIndex: "0"
}), Vn = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M256 112v288M400 256H112"
  }
), Hn = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z" }), /* @__PURE__ */ t.createElement("path", { d: "M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z" }), /* @__PURE__ */ t.createElement("path", { d: "M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z" })), Pn = () => /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" }), Bn = () => /* @__PURE__ */ t.createElement("path", { d: "M416 64H96a64.07 64.07 0 00-64 64v256a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V128a64.07 64.07 0 00-64-64zm-80 64a48 48 0 11-48 48 48.05 48.05 0 0148-48zM96 416a32 32 0 01-32-32v-67.63l94.84-84.3a48.06 48.06 0 0165.8 1.9l64.95 64.81L172.37 416zm352-32a32 32 0 01-32 32H217.63l121.42-121.42a47.72 47.72 0 0161.64-.16L448 333.84z" }), _n = () => /* @__PURE__ */ t.createElement("path", { d: "M464 384.39a32 32 0 01-13-2.77 15.77 15.77 0 01-2.71-1.54l-82.71-58.22A32 32 0 01352 295.7v-79.4a32 32 0 0113.58-26.16l82.71-58.22a15.77 15.77 0 012.71-1.54 32 32 0 0145 29.24v192.76a32 32 0 01-32 32zM268 400H84a68.07 68.07 0 01-68-68V180a68.07 68.07 0 0168-68h184.48A67.6 67.6 0 01336 179.52V332a68.07 68.07 0 01-68 68z" }), Ne = p("svg", {
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
}), Wn = ({ children: e }) => /* @__PURE__ */ t.createElement("title", null, e), A = (e) => /* @__PURE__ */ t.createElement(
  Ne,
  {
    ...e,
    "data-testid": "icon-svg",
    role: "img",
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg"
  },
  e.children
);
A.Title = Wn;
A.Add = Vn;
A.Audio = Hn;
A.Close = Pn;
A.Image = Bn;
A.Video = _n;
const Nn = ae({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), Dn = ae({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), De = p(B.Arrow, {
  fill: "$secondaryAlt"
}), jn = p(B.Close, {
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
}), Gn = p(B.Content, {
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
  '&[data-side="top"]': { animationName: Dn },
  '&[data-side="bottom"]': { animationName: Nn },
  /**
   *
   */
  '&[data-align="end"]': {
    [`& ${De}`]: {
      margin: "0 0.7rem"
    }
  }
}), qn = p(B.Trigger, {
  display: "inline-flex",
  padding: "0.5rem 0",
  margin: "0 0.5rem 0 0",
  cursor: "pointer",
  border: "none",
  background: "none",
  "> button, > span": {
    margin: "0"
  }
}), Un = p(B.Root, {
  boxSizing: "content-box"
}), Zn = (e) => /* @__PURE__ */ t.createElement(qn, { ...e }, e.children), Xn = (e) => /* @__PURE__ */ t.createElement(Gn, { ...e }, /* @__PURE__ */ t.createElement(De, null), /* @__PURE__ */ t.createElement(jn, null, /* @__PURE__ */ t.createElement(A, { isSmall: !0 }, /* @__PURE__ */ t.createElement(A.Close, null))), e.children), N = ({ children: e }) => /* @__PURE__ */ t.createElement(Un, null, e);
N.Trigger = Zn;
N.Content = Xn;
const te = p("div", {
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
  [`${Ne}`]: {
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
}), ne = p("span", {
  display: "flex"
}), Jn = p("span", {
  display: "flex",
  width: "1.2111rem",
  height: "0.7222rem"
}), Yn = p("span", {
  display: "inline-flex",
  marginLeft: "5px",
  marginBottom: "-1px"
}), Kn = p(Z.Item, {
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
      [`& ${ne}`]: {
        position: "absolute",
        right: "0",
        bottom: "0",
        [`& ${te}`]: {
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
        [`& ${ne}`]: {
          [`& ${te}`]: {
            backgroundColor: "$accent"
          }
        }
      }
    },
    figcaption: {
      fontWeight: "700"
    }
  }
}), Qn = ({ type: e }) => {
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
}, er = ({
  canvas: e,
  canvasIndex: n,
  isActive: r,
  thumbnail: o,
  type: i,
  handleChange: a
}) => /* @__PURE__ */ t.createElement(
  Kn,
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
      alt: e != null && e.label ? W(e.label) : ""
    }
  ), /* @__PURE__ */ t.createElement(ne, null, /* @__PURE__ */ t.createElement(te, { isIcon: !0, "data-testid": "thumbnail-tag" }, /* @__PURE__ */ t.createElement(Jn, null), /* @__PURE__ */ t.createElement(A, { "aria-label": i }, /* @__PURE__ */ t.createElement(Qn, { type: i })), ["Video", "Sound"].includes(i) && /* @__PURE__ */ t.createElement(Yn, null, Se(e.duration))))), (e == null ? void 0 : e.label) && /* @__PURE__ */ t.createElement("figcaption", { "data-testid": "fig-caption" }, /* @__PURE__ */ t.createElement(O, { label: e.label })))
), tr = (e) => e.body ? e.body.type : "Image", nr = ({ items: e }) => {
  const n = P(), r = $(), { activeCanvas: o, vault: i } = r, [a, l] = S(""), [s, c] = S([]), [d, g] = S(0), u = t.useRef(null), f = "painting", m = (v) => {
    o !== v && n({
      type: "updateActiveCanvas",
      canvasId: v
    });
  };
  E(() => {
    if (!s.length) {
      const v = ["Image", "Sound", "Video"], h = e.map(
        (b) => Ae(i, b, f, v)
      ).filter((b) => b.annotations.length > 0);
      c(h);
    }
  }, [e, s.length, i]), E(() => {
    s.forEach((v, h) => {
      v != null && v.canvas && v.canvas.id === o && g(h);
    });
  }, [o, s]), E(() => {
    const v = document.querySelector(
      `[data-canvas="${d}"]`
    );
    if (v instanceof HTMLElement && u.current) {
      const h = v.offsetLeft - u.current.offsetWidth / 2 + v.offsetWidth / 2;
      u.current.scrollTo({ left: h, behavior: "smooth" });
    }
  }, [d]);
  const y = (v) => l(v), x = (v) => {
    const h = s[d + v];
    h != null && h.canvas && m(h.canvas.id);
  };
  return /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
    On,
    {
      handleFilter: y,
      handleCanvasToggle: x,
      activeIndex: d,
      canvasLength: s.length
    }
  ), /* @__PURE__ */ t.createElement(Fn, { "aria-label": "select item", "data-testid": "media", ref: u }, s.filter((v) => {
    var h;
    if ((h = v.canvas) != null && h.label) {
      const b = W(v.canvas.label);
      if (Array.isArray(b))
        return b[0].toLowerCase().includes(a.toLowerCase());
    }
  }).map((v, h) => {
    var b, w;
    return /* @__PURE__ */ t.createElement(
      er,
      {
        canvas: v.canvas,
        canvasIndex: h,
        handleChange: m,
        isActive: o === ((b = v == null ? void 0 : v.canvas) == null ? void 0 : b.id),
        key: (w = v == null ? void 0 : v.canvas) == null ? void 0 : w.id,
        thumbnail: kt(i, v, 200, 200),
        type: tr(v.annotations[0])
      }
    );
  })));
}, je = p("button", {
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
}), Ge = p("button", {
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
}), qe = p(Ge, {
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
}), rr = p("div", {
  position: "relative",
  zIndex: "0",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  "&:hover": {
    [`${qe}`]: {
      backgroundColor: "$accent"
    },
    [`${je}`]: {
      backgroundColor: "#6662",
      img: {
        filter: "brightness(0.85)"
      }
    }
  }
}), or = p("div", {}), ar = p("svg", {
  height: "19px",
  color: "$accent",
  fill: "$accent",
  stroke: "$accent",
  display: "flex",
  margin: "0.25rem 0.85rem"
}), ir = p(_.Trigger, {
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
}), lr = p(_.Content, {
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
}), sr = p(_.Item, {
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
}), cr = p(_.Label, {
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
}), Ue = p(_.Root, {
  position: "relative",
  zIndex: "5",
  width: "100%"
}), ee = ({ direction: e, title: n }) => {
  const r = () => /* @__PURE__ */ t.createElement("path", { d: "M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" }), o = () => /* @__PURE__ */ t.createElement("path", { d: "M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" });
  return /* @__PURE__ */ t.createElement(
    ar,
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
}, Ze = ({
  children: e,
  label: n,
  maxHeight: r,
  onValueChange: o,
  value: i
}) => /* @__PURE__ */ t.createElement(Ue, { onValueChange: o, value: i }, /* @__PURE__ */ t.createElement(ir, { "data-testid": "select-button" }, /* @__PURE__ */ t.createElement(mt, { "data-testid": "select-button-value" }), /* @__PURE__ */ t.createElement(ut, null, /* @__PURE__ */ t.createElement(ee, { direction: "down", title: "select" }))), /* @__PURE__ */ t.createElement(pt, null, /* @__PURE__ */ t.createElement(
  lr,
  {
    css: { maxHeight: `${r} !important` },
    "data-testid": "select-content"
  },
  /* @__PURE__ */ t.createElement(gt, null, /* @__PURE__ */ t.createElement(ee, { direction: "up", title: "scroll up for more" })),
  /* @__PURE__ */ t.createElement(ft, null, /* @__PURE__ */ t.createElement(ht, null, n && /* @__PURE__ */ t.createElement(cr, null, /* @__PURE__ */ t.createElement(O, { "data-testid": "select-label", label: n })), e)),
  /* @__PURE__ */ t.createElement(vt, null, /* @__PURE__ */ t.createElement(ee, { direction: "down", title: "scroll down for more" }))
))), Xe = (e) => /* @__PURE__ */ t.createElement(sr, { ...e }, e.thumbnail && /* @__PURE__ */ t.createElement(Pe, { thumbnail: e.thumbnail }), /* @__PURE__ */ t.createElement(yt, null, /* @__PURE__ */ t.createElement(O, { label: e.label })), /* @__PURE__ */ t.createElement(xt, null)), dr = p("div", {
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
}), mr = p("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), ur = p("div", {
  width: "100%",
  height: "61.8vh",
  maxHeight: "100vh",
  background: "black",
  backgroundSize: "contain",
  color: "white",
  position: "relative",
  zIndex: "1",
  overflow: "hidden"
}), V = ({ id: e, label: n, children: r }) => /* @__PURE__ */ t.createElement(Ge, { id: e, "data-testid": "openseadragon-button" }, /* @__PURE__ */ t.createElement(
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
)), pr = p("div", {
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
}), gr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M256 112v288M400 256H112"
  }
), fr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 256H112"
  }
), hr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
  }
), vr = () => /* @__PURE__ */ t.createElement("path", { d: "M448 440a16 16 0 01-12.61-6.15c-22.86-29.27-44.07-51.86-73.32-67C335 352.88 301 345.59 256 344.23V424a16 16 0 01-27 11.57l-176-168a16 16 0 010-23.14l176-168A16 16 0 01256 88v80.36c74.14 3.41 129.38 30.91 164.35 81.87C449.32 292.44 464 350.9 464 424a16 16 0 01-16 16z" }), pe = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
  }
), /* @__PURE__ */ t.createElement("path", { d: "M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z" })), yr = ({
  hasPlaceholder: e,
  options: n
}) => /* @__PURE__ */ t.createElement(
  pr,
  {
    "data-testid": "openseadragon-controls",
    hasPlaceholder: e,
    id: "openseadragon-controls"
  },
  n.showZoomControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(V, { id: "zoomIn", label: "zoom in" }, /* @__PURE__ */ t.createElement(gr, null)), /* @__PURE__ */ t.createElement(V, { id: "zoomOut", label: "zoom out" }, /* @__PURE__ */ t.createElement(fr, null))),
  n.showFullPageControl && /* @__PURE__ */ t.createElement(V, { id: "fullPage", label: "full page" }, /* @__PURE__ */ t.createElement(hr, null)),
  n.showRotationControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(V, { id: "rotateRight", label: "rotate right" }, /* @__PURE__ */ t.createElement(pe, null)), /* @__PURE__ */ t.createElement(V, { id: "rotateLeft", label: "rotate left" }, /* @__PURE__ */ t.createElement(pe, null))),
  n.showHomeControl && /* @__PURE__ */ t.createElement(V, { id: "reset", label: "reset" }, /* @__PURE__ */ t.createElement(vr, null))
), xr = (e) => fetch(`${e.replace(/\/$/, "")}/info.json`).then((n) => n.json()).then((n) => n).catch((n) => {
  console.error(
    `The IIIF tilesource ${e.replace(
      /\/$/,
      ""
    )}/info.json failed to load: ${n}`
  );
}), br = (e) => {
  let n, r;
  if (Array.isArray(e) && (n = e[0], n)) {
    let o;
    "@id" in n ? o = n["@id"] : o = n.id, r = o;
  }
  return r;
};
let H = window.OpenSeadragon;
if (!H && (H = R, !H))
  throw new Error("OpenSeadragon is missing.");
const ge = "http://www.w3.org/2000/svg";
H.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new se(this), this._svgOverlayInfo);
};
const se = function(e) {
  const n = this;
  this._viewer = e, this._containerWidth = 0, this._containerHeight = 0, this._svg = document.createElementNS(ge, "svg"), this._svg.style.position = "absolute", this._svg.style.left = 0, this._svg.style.top = 0, this._svg.style.width = "100%", this._svg.style.height = "100%", this._viewer.canvas.appendChild(this._svg), this._node = document.createElementNS(ge, "g"), this._svg.appendChild(this._node), this._viewer.addHandler("animation", function() {
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
se.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new H.Point(0, 0), !0), n = this._viewer.viewport.getZoom(!0), r = this._viewer.viewport.getRotation(), o = this._viewer.viewport.getFlip(), i = this._viewer.viewport._containerInnerSize.x;
    let a = i * n;
    const l = a;
    o && (a = -a, e.x = -e.x + i), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + a + "," + l + ") rotate(" + r + ")"
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
const wr = (e) => new se(e);
function fe(e, n, r, o) {
  if (!e)
    return;
  const i = 1 / n.width;
  o.forEach((a) => {
    a.items.forEach((l) => {
      var s, c;
      typeof l.target == "string" ? l.target.includes("#xywh=") && Er(l, e, r, i) : typeof l.target == "object" && (((s = l.target.selector) == null ? void 0 : s.type) === "PointSelector" ? Sr(l, e, r, i) : ((c = l.target.selector) == null ? void 0 : c.type) === "SvgSelector" && Cr(l, e, r, i));
    });
  });
}
function Er(e, n, r, o) {
  const a = e.target.split("#xywh=");
  if (a && a[1]) {
    const [l, s, c, d] = a[1].split(",").map((g) => Number(g));
    kr(
      n,
      l * o,
      s * o,
      c * o,
      d * o,
      r
    );
  }
}
function Sr(e, n, r, o) {
  var s, c;
  const i = (s = e.target.selector) == null ? void 0 : s.x, a = (c = e.target.selector) == null ? void 0 : c.y, l = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${i}" cy="${a}" r="20" />
    </svg>
  `;
  Je(n, l, r, o);
}
function Cr(e, n, r, o) {
  var a;
  const i = (a = e.target.selector) == null ? void 0 : a.value;
  Je(n, i, r, o);
}
function kr(e, n, r, o, i, a) {
  const l = new R.Rect(n, r, o, i), s = document.createElement("div");
  if (a.annotationOverlays) {
    const { backgroundColor: c, opacity: d, borderType: g, borderColor: u, borderWidth: f } = a.annotationOverlays;
    s.style.backgroundColor = c, s.style.opacity = d, s.style.border = `${g} ${f} ${u}`, s.className = "annotation-overlay";
  }
  e.addOverlay(s, l);
}
function Ir(e) {
  if (!e)
    return null;
  const n = document.createElement("template");
  return n.innerHTML = e.trim(), n.content.children[0];
}
function Je(e, n, r, o) {
  const i = Ir(n);
  if (i)
    for (const a of i.children)
      Ye(e, a, r, o);
}
function Ye(e, n, r, o) {
  var i;
  if (n.nodeName === "#text")
    Ar(n);
  else {
    const a = $r(n, r, o), l = wr(e);
    l.node().append(a), (i = l._svg) == null || i.setAttribute("class", "annotation-overlay"), n.childNodes.forEach((s) => {
      Ye(e, s, r, o);
    });
  }
}
function $r(e, n, r) {
  var c, d, g, u;
  let o = !1, i = !1, a = !1, l = !1;
  const s = document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.nodeName
  );
  if (e.attributes.length > 0)
    for (let f = 0; f < e.attributes.length; f++) {
      const m = e.attributes[f];
      switch (m.name) {
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
      s.setAttribute(m.name, m.textContent);
    }
  return o || (s.style.stroke = (c = n.annotationOverlays) == null ? void 0 : c.borderColor), i || (s.style.strokeWidth = (d = n.annotationOverlays) == null ? void 0 : d.borderWidth), a || (s.style.fill = (g = n.annotationOverlays) == null ? void 0 : g.backgroundColor), l || (s.style.fillOpacity = (u = n.annotationOverlays) == null ? void 0 : u.opacity), s.setAttribute("transform", `scale(${r})`), s;
}
function Ar(e) {
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
const Tr = ({
  uri: e,
  hasPlaceholder: n,
  imageType: r,
  annotationResources: o
}) => {
  const [i, a] = S(), [l, s] = S(), c = $(), { configOptions: d, vault: g, activeCanvas: u } = c, f = P(), m = g.get({
    id: u,
    type: "Canvas"
  }), y = {
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
    ...d.openSeadragon,
    ajaxWithCredentials: d.withCredentials
  };
  return E(() => {
    e !== i && (a(e), s(we()));
  }, [i, e]), E(() => {
    var x;
    if (i)
      switch (r) {
        case "simpleImage":
          const v = R(y);
          v.addSimpleImage({
            url: i
          }), f({
            type: "updateOpenSeadragonViewer",
            openSeadragonViewer: v
          }), (x = d.annotationOverlays) != null && x.renderOverlays && fe(
            v,
            m,
            d,
            o
          );
          break;
        case "tiledImage":
          xr(i).then((h) => {
            var w;
            const b = R(y);
            b.addTiledImage({
              tileSource: h
            }), f({
              type: "updateOpenSeadragonViewer",
              openSeadragonViewer: b
            }), (w = d.annotationOverlays) != null && w.renderOverlays && fe(
              b,
              m,
              d,
              o
            );
          });
          break;
        default:
          console.warn(
            `Unable to render ${i} in OpenSeadragon as type: "${r}"`
          );
          break;
      }
  }, [i]), l ? /* @__PURE__ */ t.createElement(
    ur,
    {
      css: {
        backgroundColor: d.canvasBackgroundColor,
        height: d.canvasHeight
      }
    },
    /* @__PURE__ */ t.createElement(yr, { hasPlaceholder: n, options: y }),
    /* @__PURE__ */ t.createElement(dr, { id: `openseadragon-navigator-${l}` }),
    /* @__PURE__ */ t.createElement(mr, { id: `openseadragon-viewport-${l}` })
  ) : null;
}, Mr = ({
  painting: e,
  hasPlaceholder: n,
  annotationResources: r
}) => {
  const [o, i] = S(), [a, l] = S();
  return E(() => {
    Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0 ? (i("tiledImage"), l(br(e == null ? void 0 : e.service))) : (i("simpleImage"), l(e == null ? void 0 : e.id));
  }, [e]), /* @__PURE__ */ t.createElement(
    Tr,
    {
      uri: a,
      key: a,
      hasPlaceholder: n,
      imageType: o,
      annotationResources: r
    }
  );
}, zr = ({
  isMedia: e,
  label: n,
  placeholderCanvas: r,
  setIsInteractive: o
}) => {
  const { vault: i } = $(), a = G(i, r), l = a ? a[0] : void 0, s = n ? W(n) : ["placeholder image"];
  return /* @__PURE__ */ t.createElement(je, { onClick: () => o(!0), isMedia: e }, /* @__PURE__ */ t.createElement(
    "img",
    {
      src: (l == null ? void 0 : l.id) || "",
      alt: s.join(),
      height: l == null ? void 0 : l.height,
      width: l == null ? void 0 : l.width
    }
  ));
}, Rr = p("canvas", {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Lr = t.forwardRef(
  (e, n) => {
    const r = t.useRef(null), o = q(() => {
      var m, y;
      if ((m = n.current) != null && m.currentTime && ((y = n.current) == null ? void 0 : y.currentTime) > 0)
        return;
      const a = n.current;
      if (!a)
        return;
      const l = new AudioContext(), s = l.createMediaElementSource(a), c = l.createAnalyser(), d = r.current;
      if (!d)
        return;
      d.width = a.offsetWidth, d.height = a.offsetHeight;
      const g = d.getContext("2d");
      s.connect(c), c.connect(l.destination), c.fftSize = 256;
      const u = c.frequencyBinCount, f = new Uint8Array(u);
      setInterval(function() {
        i(
          c,
          g,
          u,
          f,
          d.width,
          d.height
        );
      }, 20);
    }, [n]);
    t.useEffect(() => {
      !n || !n.current || (n.current.onplay = o);
    }, [o, n]);
    function i(a, l, s, c, d, g) {
      const u = d / s * 2.6;
      let f, m = 0;
      a.getByteFrequencyData(c), l.fillStyle = "#000000", l.fillRect(0, 0, d, g);
      for (let y = 0; y < s; y++)
        f = c[y] * 2, l.fillStyle = "rgba(78, 42, 132, 1)", l.fillRect(m, g - f, u, f), m += u + 6;
    }
    return /* @__PURE__ */ t.createElement(Rr, { ref: r, role: "presentation" });
  }
), Or = p("div", {
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
}), Fr = ({ resource: e, ignoreCaptionLabels: n }) => {
  const r = W(e.label, "en");
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
}, Vr = ({ allSources: e, resources: n, painting: r }) => {
  const [o, i] = t.useState(0), [a, l] = t.useState(), s = t.useRef(null), c = (r == null ? void 0 : r.type) === "Sound", d = $(), { activeCanvas: g, configOptions: u, vault: f } = d;
  return E(() => {
    if (!r.id || !s.current)
      return;
    if (s != null && s.current) {
      const x = s.current;
      x.src = r.id, x.load();
    }
    if (r.id.split(".").pop() !== "m3u8")
      return;
    const m = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      xhrSetup: function(x, v) {
        x.withCredentials = !!u.withCredentials;
      }
    }, y = new M(m);
    return y.attachMedia(s.current), y.on(M.Events.MEDIA_ATTACHED, function() {
      y.loadSource(r.id);
    }), y.on(M.Events.ERROR, function(x, v) {
      if (v.fatal)
        switch (v.type) {
          case M.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${x} network error encountered, try to recover`
            ), y.startLoad();
            break;
          case M.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${x} media error encountered, try to recover`
            ), y.recoverMediaError();
            break;
          default:
            y.destroy();
            break;
        }
    }), () => {
      if (y && s.current) {
        const x = s.current;
        y.detachMedia(), y.destroy(), x.currentTime = 0;
      }
    };
  }, [u.withCredentials, r.id]), E(() => {
    var h, b, w, k;
    const m = f.get(g), y = (h = m.accompanyingCanvas) != null && h.id ? G(f, (b = m.accompanyingCanvas) == null ? void 0 : b.id) : null, x = (w = m.placeholderCanvas) != null && w.id ? G(f, (k = m.placeholderCanvas) == null ? void 0 : k.id) : null;
    !!(y && x) ? l(o === 0 ? x[0].id : y[0].id) : (y && l(y[0].id), x && l(x[0].id));
  }, [g, o, f]), E(() => {
    if (s != null && s.current) {
      const m = s.current;
      return m == null || m.addEventListener(
        "timeupdate",
        () => i(m.currentTime)
      ), () => document.removeEventListener("timeupdate", () => {
      });
    }
  }, []), /* @__PURE__ */ t.createElement(
    Or,
    {
      css: {
        backgroundColor: u.canvasBackgroundColor,
        maxHeight: u.canvasHeight,
        position: "relative"
      },
      "data-testid": "player-wrapper"
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
          maxHeight: u.canvasHeight,
          position: "relative",
          zIndex: "1"
        }
      },
      e.map((m) => /* @__PURE__ */ t.createElement("source", { src: m.id, type: m.format, key: m.id })),
      n.length > 0 && n.map((m) => /* @__PURE__ */ t.createElement(
        Fr,
        {
          resource: m,
          ignoreCaptionLabels: u.ignoreCaptionLabels || [],
          key: m.id
        }
      )),
      "Sorry, your browser doesn't support embedded videos."
    ),
    c && /* @__PURE__ */ t.createElement(Lr, { ref: s })
  );
}, Hr = () => /* @__PURE__ */ t.createElement(
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
), Pr = ({ isMedia: e }) => /* @__PURE__ */ t.createElement(
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
), Br = ({
  handleToggle: e,
  isInteractive: n,
  isMedia: r
}) => /* @__PURE__ */ t.createElement(
  qe,
  {
    onClick: e,
    isInteractive: n,
    isMedia: r,
    "data-testid": "placeholder-toggle"
  },
  n ? /* @__PURE__ */ t.createElement(Hr, null) : /* @__PURE__ */ t.createElement(Pr, { isMedia: r })
), _r = ({
  activeCanvas: e,
  isMedia: n,
  painting: r,
  resources: o,
  annotationResources: i
}) => {
  var T, I;
  const [a, l] = t.useState(0), [s, c] = t.useState(!1), { configOptions: d, customDisplays: g, vault: u } = $(), f = u.get(e), m = (T = f == null ? void 0 : f.placeholderCanvas) == null ? void 0 : T.id, y = !!m, x = (r == null ? void 0 : r.length) > 1, v = m && !s && !n, h = () => c(!s), b = (C) => {
    const F = r.findIndex((D) => D.id === C);
    l(F);
  }, w = g.find(
    (C) => C.target === e
  ), k = w == null ? void 0 : w.component;
  return /* @__PURE__ */ t.createElement(rr, null, /* @__PURE__ */ t.createElement(
    or,
    {
      style: {
        backgroundColor: d.canvasBackgroundColor,
        maxHeight: d.canvasHeight
      }
    },
    m && !n && /* @__PURE__ */ t.createElement(
      Br,
      {
        handleToggle: h,
        isInteractive: s,
        isMedia: n
      }
    ),
    v && !n && /* @__PURE__ */ t.createElement(
      zr,
      {
        isMedia: n,
        label: f == null ? void 0 : f.label,
        placeholderCanvas: m,
        setIsInteractive: c
      }
    ),
    !v && !w && (n ? /* @__PURE__ */ t.createElement(
      Vr,
      {
        allSources: r,
        painting: r[a],
        resources: o
      }
    ) : r && /* @__PURE__ */ t.createElement(
      Mr,
      {
        painting: r[a],
        hasPlaceholder: y,
        key: e,
        annotationResources: i
      }
    )),
    !v && k && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
      k,
      {
        id: w == null ? void 0 : w.target,
        painting: r[a],
        options: w == null ? void 0 : w.options
      }
    ))
  ), x && /* @__PURE__ */ t.createElement(
    Ze,
    {
      value: (I = r[a]) == null ? void 0 : I.id,
      onValueChange: b,
      maxHeight: "200px"
    },
    r == null ? void 0 : r.map((C) => /* @__PURE__ */ t.createElement(
      Xe,
      {
        value: C == null ? void 0 : C.id,
        key: C == null ? void 0 : C.id,
        label: C == null ? void 0 : C.label
      }
    ))
  ));
}, Wr = ({
  activeCanvas: e,
  painting: n,
  resources: r,
  annotationResources: o,
  items: i,
  isAudioVideo: a
}) => {
  const { informationOpen: l, configOptions: s } = $(), { informationPanel: c } = s, d = (c == null ? void 0 : c.renderAbout) || (c == null ? void 0 : c.renderSupplementing) && r.length > 0 || (c == null ? void 0 : c.renderAnnotation);
  return /* @__PURE__ */ t.createElement(Me, { className: "clover-content" }, /* @__PURE__ */ t.createElement(ze, null, /* @__PURE__ */ t.createElement(
    _r,
    {
      activeCanvas: e,
      isMedia: a,
      painting: n,
      resources: r,
      annotationResources: o
    }
  ), d && /* @__PURE__ */ t.createElement(Re, null, /* @__PURE__ */ t.createElement("span", null, l ? "View Items" : "More Information")), i.length > 1 && /* @__PURE__ */ t.createElement(Te, { className: "clover-canvases" }, /* @__PURE__ */ t.createElement(nr, { items: i, activeItem: 0 }))), l && d && /* @__PURE__ */ t.createElement(Rt, null, /* @__PURE__ */ t.createElement(Le, null, /* @__PURE__ */ t.createElement(
    kn,
    {
      activeCanvas: e,
      resources: r,
      annotationResources: o
    }
  ))));
}, Nr = p(N.Trigger, {
  width: "30px",
  padding: "5px"
}), Dr = p(N.Content, {
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
}), jr = p("span", {
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
}), Gr = p("header", {
  display: "flex",
  backgroundColor: "transparent !important",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  [`> ${Ue}`]: {
    flexGrow: "1",
    flexShrink: "0"
  },
  form: {
    flexGrow: "0",
    flexShrink: "1"
  }
}), qr = p("div", {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  padding: "1rem",
  flexShrink: "0",
  flexGrow: "1"
}), Ur = () => {
  var c;
  const e = P(), n = $(), { activeManifest: r, collection: o, configOptions: i, vault: a } = n, l = i == null ? void 0 : i.canvasHeight, s = (d) => {
    e({
      type: "updateActiveManifest",
      manifestId: d
    });
  };
  return /* @__PURE__ */ t.createElement("div", { style: { margin: "0.75rem" } }, /* @__PURE__ */ t.createElement(
    Ze,
    {
      label: o.label,
      maxHeight: l,
      value: r,
      onValueChange: s
    },
    (c = o == null ? void 0 : o.items) == null ? void 0 : c.map((d) => /* @__PURE__ */ t.createElement(
      Xe,
      {
        value: d.id,
        key: d.id,
        thumbnail: d != null && d.thumbnail ? a.get(d == null ? void 0 : d.thumbnail) : void 0,
        label: d.label
      }
    ))
  ));
}, Zr = (e, n = 2500) => {
  const [r, o] = S(), i = q(() => {
    navigator.clipboard.writeText(e).then(
      () => o("copied"),
      () => o("failed")
    );
  }, [e]);
  return E(() => {
    if (!r)
      return;
    const a = setTimeout(() => o(void 0), n);
    return () => clearTimeout(a);
  }, [r]), [r, i];
}, Xr = p("span", {
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
}), Jr = ({ status: e }) => e ? /* @__PURE__ */ t.createElement(Xr, { "data-copy-status": e }, e) : null, he = ({
  textPrompt: e,
  textToCopy: n
}) => {
  const [r, o] = Zr(n);
  return /* @__PURE__ */ t.createElement("button", { onClick: o }, e, " ", /* @__PURE__ */ t.createElement(Jr, { status: r }));
}, Yr = () => {
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
}, Kr = p(Ee.Root, {
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
}), Qr = p(Ee.Thumb, {
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
}), eo = p("label", {
  fontSize: "0.8333rem",
  fontWeight: "400",
  lineHeight: "1em",
  userSelect: "none",
  cursor: "pointer",
  paddingRight: "0.618rem"
}), to = p("form", {
  display: "flex",
  flexShrink: "0",
  flexGrow: "1",
  alignItems: "center",
  marginLeft: "1.618rem"
}), no = () => {
  var i;
  const { configOptions: e } = $(), n = P(), [r, o] = S((i = e == null ? void 0 : e.informationPanel) == null ? void 0 : i.open);
  return E(() => {
    n({
      type: "updateInformationOpen",
      informationOpen: r
    });
  }, [r]), /* @__PURE__ */ t.createElement(to, null, /* @__PURE__ */ t.createElement(eo, { htmlFor: "information-toggle", css: r ? { opacity: "1" } : {} }, "More Information"), /* @__PURE__ */ t.createElement(
    Kr,
    {
      checked: r,
      onCheckedChange: () => o(!r),
      id: "information-toggle",
      "aria-label": "information panel toggle",
      name: "toggled?"
    },
    /* @__PURE__ */ t.createElement(Qr, null)
  ));
}, Ke = (e) => {
  const n = () => window.matchMedia ? window.matchMedia(e).matches : !1, [r, o] = S(n);
  return E(() => {
    const i = () => o(n);
    return window.addEventListener("resize", i), () => window.removeEventListener("resize", i);
  }), r;
}, ro = ({ manifestId: e, manifestLabel: n }) => {
  const r = $(), { collection: o, configOptions: i } = r, { showTitle: a, showIIIFBadge: l, informationPanel: s } = i, c = l || (s == null ? void 0 : s.renderToggle), d = Ke(oe.sm);
  return /* @__PURE__ */ t.createElement(Gr, { className: "clover-header" }, o != null && o.items ? /* @__PURE__ */ t.createElement(Ur, null) : /* @__PURE__ */ t.createElement(jr, { className: a ? "" : "visually-hidden" }, a && /* @__PURE__ */ t.createElement(O, { label: n })), c && /* @__PURE__ */ t.createElement(qr, null, l && /* @__PURE__ */ t.createElement(N, null, /* @__PURE__ */ t.createElement(Nr, null, /* @__PURE__ */ t.createElement(Yr, null)), /* @__PURE__ */ t.createElement(Dr, null, (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (g) => {
        g.preventDefault(), window.open(o.id, "_blank");
      }
    },
    "View Collection"
  ), /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (g) => {
        g.preventDefault(), window.open(e, "_blank");
      }
    },
    "View Manifest"
  ), " ", (o == null ? void 0 : o.items) && /* @__PURE__ */ t.createElement(
    he,
    {
      textPrompt: "Copy Collection URL",
      textToCopy: o.id
    }
  ), /* @__PURE__ */ t.createElement(
    he,
    {
      textPrompt: "Copy Manifest URL",
      textToCopy: e
    }
  ))), (s == null ? void 0 : s.renderToggle) && !d && /* @__PURE__ */ t.createElement(no, null)));
}, oo = (e = !1) => {
  const [n, r] = S(e);
  return at(() => {
    if (!n)
      return;
    const o = document.documentElement.style.overflow;
    return document.documentElement.style.overflow = "hidden", () => {
      document.documentElement.style.overflow = o;
    };
  }, [n]), E(() => {
    n !== e && r(e);
  }, [e]), [n, r];
}, ao = ({ manifest: e, theme: n }) => {
  var I;
  const r = $(), o = P(), { activeCanvas: i, informationOpen: a, vault: l, configOptions: s } = r, [c, d] = S(!1), [g, u] = S(!1), [f, m] = S([]), [y, x] = S([]), [v, h] = S([]), [b, w] = oo(!1), k = Ke(oe.sm), T = q(
    (C) => {
      o({
        type: "updateInformationOpen",
        informationOpen: C
      });
    },
    [o]
  );
  return E(() => {
    var C;
    (C = s == null ? void 0 : s.informationPanel) != null && C.open && T(!k);
  }, [
    k,
    (I = s == null ? void 0 : s.informationPanel) == null ? void 0 : I.open,
    T
  ]), E(() => {
    if (!k) {
      w(!1);
      return;
    }
    w(a);
  }, [a, k, w]), E(() => {
    const C = G(l, i), F = Ct(
      l,
      i,
      "text/vtt"
    ), D = It(l, i);
    C && (u(
      ["Sound", "Video"].indexOf(C[0].type) > -1
    ), m(C)), x(F), h(D), d(
      F.length !== 0 || D.length !== 0
    );
  }, [i, l]), /* @__PURE__ */ t.createElement(it, { FallbackComponent: zt }, /* @__PURE__ */ t.createElement(
    Lt,
    {
      className: `${n} clover-iiif`,
      css: { background: s == null ? void 0 : s.background },
      "data-body-locked": b,
      "data-information-panel": c,
      "data-information-panel-open": a
    },
    /* @__PURE__ */ t.createElement(
      re.Root,
      {
        open: a,
        onOpenChange: T
      },
      /* @__PURE__ */ t.createElement(
        ro,
        {
          manifestLabel: e.label,
          manifestId: e.id
        }
      ),
      /* @__PURE__ */ t.createElement(
        Wr,
        {
          activeCanvas: i,
          painting: f,
          resources: y,
          annotationResources: v,
          items: e.items,
          isAudioVideo: g
        }
      )
    )
  ));
}, ve = {
  ignoreCache: !1,
  headers: {
    Accept: "application/json, text/javascript, text/plain"
  },
  timeout: 5e3,
  withCredentials: !1
};
function io(e) {
  return {
    ok: e.status >= 200 && e.status < 300,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: e.responseText,
    json: () => JSON.parse(e.responseText)
  };
}
function ye(e, n = null) {
  return {
    ok: !1,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: n || e.statusText,
    json: () => JSON.parse(n || e.statusText)
  };
}
function lo(e, n = ve) {
  const r = n.headers || ve.headers;
  return new Promise((o, i) => {
    const a = new XMLHttpRequest();
    a.open("get", e), a.withCredentials = n.withCredentials, r && Object.keys(r).forEach(
      (l) => a.setRequestHeader(l, r[l])
    ), a.onload = () => {
      o(io(a));
    }, a.onerror = () => {
      i(ye(a, "Failed to make request."));
    }, a.ontimeout = () => {
      i(ye(a, "Request took longer than expected."));
    }, a.send();
  });
}
const Eo = ({
  canvasIdCallback: e = () => {
  },
  osdViewerCallback: n,
  customDisplays: r = [],
  customTheme: o,
  iiifContent: i,
  id: a,
  manifestId: l,
  options: s
}) => {
  var d;
  let c = i;
  return a && (c = a), l && (c = l), /* @__PURE__ */ t.createElement(
    St,
    {
      initialState: {
        ...X,
        customDisplays: r,
        informationOpen: !!((d = s == null ? void 0 : s.informationPanel) != null && d.open),
        vault: new be({
          customFetcher: (g) => lo(g, {
            withCredentials: s == null ? void 0 : s.withCredentials,
            headers: s == null ? void 0 : s.requestHeaders
          }).then((u) => JSON.parse(u.data))
        })
      }
    },
    /* @__PURE__ */ t.createElement(
      so,
      {
        iiifContent: c,
        canvasIdCallback: e,
        osdViewerCallback: n,
        customTheme: o,
        options: s
      }
    )
  );
}, so = ({
  canvasIdCallback: e,
  osdViewerCallback: n,
  customTheme: r,
  iiifContent: o,
  options: i
}) => {
  const a = P(), l = $(), { activeCanvas: s, activeManifest: c, isLoaded: d, vault: g, openSeadragonViewer: u } = l, [f, m] = S(), [y, x] = S();
  let v = {};
  return r && (v = st("custom", r)), E(() => {
    e && e(s);
  }, [s, e]), E(() => {
    n && u && n(
      u,
      R,
      g,
      s
    );
  }, [u, g, s, n]), E(() => {
    c && g.loadManifest(c).then((h) => {
      x(h), a({
        type: "updateActiveCanvas",
        canvasId: h.items[0] && h.items[0].id
      });
    }).catch((h) => {
      console.error(`Manifest failed to load: ${h}`);
    }).finally(() => {
      a({
        type: "updateIsLoaded",
        isLoaded: !0
      });
    });
  }, [c, a, g]), E(() => {
    a({
      type: "updateConfigOptions",
      configOptions: i
    }), g.load(o).then((h) => {
      m(h);
    }).catch((h) => {
      console.error(
        `The IIIF resource ${o} failed to load: ${h}`
      );
    });
  }, [a, o, i, g]), E(() => {
    let h = [];
    (f == null ? void 0 : f.type) === "Collection" ? (a({
      type: "updateCollection",
      collection: f
    }), h = f.items.filter((b) => b.type === "Manifest").map((b) => b.id), h.length > 0 && a({
      type: "updateActiveManifest",
      manifestId: h[0]
    })) : (f == null ? void 0 : f.type) === "Manifest" && a({
      type: "updateActiveManifest",
      manifestId: f.id
    });
  }, [a, f]), d ? !y || !y.items ? (console.log(`The IIIF manifest ${o} failed to load.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : y.items.length === 0 ? (console.log(`The IIIF manifest ${o} does not contain canvases.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : /* @__PURE__ */ t.createElement(ao, { manifest: y, theme: v, key: y.id }) : /* @__PURE__ */ t.createElement(t.Fragment, null, "Loading");
};
export {
  Eo as default
};
//# sourceMappingURL=index.mjs.map
