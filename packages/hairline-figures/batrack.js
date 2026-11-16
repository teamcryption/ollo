/** batrack: generated row figure. */
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

const N = 5, STEP = 20, L = 66, FAV = 3, X1 = (N - 1) * STEP;
const REST = [14, 10, 16, 11, 13];
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer(), st = { v: value, w: 14, h: 90 };
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -16, 0], [X1 + 14, 16, 0], [-14, -16, 70], [X1 + 14, -16, 70], [X1, 40, 60], [0, 40, 60]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const path = (d, cls, parent = g) => { const e = mk("path", { class: cls }, parent); if (d) e.setAttribute("d", d); return e; };
  // the back rail on two posts, then the base plank with its holes
  for (const x of [-10, X1 + 10]) path(shape(P, rod([x, -10, 4], [x, -10, 54], 1.6, 1.6)), "sil");
  path(shape(P, slab([-14, -13, 50], ...I3, 0, 0, X1 + 28, 5, 2, 5)), "sil");
  path(shape(P, slab([-14, -16, 0], ...I3, 0, 0, X1 + 28, 30, 5, 5)), "sil");
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, base = [x, 4, 5], grp = mk("g", {}, g);
    path(poly(rrect(x - 4.2, -0.2, x + 4.2, 8.2, 4, 4).map((q) => P(q.u, q.v, 5))), "nf lo", grp);
    const body = path(null, "sil", grp), knob = path(null, "", grp);
    const it = { tw: tween(-REST[k]), last: NaN, hi: [body] };
    it.draw = (a) => {
      const r = (a * Math.PI) / 180, D = [0, Math.sin(r), Math.cos(r)];
      body.setAttribute("d", shape(P, rod(along(base, D, 0), along(base, D, 30), 3.6, 3.6).concat(rod(along(base, D, 30), along(base, D, 62), 3.6, 1.4))));
      knob.setAttribute("d", shape(P, rod(along(base, D, 62), along(base, D, 64.5), 2.7, 2.4)));
    };
    items.push(it);
  }
  const mids = items.map((_, k) => P(k * STEP, 4, 40));
  rowLife(stage, read, items, mids, (k) => -REST[k], (k, d) => (d === 0 ? 30 : d === 1 ? 6 : -REST[k]), FAV, "bat", bag, st);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { st.v = v; }, destroy: bag.dispose };
}

hairline({
  name: "batrack",
  means: "Five baseball bats leaning in a rack: the bat under the pointer tilts out toward you, its neighbours lean a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 122], [207, 151], [265, 180], null],
  mount,
});
