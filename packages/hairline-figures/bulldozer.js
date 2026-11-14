/**
 * Bulldozer: a crawler dozer on two rounded tracks, a body, a cab and a wide
 * blade on two push arms. The pointer stands on the ground: the nearer it
 * comes to the blade end, the higher the blade lifts on its arms, on a
 * spring. At rest the blade hangs just off the ground, bright. The slider is
 * how high the blade can rise.
 *
 * The pattern: a part following the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 64, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-2, -6, 0], [BX + 5, 42, 0], [BX + 5, -6, 0], [-2, 42, 0], [20, 18, 40], [BX + 5, -6, 22 + 16], [BX + 5, 42, 22 + 16]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };

  block(0, 0, 56, 9, 6, 1.5, 0, 12);          // far track
  block(6, 8, 48, 28, 3, 1.5, 9, 22);         // body
  block(30, 10, 48, 26, 2, 1.2, 22, 27);      // engine hood
  block(9, 10, 29, 26, 3, 1.5, 22, 40);       // cab
  block(0, 27, 56, 36, 6, 1.5, 0, 12);        // near track
  // tread marks on the near track's side: a few dim drops
  const tread = mk("path", { class: "lo nf" }, g);
  let td = "";
  for (let x = 10; x <= 46; x += 9) td += seg(P(x, 36, 2), P(x, 36, 10));
  tread.setAttribute("d", td);

  const arms = mk("path", { class: "nf" }, g);
  const blade = solid(g);
  blade.sil.classList.add("hi");
  const [bo, bi] = rings(BX, -5, BX + 4, 41, 1.6, 0.7);

  const lift = spring(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(blade, prism(P, front, bo, bi, z, z + 16));
    let d = "";
    for (const y of [4.5, 31.5]) d += seg(P(40, y, 7), P(BX, y, z + 6)) + seg(P(44, y, 15), P(BX, y, z + 12));
    arms.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [u, v] = unproj(C, p[0], p[1], 0);
    if (u < -12 || u > BX + 18 || v < -16 || v > 52) return leave();
    const t = clamp(u / BX, 0, 1);
    lift.t = REST + t * (max - REST);
    read.textContent = "blade " + Math.round(t * 100) + "%";
    B.wake();
  }
  function leave() { lift.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (lift.t > REST) lift.t = Math.min(lift.t, max); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bulldozer",
  means: "A crawler bulldozer: the nearer the pointer comes to the blade end, the higher the blade lifts on its push arms.",
  rules: [1, 3, 5, 8],
  range: [8, 15, 22],
  tour: [[154, 174], [205, 200], [255, 225], null],
  mount,
});
