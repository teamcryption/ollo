/**
 * Cheques: a receipt printer on a counter, a slip of paper standing out of
 * the slot in its lid. The pointer's place along the printer sets how far the
 * slip has fed: across to the right and the slip rises long, with its printed
 * rows; back to the left and it draws in. At rest a short slip stands, bright.
 * The slider is the longest feed.
 *
 * The pattern: one continuous value (spring).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, seg, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 60, BY = 48, BH = 24, SY = 16, PX0 = 12, PX1 = 48, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxL = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-8, -8, 0], [BX + 8, BY + 8, 0], [BX + 8, -8, 0], [-8, BY + 8, 0], [PX0, SY - 20, BH + 66], [PX1, SY - 20, BH + 66]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-8, -8, BX + 8, BY + 8, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, 3));
  const [br, bi] = rings(0, 0, BX, BY, 7, 2);
  put(solid(g), prism(P, front, br, bi, 3, BH));
  // the lid's seam and the slot the slip feeds from
  mk("path", { d: seg(P(4, SY + 6, BH), P(BX - 4, SY + 6, BH)), class: "nf lo" }, g);
  mk("path", { d: seg(P(PX0 - 3, SY, BH), P(PX1 + 3, SY, BH)), class: "nf" }, g);
  const slip = mk("path", { class: "sil hi" }, g);
  const rows = mk("path", { class: "nf lo" }, g);
  const L = spring(REST);
  let last = NaN;

  function draw(l) {
    const r = Math.round(l * 10) / 10;
    if (r === last) return;
    last = r;
    const lean = r * 0.22, top = BH + r;
    const q = [P(PX0, SY, BH), P(PX1, SY, BH), P(PX1, SY - lean, top), P(PX0, SY - lean, top)];
    slip.setAttribute("d", poly(fillet(q, [0.5, 0.5, 2, 2], 3)));
    let d = "";
    for (let z = BH + 6, i = 0; z < top - 5; z += 6, i++) {
      const y = SY - (z - BH) * 0.22, w = i % 3 === 2 ? 0.55 : 0.8;
      d += seg(P(PX0 + 5, y, z), P(PX0 + 5 + (PX1 - PX0 - 10) * w, y, z));
    }
    rows.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(L, dt); draw(L.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BH);
    if (x < -10 || x > BX + 10 || y < -30 || y > BY + 10) return leave();
    const t = clamp((x - 4) / (BX - 8), 0, 1);
    L.t = 10 + t * (maxL - 10);
    read.textContent = Math.round(L.t) + " mm";
    B.wake();
  }
  function leave() { L.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw(L.x);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxL = v; }, destroy: bag.dispose };
}

hairline({
  name: "cheques",
  means: "A receipt printer: the pointer's place along it feeds the slip out of the lid, rows and all, or draws it back in.",
  rules: [1, 3, 5, 8],
  range: [30, 60, 66],
  tour: [[156, 173], [200, 195], [237, 214], null],
  mount,
});
