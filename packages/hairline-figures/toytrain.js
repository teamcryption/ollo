/**
 * Toy train: an oval wooden track with two grooves, and an engine (body,
 * cab, chimney) pulling three carriages round it. The train runs while the
 * figure is on screen. Over the track the pointer brakes it on a spring to a
 * crawl, and the car nearest the pointer goes bright. At rest the engine is
 * bright. The slider is how hard the pointer brakes.
 *
 * The pattern: ambient motion with a spring on its speed; the pick is on a
 * fixed plane through the cars' middles.
 */
const {
  Cam, fit, facing, poly, prism, proj, ringAt, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const A = 34, R = 26, TW = 7, TZ = 3, V = 20, GAP = 19, PER = 4 * A + 2 * Math.PI * R;

// a stadium ring of radius r round the two curve centres
function stadium(r, n = 14) {
  const out = [];
  for (const [cx, a0] of [[A, -Math.PI / 2], [-A, Math.PI / 2]]) {
    for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * Math.PI, nu = Math.cos(a), nv = Math.sin(a); out.push({ u: cx + r * nu, v: r * nv, nu, nv }); }
  }
  return out;
}
// the centre line at arc length s: [x, y, heading]
function at(s) {
  s = ((s % PER) + PER) % PER;
  if (s < 2 * A) return [-A + s, R, 0];
  s -= 2 * A;
  if (s < Math.PI * R) { const a = Math.PI / 2 - s / R; return [A + R * Math.cos(a), R * Math.sin(a), Math.atan2(-Math.cos(a), Math.sin(a))]; }
  s -= Math.PI * R;
  if (s < 2 * A) return [A - s, -R, Math.PI];
  s -= 2 * A;
  const a = -Math.PI / 2 - s / R;
  return [-A + R * Math.cos(a), R * Math.sin(a), Math.atan2(-Math.cos(a), Math.sin(a))];
}
// a rounded box ring in the car's own frame, turned to heading h at (cx, cy)
function boxRing(cx, cy, h, u0, v0, u1, v1, r) {
  const c = Math.cos(h), s = Math.sin(h);
  return rrect(u0, v0, u1, v1, r, 4).map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let brake = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-A - R - TW, -R - TW, 0], [A + R + TW, R + TW, 0], [A + R + TW, -R - TW, 18], [-A - R - TW, R + TW, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  put(solid(g), prism(P, front, stadium(R + TW), stadium(R + TW - 1.4), 0, TZ));
  mk("path", { class: "nf", d: poly(ringAt(P, stadium(R - TW), TZ)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, stadium(R - 3.2), TZ)) + poly(ringAt(P, stadium(R + 3.2), TZ)) }, g);

  const cg = mk("g", {}, g);
  const cars = [0, 1, 2, 3].map((k) => {
    const grp = mk("g", {}, cg), body = solid(grp);
    return k === 0 ? { k, grp, body, cab: solid(grp), chim: solid(grp) } : { k, grp, body };
  });
  const prismOf = (cx, cy, h, u0, v0, u1, v1, z0, z1, r = 2) =>
    prism(P, front, boxRing(cx, cy, h, u0, v0, u1, v1, r), boxRing(cx, cy, h, u0 + 0.8, v0 + 0.8, u1 - 0.8, v1 - 0.8, Math.max(0.4, r - 0.8)), z0, z1);

  let s = 40, order = "", near = -1, ptr = null;
  const sp = spring(1);
  function draw() {
    const cen = [];
    cars.forEach((c) => {
      const [x, y, h] = at(s - c.k * GAP);
      cen.push([x, y]);
      if (c.k === 0) {
        put(c.body, prismOf(x, y, h, -8, -4.5, 8, 4.5, TZ, TZ + 7));
        put(c.cab, prismOf(x, y, h, -8, -4.5, -1.5, 4.5, TZ + 7, TZ + 14, 1.6));
        put(c.chim, prismOf(x, y, h, 3, -1.8, 6.6, 1.8, TZ + 7, TZ + 12, 1.8));
        const cabNear = Math.cos(h) + Math.sin(h) < 0;
        if (cabNear) c.grp.append(c.chim.g, c.cab.g); else c.grp.append(c.cab.g, c.chim.g);
      } else put(c.body, prismOf(x, y, h, -7, -4.5, 7, 4.5, TZ, TZ + 8 - c.k, 2.2));
    });
    const ord = cars.map((c, i) => [i, cen[i][0] + cen[i][1]]).sort((a, b) => a[1] - b[1]).map((e) => e[0]);
    if (ord.join() !== order) { order = ord.join(); for (const i of ord) cg.appendChild(cars[i].grp); }
    return cen;
  }

  function pick(cen) {
    if (!ptr) return -1;
    let best = -1, bd = 22;
    cen.forEach(([x, y], i) => { const d = Math.hypot(x - ptr[0], y - ptr[1]); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function mark(a) {
    if (a === near) return;
    near = a;
    cars.forEach((c, i) => {
      const on = i === (a < 0 ? 0 : a);
      for (const part of [c.body, c.cab, c.chim]) if (part) part.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "engine" : "car " + a;
  }

  const B = register(stage, (dt) => {
    stepS(sp, dt);
    s += V * sp.x * dt;
    mark(pick(draw()));
    return true;
  });
  bag.add(B.unregister);
  mark(-2); mark(-1);

  // the pointer on a fixed plane through the cars' middles; over the track it brakes the train
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ + 5);
    const over = Math.abs(y) < R + TW + 6 && Math.abs(x) < A + R + TW + 6;
    ptr = over ? [x, y] : null;
    sp.t = over ? 1 - 0.85 * brake : 1;
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { ptr = null; sp.t = 1; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { brake = v; if (ptr) sp.t = 1 - 0.85 * v; }, destroy: bag.dispose };
}

hairline({
  name: "toytrain",
  means: "A toy train on an oval wooden track: over the track the pointer brakes it to a crawl, and the car nearest it goes bright.",
  rules: [1, 3, 7, 8],
  range: [0, 0.8, 1],
  tour: [[130, 150], [200, 190], [280, 180], null],
  mount,
});
