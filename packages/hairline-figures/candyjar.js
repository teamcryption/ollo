/**
 * Candy jar: a round jar heaped with sweets, its lid sitting a little
 * raised. The pointer over the jar lifts the lid high off the mouth to show
 * the sweets; leaving sets it back down. The slider is how high it lifts.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const R = 34, H = 40, NR = 22, NZ = H + 7, REST = 5;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, NZ + 50]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2), 0, H));
  // shoulder and neck
  const sh = solid(g);
  sh.sil.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, R), H).concat(ringAt(P, disc(0, 0, NR), NZ)))));
  sh.cr.setAttribute("d", poly(ringAt(P, disc(0, 0, NR - 2), NZ)));
  // the sweets heaped in the mouth
  for (const [x, y, r, z] of [[-7, -5, 5, 0], [6, -6, 5, 0], [0, 4, 6, 1], [-8, 7, 4, 0], [9, 6, 4, 0], [1, -1, 5, 5]]) {
    const pts = [];
    for (const [k, dz] of [[0.6, 0], [1, r * 0.6], [0.6, r * 1.2]]) pts.push(...ringAt(P, disc(x, y, r * k, 16), NZ + z + dz - 1));
    mk("path", { d: poly(hull(pts)), class: "lo" }, g);
  }
  const lid = solid(g), knob = mk("path", { class: "nf" }, g);
  lid.sil.classList.add("hi");
  const z = tween(REST);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const b = NZ + l;
    put(lid, prism(P, front, disc(0, 0, NR + 4), disc(0, 0, NR + 2), b, b + 4));
    const kp = [];
    for (const [r, dz] of [[3, 0], [6, 4], [5, 7], [2, 8.5]]) kp.push(...ringAt(P, disc(0, 0, r, 20), b + 4 + dz));
    knob.setAttribute("d", poly(hull(kp)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? lift : REST, performance.now(), 0);
    read.textContent = on ? "lid up" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => {
    const [x, y] = unproj(C, sx, sy, H / 2);
    return Math.hypot(x, y) < R + 10;
  };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act) { tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "candyjar",
  means: "A round jar heaped with sweets: the pointer over it lifts the lid high off the mouth, and leaving sets it back down.",
  rules: [1, 5, 6, 8],
  range: [20, 32, 40],
  tour: [[200, 195], [228, 215], [170, 205], null],
  mount,
});
