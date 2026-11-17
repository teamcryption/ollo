/**
 * Crossbow: a long stock with a bow across its nose, a bolt in the groove
 * and the string drawn back to the nut. The pointer, moving back along the
 * stock, spans the string further: the limbs bend and the string pulls back.
 * At rest the string is half spanned, bright. The slider is the full draw.
 *
 * The pattern: one part pulled along its rail.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XB = 96, HW = 46, SZ = 7, REST = 0.3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, -5, 0], [XB + 14, 5, 0], [XB, -HW, SZ], [XB, HW, SZ], [XB - 30, HW, SZ], [XB - 30, -HW, SZ]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // butt, then stock
  const [ar, ai] = rings(-4, -7, 22, 7, 4, 1.2);
  put(solid(g), prism(P, front, ar, ai, -6, SZ - 1));
  const [sr, si] = rings(0, -4, XB + 6, 4, 2, 1);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  // the trigger under the stock
  mk("path", { d: poly(hull([P(40, 0, 0), P(46, 0, 0), P(42, 0, -9), P(39, 0, -9), P(40, 1, 0), P(42, 1, -9)])) }, g);
  // stirrup at the nose
  mk("path", { d: open([P(XB + 4, -5, SZ - 2), P(XB + 14, -6, SZ - 2), P(XB + 16, 0, SZ - 2), P(XB + 14, 6, SZ - 2), P(XB + 4, 5, SZ - 2)]), class: "nf" }, g);
  const bolt = mk("path", { class: "nf" }, g);
  const limb = mk("path", {}, g), str = mk("path", { class: "nf sil hi" }, g);
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const t = sp.x * reach;
    if (t === drawn) return;
    drawn = t;
    const bend = 4 + 16 * t, nock = XB - 6 - 56 * t, w = HW - 4 * t;
    const up = [], dn = [];
    for (let k = 0; k <= 16; k++) {
      const y = -w + (2 * w * k) / 16, x = XB - bend * (y / w) ** 2;
      up.push(P(x + 3, y, SZ + 1)); dn.push(P(x - 1, y, SZ + 1));
    }
    limb.setAttribute("d", poly(up.concat(dn.reverse())));
    str.setAttribute("d", open([P(XB - bend, -w, SZ + 2), P(nock, 0, SZ + 2), P(XB - bend, w, SZ + 2)]));
    bolt.setAttribute("d", poly(hull([P(nock, -1.5, SZ), P(nock, 1.5, SZ), P(nock + 50, -1.5, SZ), P(nock + 50, 1.5, SZ), P(nock + 56, 0, SZ + 1), P(nock, 0, SZ + 3)])));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const a = P(XB, 0, SZ)[0], b = P(XB - 62, 0, SZ)[0];
  function set(t) {
    sp.t = t;
    read.textContent = t === REST ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  set(REST);
  bag.add(pointer(stage, {
    move: ([sx]) => set(Math.round(clamp((a - sx) / (a - b), 0.1, 1) * 20) / 20),
    leave: () => set(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; drawn = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "crossbow",
  means: "A crossbow with a bolt in its groove: moving back along the stock spans the string, the limbs bending as it pulls back.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[240, 170], [180, 145], [123, 118], null],
  mount,
});
