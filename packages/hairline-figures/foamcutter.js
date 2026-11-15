/**
 * Foam cutter: a hot wire stands taut from an overhead arm to the table, and
 * a foam block slides along the table through it to the pointer's x. At
 * rest the block sits just into the wire, the wire bright.
 */
const { Cam, fit, facing, clamp, lerp, poly, prism, proj, rings, seg, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const W = 150, D = 56, TZ = 5, WX = 75, WY = 28, AZ = 66, BW = 50, BD = 30, BH = 26, X0 = 0, X1 = W - BW, REST = 0.42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [WX, D, AZ + 6], [WX, WY, AZ + 6]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  // the column at the back and the arm over the wire
  const [cr, ci] = rings(WX - 4, D - 9, WX + 4, D - 1, 2, 1);
  put(solid(g), prism(P, front, cr, ci, TZ, AZ + 6));
  const [ar, ai] = rings(WX - 3, WY - 3, WX + 3, D - 1, 2, 1);
  put(solid(g), prism(P, front, ar, ai, AZ, AZ + 6));
  const low = mk("path", { class: "sil hi nf" }, g);
  const bg = mk("g", {}, g), block = solid(bg), slot = mk("path", { class: "nf lo" }, bg);
  const high = mk("path", { class: "sil hi nf" }, g);
  const by = WY - BD / 2;
  const t = spring(REST);
  let last = NaN, behind = null;
  function draw(v) {
    if (v === last) return;
    last = v;
    const x = lerp(X0, X1, v);
    const [r, i] = rings(x, by, x + BW, by + BD, 3, 1.5);
    put(block, prism(P, front, r, i, TZ, TZ + BH));
    const cut = clamp(x + BW, x, WX);
    slot.setAttribute("d", cut > x && WX > x ? seg(P(x + BW, WY, TZ + BH), P(Math.max(x, Math.min(x + BW, WX)), WY, TZ + BH)) : "");
    const over = WX > x && WX < x + BW, top = over ? TZ + BH : TZ;
    low.setAttribute("d", seg(P(WX, WY, TZ), P(WX, WY, top)));
    high.setAttribute("d", seg(P(WX, WY, top), P(WX, WY, AZ)));
    const b = x + BW <= WX;
    if (b !== behind) { behind = b; if (b) bg.after(low); else bg.before(low); }
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { t.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [wx] = unproj(C, p[0], p[1], 0);
    const v = clamp((wx - BW / 2 - X0) / (X1 - X0), 0, 1);
    t.t = v;
    read.textContent = "cut " + Math.round(clamp((lerp(X0, X1, v) + BW - WX) / BW, 0, 1) * 100);
    B.wake();
  }
  draw(REST); aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "foamcutter",
  means: "A hot wire foam cutter: the foam block slides along the table through the taut wire to wherever the pointer is.",
  rules: [1, 3, 5, 6],
  range: [0, 50, 100],
  tour: [[292, 237], [94, 138], [200, 190], null],
  mount,
});
