/**
 * Race car: a low open-wheel racer on four fat tyres, a slim tub tapering
 * to the nose, a front wing and a tall rear wing between two end plates.
 * The pointer over the car opens the drag reduction flap: the upper element
 * of the rear wing swings flat on its trailing-edge pivot, on a spring,
 * opening the slot. At rest the flap is shut, bright. The slider is how far
 * it opens.
 *
 * The pattern: one part answering, hit on the rest pose's screen box.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 9, WW = 8, SPAN = 27, PIV = [-62, 44], CH = 25, SHUT = rad(-72);
const WHEELS = [[-30, -19], [30, -19], [-30, 19], [30, 19]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-62, -24, 0], [52, 24, 0], [52, -24, 0], [-62, 24, 0], [-66, -28, 49], [-38, 28, 49]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = ([u, v]) => {
    const pts = [];
    for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; for (const dv of [-WW / 2, WW / 2]) pts.push(P(u + WR * Math.cos(t), v + Math.sign(v) * dv, WR + WR * Math.sin(t))); }
    return poly(hull(pts));
  };
  const box = (x0, y0, x1, y1, r, b, z0, z1, par = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  WHEELS.filter((w) => w[1] < 0).forEach((w) => mk("path", { d: wheel(w), class: "sil" }, g));
  // rear wing: far end plate, pillar, main plane, flap, near end plate
  const plate = (y) => mk("path", { d: poly(hull([[-66, 10], [-38, 10], [-38, 46], [-66, 48]].flatMap(([x, z]) => [P(x, y, z), P(x, y + 1, z)]))) }, g);
  plate(-SPAN - 1);
  mk("path", { d: seg(P(-48, 0, 12), P(-50, 0, 14)), class: "nf" }, g);
  const main = [[-40, 13], [-64, 16], [-64, 18], [-42, 15]];
  mk("path", { d: poly(hull(main.flatMap(([x, z]) => [P(x, -SPAN, z), P(x, SPAN, z)]))) }, g);
  const flap = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g);
  plate(SPAN);
  // tub, sidepods, nose, front wing
  const tub = [];
  for (const [x, w, z] of [[-42, 8, 13], [8, 8, 15], [50, 3, 7]]) for (const y of [-w, w]) tub.push(P(x, y, 3), P(x, y, z));
  box(-24, -15, 6, 15, 5, 1.5, 3, 11);
  mk("path", { d: poly(hull(tub)) }, g);
  mk("path", { d: poly(hull([[-6, -5], [10, -5], [12, 0], [10, 5], [-6, 5]].map(([x, y]) => P(x, y, 15)))), class: "nf lo" }, g);
  box(42, -22, 52, 22, 2, 0.6, 1.5, 3.5);
  WHEELS.filter((w) => w[1] > 0).forEach((w) => mk("path", { d: wheel(w), class: "sil" }, g));
  const sp = spring(SHUT);
  let last = NaN, over = false;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - last) < 0.0005) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), at = (d, h) => [PIV[0] + d * c - h * s, PIV[1] + d * s + h * c];
    const sec = [at(0, 0), at(CH, 0), at(CH, 1.6), at(0, 1.2)];
    flap.setAttribute("d", poly(hull(sec.flatMap(([x, z]) => [P(x, -SPAN, z), P(x, SPAN, z)]))));
    const e = at(CH, 1.6);
    lip.setAttribute("d", seg(P(e[0], -SPAN, e[1]), P(e[0], SPAN, e[1])));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const bb = [[-64, -24, 0], [52, 24, 0], [52, -24, 0], [-64, 24, 0], [-66, -28, 48], [-38, 28, 46]].map((q) => P(...q));
  const xs = bb.map((q) => q[0]), ys = bb.map((q) => q[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];

  function retarget() {
    sp.t = over ? SHUT + rad(34 + 48 * reach) : SHUT;
    read.textContent = over ? "drs " + Math.round(((sp.t - SHUT) * 180) / Math.PI) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { over = sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]; retarget(); },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  draw();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "racecar",
  means: "An open-wheel race car: the pointer over it opens the drag reduction flap, the rear wing's top element swinging flat.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[108, 86], [210, 200], [280, 270], null],
  mount,
});
