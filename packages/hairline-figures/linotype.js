/**
 * Linotype: a typesetting machine on its plinth: the main frame, the keyboard
 * tray in front with its rows of keys, the metal pot at the side and, on top,
 * the slanted magazine with its matrix channels. The pointer swings the
 * magazine up on its front hinge, further the nearer the pointer comes to
 * the keyboard. At rest the magazine is bright. The slider is the swing.
 *
 * The pattern: one part tilting to follow the pointer (spring).
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, seg, spring, stepS, unproj, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const HX = 34, HZ = 70, L = 50, T = 6, Y0 = 6, Y1 = 54, REST = 28, MAXA = 92;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 1.8);
  const corner = (a, s, t, y) => [HX - s * L * Math.cos(rad(a)) + t * T * Math.sin(rad(a)), y, HZ + s * L * Math.sin(rad(a)) + t * T * Math.cos(rad(a))];
  const ext = [];
  for (const a of [REST, MAXA]) for (const y of [Y0, Y1]) ext.push(corner(a, 1, 1, y), corner(a, 1, 0, y));
  fit(C, [[-4, -4, 0], [58, -4, 0], [58, 72, 0], [-4, 72, 0], ...ext], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(-4, -4, 58, 72, 0, 6, 5, 2);
  box(4, 6, 30, 54, 6, HZ, 4, 1.6);
  // the keyboard tray and its keys
  box(30, 12, 50, 48, 30, 36, 3, 1.4);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) place(flatDot(g, C, 1.4, "dot off"), P(34 + r * 6, 16 + c * 6, 36));
  // the metal pot, round, at the side
  box(8, 56, 24, 70, 6, 40, 8, 1.6);
  box(6, 54, 26, 72, 40, 44, 9, 1.4);
  // the line of matrices waiting in the assembler, over the keyboard
  mk("path", { class: "nf lo", d: seg(P(32, 14, 48), P(32, 46, 48)) + seg(P(32, 14, 44), P(32, 46, 44)) }, g);

  const mag = solid(g), chans = mk("path", { class: "nf lo" }, g);
  mag.sil.classList.add("hi");
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const s of [0, 1]) for (const t of [0, 1]) for (const y of [Y0, Y1]) pts.push(P(...corner(a, s, t, y)));
    const h = hull(pts);
    mag.sil.setAttribute("d", poly(fillet(h, h.map(() => 3))));
    const top = [corner(a, 0.04, 1, Y0 + 2), corner(a, 0.96, 1, Y0 + 2), corner(a, 0.96, 1, Y1 - 2), corner(a, 0.04, 1, Y1 - 2)].map((q) => P(...q));
    mag.cr.setAttribute("d", poly(fillet(top, [2, 2, 2, 2])));
    let d = "";
    for (let j = 1; j < 10; j++) { const y = Y0 + 2 + (j * (Y1 - Y0 - 4)) / 10; d += seg(P(...corner(a, 0.12, 1, y)), P(...corner(a, 0.9, 1, y))); }
    chans.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function setAt(p) {
    let f = null;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -30 && x < 90 && y > -30 && y < 100) f = clamp((x + 10) / 60, 0.25, 1);
    }
    act = f;
    ang.t = f === null ? REST : Math.min(MAXA, REST + f * swing);
    read.textContent = f === null ? "rest" : Math.round(ang.t) + "°";
    B.wake();
  }
  setAt(null);
  bag.add(pointer(stage, { move: (p) => setAt(p), leave: () => setAt(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (act !== null) { ang.t = Math.min(MAXA, REST + act * swing); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "linotype",
  means: "A linotype machine: the pointer swings its slanted matrix magazine up on the hinge, further the nearer it comes to the keys.",
  rules: [1, 3, 5, 8],
  range: [20, 45, 64],
  tour: [[209, 205], [228, 253], [196, 280], null],
  mount,
});
