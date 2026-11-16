/**
 * Pulley kit: a stand with a crossbar, a pulley block hanging from it and a
 * weight on the rope. The pointer pulls the weight toward itself: rope and
 * weight swing on a spring, and the weight is bright. At rest it hangs a
 * little off plumb.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, spring, stepS, clamp,
  disposer, mk, open, pointer, put, register, solid,
} = HL;

const H = 110, L = 62, REST = -0.14, UX = Math.SQRT1_2, UY = -Math.SQRT1_2;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  const ext = [[-50, 50, 0], [50, -50, 0], [-30, -30, 0], [30, 30, 0], [-50, 50, H + 6], [50, -50, H + 6]];
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-46, 34, -34, 46, 3, 1.2), 0, 4));
  put(solid(g), prism(P, front, ...rings(34, -46, 46, -34, 3, 1.2), 0, 4));
  put(solid(g), prism(P, front, disc(-40, 40, 2.4, 16), null, 4, H));
  put(solid(g), prism(P, front, disc(40, -40, 2.4, 16), null, 4, H));
  const beam = [];
  for (let k = 0; k <= 8; k++) beam.push(P(-40 + k * 10, 40 - k * 10, H + 2));
  mk("path", { class: "nf sil", d: open(beam) }, g);
  const wheel = [];
  for (let k = 0; k <= 32; k++) { const a = (k / 32) * Math.PI * 2; wheel.push(P(7 * Math.cos(a) * UX, 7 * Math.cos(a) * UY, H - 10 + 7 * Math.sin(a))); }
  mk("path", { d: open(wheel) }, g);
  mk("path", { class: "nf sil", d: seg(P(0, 0, H + 2), P(0, 0, H - 10)) + seg(P(-7 * UX, -7 * UY, H - 10), P(-7 * UX, -7 * UY, 8)) }, g);
  const rope = mk("path", { class: "nf sil" }, g);
  const wt = solid(g);
  const sp = spring(REST);
  let drawn = NaN;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const ox = 7 * UX, oy = 7 * UY, top = H - 10;
    const dx = L * Math.sin(a), dz = L * Math.cos(a);
    const cx = ox + dx * UX, cy = oy + dx * UY, cz = top - dz;
    rope.setAttribute("d", seg(P(ox, oy, top), P(cx, cy, cz)));
    put(wt, prism(P, front, ...rings(cx - 9, cy - 9, cx + 9, cy + 9, 9, 1.4), cz - 22, cz));
    wt.sil.classList.add("hi");
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over === null ? REST : clamp(over / 60, -1, 1) * 0.9 * value;
    read.textContent = over === null ? "rest" : Math.round((sp.t * 180) / Math.PI) + "°";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), s = x * UX + y * UY;
      over = Math.abs(s) > 90 ? null : s;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "pulleykit",
  means: "A pulley stand with a hanging weight: the rope and weight swing toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[313, 239], [90, 239], [250, 239], null],
  mount,
});
