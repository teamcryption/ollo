/**
 * Weight plates: four plates of falling size standing in a rack, each on
 * its own peg. The pointer picks a plate by where it stands: it slides up
 * off its peg, the plates beside it lift a little, staggered from it. At
 * rest one plate stands raised, bright. The slider is the stagger.
 */
const {
  Cam, fit, hull, poly, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const RS = [34, 30, 25, 19], GAP = 26, BZ = 6, LIFT = 22, FAV = 1, CX = 40, Y1 = RS.length * GAP + 8;
const ring = (cx, y, cz, R, n = 36) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [cx + R * Math.cos(t), y, cz + R * Math.sin(t)]; });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0, -6, 0], [80, Y1 + 6, 0], [80, -6, 0], [0, Y1 + 6, 0], [CX, 8, BZ + 2 * 34 + LIFT], [CX, Y1, BZ + 2 * 19 + LIFT]], 200, 168);
  const P = proj(C), g = mk("g", {}, svg);
  const [br, bi] = rings(0, -6, 80, Y1 + 6, 6, 2);
  const base = solid(g);
  base.sil.setAttribute("d", poly(hull(ringAt(P, br, 0).concat(ringAt(P, br, BZ)))));
  base.cr.setAttribute("d", poly(ringAt(P, bi, BZ)));

  const items = RS.map((R, k) => {
    const y = 8 + k * GAP, grp = mk("g", {}, g);
    const s = solid(grp), hole = mk("path", { class: "nf lo" }, grp);
    const peg = mk("path", { class: "nf" }, grp);
    return { k, R, y, s, hole, peg, z: tween(k === FAV ? LIFT * 0.7 : k === 3 ? 4 : 0), last: NaN };
  });
  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const cz = BZ + it.R + h, pr = (pts) => pts.map((q) => P(q[0], q[1], q[2]));
    it.s.sil.setAttribute("d", poly(hull(pr(ring(CX, it.y - 2.5, cz, it.R).concat(ring(CX, it.y + 2.5, cz, it.R))))));
    it.s.cr.setAttribute("d", poly(pr(ring(CX, it.y + 2.5, cz, it.R - 4))));
    it.hole.setAttribute("d", poly(pr(ring(CX, it.y + 2.5, cz, 4, 20))));
    const pz = BZ + it.R;
    it.peg.setAttribute("d", poly(hull(pr(ring(CX, it.y + 2.6, pz, 2.6, 16).concat(ring(CX, it.y + 6, pz, 2.6, 16))))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(CX, it.y, BZ + it.R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : k === 3 ? 4 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "plate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "plates",
  means: "Four weight plates of falling size on a rack: the plate under the pointer slides up off its peg, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[263, 132], [229, 149], [161, 207], null],
  mount,
});
