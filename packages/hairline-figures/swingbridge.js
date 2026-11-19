/**
 * Swing bridge: a road deck balanced on a round pier in mid-channel, stayed
 * from a small tower at its middle, between two stone banks. The pointer over
 * the channel swings the deck round on its pivot to let boats through; leaving
 * swings it back. At rest it stands just off its banks, bright. The slider is
 * how far round it swings.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 46, BE = 70, BW = 44, ZB = 14, DL = 45, DW = 8.5, DT = 5.5, TZ = 38, REST = 0.1, OPEN = 1.5;

function spin(ring, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-BE, -DL, -4], [BE, DL, -4], [BE, -DL, -4], [-BE, DL, -4], [0, -DL, TZ], [-BE, -BW, TZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-BE - 4, -DL - 4, BE + 4, DL + 4, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, -4, 0));
  for (const [x0, x1] of [[-BE, -BX], [BX, BE]]) {
    const [r, i] = rings(x0, -BW, x1, BW, 3, 1.4);
    put(solid(g), prism(P, front, r, i, 0, ZB));
  }
  put(solid(g), prism(P, front, circ(9, 32), circ(7.6, 32), 0, ZB));
  const deck = solid(g), rails = mk("path", { class: "nf lo" }, g), stays = mk("path", { class: "nf lo" }, g), tower = solid(g);
  deck.sil.classList.add("hi");
  const [dr, di] = rings(-DL, -DW, DL, DW, 2, 1.2);
  const [tr, ti] = rings(-3.5, -5, 3.5, 5, 1.5, 0.8);

  const tw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), W = (u, v, z) => P(u * c - v * s, u * s + v * c, z);
    const z1 = ZB + DT;
    put(deck, prism(P, front, spin(dr, a), spin(di, a), ZB + 0.5, z1));
    let r = "";
    for (const v of [-DW + 1, DW - 1]) {
      r += seg(W(-DL + 3, v, z1 + 4), W(DL - 3, v, z1 + 4));
      for (let u = -DL + 3; u <= DL - 3; u += 11.5) r += seg(W(u, v, z1), W(u, v, z1 + 4));
    }
    rails.setAttribute("d", r);
    let st = "";
    for (const v of [-4, 4]) for (const u of [-DL + 4, -DL / 2, DL / 2, DL - 4]) st += seg(W(0, v * 0.6, TZ), W(u, v, z1 + 4));
    stays.setAttribute("d", st);
    put(tower, prism(P, front, spin(tr, a), spin(ti, a), z1, TZ));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const to = on > 0 ? REST + (OPEN - REST) * reach : REST;
    tset(tw, to, performance.now(), 0);
    read.textContent = on > 0 ? `${Math.round((to * 180) / Math.PI)}°` : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZB);
    setActive(Math.abs(x) < BE + 10 && Math.abs(y) < DL + 10 ? 1 : -1);
  }
  bag.add(pointer(stage, { move, leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  setActive(-1);
  return { set: (v) => { reach = v; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "swingbridge",
  means: "A swing bridge whose stayed road deck turns round on its mid-channel pier to open the way when the pointer comes over it.",
  rules: [1, 3, 4, 5],
  range: [0.3, 1, 1],
  tour: [[218, 175], [168, 120], [232, 220], null],
  mount,
});
