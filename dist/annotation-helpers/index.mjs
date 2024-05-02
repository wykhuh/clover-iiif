const d = (e, i = "en") => {
  if (!e)
    return "";
  if (!e[i]) {
    const n = Object.getOwnPropertyNames(e);
    if (n.length > 0)
      return e[n[0]];
  }
  return e[i];
}, h = (e) => {
  var n, l, o, c, r;
  let i = {
    id: typeof e == "string" ? e : e.source
  };
  if (typeof e == "string") {
    if (e.includes("#xywh=")) {
      const s = e.split("#xywh=");
      if (s && s[1]) {
        const [t, p, f, u] = s[1].split(",").map((y) => Number(y));
        i = {
          id: s[0],
          rect: {
            x: t,
            y: p,
            w: f,
            h: u
          }
        };
      }
    } else if (e.includes("#t=")) {
      const s = e.split("#t=");
      s && s[1] && (i = {
        id: s[0],
        t: s[1]
      });
    }
  } else if (typeof e == "object") {
    if (((n = e.selector) == null ? void 0 : n.type) === "PointSelector")
      i = {
        id: e.source,
        point: {
          x: e.selector.x,
          y: e.selector.y
        }
      };
    else if (((l = e.selector) == null ? void 0 : l.type) === "SvgSelector")
      i = {
        id: e.source,
        svg: e.selector.value
      };
    else if (((o = e.selector) == null ? void 0 : o.type) === "FragmentSelector" && (c = e.selector) != null && c.value.includes("xywh=") && e.source.type == "Canvas" && e.source.id) {
      const s = (r = e.selector) == null ? void 0 : r.value.split("xywh=");
      if (s && s[1]) {
        const [t, p, f, u] = s[1].split(",").map((y) => Number(y));
        i = {
          id: e.source.id,
          rect: {
            x: t,
            y: p,
            w: f,
            h: u
          }
        };
      }
    }
  }
  return i;
}, m = (e, i, n) => {
  const l = [];
  return e.filter((o) => {
    if (o.label) {
      const c = d(o.label);
      if (Array.isArray(c))
        return !c.some(
          (r) => {
            var s;
            return (s = n.ignoreAnnotationOverlaysLabels) == null ? void 0 : s.includes(r);
          }
        );
    }
    return !0;
  }).forEach((o) => {
    var c;
    (c = o == null ? void 0 : o.items) == null || c.forEach((r) => {
      const s = i.get(r.id);
      l.push(s);
    });
  }), l;
};
export {
  h as parseAnnotationTarget,
  m as parseAnnotationsFromAnnotationResources
};
//# sourceMappingURL=index.mjs.map
