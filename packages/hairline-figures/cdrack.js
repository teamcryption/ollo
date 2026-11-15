/**
 * Record crate: a wooden crate packed with record sleeves. The pointer digs:
 * the sleeve under it stands upright, the ones in front fall forward and the
 * ones behind lean back, so a gap opens on it. At rest the crate is parted a
 * little behind the middle. The slider is how far the sleeves fall.
 */
const { Cam, clamp, fit, fillet, poly, proj, seg, rings, prism, facing, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const N = 9, GAP = 8.5, X0 = -((N - 1) * GAP) / 2, HW = 21, H = 44, Z0 = 3;
const CX = 46, CY = 26, CH = 17, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-CX - 22, -CY, 0], [CX + 22, CY, 0], [CX, -CY, 0], [-CX, CY, 0], [-CX, -CY, H + 4], [CX, CY, H + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-CX, -CY, CX, CY, 3, 1.2);
  put(solid(g), prism(P, front, cr, ci, 0, CH));
  const inner = mk("path", { class: "nf lo" }, g);
  const [ir] = rings(-CX + 3, -CY + 3, CX - 3, CY - 3, 1.5, 0.6);
  inner.setAttribute("d", poly(ir.map((q) => P(q.u, q.v, CH))));
  const sleeves = Array.from({ length: N }, (_, i) => {
    const el = mk("path", { class: "sil" }, g), disc = mk("path", { class: "nf lo" }, g);
    return { i, x: X0 + i * GAP, el, disc, tw: tween(0), last: NaN };
  });
  // the crate's near walls, painted over the sleeves' feet
  const lip = mk("path", { class: "sil" }, g);
  lip.setAttribute("d", poly(fillet([P(-CX, CY, CH), P(CX, CY, CH), P(CX, -CY, CH), P(CX, -CY, 0), P(CX, CY, 0), P(-CX, CY, 0)], [2, 2, 2, 2, 2, 2])));
  const slot = mk("path", { class: "nf lo" }, g);
  slot.setAttribute("d", seg(P(CX, -8, CH - 5), P(CX, 8, CH - 5)) + seg(P(-14, CY, CH - 5), P(14, CY, CH - 5)));
  let fall = value, sel = REST, over = false;

  const angleFor = (i, a) => (i === a ? 0 : i > a ? 26 : -16) * fall + (over ? 0 : (i > a ? 4 : 0));

  function drawSleeve(s, deg) {
    if (deg === s.last) return;
    s.last = deg;
    const t = (deg * Math.PI) / 180, sn = Math.sin(t), cs = Math.cos(t);
    const at = (y, h) => P(s.x + sn * h, y, Z0 + cs * h);
    s.el.setAttribute("d", poly(fillet([at(-HW, 0), at(HW, 0), at(HW, H), at(-HW, H)], [1, 1, 2, 2])));
    const ring = Array.from({ length: 28 }, (_, k) => { const a = (k / 28) * Math.PI * 2; return at(Math.cos(a) * 15, H / 2 + Math.sin(a) * 15); });
    s.disc.setAttribute("d", poly(ring));
  }

  const B = register(stage, (dt, now) => {
    let moving = false;
    for (const s of sleeves) { drawSleeve(s, tval(s.tw, now)); if (!tdone(s.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function choose(a) {
    sel = a;
    const now = performance.now();
    sleeves.forEach((s) => {
      tset(s.tw, angleFor(s.i, a), now, Math.abs(s.i - a) * 40);
      s.el.classList.toggle("hi", s.i === a);
    });
    read.textContent = over ? `no ${String(a + 1).padStart(2, "0")}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      let best = -1, bd = Infinity;
      sleeves.forEach((s) => { const d = Math.abs(P(s.x, 0, Z0 + H / 2)[0] - p[0]); if (d < bd) { bd = d; best = s.i; } });
      const [ , cy] = P(0, 0, H / 2);
      if (bd > GAP * 3 || Math.abs(p[1] - cy) > 110) { if (over) { over = false; choose(REST); } return; }
      over = true; choose(best);
    },
    leave: () => { over = false; choose(REST); },
  }));
  bag.add(() => svg.replaceChildren());
  choose(REST);
  return { set: (v) => { fall = v; choose(sel); }, destroy: bag.dispose };
}

hairline({
  name: "cdrack",
  means: "A crate of record sleeves: the one under the pointer stands up as those in front fall forward and those behind lean back.",
  rules: [1, 2, 3, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[151, 134], [236, 176], [249, 183], null],
  mount,
});
