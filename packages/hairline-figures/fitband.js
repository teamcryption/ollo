/**
 * Fitness band: a tracker pod with a screen and two straps lying open on the
 * desk, one strap punched with holes, the other ending in its clasp. The
 * pointer picks a strap by where it stands: that strap swings up about the
 * pod as if wrapping a wrist. At rest the clasp strap is a little raised,
 * bright. The slider is how far the strap swings.
 */
const { Cam, fit, hull, poly, proj, rings, rrect, ringAt, facing, prism, circ, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, rad } = HL;

const PX = 13, ZP = 1.4, SL = 40, SW = 6, ST = 2.6, REST = [20, 52];
const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let openA = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-PX - SL, -9, 0], [PX + SL, 9, 0], [-PX - SL, 9, 0], [PX + SL, -9, 0], [PX, 0, SL + 4], [-PX, 0, SL + 4], [0, 0, SL * 0.8]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // a strap, in its own frame: u runs out from the pod, y across, w up from the pivot
  const plate = rrect(-3, -SW, SL, SW, 5, 10), crease = rrect(-1, -SW + 1.2, SL - 1.2, SW - 1.2, 3.8, 10);
  const buckle = rrect(SL - 9, -SW - 1.6, SL + 1, SW + 1.6, 2.5, 6), slot = rrect(SL - 6.5, -SW + 0.8, SL - 2, SW - 0.8, 1.2, 6);
  const straps = [-1, 1].map((s, k) => ({ s, k, el: solid(g), extra: null, a: tween(REST[k]), last: NaN }));
  straps.forEach((st) => (st.extra = mk("path", { class: "nf lo" }, st.el.g)));
  const pod = solid(g);
  const [pr, pi] = rings(-PX - 1, -8, PX + 1, 8, 7.5, 1.5);
  put(pod, prism(P, front, pr, pi, 0, 7));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(-8, -4.5, 8, 4.5, 3, 6), 7)) }, pod.g);
  g.appendChild(straps[1].el.g);

  function drawStrap(st, a) {
    if (a === st.last) return;
    st.last = a;
    const c = Math.cos(rad(a)), sn = Math.sin(rad(a)), s = st.s;
    const W = (u, y, w) => P(s * (PX + u * c - w * sn), y, ZP + u * sn + w * c);
    const ring = (rg, w) => rg.map((q) => W(q.u, q.v, w));
    const pts = ring(plate, -ST / 2).concat(ring(plate, ST / 2));
    const d = poly(hull(s > 0 ? pts.concat(ring(buckle, -ST / 2 - 0.4), ring(buckle, ST / 2 + 1)) : pts));
    st.el.sil.setAttribute("d", d);
    st.el.cr.setAttribute("d", poly(ring(s > 0 ? rrect(-1, -SW + 1.2, SL - 10, SW - 1.2, 3.8, 10) : crease, ST / 2)));
    let marks = "";
    if (s < 0) for (const u of [16, 21, 26, 31]) marks += poly(ring(disc(u, 0, 1.1), ST / 2));
    else marks = poly(ring(buckle, ST / 2 + 1)) + poly(ring(slot, ST / 2 + 1));
    st.extra.setAttribute("d", marks);
    if (s < 0) { if (a > 80) pod.g.after(st.el.g); else g.insertBefore(st.el.g, g.firstChild); }
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    straps.forEach((st) => { drawStrap(st, tval(st.a, now)); if (!tdone(st.a, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);
  const mids = [-1, 1].map((s) => P(s * (PX + SL / 2), 0, 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 80 ? best : -1;
  }
  let act = -2;
  function apply() {
    const now = performance.now();
    straps.forEach((st) => tset(st.a, act < 0 ? REST[st.k] : st.k === act ? openA : 2, now, 0));
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    apply();
    straps.forEach((st) => st.el.sil.classList.toggle("hi", st.k === (a < 0 ? 1 : a)));
    read.textContent = a < 0 ? "rest" : a === 1 ? "clasp" : "holes";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { openA = v; if (act >= 0) { apply(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "fitband",
  means: "A fitness band lying open: the strap under the pointer swings up about the tracker pod, as if wrapping a wrist.",
  rules: [1, 4, 5, 8],
  range: [60, 110, 140],
  tour: [[284, 245], [200, 212], [120, 185], null],
  mount,
});
