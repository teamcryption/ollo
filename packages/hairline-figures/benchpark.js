/**
 * Park bench: two cast end frames, four seat slats and three back slats on a
 * hinge. The pointer is someone settling in: the nearer it comes to the front
 * of the seat, the further the backrest reclines on a spring. At rest the back
 * leans a little, its top slat bright. The slider is how far it can recline.
 *
 * The pattern: a continuous aim (one spring on an angle); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, clamp, fillet, fit, facing, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 36, SZ = 16, HY = -9, REST = 0.22, MAXT = 1.25;
const BACK = [[3, 7.5], [9, 13.5], [15, 19.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-L, -30, SZ], [L, -30, SZ], [-L, 10, 0], [L, 10, 0], [-L, HY, 38], [L, HY, 38]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const frame = (x) => {
    put(solid(g), prism(P, front, rings(x - 1.6, HY + 1, x + 1.6, 9, 1, 0.5)[0], null, 0, 2.5));
    put(solid(g), prism(P, front, rings(x - 1.4, 5, x + 1.4, 8, 0.8, 0.4)[0], null, 2.5, SZ - 1));
    put(solid(g), prism(P, front, rings(x - 1.4, HY + 1, x + 1.4, HY + 4, 0.8, 0.4)[0], null, 2.5, SZ - 1));
  };
  frame(-L + 4);
  const back = BACK.map(() => mk("path", { class: "sil" }, g));
  for (const [y0, y1] of [[-9, -5], [-4, 0], [1, 5], [6, 10]]) {
    const [r, i] = rings(-L, y0, L, y1, 1.2, 0.6);
    put(solid(g), prism(P, front, r, i, SZ - 1, SZ + 0.6));
  }
  frame(L - 4);
  const sp = spring(REST, { k: 100, c: 18 });
  let drawn = NaN, top = value;

  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const s = Math.sin(t), c = Math.cos(t), at = (x, d) => P(x, HY - d * s, SZ + 1 + d * c);
    BACK.forEach(([d0, d1], j) => {
      back[j].setAttribute("d", poly(fillet([at(-L, d0), at(L, d0), at(L, d1), at(-L, d1)], [1, 1, 1, 1])));
    });
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let near = null;
  function retarget() {
    sp.t = near == null ? REST : REST + (MAXT - REST) * near * top;
    back[2].classList.toggle("hi", true);
    read.textContent = near == null ? "rest" : Math.round((sp.t * 180) / Math.PI) + "°";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      near = Math.abs(x) > L + 20 || y < -20 || y > 60 ? null : clamp((y + 10) / 40, 0, 1);
      retarget();
    },
    leave: () => { near = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { top = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "benchpark",
  means: "A park bench whose slatted backrest reclines as the pointer comes to the front of its seat.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[107, 185], [107, 255], [212, 272], null],
  mount,
});
