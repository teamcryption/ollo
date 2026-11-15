/**
 * Sheet rack: a slotted floor rack of sheet metal, the sheets standing on
 * edge, cut to uneven heights and pushed in unevenly. The pointer picks a
 * sheet by its rest position and that sheet slides out of its slot toward
 * the reader, its neighbours easing out a little after it. At rest one sheet
 * stands proud and bright. The slider is how far the chosen sheet slides.
 *
 * The pattern: a single row picked by rest screen x (rule 01), a 700ms tween
 * per sheet staggered by distance (rule 02); sheets lie in planes of constant
 * x, so painting by x stays honest however far they slide.
 */
const {
  Cam, fit, prism, proj, rings, facing, seg, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 9, GAP = 8, X0 = -32, HT = [44, 52, 40, 48, 56, 42, 50, 38, 46], OUT = [2, 0, 4, 1, 6, 0, 3, 1, 2], FAV = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-42, -26, 0], [42, 26, 0], [-42, -26, 58], [42, 58, 58]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let reach = value;

  const [bo, bi] = rings(-42, -26, 42, 26, 4, 1.4);
  put(solid(g), prism(P, front, bo, bi, 0, 5));
  let d = "";
  for (let i = 0; i <= N; i++) { const x = X0 - GAP / 2 + i * GAP; d += seg(P(x, -24, 5), P(x, 24, 5)); }
  mk("path", { class: "nf lo", d }, g);
  const [po, pi] = rings(-41, -25, -37, -21, 1.5, 0.8);
  put(solid(g), prism(P, front, po, pi, 5, 30));

  const sheets = [];
  for (let i = 0; i < N; i++) {
    const s = solid(g);
    sheets.push({ i, x: X0 + i * GAP, s, tw: tween(OUT[i]), drawn: NaN, sx: P(X0 + i * GAP, 0, HT[i] / 2)[0] });
  }
  const [qo, qi] = rings(37, -25, 41, -21, 1.5, 0.8);
  put(solid(g), prism(P, front, qo, qi, 5, 30));

  function draw(sh, now) {
    const y = tval(sh.tw, now);
    if (Math.abs(y - sh.drawn) < 1e-3) return;
    sh.drawn = y;
    const [o, i] = rings(sh.x - 0.8, -22 + y, sh.x + 0.8, 22 + y, 0.6, 0.3);
    put(sh.s, prism(P, front, o, i, 5, 5 + HT[sh.i]));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const sh of sheets) { draw(sh, now); if (!tdone(sh.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let sel = -1;
  function choose(a) {
    if (a === sel && a !== -1) return;
    sel = a;
    const now = performance.now();
    for (const sh of sheets) {
      const k = Math.abs(sh.i - a);
      const to = a < 0 ? OUT[sh.i] : k === 0 ? 30 * reach : k === 1 ? 9 * reach : k === 2 ? 3 * reach : 0;
      tset(sh.tw, to, now, a < 0 ? 0 : k * 45);
      sh.s.sil.classList.toggle("hi", a < 0 ? sh.i === FAV : k === 0);
    }
    read.textContent = a < 0 ? "rest" : "sheet " + (a + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let best = -1, bd = Infinity;
      for (const sh of sheets) { const dd = Math.abs(p[0] - sh.sx); if (dd < bd) { bd = dd; best = sh.i; } }
      choose(bd < 30 ? best : -1);
    },
    leave: () => choose(-1),
  }));
  bag.add(() => svg.replaceChildren());
  sel = 0; choose(-1);
  for (const sh of sheets) draw(sh, performance.now());
  return { set: (v) => { reach = v; const a = sel; sel = -2; choose(a); }, destroy: bag.dispose };
}

hairline({
  name: "sheetrack",
  means: "A slotted rack of sheet metal on edge: the sheet under the pointer slides out toward you, its neighbours easing after it.",
  rules: [1, 2, 3, 5, 6, 8],
  range: [0.5, 1, 1.3],
  tour: [[147, 148], [253, 201], [200, 164], null],
  mount,
});
