/** paddlerack: generated row figure. */
const {
  Cam, fit, proj, rrect, hull, poly, unproj, spring, stepS, tween, tset, tval, tdone, clamp,
  disposer, mk, pointer, register,
} = HL;

const at = (o, U, V, W, u, v, w) => [0, 1, 2].map((i) => o[i] + U[i] * u + V[i] * v + W[i] * w);
const slab = (o, U, V, W, u0, v0, u1, v1, r, t) => {
  const p = [];
  for (const q of rrect(u0, v0, u1, v1, r, 4)) p.push(at(o, U, V, W, q.u, q.v, 0), at(o, U, V, W, q.u, q.v, t));
  return p;
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return a.map((x) => x / l); };
const rod = (a, b, r0, r1) => {
  const d = nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
  const e = nrm(Math.abs(d[2]) > 0.9 ? cross(d, [1, 0, 0]) : cross(d, [0, 0, 1])), f = cross(d, e), p = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    p.push(a.map((x, j) => x + (e[j] * c + f[j] * s) * r0), b.map((x, j) => x + (e[j] * c + f[j] * s) * r1));
  }
  return p;
};
const shape = (P, pts) => poly(hull(pts.map((q) => P(q[0], q[1], q[2]))));
const along = (o, D, s) => [o[0] + D[0] * s, o[1] + D[1] * s, o[2] + D[2] * s];

function rowLife(stage, read, items, mids, restOf, pickOf, FAV, name, bag, st) {
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const it of items) {
      const v = tval(it.tw, now);
      if (v !== it.last) { it.last = v; it.draw(v); }
      if (!tdone(it.tw, now)) m = true;
    }
    return m;
  });
  bag.add(B.unregister);
  const hit = ([sx, sy]) => {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < st.w && Math.abs(mids[best][1] - sy) < st.h ? best : -1;
  };
  let act = -2;
  const setActive = (a) => {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.tw, a < 0 ? restOf(k) : pickOf(k, Math.abs(k - a)), now, from < 0 ? 0 : Math.abs(k - from) * st.v);
      for (const el of it.hi) el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : name + " " + (a + 1);
    B.wake();
  };
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
}

const N = 4, STEP = 26, FAV = 2, X1 = (N - 1) * STEP;
const REST = [-30, 15, -60, 20];
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer(), st = { v: value, w: 18, h: 100 };
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-16, -14, 0], [X1 + 16, 14, 0], [-16, -14, 92], [X1 + 16, 14, 92]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const path = (d, cls, parent = g) => { const e = mk("path", { class: cls }, parent); if (d) e.setAttribute("d", d); return e; };
  // the stand: two posts and a notched top bar behind the shafts
  for (const x of [-12, X1 + 12]) path(shape(P, rod([x, -6, 3], [x, -6, 66], 1.8, 1.8)), "sil");
  path(shape(P, slab([-15, -9, 62], ...I3, 0, 0, X1 + 30, 6, 2.5, 5)), "sil");
  path(shape(P, slab([-16, -14, 0], ...I3, 0, 0, X1 + 32, 28, 6, 3)), "sil");
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const blade = path(null, "sil", grp), rib = path(null, "nf lo", grp), shaft = path(null, "sil", grp), grip = path(null, "", grp);
    const it = { tw: tween(REST[k]), last: NaN, hi: [blade] };
    it.draw = (a) => {
      const r = (a * Math.PI) / 180, U = [Math.cos(r), Math.sin(r), 0], W = [-Math.sin(r), Math.cos(r), 0];
      blade.setAttribute("d", shape(P, slab(at([x, 0, 4], U, [0, 0, 1], W, 0, 0, 0, 0, 0, 0), U, [0, 0, 1], W, -8, 0, 8, 34, 7, 0.8)));
      rib.setAttribute("d", "M" + P(x, 0, 6).join(",") + "L" + P(x, 0, 36).join(","));
      shaft.setAttribute("d", shape(P, rod([x, 0, 36], [x, 0, 84], 1.4, 1.3)));
      grip.setAttribute("d", shape(P, slab(at([x, 0, 84], U, [0, 0, 1], W, 0, 0, 0, 0, 0, 0), U, [0, 0, 1], W, -5, 0, 5, 3.5, 1.6, 2.2).map((q) => [q[0] - W[0] * 1.1, q[1] - W[1] * 1.1, q[2]])));
    };
    items.push(it);
  }
  const mids = items.map((_, k) => P(k * STEP, 0, 45));
  rowLife(stage, read, items, mids, (k) => REST[k], (k, d) => (d === 0 ? 135 : d === 1 ? REST[k] + 70 : REST[k] + 35), FAV, "paddle", bag, st);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { st.v = v; }, destroy: bag.dispose };
}

hairline({
  name: "paddlerack",
  means: "Four canoe paddles standing in a rack: the paddle under the pointer turns on its shaft to show its blade.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 160], [183, 177], [250, 210], null],
  mount,
});
