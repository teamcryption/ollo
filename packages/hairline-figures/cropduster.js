/**
 * Crop duster: a low-wing ag plane with a tall hopper ahead of the cockpit
 * and a spray boom along the wing's trailing edge. The pointer swings the
 * boom's nozzles down and lets the spray fall, heavier toward the left.
 * The boom is the bright mark.
 */
const { Cam, fit, proj, hull, poly, open, clamp, spring, stepS, disposer, mk, pointer, register } = HL;
const S = 2.15, Z0 = 50, NZ = [-52, -40, -28, -16, 16, 28, 40, 52];
const disc = (x, r, z = Z0, n = 16) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([x, r * Math.cos(t), z + r * Math.sin(t)]); } return o; };
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; [x0, x1].forEach((x) => [y0, y1].forEach((y) => [z0, z1].forEach((z) => o.push([x, y, z])))); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-50, 0, Z0 + 26], [44, 0, Z0], [0, -60, Z0 - 6], [0, 60, Z0 - 6], [-40, 52, Z0 - 50], [-40, -52, Z0 - 50]].map(([x, y, z]) => [-x, y, z]), 200, 166);
  const P0 = proj(C), P = (x, y, z) => P0(-x, y, z);
  const g = mk("g", {}, svg);
  const n = ["prop", "wing", "body", "hopper", "canopy", "boom", "spray", "fin", "stab"];
  const el = {};
  n.forEach((k) => (el[k] = mk("path", { class: k === "spray" ? "nf lo" : k === "canopy" ? "nf lo" : k === "boom" ? "nf sil hi" : "sil" }, g)));
  const sh = (pts) => poly(hull(pts.map((p) => P(...p))));
  el.stab.setAttribute("d", sh(box(-50, -40, -20, 20, Z0 + 1, Z0 + 3)));
  el.wing.setAttribute("d", sh(box(-6, 14, -60, 60, Z0 - 7, Z0 - 5).concat(box(-4, 16, 0, 0, Z0 - 7, Z0 - 5))));
  el.fin.setAttribute("d", sh(box(-50, -36, -1.5, 1.5, Z0 + 2, Z0 + 4).concat(box(-52, -46, -1.5, 1.5, Z0 + 24, Z0 + 26))));
  el.body.setAttribute("d", sh(disc(-50, 2.5).concat(disc(-20, 5), disc(6, 8, Z0 + 1), disc(34, 8), disc(40, 5))));
  el.hopper.setAttribute("d", sh(box(12, 26, -6, 6, Z0 + 4, Z0 + 15)));
  el.canopy.setAttribute("d", poly([[0, 0, Z0 + 8], [4, 0, Z0 + 16], [10, 0, Z0 + 16], [11, 0, Z0 + 9]].map((p) => P(...p))));
  el.prop.setAttribute("d", sh(box(44, 46, -1.5, 1.5, Z0 - 16, Z0 + 16)) + poly(disc(46, 3).map((p) => P(...p))));
  const s = spring(0.1);
  let last = NaN;
  function draw() {
    if (s.x === last) return; last = s.x;
    const v = clamp(s.x, 0, 1.1), a = 0.25 + v * 1.1, bx = -9, bz = Z0 - 9;
    let boom = open([P(bx, -56, bz), P(bx, 56, bz)]), spray = "";
    NZ.forEach((y) => {
      const tip = [bx - 4 * Math.cos(a), y, bz - 4 * Math.sin(a)];
      boom += open([P(bx, y, bz), P(...tip)]) + open([P(bx + 3, y, Z0 - 6), P(bx, y, bz)]);
      const len = 3 + v * 50;
      [-4, 0, 4].forEach((d) => { spray += open([P(...tip), P(tip[0] - len * 0.35, y + d * (1 + v), tip[2] - len)]); });
    });
    el.boom.setAttribute("d", boom);
    el.spray.setAttribute("d", spray);
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx]) {
    s.t = clamp(gain * (0.45 + 0.55 * clamp((320 - sx) / 220, 0, 1)), 0, 1.1);
    read.textContent = Math.round(s.t * 100) + "%";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { s.t = 0.1; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.3, 1.3); }, destroy: bag.dispose };
}

hairline({
  name: "cropduster",
  means: "A crop duster: the pointer swings the spray boom's nozzles down under the wing and lets the spray fall, heavier toward the left.",
  rules: [3, 4, 5, 8],
  range: [0.3, 0.9, 1.3],
  tour: [[101, 142], [247, 69], [77, 154], null],
  mount,
});
