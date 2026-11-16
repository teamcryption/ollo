/**
 * Chair lever: an office chair on a cross base and gas column, a lever
 * under the seat. The pointer over the chair pulls the lever: the seat,
 * back and lever sink down the column. At rest the lever is bright.
 */
const { Cam, facing, fit, prism, proj, rings, unproj, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const SZ = 34, DROP = 13;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-24, -24, 0], [24, 24, 0], [32, 8, SZ], [-16, -24, SZ + 44], [24, -24, SZ + 44]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (el, x0, y0, x1, y1, r, b, z0, z1) => { const [ri, ii] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, ri, ii, z0, z1)); };

  box(solid(g), -24, -3, 24, 3, 3, 1, 0, 3);
  box(solid(g), -3, -24, 3, 24, 3, 1, 0, 3);
  const col = solid(g), back = solid(g), post = solid(g), lever = solid(g), seat = solid(g);
  const h = tween(0);
  let last = "";
  function draw(d) {
    const k = d.toFixed(2); if (k === last) return; last = k;
    const z = SZ - d;
    box(col, -3, -3, 3, 3, 3, 1, 3, z);
    box(back, -16, -25, 16, -20, 5, 1.2, z + 12, z + 44);
    box(post, -3, -22, 3, -18, 1.5, 0.6, z, z + 14);
    box(lever, 14, 3, 31, 7, 1.5, 0.6, z - 3, z - 1);
    box(seat, -18, -19, 18, 19, 7, 1.6, z, z + 6);
  }
  const B = register(stage, (_dt, now) => { draw(tval(h, now)); return !tdone(h, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, SZ);
    if (x > -22 && x < 34 && y > -28 && y < 22) return 1;
    const [gx, gy] = unproj(C, sx, sy, 0);
    return Math.abs(gx) < 26 && Math.abs(gy) < 26 ? 1 : 0;
  }
  let act = -1;
  function setActive(a) {
    if (a === act) return; act = a;
    tset(h, a ? drop : 0, performance.now(), 0);
    lever.sil.classList.toggle("hi", !a);
    seat.sil.classList.toggle("hi", !!a);
    read.textContent = a ? "lever" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { drop = v; if (act) { tset(h, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "officechair",
  means: "An office chair: pull the gas lever and the seat and back sink down the column.",
  rules: [1, 5, 8],
  range: [6, 13, 18],
  tour: [[151, 159], [192, 215], [151, 250], null],
  mount,
});
