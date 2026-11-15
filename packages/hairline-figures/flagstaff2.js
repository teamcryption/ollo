/**
 * Stamp rack: five rubber stamps standing in a rack with a back board,
 * each a rubber block, a stem and a round knob. The pointer picks a stamp
 * by where it stands: it tips forward out of its slot, ready to be taken,
 * and the stamps beside it tip a little, staggered from it. At rest one
 * stamp leans, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), a tilt on a pivot.
 */
const {
  Cam, circ, fit, facing, hull, poly, proj, rings, prism, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 24, Y = 16, ZB = 7, FAV = 3, TIP = 52;
const W = (N - 1) * STEP + 28, xs = [...Array(N)].map((_, k) => 14 + k * STEP);
const REST = [0, 6, 0, 22, 4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [W, 2 * Y, 0], [W, 0, 0], [0, 2 * Y + 30, 0], [0, 0, 46], [W, 0, 46], [W, 2 * Y + 30, 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, 4, 1.8, 1);
  put(solid(g), prism(P, front, br, bi, 0, 30));
  const [sr, si] = rings(0, 2, W, 2 * Y, 4, 1.8);
  put(solid(g), prism(P, front, sr, si, 0, ZB));
  for (const x of xs) mk("path", { d: poly(rrect(x - 8.5, Y - 6.5, x + 8.5, Y + 6.5, 1.5, 3).map((q) => P(q.u, q.v, ZB))), class: "nf lo" }, g);

  const items = xs.map((x, k) => {
    const grp = mk("g", {}, g);
    return { k, x, block: solid(grp), stem: solid(grp), knob: mk("path", { class: "sil" }, grp), a: tween(REST[k]), last: NaN };
  });

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const T = (u, v, z) => { const dy = v, dz = z - ZB; return P(it.x + u, Y + dy * c + dz * s, ZB - dy * s + dz * c); };
    const at = (ring, z) => ring.map((q) => T(q.u, q.v, z));
    const part = (el, ring, inner, z0, z1) => {
      el.sil.setAttribute("d", poly(hull(at(ring, z0).concat(at(ring, z1)))));
      el.cr.setAttribute("d", poly(at(inner, z1)));
    };
    part(it.block, rrect(-7.5, -5.5, 7.5, 5.5, 1.6, 4), rrect(-6.5, -4.5, 6.5, 4.5, 0.8, 4), ZB, ZB + 6);
    part(it.stem, circ(2.6, 20), circ(1.8, 20), ZB + 6, ZB + 22);
    const pts = [];
    for (const [r, z] of [[3, 0], [5.4, 2.5], [6, 5], [5.4, 7.5], [3.5, 9.5], [1.5, 10.5]]) pts.push(...at(circ(r, 24), ZB + 22 + z));
    it.knob.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, ZB + 15));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? TIP : dd === 1 ? 20 : dd === 2 ? 7 : 0;
      tset(it.a, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.knob.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stamp " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "flagstaff2",
  means: "A rack of five rubber stamps: the stamp under the pointer tips forward out of its slot, and the stamps beside it tip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 116], [222, 151], [294, 187], null],
  mount,
});
