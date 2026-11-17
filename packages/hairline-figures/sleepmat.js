/**
 * Sleeping mat: a foam mat half unrolled on the ground, the rest of it still
 * wound in a roll at its near end. At rest the roll is bright. The pointer
 * over the mat unrolls it: the roll travels out and shrinks as the mat
 * lays flat behind it. The slider is how far it unrolls.
 *
 * The pattern: one part rolling out.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, facing, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 56, FULL = 110, R0 = 18, REST = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let to = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [FULL + 10, W, 0], [FULL + 10, 0, 0], [0, W, 0], [REST, 0, 2 * R0], [REST + 2 * R0, W, 2 * R0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const mat = solid(g);
  const roll = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), core = mk("path", { class: "nf lo" }, g);
  roll.classList.add("hi");
  const len = tween(REST);
  let last = NaN;
  const circle = (cx, y, r, cz = r) => { const o = []; for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; o.push(P(cx + r * Math.cos(t), y, cz + r * Math.sin(t))); } return o; };

  function draw(l) {
    if (l === last) return;
    last = l;
    const r = 4 + (R0 - 4) * (1 - l / FULL);
    const [mr, mi] = rings(0, 0, l + r, W, 3, 1);
    put(mat, prism(P, front, mr, mi, 0, 2));
    roll.setAttribute("d", poly(hull(circle(l + r, 0, r).concat(circle(l + r, W, r)))));
    face.setAttribute("d", poly(circle(l + r, W, r)));
    core.setAttribute("d", poly(circle(l + r, W, r * 0.45, r)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(len, now)); return !tdone(len, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -8 && x < FULL + 14 && y > -10 && y < W + 10;
  }
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(len, a ? to : REST, performance.now(), 0);
    read.textContent = a ? "unroll" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { to = v; if (act) { tset(len, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sleepmat",
  means: "A foam sleeping mat half unrolled, its roll at the near end; the pointer over it rolls the roll out until the mat lies flat.",
  rules: [1, 5, 6, 8],
  range: [96, 104, 108],
  tour: [[143, 139], [181, 158], [105, 120], null],
  mount,
});
