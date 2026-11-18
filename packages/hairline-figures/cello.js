/**
 * Cello: a cello lying on its back, the waisted body with its two bouts, the
 * bridge, the long neck and the scroll, the endpin towards us. The pointer
 * along it picks how far to raise it: the cello tilts up about the endpin,
 * scroll first, as if being stood up to play. At rest it lies low, the
 * strings bright. The slider is the largest tilt, so how far it rises.
 *
 * The pattern: one rigid body tilting about its foot, picked on the rest plane.
 */
const {
  Cam, clamp, fit, poly, hull, proj, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, register, solid,
} = HL;

const EP = 160, REST = 5;
// half-width of the body along u (u = distance from the endpin)
const wid = (u) => {
  const t = (u - 14) / 90;
  if (t < 0 || t > 1) return 0;
  return (18.5 + 4 * Math.cos((2 * Math.PI * (t - 0.27)) / 0.55) - 4 * t) * Math.pow(Math.sin(Math.PI * t), 0.35);
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 1.95);
  const rot = (deg) => {
    const c = Math.cos((deg * Math.PI) / 180), s = Math.sin((deg * Math.PI) / 180);
    return ([x, y, z]) => [EP + (x - EP) * c + z * s, y, -(x - EP) * s + z * c];
  };
  const ext = [];
  for (const a of [0, 30]) for (const q of [[EP, 0, 0], [EP - 14, 24, 12], [EP - 14, -24, 12], [-8, 8, 12], [-8, -8, 0], [EP - 60, 24, 0], [EP - 60, -24, 0]]) ext.push(rot(a)(q));
  fit(C, ext, 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const outline = (z) => {
    const L = [], Rr = [];
    for (let u = 14; u <= 104; u += 2) { const w = wid(u); L.push([EP - u, w, z]); Rr.push([EP - u, -w, z]); }
    return L.concat(Rr.reverse());
  };
  const box = (x0, y0, x1, y1, z, r = 1.5) => {
    const o = [];
    for (const [cx, cy, a] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180], [x1 - r, y0 + r, 270]]) {
      for (let i = 0; i <= 4; i++) { const t = ((a + i * 22.5) * Math.PI) / 180; o.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); }
    }
    return o;
  };
  const shapes = [];
  const plate = (pts, cls) => { const p = mk("path", { class: cls }, g); shapes.push({ p, pts, flat: true }); return p; };
  const sol = (base, top, cr) => { const s = solid(g); shapes.push({ s, base, top, cr }); return s; };

  plate(outline(0), "sil");
  plate(outline(11), "sil");
  plate(outline(11).map(([x, y, z]) => [EP - 59 + (x - EP + 59) * 0.93, y * 0.88, z]), "nf lo");
  sol(box(EP - 14, -1.2, EP, 1.2, 4), box(EP - 14, -1.2, EP, 1.2, 6.5), null);
  sol(box(EP - 50, -9, EP - 47, 9, 11), box(EP - 50, -9, EP - 47, 9, 17), null);
  sol(box(EP - 170, -4, EP - 96, 4, 10), box(EP - 170, -4, EP - 96, 4, 14), box(EP - 169, -3, EP - 97, 3, 14));
  sol(box(EP - 184, -5, EP - 168, 5, 8), box(EP - 184, -5, EP - 168, 5, 13), box(EP - 183, -4, EP - 169, 4, 13));
  const strings = [-2.7, -0.9, 0.9, 2.7].map((y) => {
    const p = mk("path", { class: "nf" }, g);
    shapes.push({ p, pts: [[EP - 22, y, 12], [EP - 49, y, 17.5], [EP - 168, y, 15]], line: true });
    return p;
  });

  const tilt = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const R = rot(deg), T = (q) => P(...R(q));
    for (const h of shapes) {
      if (h.line) h.p.setAttribute("d", "M" + h.pts.map(T).map((q) => q.join(",")).join("L"));
      else if (h.flat) h.p.setAttribute("d", poly(h.pts.map(T)));
      else {
        h.s.sil.setAttribute("d", poly(hull(h.base.concat(h.top).map(T))));
        if (h.cr) h.s.cr.setAttribute("d", poly(h.cr.map(T)));
      }
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(tilt, now)); return !tdone(tilt, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 11);
    const u = EP - x;
    if (u < -4 || u > 188 || Math.abs(y) > (u < 106 ? 26 : 9)) return -1;
    return 3 - clamp(Math.floor(u / 48), 0, 3);
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tilt, a < 0 ? REST : REST + ((4 - a) / 4) * maxT, performance.now(), 0);
    for (const s of strings) s.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "raise " + (4 - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "cello",
  means: "A cello lying on its back, endpin towards us: the pointer along it picks how far to raise it, and it tilts up about the endpin.",
  rules: [1, 3, 5, 8],
  range: [10, 22, 24],
  tour: [[210, 225], [144, 192], [102, 166], null],
  mount,
});
