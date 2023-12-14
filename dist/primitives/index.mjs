import a, { useRef as D, useEffect as M, useCallback as z, createContext as q, useContext as _, cloneElement as W, Fragment as N } from "react";
import G from "sanitize-html";
import { createStitches as K } from "@stitches/react";
import E from "hls.js";
const V = (e, t = "none") => {
  if (!e)
    return null;
  if (typeof e == "string")
    return [e];
  if (!e[t]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return !e[t] || !Array.isArray(e[t]) ? null : e[t];
}, x = (e, t = "none", r = ", ") => {
  const o = V(e, t);
  return Array.isArray(o) ? o.join(`${r}`) : o;
};
function U(e) {
  return { __html: B(e) };
}
function p(e, t) {
  const r = Object.keys(e).filter(
    (s) => t.includes(s) ? null : s
  ), o = new Object();
  return r.forEach((s) => {
    o[s] = e[s];
  }), o;
}
function B(e) {
  return G(e, {
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
const A = 209, J = {
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
    accent: `hsl(${A} 100% 38.2%)`,
    accentMuted: `hsl(${A} 80% 61.8%)`,
    accentAlt: `hsl(${A} 80% 30%)`,
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
}, Q = {
  xxs: "(max-width: 349px)",
  xs: "(max-width: 575px)",
  sm: "(max-width: 767px)",
  md: "(max-width: 991px)",
  lg: "(max-width: 90rem)",
  xl: "(min-width: calc(90rem + 1px))"
}, { styled: d, css: Ae, keyframes: ke, createTheme: we } = K({
  theme: J,
  media: Q
}), X = d("span", {}), L = (e) => {
  const { as: t, label: r } = e, s = p(e, ["as", "label"]);
  return /* @__PURE__ */ a.createElement(X, { as: t, ...s }, x(r, s.lang));
}, Y = (e, t = "200,", r = "full") => {
  Array.isArray(e) && (e = e[0]);
  const { id: o, service: s } = e;
  let n;
  if (!s)
    return o;
  if (Array.isArray(e.service) && e.service.length > 0 && (n = s[0]), n) {
    if (n["@id"])
      return `${n["@id"]}/${r}/${t}/0/default.jpg`;
    if (n.id)
      return `${n.id}/${r}/${t}/0/default.jpg`;
  }
}, O = d("img", { objectFit: "cover" }), T = (e) => {
  const t = D(null), { contentResource: r, altAsLabel: o, region: s = "full" } = e;
  let n;
  o && (n = x(o));
  const u = p(e, ["contentResource", "altAsLabel"]), { type: f, id: c, width: b = 200, height: S = 200, duration: v } = r;
  M(() => {
    if (!c && !t.current || ["Image"].includes(f) || !c.includes("m3u8"))
      return;
    const l = new E();
    return t.current && (l.attachMedia(t.current), l.on(E.Events.MEDIA_ATTACHED, function() {
      l.loadSource(c);
    })), l.on(E.Events.ERROR, function(y, g) {
      if (g.fatal)
        switch (g.type) {
          case E.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${y} network error encountered, try to recover`
            ), l.startLoad();
            break;
          case E.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${y} media error encountered, try to recover`
            ), l.recoverMediaError();
            break;
          default:
            l.destroy();
            break;
        }
    }), () => {
      l && (l.detachMedia(), l.destroy());
    };
  }, [c, f]);
  const h = z(() => {
    if (!t.current)
      return;
    let l = 0, y = 30;
    if (v && (y = v), !c.split("#t=") && v && (l = v * 0.1), c.split("#t=").pop()) {
      const C = c.split("#t=").pop();
      C && (l = parseInt(C.split(",")[0]));
    }
    const g = t.current;
    g.autoplay = !0, g.currentTime = l, setTimeout(() => h(), y * 1e3);
  }, [v, c]);
  M(() => h(), [h]);
  const j = Y(
    r,
    `${b},${S}`,
    s
  );
  switch (f) {
    case "Image":
      return /* @__PURE__ */ a.createElement(
        O,
        {
          as: "img",
          alt: n,
          css: { width: b, height: S },
          key: c,
          src: j,
          ...u
        }
      );
    case "Video":
      return /* @__PURE__ */ a.createElement(
        O,
        {
          as: "video",
          css: { width: b, height: S },
          disablePictureInPicture: !0,
          key: c,
          loop: !0,
          muted: !0,
          onPause: h,
          ref: t,
          src: c
        }
      );
    default:
      return console.warn(
        `Resource type: ${f} is not valid or not yet supported in Primitives.`
      ), /* @__PURE__ */ a.createElement(a.Fragment, null);
  }
}, Z = d("a", {}), ee = (e) => {
  const { children: t, homepage: r } = e, s = p(e, ["children", "homepage"]);
  return /* @__PURE__ */ a.createElement(a.Fragment, null, r && r.map((n) => {
    const i = x(
      n.label,
      s.lang
    );
    return /* @__PURE__ */ a.createElement(
      Z,
      {
        "aria-label": t ? i : void 0,
        href: n.id,
        key: n.id,
        ...s
      },
      t || i
    );
  }));
}, te = {
  delimiter: ", "
}, k = q(void 0), F = () => {
  const e = _(k);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, w = ({
  children: e,
  initialState: t = te
}) => {
  const r = re(t, "delimiter");
  return /* @__PURE__ */ a.createElement(k.Provider, { value: { delimiter: r } }, e);
}, re = (e, t) => Object.hasOwn(e, t) ? e[t].toString() : void 0, ne = d("span", {}), $ = (e) => {
  const { as: t, markup: r } = e, { delimiter: o } = F();
  if (!r)
    return /* @__PURE__ */ a.createElement(a.Fragment, null);
  const n = p(e, ["as", "markup"]), i = U(
    x(r, n.lang, o)
  );
  return /* @__PURE__ */ a.createElement(ne, { as: t, ...n, dangerouslySetInnerHTML: i });
}, R = (e) => a.useContext(k) ? /* @__PURE__ */ a.createElement($, { ...e }) : /* @__PURE__ */ a.createElement(w, null, /* @__PURE__ */ a.createElement($, { ...e })), I = ({ as: e = "dd", lang: t, value: r }) => /* @__PURE__ */ a.createElement(R, { markup: r, as: e, lang: t }), ae = d("span", {}), se = ({
  as: e = "dd",
  customValueContent: t,
  lang: r,
  value: o
}) => {
  var i;
  const { delimiter: s } = F(), n = (i = V(o, r)) == null ? void 0 : i.map((u) => W(t, {
    value: u
  }));
  return /* @__PURE__ */ a.createElement(ae, { as: e, lang: r }, n == null ? void 0 : n.map((u, f) => [
    f > 0 && `${s}`,
    /* @__PURE__ */ a.createElement(N, { key: f }, u)
  ]));
}, P = (e) => {
  var u;
  const { item: t, lang: r, customValueContent: o } = e, { label: s, value: n } = t, i = (u = x(s)) == null ? void 0 : u.replace(" ", "-").toLowerCase();
  return /* @__PURE__ */ a.createElement("div", { role: "group", "data-label": i }, /* @__PURE__ */ a.createElement(L, { as: "dt", label: s, lang: r }), o ? /* @__PURE__ */ a.createElement(
    se,
    {
      as: "dd",
      customValueContent: o,
      value: n,
      lang: r
    }
  ) : /* @__PURE__ */ a.createElement(I, { as: "dd", value: n, lang: r }));
}, H = (e, t) => Object.hasOwn(e, t) ? e[t].toString() : void 0;
function oe(e, t) {
  const r = t.filter((o) => {
    const { matchingLabel: s } = o, n = Object.keys(o.matchingLabel)[0], i = x(s, n);
    if (x(e, n) === i)
      return !0;
  }).map((o) => o.Content);
  if (Array.isArray(r))
    return r[0];
}
const ie = d("dl", {}), le = (e) => {
  const { as: t, customValueContent: r, metadata: o } = e;
  if (!Array.isArray(o))
    return /* @__PURE__ */ a.createElement(a.Fragment, null);
  const s = H(e, "customValueDelimiter"), i = p(e, [
    "as",
    "customValueContent",
    "customValueDelimiter",
    "metadata"
  ]);
  return /* @__PURE__ */ a.createElement(
    w,
    {
      ...typeof s == "string" ? { initialState: { delimiter: s } } : void 0
    },
    o.length > 0 && /* @__PURE__ */ a.createElement(ie, { as: t, ...i }, o.map((u, f) => {
      const c = r ? oe(u.label, r) : void 0;
      return /* @__PURE__ */ a.createElement(
        P,
        {
          customValueContent: c,
          item: u,
          key: f,
          lang: i == null ? void 0 : i.lang
        }
      );
    }))
  );
}, ce = d("li", {}), me = d("ul", {}), ue = (e) => {
  const { as: t, partOf: r } = e, s = p(e, ["as", "partOf"]);
  return /* @__PURE__ */ a.createElement(me, { as: t }, r && r.map((n) => {
    const i = n.label ? x(n.label, s.lang) : void 0;
    return /* @__PURE__ */ a.createElement(ce, { key: n.id }, /* @__PURE__ */ a.createElement("a", { href: n.id, ...s }, i || n.id));
  }));
}, de = d("dl", {}), pe = (e) => {
  const { as: t, requiredStatement: r } = e;
  if (!r)
    return /* @__PURE__ */ a.createElement(a.Fragment, null);
  const o = H(e, "customValueDelimiter"), n = p(e, ["as", "customValueDelimiter", "requiredStatement"]);
  return /* @__PURE__ */ a.createElement(
    w,
    {
      ...typeof o == "string" ? { initialState: { delimiter: o } } : void 0
    },
    /* @__PURE__ */ a.createElement(de, { as: t, ...n }, /* @__PURE__ */ a.createElement(P, { item: r, lang: n.lang }))
  );
}, fe = d("li", {}), xe = d("ul", {}), ve = (e) => {
  const { as: t, seeAlso: r } = e, s = p(e, ["as", "seeAlso"]);
  return /* @__PURE__ */ a.createElement(xe, { as: t }, r && r.map((n) => {
    const i = x(
      n.label,
      s.lang
    );
    return /* @__PURE__ */ a.createElement(fe, { key: n.id }, /* @__PURE__ */ a.createElement("a", { href: n.id, ...s }, i || n.id));
  }));
}, ye = (e) => {
  const { as: t, summary: r } = e, s = p(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ a.createElement(R, { as: t, markup: r, ...s });
}, ge = (e) => {
  const { thumbnail: t, region: r } = e, s = p(e, ["thumbnail"]);
  return /* @__PURE__ */ a.createElement(a.Fragment, null, t && t.map((n) => /* @__PURE__ */ a.createElement(
    T,
    {
      contentResource: n,
      key: n.id,
      region: r,
      ...s
    }
  )));
}, m = () => (console.log("Use dot notation to access Primitives.*, ex: Primitives.Label"), null);
m.ContentResource = T;
m.Homepage = ee;
m.Label = L;
m.Markup = R;
m.Metadata = le;
m.MetadataItem = P;
m.PartOf = ue;
m.RequiredStatement = pe;
m.SeeAlso = ve;
m.Summary = ye;
m.Thumbnail = ge;
m.Value = I;
export {
  T as ContentResource,
  ee as Homepage,
  L as Label,
  R as Markup,
  le as Metadata,
  P as MetadataItem,
  ue as PartOf,
  pe as RequiredStatement,
  ve as SeeAlso,
  ye as Summary,
  ge as Thumbnail,
  I as Value,
  m as default
};
//# sourceMappingURL=index.mjs.map
