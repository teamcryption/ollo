/**
 * Pool skimmer: a leaf net's hoop rests at the pool's edge, its long pole
 * jointed at the hoop's neck. The pointer swings the pole down flat, as if
 * skimming the surface. At rest the pole leans back, bright. The slider is
 * how far it swings.
 */
const { Cam, fit, hull, poly, open, proj, rings, prism, facing, tween, tset, tval, tdone, mk, put, solid, register, pointer, disposer, rad } = HL;

const BL = 40, BW = 17, HX = BL + 4, HZ = 2, SL = 54, SR = 2.4, REST = 115;
function shaft(a) {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  return (t, y, n) => [HX + c * t - s * n, y, HZ + s * t + c * n];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = 55 + 60 * value;
  const C = Cam(45, 0.5, 3.75);
  const ext = [[-4, -BW - 4, 0], [BL + 4, BW + 4, 0]];
  for (const a of [0, REST]) { const f = shaft(a); ext.push(f(SL + 4, -10, 0), f(SL + 4, 10, 0)); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the hoop: an open oval frame with a mesh across it, and its neck
  const hoop = [];
  for (let i = 0; i < 40; i++) { const q = (i / 40) * Math.PI * 2; hoop.push([BL / 2 + (BL / 2) * Math.cos(q), BW * Math.sin(q)]); }
  mk("path", { d: poly(hoop.map(([x, y]) => P(x, y, 0))), class: "nf" }, g);
  mk("path", { d: poly(hoop.map(([x, y]) => P(BL / 2 + (x - BL / 2) * 0.9, y * 0.88, 0))), class: "nf lo" }, g);
  let mesh = "";
  for (let k = 1; k < 6; k++) { const x = (k / 6) * BL, h = BW * Math.sqrt(1 - ((x - BL / 2) / (BL / 2)) ** 2) * 0.88; mesh += open([P(x, -h, 0), P(x, h, 0)]) + " "; }
  for (let k = -2; k <= 2; k++) { const y = (k / 3) * BW, w = (BL / 2) * Math.sqrt(1 - (y / BW) ** 2) * 0.9; mesh += open([P(BL / 2 - w, y, 0), P(BL / 2 + w, y, 0)]) + " "; }
  mk("path", { d: mesh, class: "nf lo" }, g);
  const [nr, ni] = rings(BL - 1, -3, HX + 1, 3, 1.5, 0.6);
  put(solid(g), prism(P, front, nr, ni, 0, HZ + 2));
  const sg = mk("g", {}, g);
  const tube = mk("path", { class: "sil" }, sg), seam = mk("path", { class: "nf lo" }, sg), grip = mk("path", { class: "sil" }, sg);
  const tw = tween(REST);
  let last = NaN;
  const ring = (f, t, r) => { const o = []; for (let i = 0; i < 12; i++) { const q = (i / 12) * Math.PI * 2; o.push(P(...f(t, r * Math.cos(q), r * Math.sin(q)))); } return o; };
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = shaft(a);
    tube.setAttribute("d", poly(hull(ring(f, 0, SR + 1).concat(ring(f, SL, SR)))));
    seam.setAttribute("d", open([P(...f(SL * 0.5, 0, SR)), P(...f(SL * 0.5 + 0.01, 0, -SR))].concat()) + " " + open(ring(f, SL * 0.5, SR + 0.4)));
    const gp = [];
    for (const y of [-3, 3]) for (const t of [SL, SL + 8]) for (const n of [-2, 2]) gp.push(P(...f(t, y, n)));
    grip.setAttribute("d", poly(hull(gp)));
  }
  [tube, grip].forEach((e) => e.classList.add("hi"));

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rp = ext.map((p) => P(...p)).concat([P(...shaft(REST)(SL, 0, 0))]);
  const xs = rp.map((p) => p[0]), ys = rp.map((p) => p[1]);
  const box = [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6];
  let on = false;
  function setOn(v) {
    on = v;
    tset(tw, on ? REST - most : REST, performance.now(), 0);
    read.textContent = on ? "swing " + Math.round(most) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  const hit = ([sx, sy]) => sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];
  bag.add(pointer(stage, { move: (p) => { if (hit(p) !== on) setOn(hit(p)); }, leave: () => { if (on) setOn(false); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = 55 + 60 * v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "pooltoy",
  means: "A pool skimmer net with its pole jointed at the hoop: the pointer swings the pole down flat, as if skimming the water.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[89, 28], [100, 110], [92, 198], null],
  mount,
});
