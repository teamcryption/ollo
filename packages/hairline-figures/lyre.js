/**
 * Lyre: a soundbox with two curved arms rising to a crossbar, seven strings
 * strung between. The pointer picks the string nearest it: that string goes
 * bright and bows out as if plucked, and the lyre tips toward that side as a
 * player cradles it. At rest it leans a little, the middle string lit.
 *
 * The pattern: one of a few in a single row (riffle).
 */
const {
  Cam, fit, hull, open, poly, proj, rrect, run, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, FAV = 3, MAX = 0.3, REST = -0.06;
const sx = (i) => -15 + i * 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[-45, -10, 0], [45, 10, 0], [-45, -10, 80], [45, 10, 80]], 200, 160);
  const P0 = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const arms = mk("path", { class: "nf" }, g);
  const box = solid(mk("g", {}, g));
  const strs = Array.from({ length: N }, () => mk("path", { class: "nf lo" }, g));
  const bar = solid(mk("g", {}, g));
  const tilt = tween(REST), pl = tween(0);
  let pick = FAV, last = "";

  function draw(now) {
    const a = tval(tilt, now), b = tval(pl, now), key = a.toFixed(4) + b.toFixed(4) + pick;
    if (key === last) return;
    last = key;
    const ca = Math.cos(a), sa = Math.sin(a);
    const P = (x, y, z) => P0(x * ca + z * sa, y, -x * sa + z * ca);
    const slab = (r, z0, z1) => poly(hull(r.map((q) => P(q.u, q.v, z0)).concat(r.map((q) => P(q.u, q.v, z1)))));
    const r1 = rrect(-24, -7, 24, 7, 6, 4);
    put(box, { sil: slab(r1, 0, 16), crease: open(run(rrect(-22.5, -5.5, 22.5, 5.5, 4.5, 4), front).map((q) => P(q.u, q.v, 14.6))) });
    let s = "";
    for (const side of [-1, 1]) for (const o of [0, 4]) {
      const pts = [];
      for (let k = 0; k <= 16; k++) { const t = k / 16, x = side * (16 + o + 16 * Math.sin(t * 2.4) - 4 * t), z = 14 + t * 58; pts.push(P(x, 0, z)); }
      s += open(pts);
    }
    arms.setAttribute("d", s);
    const r2 = rrect(-28, -3, 28, 3, 2.5, 4);
    put(bar, { sil: slab(r2, 64, 70), crease: open(run(rrect(-27, -2, 27, 2, 1.5, 4), front).map((q) => P(q.u, q.v, 69))) });
    strs.forEach((el, i) => {
      const x0 = sx(i), x1 = sx(i) * 1.3, bow = i === pick ? 4 * b * reach : 0;
      el.setAttribute("d", open([P(x0, -1, 16), P((x0 + x1) / 2 + bow, -1 - bow, 40), P(x1, -1, 64)]));
    });
  }

  const L = register(stage, (_dt, now) => { draw(now); return !tdone(tilt, now) || !tdone(pl, now); });
  bag.add(L.unregister);

  const mids = Array.from({ length: N }, (_, i) => P0(sx(i) * 1.15, 0, 40));
  function hit([x, y]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - x); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - y) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    pick = a < 0 ? FAV : a;
    tset(tilt, a < 0 ? REST : ((a - 3) / 3) * MAX * reach, now, 0);
    tset(pl, a < 0 ? 0.3 : 1, now, 0);
    strs.forEach((el, k) => { el.classList.toggle("hi", k === pick); el.classList.toggle("lo", k !== pick); });
    read.textContent = a < 0 ? "rest" : "str " + (a + 1);
    L.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; act = -3; setActive(-1); }, destroy: bag.dispose };
}

hairline({
  name: "lyre",
  means: "A lyre: the string nearest the pointer lights and bows as if plucked, and the lyre tips toward that side.",
  rules: [1, 4, 5, 9],
  range: [0.3, 1, 1],
  tour: [[233, 177], [167, 143], [200, 160], null],
  mount,
});
