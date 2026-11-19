/**
 * Cement mixer truck: a cab up front and a bellied drum lying tilted on the
 * chassis behind it, two spiral fins wound round it, a discharge chute at its
 * raised tail. The pointer's place across the frame turns the drum, its fins
 * winding round, and swings the chute out from the tail. At rest the drum is
 * bright. The slider is how far it turns.
 *
 * The pattern: one turning part (turn).
 */
const { Cam, clamp, facing, fit, hull, lerp, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 140, W = 54, Z0 = 9, ZB = 20, A = [6, 27, 56], Bx = [98, 27, 40], REST = 20;
const RS = [[0, 11], [0.22, 22], [0.5, 26], [0.8, 21], [1, 13]];
const rad0 = (s) => { for (let i = 1; i < RS.length; i++) if (s <= RS[i][0]) { const [s0, r0] = RS[i - 1], [s1, r1] = RS[i]; const t = (s - s0) / (s1 - s0); return lerp(r0, r1, t * t * (3 - 2 * t)); } return 13; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.55);
  const P = proj(C), front = facing(C);
  const ax = (s) => [lerp(A[0], Bx[0], s), 27, lerp(A[2], Bx[2], s)];
  const on = (s, th) => { const c = ax(s), r = rad0(s); return [c[0], c[1] + r * Math.cos(th), c[2] + r * Math.sin(th)]; };
  const ext = [[-60, 27, 0], [L, W, 0], [L, 0, 0], [0, 95, 0], [0, 27, 84], [L, W, 58]];
  fit(C, ext, 200, 162);
  const Pq = proj(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(Pq(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [22, 46, 120]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(Pq, front, chr, chi, Z0, ZB - 1));
  const [sr, si] = rings(84, 14, 100, 40, 3, 1);
  put(solid(g), prism(Pq, front, sr, si, ZB - 1, 38));
  const dpts = [];
  for (let i = 0; i <= 12; i++) for (let j = 0; j < 28; j++) dpts.push(Pq(...on(i / 12, (j / 28) * Math.PI * 2)));
  mk("path", { d: poly(hull(dpts)), class: "sil hi" }, g);
  const fins = mk("path", { class: "nf" }, g);
  const chute = mk("path", {}, g), chl = mk("path", { class: "nf lo" }, g);
  const foot = rrect(104, 0, L, W, 7, 6), top = rrect(106, 3, L - 12, W - 3, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(Pq, foot, ZB - 2).concat(ringAt(Pq, foot, 34), ringAt(Pq, top, 58)))));
  mk("path", { d: seg(Pq(L - 2, W - 6, 36), Pq(L - 12, W - 6, 55)), class: "nf lo" }, g);
  for (const x of [22, 46, 120]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const ang = spring(REST);
  let last = NaN;
  const vis = (th) => 0.61 * Math.cos(th) + 0.5 * Math.sin(th) > 0.05;

  function draw(a) {
    if (a === last) return;
    last = a;
    let d = "";
    for (const f of [0, 2.094, 4.189]) {
      let run = [];
      for (let i = 0; i <= 60; i++) {
        const s = 0.04 + 0.92 * (i / 60), th = rad(a) + f + s * Math.PI * 2.4;
        if (vis(th)) run.push(Pq(...on(s, th)));
        else { if (run.length > 1) d += "M" + run.map((p) => p.join(",")).join("L"); run = []; }
      }
      if (run.length > 1) d += "M" + run.map((p) => p.join(",")).join("L");
    }
    fins.setAttribute("d", d);
    const sw = clamp((a - REST) / 220, 0, 1), ps = rad(185 - 100 * sw), cx = Math.cos(ps), cy = Math.sin(ps), nx = -cy, ny = cx;
    const p0 = [2, 27, 40], len = 62, w = 7;
    const pt = (t, o, dz) => Pq(p0[0] + cx * len * t + nx * o, p0[1] + cy * len * t + ny * o, p0[2] - 18 * t + dz);
    chute.setAttribute("d", poly(hull([pt(0, -w, 0), pt(0, w, 0), pt(1, -w, 0), pt(1, w, 0), pt(0, 0, -5), pt(1, 0, -5)])));
    chl.setAttribute("d", seg(pt(0.05, 0, -3), pt(0.95, 0, -3)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a - REST) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((340 - sx) / 220, 0, 1) * max), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "mixertruck",
  means: "A cement mixer truck: the pointer turns the bellied drum on the chassis, its spiral fins winding round, and swings the chute out.",
  rules: [1, 3, 5, 6],
  range: [120, 220, 270],
  tour: [[179, 95], [260, 180], [120, 120], null],
  mount,
});
