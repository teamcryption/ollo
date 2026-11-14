/**
 * Tesla coil: a wound column on a square base, crowned with a wide toroid.
 * One spark leaps from the toroid's rim and turns to face the pointer's
 * place on the ground, on a spring. At rest it strikes out to the right,
 * bright. The slider is the spark's reach.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TZ = 78, R0 = 25, REST = -0.55;
const JIT = [0, 0.8, -0.9, 0.6, -0.7, 0.9, -0.4, 0];
const JZ = [0, 0.6, -0.4, 0.9, -0.6, 0.3, -0.8, 0];
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  const ext = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ext.push([Math.cos(a) * 64, Math.sin(a) * 64, TZ - 12]); }
  fit(C, ext.concat([[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [0, 0, TZ + 6]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-30, -30, 30, 30, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, 8));
  put(solid(g), prism(P, front, disc(13), disc(11), 8, 12));
  // the secondary: a tall wound column
  put(solid(g), prism(P, front, disc(9), disc(7.6), 12, TZ - 4));
  for (let z = 18; z < TZ - 6; z += 7) mk("path", { d: open(ringAt(P, run(disc(9), front), z)), class: "nf lo" }, g);
  const sparkBack = mk("g", {}, g);
  // the toroid: a wide rounded ring on top
  const tor = mk("g", {}, g);
  const pts = [];
  for (const [r, z] of [[R0 - 4, TZ - 4], [R0, TZ], [R0 - 4, TZ + 4]]) pts.push(...ringAt(P, disc(r, 48), z));
  mk("path", { d: poly(hull(pts)), class: "sil" }, tor);
  mk("path", { d: open(ringAt(P, run(disc(R0 - 6, 48), front), TZ + 3.6)), class: "nf lo" }, tor);
  mk("path", { d: poly(hull(ringAt(P, disc(3, 16), TZ + 4).concat(ringAt(P, disc(3, 16), TZ + 8)))) }, tor);
  const sparkFront = mk("g", {}, g);
  const spark = mk("path", { class: "nf hi" }, sparkFront);

  const ang = spring(REST);
  let last = NaN, lastR = NaN, inFront = true;
  function draw(a) {
    if (a === last && reach === lastR) return;
    last = a; lastR = reach;
    const L = 10 + 34 * (reach / 100), cx = Math.cos(a), sy = Math.sin(a), pts = [];
    for (let i = 0; i < JIT.length; i++) {
      const t = i / (JIT.length - 1), r = R0 + L * t, j = JIT[i] * 6;
      pts.push(P(cx * r - sy * j, sy * r + cx * j, TZ - t * 12 + JZ[i] * 5));
    }
    spark.setAttribute("d", open(pts));
    const fr = cx + sy > -0.2;
    if (fr !== inFront) { inFront = fr; (fr ? sparkFront : sparkBack).appendChild(spark); }
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(t) {
    let d = t - ang.x;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    ang.t = ang.x + d;
  }
  const deg = (a) => String(((Math.round((a * 180) / Math.PI) % 360) + 360) % 360).padStart(3, "0");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(Math.atan2(y, x)); read.textContent = "arc " + deg(ang.t); B.wake(); },
    leave: () => { aim(REST); read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "teslacoil",
  means: "A Tesla coil on its base: one spark leaps from the toroid and turns to face the pointer, wherever it stands.",
  rules: [1, 3, 4, 8],
  range: [0, 70, 100],
  tour: [[300, 200], [120, 220], [140, 110], null],
  mount,
});
