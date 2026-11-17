/**
 * Electric toothbrush: a round-shouldered handle standing in its charging
 * dock, a slim neck and a small head with its bristle tuft. The brush tilts
 * in the dock towards the pointer, further the farther the pointer is; a
 * spring follows. At rest it leans a little, the bristles bright. The slider
 * is how far it can lean.
 *
 * The pattern: one part tilting towards the pointer (aim).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rad, rrect, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZP = 8, MAX = 26, RX = 0, RY = 24;

// a straight bar between two world points, with a rounded section w × h
function tube(P, p0, p1, w, h) {
  const d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], L = Math.hypot(...d), a = d.map((q) => q / L);
  let s = [-a[1], a[0], 0], sl = Math.hypot(s[0], s[1]);
  if (sl < 1e-3) { s = [1, 0, 0]; sl = 1; }
  s = s.map((q) => q / sl);
  let u = [a[1] * s[2] - a[2] * s[1], a[2] * s[0] - a[0] * s[2], a[0] * s[1] - a[1] * s[0]];
  if (u[2] < 0) u = u.map((q) => -q);
  const ring = rrect(-w / 2, -h / 2, w / 2, h / 2, Math.min(w, h) / 2, 4);
  const at = (c, q) => P(c[0] + s[0] * q.u + u[0] * q.v, c[1] + s[1] * q.u + u[1] * q.v, c[2] + s[2] * q.u + u[2] * q.v);
  const k = h / 2 - Math.min(1, h / 4), b = Math.min(1.5, L / 4);
  const q0 = p0.map((v, i) => v + a[i] * b), q1 = p1.map((v, i) => v - a[i] * b);
  return { sil: poly(hull(ring.map((q) => at(p0, q)).concat(ring.map((q) => at(p1, q))))), crease: open([at(q0, { u: 0, v: k }), at(q1, { u: 0, v: k })]) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-28, -22, 0], [28, 22, 0], [0, 0, 106], [0, 40, 100], [40, 0, 100], [-30, -30, 100]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-26, -20, 26, 20, 14, 2);
  put(solid(g), prism(P, front, dr, di, 0, ZP));
  const handle = solid(g), neck = solid(g), head = solid(g), tuft = solid(g);
  const btn = mk("path", { class: "nf lo" }, g);
  tuft.sil.classList.add("hi");
  const sx = spring(RX), sy = spring(RY);
  let lx = NaN, ly = NaN;
  function draw(ax, ay) {
    if (ax === lx && ay === ly) return;
    lx = ax; ly = ay;
    const th = Math.hypot(ax, ay), ux = th ? ax / th : 1, uy = th ? ay / th : 0, c = Math.cos(rad(th)), s = Math.sin(rad(th));
    const Q = (x, y, z) => {
      const a = x * ux + y * uy, w = -x * uy + y * ux, h = z - ZP, a2 = a * c + h * s, h2 = -a * s + h * c;
      return P(a2 * ux - w * uy, a2 * uy + w * ux, ZP + h2);
    };
    put(handle, tube(Q, [0, 0, ZP - 2], [0, 0, 66], 15, 15));
    put(neck, tube(Q, [0, 0, 66], [0, 0, 90], 6, 6));
    put(head, tube(Q, [0, 0, 89], [0, 0, 106], 8, 5));
    put(tuft, tube(Q, [4, 0, 91], [4, 0, 104], 7, 5));
    const d = [];
    for (let k = 0; k < 14; k++) { const t = (k / 14) * Math.PI * 2; d.push(Q(7.6, 2.4 * Math.cos(t), 46 + 4 * Math.sin(t))); }
    btn.setAttribute("d", poly(d));
  }

  const B = register(stage, (dt) => { const a = stepS(sx, dt), b = stepS(sy, dt); draw(sx.x, sy.x); return a || b; });
  bag.add(B.unregister);
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
    if (r < 4) return;
    const th = MAX * reach * clamp(r / 60, 0, 1);
    sx.t = (th * x) / r; sy.t = (th * y) / r;
    read.textContent = Math.round(th) + "°";
    B.wake();
  }
  function leave() { sx.t = RX; sy.t = RY; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(RX, RY);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "toothbrushe",
  means: "An electric toothbrush in its charging dock: the brush leans in the dock towards the pointer, further as it moves away.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[329, 283], [110, 250], [200, 90], null],
  mount,
});
