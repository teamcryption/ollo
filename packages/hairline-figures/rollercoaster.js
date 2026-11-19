/**
 * Roller coaster car: one open car on a lift hill, the track a pair of rails
 * on ties over a row of posts. The pointer's place across the frame hauls
 * the car along the rails on a spring, up the lift hill toward the crest,
 * the car pitching to follow the slope. The car is the bright part. The
 * slider is how far up the hill it climbs.
 *
 * The pattern: one continuous value from the pointer (spring) along a path.
 */
const {
  Cam, fit, proj, seg, poly, open, hull, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Q = Math.SQRT1_2, U0 = -58, U1 = 58, RW = 6, REST = -40;
const W = (u, w, z) => [(u + w) * Q, (w - u) * Q, z];
const zt = (u) => 8 + 50 * Math.exp(-(((u - 22) / 26) ** 2));
const dz = (u) => (zt(u + 0.5) - zt(u - 0.5));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [W(U0, -RW, 0), W(U1, RW, 0), W(U0, RW, 0), W(22, 0, 70)], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  let posts = "", ties = "";
  const rail = (w) => { const o = []; for (let u = U0; u <= U1; u += 2) o.push(P(...W(u, w, zt(u)))); return o; };
  for (let u = U0 + 4; u <= U1 - 4; u += 12) for (const w of [-RW, RW]) posts += seg(P(...W(u, w, 0)), P(...W(u, w, zt(u))));
  for (let u = U0; u <= U1; u += 4) ties += seg(P(...W(u, -RW - 1, zt(u))), P(...W(u, RW + 1, zt(u))));
  mk("path", { d: posts, class: "nf lo" }, g);
  mk("path", { d: open(rail(-RW)), class: "nf" }, g);
  mk("path", { d: ties, class: "nf lo" }, g);
  mk("path", { d: open(rail(RW)), class: "nf" }, g);
  const car = solid(g), bar = mk("path", { class: "nf" }, g);
  car.sil.classList.add("hi");

  const sp = spring(REST);
  let last = NaN;
  function draw(u) {
    if (u === last) return;
    last = u;
    let tu = 1, tz = dz(u);
    const m = Math.hypot(tu, tz); tu /= m; tz /= m;
    const nu = -tz, nz = tu, z0 = zt(u);
    const pt = (a, b, w) => P(...W(u + a * tu + b * nu, w, z0 + a * tz + b * nz));
    const L = 11, H0 = 0.5, H1 = 9, CW = RW - 0.5;
    const box = [];
    for (const a of [-L, L]) for (const b of [H0, H1]) for (const w of [-CW, CW]) box.push(pt(a, b, w));
    const i = 1.4;
    const rim = [pt(-L + i, H1, -CW + i), pt(L - 3, H1, -CW + i), pt(L - 3, H1, CW - i), pt(-L + i, H1, CW - i)];
    const seat = [pt(-1, H1, -CW + i), pt(-1, H1, CW - i)];
    put(car, { sil: poly(hull(box.concat([pt(L + 2, (H0 + H1) / 2, -CW + 1), pt(L + 2, (H0 + H1) / 2, CW - 1)]))), crease: poly(rim) + seg(...seat) });
    bar.setAttribute("d", seg(pt(-4, H1, -CW + i), pt(-6, H1 + 5, -CW + i)) + seg(pt(-6, H1 + 5, -CW + i), pt(-6, H1 + 5, CW - i)) + seg(pt(-6, H1 + 5, CW - i), pt(-4, H1, CW - i)));
  }

  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);
  function move([sx]) {
    const k = clamp((sx - 60) / 280, 0, 1);
    sp.t = REST + k * (40 + 40 * reach);
    read.textContent = "up " + Math.round(zt(sp.t)) + "m";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "rollercoaster",
  means: "A roller coaster car on a lift hill: the pointer's place across the frame hauls the car up the rails on a spring, pitching with the slope.",
  rules: [3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[279, 153], [56, 197], [344, 197], null],
  mount,
});
