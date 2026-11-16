/**
 * Fish smoker: a stovetop smoker box on a hob plate, a fish on the rack
 * inside, a flat lid in its rails. Over the box, the lid slides open along
 * the rails to show the fish. At rest the lid is open a crack, bright. The
 * slider is how far it slides.
 *
 * The pattern: one part answering on a 700ms tween (open / closed).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 100, Wd = 56, H = 22, Z0 = 4, SL = 70;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-10, -10, 0], [L + SL + 4, Wd + 10, 0], [L + SL + 4, -4, Z0 + H + 6], [-10, Wd + 10, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-10, -10, L + 10, Wd + 10, 10, 2);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));
  const [br, bi] = rings(0, 0, L, Wd, 6, 3);
  put(solid(g), prism(P, front, br, bi, Z0, Z0 + H));
  // the rack, then the fish lying on it
  const rz = Z0 + H - 6;
  let d = "";
  for (let i = 1; i < 8; i++) { const a = P(i * L / 8, 4, rz), b = P(i * L / 8, Wd - 4, rz); d += "M" + a[0].toFixed(2) + " " + a[1].toFixed(2) + "L" + b[0].toFixed(2) + " " + b[1].toFixed(2); }
  mk("path", { d, class: "nf lo" }, g);
  const fish = [];
  for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI * 2; fish.push([50 + 30 * Math.cos(t), Wd / 2 + 11 * Math.sin(t) * (Math.cos(t) > 0 ? 1 : 0.8), rz + 1]); }
  mk("path", { d: poly(fish.map((p) => P(...p))), class: "nf" }, g);
  mk("path", { d: poly([[18, Wd / 2, rz + 1], [6, Wd / 2 - 10, rz + 1], [6, Wd / 2 + 10, rz + 1]].map((p) => P(...p))), class: "nf" }, g);
  const eye = P(70, Wd / 2 - 3, rz + 1);
  mk("ellipse", { cx: eye[0], cy: eye[1], rx: 1.4, ry: 0.8, class: "nf" }, g);

  const lid = mk("g", {}, g), lsol = solid(lid), knob = solid(lid);
  lsol.sil.classList.add("hi");
  const lr = rrect(0, 0, L, Wd, 6, 4), li = rrect(2, 2, L - 2, Wd - 2, 4, 4);
  const tw = tween(0.12);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const dx = SL * amt * s, sh = (r) => r.map((q) => ({ ...q, u: q.u + dx }));
    put(lsol, prism(P, front, sh(lr), sh(li), Z0 + H, Z0 + H + 2.5));
    const [kr, ki] = rings(dx + 14, Wd / 2 - 5, dx + 24, Wd / 2 + 5, 3, 1);
    put(knob, prism(P, front, kr, ki, Z0 + H + 2.5, Z0 + H + 6));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0.12, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  const bb = ringAt(P, br, 0).concat(ringAt(P, br, Z0 + H + 6));
  const X0 = Math.min(...bb.map((q) => q[0])), X1 = Math.max(...bb.map((q) => q[0])), Y0 = Math.min(...bb.map((q) => q[1])), Y1 = Math.max(...bb.map((q) => q[1]));
  const hit = ([sx, sy]) => sx > X0 - 4 && sx < X1 + 4 && sy > Y0 - 4 && sy < Y1 + 4;
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "fishscaler",
  means: "A stovetop smoker box with a fish on its rack: over the box, the lid slides open along its rails.",
  rules: [1, 4, 5, 6],
  range: [0.5, 1, 1],
  tour: [[121, 76], [185, 147], [160, 120], null],
  mount,
});
