/**
 * Fire pit: a wide steel bowl on a pedestal with a domed mesh spark screen
 * resting on its rim. At rest the screen sits a little tipped, bright. Over
 * the pit it tilts up on its back edge to show the logs inside. The slider
 * is how far the screen opens.
 */
const { Cam, circ, fit, hull, open, poly, proj, ringAt, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const RZ = 26, BR = 28, DR = 27, DH = 16, REST = 10;
const toR = (d) => (d * Math.PI) / 180;
const VX = Math.cos(toR(30)) * Math.SQRT1_2, VZ = 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-30, 30, RZ], [30, -30, RZ], [-58, 0, RZ + 2 * DR], [-50, -20, 70], [10, 0, RZ + DR + 8]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const cyl = (r0, r1, z0, z1, inner) => {
    const s = solid(g);
    put(s, { sil: poly(hull(ringAt(P, circ(r0, 40), z0).concat(ringAt(P, circ(r1, 40), z1)))), crease: inner ? poly(ringAt(P, circ(r1 - 2, 40), z1)) : "" });
  };
  cyl(20, 20, 0, 2, false);
  cyl(6, 6, 2, 14, false);
  cyl(13, BR, 14, RZ, true);
  // the logs on the coals
  const mound = [];
  for (const [r, z] of [[18, 0], [12, 3], [5, 5]]) mound.push(...ringAt(P, circ(r, 24), RZ - 3 + z));
  mk("path", { d: poly(hull(mound)), class: "nf lo" }, g);
  for (const [a, b] of [[[-10, -6], [9, 5]], [[-8, 7], [8, -8]]]) mk("path", { d: open([P(a[0], a[1], RZ + 3), P(b[0], b[1], RZ + 3)]), class: "nf" }, g);
  // the spark screen
  const lid = solid(g), mesh = mk("path", { class: "nf lo" }, g), loop = mk("path", { class: "nf" }, g);
  lid.sil.classList.add("hi");
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(toR(a)), s = Math.sin(toR(a));
    const rot = (x, y, z) => { const dx = x + DR, dz = z; return [-DR + dx * c - dz * s, y, RZ + dx * s + dz * c]; };
    const pt = (x, y, z) => P(...rot(x, y, z));
    const seen = (x, y, z) => { const nx = x / (DR * DR), nz = z / (DH * DH), y2 = y / (DR * DR); return (nx * c - nz * s) * VX + y2 * VX + (nx * s + nz * c) * VZ > 0; };
    const lats = [], all = [];
    for (let i = 0; i <= 6; i++) {
      const t = (i / 6) * (Math.PI / 2), ring = circ(DR * Math.cos(t), 40).map((q) => [q.u, q.v, DH * Math.sin(t)]);
      all.push(...ring.map((p) => pt(...p)));
      if (i === 2 || i === 4) lats.push(ring);
    }
    put(lid, { sil: poly(hull(all)), crease: "" });
    let d = "";
    const strand = (ps) => { let on = false; for (const p of ps) { const v = a > 50 || seen(...p), q = pt(...p).join(","); d += v ? (on ? "L" : "M") + q : ""; on = v; } };
    lats.forEach((ring) => strand(ring.concat([ring[0]])));
    strand(circ(DR, 40).map((q) => [q.u, q.v, 0.01]).concat([[DR, 0, 0.01]]));
    for (let m = 0; m < 12; m++) {
      const th = (m / 12) * Math.PI * 2, ps = [];
      for (let i = 0; i <= 8; i++) { const t = (i / 8) * (Math.PI / 2); ps.push([DR * Math.cos(t) * Math.cos(th), DR * Math.cos(t) * Math.sin(th), DH * Math.sin(t)]); }
      strand(ps);
    }
    mesh.setAttribute("d", d);
    loop.setAttribute("d", poly(circ(4, 16).map((q) => pt(q.u, 0, DH + 4 + q.v))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, RZ);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 150; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "firepit",
  means: "A steel fire pit bowl with a domed mesh spark screen: over it, the screen tilts up on its back edge to show the logs.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 105],
  tour: [[200, 159], [135, 172], [247, 228], null],
  mount,
});
