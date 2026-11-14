/**
 * Meeting table: a long table with three chairs down each side, tucked in at
 * uneven depths. The pointer picks a chair by where it stands: that chair
 * slides out from the table, bright, and its neighbours ease out a little,
 * staggered from it. At rest one chair is pulled out. The slider is the stagger.
 *
 * The pattern: one of many, picked on the ground (terrain).
 */
const {
  Cam, fit, facing, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TL = 132, TW = 54, TZ = 26, SH = 9, SZ = 15, BZ = 36, OUT = 20, FAV = 4;
const XS = [26, 66, 106];
const REST = [3, 6, 2, 5, OUT * 0.8, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0, -SH * 2 - OUT - 4, 0], [TL, -SH * 2 - OUT - 4, BZ], [0, TW + SH * 2 + OUT + 4, 0], [TL, TW + SH * 2 + OUT + 4, 0], [TL, TW + OUT, BZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const far = mk("g", {}, g), mid = mk("g", {}, g), near = mk("g", {}, g);

  const chairs = [];
  for (let k = 0; k < 6; k++) {
    const side = k < 3 ? -1 : 1, x = XS[k % 3];
    const grp = mk("g", {}, side < 0 ? far : near);
    const a = solid(grp), b = solid(grp), c = solid(grp);
    // far chairs: back then legs then seat; near: legs, seat, back
    const parts = side < 0 ? { back: a, leg: b, seat: c } : { leg: a, seat: b, back: c };
    chairs.push({ k, side, x, ...parts, z: tween(REST[k]), last: NaN });
  }
  // the table: a pedestal and a thick top
  const [pr, pi] = rings(TL / 2 - 30, TW / 2 - 6, TL / 2 + 30, TW / 2 + 6, 5, 1.2);
  put(solid(mid), prism(P, front, pr, pi, 0, TZ - 3));
  const [tr, ti] = rings(0, 0, TL, TW, 12, 2);
  put(solid(mid), prism(P, front, tr, ti, TZ - 3, TZ));

  function draw(ch, out) {
    if (out === ch.last) return;
    ch.last = out;
    const yc = ch.side < 0 ? -SH + 6 - out : TW + SH - 6 + out;
    const x0 = ch.x - SH, x1 = ch.x + SH, y0 = yc - SH, y1 = yc + SH;
    const [lr, li] = rings(ch.x - 2, yc - 2, ch.x + 2, yc + 2, 2, 0.6);
    put(ch.leg, prism(P, front, lr, li, 0, SZ - 3));
    const [sr, si] = rings(x0, y0, x1, y1, 4, 1.4);
    put(ch.seat, prism(P, front, sr, si, SZ - 3, SZ));
    const by = ch.side < 0 ? y0 : y1 - 2.4;
    const [br, bi] = rings(x0 + 1, by, x1 - 1, by + 2.4, 1.2, 0.5);
    put(ch.back, prism(P, front, br, bi, SZ, BZ));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const ch of chairs) { draw(ch, tval(ch.z, now)); if (!tdone(ch.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, SZ);
    let best = -1, bd = Infinity;
    chairs.forEach((ch, k) => {
      const yc = ch.side < 0 ? -SH : TW + SH;
      const d = Math.hypot(wx - ch.x, (wy - yc) * 0.8);
      if (d < bd) { bd = d; best = k; }
    });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    chairs.forEach((ch, k) => {
      const same = a >= 0 && chairs[a].side === ch.side, dd = a >= 0 ? Math.abs((k % 3) - (a % 3)) : 0;
      const z = a < 0 ? REST[k] : k === a ? OUT : same && dd === 1 ? 6 : 0;
      tset(ch.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const s of [ch.leg, ch.seat, ch.back]) s.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "seat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "meetingtable",
  means: "A meeting table with six chairs: the chair under the pointer slides out from the table, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[274, 104], [222, 78], [183, 203], null],
  mount,
});
