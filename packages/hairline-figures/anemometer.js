/**
 * Anemometer: a mast with a three-cup rotor on top. The pointer is the wind:
 * the rotor turns on its spring so the nearest cup swings round to face it,
 * and that cup is bright. At rest the rotor stands a little turned, one cup
 * bright. The slider is how stiff the rotor's spring is.
 */
const {
  Cam, circ, facing, fit, prism, proj, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 46, R = 30, CR = 7.5, CH = 9, REST = 0.35, FAV = 0;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.0);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(R + CR) * Math.cos(a), (R + CR) * Math.sin(a), H + CH], [14 * Math.cos(a), 14 * Math.sin(a), 0]); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(14, 48), circ(12.6, 48), 0, 3));
  put(solid(g), prism(P, front, circ(2.2, 20), null, 3, H - 2));
  const parts = [];
  for (let i = 0; i < 3; i++) {
    const grp = mk("g", {}, g);
    const arm = mk("path", { class: "nf sil", d: "" }, grp);
    parts.push({ i, grp, arm, cup: solid(grp), off: (i * 2 * Math.PI) / 3 });
  }
  const hub = { grp: mk("g", {}, g) };
  hub.s = solid(hub.grp);
  put(hub.s, prism(P, front, circ(4.5, 28), circ(3.4, 28), H - 2, H + 3));
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const items = [];
    for (const p of parts) {
      const a = sp.x + p.off, cx = R * Math.cos(a), cy = R * Math.sin(a);
      p.arm.setAttribute("d", seg(P(3.5 * Math.cos(a), 3.5 * Math.sin(a), H), P(cx, cy, H)));
      put(p.cup, prism(P, front, disc(cx, cy, CR), disc(cx, cy, CR - 1.4), H - CH / 2, H + CH / 2));
      items.push({ d: cx + cy, grp: p.grp });
    }
    items.push({ d: 0, grp: hub.grp });
    items.sort((a, b) => a.d - b.d);
    for (const it of items) g.append(it.grp);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let on = FAV;
    if (over) {
      const w = Math.atan2(over[1], over[0]);
      let best = 0, bd = Infinity;
      for (const p of parts) { const d = Math.abs(wrap(w - (sp.t + p.off))); if (d < bd) { bd = d; best = p.i; } }
      sp.t = sp.t + wrap(w - (sp.t + parts[best].off));
      on = best;
    } else sp.t = sp.t + wrap(REST - sp.t);
    for (const p of parts) p.cup.sil.classList.toggle("hi", p.i === on);
    read.textContent = over ? "cup " + (on + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], H);
      over = Math.hypot(x, y) > R + 40 || Math.hypot(x, y) < 3 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "anemometer",
  means: "An anemometer's three-cup rotor: the rotor turns so the cup nearest the pointer swings round to it, and that cup is bright.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.6],
  tour: [[138, 102], [268, 96], [270, 172], null],
  mount,
});
