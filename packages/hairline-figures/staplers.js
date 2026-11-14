/**
 * Staplers: three desk staplers side by side on a blotter, each a base with
 * an arm hinged at the back. The pointer picks a stapler by where it stands:
 * its arm swings open on the hinge, and the arms beside it lift a little,
 * staggered from it. At rest one arm stands ajar, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 26, BW = 14, L = 60, OPEN = 58, FAV = 0, REST = [16, 0, 5];
const X1 = (N - 1) * STEP + BW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-8, -8, -3], [X1 + 8, -8, -3], [X1 + 8, L + 8, -3], [-8, L + 8, -3], [0, 0, 58], [X1, 0, 58]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-8, -8, X1 + 8, L + 8, 4, 2);
  put(solid(g), prism(P, front, pr, pi, -3, 0));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [br, bi] = rings(x, 0, x + BW, L, 4, 1.2);
    put(solid(grp), prism(P, front, br, bi, 0, 4));
    // the anvil: a small plate near the base's front
    mk("path", { class: "nf lo", d: poly(rrectAt(P, x + 3, L - 14, x + BW - 3, L - 5, 2, 4)) }, grp);
    const arm = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, arm, cr, a: tween(REST[k]), last: NaN });
  }
  function rrectAt(P, x0, y0, x1, y1, r, z) { return rrect(x0, y0, x1, y1, r, 4).map((q) => P(q.u, q.v, z)); }

  // the arm: a rounded bar from the hinge, turned up by a degrees about the back
  const HY = 4, HZ = 6;
  function armPts(x, a, z0, z1, ins = 0) {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), out = [];
    const ring = rrect(x + 1 + ins, 0 + ins, x + BW - 1 - ins, L - 2 - ins, 4 - ins, 4);
    for (const z of z1 === undefined ? [z0] : [z0, z1]) for (const q of ring) {
      const dy = q.v - HY, dz = z - HZ;
      out.push(P(q.u, HY + dy * c - dz * s, HZ + dy * s + dz * c));
    }
    return out;
  }
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    it.arm.setAttribute("d", poly(hull(armPts(it.x, a, 4, 10))));
    const top = armPts(it.x, a, 10, undefined, 1.4);
    it.cr.setAttribute("d", poly(top));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + BW / 2, L / 2, 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 6 : 0;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.arm.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "no " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "staplers",
  means: "Three staplers on a blotter: the arm of the one under the pointer swings open on its hinge, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[154, 186], [200, 209], [246, 232], null],
  mount,
});
