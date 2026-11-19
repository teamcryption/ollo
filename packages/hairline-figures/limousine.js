/**
 * Limousine: a stretched sedan on four wheels, a long low cabin and a row of
 * passenger doors down its near flank. The pointer along the car swings the
 * door under it open on its front hinge, its neighbours following less and
 * later, on the 700ms tween. At rest every door is shut and the second one
 * bright. The slider is how far the doors swing.
 *
 * The pattern: a single row, picked by screen x on the rest pose.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, rrect, seg, tween, tset, tval, tdone,
  disposer, mk, pointer, register, solid, put,
} = HL;

const WR = 8, WW = 6, Y = 17.5, DW = 16, Z0 = 10, Z1 = 31, REST = 1;
const WHEELS = [[-56, -16], [54, -16], [-56, 16], [54, 16]];
const HINGE = [-30, -12, 6, 24];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-76, -20, 0], [74, 20, 0], [74, -20, 0], [-76, 36, 0], [-40, -15, 34], [24, 34, 31]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = ([u, v]) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; for (const dv of [-WW / 2, WW / 2]) pts.push(P(u + WR * Math.cos(t), v + Math.sign(v) * dv, WR + WR * Math.sin(t))); }
    return poly(hull(pts));
  };
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  WHEELS.filter((w) => w[1] < 0).forEach((w) => mk("path", { d: wheel(w), class: "sil" }, g));
  box(-74, -17, 72, 17, 7, 1.6, 7, 20);
  const foot = rrect(-50, -17, 40, 17, 5, 6), top = rrect(-46, -16.5, 32, 16.5, 4, 6);
  mk("path", { d: poly(hull(foot.map((q) => P(q.u, q.v, 20)).concat(top.map((q) => P(q.u, q.v, 34))))), class: "sil" }, g);
  mk("path", { d: seg(P(-44, 16.5, 32.5), P(30, 16.5, 32.5)), class: "nf lo" }, g);
  box(72, -11, 76, 11, 2, 0.8, 8, 17);
  WHEELS.filter((w) => w[1] > 0).forEach((w) => mk("path", { d: wheel(w), class: "sil" }, g));
  // the doors: open hollows behind, then the leaves, back to front
  const holes = HINGE.map((h) => mk("path", { d: poly([P(h - DW, Y, Z0), P(h, Y, Z0), P(h, Y, Z1), P(h - DW, Y, Z1)]), class: "nf lo" }, g));
  const leaves = HINGE.map(() => ({ s: mk("path", { class: "sil" }, g), w: mk("path", { class: "nf lo" }, g), tw: tween(0), last: NaN }));
  let chosen = -1;

  function draw(now) {
    leaves.forEach((L, i) => {
      const a = tval(L.tw, now);
      if (Math.abs(a - L.last) < 0.0005) return;
      L.last = a;
      const h = HINGE[i], c = Math.cos(a), s = Math.sin(a);
      const at = (d, t, z) => P(h - d * c + t * s, Y + d * s + t * c, z);
      const pts = [];
      for (const z of [Z0, Z1]) for (const d of [0, DW]) for (const t of [0, 1]) pts.push(at(d, t, z));
      L.s.setAttribute("d", poly(hull(pts)));
      L.w.setAttribute("d", poly([at(2, 1, 21), at(DW - 2, 1, 21), at(DW - 2, 1, 29), at(2, 1, 29)]) + seg(at(DW - 3, 1, 17), at(DW - 6, 1, 17)));
    });
  }

  const B = register(stage, (dt, now) => { draw(now); return leaves.some((L) => !tdone(L.tw, now)); });
  bag.add(B.unregister);
  const mids = HINGE.map((h) => P(h - DW / 2, Y, Z0)[0]);
  const bb = [[-76, -20, 0], [74, 20, 0], [74, -20, 0], [-76, 20, 0], [-46, -15, 34], [32, 15, 34]].map((q) => P(...q));
  const xs = bb.map((q) => q[0]), ys = bb.map((q) => q[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];

  function retarget() {
    const now = performance.now();
    leaves.forEach((L, i) => {
      const f = chosen < 0 ? 0 : [1, 0.42, 0.16, 0.06][Math.abs(i - chosen)];
      tset(L.tw, rad((35 + 50 * reach) * f), now, chosen < 0 ? 0 : Math.abs(i - chosen) * 45);
      L.s.setAttribute("class", i === (chosen < 0 ? REST : chosen) ? "sil hi" : "sil");
    });
    read.textContent = chosen < 0 ? "rest" : "door " + (chosen + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      let k = -1;
      if (sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]) { let bd = 1e9; mids.forEach((m, i) => { const d = Math.abs(m - sx); if (d < bd) { bd = d; k = i; } }); }
      if (k !== chosen) { chosen = k; retarget(); }
    },
    leave: () => { chosen = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  draw(performance.now());
  return { set: (v) => { reach = clamp(v, 0, 1); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "limousine",
  means: "A stretch limousine with a row of passenger doors: the pointer along it swings the door beneath open, its neighbours less.",
  rules: [1, 2, 3, 4, 5, 8],
  range: [0, 1, 1],
  tour: [[161, 129], [136, 135], [210, 173], null],
  mount,
});
