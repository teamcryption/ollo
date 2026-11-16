/**
 * Money counter: a note counting machine with a fan of banknotes standing in its hopper. The pointer picks a note by where it stands and it leans over to be fed; the notes beside it lean less, staggered. At rest one note leans, bright. The slider is the stagger.
 */
const { Cam, circ, rrect, fit, hull, poly, proj, rad, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const box = (x0, y0, z0, x1, y1, z1, r = 2) => { const g = rrect(x0, y0, x1, y1, r, 4), o = []; for (const q of g) o.push([q.u, q.v, z0], [q.u, q.v, z1]); return o; };
const taper = (a, z0, b, z1, r = 3) => { const o = []; for (const q of rrect(...a, r, 4)) o.push([q.u, q.v, z0]); for (const q of rrect(...b, r, 4)) o.push([q.u, q.v, z1]); return o; };
const ell = (cx, cy, cz, rx, ry, rz) => { const o = []; for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; for (let j = 0; j < 16; j++) { const f = (j / 16) * 2 * Math.PI; o.push([cx + rx * Math.sin(t) * Math.cos(f), cy + ry * Math.sin(t) * Math.sin(f), cz + rz * Math.cos(t)]); } } return o; };
const cyl = (cx, cy, R, z0, z1) => { const o = []; for (const q of circ(R, 16)) o.push([cx + q.u, cy + q.v, z0], [cx + q.u, cy + q.v, z1]); return o; };
const shift = (pts, dx) => pts.map(([x, y, z]) => [x + dx, y, z]);
function turn(pts, ax, h1, h2, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => {
    if (ax === "x") { const dy = y - h1, dz = z - h2; return [x, h1 + dy * c - dz * s, h2 + dy * s + dz * c]; }
    const dx = x - h1, dz = z - h2; return [h1 + dx * c + dz * s, y, h2 - dx * s + dz * c];
  });
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const items = [];
  for (let k = 0; k < SPEC.n; k++) items.push({ k, ...SPEC.build(k) });
  const C = Cam(45, 0.5, SPEC.S);
  const ext = [];
  for (const it of items) { for (const p of it.fixed.flat()) ext.push(p); for (const p of it.moving.flat()) ext.push(p); for (const p of turn(it.moving.flat(), it.ax, it.h1, it.h2, rad(SPEC.open))) ext.push(p); }
  for (const p of (SPEC.base || []).flat()) ext.push(p);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shape = (pts) => poly(hull(pts.map((p) => P(...p))));
  for (const b of SPEC.base || []) mk("path", { d: shape(b), class: "sil" }, g);
  for (const it of items) {
    it.grp = mk("g", {}, g);
    for (const f of it.fixed) mk("path", { d: shape(f), class: "sil" }, it.grp);
    it.paths = it.moving.map((m, i) => mk("path", { class: i === 0 ? "sil" : "lo" }, it.grp));
    it.a = tween(it.k === SPEC.fav ? SPEC.restA : 0);
    it.last = NaN;
    it.mid = P(...it.hit);
  }
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    it.moving.forEach((m, i) => it.paths[i].setAttribute("d", shape(turn(m, it.ax, it.h1, it.h2, rad(a)))));
  }
  const B = register(stage, (_dt, now) => {
    let mv = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) mv = true; }
    return mv;
  });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < SPEC.hx && Math.abs(items[best].mid[1] - sy) < SPEC.hy ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), t = a < 0 ? (k === SPEC.fav ? SPEC.restA : 0) : d === 0 ? SPEC.open : d === 1 ? SPEC.near : d === 2 ? SPEC.near * 0.4 : 0;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.paths[0].classList.toggle("hi", k === (a < 0 ? SPEC.fav : a));
    });
    read.textContent = a < 0 ? "rest" : SPEC.label + " " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

const SPEC = {
  n: 7, S: 2.5, fav: 2, restA: 18, open: 42, near: 20, hx: 8, hy: 90, label: "note",
  base: [box(-12, -24, 0, 54, 24, 18, 5), box(-4, -20, 18, 46, 20, 20, 3)],
  build: (k) => {
    const x = k * 7;
    return {
      fixed: [],
      moving: [box(x - 0.6, -17, 20, x + 0.6, 17, 52, 1), box(x - 0.8, -5, 32, x + 0.8, 5, 40, 1)],
      ax: "y", h1: x, h2: 20, hit: [x, 0, 46],
    };
  },
};
hairline({
  name: "moneytray",
  means: "A note counting machine with banknotes in its hopper: the note under the pointer leans over to feed, and its neighbours lean less.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[171, 104], [195, 116], [219, 128], null],
  mount,
});
