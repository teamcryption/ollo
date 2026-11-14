/**
 * Floor mirror: a cheval mirror, its framed glass hung between two posts on
 * long feet, pivoting on a pin at mid-height. The pointer's height sets the
 * tilt: above the pin the glass tips back, below it tips forward, clamped,
 * on a spring. At rest the glass leans back a little, its frame bright.
 * The slider is the reach of the tilt.
 *
 * The pattern: one part following the pointer (aim).
 */
const {
  Cam, clamp, fit, facing, fillet, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PY = 10, PZ = 48, HH = 34, X0 = 5, X1 = 47, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-2, -4, 0], [54, 24, 0], [54, -4, 84], [-2, 24, 0], [-2, -4, 84]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, parent) => {
    put(solid(parent), prism(P, front, ...rings(x - 2.5, -4, x + 2.5, 24, 2, 0.8), 0, 3));
    put(solid(parent), prism(P, front, ...rings(x - 2, PY - 2, x + 2, PY + 2, 1.6, 0.6), 3, 84));
  };
  post(0, g);
  const mg = mk("g", {}, g);
  const frame = mk("path", { class: "sil hi" }, mg), glass = mk("path", { class: "nf lo" }, mg);
  post(52, mk("g", {}, g));

  const tilt = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = (deg * Math.PI) / 180, F = (x, s) => P(x, PY + s * Math.sin(t), PZ + s * Math.cos(t));
    frame.setAttribute("d", poly(fillet([F(X0, -HH), F(X1, -HH), F(X1, HH), F(X0, HH)], [4, 4, 4, 4])));
    glass.setAttribute("d", poly(fillet([F(X0 + 4, -HH + 4), F(X1 - 4, -HH + 4), F(X1 - 4, HH - 4), F(X0 + 4, HH - 4)], [2.5, 2.5, 2.5, 2.5])));
  }

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);

  const pin = P(26, PY, PZ);
  function aim([sx, sy]) {
    if (Math.abs(sx - pin[0]) > 110) return leave();
    const deg = Math.round(clamp(((pin[1] - sy) / 70) * reach, -reach, reach));
    tilt.t = deg;
    read.textContent = "tilt " + (deg > 0 ? "+" : "") + deg + "°";
    B.wake();
  }
  function leave() { tilt.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "mirrorstand",
  means: "A floor mirror on a pivot: the pointer's height tips the glass back or forward, and it settles leaning back a little.",
  rules: [1, 3, 5, 8],
  range: [8, 24, 36],
  tour: [[200, 100], [200, 230], null],
  mount,
});
