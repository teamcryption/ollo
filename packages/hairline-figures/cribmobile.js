/**
 * Cribmobile: a cot with a mobile on a bent pole, four toys hanging from a
 * cross of arms. The pointer turns the mobile so the bright toy swings round
 * to face it; the other three follow on their arms. At rest the cross sits
 * a little turned. The slider is how far out the arms reach.
 *
 * The pattern: one part turning to face the pointer.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, rrect, circ, tdone, tset, tval, tween, clamp, unproj, seg, disposer, mk, pointer, put, register, solid } = HL;

const HZ = 92, DROP = 22, CW = 56, CD = 36, REST = 30;
const sh = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SHAPES = [() => circ(8, 32), () => rrect(-6, -6, 6, 6, 2, 3), () => circ(5, 24), () => rrect(-8, -4, 8, 4, 3, 3)];
const HS = [6, 10, 12, 6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-CW, -CD, 0], [CW, CD, 0], [CW, -CD, 0], [-CW, CD, 0], [-CW, -CD, HZ + 12], [44, 44, HZ - 40], [-44, -44, HZ]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-CW, -CD, CW, CD, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, 30));
  let bars = "";
  for (let i = 1; i < 8; i++) { const x = -CW + (i * 2 * CW) / 8; bars += seg(P(x, CD, 6), P(x, CD, 28)); }
  for (let i = 1; i < 5; i++) { const y = -CD + (i * 2 * CD) / 5; bars += seg(P(CW, y, 6), P(CW, y, 28)); }
  mk("path", { d: bars, class: "nf lo" }, g);
  mk("path", { d: seg(P(-CW + 3, -CD + 3, 30), P(-CW + 3, -CD + 3, HZ + 10)) + seg(P(-CW + 3, -CD + 3, HZ + 10), P(0, 0, HZ + 10)) + seg(P(0, 0, HZ + 10), P(0, 0, HZ)), class: "nf" }, g);
  const arms = mk("path", { class: "nf lo" }, g);
  const toys = SHAPES.map((f, k) => { const grp = mk("g", {}, g), str = mk("path", { class: "nf lo" }, grp), s = solid(grp); return { k, ring: f(), grp, str, s }; });
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    let d = "";
    const pos = toys.map((t) => { const r = ((a + t.k * 90) * Math.PI) / 180; return [reach * Math.cos(r), reach * Math.sin(r)]; });
    pos.forEach(([x, y]) => { d += seg(P(0, 0, HZ), P(x, y, HZ)); });
    arms.setAttribute("d", d);
    toys.map((t, k) => ({ t, x: pos[k][0], y: pos[k][1] })).sort((p, q) => p.x + p.y - (q.x + q.y)).forEach(({ t, x, y }) => {
      const z1 = HZ - DROP - t.k * 5, z0 = z1 - HS[t.k];
      t.str.setAttribute("d", seg(P(x, y, HZ), P(x, y, z1)));
      put(t.s, prism(P, front, sh(t.ring, x, y), sh(t.ring, x, y), z0, z1));
      g.appendChild(t.grp);
    });
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  toys[0].s.sil.classList.add("hi");

  let cur = REST;
  function aim(p) {
    let tgt = REST;
    if (p) { const [x, y] = unproj(C, p[0], p[1], 0); tgt = (Math.atan2(y, x) * 180) / Math.PI; }
    let d = ((tgt - cur) % 360 + 540) % 360 - 180;
    if (Math.abs(d) < 1) return;
    cur += d;
    tset(ang, cur, performance.now(), 0);
    read.textContent = p ? Math.round(((cur % 360) + 360) % 360) + "°" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 24, 40); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cribmobile",
  means: "A cot mobile: the pointer turns the cross of arms so the bright toy swings round to face it, the other toys following.",
  rules: [1, 3, 4, 5],
  range: [24, 34, 40],
  tour: [[119, 286], [281, 286], [79, 266], null],
  mount,
});
