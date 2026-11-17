/**
 * Barrel rack: a barrel lying across the two rails of a low cradle, a
 * chock at each end. The pointer over the rack rolls the barrel along the
 * rails: it turns as it goes, its bung hole travelling round. At rest the
 * barrel is bright at the near end. The slider is how far it rolls.
 *
 * The pattern: one part rolling, a turn and a slide together.
 */
const {
  Cam, fit, hull, poly, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const BL = 30, R = 24, RZ = 12, CZ = RZ + R - 3, X0 = -22, RUN = 40;
const rad = (y) => R - 5 * (y / BL) ** 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-56, -30, 0], [56, 30, 0], [-56, 30, 0], [56, -30, 0], [X0, 0, CZ + R + 2], [X0 + RUN, 0, CZ + R + 2]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, z0, x1, y1, z1) => hull([x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => P(x, y, z)))));
  const line = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");
  const rail = (y) => { for (const x of [-48, 48]) mk("path", { d: poly(box(x - 3, y - 3, 0, x + 3, y + 3, RZ - 4)) }, g); mk("path", { d: poly(box(-54, y - 4, RZ - 4, 54, y + 4, RZ)) }, g); };
  rail(-20);
  for (const x of [-54, 54]) mk("path", { d: poly(box(x - 2, -24, RZ, x + 2, 24, RZ + 6)) }, g);
  const body = mk("path", { class: "sil" }, g), hoops = mk("path", { class: "nf" }, g), bung = mk("path", { class: "nf" }, g);
  rail(20);

  const t = tween(0);
  let last = NaN;
  const th = Math.atan2(0.8, 0.7);
  function draw(p) {
    if (p === last) return;
    last = p;
    const cx = X0 + RUN * p, rot = (RUN * p) / R;
    const ring = (y, r, a0, a1, n) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push(P(cx + r * Math.cos(a), y, CZ + r * Math.sin(a))); } return o; };
    const pts = [];
    for (let y = -BL; y <= BL; y += BL / 4) pts.push(...ring(y, rad(y), 0, 2 * Math.PI, 36));
    body.setAttribute("d", poly(hull(pts)));
    let d = line(ring(BL, rad(BL), 0, 2 * Math.PI, 36)) + "Z";
    for (const y of [-BL + 6, -10, 10]) d += line(ring(y, rad(y) + 0.4, th - 1.55, th + 1.55, 24));
    hoops.setAttribute("d", d);
    // the bung: a small ring on the belly, turning with the roll
    const a = Math.PI / 2 - 0.35 - rot, nx = Math.cos(a), nz = Math.sin(a);
    if (nx * 0.7 + nz * 0.8 > 0.15) {
      const o = [];
      for (let i = 0; i <= 20; i++) { const s = (i / 20) * 2 * Math.PI, u = 4 * Math.cos(s); o.push(P(cx + R * nx - u * nz, 4 * Math.sin(s), CZ + R * nz + u * nx)); }
      bung.setAttribute("d", line(o) + "Z");
    } else bung.setAttribute("d", "");
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, CZ);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a > 0 ? reach : 0, performance.now(), 0);
    read.textContent = a > 0 ? "roll " + Math.round(reach * 100) : "rest";
    B.wake();
  }
  setActive(0);
  body.classList.add("hi");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 120 ? 1 : 0),
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "barrelrack",
  means: "A barrel across the rails of a low cradle: the pointer rolls it along the rails, the bung hole turning round as it goes.",
  rules: [1, 3, 5, 6],
  range: [40, 100, 100],
  tour: [[167, 70], [240, 200], [240, 300], null],
  mount,
});
