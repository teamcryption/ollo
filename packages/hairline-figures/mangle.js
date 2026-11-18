/**
 * Mangle: two cast side frames on a base, a pair of long rollers between
 * them and a crank on the near frame. The pointer works it: over the mangle
 * the top roller lifts open and the crank swings round; off it the rollers
 * close again. The crank handle is bright. The slider is how far it works.
 */
const {
  Cam, fit, hull, open, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const R = 11, BZ = 30, TOP = 112, REST = 0.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  let depth = value;
  fit(C, [[-36, -30, 0], [48, 30, 0], [-30, -16, TOP + 6], [30, 16, TOP + 6], [54, 0, BZ + 40], [54, 0, BZ - 36], [54, 40, BZ], [36, -40, BZ]], 200, 166);
  const P = proj(C), front = facing(C);
  function hcyl(x0, x1, z) {
    const pts = [], near = [];
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2, y = Math.cos(a) * R, zz = z + Math.sin(a) * R;
      pts.push(P(x0, y, zz)); const q = P(x1, y, zz); pts.push(q); near.push(q);
    }
    return { sil: poly(hull(pts)), crease: poly(near) };
  }
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-36, -18, 36, 18, 2, 1.4), 0, 5));
  const side = (x0) => { for (const y0 of [-15, 10]) put(solid(g), prism(P, front, ...rings(x0, y0, x0 + 5, y0 + 5, 1.5, 0.8), 5, TOP)); put(solid(g), prism(P, front, ...rings(x0 - 1, -16, x0 + 6, 16, 2, 1), TOP - 6, TOP)); };
  side(-32);
  const low = solid(g), top = solid(g);
  put(low, hcyl(-27, 27, BZ));
  side(27);
  const hub = mk("path", { class: "nf sil", d: "" }, g);
  const arm = mk("path", { class: "nf sil hi", d: "" }, g);
  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const t = sp.x, zt = BZ + 2 * R + 1 + t * 40, a = -0.5 + t * 4.2;
    put(top, hcyl(-27, 27, zt));
    const ey = Math.cos(a) * 40, ez = BZ + Math.sin(a) * 40;
    hub.setAttribute("d", seg(P(32, 0, BZ), P(36, 0, BZ)));
    arm.setAttribute("d", open([P(36, 0, BZ), P(36, ey, ez), P(54, ey, ez)]));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let over = false;
  function retarget() {
    sp.t = over ? depth : REST;
    read.textContent = over ? "turn " + Math.round(depth * 100) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let hit = false;
      for (let z = 0; z <= TOP + 6; z += 6) { const [x, y] = unproj(C, p[0], p[1], z); if (Math.abs(x) < 46 && Math.abs(y) < 30) hit = true; }
      over = hit; retarget();
    },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { depth = Math.max(0.3, Math.min(1, v)); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "mangle",
  means: "A mangle: over it the top roller lifts open and the crank swings round; off it the rollers close again.",
  rules: [1, 3, 5],
  range: [0.3, 1, 1],
  tour: [[156, 160], [185, 250], [140, 45], null],
  mount,
});
