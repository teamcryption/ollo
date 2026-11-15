/**
 * Towel warmer: a spa cabinet on a low plinth, two doors hinged at its outer
 * edges, rolled towels stacked on the shelves behind them. The pointer picks
 * a door by where it stands: the door swings open on its hinge to show the
 * rolls, and the other door eases a little ajar after it. At rest the right
 * door stands ajar, bright. The slider is the stagger.
 *
 * The pattern: one of two, each swinging on a vertical hinge.
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 92, D = 46, Z0 = 8, Z1 = 92, HW = W / 2, OPEN = 112, FAV = 1, T = 2.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-4, -4, 0], [W + 4, -4, Z1 + 4], [W + 18, D + HW, Z1], [-18, D + HW, 0], [W + 4, D + 4, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, W + 4, D + 4, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));
  const [br, bi] = rings(0, 0, W, D, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  // the opening, a shelf, and the rolled towels on it
  const fr = (x0, z0, x1, z1) => [[x0, D, z0], [x1, D, z0], [x1, D, z1], [x0, D, z1]].map((p) => P(...p));
  mk("path", { d: poly(fillet(fr(5, Z0 + 5, W - 5, Z1 - 5), [3, 3, 3, 3])), class: "nf lo" }, g);
  const mid = (Z0 + Z1) / 2;
  mk("path", { d: poly(fr(5, mid - 1, W - 5, mid + 1)), class: "nf lo" }, g);
  const roll = (cx, cz, r) => { const pts = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI; pts.push(P(cx + r * Math.cos(t), D, cz + r * Math.sin(t))); } return poly(pts); };
  for (const cz of [Z0 + 5 + 10, mid + 1 + 10]) for (let c = 0; c < 4; c++) {
    const cx = 15 + c * 20.5;
    mk("path", { d: roll(cx, cz, 9.5), class: "nf" }, g);
    mk("path", { d: roll(cx + 1, cz, 4), class: "nf lo" }, g);
  }

  const doors = [0, 1].map((k) => {
    const grp = mk("g", {}, g);
    const rest = k === FAV ? 30 : 4;
    return { k, grp, sil: mk("path", { class: "sil" }, grp), face: mk("path", { class: "nf lo" }, grp), bar: mk("path", { class: "nf" }, grp), rest, a: tween(rest), last: NaN };
  });
  // a point on a door: w from its hinge, z up, o out along its normal
  const at = (k, a, w, z, o) => {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), dir = k === 0 ? 1 : -1;
    return P((k === 0 ? 0.6 : W - 0.6) + dir * (w * c - o * s), D + 0.4 + w * s + o * c, z);
  };
  const DW = HW - 1.2;
  function draw(d, a) {
    if (a === d.last) return;
    d.last = a;
    const pts = [];
    for (const o of [0, T]) for (const [w, z] of [[0, Z0 + 1], [DW, Z0 + 1], [DW, Z1 - 1], [0, Z1 - 1]]) pts.push(at(d.k, a, w, z, o));
    const hl = hull(pts);
    d.sil.setAttribute("d", poly(fillet(hl, hl.map(() => 3))));
    const show = d.k === 0 ? a < 95 : true;
    d.face.setAttribute("d", show ? poly(fillet([[3, Z0 + 4], [DW - 3, Z0 + 4], [DW - 3, Z1 - 4], [3, Z1 - 4]].map(([w, z]) => at(d.k, a, w, z, T)), [3, 3, 3, 3])) : "");
    d.bar.setAttribute("d", show ? poly(fillet([[DW - 8, mid - 12], [DW - 5, mid - 12], [DW - 5, mid + 12], [DW - 8, mid + 12]].map(([w, z]) => at(d.k, a, w, z, T + 0.6)), [1.5, 1.5, 1.5, 1.5])) : "");
  }
  // the left door, swung out toward the viewer, is nearer than the right one
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of doors) { draw(d, tval(d.a, now)); if (!tdone(d.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  doors[1].grp.after(doors[0].grp);

  const mids = [P(HW / 2, D, mid), P(W - HW / 2, D, mid)];
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    doors.forEach((d, k) => {
      const to = a < 0 ? d.rest : k === a ? OPEN : 14;
      tset(d.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "door L" : "door R";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "towelwarmer",
  means: "A towel warmer cabinet: the door under the pointer swings open on its hinge to show the rolled towels, the other eases ajar.",
  rules: [1, 2, 5, 6],
  range: [0, 60, 120],
  tour: [[178, 132], [206, 101], [235, 160], null],
  mount,
});
