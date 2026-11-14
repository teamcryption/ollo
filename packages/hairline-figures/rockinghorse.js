/**
 * Rocking horse: a wooden horse on two curved runners. The pointer's side
 * sets the rock: to the right the nose dips and the runners roll forward, to
 * the left it sits back. At rest it leans back a little, the saddle bright.
 * The slider is how far it rocks.
 *
 * The pattern: one object tilting toward the pointer (spring).
 */
const {
  Cam, fit, facing, hull, open, poly, proj, rings, run, clamp, rad, spring, stepS,
  disposer, mk, pointer, register, solid,
} = HL;

const R = 60, A = 0.58, BAND = 3.2, REST = -4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-42, -12, 0], [44, 12, 0], [-42, 12, 0], [44, -12, 0], [-30, 0, 46], [36, 0, 66], [0, 0, 70]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a world point on the horse, rolled by th along its runners
  const T = (th) => { const c = Math.cos(th), s = Math.sin(th), ox = R * th;
    return (x, y, z) => { const dz = z - R; return P(ox + x * c + dz * s, y, R + dz * c - x * s); }; };

  const part = (x0, y0, x1, y1, r, b, z0, z1, sh = 0) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); return { ring, inner, z0, z1, sh }; };
  const rocker = (y) => ({ y, rk: true });
  const parts = [
    rocker(-9.5), rocker(-8),
    part(-16, -9, -12, -6, 1.4, 0.6, 5.5, 26), part(12, -9, 16, -6, 1.4, 0.6, 5.5, 26),
    part(-27, -2, -21, 2, 2, 0.8, 26, 40, -6),
    part(-20, -7, 20, 7, 5, 1.5, 24, 36),
    part(-8, -7.6, 7, 7.6, 3, 1, 36, 37.6),
    part(12, -4, 22, 4, 3, 1, 34, 52, 5),
    part(16, -4.2, 34, 4.2, 4, 1.2, 48, 58),
    part(17, -3, 21, 3, 1.5, 0.6, 58, 62),
    part(-16, 6, -12, 9, 1.4, 0.6, 5.5, 26), part(12, 6, 16, 9, 1.4, 0.6, 5.5, 26),
    rocker(8), rocker(9.5),
  ];
  for (const p of parts) p.s = p.rk ? { g: mk("g", {}, g), sil: null } : solid(g);
  for (const p of parts) if (p.rk) p.s.sil = mk("path", { class: p.y > 0 && p.y > 9 || p.y < -9 ? "sil" : "lo" }, p.s.g);
  const saddle = parts[6].s.sil, head = parts[8].s.sil, tail = parts[4].s.sil;

  function draw(th) {
    const tp = T(th);
    for (const p of parts) {
      if (p.rk) {
        const out = [], inn = [];
        for (let i = 0; i <= 24; i++) { const f = -A + (2 * A * i) / 24;
          out.push(tp(R * Math.sin(f), p.y, R - R * Math.cos(f)));
          inn.push(tp((R - BAND) * Math.sin(f), p.y, R - (R - BAND) * Math.cos(f))); }
        const tipA = tp(R * Math.sin(-A) - 3, p.y, R - R * Math.cos(-A) + 4), tipB = tp(R * Math.sin(A) + 3, p.y, R - R * Math.cos(A) + 4);
        p.s.sil.setAttribute("d", poly([tipA, ...out, tipB, ...inn.reverse()]));
        continue;
      }
      const top = p.ring.map((q) => tp(q.u + p.sh, q.v, p.z1));
      p.s.sil.setAttribute("d", poly(hull(p.ring.map((q) => tp(q.u, q.v, p.z0)).concat(top))));
      p.s.cr.setAttribute("d", open(run(p.inner, front).map((q) => tp(q.u + p.sh, q.v, p.z1))));
    }
  }

  const th = spring(rad(REST));
  let last = NaN;
  const B = register(stage, (dt) => {
    const moving = stepS(th, dt);
    if (th.x !== last) { last = th.x; draw(th.x); }
    return moving;
  });
  bag.add(B.unregister);
  draw(th.x);

  const cx = P(0, 0, 30)[0];
  let mode = "";
  function aim(sx) {
    const f = sx == null ? null : clamp((sx - cx) / 80, -1, 1);
    const deg = f == null ? REST : f * max;
    th.t = rad(deg);
    const m = f == null ? "rest" : f > 0.15 ? "head" : f < -0.15 ? "tail" : "seat";
    if (m !== mode) { mode = m;
      saddle.classList.toggle("hi", m === "rest" || m === "seat");
      head.classList.toggle("hi", m === "head");
      tail.classList.toggle("hi", m === "tail"); }
    read.textContent = f == null ? "rest" : (deg >= 0 ? "+" : "") + Math.round(deg) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p[0]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (mode !== "rest") B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "rockinghorse",
  means: "A rocking horse on curved runners: the pointer's side rocks it, nose down to the right, sitting back to the left.",
  rules: [1, 3, 4, 5, 8],
  range: [4, 12, 18],
  tour: [[256, 117], [104, 181], [200, 150], null],
  mount,
});
