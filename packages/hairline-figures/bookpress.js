/**
 * Book press: a heavy base, two posts and a crossbar, a screw through the bar
 * with a long tommy-bar handle, and a platen over a book. The pointer works
 * it: over the press the handle turns and the platen screws down onto the
 * book; off it the platen rises. The handle is bright.
 */
const {
  Cam, circ, fit, prism, proj, rings, seg, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const W = 30, D = 18, TOP = 70, BOOK = 12, REST = 0.25;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  let depth = value;
  fit(C, [[-W - 4, -D, 0], [W + 4, D, 0], [-24, -24, TOP + 12], [24, 24, TOP + 12], [0, 0, TOP + 14]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-W - 4, -D, W + 4, D, 2, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  const back = mk("g", {}, g);
  put(solid(back), prism(P, front, ...rings(-W, -3, -W + 6, 3, 1, 0.6), 6, TOP));
  put(solid(g), prism(P, front, ...rings(-16, -13, 16, 13, 1.5, 1), 6, 6 + BOOK));
  const plat = solid(g), screw = solid(g);
  put(solid(g), prism(P, front, ...rings(W - 6, -3, W, 3, 1, 0.6), 6, TOP));
  put(solid(g), prism(P, front, ...rings(-W - 1, -5, W + 1, 5, 1.5, 1), TOP, TOP + 7));
  const hub = solid(g);
  put(hub, prism(P, front, circ(4, 24), null, TOP + 7, TOP + 11));
  const bar = mk("path", { class: "nf sil", d: "" }, g);
  const sp = spring(REST, { k: 90, c: 18 });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const t = sp.x, zp = 6 + BOOK + 2 + (1 - t) * 30, a = t * Math.PI * 1.5;
    put(plat, prism(P, front, ...rings(-20, -15, 20, 15, 1.5, 1), zp, zp + 5));
    put(screw, prism(P, front, circ(2.4, 16), null, zp + 5, TOP));
    const c = Math.cos(a) * 24, s = Math.sin(a) * 24;
    bar.setAttribute("d", seg(P(-c, -s, TOP + 9), P(c, s, TOP + 9)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let over = false;
  function retarget() {
    sp.t = over ? depth : REST;
    bar.classList.toggle("hi", true);
    read.textContent = over ? Math.round(depth * 100) + "%" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let hit = false;
      for (let z = 0; z <= TOP + 12; z += 6) { const [x, y] = unproj(C, p[0], p[1], z); if (Math.abs(x) < W + 6 && Math.abs(y) < D + 6) hit = true; }
      over = hit; retarget();
    },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { depth = Math.min(1, v); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "bookpress",
  means: "A book press: over it the handle turns and the platen screws down onto the book; off it the platen rises again.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1],
  tour: [[200, 138], [171, 202], [200, 72], null],
  mount,
});
