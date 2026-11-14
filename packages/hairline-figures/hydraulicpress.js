/**
 * Hydraulic press: a bed between two columns under a crown, a ram hanging
 * from the crown over a blank on the bed. The pointer's height over the press
 * drives the ram down onto the blank, on a spring. At rest the ram hangs
 * part way, bright. The slider is the press's stroke.
 *
 * The pattern: one part following a continuous input (press).
 */
const { Cam, fit, facing, prism, proj, rings, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const TOP = 92, WZ = 15, REST = 0.3;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stroke = value / 100;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-4, -4, 0], [84, 54, 0], [84, -4, 0], [-4, 54, 0], [0, 12, TOP + 14], [80, 38, TOP + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, cls) => {
    const [a, i] = rings(x0, y0, x1, y1, r, b), s = solid(g);
    put(s, prism(P, front, a, i, z0, z1));
    return s;
  };
  box(-4, -4, 84, 54, 0, 10, 5, 2);
  box(4, 18, 14, 32, 10, TOP, 3, 1.2);
  box(26, 15, 54, 35, 10, 13, 2, 1.5);
  const blank = box(30, 18, 50, 32, 13, WZ, 1.5, 1);
  const ram = solid(g);
  const [ra, ri] = rings(22, 12, 58, 38, 3, 1.6);
  box(66, 18, 76, 32, 10, TOP, 3, 1.2);
  box(0, 12, 80, 38, TOP, TOP + 14, 4, 2);
  const lo = () => WZ + 1 + (1 - stroke) * 18, hi = TOP - 20;
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    put(ram, prism(P, front, ra, ri, lerpZ(v), TOP));
  }
  const lerpZ = (v) => hi + (lo() - hi) * v;
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const yT = P(40, 25, TOP)[1], yB = P(40, 25, WZ + 10)[1], xs = [P(0, 50, 0)[0], P(84, 0, 0)[0]];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xs[0] - 10 && p[0] < xs[1] + 10 && p[1] > yT - 30 && p[1] < yB + 40) {
      t = clamp((p[1] - yT) / (yB - yT), 0, 1); on = true;
    }
    sp.t = t;
    const s = on ? Math.round(t * 100) + "%" : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    ram.sil.classList.toggle("hi", !on || t < 0.97);
    blank.sil.classList.toggle("hi", on && t >= 0.97);
    B.wake();
  }
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stroke = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "hydraulicpress",
  means: "A press with a ram over a blank: the pointer's height drives the ram down until it meets the blank.",
  rules: [1, 3, 5, 8],
  range: [0, 100, 100],
  tour: [[200, 114], [175, 170], [200, 218], null],
  mount,
});
