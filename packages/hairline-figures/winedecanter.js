/**
 * Decanter: a wide-bellied wine decanter with a long neck and a ball stopper,
 * on a round coaster. The pointer over the coaster tips the decanter on the
 * edge of its foot to pour; leaving stands it back up with a slight lean. At
 * rest the stopper is bright; pouring gives the bright to the belly.
 *
 * The pattern: one lathed body turned about a fixed pivot; the hit is the
 * coaster's rest disc, which never moves.
 */
const {
  Cam, circ, clamp, fit, proj, hull, poly, prism, facing, rad, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RC = 50, Z0 = 4, FOOT = 17, REST = 4;
const BULB = [[17, 0], [25, 5], [28, 12], [25, 21], [15, 29], [6, 33]];
const NECK = [[5.2, 31], [4.6, 50], [5.6, 58], [6.6, 61]];
const STOP = [[2.6, 61], [4.8, 64], [5.8, 68], [4.4, 72], [1, 74]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.98);
  fit(C, [[-RC, -RC, 0], [RC, RC, 0], [RC, -RC, 0], [-RC, RC, 0], [0, 0, Z0 + 78], [40, 0, Z0 + 66]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(RC, 64), circ(RC - 2, 64), 0, Z0));
  const pour = mk("path", { class: "nf lo" }, g);
  const bulb = mk("path", { class: "sil" }, g), neck = mk("path", { class: "sil" }, g), lip = mk("path", { class: "nf lo" }, g);
  const stop = mk("path", { class: "sil hi" }, g);
  const lathe = (prof) => prof.map(([r, z]) => circ(r, 32).map((q) => [q.u, q.v, z]));
  const parts = [[bulb, lathe(BULB)], [neck, lathe(NECK)], [stop, lathe(STOP)]];
  const lipRing = lathe([[6.6, 61]])[0];
  const tilt = tween(REST);
  let last = NaN;

  function xf([x, y, z], a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), dx = x - FOOT;
    return P(FOOT + dx * c + z * s, y, Z0 + Math.max(0, -dx * s + z * c));
  }

  function draw(a) {
    if (a === last) return;
    last = a;
    for (const [el, rs] of parts) { const pts = []; for (const r of rs) for (const p of r) pts.push(xf(p, a)); el.setAttribute("d", poly(hull(pts))); }
    lip.setAttribute("d", poly(lipRing.map((p) => xf(p, a))));
    const f = clamp((a - 22) / 20, 0, 1);
    if (f > 0) {
      const top = xf([6.6, 0, 61], a), r = 3 + 9 * f;
      pour.setAttribute("d", seg(top, P(RC - 14, 0, Z0)) + poly(circ(r, 24).map((q) => P(RC - 14 + q.u * 0.7, q.v, Z0 + 0.1))));
    } else pour.setAttribute("d", "");
  }

  const B = register(stage, (_dt, now) => { draw(tval(tilt, now)); return !tdone(tilt, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(tilt, v ? max : REST, performance.now(), 0);
    read.textContent = v ? "pour " + Math.round(max) + "°" : "rest";
    bulb.classList.toggle("hi", v);
    stop.classList.toggle("hi", !v);
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, Z0); setOn(Math.hypot(x, y) < RC + 12); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "winedecanter",
  means: "A wine decanter on a coaster: the pointer tips it on its foot to pour, and leaving stands it back up.",
  rules: [1, 3, 5, 8],
  range: [30, 40, 50],
  tour: [[200, 163], [255, 215], [140, 160], null],
  mount,
});
