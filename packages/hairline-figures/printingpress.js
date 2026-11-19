/**
 * Printing press: a screw press of two tall cheeks and a head, the bed rails
 * running out to the front. The pointer works it: over the press the bed runs
 * in under the platen, the bar swings round and the platen screws down; off
 * it the bed runs back out. The bar is bright. The slider is how far it works.
 */
const {
  Cam, circ, fit, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const TOP = 84, REST = 0.08;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  let depth = value;
  fit(C, [[-30, -24, 0], [76, 16, 0], [-28, -28, TOP + 10], [28, 28, TOP + 10], [0, 0, TOP + 12], [76, 16, 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-26, -16, 76, 16, 2, 1.4), 0, 8));
  put(solid(g), prism(P, front, ...rings(-4, -24, 4, -16, 1.5, 0.8), 0, TOP));
  const bed = solid(g), tym = solid(g), plat = solid(g), screw = solid(g);
  put(solid(g), prism(P, front, ...rings(-4, 16, 4, 24, 1.5, 0.8), 0, TOP));
  put(solid(g), prism(P, front, ...rings(-7, -27, 7, 27, 2, 1.2), TOP, TOP + 9));
  const hub = solid(g);
  const bar = mk("path", { class: "nf sil hi", d: "" }, g);
  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const t = sp.x, bx = 50 * (1 - t), zp = 15 + (1 - t) * 34, a = 0.5 + t * 2.1;
    put(bed, prism(P, front, ...rings(bx - 18, -14, bx + 18, 14, 1.5, 1), 8, 13));
    put(tym, prism(P, front, ...rings(bx - 14, -11, bx + 14, 11, 1, 0.8), 13, 15));
    put(plat, prism(P, front, ...rings(-13, -13, 13, 13, 1.5, 1), zp, zp + 6));
    put(screw, prism(P, front, circ(3, 16), null, zp + 6, TOP));
    put(hub, prism(P, front, circ(5, 20), null, zp + 16, zp + 21));
    bar.setAttribute("d", seg(P(0, 0, zp + 18), P(Math.cos(a) * 34, Math.sin(a) * 34, zp + 18)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let over = false;
  function retarget() {
    sp.t = over ? depth : REST;
    read.textContent = over ? "pull " + Math.round(depth * 100) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let hit = false;
      for (let z = 0; z <= TOP + 10; z += 6) { const [x, y] = unproj(C, p[0], p[1], z); if (x > -30 && x < 78 && Math.abs(y) < 28) hit = true; }
      over = hit; retarget();
    },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { depth = Math.max(0.3, Math.min(1, v)); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "printingpress",
  means: "A printing press: over it the bed runs in under the platen, the bar swings and the platen screws down; off it the bed runs out.",
  rules: [1, 3, 5],
  range: [0.3, 1, 1],
  tour: [[161, 130], [235, 265], [165, 50], null],
  mount,
});
