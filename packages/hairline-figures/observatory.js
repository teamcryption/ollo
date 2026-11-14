/**
 * Observatory: a round drum on a plinth under a dome, a telescope tube
 * standing out of the dome's crown. The tube turns to face the pointer's
 * bearing on the ground and tips lower as the pointer goes farther out. At
 * rest it looks up toward the left, bright. The slider is the reach.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, ringAt, unproj,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const R = 26, ZD = 30, LEN = 40, TR = 5, REST = [135, 40];
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-36, -36, 0], [36, 36, 0], [36, -36, 0], [-36, 36, 0], [-30, -30, 95], [30, 30, 70], [0, 0, ZD + R + LEN + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-34, -34, 34, 34, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  put(solid(g), prism(P, front, disc(R), disc(R - 1.5), 4, ZD));
  // the dome: a hemisphere's hull, a seam ring where it meets the drum
  const pts = [];
  for (let i = 0; i <= 8; i++) { const t = (i / 8) * (Math.PI / 2); pts.push(...ringAt(P, disc(R * Math.cos(t), 40), ZD + R * 0.92 * Math.sin(t))); }
  mk("path", { d: poly(hull(pts)), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(R - 2, 48), ZD + 1.5)).replace(/Z$/, ""), class: "nf lo" }, g);
  const base = [0, 0, ZD + R * 0.92 - 1];
  mk("path", { d: poly(hull(ringAt(P, disc(7, 20), base[2] - 1).concat(ringAt(P, disc(7, 20), base[2] + 2)))), class: "" }, g);
  const tube = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g);

  const az = spring(REST[0]), el = spring(REST[1]);
  let lastA = NaN, lastE = NaN;
  function ring(c, u, w, r) {
    const out = [];
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, ca = Math.cos(a) * r, sa = Math.sin(a) * r; out.push(P(c[0] + ca * u[0] + sa * w[0], c[1] + ca * u[1] + sa * w[1], c[2] + ca * u[2] + sa * w[2])); }
    return out;
  }
  function draw() {
    if (az.x === lastA && el.x === lastE) return;
    lastA = az.x; lastE = el.x;
    const th = rad(az.x), e = rad(el.x);
    const d = [Math.cos(th) * Math.cos(e), Math.sin(th) * Math.cos(e), Math.sin(e)];
    const u = [-Math.sin(th), Math.cos(th), 0], w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
    const a = base.map((v, k) => v - d[k] * 6), b = base.map((v, k) => v + d[k] * LEN);
    const end = ring(b, u, w, TR + 0.6);
    tube.setAttribute("d", poly(hull(ring(a, u, w, TR).concat(end))));
    cap.setAttribute("d", poly(ring(base.map((v, k) => v + d[k] * (LEN - 1.5)), u, w, TR - 0.4)));
  }

  const B = register(stage, (dt) => {
    const m = stepS(az, dt) | stepS(el, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);

  let on = false;
  function aim(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), dist = Math.hypot(x, y);
    if (dist < 4) return;
    let t = (Math.atan2(y, x) * 180) / Math.PI, dlt = ((t - az.t) % 360 + 540) % 360 - 180;
    az.t += dlt;
    el.t = clamp(lerp(70, 18, dist / (60 + reach)), 18, 70);
    on = true;
    tube.classList.add("hi");
    read.textContent = "az " + String(Math.round(((az.t % 360) + 360) % 360)).padStart(3, "0");
    B.wake();
  }
  function leave() {
    on = false;
    az.t += ((REST[0] - az.t) % 360 + 540) % 360 - 180;
    el.t = REST[1];
    read.textContent = "rest";
    B.wake();
  }
  tube.classList.add("hi");
  draw();
  leave();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "observatory",
  means: "A domed observatory on a plinth: the telescope turns to face the pointer and tips lower the farther out it goes.",
  rules: [1, 3, 5, 8],
  range: [0, 40, 120],
  tour: [[110, 200], [300, 220], [260, 110], null],
  mount,
});
