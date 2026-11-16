/**
 * Glove dispenser: a wall holder with three glove boxes side by side, a tuft
 * of glove poking from each top slot. The pointer picks a box by where it
 * stands: it slides out of the holder, and the boxes beside it slide a little,
 * staggered from it. At rest the middle box is half out, bright.
 */
const { Cam, circ, fit, hull, poly, proj, rings, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const N = 3, STEP = 42, OUT = 26, REST = [0.15, 0.55, 0.05], FAV = 1, AMT = [1, 0.45, 0.2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -8, 0], [128, -8, 40], [128, 40 + OUT, 0], [-4, 40 + OUT, 0], [128, 40 + OUT, 34]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const W = (dy, ring, z) => ring.map((q) => P(q.u, q.v + dy, z));
  const body = (s, [o, i], z0, z1, dy = 0) => {
    s.sil.setAttribute("d", poly(hull(W(dy, o, z0).concat(W(dy, o, z1)))));
    s.cr.setAttribute("d", poly(W(dy, i, z1)));
  };
  body(solid(g), rings(-4, -8, 128, -3, 2, 1), 0, 40);
  body(solid(g), rings(-4, -3, 128, 40, 3, 1.5), 0, 3);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + 38, grp = mk("g", {}, g);
    const s = solid(grp), slot = mk("path", { class: "nf lo" }, grp), tuft = mk("path", { class: "nf" }, grp);
    const R = rings(x0, 0, x1, 36, 3, 1.4), SL = rings(x0 + 9, 11, x1 - 9, 25, 5, 1)[0];
    const puff = [];
    for (const [r, z] of [[6, 0], [5, 3], [3, 6]]) puff.push(circ(r, 16).map((q) => ({ u: q.u + (x0 + x1) / 2, v: q.v * 0.6 + 18, z: 24 + z })));
    const draw = (v) => {
      const dy = v * OUT;
      body(s, R, 3, 24, dy);
      slot.setAttribute("d", poly(W(dy, SL, 24)));
      tuft.setAttribute("d", poly(hull(puff.flatMap((ring) => ring.map((q) => P(q.u, q.v + dy, q.z))))));
    };
    items.push({ s, draw, tw: tween(REST[k]), last: NaN, mid: P((x0 + x1) / 2, 18, 14) });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { const v = tval(it.tw, now); if (v !== it.last) { it.last = v; it.draw(v); } if (!tdone(it.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 45 && Math.abs(items[best].mid[1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.tw, a < 0 ? REST[k] : AMT[Math.abs(k - a)], now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "glovedispenser",
  means: "A wall holder of three glove boxes: the box under the pointer slides out, and the boxes beside it slide a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[153, 85], [214, 115], [275, 145], null],
  mount,
});
