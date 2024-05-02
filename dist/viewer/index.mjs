import t, { useReducer as Tt, useState as C, useRef as we, useEffect as E, useCallback as oe, createContext as Lt, useContext as Rt, cloneElement as Mt, Fragment as zt, useLayoutEffect as Ft } from "react";
import { Vault as he } from "@iiif/vault";
import { v4 as ae } from "uuid";
import * as xe from "@radix-ui/react-collapsible";
import ie from "openseadragon";
import { decodeContentState as Pt } from "@iiif/vault-helpers";
import { ErrorBoundary as le } from "react-error-boundary";
import { createStitches as Vt, createTheme as Ht } from "@stitches/react";
import * as se from "@radix-ui/react-tabs";
import * as ce from "@radix-ui/react-radio-group";
import { parse as Bt } from "node-webvtt";
import * as ee from "@radix-ui/react-form";
import Ot from "sanitize-html";
import B from "hls.js";
import * as K from "@radix-ui/react-popover";
import * as Q from "@radix-ui/react-select";
import { SelectValue as Dt, SelectIcon as Nt, SelectPortal as Wt, SelectScrollUpButton as _t, SelectViewport as jt, SelectGroup as Ut, SelectScrollDownButton as Gt, SelectItemText as qt, SelectItemIndicator as Zt } from "@radix-ui/react-select";
import * as Ue from "@radix-ui/react-switch";
const Xt = (e) => {
  const n = e.toString().split(":"), r = Math.ceil(parseInt(n[0])), a = Math.ceil(parseInt(n[1])), o = Jt(Math.ceil(parseInt(n[2])), 2);
  let l = `${r !== 0 && a < 10 ? (a + "").padStart(2, "0") : a}:${o}`;
  return r !== 0 && (l = `${r}:${l}`), l;
}, Ge = (e) => {
  const n = new Date(e * 1e3).toISOString().substr(11, 8);
  return Xt(n);
}, qe = (e, n) => {
  if (typeof e != "object" || e === null)
    return n;
  for (const r in n)
    typeof n[r] == "object" && n[r] !== null && !Array.isArray(n[r]) ? (e[r] || (e[r] = {}), e[r] = qe(e[r], n[r])) : e[r] = n[r];
  return e;
}, Yt = (e) => e.split("").reduce(function(n, r) {
  return n = (n << 5) - n + r.charCodeAt(0), n & n;
}, 0), Ze = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, Jt = (e, n) => String(e).padStart(n, "0"), Kt = {
  behavior: "smooth",
  block: "center"
}, _ = {
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
        settings: Kt
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
function Xe(e) {
  let n = {
    ..._.informationPanel.vtt.autoScroll
  };
  return typeof e == "object" && (n = "enabled" in e ? e : { enabled: !0, settings: e }), e === !1 && (n.enabled = !1), Qt(n.settings), n;
}
function Qt({ behavior: e, block: n }) {
  const r = ["auto", "instant", "smooth"], a = ["center", "end", "nearest", "start"];
  if (!r.includes(e))
    throw TypeError(`'${e}' not in ${r.join(" | ")}`);
  if (!a.includes(n))
    throw TypeError(`'${n}' not in ${a.join(" | ")}`);
}
var We, _e;
const en = Xe(
  (_e = (We = _ == null ? void 0 : _.informationPanel) == null ? void 0 : We.vtt) == null ? void 0 : _e.autoScroll
);
var je;
const de = {
  activeCanvas: "",
  activeManifest: "",
  OSDImageLoaded: !1,
  collection: {},
  configOptions: _,
  customDisplays: [],
  plugins: [],
  isAutoScrollEnabled: en.enabled,
  isAutoScrolling: !1,
  isInformationOpen: (je = _ == null ? void 0 : _.informationPanel) == null ? void 0 : je.open,
  isLoaded: !1,
  isUserScrolling: void 0,
  vault: new he(),
  contentSearchVault: new he(),
  openSeadragonViewer: null,
  viewerId: ae()
}, Ye = t.createContext(de), Je = t.createContext(de);
function tn(e, n) {
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
    case "updateOSDImageLoaded":
      return {
        ...e,
        OSDImageLoaded: n.OSDImageLoaded
      };
    case "updateAutoScrollAnnotationEnabled":
      return {
        ...e,
        isAutoScrollEnabled: n.isAutoScrollEnabled
      };
    case "updateAutoScrolling":
      return {
        ...e,
        isAutoScrolling: n.isAutoScrolling
      };
    case "updateCollection":
      return {
        ...e,
        collection: n.collection
      };
    case "updateConfigOptions":
      return {
        ...e,
        configOptions: qe(e.configOptions, n.configOptions)
      };
    case "updateInformationOpen":
      return {
        ...e,
        isInformationOpen: n.isInformationOpen
      };
    case "updateIsLoaded":
      return {
        ...e,
        isLoaded: n.isLoaded
      };
    case "updateUserScrolling":
      return {
        ...e,
        isUserScrolling: n.isUserScrolling
      };
    case "updateOpenSeadragonViewer":
      return {
        ...e,
        openSeadragonViewer: n.openSeadragonViewer
      };
    case "updateViewerId":
      return {
        ...e,
        viewerId: n.viewerId
      };
    default:
      throw new Error(`Unhandled action type: ${n.type}`);
  }
}
const nn = ({
  initialState: e = de,
  children: n
}) => {
  const [r, a] = Tt(tn, e);
  return /* @__PURE__ */ t.createElement(Ye.Provider, { value: r }, /* @__PURE__ */ t.createElement(
    Je.Provider,
    {
      value: a
    },
    n
  ));
};
function $() {
  const e = t.useContext(Ye);
  if (e === void 0)
    throw new Error("useViewerState must be used within a ViewerProvider");
  return e;
}
function z() {
  const e = t.useContext(Je);
  if (e === void 0)
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  return e;
}
const rn = async (e, n) => {
  const r = e.get({
    id: n,
    type: "Canvas"
  });
  if (!(r != null && r.annotations) || !r.annotations[0])
    return [];
  const o = e.get(r.annotations).filter((l) => l.items ? l : !1), i = [];
  for (const l of o)
    if (l.items.length > 0) {
      const s = l.label || { none: ["Annotations"] };
      i.push({ ...l, label: s });
    } else {
      let s = {};
      try {
        s = await e.load(l.id);
      } catch (c) {
        console.log(c);
      }
      if (s.items && s.items.length > 0) {
        const c = s.label || {
          none: ["Annotations"]
        };
        i.push({ ...s, label: c });
      }
    }
  return i;
}, Ke = async (e, n, r, a) => {
  if (a == null || a.q == null)
    return { label: { none: [r] } };
  const o = `${n}?q=${a.q.trim()}`;
  let i;
  try {
    i = await e.load(o);
  } catch {
    return console.log("Could not load content search."), {};
  }
  return i.label == null && (i.label = { none: [r] }), i;
}, Qe = (e, n, r, a) => {
  var l, s;
  const o = {
    canvas: void 0,
    accompanyingCanvas: void 0,
    annotationPage: void 0,
    annotations: []
  }, i = (c) => {
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
      const p = e.get(d.id);
      if (!p)
        return;
      switch (r) {
        case "painting":
          return c.target === n.id && c.motivation && c.motivation[0] === "painting" && a.includes(p.type) && (c.body = p), !!c;
        case "supplementing":
          return;
        default:
          throw new Error("Invalid annotation motivation.");
      }
    }
  };
  if (o.canvas = e.get(n), o.canvas && (o.annotationPage = e.get(o.canvas.items[0]), o.accompanyingCanvas = (l = o.canvas) != null && l.accompanyingCanvas ? e.get((s = o.canvas) == null ? void 0 : s.accompanyingCanvas) : void 0), o.annotationPage) {
    const c = e.get(o.annotationPage.items).map((p) => ({
      body: e.get(p.body[0].id),
      motivation: p.motivation,
      type: "Annotation"
    })), d = [];
    c.forEach((p) => {
      p.body.type === "Choice" ? p.body.items.forEach(
        (m) => d.push({
          ...p,
          id: m.id,
          body: e.get(m.id)
        })
      ) : d.push(p);
    }), o.annotations = d.filter(i);
  }
  return o;
}, Z = (e, n = "en") => {
  if (!e)
    return "";
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return e[n];
}, re = (e, n) => {
  const r = Qe(
    e,
    { id: n, type: "Canvas" },
    "painting",
    ["Image", "Sound", "Video"]
  );
  if (r.annotations.length !== 0 && r.annotations && r.annotations)
    return r.annotations.map(
      (a) => a == null ? void 0 : a.body
    );
}, on = (e, n, r, a) => {
  const o = [];
  if (n.canvas && n.canvas.thumbnail.length > 0) {
    const s = e.get(
      n.canvas.thumbnail[0]
    );
    o.push(s);
  }
  if (n.annotations[0]) {
    if (n.annotations[0].thumbnail && n.annotations[0].thumbnail.length > 0) {
      const c = e.get(
        n.annotations[0].thumbnail[0]
      );
      o.push(c);
    }
    if (!n.annotations[0].body)
      return;
    const s = n.annotations[0].body;
    s.type === "Image" && o.push(s);
  }
  return o.length === 0 ? void 0 : {
    id: o[0].id,
    format: o[0].format,
    type: o[0].type,
    width: r,
    height: a
  };
};
let U = window.OpenSeadragon;
if (!U && (U = ie, !U))
  throw new Error("OpenSeadragon is missing.");
const Le = "http://www.w3.org/2000/svg";
U.Viewer && (U.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new Ee(this), this._svgOverlayInfo);
});
const Ee = function(e) {
  const n = this;
  this._viewer = e, this._containerWidth = 0, this._containerHeight = 0, this._svg = document.createElementNS(Le, "svg"), this._svg.style.position = "absolute", this._svg.style.left = 0, this._svg.style.top = 0, this._svg.style.width = "100%", this._svg.style.height = "100%", this._viewer.canvas.appendChild(this._svg), this._node = document.createElementNS(Le, "g"), this._svg.appendChild(this._node), this._viewer.addHandler("animation", function() {
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
Ee.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new U.Point(0, 0), !0), n = this._viewer.viewport.getZoom(!0), r = this._viewer.viewport.getRotation(), a = this._viewer.viewport.getFlip(), o = this._viewer.viewport._containerInnerSize.x;
    let i = o * n;
    const l = i;
    a && (i = -i, e.x = -e.x + o), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + i + "," + l + ") rotate(" + r + ")"
    );
  },
  // ----------
  onClick: function(e, n) {
    new U.MouseTracker({
      element: e,
      clickHandler: n
    }).setTracking(!0);
  }
};
const an = (e) => new Ee(e), et = (e) => {
  var r, a, o, i, l;
  let n = {
    id: typeof e == "string" ? e : e.source
  };
  if (typeof e == "string") {
    if (e.includes("#xywh=")) {
      const s = e.split("#xywh=");
      if (s && s[1]) {
        const [c, d, p, m] = s[1].split(",").map((y) => Number(y));
        n = {
          id: s[0],
          rect: {
            x: c,
            y: d,
            w: p,
            h: m
          }
        };
      }
    } else if (e.includes("#t=")) {
      const s = e.split("#t=");
      s && s[1] && (n = {
        id: s[0],
        t: s[1]
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
    else if (((a = e.selector) == null ? void 0 : a.type) === "SvgSelector")
      n = {
        id: e.source,
        svg: e.selector.value
      };
    else if (((o = e.selector) == null ? void 0 : o.type) === "FragmentSelector" && (i = e.selector) != null && i.value.includes("xywh=") && e.source.type == "Canvas" && e.source.id) {
      const s = (l = e.selector) == null ? void 0 : l.value.split("xywh=");
      if (s && s[1]) {
        const [c, d, p, m] = s[1].split(",").map((y) => Number(y));
        n = {
          id: e.source.id,
          rect: {
            x: c,
            y: d,
            w: p,
            h: m
          }
        };
      }
    }
  }
  return n;
}, ln = (e) => fetch(`${e.replace(/\/$/, "")}/info.json`).then((n) => n.json()).then((n) => n).catch((n) => {
  console.error(
    `The IIIF tilesource ${e.replace(
      /\/$/,
      ""
    )}/info.json failed to load: ${n}`
  );
}), sn = (e) => {
  let n, r;
  if (Array.isArray(e) && (n = e[0], n)) {
    let a;
    "@id" in n ? a = n["@id"] : a = n.id, r = a;
  }
  return r;
}, Se = (e) => {
  var a;
  let n, r;
  if (un(e))
    n = e, r = {};
  else {
    const o = JSON.parse(Pt(e));
    switch (o == null ? void 0 : o.type) {
      case "SpecificResource":
      case "Range":
      case "Annotation":
        n = o == null ? void 0 : o.target.partOf[0].id, r = {
          manifest: n,
          canvas: o == null ? void 0 : o.target.id
        };
        break;
      case "Canvas":
        n = o == null ? void 0 : o.partOf[0].id, r = {
          manifest: n,
          canvas: o == null ? void 0 : o.id
        };
        break;
      case "Manifest":
        n = o == null ? void 0 : o.id, r = {
          collection: (a = o == null ? void 0 : o.partOf[0]) == null ? void 0 : a.id,
          manifest: o == null ? void 0 : o.id
        };
        break;
      case "Collection":
        n = o == null ? void 0 : o.id, r = {
          collection: n
        };
        break;
    }
  }
  return { resourceId: n, active: r };
}, cn = (e) => {
  const { resourceId: n, active: r } = Se(e);
  return r.collection || r.manifest || n;
}, dn = (e, n) => {
  const r = n.items.map((i) => i.id), { active: a } = Se(e), o = a.canvas;
  return r.includes(o) ? o : r[0];
}, mn = (e, n) => {
  const { active: r } = Se(e), a = r.manifest, o = n.items.filter((i) => i.type === "Manifest").map((i) => i.id);
  return o.length == 0 ? null : o.includes(a) ? a : o[0];
}, un = (e) => {
  try {
    new URL(e);
  } catch {
    return !1;
  }
  return !0;
};
var J = /* @__PURE__ */ ((e) => (e.TiledImage = "tiledImage", e.SimpleImage = "simpleImage", e))(J || {});
function tt(e, n, r, a, o) {
  if (!e)
    return;
  const i = 1 / n.width;
  a.forEach((l) => {
    if (!l.target)
      return;
    const s = et(l.target), { point: c, rect: d, svg: p } = s;
    if (d) {
      const { x: m, y, w: v, h: u } = d;
      fn(
        e,
        m * i,
        y * i,
        v * i,
        u * i,
        r,
        o
      );
    }
    if (c) {
      const { x: m, y } = c, v = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${m}" cy="${y}" r="20" />
        </svg>
      `;
      Re(e, v, r, i, o);
    }
    p && Re(e, p, r, i, o);
  });
}
function pn(e, n, r) {
  let a, o, i = 40, l = 40;
  n.rect && (a = n.rect.x, o = n.rect.y, i = n.rect.w, l = n.rect.h), n.point && (a = n.point.x, o = n.point.y);
  const s = 1 / e.width;
  return new ie.Rect(
    a * s - i * s / 2 * (r - 1),
    o * s - l * s / 2 * (r - 1),
    i * s * r,
    l * s * r
  );
}
function fn(e, n, r, a, o, i, l) {
  const s = new ie.Rect(n, r, a, o), c = document.createElement("div");
  if (i) {
    const { backgroundColor: d, opacity: p, borderType: m, borderColor: y, borderWidth: v } = i;
    c.style.backgroundColor = d, c.style.opacity = p, c.style.border = `${m} ${v} ${y}`, c.className = l;
  }
  e.addOverlay(c, s);
}
function hn(e) {
  if (!e)
    return null;
  const n = document.createElement("template");
  return n.innerHTML = e.trim(), n.content.children[0];
}
function Re(e, n, r, a, o) {
  const i = hn(n);
  if (i)
    for (const l of i.children)
      nt(e, l, r, a, o);
}
function nt(e, n, r, a, o) {
  var i;
  if (n.nodeName === "#text")
    vn(n);
  else {
    const l = gn(n, r, a), s = an(e);
    s.node().append(l), (i = s._svg) == null || i.setAttribute("class", o), n.childNodes.forEach((c) => {
      nt(e, c, r, a, o);
    });
  }
}
function gn(e, n, r) {
  let a = !1, o = !1, i = !1, l = !1;
  const s = document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.nodeName
  );
  if (e.attributes.length > 0)
    for (let c = 0; c < e.attributes.length; c++) {
      const d = e.attributes[c];
      switch (d.name) {
        case "fill":
          i = !0;
          break;
        case "stroke":
          a = !0;
          break;
        case "stroke-width":
          o = !0;
          break;
        case "fill-opacity":
          l = !0;
          break;
      }
      s.setAttribute(d.name, d.textContent);
    }
  return a || (s.style.stroke = n == null ? void 0 : n.borderColor), o || (s.style.strokeWidth = n == null ? void 0 : n.borderWidth), i || (s.style.fill = n == null ? void 0 : n.backgroundColor), l || (s.style.fillOpacity = n == null ? void 0 : n.opacity), s.setAttribute("transform", `scale(${r})`), s;
}
function vn(e) {
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
const yn = (e) => {
  const n = Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0, r = n ? sn(e == null ? void 0 : e.service) : e == null ? void 0 : e.id, a = n ? J.TiledImage : J.SimpleImage;
  return {
    uri: r,
    imageType: a
  };
}, bn = (e, n) => {
  const r = n ? J.TiledImage : J.SimpleImage;
  return {
    uri: e,
    imageType: r
  };
};
function rt(e, n) {
  if (!e)
    return;
  n.startsWith(".") || (n = "." + n);
  const r = document.querySelectorAll(n);
  r && r.forEach((a) => e.removeOverlay(a));
}
function ge(e, n, r, a) {
  const o = et(r), { point: i, rect: l, svg: s } = o;
  if (i || l || s) {
    const c = pn(
      a,
      o,
      n
    );
    e == null || e.viewport.fitBounds(c);
  }
}
const ue = 209, wn = {
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
    accent: `hsl(${ue} 100% 38.2%)`,
    accentMuted: `hsl(${ue} 80% 61.8%)`,
    accentAlt: `hsl(${ue} 80% 30%)`,
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
}, Ce = {
  xxs: "(max-width: 349px)",
  xs: "(max-width: 575px)",
  sm: "(max-width: 767px)",
  md: "(max-width: 991px)",
  lg: "(max-width: 90rem)",
  xl: "(min-width: calc(90rem + 1px))"
}, { styled: h, css: Pa, keyframes: ke, createTheme: Va } = Vt({
  theme: wn,
  media: Ce
}), xn = h("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}), En = h("p", {
  fontWeight: "bold",
  fontSize: "x-large"
}), Sn = h("span", {
  fontSize: "medium"
}), me = ({ error: e }) => {
  const { message: n } = e;
  return /* @__PURE__ */ t.createElement(xn, { role: "alert" }, /* @__PURE__ */ t.createElement(En, { "data-testid": "headline" }, "Something went wrong"), n && /* @__PURE__ */ t.createElement(Sn, null, `Error message: ${n}`, " "));
}, ot = h("div", {
  position: "relative",
  zIndex: "0"
}), at = h("div", {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  overflow: "hidden",
  "@sm": {
    flexDirection: "column"
  }
}), it = h("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  width: "61.8%",
  "@sm": {
    width: "100%"
  }
}), lt = h(xe.Trigger, {
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
}), st = h(xe.Content, {
  width: "100%",
  display: "flex"
}), Cn = h("aside", {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  width: "38.2%",
  maxHeight: "100%",
  "@sm": {
    width: "100%"
  }
}), kn = h("div", {
  display: "flex",
  flexDirection: "column",
  fontSmooth: "auto",
  webkitFontSmoothing: "antialiased",
  '&[data-absolute-position="true"]': {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: "0"
  },
  "> div": {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    justifyContent: "flex-start",
    height: "100%",
    maxHeight: "100%",
    "@sm": {
      [`& ${at}`]: {
        flexGrow: "1"
      },
      [`& ${it}`]: {
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
      [`& ${ot}`]: {
        display: "none"
      },
      [`& ${lt}`]: {
        margin: "1rem"
      },
      [`& ${st}`]: {
        height: "100%"
      }
    }
  }
}), In = h(se.Root, {
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
}), $n = h(se.List, {
  display: "flex",
  flexGrow: "0",
  margin: "0 1.618rem",
  borderBottom: "4px solid #6663",
  "@sm": {
    margin: "0 1rem"
  }
}), te = h(se.Trigger, {
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
}), ne = h(se.Content, {
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
}), An = ({
  handleScroll: e,
  children: n,
  className: r
}) => /* @__PURE__ */ t.createElement("div", { className: r, onScroll: e }, n), Tn = h(An, {
  position: "relative",
  height: "100%",
  width: "100%",
  overflowY: "scroll"
}), ct = {
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
}, dt = h("button", {
  textAlign: "left",
  "&:hover": {
    color: "$accent"
  }
}), Ln = h("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), Rn = h("div", {
  ...ct
}), Mn = h("div", {
  "&:hover": {
    color: "$accent"
  }
}), Me = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(dt, { onClick: n }, e), zn = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(
  Mn,
  {
    dangerouslySetInnerHTML: { __html: e },
    onClick: n
  }
), Fn = () => {
  function e(o) {
    return o.map((i) => {
      const l = i.identifier || ae();
      return { ...i, identifier: l };
    });
  }
  function n(o) {
    var c;
    const i = [], l = [], s = e(o);
    for (const d of s) {
      for (; l.length > 0 && l[l.length - 1].end <= d.start; )
        l.pop();
      l.length > 0 ? (l[l.length - 1].children || (l[l.length - 1].children = []), (c = l[l.length - 1].children) == null || c.push(d), l.push(d)) : (i.push(d), l.push(d));
    }
    return i;
  }
  function r(o, i = []) {
    return i.some(
      (l) => o.start >= l.start && o.end <= l.end
    );
  }
  function a(o = []) {
    return o.sort((i, l) => i.start - l.start);
  }
  return {
    addIdentifiersToParsedCues: e,
    createNestedCues: n,
    isChild: r,
    orderCuesByTime: a
  };
}, ze = ke({
  from: { transform: "rotate(360deg)" },
  to: { transform: "rotate(0deg)" }
}), Pn = h(ce.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), mt = h(ce.Item, {
  ...ct,
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
      animationName: ze,
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
      animationName: ze,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    }
  }
}), Vn = 750, Hn = (e) => {
  for (; e && e !== document.body; ) {
    const n = window.getComputedStyle(e).overflowY;
    if (n !== "visible" && n !== "hidden" && e.scrollHeight > e.clientHeight)
      return e;
    e = e.parentNode;
  }
  return null;
}, Bn = ({ label: e, start: n, end: r }) => {
  var v, u;
  const a = z(), {
    configOptions: o,
    isAutoScrollEnabled: i,
    isUserScrolling: l
  } = $(), s = (u = (v = o == null ? void 0 : o.informationPanel) == null ? void 0 : v.vtt) == null ? void 0 : u.autoScroll, [c, d] = C(!1), p = we(null), m = document.getElementById(
    "clover-iiif-video"
  );
  E(() => (m == null || m.addEventListener("timeupdate", () => {
    const { currentTime: f } = m;
    d(n <= f && f < r);
  }), () => document.removeEventListener("timeupdate", () => {
  })), [r, n, m]), E(() => {
    var g;
    const f = (b) => {
      a({ type: "updateAutoScrolling", isAutoScrolling: !0 }), b(), setTimeout(
        () => a({ type: "updateAutoScrolling", isAutoScrolling: !1 }),
        Vn
      );
    };
    if (i && c && p.current && !l) {
      const b = p.current;
      if (b && b instanceof HTMLElement) {
        const w = Hn(b);
        if (w && w instanceof HTMLElement) {
          let k;
          switch ((g = s == null ? void 0 : s.settings) == null ? void 0 : g.block) {
            case "center":
              const A = w.getBoundingClientRect();
              k = b.offsetTop + b.offsetHeight - Math.floor((A.bottom - A.top) / 2);
              break;
            case "end":
              k = b.offsetTop + b.offsetHeight - (w.clientHeight - b.clientHeight) + 2;
              break;
            default:
              k = b.offsetTop - 2;
              break;
          }
          f(
            () => {
              var A;
              return w.scrollTo({
                top: k,
                left: 0,
                behavior: (A = s == null ? void 0 : s.settings) == null ? void 0 : A.behavior
              });
            }
          );
        }
      }
    }
  }, [
    s,
    c,
    l,
    i,
    a
  ]);
  const y = () => {
    m && (m.pause(), m.currentTime = n, m.play());
  };
  return /* @__PURE__ */ t.createElement(
    mt,
    {
      ref: p,
      "aria-checked": c,
      "data-testid": "information-panel-cue",
      onClick: y,
      value: e
    },
    e,
    /* @__PURE__ */ t.createElement("strong", null, Ge(n))
  );
}, On = h("ul", {
  listStyle: "none",
  paddingLeft: "1rem",
  position: "relative",
  "&&:first-child": {
    paddingLeft: "0"
  },
  "& li ul": {
    [`& ${mt}`]: {
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
}), ut = ({ items: e }) => /* @__PURE__ */ t.createElement(On, null, e.map((n) => {
  const { text: r, start: a, end: o, children: i, identifier: l } = n;
  return /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement(Bn, { label: r, start: a, end: o }), i && /* @__PURE__ */ t.createElement(ut, { items: i }));
})), Dn = ({
  label: e,
  vttUri: n
}) => {
  const [r, a] = t.useState([]), { createNestedCues: o, orderCuesByTime: i } = Fn(), [l, s] = t.useState();
  return E(
    () => {
      n && fetch(n, {
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json"
        }
      }).then((c) => c.text()).then((c) => {
        const d = Bt(c).cues, p = i(d), m = o(p);
        a(m);
      }).catch((c) => {
        console.error(n, c.toString()), s(c);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n]
  ), /* @__PURE__ */ t.createElement(
    Pn,
    {
      "data-testid": "annotation-item-vtt",
      "aria-label": `navigate ${Z(e, "en")}`
    },
    l && /* @__PURE__ */ t.createElement("div", { "data-testid": "error-message" }, "Network Error: ", l.toString()),
    /* @__PURE__ */ t.createElement(ut, { items: r })
  );
}, Nn = ({
  caption: e,
  handleClick: n,
  imageUri: r
}) => /* @__PURE__ */ t.createElement(dt, { onClick: n }, /* @__PURE__ */ t.createElement("img", { src: r, alt: `A visual annotation for ${e}` }), /* @__PURE__ */ t.createElement("span", null, e)), Wn = ({ annotation: e }) => {
  var v, u;
  const { target: n } = e, r = $(), { openSeadragonViewer: a, vault: o, activeCanvas: i, configOptions: l } = r, s = e.body.map((f) => o.get(f.id)), c = ((v = s.find((f) => f.format)) == null ? void 0 : v.format) || "", d = ((u = s.find((f) => f.value)) == null ? void 0 : u.value) || "", p = o.get({
    id: i,
    type: "Canvas"
  });
  function m() {
    var g;
    if (!n)
      return;
    const f = ((g = l.annotationOverlays) == null ? void 0 : g.zoomLevel) || 1;
    ge(a, f, n, p);
  }
  function y() {
    var f, g;
    switch (c) {
      case "text/plain":
        return /* @__PURE__ */ t.createElement(
          Me,
          {
            value: d,
            handleClick: m
          }
        );
      case "text/html":
        return /* @__PURE__ */ t.createElement(
          zn,
          {
            value: d,
            handleClick: m
          }
        );
      case "text/vtt":
        return /* @__PURE__ */ t.createElement(
          Dn,
          {
            label: s[0].label,
            vttUri: s[0].id || ""
          }
        );
      case ((f = c.match(/^image\//)) == null ? void 0 : f.input):
        const b = ((g = s.find((w) => {
          var k;
          return !((k = w.id) != null && k.includes("vault://"));
        })) == null ? void 0 : g.id) || "";
        return /* @__PURE__ */ t.createElement(
          Nn,
          {
            caption: d,
            handleClick: m,
            imageUri: b
          }
        );
      default:
        return /* @__PURE__ */ t.createElement(
          Me,
          {
            value: d,
            handleClick: m
          }
        );
    }
  }
  return /* @__PURE__ */ t.createElement(Rn, null, y());
}, _n = ({ annotationPage: e }) => {
  var o;
  const n = $(), { vault: r } = n;
  if (!e || !e.items || ((o = e.items) == null ? void 0 : o.length) === 0)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = e.items.map((i) => r.get(i.id));
  return a ? /* @__PURE__ */ t.createElement(Ln, { "data-testid": "annotation-page" }, a == null ? void 0 : a.map((i) => /* @__PURE__ */ t.createElement(Wn, { key: i.id, annotation: i }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, jn = h("button", {
  textAlign: "left",
  "&:hover": {
    color: "$accent"
  }
}), Un = h("li", {
  margin: "0.25rem 0"
}), Gn = h("ol", {
  listStyleType: "auto",
  marginBottom: "1rem",
  listStylePosition: "inside"
}), qn = h("div", {
  margin: "0.5rem 1.618rem"
}), Zn = h("div", {
  fontWeight: "bold"
}), Xn = h("div", {
  marginBottom: "1rem"
}), Yn = ({
  value: e,
  handleClick: n,
  target: r,
  canvas: a
}) => /* @__PURE__ */ t.createElement(
  jn,
  {
    onClick: n,
    "data-target": r,
    "data-canvas": a
  },
  e
), Jn = ({
  annotation: e,
  activeContentSearchTarget: n,
  setActiveContentSearchTarget: r
}) => {
  var k, A, M;
  const a = z(), o = $(), {
    openSeadragonViewer: i,
    vault: l,
    contentSearchVault: s,
    activeCanvas: c,
    configOptions: d,
    OSDImageLoaded: p
  } = o, m = l.get({
    id: c,
    type: "Canvas"
  }), v = ((k = e.body.map((I) => s.get(I.id)).find((I) => I.value)) == null ? void 0 : k.value) || "";
  let u;
  e.target && typeof e.target == "string" && (u = e.target);
  let f;
  if (u) {
    const I = u.split("#xywh");
    I.length > 1 && (f = I[0]);
  }
  const g = ((M = (A = d.contentSearch) == null ? void 0 : A.overlays) == null ? void 0 : M.zoomLevel) || 1;
  E(() => {
    p && i && e.target && e.target == n && ge(i, g, u, m);
  }, [i, p]);
  function b(I) {
    if (!i)
      return;
    const P = JSON.parse(I.target.dataset.target), V = I.target.dataset.canvas;
    c === V ? ge(i, g, u, m) : (a({
      type: "updateOSDImageLoaded",
      OSDImageLoaded: !1
    }), a({
      type: "updateActiveCanvas",
      canvasId: V
    }), r(P));
  }
  const w = JSON.stringify(u);
  return /* @__PURE__ */ t.createElement(Un, null, /* @__PURE__ */ t.createElement(
    Yn,
    {
      target: w,
      canvas: f,
      value: v,
      handleClick: b
    }
  ));
}, Kn = ({ annotationPage: e }) => {
  var m, y, v;
  const n = $(), { contentSearchVault: r, configOptions: a } = n, [o, i] = C(), l = (m = a.contentSearch) == null ? void 0 : m.searchResultsLimit, s = (y = a.localeText) == null ? void 0 : y.contentSearch;
  function c(u) {
    const f = {};
    return u.items.forEach((g) => {
      const b = r.get(
        g.id
      );
      let w = "";
      if (b.label) {
        const k = Z(b.label);
        k && (w = k[0]);
      }
      f[w] == null && (f[w] = []), f[w].push(b);
    }), f;
  }
  function d(u) {
    return (l ? u.slice(0, l) : u).map((g, b) => /* @__PURE__ */ t.createElement(
      Jn,
      {
        key: b,
        annotation: g,
        activeContentSearchTarget: o,
        setActiveContentSearchTarget: i
      }
    ));
  }
  function p(u) {
    if (l) {
      const f = u.length - l;
      if (f > 0)
        return /* @__PURE__ */ t.createElement(Xn, null, f, " ", s == null ? void 0 : s.moreResults);
    }
  }
  return !e || !e.items || ((v = e.items) == null ? void 0 : v.length) === 0 ? /* @__PURE__ */ t.createElement("p", null, s == null ? void 0 : s.noSearchResults) : /* @__PURE__ */ t.createElement(t.Fragment, null, Object.entries(c(e)).map(
    ([u, f], g) => /* @__PURE__ */ t.createElement("div", { key: g }, /* @__PURE__ */ t.createElement(Zn, { className: "content-search-results-title" }, u), /* @__PURE__ */ t.createElement(Gn, { className: "content-search-results" }, d(f)), p(f))
  ));
}, Qn = h("div", {
  ".content-search-form": { display: "flex", marginBottom: "1rem" },
  input: {
    padding: ".25rem",
    marginRight: "1rem"
  }
}), er = h("button", {
  display: "flex",
  background: "none",
  border: "none",
  width: "2rem",
  height: "2rem",
  padding: "0",
  margin: "0",
  fontWeight: "700",
  borderRadius: "2rem",
  backgroundColor: "$accent",
  color: "$secondary",
  cursor: "pointer",
  boxSizing: "content-box",
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
}), tr = ({
  searchServiceUrl: e,
  setContentSearchResource: n,
  setLoading: r
}) => {
  var y;
  const [a, o] = C(), i = $(), { contentSearchVault: l, openSeadragonViewer: s, configOptions: c } = i, d = (y = c.localeText) == null ? void 0 : y.contentSearch;
  async function p(v) {
    v.preventDefault();
    const u = d == null ? void 0 : d.tabLabel;
    if (s && e) {
      if (!a || a.trim() === "") {
        n({
          label: { none: [u] }
        });
        return;
      }
      r(!0), Ke(l, e, u, {
        q: a
      }).then((f) => {
        n(f), r(!1);
      });
    }
  }
  const m = (v) => {
    v.preventDefault(), o(v.target.value);
  };
  return /* @__PURE__ */ t.createElement(Qn, null, /* @__PURE__ */ t.createElement(ee.Root, { onSubmit: p, className: "content-search-form" }, /* @__PURE__ */ t.createElement(
    ee.Field,
    {
      className: "FormField",
      name: "searchTerms",
      onChange: m
    },
    /* @__PURE__ */ t.createElement(ee.Control, { placeholder: d == null ? void 0 : d.formPlaceholder })
  ), /* @__PURE__ */ t.createElement(ee.Submit, { asChild: !0 }, /* @__PURE__ */ t.createElement(er, { type: "submit" }, /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" }))))));
}, nr = ({
  searchServiceUrl: e,
  setContentSearchResource: n,
  activeCanvas: r,
  annotationPage: a
}) => {
  const [o, i] = C(!1);
  return /* @__PURE__ */ t.createElement(qn, null, /* @__PURE__ */ t.createElement(
    tr,
    {
      searchServiceUrl: e,
      setContentSearchResource: n,
      activeCanvas: r,
      setLoading: i
    }
  ), !o && /* @__PURE__ */ t.createElement(Kn, { annotationPage: a }), o && /* @__PURE__ */ t.createElement("span", null, "Loading..."));
}, rr = h("div", {
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
}), or = h("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), pt = (e, n = "none") => {
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
  const a = pt(e, n);
  return Array.isArray(a) ? a.join(`${r}`) : a;
};
function ar(e) {
  return { __html: ir(e) };
}
function O(e, n) {
  const r = Object.keys(e).filter(
    (o) => n.includes(o) ? null : o
  ), a = new Object();
  return r.forEach((o) => {
    a[o] = e[o];
  }), a;
}
function ir(e) {
  return Ot(e, {
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
const lr = h("span", {}), j = (e) => {
  const { as: n, label: r } = e, o = O(e, ["as", "label"]);
  return /* @__PURE__ */ t.createElement(lr, { as: n, ...o }, F(r, o.lang));
}, sr = (e, n = "200,", r = "full") => {
  Array.isArray(e) && (e = e[0]);
  const { id: a, service: o } = e;
  let i;
  if (!o)
    return a;
  if (Array.isArray(e.service) && e.service.length > 0 && (i = o[0]), i) {
    if (i["@id"])
      return `${i["@id"]}/${r}/${n}/0/default.jpg`;
    if (i.id)
      return `${i.id}/${r}/${n}/0/default.jpg`;
  }
}, Fe = h("img", { objectFit: "cover" }), cr = (e) => {
  const n = we(null), { contentResource: r, altAsLabel: a, region: o = "full" } = e;
  let i;
  a && (i = F(a));
  const s = O(e, ["contentResource", "altAsLabel"]), { type: c, id: d, width: p = 200, height: m = 200, duration: y } = r;
  E(() => {
    if (!d && !n.current || ["Image"].includes(c) || !d.includes("m3u8"))
      return;
    const f = new B();
    return n.current && (f.attachMedia(n.current), f.on(B.Events.MEDIA_ATTACHED, function() {
      f.loadSource(d);
    })), f.on(B.Events.ERROR, function(g, b) {
      if (b.fatal)
        switch (b.type) {
          case B.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${g} network error encountered, try to recover`
            ), f.startLoad();
            break;
          case B.ErrorTypes.MEDIA_ERROR:
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
  }, [d, c]);
  const v = oe(() => {
    if (!n.current)
      return;
    let f = 0, g = 30;
    if (y && (g = y), !d.split("#t=") && y && (f = y * 0.1), d.split("#t=").pop()) {
      const w = d.split("#t=").pop();
      w && (f = parseInt(w.split(",")[0]));
    }
    const b = n.current;
    b.autoplay = !0, b.currentTime = f, setTimeout(() => v(), g * 1e3);
  }, [y, d]);
  E(() => v(), [v]);
  const u = sr(
    r,
    `${p},${m}`,
    o
  );
  switch (c) {
    case "Image":
      return /* @__PURE__ */ t.createElement(
        Fe,
        {
          as: "img",
          alt: i,
          css: { width: p, height: m },
          key: d,
          src: u,
          ...s
        }
      );
    case "Video":
      return /* @__PURE__ */ t.createElement(
        Fe,
        {
          as: "video",
          css: { width: p, height: m },
          disablePictureInPicture: !0,
          key: d,
          loop: !0,
          muted: !0,
          onPause: v,
          ref: n,
          src: d
        }
      );
    default:
      return console.warn(
        `Resource type: ${c} is not valid or not yet supported in Primitives.`
      ), /* @__PURE__ */ t.createElement(t.Fragment, null);
  }
}, dr = h("a", {}), mr = (e) => {
  const { children: n, homepage: r } = e, o = O(e, ["children", "homepage"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, r && r.map((i) => {
    const l = F(
      i.label,
      o.lang
    );
    return /* @__PURE__ */ t.createElement(
      dr,
      {
        "aria-label": n ? l : void 0,
        href: i.id,
        key: i.id,
        ...o
      },
      n || l
    );
  }));
}, ur = {
  delimiter: ", "
}, Ie = Lt(void 0), ft = () => {
  const e = Rt(Ie);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, $e = ({
  children: e,
  initialState: n = ur
}) => {
  const r = pr(n, "delimiter");
  return /* @__PURE__ */ t.createElement(Ie.Provider, { value: { delimiter: r } }, e);
}, pr = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, fr = h("span", {}), Pe = (e) => {
  const { as: n, markup: r } = e, { delimiter: a } = ft();
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const i = O(e, ["as", "markup"]), l = ar(
    F(r, i.lang, a)
  );
  return /* @__PURE__ */ t.createElement(fr, { as: n, ...i, dangerouslySetInnerHTML: l });
}, ht = (e) => t.useContext(Ie) ? /* @__PURE__ */ t.createElement(Pe, { ...e }) : /* @__PURE__ */ t.createElement($e, null, /* @__PURE__ */ t.createElement(Pe, { ...e })), hr = ({ as: e = "dd", lang: n, value: r }) => /* @__PURE__ */ t.createElement(ht, { markup: r, as: e, lang: n }), gr = h("span", {}), vr = ({
  as: e = "dd",
  customValueContent: n,
  lang: r,
  value: a
}) => {
  var l;
  const { delimiter: o } = ft(), i = (l = pt(a, r)) == null ? void 0 : l.map((s) => Mt(n, {
    value: s
  }));
  return /* @__PURE__ */ t.createElement(gr, { as: e, lang: r }, i == null ? void 0 : i.map((s, c) => [
    c > 0 && `${o}`,
    /* @__PURE__ */ t.createElement(zt, { key: c }, s)
  ]));
}, gt = (e) => {
  var s;
  const { item: n, lang: r, customValueContent: a } = e, { label: o, value: i } = n, l = (s = F(o)) == null ? void 0 : s.replace(" ", "-").toLowerCase();
  return /* @__PURE__ */ t.createElement("div", { role: "group", "data-label": l }, /* @__PURE__ */ t.createElement(j, { as: "dt", label: o, lang: r }), a ? /* @__PURE__ */ t.createElement(
    vr,
    {
      as: "dd",
      customValueContent: a,
      value: i,
      lang: r
    }
  ) : /* @__PURE__ */ t.createElement(hr, { as: "dd", value: i, lang: r }));
};
function yr(e, n) {
  const r = n.filter((a) => {
    const { matchingLabel: o } = a, i = Object.keys(a.matchingLabel)[0], l = F(o, i);
    if (F(e, i) === l)
      return !0;
  }).map((a) => a.Content);
  if (Array.isArray(r))
    return r[0];
}
const br = h("dl", {}), wr = (e) => {
  const { as: n, customValueContent: r, metadata: a } = e;
  if (!Array.isArray(a))
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = Ze(e, "customValueDelimiter"), l = O(e, [
    "as",
    "customValueContent",
    "customValueDelimiter",
    "metadata"
  ]);
  return /* @__PURE__ */ t.createElement(
    $e,
    {
      ...typeof o == "string" ? { initialState: { delimiter: o } } : void 0
    },
    a.length > 0 && /* @__PURE__ */ t.createElement(br, { as: n, ...l }, a.map((s, c) => {
      const d = r ? yr(s.label, r) : void 0;
      return /* @__PURE__ */ t.createElement(
        gt,
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
h("li", {});
h("ul", {});
const xr = h("li", {}), Er = h("ul", {}), Sr = (e) => {
  const { as: n, rendering: r } = e, o = O(e, ["as", "rendering"]);
  return /* @__PURE__ */ t.createElement(Er, { as: n }, r && r.map((i) => {
    const l = F(
      i.label,
      o.lang
    );
    return /* @__PURE__ */ t.createElement(xr, { key: i.id }, /* @__PURE__ */ t.createElement("a", { href: i.id, ...o, target: "_blank" }, l || i.id));
  }));
}, Cr = h("dl", {}), kr = (e) => {
  const { as: n, requiredStatement: r } = e;
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = Ze(e, "customValueDelimiter"), i = O(e, ["as", "customValueDelimiter", "requiredStatement"]);
  return /* @__PURE__ */ t.createElement(
    $e,
    {
      ...typeof a == "string" ? { initialState: { delimiter: a } } : void 0
    },
    /* @__PURE__ */ t.createElement(Cr, { as: n, ...i }, /* @__PURE__ */ t.createElement(gt, { item: r, lang: i.lang }))
  );
}, Ir = h("li", {}), $r = h("ul", {}), Ar = (e) => {
  const { as: n, seeAlso: r } = e, o = O(e, ["as", "seeAlso"]);
  return /* @__PURE__ */ t.createElement($r, { as: n }, r && r.map((i) => {
    const l = F(
      i.label,
      o.lang
    );
    return /* @__PURE__ */ t.createElement(Ir, { key: i.id }, /* @__PURE__ */ t.createElement("a", { href: i.id, ...o }, l || i.id));
  }));
}, Tr = (e) => {
  const { as: n, summary: r } = e, o = O(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ t.createElement(ht, { as: n, markup: r, ...o });
}, vt = (e) => {
  const { thumbnail: n, region: r } = e, o = O(e, ["thumbnail"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, n && n.map((i) => /* @__PURE__ */ t.createElement(
    cr,
    {
      contentResource: i,
      key: i.id,
      region: r,
      ...o
    }
  )));
}, Lr = ({
  homepage: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Homepage"), /* @__PURE__ */ t.createElement(mr, { homepage: e })), Rr = ({
  id: e,
  htmlLabel: n,
  parent: r = "manifest"
}) => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, n), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank", id: `iiif-${r}-id` }, e)), Mr = ({
  metadata: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(wr, { metadata: e, id: `iiif-${n}-metadata` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), zr = ({
  rendering: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Alternate formats"), /* @__PURE__ */ t.createElement(Sr, { rendering: e })), Fr = ({
  requiredStatement: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  kr,
  {
    requiredStatement: e,
    id: `iiif-${n}-required-statement`
  }
)) : /* @__PURE__ */ t.createElement(t.Fragment, null), Pr = ({ rights: e }) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Rights"), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank" }, e)) : /* @__PURE__ */ t.createElement(t.Fragment, null), Vr = ({ seeAlso: e }) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "See Also"), /* @__PURE__ */ t.createElement(Ar, { seeAlso: e })), Hr = ({
  summary: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Tr, { summary: e, as: "p", id: `iiif-${n}-summary` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), Br = ({
  label: e,
  thumbnail: n
}) => (n == null ? void 0 : n.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  vt,
  {
    altAsLabel: e || { none: ["resource"] },
    thumbnail: n,
    style: { backgroundColor: "#6663", objectFit: "cover" }
  }
)), Or = () => {
  const e = $(), { activeManifest: n, vault: r } = e, [a, o] = C(), [i, l] = C([]), [s, c] = C([]), [d, p] = C([]), [m, y] = C([]);
  return E(() => {
    var u, f, g, b;
    const v = r.get(n);
    o(v), ((u = v.homepage) == null ? void 0 : u.length) > 0 && l(r.get(v.homepage)), ((f = v.seeAlso) == null ? void 0 : f.length) > 0 && c(r.get(v.seeAlso)), ((g = v.rendering) == null ? void 0 : g.length) > 0 && p(r.get(v.rendering)), ((b = v.thumbnail) == null ? void 0 : b.length) > 0 && y(r.get(v.thumbnail));
  }, [n, r]), a ? /* @__PURE__ */ t.createElement(or, null, /* @__PURE__ */ t.createElement(rr, null, /* @__PURE__ */ t.createElement(Br, { thumbnail: m, label: a.label }), /* @__PURE__ */ t.createElement(Hr, { summary: a.summary }), /* @__PURE__ */ t.createElement(Mr, { metadata: a.metadata }), /* @__PURE__ */ t.createElement(Fr, { requiredStatement: a.requiredStatement }), /* @__PURE__ */ t.createElement(Pr, { rights: a.rights }), /* @__PURE__ */ t.createElement(
    Lr,
    {
      homepage: i
    }
  ), /* @__PURE__ */ t.createElement(
    Vr,
    {
      seeAlso: s
    }
  ), /* @__PURE__ */ t.createElement(
    zr,
    {
      rendering: d
    }
  ), /* @__PURE__ */ t.createElement(Rr, { id: a.id, htmlLabel: "IIIF Manifest" }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
};
function Dr(e) {
  const n = [];
  return e.forEach((r) => {
    var a;
    (a = r.informationPanel) != null && a.component && n.push(r);
  }), { pluginsWithInfoPanel: n };
}
const Nr = 1500, Wr = ({
  activeCanvas: e,
  annotationResources: n,
  searchServiceUrl: r,
  setContentSearchResource: a,
  contentSearchResource: o
}) => {
  const i = z(), l = $(), {
    isAutoScrolling: s,
    isUserScrolling: c,
    vault: d,
    openSeadragonViewer: p,
    configOptions: m,
    plugins: y,
    activeManifest: v
  } = l, { informationPanel: u } = m, f = d.get({
    id: e,
    type: "Canvas"
  }), [g, b] = C(), w = u == null ? void 0 : u.renderAbout, k = u == null ? void 0 : u.renderAnnotation, A = u == null ? void 0 : u.renderContentSearch, { pluginsWithInfoPanel: M } = Dr(y);
  function I(S, T) {
    var D, N;
    const H = (D = S == null ? void 0 : S.informationPanel) == null ? void 0 : D.component;
    return H === void 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(ne, { key: T, value: S.id }, /* @__PURE__ */ t.createElement(le, { FallbackComponent: me }, /* @__PURE__ */ t.createElement(
      H,
      {
        ...(N = S == null ? void 0 : S.informationPanel) == null ? void 0 : N.componentProps,
        activeManifest: v,
        canvas: f,
        viewerConfigOptions: m,
        openSeadragonViewer: p,
        useViewerDispatch: z,
        useViewerState: $
      }
    )));
  }
  E(() => {
    if (!g)
      if (u != null && u.defaultTab) {
        const S = ["manifest-about", "manifest-content-search"];
        f.annotations.length > 0 && f.annotations.forEach(
          (T) => S.push(T.id)
        ), S.includes(u == null ? void 0 : u.defaultTab) ? b(u.defaultTab) : b("manifest-about");
      } else
        w ? b("manifest-about") : A ? b("manifest-content-search") : n && (n == null ? void 0 : n.length) > 0 ? b(n[0].id) : y.length > 0 && b(y[0].id);
  }, [
    u == null ? void 0 : u.defaultTab,
    e,
    g,
    w,
    A,
    n,
    o,
    f == null ? void 0 : f.annotations,
    y
  ]);
  function P() {
    if (!s) {
      clearTimeout(c);
      const S = setTimeout(() => {
        i({
          type: "updateUserScrolling",
          isUserScrolling: void 0
        });
      }, Nr);
      i({
        type: "updateUserScrolling",
        isUserScrolling: S
      });
    }
  }
  const V = (S) => {
    b(S);
  };
  return /* @__PURE__ */ t.createElement(
    In,
    {
      "data-testid": "information-panel",
      defaultValue: g,
      onValueChange: V,
      orientation: "horizontal",
      value: g,
      className: "clover-viewer-information-panel"
    },
    /* @__PURE__ */ t.createElement($n, { "aria-label": "select chapter", "data-testid": "information-panel-list" }, w && /* @__PURE__ */ t.createElement(te, { value: "manifest-about" }, "About"), A && o && /* @__PURE__ */ t.createElement(te, { value: "manifest-content-search" }, /* @__PURE__ */ t.createElement(j, { label: o.label })), k && n && n.map((S, T) => /* @__PURE__ */ t.createElement(te, { key: T, value: S.id }, /* @__PURE__ */ t.createElement(j, { label: S.label }))), M && M.map((S, T) => {
      var H;
      return /* @__PURE__ */ t.createElement(te, { key: T, value: S.id }, /* @__PURE__ */ t.createElement(
        j,
        {
          label: (H = S.informationPanel) == null ? void 0 : H.label
        }
      ));
    })),
    /* @__PURE__ */ t.createElement(Tn, { handleScroll: P }, w && /* @__PURE__ */ t.createElement(ne, { value: "manifest-about" }, /* @__PURE__ */ t.createElement(Or, null)), A && o && /* @__PURE__ */ t.createElement(ne, { value: "manifest-content-search" }, /* @__PURE__ */ t.createElement(
      nr,
      {
        searchServiceUrl: r,
        setContentSearchResource: a,
        activeCanvas: e,
        annotationPage: o
      }
    )), k && n && n.map((S) => /* @__PURE__ */ t.createElement(ne, { key: S.id, value: S.id }, /* @__PURE__ */ t.createElement(_n, { annotationPage: S }))), M && M.map(
      (S, T) => I(S, T)
    ))
  );
}, yt = h("div", {
  position: "absolute",
  right: "1rem",
  top: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: "1"
}), _r = h("input", {
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
}), pe = h("button", {
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
}), jr = h("div", {
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
}), Ur = h("div", {
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
        [`& ${yt}`]: {
          width: "calc(100% - 2rem)",
          "@sm": {
            width: "calc(100% - 2rem)"
          }
        }
      }
    }
  }
}), Gr = (e, n) => {
  E(() => {
    function r(a) {
      a.key === e && n();
    }
    return window.addEventListener("keyup", r), () => window.removeEventListener("keyup", r);
  }, []);
}, qr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Back"), /* @__PURE__ */ t.createElement(
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
)), Zr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Forward"), /* @__PURE__ */ t.createElement(
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
)), Xr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Close"), /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })), Yr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })), Jr = ({
  handleCanvasToggle: e,
  handleFilter: n,
  activeIndex: r,
  canvasLength: a
}) => {
  const [o, i] = C(!1), [l, s] = C(!1), [c, d] = C(!1);
  E(() => {
    d(r === 0), r === a - 1 ? s(!0) : s(!1);
  }, [r, a]), Gr("Escape", () => {
    i(!1), n("");
  });
  const p = () => {
    i((y) => !y), n("");
  }, m = (y) => n(y.target.value);
  return /* @__PURE__ */ t.createElement(Ur, { isToggle: o }, /* @__PURE__ */ t.createElement(yt, null, o && /* @__PURE__ */ t.createElement(_r, { autoFocus: !0, onChange: m, placeholder: "Search" }), !o && /* @__PURE__ */ t.createElement(jr, null, /* @__PURE__ */ t.createElement(
    pe,
    {
      onClick: () => e(-1),
      disabled: c,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(qr, null)
  ), /* @__PURE__ */ t.createElement("span", null, r + 1, " of ", a), /* @__PURE__ */ t.createElement(
    pe,
    {
      onClick: () => e(1),
      disabled: l,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(Zr, null)
  )), /* @__PURE__ */ t.createElement(pe, { onClick: p, type: "button" }, o ? /* @__PURE__ */ t.createElement(Xr, null) : /* @__PURE__ */ t.createElement(Yr, null))));
}, Kr = h(ce.Root, {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  padding: "1.618rem",
  overflowX: "scroll",
  position: "relative",
  zIndex: "0"
}), Qr = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M256 112v288M400 256H112"
  }
), eo = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z" }), /* @__PURE__ */ t.createElement("path", { d: "M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z" }), /* @__PURE__ */ t.createElement("path", { d: "M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z" })), to = () => /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" }), no = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    d: "M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32"
  }
), /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M176 272l80 80 80-80M256 48v288"
  }
)), ro = () => /* @__PURE__ */ t.createElement("path", { d: "M416 64H96a64.07 64.07 0 00-64 64v256a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V128a64.07 64.07 0 00-64-64zm-80 64a48 48 0 11-48 48 48.05 48.05 0 0148-48zM96 416a32 32 0 01-32-32v-67.63l94.84-84.3a48.06 48.06 0 0165.8 1.9l64.95 64.81L172.37 416zm352-32a32 32 0 01-32 32H217.63l121.42-121.42a47.72 47.72 0 0161.64-.16L448 333.84z" }), oo = () => /* @__PURE__ */ t.createElement("path", { d: "M464 384.39a32 32 0 01-13-2.77 15.77 15.77 0 01-2.71-1.54l-82.71-58.22A32 32 0 01352 295.7v-79.4a32 32 0 0113.58-26.16l82.71-58.22a15.77 15.77 0 012.71-1.54 32 32 0 0145 29.24v192.76a32 32 0 01-32 32zM268 400H84a68.07 68.07 0 01-68-68V180a68.07 68.07 0 0168-68h184.48A67.6 67.6 0 01336 179.52V332a68.07 68.07 0 01-68 68z" }), bt = h("svg", {
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
}), ao = ({ children: e }) => /* @__PURE__ */ t.createElement("title", null, e), R = (e) => /* @__PURE__ */ t.createElement(
  bt,
  {
    ...e,
    "data-testid": "icon-svg",
    role: "img",
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg"
  },
  e.children
);
R.Title = ao;
R.Add = Qr;
R.Audio = eo;
R.Close = to;
R.Download = no;
R.Image = ro;
R.Video = oo;
const io = ke({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), lo = ke({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), wt = h(K.Arrow, {
  fill: "$secondaryAlt"
}), so = h(K.Close, {
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
}), co = h(K.Content, {
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
  '&[data-side="top"]': { animationName: lo },
  '&[data-side="bottom"]': { animationName: io },
  /**
   *
   */
  '&[data-align="end"]': {
    [`& ${wt}`]: {
      margin: "0 0.7rem"
    }
  }
}), mo = h(K.Trigger, {
  display: "inline-flex",
  padding: "0.5rem 0",
  margin: "0 0.5rem 0 0",
  cursor: "pointer",
  border: "none",
  background: "none",
  "> button, > span": {
    margin: "0"
  }
}), uo = h(K.Root, {
  boxSizing: "content-box"
}), po = (e) => /* @__PURE__ */ t.createElement(mo, { ...e }, e.children), fo = (e) => /* @__PURE__ */ t.createElement(co, { ...e }, /* @__PURE__ */ t.createElement(wt, null), /* @__PURE__ */ t.createElement(so, null, /* @__PURE__ */ t.createElement(R, { isSmall: !0 }, /* @__PURE__ */ t.createElement(R.Close, null))), e.children), G = ({ children: e }) => /* @__PURE__ */ t.createElement(uo, null, e);
G.Trigger = po;
G.Content = fo;
const ve = h("div", {
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
  [`${bt}`]: {
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
}), ye = h("span", {
  display: "flex"
}), ho = h("span", {
  display: "flex",
  width: "1.2111rem",
  height: "0.7222rem"
}), go = h("span", {
  display: "inline-flex",
  marginLeft: "5px",
  marginBottom: "-1px"
}), vo = h(ce.Item, {
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
      [`& ${ye}`]: {
        position: "absolute",
        right: "0",
        bottom: "0",
        [`& ${ve}`]: {
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
        [`& ${ye}`]: {
          [`& ${ve}`]: {
            backgroundColor: "$accent"
          }
        }
      }
    },
    figcaption: {
      fontWeight: "700"
    }
  }
}), yo = ({ type: e }) => {
  switch (e) {
    case "Sound":
      return /* @__PURE__ */ t.createElement(R.Audio, null);
    case "Image":
      return /* @__PURE__ */ t.createElement(R.Image, null);
    case "Video":
      return /* @__PURE__ */ t.createElement(R.Video, null);
    default:
      return /* @__PURE__ */ t.createElement(R.Image, null);
  }
}, bo = ({
  canvas: e,
  canvasIndex: n,
  isActive: r,
  thumbnail: a,
  type: o,
  handleChange: i
}) => /* @__PURE__ */ t.createElement(
  vo,
  {
    "aria-checked": r,
    "data-testid": "media-thumbnail",
    "data-canvas": n,
    onClick: () => i(e.id),
    value: e.id
  },
  /* @__PURE__ */ t.createElement("figure", null, /* @__PURE__ */ t.createElement("div", null, (a == null ? void 0 : a.id) && /* @__PURE__ */ t.createElement(
    "img",
    {
      src: a.id,
      alt: e != null && e.label ? Z(e.label) : ""
    }
  ), /* @__PURE__ */ t.createElement(ye, null, /* @__PURE__ */ t.createElement(ve, { isIcon: !0, "data-testid": "thumbnail-tag" }, /* @__PURE__ */ t.createElement(ho, null), /* @__PURE__ */ t.createElement(R, { "aria-label": o }, /* @__PURE__ */ t.createElement(yo, { type: o })), ["Video", "Sound"].includes(o) && /* @__PURE__ */ t.createElement(go, null, Ge(e.duration))))), (e == null ? void 0 : e.label) && /* @__PURE__ */ t.createElement("figcaption", { "data-testid": "fig-caption" }, /* @__PURE__ */ t.createElement(j, { label: e.label })))
), wo = (e) => e.body ? e.body.type : "Image", xo = ({ items: e }) => {
  const n = z(), r = $(), { activeCanvas: a, vault: o } = r, [i, l] = C(""), [s, c] = C([]), [d, p] = C(0), m = t.useRef(null), y = "painting", v = (g) => {
    a !== g && n({
      type: "updateActiveCanvas",
      canvasId: g
    });
  };
  E(() => {
    if (!s.length) {
      const g = ["Image", "Sound", "Video"], b = e.map(
        (w) => Qe(o, w, y, g)
      ).filter((w) => w.annotations.length > 0);
      c(b);
    }
  }, [e, s.length, o]), E(() => {
    s.forEach((g, b) => {
      g != null && g.canvas && g.canvas.id === a && p(b);
    });
  }, [a, s]), E(() => {
    const g = document.querySelector(
      `[data-canvas="${d}"]`
    );
    if (g instanceof HTMLElement && m.current) {
      const b = g.offsetLeft - m.current.offsetWidth / 2 + g.offsetWidth / 2;
      m.current.scrollTo({ left: b, behavior: "smooth" });
    }
  }, [d]);
  const u = (g) => l(g), f = (g) => {
    const b = s[d + g];
    b != null && b.canvas && v(b.canvas.id);
  };
  return /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
    Jr,
    {
      handleFilter: u,
      handleCanvasToggle: f,
      activeIndex: d,
      canvasLength: s.length
    }
  ), /* @__PURE__ */ t.createElement(Kr, { "aria-label": "select item", "data-testid": "media", ref: m }, s.filter((g) => {
    var b;
    if ((b = g.canvas) != null && b.label) {
      const w = Z(g.canvas.label);
      if (Array.isArray(w))
        return w[0].toLowerCase().includes(i.toLowerCase());
    }
  }).map((g, b) => {
    var w, k;
    return /* @__PURE__ */ t.createElement(
      bo,
      {
        canvas: g.canvas,
        canvasIndex: b,
        handleChange: v,
        isActive: a === ((w = g == null ? void 0 : g.canvas) == null ? void 0 : w.id),
        key: (k = g == null ? void 0 : g.canvas) == null ? void 0 : k.id,
        thumbnail: on(o, g, 200, 200),
        type: wo(g.annotations[0])
      }
    );
  })));
}, xt = h("button", {
  position: "absolute",
  background: "none",
  border: "none",
  cursor: "zoom-in",
  margin: "0",
  padding: "0",
  width: "100%",
  height: "100%",
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
}), Et = h("button", {
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
}), St = h(Et, {
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
}), Eo = h("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  gap: "1rem",
  zIndex: "0",
  overflow: "hidden",
  "&:hover": {
    [`${St}`]: {
      backgroundColor: "$accent"
    },
    [`${xt}`]: {
      backgroundColor: "#6662"
    }
  }
}), So = h("div", {
  width: "100%",
  height: "100%"
}), Co = h("svg", {
  height: "19px",
  color: "$accent",
  fill: "$accent",
  stroke: "$accent",
  display: "flex",
  margin: "0.25rem 0.85rem"
}), ko = h(Q.Trigger, {
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
}), Io = h(Q.Content, {
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
}), $o = h(Q.Item, {
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
}), Ao = h(Q.Label, {
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
}), Ct = h(Q.Root, {
  position: "relative",
  zIndex: "5",
  width: "100%"
}), fe = ({ direction: e, title: n }) => {
  const r = () => /* @__PURE__ */ t.createElement("path", { d: "M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" }), a = () => /* @__PURE__ */ t.createElement("path", { d: "M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" });
  return /* @__PURE__ */ t.createElement(
    Co,
    {
      xmlns: "http://www.w3.org/2000/svg",
      focusable: "false",
      viewBox: "0 0 512 512",
      role: "img"
    },
    /* @__PURE__ */ t.createElement("title", null, n),
    e === "up" && /* @__PURE__ */ t.createElement(r, null),
    e === "down" && /* @__PURE__ */ t.createElement(a, null)
  );
}, kt = ({
  children: e,
  label: n,
  maxHeight: r,
  onValueChange: a,
  value: o
}) => /* @__PURE__ */ t.createElement(Ct, { onValueChange: a, value: o }, /* @__PURE__ */ t.createElement(ko, { "data-testid": "select-button" }, /* @__PURE__ */ t.createElement(Dt, { "data-testid": "select-button-value" }), /* @__PURE__ */ t.createElement(Nt, null, /* @__PURE__ */ t.createElement(fe, { direction: "down", title: "select" }))), /* @__PURE__ */ t.createElement(Wt, null, /* @__PURE__ */ t.createElement(
  Io,
  {
    css: { maxHeight: `${r} !important` },
    "data-testid": "select-content"
  },
  /* @__PURE__ */ t.createElement(_t, null, /* @__PURE__ */ t.createElement(fe, { direction: "up", title: "scroll up for more" })),
  /* @__PURE__ */ t.createElement(jt, null, /* @__PURE__ */ t.createElement(Ut, null, n && /* @__PURE__ */ t.createElement(Ao, null, /* @__PURE__ */ t.createElement(j, { "data-testid": "select-label", label: n })), e)),
  /* @__PURE__ */ t.createElement(Gt, null, /* @__PURE__ */ t.createElement(fe, { direction: "down", title: "scroll down for more" }))
))), It = (e) => /* @__PURE__ */ t.createElement($o, { ...e }, e.thumbnail && /* @__PURE__ */ t.createElement(vt, { thumbnail: e.thumbnail }), /* @__PURE__ */ t.createElement(qt, null, /* @__PURE__ */ t.createElement(j, { label: e.label })), /* @__PURE__ */ t.createElement(Zt, null)), be = h("div", {
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
}), To = h("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Lo = h("div", {
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
        [`${be}`]: {
          display: "block"
        }
      },
      false: {
        [`${be}`]: {
          display: "none"
        }
      }
    }
  }
}), q = ({ className: e, id: n, label: r, children: a }) => {
  const o = r.toLowerCase().replace(/\s/g, "-");
  return /* @__PURE__ */ t.createElement(
    Et,
    {
      id: n,
      className: e,
      "data-testid": "openseadragon-button",
      "data-button": o
    },
    /* @__PURE__ */ t.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        "aria-labelledby": `${n}-svg-title`,
        "data-testid": "openseadragon-button-svg",
        focusable: "false",
        viewBox: "0 0 512 512",
        role: "img"
      },
      /* @__PURE__ */ t.createElement("title", { id: `${n}-svg-title` }, r),
      a
    )
  );
}, Ro = h("div", {
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
}), Mo = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M256 112v288M400 256H112"
  }
), zo = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 256H112"
  }
), Fo = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
  }
), Po = () => /* @__PURE__ */ t.createElement("path", { d: "M448 440a16 16 0 01-12.61-6.15c-22.86-29.27-44.07-51.86-73.32-67C335 352.88 301 345.59 256 344.23V424a16 16 0 01-27 11.57l-176-168a16 16 0 010-23.14l176-168A16 16 0 01256 88v80.36c74.14 3.41 129.38 30.91 164.35 81.87C449.32 292.44 464 350.9 464 424a16 16 0 01-16 16z" }), Ve = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
  }
), /* @__PURE__ */ t.createElement("path", { d: "M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z" })), Vo = ({
  _cloverViewerHasPlaceholder: e,
  config: n
}) => {
  const r = $(), {
    activeCanvas: a,
    configOptions: o,
    openSeadragonViewer: i,
    plugins: l,
    vault: s,
    activeManifest: c
  } = r, d = s.get({
    id: a,
    type: "Canvas"
  });
  function p() {
    return l.filter((m) => {
      var y;
      return (y = m.imageViewer) == null ? void 0 : y.menu;
    }).map((m, y) => {
      var u, f, g, b;
      const v = (f = (u = m.imageViewer) == null ? void 0 : u.menu) == null ? void 0 : f.component;
      return /* @__PURE__ */ t.createElement(
        v,
        {
          key: y,
          ...(b = (g = m == null ? void 0 : m.imageViewer) == null ? void 0 : g.menu) == null ? void 0 : b.componentProps,
          activeManifest: c,
          canvas: d,
          viewerConfigOptions: o,
          openSeadragonViewer: i,
          useViewerDispatch: z,
          useViewerState: $
        }
      );
    });
  }
  return /* @__PURE__ */ t.createElement(
    Ro,
    {
      "data-testid": "clover-iiif-image-openseadragon-controls",
      hasPlaceholder: e
    },
    n.showZoomControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(q, { id: n.zoomInButton, label: "zoom in" }, /* @__PURE__ */ t.createElement(Mo, null)), /* @__PURE__ */ t.createElement(q, { id: n.zoomOutButton, label: "zoom out" }, /* @__PURE__ */ t.createElement(zo, null))),
    n.showFullPageControl && /* @__PURE__ */ t.createElement(q, { id: n.fullPageButton, label: "full page" }, /* @__PURE__ */ t.createElement(Fo, null)),
    n.showRotationControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(q, { id: n.rotateRightButton, label: "rotate right" }, /* @__PURE__ */ t.createElement(Ve, null)), /* @__PURE__ */ t.createElement(q, { id: n.rotateLeftButton, label: "rotate left" }, /* @__PURE__ */ t.createElement(Ve, null))),
    n.showHomeControl && /* @__PURE__ */ t.createElement(q, { id: n.homeButton, label: "reset" }, /* @__PURE__ */ t.createElement(Po, null)),
    p()
  );
}, Ho = ({
  ariaLabel: e,
  config: n,
  uri: r,
  _cloverViewerHasPlaceholder: a,
  imageType: o,
  openSeadragonCallback: i
}) => {
  const [l, s] = C(), [c, d] = C(), p = z(), m = we(!1);
  return E(() => (m.current || (m.current = !0, c || d(ie(n))), () => c == null ? void 0 : c.destroy()), []), E(() => {
    c && i && i(c);
  }, [c, i]), E(() => {
    c && r !== l && (c == null || c.forceRedraw(), s(r));
  }, [c, l, r]), E(() => {
    if (l && c)
      switch (o) {
        case "simpleImage":
          c == null || c.addSimpleImage({
            url: l
          });
          break;
        case "tiledImage":
          ln(l).then((y) => {
            try {
              if (!y)
                throw new Error(`No tile source found for ${l}`);
              c == null || c.addTiledImage({
                tileSource: y,
                success: () => {
                  typeof p == "function" && p({
                    type: "updateOSDImageLoaded",
                    OSDImageLoaded: !0
                  });
                }
              });
            } catch (v) {
              console.error(v);
            }
          });
          break;
        default:
          c == null || c.close(), console.warn(
            `Unable to render ${l} in OpenSeadragon as type: "${o}"`
          );
          break;
      }
  }, [o, l]), /* @__PURE__ */ t.createElement(
    Lo,
    {
      className: "clover-iiif-image-openseadragon",
      "data-testid": "clover-iiif-image-openseadragon",
      "data-openseadragon-instance": n.id,
      hasNavigator: n.showNavigator
    },
    /* @__PURE__ */ t.createElement(
      Vo,
      {
        _cloverViewerHasPlaceholder: a,
        config: n
      }
    ),
    n.showNavigator && /* @__PURE__ */ t.createElement(
      be,
      {
        id: n.navigatorId,
        "data-testid": "clover-iiif-image-openseadragon-navigator"
      }
    ),
    /* @__PURE__ */ t.createElement(
      To,
      {
        id: n.id,
        "data-testid": "clover-iiif-image-openseadragon-viewport",
        role: "img",
        ...e && { "aria-label": e }
      }
    )
  );
};
function Bo(e) {
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
const Oo = ({
  _cloverViewerHasPlaceholder: e = !1,
  body: n,
  instanceId: r,
  isTiledImage: a = !1,
  label: o,
  src: i = "",
  openSeadragonCallback: l,
  openSeadragonConfig: s = {}
}) => {
  const c = r || ae(), d = typeof o == "string" ? o : F(o), p = {
    ...Bo(c),
    ...s
  }, { imageType: m, uri: y } = n ? yn(n) : bn(i, a);
  return y ? /* @__PURE__ */ t.createElement(le, { FallbackComponent: me }, /* @__PURE__ */ t.createElement(
    Ho,
    {
      _cloverViewerHasPlaceholder: e,
      ariaLabel: d,
      config: p,
      imageType: m,
      key: c,
      uri: y,
      openSeadragonCallback: l
    }
  )) : null;
}, Do = ({
  isMedia: e,
  label: n,
  placeholderCanvas: r,
  setIsInteractive: a
}) => {
  const { vault: o } = $(), i = re(o, r), l = i ? i[0] : void 0, s = n ? Z(n) : ["placeholder image"];
  return /* @__PURE__ */ t.createElement(
    xt,
    {
      onClick: () => a(!0),
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
}, No = h("canvas", {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Wo = t.forwardRef(
  (e, n) => {
    const r = t.useRef(null), a = oe(() => {
      var v, u;
      if ((v = n.current) != null && v.currentTime && ((u = n.current) == null ? void 0 : u.currentTime) > 0)
        return;
      const i = n.current;
      if (!i)
        return;
      const l = new AudioContext(), s = l.createMediaElementSource(i), c = l.createAnalyser(), d = r.current;
      if (!d)
        return;
      d.width = i.offsetWidth, d.height = i.offsetHeight;
      const p = d.getContext("2d");
      s.connect(c), c.connect(l.destination), c.fftSize = 256;
      const m = c.frequencyBinCount, y = new Uint8Array(m);
      setInterval(function() {
        o(
          c,
          p,
          m,
          y,
          d.width,
          d.height
        );
      }, 20);
    }, [n]);
    t.useEffect(() => {
      !n || !n.current || (n.current.onplay = a);
    }, [a, n]);
    function o(i, l, s, c, d, p) {
      const m = d / s * 2.6;
      let y, v = 0;
      i.getByteFrequencyData(c), l.fillStyle = "#000000", l.fillRect(0, 0, d, p);
      for (let u = 0; u < s; u++)
        y = c[u] * 2, l.fillStyle = "rgba(78, 42, 132, 1)", l.fillRect(v, p - y, m, y), v += m + 6;
    }
    return /* @__PURE__ */ t.createElement(No, { ref: r, role: "presentation" });
  }
), _o = h("div", {
  position: "relative",
  backgroundColor: "$primaryAlt",
  display: "flex",
  flexGrow: "0",
  flexShrink: "1",
  height: "100%",
  zIndex: "1",
  video: {
    backgroundColor: "transparent",
    objectFit: "contain",
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: "1"
  }
}), jo = ({ resource: e, ignoreCaptionLabels: n }) => {
  const r = Z(e.label, "en");
  return Array.isArray(r) && r.some((o) => n.includes(o)) ? null : /* @__PURE__ */ t.createElement(
    "track",
    {
      key: e.id,
      src: e.id,
      label: Array.isArray(r) ? r[0] : r,
      srcLang: "en",
      "data-testid": "player-track"
    }
  );
}, Uo = [
  // Apple santioned
  "application/vnd.apple.mpegurl",
  "vnd.apple.mpegurl",
  // Apple sanctioned for backwards compatibility
  "audio/mpegurl",
  // Very common
  "audio/x-mpegurl",
  // Very common
  "application/x-mpegurl",
  // Included for completeness
  "video/x-mpegurl",
  "video/mpegurl",
  "application/mpegurl"
], Go = ({
  allSources: e,
  annotationResources: n,
  painting: r
}) => {
  const [a, o] = t.useState(0), [i, l] = t.useState(), s = t.useRef(null), c = (r == null ? void 0 : r.type) === "Sound", d = $(), { activeCanvas: p, configOptions: m, vault: y } = d;
  return E(() => {
    if (!r.id || !s.current)
      return;
    if (s != null && s.current) {
      const f = s.current;
      f.src = r.id, f.load();
    }
    if (r.id.split(".").pop() !== "m3u8" && r.format && !Uo.includes(r.format))
      return;
    const v = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      xhrSetup: function(f, g) {
        f.withCredentials = !!m.withCredentials;
      }
    }, u = new B(v);
    return u.attachMedia(s.current), u.on(B.Events.MEDIA_ATTACHED, function() {
      u.loadSource(r.id);
    }), u.on(B.Events.ERROR, function(f, g) {
      if (g.fatal)
        switch (g.type) {
          case B.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${f} network error encountered, try to recover`
            ), u.startLoad();
            break;
          case B.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${f} media error encountered, try to recover`
            ), u.recoverMediaError();
            break;
          default:
            u.destroy();
            break;
        }
    }), () => {
      if (u && s.current) {
        const f = s.current;
        u.detachMedia(), u.destroy(), f.currentTime = 0;
      }
    };
  }, [m.withCredentials, r.id]), E(() => {
    var b, w, k, A;
    const v = y.get(p), u = (b = v.accompanyingCanvas) != null && b.id ? re(y, (w = v.accompanyingCanvas) == null ? void 0 : w.id) : null, f = (k = v.placeholderCanvas) != null && k.id ? re(y, (A = v.placeholderCanvas) == null ? void 0 : A.id) : null;
    !!(u && f) ? l(a === 0 ? f[0].id : u[0].id) : (u && l(u[0].id), f && l(f[0].id));
  }, [p, a, y]), E(() => {
    if (s != null && s.current) {
      const v = s.current;
      return v == null || v.addEventListener(
        "timeupdate",
        () => o(v.currentTime)
      ), () => document.removeEventListener("timeupdate", () => {
      });
    }
  }, []), /* @__PURE__ */ t.createElement(
    _o,
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
      e.map((v) => /* @__PURE__ */ t.createElement("source", { src: v.id, type: v.format, key: v.id })),
      (n == null ? void 0 : n.length) > 0 && n.map((v) => {
        const u = [];
        return v.items.forEach((f) => {
          y.get(
            f.id
          ).body.forEach((b) => {
            const w = y.get(
              b.id
            );
            u.push(w);
          });
        }), u.map((f) => /* @__PURE__ */ t.createElement(
          jo,
          {
            resource: f,
            ignoreCaptionLabels: m.ignoreCaptionLabels || [],
            key: f.id
          }
        ));
      }),
      "Sorry, your browser doesn't support embedded videos."
    ),
    c && /* @__PURE__ */ t.createElement(Wo, { ref: s })
  );
}, qo = () => /* @__PURE__ */ t.createElement(
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
), Zo = ({ isMedia: e }) => /* @__PURE__ */ t.createElement(
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
), Xo = ({
  handleToggle: e,
  isInteractive: n,
  isMedia: r
}) => /* @__PURE__ */ t.createElement(
  St,
  {
    onClick: e,
    isInteractive: n,
    isMedia: r,
    "data-testid": "placeholder-toggle"
  },
  n ? /* @__PURE__ */ t.createElement(qo, null) : /* @__PURE__ */ t.createElement(Zo, { isMedia: r })
), Yo = ({
  activeCanvas: e,
  annotationResources: n,
  isMedia: r,
  painting: a
}) => {
  var T, H, D, N, X;
  const [o, i] = t.useState(0), [l, s] = t.useState(!1), {
    configOptions: c,
    customDisplays: d,
    openSeadragonViewer: p,
    vault: m,
    viewerId: y
  } = $(), v = z(), u = m.get(e), f = (T = u == null ? void 0 : u.placeholderCanvas) == null ? void 0 : T.id, g = !!f, b = (a == null ? void 0 : a.length) > 1, w = f && !l && !r, k = `${y}-${Yt(e + o)}`, A = () => s(!l), M = (x) => {
    const L = a.findIndex((W) => W.id === x);
    i(L);
  }, I = d.find((x) => {
    var Ae;
    let L = !1;
    const { canvasId: W, paintingFormat: Y } = x.target;
    if (Array.isArray(W) && W.length > 0 && (L = W.includes(e)), Array.isArray(Y) && Y.length > 0) {
      const Te = ((Ae = a[o]) == null ? void 0 : Ae.format) || "";
      L = !!(Te && Y.includes(Te));
    }
    return L;
  }), P = [];
  (D = (H = n[0]) == null ? void 0 : H.items) == null || D.forEach((x) => {
    const L = m.get(x.id);
    P.push(L);
  }), E(() => {
    var x;
    P && p && ((x = c.annotationOverlays) != null && x.renderOverlays) && (rt(p, "annotation-overlay"), tt(
      p,
      u,
      c.annotationOverlays,
      P,
      "annotation-overlay"
    ));
  }, [u, P, p, c]);
  const V = (x) => {
    x && (p == null ? void 0 : p.id) !== `openseadragon-${k}` && v({
      type: "updateOpenSeadragonViewer",
      openSeadragonViewer: x
    });
  }, S = (N = I == null ? void 0 : I.display) == null ? void 0 : N.component;
  return /* @__PURE__ */ t.createElement(Eo, { className: "clover-viewer-painting" }, /* @__PURE__ */ t.createElement(
    So,
    {
      style: {
        backgroundColor: c.canvasBackgroundColor,
        height: c.canvasHeight === "auto" ? "100%" : c.canvasHeight
      }
    },
    f && !r && /* @__PURE__ */ t.createElement(
      Xo,
      {
        handleToggle: A,
        isInteractive: l,
        isMedia: r
      }
    ),
    w && !r && /* @__PURE__ */ t.createElement(
      Do,
      {
        isMedia: r,
        label: u == null ? void 0 : u.label,
        placeholderCanvas: f,
        setIsInteractive: s
      }
    ),
    !w && !I && (r ? /* @__PURE__ */ t.createElement(
      Go,
      {
        allSources: a,
        painting: a[o],
        annotationResources: n
      }
    ) : a && /* @__PURE__ */ t.createElement(
      Oo,
      {
        _cloverViewerHasPlaceholder: g,
        body: a[o],
        instanceId: k,
        key: k,
        openSeadragonCallback: V,
        openSeadragonConfig: c.openSeadragon
      }
    )),
    !w && S && /* @__PURE__ */ t.createElement(
      S,
      {
        id: e,
        annotationBody: a[o],
        ...I == null ? void 0 : I.display.componentProps
      }
    )
  ), b && /* @__PURE__ */ t.createElement(
    kt,
    {
      value: (X = a[o]) == null ? void 0 : X.id,
      onValueChange: M,
      maxHeight: "200px"
    },
    a == null ? void 0 : a.map((x) => /* @__PURE__ */ t.createElement(
      It,
      {
        value: x == null ? void 0 : x.id,
        key: x == null ? void 0 : x.id,
        label: x == null ? void 0 : x.label
      }
    ))
  ));
}, Jo = ({
  activeCanvas: e,
  annotationResources: n,
  searchServiceUrl: r,
  setContentSearchResource: a,
  contentSearchResource: o,
  isAudioVideo: i,
  items: l,
  painting: s
}) => {
  const { isInformationOpen: c, configOptions: d } = $(), { informationPanel: p } = d, m = (p == null ? void 0 : p.renderAbout) && c, y = (p == null ? void 0 : p.renderAnnotation) && n.length > 0 && !p.open;
  return /* @__PURE__ */ t.createElement(
    at,
    {
      className: "clover-viewer-content",
      "data-testid": "clover-viewer-content"
    },
    /* @__PURE__ */ t.createElement(it, null, /* @__PURE__ */ t.createElement(
      Yo,
      {
        activeCanvas: e,
        annotationResources: n,
        isMedia: i,
        painting: s
      }
    ), m && /* @__PURE__ */ t.createElement(lt, null, /* @__PURE__ */ t.createElement("span", null, c ? "View Items" : "More Information")), l.length > 1 && /* @__PURE__ */ t.createElement(ot, { className: "clover-viewer-media-wrapper" }, /* @__PURE__ */ t.createElement(xo, { items: l, activeItem: 0 }))),
    (m || y) && /* @__PURE__ */ t.createElement(Cn, null, /* @__PURE__ */ t.createElement(st, null, /* @__PURE__ */ t.createElement(le, { FallbackComponent: me }, /* @__PURE__ */ t.createElement(
      Wr,
      {
        activeCanvas: e,
        annotationResources: n,
        searchServiceUrl: r,
        setContentSearchResource: a,
        contentSearchResource: o
      }
    ))))
  );
}, Ko = h(G.Trigger, {
  width: "30px",
  padding: "5px"
}), $t = h(G.Content, {
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
}), Qo = h("span", {
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
}), ea = h("header", {
  display: "flex",
  backgroundColor: "transparent !important",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  [`> ${Ct}`]: {
    flexGrow: "1",
    flexShrink: "0"
  },
  form: {
    flexGrow: "0",
    flexShrink: "1"
  }
}), ta = h("div", {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  padding: "1rem",
  flexShrink: "0",
  flexGrow: "1"
}), na = () => {
  var c;
  const e = z(), n = $(), { activeManifest: r, collection: a, configOptions: o, vault: i } = n, l = o == null ? void 0 : o.canvasHeight, s = (d) => {
    e({
      type: "updateActiveManifest",
      manifestId: d
    }), e({
      type: "updateViewerId",
      viewerId: ae()
    });
  };
  return /* @__PURE__ */ t.createElement("div", { style: { margin: "0.75rem" } }, /* @__PURE__ */ t.createElement(
    kt,
    {
      label: a.label,
      maxHeight: l,
      value: r,
      onValueChange: s
    },
    (c = a == null ? void 0 : a.items) == null ? void 0 : c.map((d) => /* @__PURE__ */ t.createElement(
      It,
      {
        value: d.id,
        key: d.id,
        thumbnail: d != null && d.thumbnail ? i.get(d == null ? void 0 : d.thumbnail) : void 0,
        label: d.label
      }
    ))
  ));
}, ra = (e, n = 2500) => {
  const [r, a] = C(), o = oe(() => {
    navigator.clipboard.writeText(e).then(
      () => a("copied"),
      () => a("failed")
    );
  }, [e]);
  return E(() => {
    if (!r)
      return;
    const i = setTimeout(() => a(void 0), n);
    return () => clearTimeout(i);
  }, [r]), [r, o];
}, oa = h("span", {
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
}), aa = ({ status: e }) => e ? /* @__PURE__ */ t.createElement(oa, { "data-copy-status": e }, e) : null, He = ({
  textPrompt: e,
  textToCopy: n
}) => {
  const [r, a] = ra(n);
  return /* @__PURE__ */ t.createElement("button", { onClick: a }, e, " ", /* @__PURE__ */ t.createElement(aa, { status: r }));
}, ia = () => {
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
}, la = h(Ue.Root, {
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
}), sa = h(Ue.Thumb, {
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
}), ca = h("label", {
  fontSize: "0.8333rem",
  fontWeight: "400",
  lineHeight: "1em",
  userSelect: "none",
  cursor: "pointer",
  paddingRight: "0.618rem"
}), da = h("form", {
  display: "flex",
  flexShrink: "0",
  flexGrow: "1",
  alignItems: "center",
  marginLeft: "1.618rem"
}), ma = () => {
  var o;
  const { configOptions: e } = $(), n = z(), [r, a] = C((o = e == null ? void 0 : e.informationPanel) == null ? void 0 : o.open);
  return E(() => {
    n({
      type: "updateInformationOpen",
      isInformationOpen: r
    });
  }, [r, n]), /* @__PURE__ */ t.createElement(da, null, /* @__PURE__ */ t.createElement(ca, { htmlFor: "information-toggle", css: r ? { opacity: "1" } : {} }, "More Information"), /* @__PURE__ */ t.createElement(
    la,
    {
      checked: r,
      onCheckedChange: () => a(!r),
      id: "information-toggle",
      "aria-label": "information panel toggle",
      name: "toggled?"
    },
    /* @__PURE__ */ t.createElement(sa, null)
  ));
}, ua = h(G.Trigger, {
  width: "30px",
  padding: "5px"
}), pa = h($t, {
  h3: {
    color: "$primaryAlt",
    fontSize: "$2",
    fontWeight: "700",
    margin: "$2 0"
  },
  button: {},
  "& ul li": {
    marginBottom: "$1"
  }
});
function Be(e, n) {
  const r = [];
  if (!e)
    return r;
  for (const a of e)
    if (a.id) {
      const o = n.get(a.id);
      o && r.push(o);
    }
  return r;
}
function fa() {
  const { activeCanvas: e, activeManifest: n, vault: r } = $(), [a, o] = C({
    root: [],
    canvas: []
  });
  return E(() => {
    const i = r.get(n), l = r.get(e), s = i == null ? void 0 : i.rendering, c = l == null ? void 0 : l.rendering, d = Be(s, r), p = Be(c, r);
    o({
      root: d,
      canvas: p
    });
  }, [e, n, r]), { ...a };
}
function Oe(e, n) {
  return e.map(({ format: r, id: a, label: o }) => ({
    format: r,
    id: a,
    label: F(o) || n
  }));
}
function ha() {
  const e = fa(), n = Oe(
    (e == null ? void 0 : e.root) || [],
    "Root Rendering Label"
  ), r = Oe(
    (e == null ? void 0 : e.canvas) || [],
    "Canvas Rendering Label"
  );
  return {
    allPages: n,
    individualPages: r
  };
}
const ga = () => {
  const { allPages: e, individualPages: n } = ha(), r = e.length > 0 || n.length > 0, a = (o) => {
    window.open(o, "_blank");
  };
  return r ? /* @__PURE__ */ t.createElement(G, null, /* @__PURE__ */ t.createElement(ua, { "data-testid": "download-button" }, /* @__PURE__ */ t.createElement(R, null, /* @__PURE__ */ t.createElement(R.Download, null))), /* @__PURE__ */ t.createElement(pa, { "data-testid": "download-content" }, n.length > 0 && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("h3", null, "Individual Pages"), /* @__PURE__ */ t.createElement("ul", null, n.map(({ format: o, id: i, label: l }) => /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement("button", { onClick: () => a(i) }, l, " (", o, ")"))))), e.length > 0 && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("h3", null, "All Pages"), /* @__PURE__ */ t.createElement("ul", null, e.map(({ format: o, id: i, label: l }) => /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement("button", { onClick: () => a(i) }, l, " (", o, ")"))))))) : null;
}, At = (e) => {
  const n = () => window.matchMedia ? window.matchMedia(e).matches : !1, [r, a] = C(n);
  return E(() => {
    const o = () => a(n);
    return window.addEventListener("resize", o), () => window.removeEventListener("resize", o);
  }), r;
}, va = ({ manifestId: e, manifestLabel: n }) => {
  const r = $(), { collection: a, configOptions: o } = r, { informationPanel: i, showDownload: l, showIIIFBadge: s, showTitle: c } = o, d = l || s || (i == null ? void 0 : i.renderToggle), p = At(Ce.sm);
  return /* @__PURE__ */ t.createElement(ea, { className: "clover-viewer-header" }, a != null && a.items ? /* @__PURE__ */ t.createElement(na, null) : /* @__PURE__ */ t.createElement(Qo, { className: c ? "" : "visually-hidden" }, c && /* @__PURE__ */ t.createElement(j, { label: n, className: "label" })), d && /* @__PURE__ */ t.createElement(ta, null, l && /* @__PURE__ */ t.createElement(ga, null), s && /* @__PURE__ */ t.createElement(G, null, /* @__PURE__ */ t.createElement(Ko, null, /* @__PURE__ */ t.createElement(ia, null)), /* @__PURE__ */ t.createElement($t, null, (a == null ? void 0 : a.items) && /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (m) => {
        m.preventDefault(), window.open(a.id, "_blank");
      }
    },
    "View Collection"
  ), /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (m) => {
        m.preventDefault(), window.open(e, "_blank");
      }
    },
    "View Manifest"
  ), " ", (a == null ? void 0 : a.items) && /* @__PURE__ */ t.createElement(
    He,
    {
      textPrompt: "Copy Collection URL",
      textToCopy: a.id
    }
  ), /* @__PURE__ */ t.createElement(
    He,
    {
      textPrompt: "Copy Manifest URL",
      textToCopy: e
    }
  ))), (i == null ? void 0 : i.renderToggle) && !p && /* @__PURE__ */ t.createElement(ma, null)));
}, ya = (e = !1) => {
  const [n, r] = C(e);
  return Ft(() => {
    if (!n)
      return;
    const a = document.documentElement.style.overflow;
    return document.documentElement.style.overflow = "hidden", () => {
      document.documentElement.style.overflow = a;
    };
  }, [n]), E(() => {
    n !== e && r(e);
  }, [e]), [n, r];
}, ba = ({
  manifest: e,
  theme: n,
  iiifContentSearchQuery: r
}) => {
  var X;
  const a = $(), o = z(), {
    activeCanvas: i,
    isInformationOpen: l,
    vault: s,
    contentSearchVault: c,
    configOptions: d,
    openSeadragonViewer: p
  } = a, m = ["100%", "auto"], y = (d == null ? void 0 : d.canvasHeight) && m.includes(d == null ? void 0 : d.canvasHeight), [v, u] = C(!1), [f, g] = C(!1), [b, w] = C([]), [k, A] = C([]), [M, I] = C(), [P, V] = ya(!1), S = At(Ce.sm), [T, H] = C(), D = oe(
    (x) => {
      o({
        type: "updateInformationOpen",
        isInformationOpen: x
      });
    },
    [o]
  );
  E(() => {
    var x;
    (x = d == null ? void 0 : d.informationPanel) != null && x.open && D(!S);
  }, [
    S,
    (X = d == null ? void 0 : d.informationPanel) == null ? void 0 : X.open,
    D
  ]), E(() => {
    if (!S) {
      V(!1);
      return;
    }
    V(l);
  }, [l, S, V]), E(() => {
    const x = re(s, i);
    x && (g(
      ["Sound", "Video"].indexOf(x[0].type) > -1
    ), w(x)), rn(s, i).then((L) => {
      L.length > 0 && o({
        type: "updateInformationOpen",
        isInformationOpen: !0
      }), A(L), u(L.length !== 0);
    });
  }, [i, k.length, s, o]), E(() => {
    var x, L, W;
    T && ((x = d.informationPanel) == null ? void 0 : x.renderContentSearch) !== !1 && Ke(
      c,
      T,
      (W = (L = d.localeText) == null ? void 0 : L.contentSearch) == null ? void 0 : W.tabLabel,
      r
    ).then((Y) => {
      I(Y);
    });
  }, [
    r,
    T,
    c,
    d
  ]), E(() => {
    if (!p || !M)
      return;
    const x = s.get({
      id: i,
      type: "Canvas"
    });
    rt(p, "content-search-overlay"), wa(
      c,
      M,
      p,
      x,
      d
    );
  }, [
    c,
    d,
    p,
    i,
    s,
    M
  ]);
  const N = e.service.some(
    (x) => x.type === "SearchService2"
  );
  return E(() => {
    if (N) {
      const x = e.service.find(
        (L) => L.type === "SearchService2"
      );
      x && H(x.id);
    }
  }, [e, N]), /* @__PURE__ */ t.createElement(le, { FallbackComponent: me }, /* @__PURE__ */ t.createElement(
    kn,
    {
      className: `${n} clover-viewer`,
      css: { background: d == null ? void 0 : d.background },
      "data-body-locked": P,
      "data-absolute-position": y,
      "data-information-panel": v,
      "data-information-panel-open": l
    },
    /* @__PURE__ */ t.createElement(
      xe.Root,
      {
        open: l,
        onOpenChange: D
      },
      /* @__PURE__ */ t.createElement(
        va,
        {
          manifestLabel: e.label,
          manifestId: e.id
        }
      ),
      /* @__PURE__ */ t.createElement(
        Jo,
        {
          activeCanvas: i,
          painting: b,
          annotationResources: k,
          searchServiceUrl: T,
          setContentSearchResource: I,
          contentSearchResource: M,
          items: e.items,
          isAudioVideo: f
        }
      )
    )
  ));
};
function wa(e, n, r, a, o) {
  var l, s;
  const i = [];
  (l = n == null ? void 0 : n.items) == null || l.forEach((c) => {
    const d = e.get(c.id);
    typeof d.target == "string" && d.target.startsWith(a.id) && i.push(d);
  }), r && ((s = o.contentSearch) != null && s.overlays) && tt(
    r,
    a,
    o.contentSearch.overlays,
    i,
    "content-search-overlay"
  );
}
const De = {
  ignoreCache: !1,
  headers: {
    Accept: "application/json, text/javascript, text/plain"
  },
  timeout: 5e3,
  withCredentials: !1
};
function xa(e) {
  return {
    ok: e.status >= 200 && e.status < 300,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: e.responseText,
    json: () => JSON.parse(e.responseText)
  };
}
function Ne(e, n = null) {
  return {
    ok: !1,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: n || e.statusText,
    json: () => JSON.parse(n || e.statusText)
  };
}
function Ea(e, n = De) {
  const r = n.headers || De.headers;
  return new Promise((a, o) => {
    const i = new XMLHttpRequest();
    i.open("get", e), i.withCredentials = n.withCredentials, r && Object.keys(r).forEach(
      (l) => i.setRequestHeader(l, r[l])
    ), i.onload = () => {
      a(xa(i));
    }, i.onerror = () => {
      o(Ne(i, "Failed to make request."));
    }, i.ontimeout = () => {
      o(Ne(i, "Request took longer than expected."));
    }, i.send();
  });
}
const Ha = ({
  canvasIdCallback: e = () => {
  },
  customDisplays: n = [],
  plugins: r = [],
  customTheme: a,
  iiifContent: o,
  id: i,
  manifestId: l,
  options: s,
  iiifContentSearchQuery: c
}) => {
  var m, y, v;
  let d = o;
  i && (d = i), l && (d = l);
  const p = Xe(
    (y = (m = s == null ? void 0 : s.informationPanel) == null ? void 0 : m.vtt) == null ? void 0 : y.autoScroll
  );
  return /* @__PURE__ */ t.createElement(
    nn,
    {
      initialState: {
        ...de,
        customDisplays: n,
        plugins: r,
        isAutoScrollEnabled: p.enabled,
        isInformationOpen: !!((v = s == null ? void 0 : s.informationPanel) != null && v.open),
        vault: new he({
          customFetcher: (u) => Ea(u, {
            withCredentials: s == null ? void 0 : s.withCredentials,
            headers: s == null ? void 0 : s.requestHeaders
          }).then((f) => JSON.parse(f.data))
        })
      }
    },
    /* @__PURE__ */ t.createElement(
      Sa,
      {
        iiifContent: d,
        canvasIdCallback: e,
        customTheme: a,
        options: s,
        iiifContentSearchQuery: c
      }
    )
  );
}, Sa = ({
  canvasIdCallback: e,
  customTheme: n,
  iiifContent: r,
  options: a,
  iiifContentSearchQuery: o
}) => {
  const i = z(), l = $(), { activeCanvas: s, activeManifest: c, isLoaded: d, vault: p } = l, [m, y] = C(), [v, u] = C();
  let f = {};
  return n && (f = Ht("custom", n)), E(() => {
    e && e(s);
  }, [s, e]), E(() => {
    c && p.loadManifest(c).then((g) => {
      u(g), i({
        type: "updateActiveCanvas",
        canvasId: dn(r, g)
      });
    }).catch((g) => {
      console.error(`Manifest failed to load: ${g}`);
    }).finally(() => {
      i({
        type: "updateIsLoaded",
        isLoaded: !0
      });
    });
  }, [r, c, i, p]), E(() => {
    i({
      type: "updateConfigOptions",
      configOptions: a
    });
    const g = cn(r);
    p.load(g).then((b) => {
      y(b);
    }).catch((b) => {
      console.error(
        `The IIIF resource ${r} failed to load: ${b}`
      );
    });
  }, [i, r, a, p]), E(() => {
    if ((m == null ? void 0 : m.type) === "Collection") {
      i({
        type: "updateCollection",
        collection: m
      });
      const g = mn(
        r,
        m
      );
      g && i({
        type: "updateActiveManifest",
        manifestId: g
      });
    } else
      (m == null ? void 0 : m.type) === "Manifest" && i({
        type: "updateActiveManifest",
        manifestId: m.id
      });
  }, [i, r, m]), d ? !v || !v.items ? (console.log(`The IIIF manifest ${r} failed to load.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : v.items.length === 0 ? (console.log(`The IIIF manifest ${r} does not contain canvases.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : /* @__PURE__ */ t.createElement(
    ba,
    {
      manifest: v,
      theme: f,
      key: v.id,
      iiifContentSearchQuery: o
    }
  ) : /* @__PURE__ */ t.createElement(t.Fragment, null, "Loading");
};
export {
  Ha as default
};
//# sourceMappingURL=index.mjs.map
