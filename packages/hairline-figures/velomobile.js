/**
 * Velomobile: a recumbent bike's long egg shell on three small wheels, with
 * a bubble canopy over the cockpit. The pointer over the shell is a hand on
 * the hatch: the canopy swings up on its front hinge and shows the seat and
 * the pedal boom inside. At rest it is cracked open a little and bright.
 * The slider is how far the canopy opens.
 */
const {
  Cam, circ, clamp, fit, hull, poly, proj, seg, unproj, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const HL2 = 60, BY = 17, ZC = 24, BZ = 15, XH = 30, REST = 0.12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-HL2, -BY, 0], [HL2, BY, 0], [-HL2, 0, ZC + BZ], [HL2, 0, ZC], [-20, 0, 80], [XH, BY, 50]], 200, 165);
  const P = proj(C);
  const f = (x) => Math.pow(Math.max(0, 1 - (x / HL2) ** 2), 0.45);
  const topZ = (x, y) => { const k = f(x); return ZC + BZ * k * Math.sqrt(Math.max(0, 1 - (y / (BY * k + 1e-6)) ** 2)); };
  const g = mk("g", {}, svg);
  // wheels first: they sit under the shell
  const wheel = (x, y) => mk("path", { class: "sil", d: poly(circ(8, 24).map((q) => P(x + q.u, y, 8 + q.v))) }, g);
  wheel(-44, 0); wheel(34, -12); wheel(34, 12);
  // the shell: the hull of its cross sections
  const shell = [];
  for (let i = 0; i <= 24; i++) {
    const x = -HL2 + (i / 24) * 2 * HL2, k = f(x);
    for (let j = 0; j < 20; j++) { const t = (j / 20) * Math.PI * 2; shell.push(P(x, BY * k * Math.cos(t), ZC + BZ * k * Math.sin(t))); }
  }
  mk("path", { class: "sil", d: poly(hull(shell)) }, g);
  const belt = [];
  for (let i = 0; i <= 30; i++) { const x = -HL2 * 0.97 + (i / 30) * 1.94 * HL2; belt.push(P(x, BY * f(x) - 1.2, ZC)); }
  mk("path", { class: "nf lo", d: "M" + belt.map((p) => p.join(",")).join("L") }, g);
  // the cockpit opening, the seat and the pedal boom inside it
  const lip = circ(1, 40).map((q) => { const x = 3 + 25 * q.u, y = 11 * q.v; return [x, y, topZ(x, y)]; });
  mk("path", { class: "nf", d: poly(lip.map((p) => P(...p))) }, g);
  const sx = [], bk = [];
  for (const x of [-16, -6]) for (const y of [-7, 7]) { sx.push(P(x, y, ZC + 4)); sx.push(P(x, y, ZC + 7)); }
  for (const x of [-20, -16]) for (const y of [-7, 7]) { bk.push(P(x, y, ZC + 4)); bk.push(P(x, y, ZC + 18)); }
  mk("path", { class: "sil", d: poly(hull(bk)) }, g);
  mk("path", { class: "sil", d: poly(hull(sx)) }, g);
  mk("path", { class: "nf", d: seg(P(0, 0, ZC + 6), P(22, 0, ZC + 10)) + seg(P(22, -5, ZC + 7), P(22, 5, ZC + 13)) }, g);
  // the canopy: lip plus a raised inner ring, hinged on its front edge
  const dome = lip.concat(lip.map(([x, y, z]) => [3 + (x - 3) * 0.62, y * 0.62, z + 10]));
  const zh = topZ(XH - 2, 0);
  const can = mk("path", { class: "sil hi" }, g), canLip = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let maxA = 1.25 * value, over = false, last = -1;

  function draw() {
    if (Math.abs(ang.x - last) < 1e-4) return;
    last = ang.x;
    const c = Math.cos(ang.x), s = Math.sin(ang.x);
    const rot = ([x, y, z]) => { const dx = x - XH, dz = z - zh; return P(XH + dx * c + dz * s, y, zh + dz * c - dx * s); };
    can.setAttribute("d", poly(hull(dome.map(rot))));
    canLip.setAttribute("d", poly(lip.map(rot)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    ang.t = over ? Math.max(REST, maxA) : REST;
    read.textContent = over ? `open ${Math.round((ang.t * 180) / Math.PI)}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZC);
      over = Math.abs(x) < HL2 + 15 && Math.abs(y) < BY + 22;
      retarget();
    },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { maxA = 1.25 * v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "velomobile",
  means: "A velomobile's egg shell on three wheels: point at it and the bubble canopy swings up on its hinge to show the seat.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[206, 140], [130, 120], [255, 165], null],
  mount,
});
