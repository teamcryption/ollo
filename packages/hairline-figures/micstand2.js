/**
 * Drum stool: a round throne on a threaded spindle over three splayed legs.
 * The pointer turns the seat to face it, and as it turns the thread winds the
 * seat up: nearer the stool, higher the seat. At rest the seat sits low with
 * its stitch dot bright. The slider is the pitch of the thread.
 */
const { Cam, circ, clamp, fit, facing, poly, prism, proj, ringAt, seg, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const R = 46, T = 13, FOOT = 50, COL = 4, LO = 30, HI = 66, REST = { a: 2.2, h: 38 };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-FOOT, -FOOT, 0], [FOOT, FOOT, 0], [FOOT, -FOOT, 0], [-FOOT, FOOT, 0], [-R, -R, HI + T], [R, R, HI + T]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const angs = [0.4, 0.4 + 2.094, 0.4 + 4.189];
  const foot = (a) => [Math.cos(a) * FOOT, Math.sin(a) * FOOT];
  const depth = (a) => Math.cos(a) + Math.sin(a);
  const legsBack = mk("path", { class: "nf sil" }, g);
  const feetBack = mk("g", {}, g);
  const tube = solid(g);
  put(tube, prism(P, front, circ(COL + 3, 24), circ(COL + 2, 24), 14, 22));
  const spindle = solid(g);
  const threads = mk("path", { class: "nf lo" }, g);
  const legsFront = mk("path", { class: "nf sil" }, g);
  const feetFront = mk("g", {}, g);
  const seat = solid(g);
  const stitch = mk("path", { class: "nf lo" }, g);
  const dot = mk("circle", { r: 3, class: "dot" }, g);
  // legs: from the collar at z 16 down to rubber feet on the ground, far to near
  let lb = "", lf = "";
  for (const a of angs) {
    const [fx, fy] = foot(a), s = seg(P(Math.cos(a) * COL, Math.sin(a) * COL, 16), P(fx, fy, 2));
    const brace = seg(P(fx * 0.55, fy * 0.55, 9), P(Math.cos(a + 2.094) * FOOT * 0.55, Math.sin(a + 2.094) * FOOT * 0.55, 9));
    const back = depth(a) < 0;
    if (back) lb += s; else lf += s;
    lb += brace;
    const f = solid(back ? feetBack : feetFront);
    const ring = circ(4, 16).map((q) => ({ ...q, u: q.u + fx, v: q.v + fy }));
    const inner = circ(3, 16).map((q) => ({ ...q, u: q.u + fx, v: q.v + fy }));
    put(f, prism(P, front, ring, inner, 0, 3));
  }
  legsBack.setAttribute("d", lb);
  legsFront.setAttribute("d", lf);

  const pitch = { v: value };
  const sa = spring(REST.a), sh = spring(REST.h);
  let last = "", over = false;

  function draw() {
    const key = sa.x.toFixed(3) + "," + sh.x.toFixed(2);
    if (key === last) return;
    last = key;
    const h = sh.x;
    put(spindle, prism(P, front, circ(COL, 20), circ(COL - 1, 20), 22, h));
    let th = "";
    for (let z = 26; z < h - 2; z += 5) {
      const ph = (z / 5 + sa.x * 3) % 1;
      th += seg(P(-COL * Math.SQRT1_2, COL * Math.SQRT1_2, z + ph), P(COL * Math.SQRT1_2, -COL * Math.SQRT1_2, z + 1.5 + ph));
    }
    threads.setAttribute("d", th);
    put(seat, prism(P, front, circ(R, 64), circ(R - 2.2, 64), h, h + T));
    const turn = sa.x;
    const st = circ(R - 8, 64).map((q) => {
      const c = Math.cos(turn), s = Math.sin(turn);
      return { ...q, u: q.u * c - q.v * s, v: q.u * s + q.v * c };
    });
    stitch.setAttribute("d", poly(ringAt(P, st, h + T)));
    const [dx, dy] = P(Math.cos(turn) * (R - 8), Math.sin(turn) * (R - 8), h + T);
    dot.setAttribute("cx", dx); dot.setAttribute("cy", dy);
  }

  const B = register(stage, (dt) => { const a = stepS(sa, dt), b = stepS(sh, dt); draw(); return a || b; });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      if (r > FOOT + 60) { leave(); return; }
      over = true;
      let a = Math.atan2(y, x);
      while (a - sa.t > Math.PI) a -= 2 * Math.PI;
      while (a - sa.t < -Math.PI) a += 2 * Math.PI;
      sa.t = a;
      const k = clamp(1 - r / (FOOT + 40), 0, 1);
      sh.t = clamp(LO + (HI - LO) * Math.pow(k, 0.8 / pitch.v), LO, HI);
      seat.sil.classList.add("hi");
      dot.setAttribute("class", "dot m");
      read.textContent = `${Math.round(sh.t)} cm`;
      B.wake();
    },
    leave: () => leave(),
  }));
  function leave() {
    over = false;
    sa.t = REST.a + Math.round((sa.t - REST.a) / (2 * Math.PI)) * 2 * Math.PI; sh.t = REST.h;
    seat.sil.classList.remove("hi");
    dot.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  bag.add(() => svg.replaceChildren());
  draw(); leave();
  return { set: (v) => { pitch.v = v; }, destroy: bag.dispose };
}

hairline({
  name: "micstand2",
  means: "A drum stool: the seat turns to face the pointer and winds up its spindle, higher the nearer you come.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.6],
  tour: [[200, 232], [285, 274], [73, 295], null],
  mount,
});
