/**
 * Oil filter wrench: a spin-on filter canister standing on its base, a strap
 * band cinched round its middle and a long handle off the band. The handle
 * swings round the canister to point at the pointer, on a spring; at rest it
 * points out to the front right, the strap bright. The slider is the reach.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 22, FH = 50, SZ = 26, L = 50, REST = -40;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, circ(R + L + 6, 16).map((q) => [q.u, q.v, SZ]).concat([[0, 0, 0], [0, 0, FH + 4]]), 200, 166);
  const P = proj(C), front = facing(C);
  const back = mk("g", {}, svg), g = mk("g", {}, svg), fore = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R + 3), disc(0, 0, R + 1), 0, 4));
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2), 4, FH));
  mk("path", { d: poly(ringAt(P, disc(0, 0, 7, 24), FH)), class: "nf lo" }, g);
  const strap = mk("path", { class: "sil hi" }, g);
  const s0 = ringAt(P, disc(0, 0, R + 1.5), SZ - 3), s1 = ringAt(P, disc(0, 0, R + 1.5), SZ + 3);
  strap.setAttribute("d", poly(hull(s0.concat(s1))));
  const hg = mk("g", {}, fore), handle = mk("path", { class: "sil" }, hg), grip = mk("path", { class: "nf lo" }, hg);
  const ang = spring(REST);
  let last = NaN, side = 1;
  const bar = (a, r0, r1, w, z) => { const c = Math.cos(a), s = Math.sin(a), out = []; for (const r of [r0, r1]) for (const q of circ(w, 12)) out.push(P(c * r - s * q.u, s * r + c * q.u, z + q.v)); return poly(hull(out)); };
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180;
    handle.setAttribute("d", bar(a, R, R + L, 3.4, SZ));
    grip.setAttribute("d", bar(a, R + L * 0.55, R + L - 3, 4.4, SZ));
    const s = Math.cos(a) + Math.sin(a) >= 0 ? 1 : -1;
    if (s !== side) { side = s; (s > 0 ? fore : back).appendChild(hg); }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, SZ), d = Math.hypot(x, y);
    if (d > R + L + 16) return leave();
    let deg = (Math.atan2(y, x) * 180) / Math.PI;
    while (deg - ang.x > 180) deg -= 360;
    while (deg - ang.x < -180) deg += 360;
    ang.t = REST + clamp(deg - REST, -reach, reach);
    read.textContent = (((Math.round(ang.t) % 360) + 360) % 360) + "°";
    B.wake();
  }
  function leave() { ang.t = REST + 360 * Math.round((ang.x - REST) / 360); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "filterwrench",
  means: "A strap wrench round an oil filter, its long handle swinging round to point at the pointer.",
  rules: [1, 3, 5, 8],
  range: [60, 150, 180],
  tour: [[66, 195], [85, 109], [391, 166], null],
  mount,
});
