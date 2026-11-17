/**
 * Piping bag: a filled piping bag with its nozzle over a sheet cake, five
 * rosettes piped along the top. The pointer picks a rosette: the bag slides
 * along to pipe over it, and that rosette is bright. At rest, the second.
 */
const SPEC = {"S":1.95,"wy":0.3,"reach":60,"word":"rose","fav":1,"span":[0,4],"track":true,"marks":[1,2,3,4,5],"movers":[{"slide":[19,0,0],"rest":1}],"draw":[[-1,["box",0,0,100,40,0,16,6]],[-1,["cone",12,20,6,16,0.5,25]],[-1,["cone",31,20,6,16,0.5,25]],[-1,["cone",50,20,6,16,0.5,25]],[-1,["cone",69,20,6,16,0.5,25]],[-1,["cone",88,20,6,16,0.5,25]],[0,["cone",12,20,0.6,30,3.5,38]],[0,["cone",12,20,3,38,18,84]],[0,["cone",12,20,18,84,4,94]],[0,["cyl",12,20,4,94,100]]]};

const { Cam, circ, fit, hull, open, poly, proj, rrect, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const ring = (R, cx, cy, z, n = 24) => (R < 0.8 ? [[cx, cy, z]] : circ(R, n).map((q) => [q.u + cx, q.v + cy, z]));
const closed = (l) => l.concat([l[0]]);
function shape([k, ...a]) {
  const pts = [], lines = [];
  if (k === "box" || k === "tray" || k === "crate") {
    const [x0, y0, x1, y1, z0, z1, r, n] = a, b = Math.min(1.4, (x1 - x0) / 4, (y1 - y0) / 4);
    for (const q of rrect(x0, y0, x1, y1, r, 4)) pts.push([q.u, q.v, z0], [q.u, q.v, z1]);
    lines.push(closed(rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.4), 4).map((q) => [q.u, q.v, z1])));
    if (k === "tray") for (let i = 1; i < n; i++) { const x = x0 + ((x1 - x0) * i) / n; lines.push([[x, y0 + 2, z1], [x, y1 - 2, z1]]); }
    if (k === "crate") for (let i = 1; i < n; i++) {
      const x = x0 + ((x1 - x0) * i) / n, y = y0 + ((y1 - y0) * i) / n;
      lines.push([[x, y1, z0 + 2], [x, y1, z1 - 2]], [[x1, y, z0 + 2], [x1, y, z1 - 2]]);
    }
  } else if (k === "cyl" || k === "cone") {
    const [cx, cy, R0, z0, R1v, z1] = a, R1 = k === "cyl" ? R0 : R1v, Z1 = k === "cyl" ? R1v : z1;
    pts.push(...ring(R0, cx, cy, z0, 32), ...ring(R1, cx, cy, Z1, 32));
    if (R1 > 3) lines.push(closed(ring(R1 - 1.2, cx, cy, Z1, 32)));
  } else if (k === "arch") {
    const [x0, x1, yc, R, z0, H, n] = a, at = (x, t) => [x, yc + R * Math.cos(t), z0 + H * Math.sin(t)];
    const hoop = (x) => Array.from({ length: 17 }, (_, i) => at(x, (i / 16) * Math.PI));
    pts.push(...hoop(x0), ...hoop(x1));
    for (let i = 1; i < n; i++) lines.push(hoop(x0 + ((x1 - x0) * i) / n));
    for (const t of [0.3, 0.6, 0.85]) lines.push([at(x0 + 1, t * Math.PI), at(x1 - 1, t * Math.PI)]);
  }
  return { pts, lines };
}
function mover(m, t) {
  if (m.slide) { const [dx, dy, dz] = m.slide; return (p) => [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t]; }
  const [ax, pa, pb, amt] = m.rot, a = amt * t, c = Math.cos(a), s = Math.sin(a);
  const i = ax === "y" ? 0 : ax === "x" ? 1 : 0, j = ax === "z" ? 1 : 2;
  return (p) => { const q = p.slice(), du = p[i] - pa, dv = p[j] - pb; q[i] = pa + du * c - dv * s; q[j] = pb + du * s + dv * c; return q; };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, SPEC.S), M = SPEC.movers;
  const items = SPEC.draw.map(([m, sh]) => ({ m, sh: shape(sh) }));
  const ext = [];
  for (const it of items) for (const p of it.sh.pts) {
    if (it.m < 0) ext.push(p);
    else for (const t of SPEC.span) ext.push(mover(M[it.m], t)(p));
  }
  fit(C, ext, 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  for (const it of items) {
    const grp = mk("g", {}, g);
    it.sil = it.sh.pts.length ? mk("path", { class: "sil" }, grp) : null;
    it.cr = mk("path", { class: "nf lo" }, grp);
    it.last = NaN;
  }
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const T = it.m < 0 ? (p) => p : mover(M[it.m], t);
    if (it.sil) it.sil.setAttribute("d", poly(hull(it.sh.pts.map((p) => P(...T(p))))));
    it.cr.setAttribute("d", it.sh.lines.map((l) => open(l.map((p) => P(...T(p))))).join(""));
  }
  const tw = M.map((m) => tween(m.rest));
  items.forEach((it) => { if (it.m < 0) draw(it, 0); });
  const B = register(stage, (_dt, now) => {
    let moving = false;
    items.forEach((it) => { if (it.m >= 0) { draw(it, tval(tw[it.m], now)); if (!tdone(tw[it.m], now)) moving = true; } });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: rest-pose centres, never the pose on screen
  const marks = SPEC.marks || M.map((_, k) => items.findIndex((it) => it.m === k));
  const mids = marks.map((ix) => { const ps = items[ix].sh.pts; const c = [0, 1, 2].map((d) => ps.reduce((s, p) => s + p[d], 0) / ps.length); return P(...c); });
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, (m[1] - sy) * SPEC.wy); if (d < bd) { bd = d; best = k; } });
    return bd < SPEC.reach ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    M.forEach((m, k) => {
      const d = Math.abs(k - a), to = SPEC.track ? (a < 0 ? m.rest : a) : a < 0 ? m.rest : d === 0 ? 1 : d === 1 ? 0.3 : 0.1;
      tset(tw[k], to, now, from < 0 || SPEC.track ? 0 : Math.abs(k - from) * stag);
    });
    marks.forEach((ix, k) => items[ix].sil.classList.toggle("hi", k === (a < 0 ? SPEC.fav : a)));
    read.textContent = a < 0 ? "rest" : SPEC.word + (M.length > 1 || SPEC.track ? " " + (a + 1) : "");
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cakestencil",
  means: "A piping bag over a sheet cake: the bag slides along to the rosette under the pointer, nozzle first.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[148,175],[226,214],[252,227],null],
  mount,
});
