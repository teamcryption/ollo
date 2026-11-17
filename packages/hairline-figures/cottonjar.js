/**
 * Cotton jar: a round glass jar holding a stack of cotton pads, its deep lid
 * sitting ajar and bright at rest. Over the jar the lid lifts and tips back on
 * its far edge, and the pad stack rises to meet the hand. The slider is how
 * far the lid opens.
 *
 * The pattern: one object, one part that opens (cloches, single).
 */
const { Cam, circ, fit, hull, poly, proj, ringAt, rad, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const R = 34, H = 30, LH = 12;
const disc = (x, y, r, n = 44) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, 0], [R, -R, 0], [-R - 6, 0, H + LH + 40], [R, 0, H + 34], [0, 0, H + LH + 30]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const cyl = (r, z0, z1, xf) => {
    const a = disc(0, 0, r).map((q) => P(...xf([q.u, q.v, z0])));
    const b = disc(0, 0, r).map((q) => P(...xf([q.u, q.v, z1])));
    return { sil: poly(hull(a.concat(b))), top: poly(b) };
  };
  const id = (p) => p;
  const body = cyl(R, 0, H, id);
  mk("path", { d: body.sil, class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, R - 2.5), H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, R - 2.5), 4)), class: "nf lo" }, g);
  const pads = [], lidSil = mk("path", { class: "sil hi" }, g), lidTop = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  for (let i = 0; i < 3; i++) pads.push(mk("path", { class: "sil" }, g));
  pads.forEach((p) => g.insertBefore(p, lidSil));

  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(lerpA(v)), lift = 2 + v * (amt * 0.12), up = v * amt * 0.45;
    const xf = ([x, y, z]) => {
      const dx = x + R, dz = z - H;
      return [-R + dx * Math.cos(a) - dz * Math.sin(a), y, H + dx * Math.sin(a) + dz * Math.cos(a) + lift];
    };
    pads.forEach((p, i) => {
      const z0 = H - 6 + i * 2.6 + up * (0.6 + i * 0.2);
      p.setAttribute("d", cyl(R - 5 - i * 0.6, z0, z0 + 2.2, (q) => [q[0] + i * 0.8, q[1], q[2]]).sil);
    });
    const lid = cyl(R + 1.6, H - 3, H - 3 + LH, xf);
    lidSil.setAttribute("d", lid.sil);
    lidTop.setAttribute("d", cyl(R - 1, H - 3, H - 3 + LH, xf).top);
    knob.setAttribute("d", cyl(5, H - 3 + LH, H + LH + 1, xf).sil);
  }
  const lerpA = (v) => 9 + v * (10 + amt * 0.6);

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, H / 2);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.hypot(sx - mid[0], (sy - mid[1]) * 0.8) < 80), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cottonjar",
  means: "A jar of cotton pads: over it the deep lid lifts and tips back on its far edge, and the stack of pads rises.",
  rules: [1, 4, 5, 8],
  range: [20, 40, 60],
  tour: [[200, 158], [139, 115], [200, 158], null],
  mount,
});
