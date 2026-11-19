/**
 * Jet engine: a turbofan on a ground cradle, the fan facing the viewer in its
 * intake and the reverser sleeve at the back of the nacelle. The pointer works
 * it: over the engine the fan spins round and the sleeve slides back, opening
 * the reverser on the core; off it the sleeve closes. The fan is bright.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const Z = 36, REST = 0.08;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  let depth = value;
  fit(C, [[-92, -24, 0], [44, 24, 0], [-92, -24, Z + 24], [44, 24, Z + 24]], 200, 166);
  const P = proj(C), front = facing(C);
  function hcyl(x0, x1, r) {
    const pts = [], near = [];
    for (let k = 0; k < 32; k++) {
      const a = (k / 32) * Math.PI * 2, y = Math.cos(a) * r, z = Z + Math.sin(a) * r;
      pts.push(P(x0, y, z)); const q = P(x1, y, z); pts.push(q); near.push(q);
    }
    return { sil: poly(hull(pts)), crease: poly(near) };
  }
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-70, -16, 36, 16, 2, 1.4), 0, 4));
  for (const x of [-50, 14]) put(solid(g), prism(P, front, ...rings(x, -8, x + 10, 8, 1.5, 1), 4, Z - 18));
  put(solid(g), hcyl(-84, -10, 12));
  const sleeve = solid(g);
  put(solid(g), hcyl(-4, 40, 23));
  const disc = mk("path", { class: "lo", d: poly(Array.from({ length: 32 }, (_, k) => { const a = k / 32 * Math.PI * 2; return P(40, Math.cos(a) * 19, Z + Math.sin(a) * 19); })) }, g);
  const fan = mk("path", { class: "nf sil hi", d: "" }, g);
  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const t = sp.x, x1 = -5 - t * 34;
    put(sleeve, hcyl(x1 - 34, x1, 22));
    let d = "";
    for (let i = 0; i < 9; i++) {
      const a = t * 3 + (i / 9) * Math.PI * 2, b = a + 0.25;
      d += seg(P(40, Math.cos(a) * 4, Z + Math.sin(a) * 4), P(40, Math.cos(b) * 18, Z + Math.sin(b) * 18));
    }
    fan.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let over = false;
  function retarget() {
    sp.t = over ? depth : REST;
    read.textContent = over ? "rev " + Math.round(depth * 100) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let hit = false;
      for (let z = 0; z <= Z + 24; z += 6) { const [x, y] = unproj(C, p[0], p[1], z); if (x > -94 && x < 44 && Math.abs(y) < 26) hit = true; }
      over = hit; retarget();
    },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { depth = Math.max(0.3, Math.min(1, v)); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "jetengine",
  means: "A jet engine: over it the fan spins and the reverser sleeve slides back off the core; off it the sleeve closes again.",
  rules: [1, 3, 5],
  range: [0.3, 1, 1],
  tour: [[233, 134], [255, 205], [150, 95], null],
  mount,
});
