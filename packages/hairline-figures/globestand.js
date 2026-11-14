/**
 * Globe stand: a school globe on a tilted axis, held by a half meridian ring
 * on a stem and a round foot. The pointer's place across the frame spins the
 * globe on its axis, on a spring; the marked meridian, with its one city dot,
 * turns with it and the read-out gives its longitude. At rest the globe is
 * turned a little, the marked meridian bright on the near side.
 *
 * The pattern: one object answering a continuous input (spin).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const R = 30, RR = 34, TILT = rad(23), CZ = 58, REST = 35, SPAN = 160;
const U = [Math.sin(TILT), 0, Math.cos(TILT)], E1 = [Math.cos(TILT), 0, -Math.sin(TILT)], E2 = [0, 1, 0];
const V = [0.612, 0.612, 0.5];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const sph = (lat, lon, r = R) => {
  const a = Math.cos(lat) * Math.cos(lon), b = Math.cos(lat) * Math.sin(lon), c = Math.sin(lat);
  return [0, 1, 2].map((i) => r * (a * E1[i] + b * E2[i] + c * U[i]));
};
const vis = (p) => p[0] * V[0] + p[1] * V[1] + p[2] * V[2] > 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  const BX = -RR * U[0], BZ = CZ - RR * U[2];
  fit(C, [[BX - 26, -26, 0], [BX + 26, 26, 0], [-R, -R, CZ + R + 4], [R, R, CZ + R], [R, -R, CZ], [-R, R, CZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const W = (p) => P(p[0], p[1], p[2] + CZ);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(BX - 24, -24, BX + 24, 24, 24, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  put(solid(g), prism(P, front, disc(BX, 0, 7, 24), disc(BX, 0, 5.5, 24), 4, 7));
  put(solid(g), prism(P, front, disc(BX, 0, 2.4, 16), disc(BX, 0, 1.4, 16), 7, BZ + 2));

  // the half meridian ring, split into the part behind the globe and the part before it
  const arc = (keep) => {
    let d = "", on = false;
    for (let i = 0; i <= 48; i++) {
      const t = rad(-110 + (220 * i) / 48), p = [0, 1, 2].map((k) => RR * (Math.sin(t) * U[k] - Math.cos(t) * E1[k]));
      if (vis(p) === keep) { const s = W(p); d += (on ? "L" : "M") + s[0].toFixed(2) + " " + s[1].toFixed(2); on = true; } else on = false;
    }
    return d;
  };
  mk("path", { d: arc(false), class: "nf" }, g);
  const pts = [];
  for (let a = 0; a < 360; a += 6) for (let b = -90; b <= 90; b += 10) pts.push(W(sph(rad(b), rad(a))));
  mk("path", { d: poly(hull(pts)), class: "sil" }, g);
  const line = (fn, n) => {
    let d = "", on = false;
    for (let i = 0; i <= n; i++) {
      const p = fn(i / n);
      if (vis(p)) { const s = W(p); d += (on ? "L" : "M") + s[0].toFixed(2) + " " + s[1].toFixed(2); on = true; } else on = false;
    }
    return d;
  };
  for (const lat of [-40, 0, 40]) mk("path", { d: line((f) => sph(rad(lat), f * 2 * Math.PI), 72), class: "nf lo" }, g);
  const mers = [0, 1, 2, 3, 4, 5].map(() => mk("path", { class: "nf lo" }, g));
  const mark = mk("path", { class: "nf hi" }, g);
  mk("path", { d: arc(true), class: "nf" }, g);
  const pin = flatDot(g, C, 2.6, "dot");

  const spin = spring(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    mers.forEach((m, k) => m.setAttribute("d", line((f) => sph(rad(-90 + 180 * f), rad(s + 30 + k * 60)), 36)));
    mark.setAttribute("d", line((f) => sph(rad(-90 + 180 * f), rad(s)), 36));
    const c = sph(rad(35), rad(s));
    place(pin, W(c));
    pin.setAttribute("class", vis(c) ? "dot" : "dot off");
  }
  const B = register(stage, (dt) => { const m = stepS(spin, dt); draw(spin.x); return m; });
  bag.add(B.unregister);

  let on = false;
  function aim(t) {
    spin.t = t;
    B.wake();
  }
  aim(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => {
      const f = clamp((sx - 200) / 150, -1, 1), t = REST + 120 + f * SPAN * (0.4 + 0.6 * reach / 100);
      on = true;
      aim(t);
      const lon = Math.round(((((t - 45) % 360) + 540) % 360) - 180);
      read.textContent = Math.abs(lon) + "°" + (lon < 0 ? "W" : "E");
    },
    leave: () => { on = false; aim(REST); read.textContent = "rest"; },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "globestand",
  means: "A school globe on a tilted axis and meridian stand: the pointer across the frame spins it, the marked meridian turning to face you.",
  rules: [3, 4, 5, 8],
  range: [0, 60, 100],
  tour: [[90, 160], [310, 170], [200, 120], null],
  mount,
});
