/**
 * Gear stick: a console with an H shift gate cut in its top, and a stick with
 * a round knob standing in it. The pointer picks the nearest gear: the stick
 * tilts across the gate to it. At rest it sits in neutral, leaning a little.
 */
const { Cam, fit, prism, proj, rings, circ, unproj, seg, spring, stepS, disposer, mk, open, pointer, put, register, solid, facing } = HL;

const H = 8, LEN = 34, GX = [-10, 0, 10], GY = 9;
const GEARS = [[-10, -GY], [-10, GY], [0, -GY], [0, GY], [10, -GY], [10, GY]];
const disc = (x, y, r) => circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-22, -20, 0], [22, 20, 0], [-14, -14, H + LEN + 8], [14, 14, H + LEN + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-22, -20, 22, 20, 6, 1.8), 0, H));
  mk("path", { class: "lo nf", d: seg(P(-10, -GY, H), P(-10, GY, H)) + seg(P(0, -GY, H), P(0, GY, H)) + seg(P(10, -GY, H), P(10, GY, H)) + seg(P(-10, 0, H), P(10, 0, H)) }, g);
  const stick = mk("path", { class: "nf sil" }, g), knob = solid(g);
  const sx = spring(2), sy = spring(-2);
  let drawn = "";
  function draw() {
    const k = sx.x.toFixed(3) + sy.x.toFixed(3);
    if (k === drawn) return;
    drawn = k;
    const f = 1.5, tx = sx.x * f, ty = sy.x * f;
    stick.setAttribute("d", seg(P(sx.x, sy.x, H), P(tx * 0.97, ty * 0.97, H + LEN)));
    put(knob, prism(P, front, disc(tx, ty, 6), disc(tx, ty, 4.6), H + LEN, H + LEN + 8));
  }
  const B = register(stage, (dt) => { const a = stepS(sx, dt), b = stepS(sy, dt); draw(); return a || b; });
  bag.add(B.unregister);
  function set(gp, name) {
    sx.t = gp[0] * (gp === null ? 1 : 1); sy.t = gp[1];
    knob.sil.classList.toggle("hi", true);
    read.textContent = name;
    B.wake();
  }
  const rest = () => set([2, -2], "rest");
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], H);
      if (Math.abs(x) > 34 || Math.abs(y) > 34) return rest();
      let bi = 0, bd = Infinity;
      GEARS.forEach((q, i) => { const d = Math.hypot(q[0] - x / 2, q[1] - y / 2); if (d < bd) { bd = d; bi = i; } });
      set(GEARS[bi], "gear " + (bi + 1));
    },
    leave: rest,
  }));
  bag.add(() => svg.replaceChildren());
  rest();
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "gearshift",
  means: "A gear stick in an H gate: the stick tilts across the gate to the gear nearest the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[195, 162], [291, 210], [205, 253], null],
  mount,
});
