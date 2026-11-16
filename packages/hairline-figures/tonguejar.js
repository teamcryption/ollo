/**
 * Swab jar: three lidded glass jars on a tray, cotton swabs packed inside.
 * The pointer picks a jar by where it stands: its lid swings open on the back
 * hinge and the swabs rise from the mouth; the jars beside it open a little,
 * staggered from it. At rest the middle lid is ajar, bright.
 */
const { Cam, circ, fit, hull, poly, proj, rings, seg, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const N = 3, STEP = 40, R = 15, HS = [42, 52, 38], REST = [0.1, 0.45, 0.2], FAV = 1, AMT = [1, 0.4, 0.15];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SW = [[-6, -3], [-1, 4], [5, -4], [3, 5], [-4, 6]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-4, -4, 0], [118, -4, 0], [118, 40, 0], [-4, 40, 0], [60, 0, 92], [100, 0, 78], [20, 0, 70]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const W = (tf, ring, z) => ring.map((q) => P(...tf([q.u, q.v, z])));
  const body = (s, [o, i], z0, z1, tf) => {
    s.sil.setAttribute("d", poly(hull(W(tf, o, z0).concat(W(tf, o, z1)))));
    s.cr.setAttribute("d", poly(W(tf, i, z1)));
  };
  const id = (p) => p;
  body(solid(g), rings(-4, -4, 118, 40, 6, 2), 0, 4, id);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 18 + k * STEP, y = 18, top = 4 + HS[k], grp = mk("g", {}, g);
    const jar = solid(grp);
    body(jar, [disc(x, y, R), disc(x, y, R - 2)], 4, top, id);
    const sw = mk("path", { class: "nf" }, grp), tips = SW.map(() => solid(grp));
    const lid = solid(grp), knob = solid(grp);
    const draw = (v) => {
      const a = v * 1.75, c = Math.cos(a), s = Math.sin(a), hy = y - R;
      const tf = ([px, py, pz]) => { const dy = py - hy, dz = pz - top; return [px, hy + dy * c - dz * s, top + dy * s + dz * c]; };
      const rise = v * 20;
      let d = "";
      SW.forEach(([u, w], j) => {
        const z1 = top - 6 + rise + j * 1.5;
        if (z1 > top) d += seg(P(x + u, y + w, top), P(x + u, y + w, z1));
        body(tips[j], [disc(x + u, y + w, 1.8, 10), disc(x + u, y + w, 1, 10)], z1, z1 + 4, id);
        if (z1 <= top - 3) { tips[j].sil.setAttribute("d", ""); tips[j].cr.setAttribute("d", ""); }
      });
      sw.setAttribute("d", d);
      body(lid, [disc(x, y, R + 1), disc(x, y, R - 1)], top, top + 6, tf);
      body(knob, [disc(x, y, 3.5, 16), disc(x, y, 2.2, 16)], top + 6, top + 10, tf);
    };
    items.push({ s: lid, draw, tw: tween(REST[k]), last: NaN, mid: P(x, y, top / 2) });
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
    return bd < 42 && Math.abs(items[best].mid[1] - sy) < 90 ? best : -1;
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
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tonguejar",
  means: "Three swab jars on a tray: the jar under the pointer swings its lid open and the swabs rise; the jars beside it open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[141, 92], [202, 122], [263, 152], null],
  mount,
});
