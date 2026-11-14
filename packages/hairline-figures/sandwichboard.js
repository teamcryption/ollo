/**
 * Sandwich board: an A-frame sidewalk sign, two framed boards hinged along
 * the top, standing on a kerb slab. Where the pointer stands on the ground
 * sets how wide the legs spread: toward the near side the A opens, toward
 * the far side it folds nearly shut. The board on the pointer's side is
 * bright. At rest it stands half open, the front board bright.
 *
 * The pattern: a continuous input on the ground plane (terrain).
 */
const {
  Cam, clamp, fillet, fit, facing, poly, prism, proj, rings, spring, stepS, unproj, open,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 64, L = 76, REST = 0.36, MIN = 0.08, MAX = 0.62, SZ = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value / 100;
  const C = Cam(45, 0.5, 2.0);
  const sMax = L * Math.sin(MAX);
  fit(C, [[-10, -sMax - 8, 0], [X1 + 10, sMax + 8, 0], [X1 + 10, -sMax - 8, 0], [-10, sMax + 8, 0], [X0, 0, SZ + L], [X1, 0, SZ + L]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-10, -sMax - 8, X1 + 10, sMax + 8, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const mkBoard = () => ({ sil: mk("path", { class: "sil" }, g), edge: mk("path", { class: "nf lo" }, g), pane: mk("path", { class: "nf lo" }, g) });
  const back = mkBoard(), fore = mkBoard();
  const ang = spring(REST);
  let last = NaN;

  function board(b, sgn, a) {
    const s = L * Math.sin(a), h = L * Math.cos(a);
    const pt = (x, t) => P(x, sgn * s * t, SZ + h * (1 - t));
    b.sil.setAttribute("d", poly(fillet([pt(X0, 0), pt(X1, 0), pt(X1, 1), pt(X0, 1)], [2, 2, 2, 2])));
    const th = (x, t) => P(x, sgn * (s * t + 2), SZ + h * (1 - t));
    b.edge.setAttribute("d", open([th(X0, 0.04), th(X0, 1)]) + open([th(X0, 1), th(X1, 1)]));
    b.pane.setAttribute("d", poly(fillet([pt(X0 + 7, 0.12), pt(X1 - 7, 0.12), pt(X1 - 7, 0.86), pt(X0 + 7, 0.86)], [1.5, 1.5, 1.5, 1.5])));
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    board(back, -1, a);
    board(fore, 1, a);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function setSide(side) {
    back.sil.classList.toggle("hi", side < 0);
    fore.sil.classList.toggle("hi", side >= 0);
  }
  setSide(1);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [, y] = unproj(C, sx, sy, 0);
      const t = clamp(y / (sMax + 8), -1, 1);
      ang.t = clamp(REST + t * (MAX - MIN) * 0.5 * (0.4 + gain), MIN, MAX);
      setSide(t < 0 ? -1 : 1);
      read.textContent = Math.round((ang.t * 2 * 180) / Math.PI) + "°";
      B.wake();
    },
    leave: () => { ang.t = REST; setSide(1); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "sandwichboard",
  means: "An A-frame sidewalk sign: where the pointer stands on the ground opens its legs wide or folds them shut.",
  rules: [1, 3, 5, 8],
  range: [0, 60, 100],
  tour: [[257, 184], [143, 241], [132, 246], null],
  mount,
});
