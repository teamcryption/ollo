/**
 * Parrot perch: a T-stand on a round tray, a crossbar with a seed cup at
 * each end and a parrot sitting on it. The pointer's side of the stand sets
 * the bar's tilt: it swings on its pivot toward the pointer, cups and bird
 * riding with it. At rest it leans a little, the bird bright. The slider is
 * the swing's reach.
 *
 * The pattern: one part answering where the pointer is (lean).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 62, L = 34, BR = 2.2, REST = 7;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-40, -40, 0], [40, 40, 0], [-L - 6, 0, H + 26], [L + 6, 0, H + 26], [0, 0, H + 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 30, 48), disc(0, 0, 27.5, 48), 0, 4));
  put(solid(g), prism(P, front, disc(0, 0, 6, 24), disc(0, 0, 4.5, 24), 4, 9));
  put(solid(g), prism(P, front, disc(0, 0, 1.8, 16), disc(0, 0, 1, 16), 9, H));
  const cupA = solid(g), bar = mk("path", { class: "sil" }, g), bird = mk("g", {}, g), cupB = solid(g);
  const body = mk("path", { class: "sil" }, bird), wing = mk("path", { class: "nf lo" }, bird);
  const head = mk("path", { class: "sil" }, bird), beak = mk("path", {}, bird), eye = mk("circle", { r: 1.1, class: "dot" }, bird);

  const tilt = spring(REST);
  let last = NaN;
  // a point along the tilted bar: s along it, plus local up offset u
  const on = (a, s, u, y = 0) => [s * Math.cos(a) - u * Math.sin(a), y, H + s * Math.sin(a) + u * Math.cos(a)];
  const ball = (c, rx, ry, rz) => {
    const out = [];
    for (let i = 0; i <= 6; i++) {
      const t = -Math.PI / 2 + (i / 6) * Math.PI;
      for (let j = 0; j < 14; j++) { const f = (j / 14) * 2 * Math.PI; out.push(P(c[0] + rx * Math.cos(t) * Math.cos(f), c[1] + ry * Math.cos(t) * Math.sin(f), c[2] + rz * Math.sin(t))); }
    }
    return out;
  };
  function cup(s, a, sx) {
    const [x, y, z] = on(a, sx, 0);
    put(s, prism(P, front, disc(x, y, 5, 24), disc(x, y, 3.8, 24), z - 4, z + 1.5));
  }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const s of [-L, L]) for (let j = 0; j < 12; j++) { const f = (j / 12) * 2 * Math.PI; pts.push(P(...on(a, s, BR * Math.sin(f), BR * Math.cos(f)))); }
    bar.setAttribute("d", poly(hull(pts)));
    cup(cupA, a, -L + 4); cup(cupB, a, L - 4);
    const bc = on(a, 6, 10), hc = on(a, 10, 21);
    body.setAttribute("d", poly(hull(ball(bc, 6, 5, 9).concat(ball(on(a, 1, 2), 3, 3, 3)))));
    wing.setAttribute("d", poly(hull(ball([bc[0] - 1, bc[1] + 4, bc[2]], 4, 1, 6))));
    head.setAttribute("d", poly(hull(ball(hc, 4.6, 4.4, 4.6))));
    const b0 = P(hc[0] + 4, hc[1], hc[2] + 1.5), b1 = P(hc[0] + 8.5, hc[1], hc[2] - 2), b2 = P(hc[0] + 4, hc[1], hc[2] - 3);
    beak.setAttribute("d", poly([b0, b1, b2]));
    const e = P(hc[0] + 1.8, hc[1] + 3.4, hc[2] + 1.4);
    eye.setAttribute("cx", e[0]); eye.setAttribute("cy", e[1]);
  }

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);

  function setLit(on2) {
    body.classList.toggle("hi", !on2); head.classList.toggle("hi", !on2);
    bar.classList.toggle("hi", on2);
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    const d = clamp((wx - wy) / 70, -1, 1);
    if (Math.abs(wx) > 90 || Math.abs(wy) > 90) return leave();
    tilt.t = d * reach;
    setLit(true);
    read.textContent = (tilt.t >= 0 ? "+" : "") + Math.round(tilt.t) + "°";
    B.wake();
  }
  function leave() { tilt.t = REST; setLit(false); read.textContent = "rest"; B.wake(); }
  draw(REST); leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "parrotperch",
  means: "A T-stand perch with a parrot on its bar: the bar swings toward the side the pointer is on, cups and bird riding with it.",
  rules: [3, 4, 5, 8],
  range: [6, 18, 26],
  tour: [[320, 260], [90, 250], [240, 270], null],
  mount,
});
