/**
 * Drawing toy: a flat drawing toy with a grey screen and two round knobs on
 * its front edge. The pointer over it stands the toy up on its near edge and
 * turns the knobs with the pointer's x, and the line on the screen follows.
 * At rest it leans back a little, its drawn line bright. The slider is how
 * far it stands up.
 *
 * The pattern: one part tilting toward the pointer (spring).
 */
const { Cam, circ, clamp, fit, hull, open, poly, proj, rrect, seg, spring, stepS, unproj, disposer, mk, pointer, register, solid } = HL;

const W = 92, D = 66, H = 9, KR = 6;
const PATH = [[22, 48], [22, 30], [40, 30], [40, 40], [58, 40], [58, 24], [72, 24]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let up = value;
  const C = Cam(45, 0.5, 2.0);
  const pose = (a) => { const c = Math.cos(a), s = Math.sin(a); return (u, v, w) => [u, D - v * c + w * s, v * s + w * c]; };
  const ext = [];
  for (const a of [0.3, 1.2]) { const f = pose(a); for (const u of [0, W]) for (const v of [0, D]) for (const w of [0, H + 5]) ext.push(f(u, v, w)); }
  fit(C, ext, 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const body = solid(g), scr = solid(g);
  const line = mk("path", { class: "nf hi" }, g);
  const knobs = [0, 1].map(() => ({ s: solid(g), notch: mk("path", { class: "nf" }, g) }));
  const R = rrect(0, 0, W, D, 6, 6), RI = rrect(2, 2, W - 2, D - 2, 4, 6), S = rrect(14, 16, W - 14, D - 8, 4, 6), SI = rrect(16, 18, W - 16, D - 10, 3, 6);
  const K = circ(KR, 24), KI = circ(KR - 1.5, 24);
  const tilt = spring(0.3), turn = spring(0.6), prog = spring(0.55);
  let last = "";

  function draw() {
    const key = [tilt.x, turn.x, prog.x].map((n) => n.toFixed(4)).join();
    if (key === last) return;
    last = key;
    const f = pose(tilt.x), Q = (u, v, w) => P(...f(u, v, w));
    body.sil.setAttribute("d", poly(hull(R.map((q) => Q(q.u, q.v, 0)).concat(R.map((q) => Q(q.u, q.v, H))))));
    body.cr.setAttribute("d", poly(RI.map((q) => Q(q.u, q.v, H))));
    scr.sil.setAttribute("d", poly(S.map((q) => Q(q.u, q.v, H + 0.4))));
    scr.cr.setAttribute("d", poly(SI.map((q) => Q(q.u, q.v, H + 0.4))));
    // the drawn line, up to the stylus
    const n = PATH.length - 1, t = clamp(prog.x, 0, 1) * n, k = Math.floor(Math.min(t, n - 1e-6)), fr = t - k;
    const pts = PATH.slice(0, k + 1).map(([u, v]) => Q(u, v, H + 0.6));
    const a = PATH[k], b = PATH[k + 1];
    pts.push(Q(a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr, H + 0.6));
    line.setAttribute("d", open(pts));
    knobs.forEach((kn, i) => {
      const cu = i ? W - 9 : 9, cv = D - 7, th = turn.x * (i ? -1 : 1);
      kn.s.sil.setAttribute("d", poly(hull(K.map((q) => Q(cu + q.u, cv + q.v, H)).concat(K.map((q) => Q(cu + q.u, cv + q.v, H + 5))))));
      kn.s.cr.setAttribute("d", poly(KI.map((q) => Q(cu + q.u, cv + q.v, H + 5))));
      kn.notch.setAttribute("d", seg(Q(cu, cv, H + 5), Q(cu + Math.cos(th) * (KR - 1.5), cv + Math.sin(th) * (KR - 1.5), H + 5)));
    });
  }

  const B = register(stage, (dt) => {
    const m = [stepS(tilt, dt), stepS(turn, dt), stepS(prog, dt)].some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);
  draw();

  const rest = pose(0.3);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -10 && x < W + 10 && y > -10 && y < D + 25;
  }
  function onMove(p) {
    if (!hit(p)) return onLeave();
    const s = clamp((p[0] - 110) / 180, 0, 1);
    tilt.t = 0.3 + up * 0.95; turn.t = s * Math.PI * 2; prog.t = s;
    read.textContent = "knob " + Math.round(s * 9);
    B.wake();
  }
  function onLeave() { tilt.t = 0.3; turn.t = 0.6; prog.t = 0.55; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: onMove, leave: onLeave }));
  bag.add(() => svg.replaceChildren());
  void rest;
  return { set: (v) => { up = v; }, destroy: bag.dispose };
}

hairline({
  name: "etchsketch",
  means: "A drawing toy lying back: the pointer stands it up, turns its two knobs and runs the line across its screen.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.8, 1],
  tour: [[211, 186], [122, 179], [299, 197], null],
  mount,
});
