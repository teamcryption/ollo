/**
 * Tunnel boring machine: a long round shield lying on its cradle, with a
 * spoked cutter head on its nose. The pointer over the machine drives the
 * head: it turns and thrusts forward out of the shield, then draws back and
 * settles when the pointer leaves. The cutter head's rim is the bright mark.
 * The slider is how far it turns and thrusts.
 */
const {
  Cam, fit, hull, poly, proj, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, register,
} = HL;

const R = 24, LEN = 92, HD = 7, N = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -R - 4, 0], [LEN + HD + 30, R + 4, 0], [-4, R + 4, 0], [LEN + HD + 30, -R - 4, 0], [0, 0, 2 * R + 6], [LEN + HD + 30, 0, 2 * R + 6]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const ringAtX = (x, r, cz = R + 2) => Array.from({ length: N }, (_, i) => { const t = (i / N) * Math.PI * 2; return P(x, r * Math.cos(t), cz + r * Math.sin(t)); });
  // cradle, shield and its seams
  mk("path", { d: poly(hull([P(8, -R + 4, 0), P(LEN - 8, -R + 4, 0), P(LEN - 8, R - 4, 0), P(8, R - 4, 0), P(8, -R + 4, 6), P(LEN - 8, -R + 4, 6), P(LEN - 8, R - 4, 6), P(8, R - 4, 6)])), class: "sil" }, g);
  mk("path", { d: poly(hull(ringAtX(0, R).concat(ringAtX(LEN, R)))), class: "sil" }, g);
  let seams = "";
  for (const x of [LEN / 3, (2 * LEN) / 3]) { const r = ringAtX(x, R - 0.6); for (let i = 0; i < N; i++) { const a = r[i], b = r[(i + 1) % N]; const t = (i / N) * Math.PI * 2; if (Math.cos(t) > -0.2) seams += seg(a, b); } }
  mk("path", { d: seams, class: "nf lo" }, g);
  const shaft = mk("path", { class: "sil" }, g);
  const head = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "" }, g), spokes = mk("path", { class: "nf" }, g), hub = mk("path", { class: "" }, g);

  const ph = tween(0);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const d = 26 * reach * p, a = 0.3 + p * Math.PI * 2.2 * reach, x0 = LEN + 1 + d, x1 = x0 + HD;
    shaft.setAttribute("d", poly(hull(ringAtX(LEN - 2, 9).concat(ringAtX(x0 + 1, 9)))));
    head.setAttribute("d", poly(hull(ringAtX(x0, R + 2).concat(ringAtX(x1, R + 2)))));
    face.setAttribute("d", poly(ringAtX(x1, R + 0.5)));
    let s = "";
    for (let k = 0; k < 6; k++) {
      const t = a + (k * Math.PI) / 3, c = Math.cos(t), si = Math.sin(t);
      s += seg(P(x1, 5 * c, R + 2 + 5 * si), P(x1, (R - 1) * c, R + 2 + (R - 1) * si));
      for (const f of [0.45, 0.75]) { const tt = t + 0.28; s += seg(P(x1, R * f * Math.cos(tt), R + 2 + R * f * Math.sin(tt)), P(x1, (R * f + 3) * Math.cos(tt), R + 2 + (R * f + 3) * Math.sin(tt))); }
    }
    spokes.setAttribute("d", s);
    hub.setAttribute("d", poly(ringAtX(x1 + 1.5, 5)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ph, now)); return !tdone(ph, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ph, a < 0 ? 0 : 1, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "bore " + Math.round(26 * reach);
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setActive(x > -10 && x < LEN + HD + 34 && Math.abs(y) < R + 40 ? 1 : -1);
  }
  setActive(-1);
  bag.add(pointer(stage, { move, leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; draw(tval(ph, performance.now())); if (act >= 0) read.textContent = "bore " + Math.round(26 * reach); }, destroy: bag.dispose };
}

hairline({
  name: "tunnelboring",
  means: "A tunnel boring machine: the pointer over it turns its spoked cutter head and thrusts it forward out of the shield.",
  rules: [1, 3, 4, 5],
  range: [0.3, 1, 1],
  tour: [[182, 207], [130, 180], [250, 230], null],
  mount,
});
