/**
 * Life ring: a ring buoy hung on a hook at the top of a slim post. The pointer
 * near the post swings the ring out off its hook toward the reader, as a hand
 * reaching for it would; the ring is the bright mark. The slider is the reach.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, rings, unproj, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const HZ = 74, R = 24, T = 6.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-16, -20, 0], [16, 20, 0], [0, 0, HZ + 6], [70, 0, HZ - 40], [8, -30, HZ - 30], [8, 30, HZ - 30]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const body = (s, ring, inner, w0, w1, M) => {
    const a = ring.map((q) => P(...M(q.u, q.v, w0))), b = ring.map((q) => P(...M(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    s.cr.setAttribute("d", poly(inner.map((q) => P(...M(q.u, q.v, w1)))));
  };
  const up = (u, v, w) => [u, v, w];
  const [fr, fi] = rings(-14, -18, 14, 18, 4, 1.5);
  body(solid(g), fr, fi, 0, 3, up);
  const [pr, pi] = rings(-4, -5, 4, 5, 2, 1);
  body(solid(g), pr, pi, 3, HZ + 4, up);
  const buoy = solid(g), hole = mk("path", { class: "nf" }, buoy.g), bands = mk("path", { class: "nf lo" }, buoy.g);
  buoy.sil.classList.add("hi");
  const a = spring(6);
  let last = NaN;
  function draw() {
    if (Math.abs(a.x - last) < 0.02) return;
    last = a.x;
    const r = (a.x * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    const M = (u, v, w) => { const dx = 5 + w, dz = v - R - 2; return [dx * c - dz * s, u, HZ + dx * s + dz * c]; };
    body(buoy, circ(R + T, 40), circ(R + T - 2, 40), 0, 5, M);
    hole.setAttribute("d", poly(circ(R - T, 32).map((q) => P(...M(q.u, q.v, 5)))));
    let d = "";
    for (const k of [0.6, 2.2, 3.8, 5.4]) {
      const p0 = P(...M((R - T) * Math.cos(k), (R - T) * Math.sin(k), 5)), p1 = P(...M((R + T) * Math.cos(k), (R + T) * Math.sin(k), 5));
      d += `M${p0[0].toFixed(1)},${p0[1].toFixed(1)}L${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    }
    bands.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y);
      const t = d > 130 ? 0 : clamp(1 - (d - 20) / 110, 0, 1);
      a.t = 6 + 58 * t * amp;
      read.textContent = t > 0 ? `${Math.round(a.t)}°` : "rest";
      B.wake();
    },
    leave: () => { a.t = 6; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "lifebuoy",
  means: "A ring buoy on its post: reach toward it and the ring swings out off its hook, ready to be thrown.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[213, 283], [149, 208], [192, 300], null],
  mount,
});
