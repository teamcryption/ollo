/**
 * Dehydrator: a round food dehydrator, a fan base with a dial, four mesh
 * trays stacked on it, each with its airflow hole, and a vented lid. The
 * pointer picks a tray by height: everything above it lifts off, opening a
 * gap so the tray's mesh and slices show; the lift spreads from the tray.
 * At rest the stack is cracked open above one tray, bright. The slider is
 * how far the stack lifts.
 *
 * The pattern: one of many in a single column; the hit is on each tray's
 * rest band, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, R = 40, BZ = 12, H = 9, LH = 7, FAV = 1, REST = 0.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;
  const C = Cam(45, 0.5, 2.3);
  const top = BZ + N * H + LH + 30;
  fit(C, [[-R - 3, -R - 3, 0], [R + 3, R + 3, 0], [R + 3, -R - 3, 0], [-R - 3, R + 3, 0], [-R, -R, top], [R, R, top]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the base: the fan housing, with a dial on the side facing us
  put(solid(g), prism(P, front, circ(R + 2, 64), circ(R + 0.5, 64), 0, BZ));
  const dial = [];
  for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; dial.push(P((R + 2) * 0.7071 + 2.5 * Math.cos(a) * 0.7071, (R + 2) * 0.7071 - 2.5 * Math.cos(a) * 0.7071, BZ / 2 + 2.5 * Math.sin(a))); }
  mk("path", { class: "nf lo", d: poly(dial) }, g);

  // trays, then the lid, each its own group so the upper one covers the lower
  const parts = [];
  for (let j = 0; j <= N; j++) {
    const grp = mk("g", {}, g), s = solid(grp);
    const marks = mk("path", { class: "nf lo" }, grp);
    parts.push({ j, s, marks, o: tween(0), last: NaN });
  }

  function draw(p, o) {
    if (o === p.last) return;
    p.last = o;
    const z0 = BZ + p.j * H + o;
    if (p.j < N) {
      put(p.s, prism(P, front, circ(R, 64), circ(R - 1.6, 64), z0, z0 + H - 0.6));
      // the mesh floor: the airflow hole and a ring of slices
      let d = poly(ringAt(P, circ(7, 32), z0 + 1.5));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + p.j, cx = 22 * Math.cos(a), cy = 22 * Math.sin(a);
        d += poly(ringAt(P, circ(6, 20).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy })), z0 + 2));
      }
      p.marks.setAttribute("d", d);
    } else {
      // the lid: a low taper with a vent knob
      const foot = ringAt(P, circ(R + 1, 64), z0), crown = ringAt(P, circ(R - 6, 64), z0 + LH);
      p.s.sil.setAttribute("d", poly(hull(foot.concat(crown))));
      p.s.cr.setAttribute("d", poly(crown));
      p.marks.setAttribute("d", poly(hull(ringAt(P, circ(6, 24), z0 + LH).concat(ringAt(P, circ(6, 24), z0 + LH + 3)))));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of parts) { draw(p, tval(p.o, now)); if (!tdone(p.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: each tray's band at rest, picked by screen y
  const mids = [];
  for (let j = 0; j < N; j++) mids.push(P(0, R, BZ + j * H + H / 2));
  const cx = P(0, 0, 0)[0];
  function hit([sx, sy]) {
    if (Math.abs(sx - cx) > R * 2.3) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, j) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = j; } });
    return bd < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), at = a < 0 ? FAV : a, lift = a < 0 ? gap * REST : gap;
    act = a;
    parts.forEach((p) => {
      tset(p.o, p.j > at ? lift : 0, now, Math.abs(p.j - at) * 40);
      p.s.sil.classList.toggle("hi", p.j === at);
    });
    read.textContent = a < 0 ? "rest" : "tray " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gap = clamp(v, 6, 30); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "dehydrator",
  means: "A round food dehydrator: the stack lifts off above the tray under the pointer, opening it to show the slices drying.",
  rules: [1, 2, 3, 5, 6],
  range: [6, 18, 30],
  tour: [[135, 249], [135, 231], [135, 195], null],
  mount,
});
