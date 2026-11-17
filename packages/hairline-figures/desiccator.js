/**
 * Desiccator: three heavy glass desiccators on a bench, each with a domed
 * lid and knob over a flanged pot. The pointer picks one by where it stands:
 * its lid slides off toward the viewer to show the perforated plate inside,
 * and the lids beside it slide a little, staggered. At rest one lid sits
 * half open, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 56, R = 20, SL = 30, FAV = 1, CZ = 3;
const X1 = (N - 1) * STEP + 2 * (R + 4);
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const Y1 = 2 * (R + 4) + SL;
  fit(C, [[-4, -4, 0], [X1 + 4, Y1, 0], [X1 + 4, -4, 0], [-4, Y1, 0], [R + 4, R + 4, CZ + 50], [X1 - R - 4, R + 4, CZ + 50]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, Y1, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 4 + k * STEP, y = R + 4, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R - 6), disc(x, y, R - 8), CZ, CZ + 4));
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 2), CZ + 4, CZ + 26));
    put(solid(grp), prism(P, front, disc(x, y, R + 3), disc(x, y, R - 1), CZ + 24, CZ + 27));
    mk("path", { d: poly(ringAt(P, disc(x, y, R - 3), CZ + 20)), class: "nf lo" }, grp);
    for (let a = 0; a < 6; a++) {
      const t = (a / 6) * Math.PI * 2, d = mk("circle", { r: 1.3, class: "dot off" }, grp), q = P(x + 9 * Math.cos(t), y + 9 * Math.sin(t), CZ + 20);
      d.setAttribute("cx", q[0]); d.setAttribute("cy", q[1]);
    }
    const lid = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp), knob = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, lid, rim, knob, s: tween(k === FAV ? SL * 0.5 : 0), last: NaN });
  }

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const base = CZ + 27, y = it.y + s, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, y, (R + 3) * Math.cos(t), 32), base + 13 * Math.sin(t))); }
    it.lid.setAttribute("d", poly(hull(pts)));
    it.rim.setAttribute("d", poly(ringAt(P, disc(it.x, y, R + 1, 40), base + 1.4)));
    const top = base + 13;
    it.knob.setAttribute("d", poly(hull(ringAt(P, disc(it.x, y, 4, 16), top - 1).concat(ringAt(P, disc(it.x, y, 4, 16), top + 5)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + 20));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? (k === FAV ? SL * 0.5 : 0) : dd === 0 ? SL : dd === 1 ? 7 : 0;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "desiccator",
  means: "Three glass desiccators on a bench: the lid under the pointer slides off to show the plate inside, its neighbours slide a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[138, 100], [300, 180], [219, 140], null],
  mount,
});
