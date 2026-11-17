/**
 * Sash window: a window frame on its sill with two glazed sashes, the upper
 * one fixed and the lower one in front of it. Raising the pointer slides the
 * lower sash up over the upper one; lower, it comes back down. At rest it
 * stands open a hand's width, bright.
 *
 * The pattern: one part following a continuous input (spring).
 */
const {
  Cam, fit, facing, prism, proj, rings, clamp, spring, stepS, poly, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 9, X0 = 6, X1 = 58;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, syLast = null;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-4, 0, 0], [68, 14, 0], [0, 0, 100], [64, 8, 100]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent) => {
    const [o, i] = rings(x0, y0, x1, y1, r, b), s = solid(parent || g);
    put(s, prism(P, front, o, i, z0, z1));
    return s;
  };
  const face = (y, z0, z1, el) => {
    const w = (X1 - X0) / 3, zm = (z0 + z1) / 2;
    let d = poly([P(X0 + 4, y, z0 + 4), P(X1 - 4, y, z0 + 4), P(X1 - 4, y, z1 - 4), P(X0 + 4, y, z1 - 4)]);
    d += seg(P(X0 + w, y, z0 + 4), P(X0 + w, y, z1 - 4)) + seg(P(X0 + 2 * w, y, z0 + 4), P(X0 + 2 * w, y, z1 - 4));
    d += seg(P(X0 + 4, y, zm), P(X1 - 4, y, zm));
    el.setAttribute("d", d);
  };
  box(0, 0, 64, 6, 2, 1.2, 4, 100);
  mk("path", { class: "nf lo", d: poly([P(X0, 6, 8), P(X1, 6, 8), P(X1, 6, 94), P(X0, 6, 94)]) }, g);
  box(-4, 0, 68, 14, 2, 1.2, 0, 4);
  box(X0, 6, X1, 8, 1, 0.5, 50, 94);
  face(8, 50, 94, mk("path", { class: "nf lo" }, g));
  const sg = mk("g", {}, g);
  const sash = solid(sg), bars = mk("path", { class: "nf lo" }, sg);
  sash.sil.classList.add("hi");

  let last = NaN;
  function draw(L) {
    if (Math.abs(L - last) < 0.05) return;
    last = L;
    const [o, i] = rings(X0, 8, X1, 10, 1, 0.5);
    put(sash, prism(P, front, o, i, 8 + L, 52 + L));
    face(10, 8 + L, 52 + L, bars);
  }

  const lift = spring(REST);
  draw(REST);
  let on = false;
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); show(); return m; });
  bag.add(B.unregister);
  function show() { read.textContent = on ? "up " + Math.round(lift.x) : "rest"; }
  function aim() { lift.t = syLast == null ? REST : clamp((250 - syLast) / 170, 0, 1) * 40 * reach; B.wake(); }
  show();
  bag.add(pointer(stage, {
    move: ([, sy]) => { on = true; syLast = sy; aim(); },
    leave: () => { on = false; syLast = null; aim(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; aim(); }, destroy: bag.dispose };
}

hairline({
  name: "cat6",
  means: "A sash window on its sill: raise the pointer and the lower sash slides up in front of the upper one; lower it and the sash comes down.",
  rules: [3, 4, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 90], [200, 240], [200, 140], null],
  mount,
});
