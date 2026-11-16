/**
 * Corner flag: a flag pole on a sprung base at the corner of a pitch, the
 * quarter arc and touchlines dashed on the grass. The pointer pushes the
 * pole: it swings away from the pointer about its spring, the flag riding on
 * top, and springs back to a slight lean when the pointer leaves. At rest the
 * flag is bright. The slider is how far the spring gives.
 */
const { Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rrect, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const H = 92, REST = [0.1, -0.06];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let give = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-10, -10, 0], [70, 0, 0], [0, 70, 0], [0, 0, H + 6], [30, 30, H - 10], [-30, -30, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "dash", d: open([P(0, 72, 0), P(0, 0, 0), P(72, 0, 0)]) }, g);
  const arc = [];
  for (let i = 0; i <= 20; i++) { const t = (i / 20) * Math.PI / 2; arc.push(P(30 * Math.cos(t), 30 * Math.sin(t), 0)); }
  mk("path", { class: "dash", d: open(arc) }, g);
  put(solid(g), prism(P, front, circ(7, 32), circ(5.5, 32), 0, 3));
  const coil = solid(g), pole = solid(g), flag = solid(g);
  const ax = spring(REST[0]), ay = spring(REST[1]);
  const R3 = (p, a, b) => {
    let [x, y, z] = p;
    [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
    [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
    return [x, y, z + 3];
  };
  const slab = (s, ring, inner, a, b, m) => {
    const pr = (q, t) => P(...m(q.u, q.v, t));
    s.sil.setAttribute("d", poly(hull(ring.map((q) => pr(q, a)).concat(ring.map((q) => pr(q, b))))));
    s.cr.setAttribute("d", poly(inner.map((q) => pr(q, b))));
  };
  let last = "";
  function draw() {
    const key = ax.x.toFixed(3) + ay.x.toFixed(3);
    if (key === last) return;
    last = key;
    const a = ax.x, b = ay.x;
    slab(coil, circ(3.2, 20), circ(2.2, 20), 0, 12, (u, v, t) => R3([u, v, t], a * 0.3, b * 0.3));
    slab(pole, circ(1.6, 16), circ(0.8, 16), 12, H, (u, v, t) => R3([u, v, t], a, b));
    slab(flag, rrect(0, H - 26, 26, H - 2, 1.5, 4), rrect(1, H - 25, 25, H - 3, 1, 4), -0.4, 0.4,
      (u, w, t) => R3([u * 0.7 + 1, -u * 0.7 + t, w + Math.sin(u / 8) * 2], a, b));
  }
  const B = register(stage, (dt) => { const m = stepS(ax, dt) | stepS(ay, dt); draw(); return !!m; });
  bag.add(B.unregister);
  function aim(p) {
    let on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y);
      if (d < 110) {
        on = true;
        const k = clamp(1 - d / 110, 0.25, 1) * 0.55 * give;
        ax.t = clamp((-y / (d || 1)) * -k, -0.6, 0.6); ay.t = clamp((-x / (d || 1)) * k, -0.6, 0.6);
        read.textContent = Math.round(Math.hypot(ax.t, ay.t) * 57) + "°";
      }
    }
    if (!on) { ax.t = REST[0]; ay.t = REST[1]; read.textContent = "rest"; }
    flag.sil.classList.toggle("hi", !on);
    pole.sil.classList.toggle("hi", on);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { give = v; }, destroy: bag.dispose };
}

hairline({
  name: "corner",
  means: "A corner flag on a sprung base: the pole swings away from the pointer and springs back to a slight lean when it leaves.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[200, 270], [101, 249], [290, 240], null],
  mount,
});
