/**
 * Vending machine: a tall cabinet with a glass front, three columns by four
 * rows of spiral slots each holding a pack, a keypad panel beside the glass
 * and a drop tray below. The pointer picks a slot on the glass: its pack
 * slides forward off its spiral and dips, and the packs around it nudge
 * forward, staggered from it. At rest one pack sits forward, bright. The
 * slider is the stagger.
 *
 * The pattern: a grid on a face plane (depositboxes); the pick is the pack
 * whose resting centre is nearest the pointer on screen.
 */
const {
  Cam, facing, fit, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 40, D = 26, H = 92, COLS = [8, 17, 26], ROWS = [72, 58, 44, 30], PW = 6, PH = 9, PD = 6;
const OUT = 6, FAV = 7, REST = (k) => (k === FAV ? 2.5 : (k * 7) % 3 === 0 ? 0.6 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H], [W, 0, H], [0, D + 2, H]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 3, 1.4);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 0, H));
  const face = (u0, z0, u1, z1, r) => poly(rrect(u0, z0, u1, z1, r, 4).map((q) => P(q.u, D, q.v)));
  mk("path", { class: "nf lo", d: face(3, 24, 31, 86, 2) + face(5, 6, 29, 17, 2) + face(33, 50, 38, 80, 1.2) + face(33, 30, 38, 34, 0.8) + seg(P(7, D, 12), P(27, D, 12)) }, body.g);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) place(flatDot(body.g, C, 0.55, "dot off"), P(34.2 + i * 1.8, D, 74 - j * 3));

  const packs = [];
  ROWS.forEach((z, r) => COLS.forEach((x, c) => {
    const k = r * 3 + c, grp = mk("g", {}, g), coil = [];
    for (let i = 0; i <= 48; i++) { const t = (i / 48) * Math.PI * 2 * 4; coil.push(P(x + 3.6 * Math.cos(t), D - 14 + (i / 48) * 12, z + 3.2 + 3.6 * Math.sin(t))); }
    mk("path", { class: "nf lo", d: open(coil) }, grp);
    packs.push({ k, r, c, x, z, el: solid(grp), y: tween(REST(k)), last: NaN });
  }));

  function draw(p, y) {
    if (y === p.last) return;
    p.last = y;
    const y0 = D - 10 + y, dip = Math.max(0, y - 4) * 0.6;
    const [ri, ii] = rings(p.x - PW / 2, y0, p.x + PW / 2, y0 + PD, 1, 0.6);
    put(p.el, prism(P, front, ri, ii, p.z + 1 - dip, p.z + 1 + PH - dip));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of packs) { draw(p, tval(p.y, now)); if (!tdone(p.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = packs.map((p) => P(p.x, D - 4, p.z + 1 + PH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 18 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), A = packs[a >= 0 ? a : act >= 0 ? act : FAV];
    act = a;
    packs.forEach((p) => {
      const d = Math.max(Math.abs(p.r - A.r), Math.abs(p.c - A.c));
      const y = a < 0 ? REST(p.k) : d === 0 ? OUT : d === 1 ? 1.6 : 0.4;
      tset(p.y, y, now, Math.hypot(p.r - A.r, p.c - A.c) * stag);
      p.el.sil.classList.toggle("hi", p.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slot " + "ABCD"[packs[a].r] + (packs[a].c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "vendingmachine",
  means: "A vending machine: the pack in the slot under the pointer slides forward off its spiral, the packs around it nudge.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[160, 86], [196, 147], [196, 206], null],
  mount,
});
