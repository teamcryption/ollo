/**
 * Extension ladder: a two-section ladder lying on the ground, the fly section
 * riding on top of the base on its rails, a pair of hooked locks at its foot.
 * The pointer's place along the ladder is where the fly's head goes: the fly
 * slides out or back on a spring, and the read-out gives the overlap. At rest
 * the fly is half out, bright. The slider is the farthest it may run.
 *
 * The pattern: a continuous reach read on the ground plane, which never moves.
 */
const {
  Cam, clamp, fit, prism, proj, rings, seg, spring, stepS, unproj, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 100, Wd = 30, R = 3, REST = 34, MIN = 8, STEP = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [L + 80, 0, 0], [0, Wd, 0], [L + 80, Wd, 0], [0, 0, 10]], 200, 168);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const rail = (par, x0, x1, y0, z0, z1) => { const [r, i] = rings(x0, y0, x1, y0 + R, 1.2, 0.5); put(solid(par), prism(P, front, r, i, z0, z1)); };
  rail(g, 0, L, 0, 0, 4);
  const rungs = mk("path", { class: "nf" }, g);
  { let d = ""; for (let x = 6; x < L; x += STEP) d += seg(P(x, R, 2), P(x, Wd - R, 2)); rungs.setAttribute("d", d); }
  rail(g, 0, L, Wd - R, 0, 4);

  const fly = mk("g", {}, g);
  const far = solid(fly), fr = mk("path", { class: "nf" }, fly), near = solid(fly), locks = mk("path", { class: "nf lo" }, fly);
  const ext = spring(REST);
  let last = "";
  function draw(e) {
    const key = e.toFixed(2);
    if (key === last) return;
    last = key;
    const x0 = e, x1 = e + L, z0 = 4.4, z1 = 8;
    let [r, i] = rings(x0, 1.5, x1, 1.5 + R, 1.2, 0.5); put(far, prism(P, front, r, i, z0, z1));
    [r, i] = rings(x0, Wd - 1.5 - R, x1, Wd - 1.5, 1.2, 0.5); put(near, prism(P, front, r, i, z0, z1));
    let d = ""; for (let x = x0 + 6; x < x1; x += STEP) d += seg(P(x, 1.5 + R, 6.2), P(x, Wd - 1.5 - R, 6.2));
    fr.setAttribute("d", d);
    let k = ""; for (const y of [1.5 + R / 2, Wd - 1.5 - R / 2]) k += seg(P(x0 + 3, y, z1), P(x0 + 3, y, z1 + 3)) + seg(P(x0 + 3, y, z1 + 3), P(x0 + 7, y, z1 + 3));
    locks.setAttribute("d", k);
    far.sil.classList.add("hi"); near.sil.classList.add("hi");
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ext, dt); draw(ext.x); return m; });
  bag.add(B.unregister);

  function move(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    if (wy < -40 || wy > Wd + 40 || wx < -20 || wx > L + 100) return leave();
    ext.t = clamp(wx - L, MIN, reach);
    read.textContent = "lap " + Math.round(L - ext.t);
    B.wake();
  }
  function leave() { ext.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "ladderext",
  means: "An extension ladder lying flat: the fly section slides out along the base to follow the pointer, and back again on leaving.",
  rules: [1, 3, 5, 8],
  range: [40, 60, 80],
  tour: [[233, 194], [343, 250], [298, 227], null],
  mount,
});
