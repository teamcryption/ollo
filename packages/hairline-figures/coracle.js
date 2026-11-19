/**
 * Coracle: a round woven boat on a ring of water, a seat plank across its
 * bowl and one long paddle resting on the rim. The pointer stands on the
 * water and the paddle sweeps round its rim pivot to reach for it, on a
 * spring. At rest the paddle trails at a slant, its blade bright. The
 * slider is how far the paddle may sweep.
 *
 * The pattern: one part turning to face the pointer.
 */
const {
  Cam, circ, clamp, fit, fillet, hull, poly, proj, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, register,
} = HL;

const RB = 20, RT = 30, H = 14, QX = 22, QY = 22, QZ = H, PITCH = 0.42, REST = 1.25;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-RT, -RT, 0], [QX + 75, QY + 75, -25], [QX + 75, -30, 0], [-30, QY + 75, 0], [0, 0, H + 6]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  mk("path", { d: poly(ringAt(P, circ(RT + 22, 48), 0)), class: "dash nf" }, g);
  const ring = (r, z) => ringAt(P, circ(r, 40), z);
  mk("path", { d: poly(hull(ring(RB, 0).concat(ring(RT, H)))), class: "sil" }, g);
  mk("path", { d: poly(ring(RT - 2.2, H - 0.4)), class: "nf lo" }, g);
  // the seat plank across the bowl, and a few woven ribs on the outside
  let d = seg(P(-RT + 3, -4, H - 3), P(RT - 3, -4, H - 3)) + seg(P(-RT + 3, 4, H - 3), P(RT - 3, 4, H - 3));
  for (const t of [0.45, 0.85, 1.25]) d += seg(P(RB * Math.cos(t), RB * Math.sin(t), 0.5), P(RT * Math.cos(t), RT * Math.sin(t), H - 0.8));
  mk("path", { d, class: "nf lo" }, g);

  const shaft = mk("path", { class: "sil" }, g), blade = mk("path", { class: "sil" }, g), grip = mk("path", { class: "nf lo" }, g);
  const yaw = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const ca = Math.cos(a), sa = Math.sin(a), cp = Math.cos(PITCH), sp = Math.sin(PITCH);
    const pt = (s, w) => P(QX + s * cp * ca - w * sa, QY + s * cp * sa + w * ca, QZ - s * sp);
    shaft.setAttribute("d", poly([pt(-32, -1.3), pt(40, -1.3), pt(40, 1.3), pt(-32, 1.3)]));
    blade.setAttribute("d", poly(fillet([pt(36, -2), pt(46, -8), pt(78, -8), pt(78, 8), pt(46, 8), pt(36, 2)], [1, 3, 4, 4, 3, 1])));
    grip.setAttribute("d", seg(pt(-32, -6), pt(-32, 6)) + seg(pt(50, 0), pt(74, 0)));
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function setAim(p) {
    if (!p) {
      yaw.t = REST; act = null;
      read.textContent = "rest";
    } else {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.hypot(x - QX, y - QY) < 6) return;
      let dd = Math.atan2(y - QY, x - QX) - REST;
      dd = Math.atan2(Math.sin(dd), Math.cos(dd));
      yaw.t = REST + clamp(dd, -reach, reach);
      act = p;
      const deg = Math.round((((yaw.t * 180) / Math.PI) % 360 + 360) % 360);
      read.textContent = String(deg).padStart(3, "0") + "°";
    }
    blade.classList.add("hi");
    B.wake();
  }
  setAim(null);
  draw(yaw.x);
  bag.add(pointer(stage, { move: setAim, leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = (v * Math.PI) / 180; if (act) setAim(act); }, destroy: bag.dispose };
}

hairline({
  name: "coracle",
  means: "A round woven coracle on the water: its long paddle sweeps round the rim to reach for the pointer, as far as the slider lets it.",
  rules: [1, 3, 5, 8],
  range: [20, 80, 120],
  tour: [[341, 154], [30, 97], [341, 154], null],
  mount,
});
