/**
 * Pedalo: two pontoons under a deck with a moulded bench seat, and a paddle
 * wheel turning in the gap at the stern. The pointer's place along the boat
 * turns the wheel, its boards sweeping round. At rest the wheel stands a
 * little turned, its rim bright. The slider is how far the wheel turns.
 *
 * The pattern: one part turning to the pointer.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, CX = 78, R = 21, CZ = 15, Y0 = 16, Y1 = 30, NB = 8, REST = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [L, 0, 0], [0, 46, 0], [L, 46, 0], [CX, Y1, CZ + R], [CX + R, 23, CZ], [30, 23, 34]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  box(0, 0, L, 14, 7, 1.5, 0, 10);
  box(8, 3, 62, 43, 6, 2, 10, 13);
  box(26, 8, 44, 38, 4, 1.5, 13, 19);
  box(22, 8, 27, 38, 2.5, 1, 13, 34);

  const wg = mk("g", {}, g);
  const far = mk("path", { class: "nf lo" }, wg);
  const boards = mk("path", {}, wg);
  const spokes = mk("path", { class: "nf lo" }, wg);
  const rim = mk("path", { class: "sil nf hi" }, wg);
  const hub = mk("path", { class: "nf" }, wg);
  box(0, 32, L, 46, 7, 1.5, 0, 10);
  const W3 = (r, a, y) => P(CX + r * Math.cos(a), y, CZ + r * Math.sin(a));
  const ring3 = (r, y) => { const o = []; for (let i = 0; i < 40; i++) o.push(W3(r, (i / 40) * 2 * Math.PI, y)); return o; };

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
      bd += poly([W3(R - 8, a, Y0), W3(R + 1, a, Y0), W3(R + 1, a, Y1), W3(R - 8, a, Y1)]);
      sd += seg(W3(3, a, Y1), W3(R, a, Y1));
    }
    boards.setAttribute("d", bd);
    spokes.setAttribute("d", sd);
    hub.setAttribute("d", poly(hull(ring3(3, Y0 - 3).concat(ring3(3, Y1 + 3)))));
  }

  const ang = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function move([sx, sy]) {
    const [wx] = unproj(C, sx, sy, 0);
    const t = clamp((wx - L / 2) / (L / 2), -1, 1);
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
  name: "pedalo",
  means: "A pedalo on twin pontoons: the pointer's place along the boat turns the paddle wheel at its stern.",
  rules: [1, 3, 5, 8],
  range: [30, 110, 160],
  tour: [[268, 206], [122, 133], [156, 194], null],
  mount,
});
