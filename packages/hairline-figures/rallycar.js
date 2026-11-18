/**
 * Rally car: a short hatchback on four chunky tyres, a sloped cabin with a
 * roof scoop, a wide rear spoiler and long-travel coil springs at each wheel.
 * The pointer over the car makes it jump: the whole body heaves up off the
 * wheels on its suspension, on a spring, the coils stretching beneath it.
 * At rest the body sits low, the roof scoop bright. The slider is how high
 * the body rises.
 *
 * The pattern: one part answering, hit on the rest pose's screen box.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 10, WW = 7, LIFT = 22;
const WHEELS = [[-27, -19], [29, -19], [-27, 19], [29, 19]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-44, -24, 0], [44, 24, 0], [44, -24, 0], [-44, 24, 0], [-44, -20, 44 + LIFT], [10, 16, 44 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = ([u, v]) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; for (const dv of [-WW / 2, WW / 2]) pts.push(P(u + WR * Math.cos(t), v + Math.sign(v) * dv, WR + WR * Math.sin(t))); }
    return poly(hull(pts));
  };
  const hub = ([u, v]) => poly(hull([0, 1, 2, 3, 4, 5, 6, 7].map((i) => P(u + 4 * Math.cos(i * 0.785), v + Math.sign(v) * (WW / 2 + 0.2), WR + 4 * Math.sin(i * 0.785)))));
  const wheelSet = (w) => { mk("path", { d: wheel(w), class: "sil" }, g); mk("path", { d: hub(w), class: "nf lo" }, g); };
  WHEELS.filter((w) => w[1] < 0).forEach(wheelSet);
  const coils = mk("path", { class: "nf lo" }, g);
  const body = mk("g", {}, g);
  const box = (x0, y0, x1, y1, r, b, z0, z1, par = body) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  // rear spoiler: two struts then the blade
  mk("path", { d: seg(P(-40, -10, 30), P(-42, -10, 36)) + seg(P(-40, 10, 30), P(-42, 10, 36)), class: "nf" }, body);
  box(-46, -18, -38, 18, 1.5, 0.6, 36, 38.5);
  box(-42, -17, 42, 17, 6, 1.6, 14, 28);
  // cabin: a sloped hull from a wide foot to a short roof
  const foot = rrect(-34, -16, 18, 16, 5, 6), top = rrect(-30, -13, 0, 13, 4, 6), inner = rrect(-29, -12, -1, 12, 3, 6);
  put(solid(body), { sil: poly(hull(ringAt(P, foot, 28).concat(ringAt(P, top, 41)))), crease: open(ringAt(P, run(inner, front), 41)) });
  mk("path", { d: poly([P(-24, 16, 30), P(-8, 16, 30), P(-8, 13.5, 39), P(-22, 13.5, 39)]) + poly([P(-4, 16, 30), P(12, 16, 30), P(-1, 13.5, 39), P(-4, 13.5, 39)]), class: "nf lo" }, body);
  // roof scoop: the bright mark
  const scoop = box(-20, -5, -8, 5, 2, 0.7, 41, 44.5);
  scoop.sil.setAttribute("class", "sil hi");
  mk("path", { d: poly([P(-8, -3.5, 42), P(-8, 3.5, 42), P(-8, 3.5, 44), P(-8, -3.5, 44)]), class: "nf lo" }, body);
  box(34, -17, 44, 17, 3, 1, 11, 15);
  mk("path", { d: seg(P(42, -12, 23), P(42, -6, 23)) + seg(P(42, 6, 23), P(42, 12, 23)), class: "nf lo" }, body);
  WHEELS.filter((w) => w[1] > 0).forEach(wheelSet);
  const sp = spring(0);
  let last = NaN, over = false;
  const dz = P(0, 0, 1)[1] - P(0, 0, 0)[1];

  function draw() {
    const h = Math.max(0, sp.x);
    if (Math.abs(h - last) < 0.01) return;
    last = h;
    body.setAttribute("transform", "translate(0 " + (h * dz).toFixed(2) + ")");
    let d = "";
    for (const [u, v] of WHEELS) {
      const y = v * 0.75, z0 = WR, z1 = 15 + h, n = 7;
      const pts = [];
      for (let k = 0; k <= n * 2; k++) pts.push(P(u + (k % 2 ? 2.5 : -2.5), y, z0 + ((z1 - z0) * k) / (n * 2)));
      d += open(pts);
    }
    coils.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const bb = [[-44, -24, 0], [44, 24, 0], [44, -24, 0], [-44, 24, 0], [-46, -18, 44], [-20, 16, 44]].map((q) => P(...q));
  const xs = bb.map((q) => q[0]), ys = bb.map((q) => q[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];

  function retarget() {
    sp.t = over ? 6 + (LIFT - 6) * reach : 0;
    read.textContent = over ? "jump " + Math.round(sp.t) : "rest";
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
  name: "rallycar",
  means: "A rally hatchback with a roof scoop: the pointer over it makes the body jump up off the wheels on long-travel coil springs.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[175, 129], [236, 250], [164, 178], null],
  mount,
});
