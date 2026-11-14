/**
 * Lathe: a long bed with a headstock and chuck at one end, a tailstock at
 * the other, a round workpiece held between them, and a tool carriage on
 * the front ways. The carriage slides along the bed to the pointer, its
 * cutting tool riding against the workpiece. At rest it sits a third of the
 * way along, tool bright. The slider is how much of the bed it may travel.
 *
 * The pattern: one part sliding to follow the pointer.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 160, W = 46, BZ = 10, AX = 20, AZ = 34, R = 7, X0 = 34, X1 = 128, REST = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [0, 0, 58], [L, W, 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 3, b = 1.4, par = g) => {
    const [a, i] = rings(x0, y0, x1, y1, r, b);
    const s = solid(par);
    put(s, prism(P, front, a, i, z0, z1));
    return s;
  };
  box(0, 0, L, W, 0, BZ, 5, 2);
  box(4, 6, L - 4, 18, BZ, BZ + 4, 2, 1); // rear ways
  box(0, 2, 30, 40, BZ, 52, 5, 2); // headstock
  // a round bar lying along x, as the hull of its two end circles
  const bar = (x0, x1, r, cls, par = g) => {
    const pts = [];
    const end = [];
    for (let i = 0; i < 28; i++) {
      const t = (i / 28) * Math.PI * 2, y = AX + r * Math.cos(t), z = AZ + r * Math.sin(t);
      pts.push(P(x0, y, z), P(x1, y, z));
      end.push(P(x1, y, z));
    }
    mk("path", { d: poly(hull(pts)), class: cls }, par);
    mk("path", { d: poly(hull(end)), class: "nf lo" }, par);
  };
  bar(30, 38, 12, "sil"); // chuck
  for (let k = 0; k < 3; k++) { const t = (k / 3) * Math.PI * 2 + 0.5; mk("path", { d: poly(hull([P(36, AX + 9 * Math.cos(t) - 1.5, AZ + 9 * Math.sin(t)), P(36, AX + 9 * Math.cos(t) + 1.5, AZ + 9 * Math.sin(t)), P(40, AX + 9 * Math.cos(t) + 1.5, AZ + 9 * Math.sin(t)), P(40, AX + 9 * Math.cos(t) - 1.5, AZ + 9 * Math.sin(t))])), class: "lo" }, g); }
  bar(38, 134, R, "sil"); // workpiece
  box(134, 8, 156, 32, BZ, 40, 4, 1.6); // tailstock
  bar(126, 134, 2.5, "sil"); // centre
  box(4, 32, L - 4, 42, BZ, BZ + 3, 2, 1); // front ways

  const car = mk("g", {}, g);
  const pos = spring(REST);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    car.replaceChildren();
    box(x - 12, 26, x + 12, 44, BZ + 3, BZ + 10, 3, 1.4, car); // saddle
    box(x - 7, 28, x + 7, 40, BZ + 10, AZ - 6, 2.5, 1.2, car); // cross slide
    const tool = box(x - 2, AX + R + 0.5, x + 2, 38, AZ - 6, AZ - 2, 1, 0.6, car);
    tool.sil.classList.add("hi");
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [x] = unproj(C, p[0], p[1], BZ);
    const span = (X1 - X0) * reach / 2;
    const t = clamp(x, REST - span, REST + span);
    pos.t = clamp(t, X0, X1);
    read.textContent = "z " + String(Math.round(pos.t - X0)).padStart(3, "0");
    B.wake();
  }
  function leave() { pos.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "lathe",
  means: "A lathe with a round workpiece between its centres: the tool carriage slides along the bed to the pointer.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[250, 220], [130, 140], [210, 180], null],
  mount,
});
