/**
 * Baby walker: a push-along toy cart with a tall handle, four wheels and
 * blocks riding on top, on a play mat. The cart rolls along the mat toward
 * the pointer, its spokes turning as it goes. At rest it waits near the far
 * end, handle bright. The slider is how far it may roll.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BL = 50, BW = 30, WR = 9, MAX = 90, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-20, -8, 0], [MAX + BL + 8, BW + 8, 0], [MAX + BL + 8, -8, 0], [-20, BW + 8, 0], [-14, 0, 60], [MAX - 14, BW, 60]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [m0, m1] = rings(-20, -8, MAX + BL + 8, BW + 8, 6, 2);
  put(solid(g), prism(P, front, m0, m1, 0, 1.5));
  const cart = mk("g", {}, g);
  const farW = [0, 1].map(() => mk("path", {}, cart));
  const handle = mk("path", { class: "sil nf" }, cart);
  const body = solid(cart);
  const blocks = [solid(cart), solid(cart)];
  const nearW = [0, 1].map(() => mk("path", {}, cart));
  const sp = spring(REST);
  let last = NaN;
  function wheel(el, cx, y, phi) {
    const pts = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(P(cx + WR * Math.cos(t), y, WR + 1.5 + WR * Math.sin(t))); }
    let d = poly(pts);
    for (const o of [0, Math.PI / 2]) {
      const c = Math.cos(phi + o) * WR * 0.8, s = Math.sin(phi + o) * WR * 0.8;
      d += seg(P(cx - c, y, WR + 1.5 - s), P(cx + c, y, WR + 1.5 + s));
    }
    el.setAttribute("d", d);
  }
  function draw(x) {
    if (x === last) return;
    last = x;
    const phi = -x / WR;
    [10, 40].forEach((cx, i) => { wheel(farW[i], x + cx, -1, phi); wheel(nearW[i], x + cx, BW + 1, phi); });
    const top = [x - 14, 0, 60], top2 = [x - 14, BW, 60];
    handle.setAttribute("d", seg(P(x + 2, 3, 22), P(x - 14, 3, 60)) + seg(P(x + 2, BW - 3, 22), P(x - 14, BW - 3, 60)) + seg(P(...top), P(...top2)));
    const [b0, b1] = rings(x, 0, x + BL, BW, 4, 1.5);
    put(body, prism(P, front, b0, b1, 10, 24));
    const [c0, c1] = rings(x + 16, 5, x + 28, 17, 1.5, 1);
    put(blocks[0], prism(P, front, c0, c1, 24, 36));
    const [d0, d1] = rings(x + 32, 12, x + 44, 24, 1.5, 1);
    put(blocks[1], prism(P, front, d0, d1, 24, 32));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  handle.classList.add("hi");
  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    const near = wy > -40 && wy < BW + 40 && wx > -40 && wx < MAX + BL + 30;
    sp.t = near ? clamp(wx - BL / 2, 0, reach) : REST;
    read.textContent = near ? "x " + Math.round(sp.t) : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; sp.t = Math.min(sp.t, v); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "babywalker",
  means: "A push-along baby walker on a play mat: the cart rolls toward the pointer, its wheels turning as it goes.",
  rules: [1, 3, 4, 5],
  range: [40, 75, 90],
  tour: [[245, 223], [139, 152], [275, 257], null],
  mount,
});
