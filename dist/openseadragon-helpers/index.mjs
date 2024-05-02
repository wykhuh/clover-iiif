import w from "openseadragon";
import "@iiif/vault-helpers";
let v = window.OpenSeadragon;
if (!v && (v = w, !v))
  throw new Error("OpenSeadragon is missing.");
const p = "http://www.w3.org/2000/svg";
v.Viewer && (v.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new _(this), this._svgOverlayInfo);
});
const _ = function(e) {
  const t = this;
  this._viewer = e, this._containerWidth = 0, this._containerHeight = 0, this._svg = document.createElementNS(p, "svg"), this._svg.style.position = "absolute", this._svg.style.left = 0, this._svg.style.top = 0, this._svg.style.width = "100%", this._svg.style.height = "100%", this._viewer.canvas.appendChild(this._svg), this._node = document.createElementNS(p, "g"), this._svg.appendChild(this._node), this._viewer.addHandler("animation", function() {
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
_.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new v.Point(0, 0), !0), t = this._viewer.viewport.getZoom(!0), s = this._viewer.viewport.getRotation(), n = this._viewer.viewport.getFlip(), c = this._viewer.viewport._containerInnerSize.x;
    let r = c * t;
    const l = r;
    n && (r = -r, e.x = -e.x + c), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + r + "," + l + ") rotate(" + s + ")"
    );
  },
  // ----------
  onClick: function(e, t) {
    new v.MouseTracker({
      element: e,
      clickHandler: t
    }).setTracking(!0);
  }
};
const C = (e) => new _(e), g = (e) => {
  var s, n, c, r, l;
  let t = {
    id: typeof e == "string" ? e : e.source
  };
  if (typeof e == "string") {
    if (e.includes("#xywh=")) {
      const i = e.split("#xywh=");
      if (i && i[1]) {
        const [o, a, d, h] = i[1].split(",").map((u) => Number(u));
        t = {
          id: i[0],
          rect: {
            x: o,
            y: a,
            w: d,
            h
          }
        };
      }
    } else if (e.includes("#t=")) {
      const i = e.split("#t=");
      i && i[1] && (t = {
        id: i[0],
        t: i[1]
      });
    }
  } else if (typeof e == "object") {
    if (((s = e.selector) == null ? void 0 : s.type) === "PointSelector")
      t = {
        id: e.source,
        point: {
          x: e.selector.x,
          y: e.selector.y
        }
      };
    else if (((n = e.selector) == null ? void 0 : n.type) === "SvgSelector")
      t = {
        id: e.source,
        svg: e.selector.value
      };
    else if (((c = e.selector) == null ? void 0 : c.type) === "FragmentSelector" && (r = e.selector) != null && r.value.includes("xywh=") && e.source.type == "Canvas" && e.source.id) {
      const i = (l = e.selector) == null ? void 0 : l.value.split("xywh=");
      if (i && i[1]) {
        const [o, a, d, h] = i[1].split(",").map((u) => Number(u));
        t = {
          id: e.source.id,
          rect: {
            x: o,
            y: a,
            w: d,
            h
          }
        };
      }
    }
  }
  return t;
}, I = (e) => {
  let t, s;
  if (Array.isArray(e) && (t = e[0], t)) {
    let n;
    "@id" in t ? n = t["@id"] : n = t.id, s = n;
  }
  return s;
};
var m = /* @__PURE__ */ ((e) => (e.TiledImage = "tiledImage", e.SimpleImage = "simpleImage", e))(m || {});
function b(e, t, s, n, c) {
  if (!e)
    return;
  const r = 1 / t.width;
  n.forEach((l) => {
    if (!l.target)
      return;
    const i = g(l.target), { point: o, rect: a, svg: d } = i;
    if (a) {
      const { x: h, y: u, w: f, h: k } = a;
      N(
        e,
        h * r,
        u * r,
        f * r,
        k * r,
        s,
        c
      );
    }
    if (o) {
      const { x: h, y: u } = o, f = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${h}" cy="${u}" r="20" />
        </svg>
      `;
      y(e, f, s, r, c);
    }
    d && y(e, d, s, r, c);
  });
}
function S(e, t, s) {
  let n, c, r = 40, l = 40;
  t.rect && (n = t.rect.x, c = t.rect.y, r = t.rect.w, l = t.rect.h), t.point && (n = t.point.x, c = t.point.y);
  const i = 1 / e.width;
  return new w.Rect(
    n * i - r * i / 2 * (s - 1),
    c * i - l * i / 2 * (s - 1),
    r * i * s,
    l * i * s
  );
}
function N(e, t, s, n, c, r, l) {
  const i = new w.Rect(t, s, n, c), o = document.createElement("div");
  if (r) {
    const { backgroundColor: a, opacity: d, borderType: h, borderColor: u, borderWidth: f } = r;
    o.style.backgroundColor = a, o.style.opacity = d, o.style.border = `${h} ${f} ${u}`, o.className = l;
  }
  e.addOverlay(o, i);
}
function H(e) {
  if (!e)
    return null;
  const t = document.createElement("template");
  return t.innerHTML = e.trim(), t.content.children[0];
}
function y(e, t, s, n, c) {
  const r = H(t);
  if (r)
    for (const l of r.children)
      x(e, l, s, n, c);
}
function x(e, t, s, n, c) {
  var r;
  if (t.nodeName === "#text")
    T(t);
  else {
    const l = E(t, s, n), i = C(e);
    i.node().append(l), (r = i._svg) == null || r.setAttribute("class", c), t.childNodes.forEach((o) => {
      x(e, o, s, n, c);
    });
  }
}
function E(e, t, s) {
  let n = !1, c = !1, r = !1, l = !1;
  const i = document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.nodeName
  );
  if (e.attributes.length > 0)
    for (let o = 0; o < e.attributes.length; o++) {
      const a = e.attributes[o];
      switch (a.name) {
        case "fill":
          r = !0;
          break;
        case "stroke":
          n = !0;
          break;
        case "stroke-width":
          c = !0;
          break;
        case "fill-opacity":
          l = !0;
          break;
      }
      i.setAttribute(a.name, a.textContent);
    }
  return n || (i.style.stroke = t == null ? void 0 : t.borderColor), c || (i.style.strokeWidth = t == null ? void 0 : t.borderWidth), r || (i.style.fill = t == null ? void 0 : t.backgroundColor), l || (i.style.fillOpacity = t == null ? void 0 : t.opacity), i.setAttribute("transform", `scale(${s})`), i;
}
function T(e) {
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
const A = (e) => {
  const t = Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0, s = t ? I(e == null ? void 0 : e.service) : e == null ? void 0 : e.id, n = t ? m.TiledImage : m.SimpleImage;
  return {
    uri: s,
    imageType: n
  };
}, R = (e, t) => {
  const s = t ? m.TiledImage : m.SimpleImage;
  return {
    uri: e,
    imageType: s
  };
};
function $(e, t) {
  if (!e)
    return;
  t.startsWith(".") || (t = "." + t);
  const s = document.querySelectorAll(t);
  s && s.forEach((n) => e.removeOverlay(n));
}
function F(e, t, s, n) {
  const c = g(s), { point: r, rect: l, svg: i } = c;
  if (r || l || i) {
    const o = S(
      n,
      c,
      t
    );
    e == null || e.viewport.fitBounds(o);
  }
}
export {
  b as addOverlaysToViewer,
  y as addSvgOverlay,
  S as createOpenSeadragonRect,
  F as panToTarget,
  A as parseImageBody,
  R as parseSrc,
  $ as removeOverlaysFromViewer,
  E as svg_handleElementNode
};
//# sourceMappingURL=index.mjs.map
