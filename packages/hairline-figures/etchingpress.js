/**
 * Etching press: a long bed between two side frames, pinched by a lower and
 * an upper roller, with a star wheel on the near frame. The pointer's place
 * along the press sets where the bed runs: the bed slides through the rollers
 * on a spring and the star wheel turns with it. At rest the bed is half run
 * through and the star wheel is bright. The slider is how far the bed runs.
 *
 * The pattern: a continuous input on a spring (terrain), on one part.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BL = 56, BW = 40, BZ = 20, R1 = 6, R2 = 7, AZ = 31, REST = -18, SP = 5, SR = 27;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-BL - 40, 0, BZ], [BL + 40, BW, BZ], [0, -6, 60], [0, BW + 12, AZ - SR], [0, BW + 12, AZ + SR], [-30, -8, 0], [30, BW + 8, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, cls) => {
    const s = solid(g); put(s, prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1));
    if (cls) s.sil.classList.add(cls); return s;
  };
  // a cylinder lying along y, at x, z
  const cylY = (parent, x, z, r, y0, y1) => {
    const ring = (y) => { const o = []; for (let i = 0; i < 32; i++) { const t = (i / 32) * 2 * Math.PI; o.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); } return o; };
    mk("path", { d: poly(hull(ring(y0).concat(ring(y1)))), class: "sil" }, parent);
    mk("path", { d: poly(ring(y1)), class: "nf lo" }, parent);
  };

  block(-30, -8, 30, BW + 8, 4, 2, 0, 4);
  block(-16, -6, 16, 0, 2, 1, 4, 58);
  cylY(g, 0, BZ - R1, R1, 0, BW);
  const bed = mk("g", {}, g);
  const bedS = solid(bed), blanket = mk("path", { class: "nf lo" }, bed);
  cylY(g, 0, AZ, R2, 0, BW);
  block(-16, BW, 16, BW + 6, 2, 1, 4, 58);
  const hub = mk("g", {}, g);
  cylY(hub, 0, AZ, 4, BW + 6, BW + 12);
  const wheel = mk("path", { class: "nf sil" }, g);

  const off = spring(REST);
  let last = NaN;
  function draw() {
    const o = off.x;
    if (o === last) return;
    last = o;
    put(bedS, prism(P, front, ...rings(-BL + o, 0, BL + o, BW, 3, 1.2), BZ, BZ + 3));
    blanket.setAttribute("d", poly(ringAt(P, rrect(-22 + o, 5, 22 + o, BW - 5, 2, 4), BZ + 3.6)));
    const a = -o / R2, yw = BW + 12;
    let d = "";
    for (let k = 0; k < SP; k++) {
      const t = a + (k / SP) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
      d += seg(P(4 * c, yw, AZ + 4 * s), P(SR * c, yw, AZ + SR * s));
      const kb = [];
      for (let i = 0; i < 12; i++) { const u = (i / 12) * 2 * Math.PI; kb.push(P(SR * c + 2.6 * Math.cos(u), yw, AZ + SR * s + 2.6 * Math.sin(u))); }
      d += poly(kb);
    }
    wheel.setAttribute("d", d);
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(off, dt); draw(); return m; });
  bag.add(B.unregister);

  function setTarget(t, on) {
    off.t = t;
    wheel.classList.toggle("hi", !on);
    bedS.sil.classList.toggle("hi", on);
    read.textContent = on ? "bed " + (t >= 0 ? "+" : "") + Math.round(t) : "rest";
    B.wake();
  }
  setTarget(REST, false);
  let px = null;
  const move = (p) => {
    px = p;
    const [x, y] = unproj(C, p[0], p[1], BZ);
    if (Math.abs(x) > BL + 30 || y < -20 || y > BW + 30) return setTarget(REST, false);
    setTarget(clamp(x * 0.7, -reach, reach), true);
  };
  bag.add(pointer(stage, { move, leave: () => { px = null; setTarget(REST, false); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (px) move(px); }, destroy: bag.dispose };
}

hairline({
  name: "etchingpress",
  means: "An etching press: the bed runs through the rollers toward the pointer and the star wheel turns with it.",
  rules: [1, 3, 5, 6],
  range: [12, 30, 44],
  tour: [[272, 194], [140, 130], [230, 170], null],
  mount,
});
