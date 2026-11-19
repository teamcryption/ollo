/**
 * Paddle steamer: a long hull with a deckhouse and a tall funnel, and one big
 * side paddle wheel. The pointer's place along the hull turns the wheel: its
 * boards sweep round through the water. At rest the wheel stands a little
 * turned, its rim bright. The slider is how far the wheel turns.
 *
 * The pattern: one part turning to the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 130, W = 34, HZ = 14, CX = 62, R = 30, CZ = 22, Y0 = W + 2, Y1 = W + 14, NB = 10, REST = 14;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [L, 0, 0], [0, Y1, 0], [L, Y1, 0], [CX, Y1, CZ + R], [CX, Y1, CZ - R], [L - 40, 14, HZ + 70]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [hr, hi] = rings(0, 0, L, W, 16, 2);
  put(solid(g), prism(P, front, hr, hi, 0, HZ));
  const [dr, di] = rings(28, 6, 100, W - 6, 4, 1.5);
  put(solid(g), prism(P, front, dr, di, HZ, HZ + 14));
  put(solid(g), prism(P, front, disc(L - 46, W / 2, 6), disc(L - 46, W / 2, 4.8), HZ + 14, HZ + 50));
  put(solid(g), prism(P, front, disc(34, W / 2, 1.2, 10), disc(34, W / 2, 0.6, 10), HZ + 14, HZ + 40));

  const wg = mk("g", {}, g);
  const far = mk("path", { class: "nf lo" }, wg);
  const boards = mk("path", {}, wg);
  const spokes = mk("path", { class: "nf lo" }, wg);
  const rim = mk("path", { class: "sil nf hi" }, wg);
  const hub = mk("path", { class: "nf" }, wg);
  const W3 = (r, a, y) => P(CX + r * Math.cos(a), y, CZ + r * Math.sin(a));
  const ring3 = (r, y) => { const o = []; for (let i = 0; i < 48; i++) o.push(W3(r, (i / 48) * 2 * Math.PI, y)); return o; };

  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a0 = (deg * Math.PI) / 180;
    far.setAttribute("d", poly(ring3(R, Y0)));
    rim.setAttribute("d", poly(ring3(R, Y1)));
    let bd = "", sd = "";
    for (let k = 0; k < NB; k++) {
      const a = a0 + (k / NB) * 2 * Math.PI;
      bd += poly([W3(R - 9, a, Y0), W3(R + 1, a, Y0), W3(R + 1, a, Y1), W3(R - 9, a, Y1)]);
      sd += seg(W3(4, a, Y1), W3(R, a, Y1));
    }
    boards.setAttribute("d", bd);
    spokes.setAttribute("d", sd);
    hub.setAttribute("d", poly(hull(ring3(4, Y0).concat(ring3(4, Y1 + 2)))));
  }

  const ang = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function move([sx, sy]) {
    const [wx] = unproj(C, sx, sy, 0);
    const t = clamp((wx - CX) / (L / 2), -1, 1);
    ang.t = REST + t * reach;
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { ang.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "paddlesteamer",
  means: "A paddle steamer with one big side wheel: the pointer's place along the hull turns the wheel round.",
  rules: [1, 3, 5, 8],
  range: [30, 110, 160],
  tour: [[286, 234], [112, 147], [143, 221], null],
  mount,
});
