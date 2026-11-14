/**
 * Carport: a flat roof on four posts over a slab drive, a car parked under
 * it. The pointer stands on the drive and the car rolls to it, out from
 * under the roof or back into the bay, on a spring. At rest the car sits
 * half out and the roof is bright; once the pointer is on the drive the car takes it.
 *
 * The pattern: a part following the pointer along one axis (spring).
 */
const {
  Cam, fit, poly, prism, proj, rings, clamp, spring, stepS, unproj, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 72, D = 44, CL = 48, A0 = 6, A1 = 66, REST = 34, RZ = 30, X1 = A1 + CL + 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, 0], [X1, -6, 0], [-6, D + 6, 0], [X1, D + 6, 0], [-4, -4, RZ + 3], [L + 4, D + 4, RZ + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(-6, -6, X1, D + 6, 4, 1.5, 0, 2, g);
  // the bay, marked on the slab
  mk("path", { d: poly([P(2, 4, 2), P(L - 2, 4, 2), P(L - 2, D - 4, 2), P(2, D - 4, 2)]), class: "nf dash" }, g);
  const post = (x, y, parent) => box(x - 1.6, y - 1.6, x + 1.6, y + 1.6, 1.6, 0.5, 2, RZ, parent);
  post(0, 0, g); post(L, 0, g);
  const carG = mk("g", {}, g);
  post(0, D, g); post(L, D, g);
  const roof = box(-4, -4, L + 4, D + 4, 3, 1.5, RZ, RZ + 2.5, g);

  const body = solid(carG), cab = solid(carG), wheels = [mk("path", {}, carG), mk("path", {}, carG)];
  const wheel = (cx, y) => { const pts = []; for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; pts.push(P(cx + 4.2 * Math.cos(t), y, 4.2 + 4.2 * Math.sin(t))); } return poly(pts); };
  let last = NaN;
  function draw(a) {
    a = Math.round(a * 20) / 20;
    if (a === last) return;
    last = a;
    const [o, i] = rings(a, 9, a + CL, D - 9, 5, 1.5);
    put(body, prism(P, front, o, i, 3.5, 11.5));
    const [co, ci] = rings(a + 12, 11, a + CL - 12, D - 11, 5, 1.5);
    put(cab, prism(P, front, co, ci, 11.5, 19));
    wheels[0].setAttribute("d", wheel(a + 10, D - 9));
    wheels[1].setAttribute("d", wheel(a + CL - 10, D - 9));
  }

  const pos = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    roof.sil.classList.toggle("hi", !v);
    body.sil.classList.toggle("hi", v); cab.sil.classList.toggle("hi", v);
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wx < -14 || wx > X1 + 14 || wy < -16 || wy > D + 16) return leave();
    const a = clamp(wx - CL / 2, A0, lerpA()), pct = Math.round(((a - A0) / (A1 - A0)) * 100);
    pos.t = a;
    setOn(true);
    read.textContent = pct < 4 ? "in" : pct + "%";
    B.wake();
  }
  const lerpA = () => A0 + (A1 - A0) * (0.4 + 0.6 * reach);
  function leave() { pos.t = REST; setOn(false); read.textContent = "rest"; B.wake(); }
  draw(REST);
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "carport",
  means: "A carport over a slab drive: the car rolls out from under the roof, or back into the bay, to wherever the pointer stands.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[253, 201], [142, 146], [204, 176], null],
  mount,
});
