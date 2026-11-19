/**
 * Hay tedder: a centre frame on two wheels with a drawbar, and a wing either
 * side, each carrying a rotor of tined arms. The pointer picks a wing by
 * which side of the frame it stands: that wing folds up on its hinge for
 * transport, and the other follows a little after. At rest the right wing's
 * arm is bright. The slider is how far the wings fold.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 12, ZA = 26, L = 46, RR = 25, MAXF = 105, REST = [10, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.0);
  // a wing point: s side, ox outward from the hinge, y, oz from the arm's height, folded by th degrees
  const W = (s, th, ox, y, oz) => { const c = Math.cos(rad(th)), n = Math.sin(rad(th)); return [s * (H + ox * c - oz * n), y, ZA + ox * n + oz * c]; };
  const ext = [[0, -34, 0], [0, 12, 0]];
  for (const s of [-1, 1]) for (const th of [0, MAXF]) for (const [ox, oz] of [[L + RR, -12], [L - RR, -12], [L + RR, 2], [0, 2]]) for (const y of [-RR, RR]) ext.push(W(s, th, ox, y, oz));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wings = [-1, 1].map((s, i) => {
    const grp = mk("g", {}, g);
    return { s, i, grp, arm: mk("path", { class: "sil" }, grp), hub: mk("path", { class: "sil" }, grp), tines: mk("path", { class: "nf" }, grp), rim: mk("path", { class: "nf lo" }, grp), tw: tween(REST[i]), last: NaN };
  });
  // centre: drawbar behind, wheels, frame; right wing painted last
  const centre = mk("g", {}, g);
  wings[0].grp.after(centre);
  const [dr, di] = rings(-2.5, -34, 2.5, -6, 1.5, 0.8);
  put(solid(centre), prism(P, front, dr, di, ZA - 2, ZA + 2));
  const wheel = (x) => {
    const pts = [];
    for (const xx of [x - 2, x + 2]) for (let k = 0; k < 32; k++) { const a = (k / 32) * Math.PI * 2; pts.push(P(xx, 9 * Math.cos(a), 9 + 9 * Math.sin(a))); }
    mk("path", { d: poly(hull(pts)), class: "sil" }, centre);
  };
  wheel(-H + 3);
  const [fr, fi] = rings(-H, -9, H, 9, 3, 1.5);
  put(solid(centre), prism(P, front, fr, fi, ZA - 6, ZA + 4));
  wheel(H - 3);

  function draw(w, th) {
    if (th === w.last) return;
    w.last = th;
    const s = w.s, Q = (ox, y, oz) => P(...W(s, th, ox, y, oz));
    const box = [];
    for (const ox of [0, L]) for (const y of [-2.5, 2.5]) for (const oz of [-2, 2]) box.push(Q(ox, y, oz));
    w.arm.setAttribute("d", poly(hull(box)));
    const hp = [];
    for (let k = 0; k < 20; k++) { const a = (k / 20) * Math.PI * 2; for (const oz of [-4, -12]) hp.push(Q(L + 5 * Math.cos(a), 5 * Math.sin(a), oz)); }
    w.hub.setAttribute("d", poly(hull(hp)));
    let t = "";
    const rim = [];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + 0.3, c = Math.cos(a), n = Math.sin(a);
      t += seg(Q(L + 5 * c, 5 * n, -10), Q(L + RR * c, RR * n, -10)) + seg(Q(L + RR * c, RR * n, -10), Q(L + (RR + 1) * c, (RR + 1) * n, -16));
    }
    for (let k = 0; k <= 36; k++) { const a = (k / 36) * Math.PI * 2; rim.push(Q(L + 17 * Math.cos(a), 17 * Math.sin(a), -10)); }
    w.tines.setAttribute("d", t);
    w.rim.setAttribute("d", open(rim));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const w of wings) { draw(w, tval(w.tw, now)); if (!tdone(w.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  const mid = P(0, 0, ZA);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now();
    wings.forEach((w, i) => {
      tset(w.tw, a < 0 ? REST[i] : MAXF * amt * (i === a ? 1 : 0.8), now, a < 0 ? 0 : Math.abs(i - a) * 60);
      w.arm.classList.toggle("hi", i === (a < 0 ? 1 : a));
    });
    read.textContent = a < 0 ? "rest" : (a ? "R " : "L ") + Math.round(MAXF * amt) + "°";
    B.wake();
  }
  setActive(-1);
  const hit = ([sx, sy]) => (Math.hypot(sx - mid[0], sy - mid[1]) > 170 ? -1 : sx < mid[0] ? 0 : 1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "tedder",
  means: "A hay tedder with a tined rotor on each wing: the wing on the pointer's side folds up on its hinge, the other follows.",
  rules: [1, 2, 3, 5, 6],
  range: [0.3, 0.85, 1],
  tour: [[265, 223], [135, 170], [250, 200], null],
  mount,
});
