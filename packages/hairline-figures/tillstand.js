/**
 * Tablet POS: a round foot, a pole and a swivel joint holding a tablet tilted
 * back. The tablet turns on the swivel to face the pointer, held to a reach.
 * At rest it is turned a little away, bright. The slider is the reach.
 */
const { Cam, fit, facing, proj, unproj, circ, prism, put, solid, mk, poly, fillet, spring, stepS, clamp, rad, register, pointer, disposer } = HL;

const PZ = 58, W = 34, H = 23, T = 24, REST = 22;
const disc = (r, n = 32) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-36, -36, 0], [36, 36, 0], [-36, 36, 0], [36, -36, 0], [0, 0, PZ + 28], [0, 0, PZ - 22]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(18), disc(16), 0, 3));
  put(solid(g), prism(P, front, disc(2.6, 16), disc(1.6, 16), 3, PZ - 6));
  put(solid(g), prism(P, front, disc(4.4, 20), disc(3.2, 20), PZ - 7, PZ - 3));
  const back = mk("path", {}, g), face = mk("path", { class: "sil hi" }, g), scr = mk("path", { class: "nf lo" }, g);

  const th = spring(45 - REST);
  let last = NaN;
  const pt = (u, v, d, a) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), cT = Math.cos(rad(T)), sT = Math.sin(rad(T));
    return P(-s * u - c * sT * v + c * cT * d, c * u - s * sT * v + s * cT * d, PZ + cT * v + sT * d);
  };
  const plate = (w, h, d, a, r) => poly(fillet([pt(-w, -h, d, a), pt(w, -h, d, a), pt(w, h, d, a), pt(-w, h, d, a)], [r, r, r, r]));
  function draw(a) {
    if (a === last) return;
    last = a;
    back.setAttribute("d", plate(W, H, -1.6, a, 5));
    face.setAttribute("d", plate(W, H, 1.6, a, 5));
    scr.setAttribute("d", plate(W - 4, H - 4, 1.7, a, 2));
  }
  draw(th.x);
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      let ang = Math.atan2(y, x) * 180 / Math.PI;
      if (ang < -135) ang += 360;
      th.t = clamp(ang, 45 - amp, 45 + amp);
      read.textContent = Math.round(th.t - 45) + "°";
      B.wake();
    },
    leave: () => { th.t = 45 - REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "tillstand",
  means: "A tablet till on a swivel stand: the tablet turns on its pole to face the pointer, as far as the stand allows.",
  rules: [1, 3, 4, 8],
  range: [30, 55, 80],
  tour: [[28, 295], [372, 295], [200, 290], null],
  mount,
});
