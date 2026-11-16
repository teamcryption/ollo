/**
 * Stacking cups: built from rounded solids on the 2:1 camera. The pointer is read
 * on the floor's plane, which never moves; one spring per moving number carries
 * the answer. At rest the figure sits askew with one bright part.
 */
const {
  Cam, circ, rrect, fit, facing, hull, poly, open, proj, ringAt, run, unproj, spring, stepS, clamp,
  disposer, mk, pointer, register, solid,
} = HL;

const PARTS = [{"c":[0,0,16],"z0":0,"z1":9,"m":1,"h":0},{"c":[0,0,13.5],"z0":9,"z1":18,"m":1,"h":0},{"c":[0,0,11],"z0":18,"z1":27,"m":1,"h":0},{"c":[0,0,8.5],"z0":27,"z1":36,"m":1,"h":0},{"c":[0,0,6],"z0":36,"z1":45,"m":1,"h":1},{"c":[30,4,8],"z0":0,"z1":9,"m":0,"h":0},{"c":[6,30,6.5],"z0":0,"z1":8,"m":0,"h":0}];
const CFG = {"mode":"tilt","S":3.6,"R0":30,"top":48,"lean":0.42};
const D = Math.PI / 180;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function shape(p) {
  if (p.c) {
    const [x, y, R] = p.c, b = Math.min(1.2, R * 0.3), sh = (r) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
    return [sh(circ(R, 32)), sh(circ(R - b, 32)), x, y];
  }
  const [x0, y0, x1, y1, r0] = p.b, m = Math.min(x1 - x0, y1 - y0), r = Math.min(r0, m / 2 - 0.01), b = Math.min(1.2, m / 2 - 0.3);
  return [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.2), 4), (x0 + x1) / 2, (y0 + y1) / 2];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, CFG.S);
  const ext = [];
  if (CFG.mode === "gate") ext.push([0, 0, 0], [64, 64, 0], [0, 64, 0], [64, 0, 27], [126, 2, 24], [0, 0, 27], [64, 64, 27]);
  else for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2, R = CFG.R0 + (CFG.mode === "tilt" ? 4 : 0); ext.push([R * Math.cos(a), R * Math.sin(a), 0], [R * Math.cos(a), R * Math.sin(a), CFG.top]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const piv = CFG.piv || [0, 0];
  const items = PARTS.map((p) => { const [ring, inner, cx, cy] = shape(p), s = solid(g); if (p.h) s.sil.classList.add("hi"); return { p, ring, inner, cx, cy, s }; });
  const opt = () => ({ k: 100 * value, c: 18 * Math.sqrt(value) });
  const restLean = CFG.mode === "tilt" ? [0.12, -0.08] : [0, 0];
  const sa = spring(CFG.mode === "tilt" ? 0 : CFG.rest * D, opt()), sx = spring(restLean[0], opt()), sy = spring(restLean[1], opt());
  const springs = [sa, sx, sy];
  let last = "", order = "";

  function X(ring, z, m) {
    if (!m) return ring;
    const a = sa.x, c = Math.cos(a), s = Math.sin(a), ox = sx.x * z, oy = sy.x * z;
    return ring.map((q) => {
      const u = q.u - piv[0], v = q.v - piv[1];
      return { u: piv[0] + u * c - v * s + ox, v: piv[1] + u * s + v * c + oy, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c };
    });
  }
  function draw() {
    const key = [sa.x, sx.x, sy.x].map((v) => v.toFixed(4)).join();
    if (key === last) return;
    last = key;
    const keyed = [];
    for (const it of items) {
      const { p } = it, r0 = X(it.ring, p.z0, p.m), r1 = X(it.ring, p.z1, p.m), in1 = X(it.inner, p.z1, p.m);
      it.s.sil.setAttribute("d", poly(hull(ringAt(P, r0, p.z0).concat(ringAt(P, r1, p.z1)))));
      it.s.cr.setAttribute("d", open(ringAt(P, run(in1, front), p.z1)));
      const c = X([{ u: it.cx, v: it.cy, nu: 0, nv: 0 }], p.z0, p.m)[0];
      keyed.push([c.u + c.v + p.z0 * 3, it]);
    }
    keyed.sort((a, b) => a[0] - b[0]);
    const o = keyed.map((k) => items.indexOf(k[1])).join();
    if (o !== order) { order = o; for (const [, it] of keyed) g.appendChild(it.s.g); }
  }

  const L = register(stage, (dt) => {
    let m = false;
    for (const sp of springs) if (stepS(sp, dt)) m = true;
    draw();
    return m;
  });
  bag.add(L.unregister);

  function aim(p) {
    if (!p) {
      sa.t = CFG.mode === "turn" ? sa.t + wrap(CFG.rest * D - sa.t) : CFG.mode === "gate" ? CFG.rest * D : 0;
      sx.t = restLean[0]; sy.t = restLean[1];
      read.textContent = "rest";
    } else {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (CFG.mode === "turn") {
        const d = Math.hypot(wx, wy);
        if (d > CFG.R0 * 3) return aim(null);
        const a = d < 3 ? sa.t : Math.atan2(wy, wx);
        sa.t = sa.t + wrap(a - sa.t);
        read.textContent = Math.round(((a / D) % 360 + 360) % 360) + "°";
      } else if (CFG.mode === "gate") {
        const d = Math.hypot(wx - CFG.hp[0], wy - CFG.hp[1]);
        if (d > CFG.R * 1.6) return aim(null);
        const f = clamp((CFG.R - d) / (CFG.R * 0.6), 0, 1), a = CFG.rest + (CFG.open - CFG.rest) * f;
        sa.t = a * D;
        read.textContent = "gate " + Math.round(-a) + "°";
      } else {
        const d = Math.hypot(wx, wy);
        if (d > CFG.R0 * 3) return aim(null);
        const f = clamp(d / (CFG.R0 * 0.6), 0, 1), k = d < 1 ? 0 : (CFG.lean * f) / d;
        sx.t = wx * k; sy.t = wy * k;
        read.textContent = "lean " + Math.round(Math.atan(CFG.lean * f) / D) + "°";
      }
    }
    L.wake();
  }
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return {
    set: (v) => { for (const sp of springs) { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "stackcups",
  means: "A tower of nesting cups beside two loose ones: the tower leans toward the pointer, the top cup bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[225, 292], [200, 88], [330, 250], null],
  mount,
});
