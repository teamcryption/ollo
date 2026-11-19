/**
 * Fire monitor: a deck-mounted water cannon, a riser and swivel collar under
 * a long barrel with a tapered nozzle. The pointer is where the water should
 * land: the barrel swivels round to face it and lifts its nozzle, on springs.
 * At rest it points left at a low angle, the nozzle bright. The slider is how
 * far it may swing and lift (its sweep).
 *
 * The pattern: a continuous aim on two springs; the hit is the deck's ground
 * plane, which never moves.
 */
const {
  Cam, clamp, fit, fillet, hull, poly, proj, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const V = [0.61, 0.61, 0.5], PIV = [0, 0, 44], REST = [135, 22];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** A round solid along d from c: radius r0 at c, r1 at the far end; its crease is the end that faces us. */
function cyl(P, c, d, r0, r1, len, n = 28) {
  const u = nrm(cross(d, Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])), v = cross(u, d);
  const ring = (off, r) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, q = (j) => c[j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
    return P(q(0), q(1), q(2));
  });
  const a = ring(0, r0), b = ring(len, r1);
  const far = dot(d, V) > 0;
  return { sil: poly(hull(a.concat(b))), crease: poly(far ? ring(len, r1 * 0.78) : ring(0, r0 * 0.78)) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.25);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([Math.cos(a) * 66, Math.sin(a) * 66, 44], [Math.cos(a) * 30, Math.sin(a) * 30, 110]); }
  fit(C, ext.concat([[-24, -24, 0], [24, 24, 0]]), 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const up = [0, 0, 1];
  put(solid(g), cyl(P, [0, 0, 0], up, 26, 26, 5, 40));
  put(solid(g), cyl(P, [0, 0, 5], up, 8, 8, 24));
  put(solid(g), cyl(P, [0, 0, 29], up, 12, 12, 6));
  const back = mk("g", {}, g);
  const body = solid(g);
  put(body, cyl(P, [0, 0, 35], up, 9, 9, 12));
  const barrel = solid(back), nozzle = solid(back), wheel = solid(back);
  nozzle.sil.classList.add("hi");
  const yaw = spring(REST[0]), pit = spring(REST[1]);
  let amp = value, last = "";

  function draw() {
    const key = yaw.x.toFixed(2) + "," + pit.x.toFixed(2);
    if (key === last) return;
    last = key;
    const a = rad(yaw.x), e = rad(pit.x);
    const d = [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)];
    const s = [PIV[0] - d[0] * 8, PIV[1] - d[1] * 8, PIV[2] - d[2] * 8];
    put(barrel, cyl(P, s, d, 7, 6, 58));
    const t = [PIV[0] + d[0] * 48, PIV[1] + d[1] * 48, PIV[2] + d[2] * 48];
    put(nozzle, cyl(P, t, d, 6.5, 3.4, 24));
    const side = nrm(cross(d, [0, 0, 1])), w = [PIV[0] + side[0] * 10, PIV[1] + side[1] * 10, PIV[2] + side[2] * 10];
    put(wheel, cyl(P, w, side, 6, 6, 2.5, 20));
    // the barrel is behind the body when it points away from us
    if (dot(d, V) < 0) g.insertBefore(back, body.g); else g.appendChild(back);
  }

  const B = register(stage, (dt) => { const p = stepS(yaw, dt), q = stepS(pit, dt); draw(); return p || q; });
  bag.add(B.unregister);

  function aim(pt) {
    if (!pt) { yaw.t = REST[0]; pit.t = REST[1]; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = pt, dist = Math.hypot(x, y);
    let dl = (Math.atan2(y, x) * 180) / Math.PI - REST[0];
    dl = ((dl + 540) % 360) - 180;
    yaw.t = REST[0] + clamp(dl, -170 * amp, 170 * amp);
    pit.t = REST[1] + amp * 34 * clamp(dist / 90, 0, 1);
    read.textContent = `aim ${Math.round(((yaw.t % 360) + 360) % 360)}°`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) > 120 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "firemonitor",
  means: "A deck fire monitor: the barrel swivels round to face where the pointer is and lifts its nozzle to throw the water there.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[311, 273], [73, 273], [327, 273], null],
  mount,
});
