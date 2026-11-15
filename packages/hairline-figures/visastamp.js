/**
 * Passport stamp: a rubber stamp, a block with a turned knob, over an open
 * passport. The stamp slides over the pages to the pointer and drops toward
 * the page, its landing traced dashed under it. At rest it hovers off one
 * corner, bright. The slider is how low it drops.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PW = 72, PD = 50, BX = 13, BY = 9, HOV = 26, REST = [56, 36];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [PW, PD, 0], [PW, 0, 0], [0, PD, 0], [PW, PD, HOV + 34], [0, 0, HOV + 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, PW, PD, 3, 1.4);
  put(solid(g), prism(P, front, pr, pi, 0, 2.5));
  mk("path", { d: poly([P(PW / 2, 1, 2.5), P(PW / 2, PD - 1, 2.5)]), class: "nf lo" }, g);
  const [phr] = rings(6, 8, 24, 30, 2, 0.8);
  mk("path", { d: poly(ringAt(P, phr, 2.5)), class: "nf lo" }, g);
  const land = mk("path", { class: "nf dash" }, g);
  const sg = mk("g", {}, g), rub = solid(sg), blk = solid(sg), neck = solid(sg), knob = mk("path", { class: "sil" }, sg);
  const sx = spring(REST[0]), sy = spring(REST[1]), sz = spring(HOV);
  let last = "";
  const disc = (x, y, r) => circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  function draw() {
    const x = sx.x, y = sy.x, z = sz.x, key = [x, y, z].map((n) => n.toFixed(2)).join();
    if (key === last) return;
    last = key;
    const [lr] = rings(x - BX, y - BY, x + BX, y + BY, 3, 1);
    land.setAttribute("d", poly(ringAt(P, lr, 2.5)));
    const [r0, i0] = rings(x - BX, y - BY, x + BX, y + BY, 3, 1);
    put(rub, prism(P, front, r0, i0, z, z + 3));
    const [r1, i1] = rings(x - BX - 1, y - BY - 1, x + BX + 1, y + BY + 1, 4, 1.4);
    put(blk, prism(P, front, r1, i1, z + 3, z + 11));
    put(neck, prism(P, front, disc(x, y, 3.5), disc(x, y, 2.5), z + 11, z + 20));
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI; pts.push(...ringAt(P, disc(x, y, 3.5 + 4.5 * Math.sin(t)), z + 19 + 12 * (i / 6))); }
    knob.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (dt) => { const m = [sx, sy, sz].map((s) => stepS(s, dt)).some(Boolean); draw(); return m; });
  bag.add(B.unregister);

  function move([px, py]) {
    const [x, y] = unproj(C, px, py, 2.5);
    if (x < -10 || x > PW + 10 || y < -10 || y > PD + 10) return leave();
    sx.t = clamp(x, BX + 2, PW - BX - 2); sy.t = clamp(y, BY + 2, PD - BY - 2);
    sz.t = HOV - (HOV - 3) * drop;
    read.textContent = "pg " + (sx.t < PW / 2 ? 1 : 2);
    B.wake();
  }
  function leave() { sx.t = REST[0]; sy.t = REST[1]; sz.t = HOV; read.textContent = "rest"; B.wake(); }
  for (const s of [rub, blk, neck]) s.sil.classList.add("hi");
  knob.classList.add("hi");
  draw(); leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { drop = v; }, destroy: bag.dispose };
}

hairline({
  name: "visastamp",
  means: "A rubber passport stamp: it slides over the open passport to the pointer and drops toward the page, its landing traced under it.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.85, 1],
  tour: [[183, 201], [133, 226], [263, 237], null],
  mount,
});
