/**
 * Bag dispenser: a counter tray with a back stop holding flat paper bags,
 * the top one with its serrated mouth. The top bag slides out of the tray
 * toward the pointer, held to a reach. At rest it pokes out a little,
 * bright. The slider is the reach.
 */
const { Cam, fit, facing, proj, unproj, rings, prism, put, solid, mk, poly, open, fillet, spring, stepS, clamp, register, pointer, disposer } = HL;

const L = 64, Y0 = 6, Y1 = 50, REST = 10, TEETH = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-2, -2, 0], [72, 58, 0], [-2, 58, 0], [72, -2, 0], [130, Y0, 7], [130, Y1, 7], [0, 0, 26]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-2, -2, 72, 58, 4, 1.6);
  put(solid(g), prism(P, front, tr, ti, 0, 3));
  const [wr, wi] = rings(-2, -2, 4, 58, 2, 1);
  put(solid(g), prism(P, front, wr, wi, 3, 26));
  const lower = (x0, z) => poly(fillet([P(x0, Y0, z), P(x0 + L, Y0, z), P(x0 + L, Y1, z), P(x0, Y1, z)], [2, 2, 2, 2]));
  mk("path", { d: lower(5, 3.6) }, g);
  mk("path", { d: lower(5, 5) }, g);
  const top = mk("path", { class: "sil hi" }, g), fold = mk("path", { class: "nf lo" }, g);

  const sl = spring(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const x0 = 5 + s, x1 = x0 + L, z = 6.6, q = [P(x0, Y0, z)];
    for (let i = 0; i <= TEETH * 2; i++) q.push(P(x1 - (i % 2) * 2.4, Y0 + (i / (TEETH * 2)) * (Y1 - Y0), z));
    q.push(P(x0, Y1, z));
    top.setAttribute("d", poly(q));
    fold.setAttribute("d", open([P(x0 + 10, Y0, z), P(x0 + 10, Y1, z)]) + open([P(x0, (Y0 + Y1) / 2, z), P(x0 + 10, (Y0 + Y1) / 2, z)]));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sl, dt); draw(sl.x); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x] = unproj(C, sx, sy, 0);
      sl.t = clamp((x - 30) / 70, 0, 1) * amp;
      read.textContent = "pull " + Math.round(sl.t);
      B.wake();
    },
    leave: () => { sl.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "bagstand",
  means: "A paper bag dispenser tray: the top bag slides out toward the pointer, serrated mouth first, as far as the slider lets it.",
  rules: [1, 3, 4, 8],
  range: [30, 50, 60],
  tour: [[287, 242], [96, 146], [183, 190], null],
  mount,
});
