/**
 * Radiator valve: a valve body on a length of pipe, with a long lever on its
 * spindle. The pointer turns the lever round the spindle to follow it, a
 * quarter turn from open, along the pipe, to shut, across it. At rest it lies
 * along the pipe, bright. The slider is how far a full turn goes.
 *
 * The pattern: one part turning on one axis (lever).
 */
const {
  Cam, clamp, fit, hull, poly, prism, proj, facing, rings, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 10, PRAD = 5, L = 42, SZ = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-40, -12, 0], [40, 12, 0], [-8, -L, SZ], [-8, L, SZ], [L, 0, SZ + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tube = (x0, x1) => { const p = []; for (const x of [x0, x1]) for (let a = 0; a < 20; a++) { const t = (a / 20) * Math.PI * 2; p.push(P(x, PRAD * Math.cos(t), PZ + PRAD * Math.sin(t))); } return poly(hull(p)); };
  mk("path", { d: tube(-40, -10), class: "sil" }, g);
  const [vr, vi] = rings(-10, -9, 10, 9, 4, 1.4);
  put(solid(g), prism(P, front, vr, vi, PZ - 9, PZ + 9));
  const [sr, si] = rings(-3.5, -3.5, 3.5, 3.5, 3.5, 1);
  put(solid(g), prism(P, front, sr, si, PZ + 9, SZ));
  const lever = mk("path", { class: "sil" }, g);
  mk("path", { d: tube(10, 40), class: "sil" }, g);

  let A = NaN;
  function draw(a) {
    if (a === A) return;
    A = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), p = [];
    for (const [u, v] of [[-6, -4], [L, -3.5], [L + 3, 0], [L, 3.5], [-6, 4]]) for (const z of [SZ, SZ + 3]) p.push(P(u * c - v * s, u * s + v * c, z));
    lever.setAttribute("d", poly(hull(p)));
  }
  const sp = spring(0, { k: 90, c: 16 });
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);

  function aim(pt) {
    let a = 0;
    if (pt) { const deg = (Math.atan2(pt[1], pt[0]) * 180) / Math.PI; a = clamp(deg, 8, 90) * reach; }
    sp.t = a;
    lever.classList.toggle("hi", a === 0);
    read.textContent = a === 0 ? "rest" : a > 80 ? "shut" : Math.round(a) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: ([sx, sy]) => aim(unproj(C, sx, sy, SZ)), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "radiatorkey",
  means: "A radiator valve on its pipe: the lever on the spindle turns after the pointer, a quarter turn from open to shut.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1],
  tour: [[236, 182], [170, 176], [108, 169], null],
  mount,
});
