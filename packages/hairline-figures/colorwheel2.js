/**
 * Color wheel: a flat wheel of twelve segments on a hub. The wheel spins to
 * the pointer's x, one segment's dot bright; at rest it sits a part-turn round.
 */
const { Cam, circ, fit, facing, clamp, lerp, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj, disposer, mk, pointer, put, register, solid, flatDot, place } = HL;

const R = 50, N = 12, HZ = 8, WZ = 12, REST = 0.2;
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, WZ + 2]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(14), disc(12), 0, HZ));
  const w = solid(g);
  put(w, prism(P, front, disc(R), disc(R - 2), HZ, WZ));
  const spokes = mk("path", { class: "nf" }, g), inner = mk("path", { class: "nf lo" }, g);
  inner.setAttribute("d", poly(ringAt(P, disc(R * 0.32), WZ)));
  const dots = [];
  for (let i = 0; i < N; i++) dots.push(flatDot(g, C, 2.2, i === 0 ? "dot" : "dot off"));
  const hub = solid(g);
  put(hub, prism(P, front, disc(5, 20), disc(3.5, 20), WZ, WZ + 2));
  w.sil.classList.add("hi");
  const t = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a0 = v * Math.PI * 1.75;
    let d = "";
    for (let i = 0; i < N; i++) {
      const a = a0 + (i * 2 * Math.PI) / N, c = Math.cos(a), s = Math.sin(a);
      d += seg(P(c * R * 0.32, s * R * 0.32, WZ), P(c * (R - 2), s * (R - 2), WZ));
      const b = a + Math.PI / N;
      place(dots[i], P(Math.cos(b) * R * 0.72, Math.sin(b) * R * 0.72, WZ));
    }
    spokes.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { t.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    const v = clamp((wx - wy + R * 1.4) / (R * 2.8), 0, 1);
    t.t = v;
    read.textContent = Math.round(v * 315) + "°";
    B.wake();
  }
  draw(REST); aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "colorwheel2",
  means: "A flat color wheel of twelve segments on a hub: the wheel spins round as the pointer moves across it.",
  rules: [1, 3, 5, 8],
  range: [0, 50, 100],
  tour: [[319, 160], [42, 160], [200, 160], null],
  mount,
});
