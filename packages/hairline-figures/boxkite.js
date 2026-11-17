/**
 * Box kite: two square cloth cells on four spars, flying on a dashed line
 * tethered to a peg. The pointer is the wind: the kite turns to face it and
 * rises on its line. At rest it hangs a little askew, its top cell bright.
 * The slider is how quickly it follows (a stiffer or softer spring).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const H = 18, Z0 = 22, CELL = 16, GAP = 18, REST = 0.35, RISE = 14;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-H - 4, -H - 4, Z0], [H + 4, H + 4, Z0], [-H, H, Z0 + 2 * CELL + GAP + RISE], [0, 70, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  place(flatDot(g, C, 1.6, "dot m"), P(0, 70, 0));
  const line = mk("path", { class: "dash nf" }, g);
  const spars = mk("path", { class: "nf lo" }, g);
  const low = solid(g), high = solid(g);
  const [R, I] = rings(-H, -H, H, H, 2.5, 1.2);
  const ang = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  const up = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let dA = NaN, dZ = NaN;

  function draw() {
    if (Math.abs(ang.x - dA) < 1e-4 && Math.abs(up.x - dZ) < 1e-3) return;
    dA = ang.x; dZ = up.x;
    const z = Z0 + up.x, r = turn(R, ang.x), i = turn(I, ang.x);
    put(low, prism(P, front, r, i, z, z + CELL));
    put(high, prism(P, front, r, i, z + CELL + GAP, z + 2 * CELL + GAP));
    const c = Math.cos(ang.x), s = Math.sin(ang.x);
    let d = "";
    for (const [u, v] of [[-H, -H], [H, -H], [H, H], [-H, H]]) {
      const x = u * c - v * s, y = u * s + v * c;
      d += seg(P(x, y, z - 4), P(x, y, z + 2 * CELL + GAP + 4));
    }
    spars.setAttribute("d", d);
    line.setAttribute("d", seg(P(0, 70, 0), P(H * (c - s), H * (s + c), z)));
  }

  const B = register(stage, (dt) => {
    const m1 = stepS(ang, dt), m2 = stepS(up, dt);
    draw();
    return m1 || m2;
  });
  bag.add(B.unregister);

  function aim(over) {
    if (over) {
      const t = Math.atan2(over[1], over[0]);
      ang.t = ang.t + (t - ang.t) - Math.PI / 2 * Math.round((t - ang.t) / (Math.PI / 2)) + Math.PI / 4;
      up.t = RISE;
      read.textContent = Math.round(((t * 180) / Math.PI + 360) % 360) + "°";
    } else { ang.t = REST; up.t = 0; read.textContent = "rest"; }
    high.sil.classList.toggle("hi", !over);
    low.sil.classList.toggle("hi", !!over);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      aim(r > 120 ? null : [x, y]);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return {
    set: (v) => { for (const sp of [ang, up]) { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "boxkite",
  means: "A box kite on its line: it turns its corner into the pointer's wind and rises, its lower cell bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[330, 205], [101, 219], [253, 295], null],
  mount,
});
