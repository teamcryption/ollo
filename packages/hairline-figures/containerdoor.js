/**
 * Container doors: a shipping container with its two end doors. The pointer
 * picks a door by which half of the end it stands over: that door swings
 * wide on its hinge, and the other closes to a crack. At rest the right door
 * stands ajar, bright. The slider is the swing of the chosen door.
 *
 * The pattern: one of two, swinging on hinges.
 */
const {
  Cam, fit, facing, poly, fillet, prism, proj, rings, unproj, seg, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, W = 40, H = 40, DW = W / 2, REST = [6, 28];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, 0, 0], [L, W, 0], [L + DW, -4, H], [L + DW, W + 4, 0], [0, 0, H + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, L, W, 3, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  // corrugation on the long side, the frame of the opening on the end
  let d = "";
  for (let x = 8; x < L - 4; x += 8) d += seg(P(x, W, 3), P(x, W, H - 3));
  mk("path", { d, class: "lo nf" }, g);
  mk("path", { d: poly(fillet([P(L, 3, 2), P(L, W - 3, 2), P(L, W - 3, H - 3), P(L, 3, H - 3)], [2, 2, 2, 2])), class: "lo nf" }, g);

  const doors = [0, 1].map((k) => {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), bars = mk("path", { class: "lo nf" }, grp);
    return { k, sil, bars, a: tween(REST[k]), last: NaN };
  });

  function draw(dr, ang) {
    if (ang === dr.last) return;
    dr.last = ang;
    const s = Math.sin(rad(ang)), c = Math.cos(rad(ang));
    const hy = dr.k === 0 ? 0 : W, dir = dr.k === 0 ? 1 : -1;
    const at = (t, z) => P(L + t * DW * s, hy + dir * t * DW * c, z);
    dr.sil.setAttribute("d", poly(fillet([at(0, 1), at(1, 1), at(1, H - 1), at(0, H - 1)], [1.5, 1.5, 1.5, 1.5])));
    dr.bars.setAttribute("d", seg(at(0.3, 3), at(0.3, H - 3)) + seg(at(0.75, 3), at(0.75, H - 3)) + seg(at(0.75, H * 0.45), at(0.95, H * 0.45)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const dr of doors) { draw(dr, tval(dr.a, now)); if (!tdone(dr.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < L - 50 || x > L + 40 || y < -30 || y > W + 30) return -1;
    return y < W / 2 ? 0 : 1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    doors.forEach((dr, k) => {
      tset(dr.a, a < 0 ? REST[k] : k === a ? open : 4, now, a < 0 ? 0 : Math.abs(k - a) * 40);
      dr.sil.classList.toggle("hi", k === (a < 0 ? 1 : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "door L" : "door R";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act >= 0) { tset(doors[act].a, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "containerdoor",
  means: "A shipping container's end doors: the door under the pointer swings wide on its hinge while the other closes to a crack.",
  rules: [1, 2, 5, 8],
  range: [40, 110, 160],
  tour: [[263, 248], [233, 263], [134, 196], null],
  mount,
});
