/**
 * Water crane: a railway water column on a square plinth, with a long arm
 * pivoting on its top and a leather hose hanging from the arm's end. The
 * pointer is where the tender's filler stands: the arm swings round the
 * column to face it, on a spring. At rest the arm points out front-right and
 * the hose is bright. The slider is how far the arm may swing.
 *
 * The pattern: a continuous aim (spotlights), the hit on a fixed plane at the
 * arm's height, paint order swapped when the hose passes behind the column.
 */
const {
  Cam, circ, clamp, fit, open, run, facing, hull, poly, prism, proj, rings, ringAt, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 74, ZC = 74, AW = 4, AH = 6, RH = 4.2, ZH = 26, REST = rad(20), PL = 18;
const rot = (ring, th, cx, cy) => {
  const c = Math.cos(th), s = Math.sin(th);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = rad(value);
  const C = Cam(45, 0.5, 2.42);
  const ext = [];
  for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; ext.push([(L + 6) * Math.cos(t), (L + 6) * Math.sin(t), ZC + AH + 4], [(L + 6) * Math.cos(t), (L + 6) * Math.sin(t), ZH - 4]); }
  ext.push([-PL, -PL, 0], [PL, PL, 0], [PL, -PL, 0], [-PL, PL, 0]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // plinth and its drain grate
  const [pr, pi] = rings(-PL, -PL, PL, PL, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, 6));
  const [br, bi] = rings(-10, -10, 10, 10, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 6, 12));
  // hose (painted before or after the column), column, arm, pivot cap
  const hoseG = mk("g", {}, g);
  const hose = solid(hoseG), nozzle = mk("path", { class: "nf lo" }, hoseG);
  const colG = mk("g", {}, g);
  put(solid(colG), prism(P, front, circ(6, 28), circ(4.4, 28), 12, ZC));
  put(solid(colG), prism(P, front, circ(8, 28), circ(6.4, 28), 40, 44));
  const armG = mk("g", {}, g);
  const arm = solid(armG), cw = solid(armG), cap = solid(armG);
  const th = spring(REST);
  let last = NaN, behind = null;

  function draw(a) {
    if (a === last) return;
    last = a;
    const tx = L * Math.cos(a), ty = L * Math.sin(a);
    const [ar, ai] = rings(-10, -AW / 2, L + 3, AW / 2, 1.8, 0.7);
    put(arm, prism(P, front, rot(ar, a, 0, 0), rot(ai, a, 0, 0), ZC, ZC + AH));
    const [wr, wi] = rings(-20, -5, -8, 5, 2, 0.9);
    put(cw, prism(P, front, rot(wr, a, 0, 0), rot(wi, a, 0, 0), ZC + AH, ZC + AH + 7));
    put(cap, prism(P, front, circ(5, 24), circ(3.6, 24), ZC + AH, ZC + AH + 4));
    const top = disc(tx, ty, RH), bot = disc(tx + 3 * Math.cos(a), ty + 3 * Math.sin(a), RH);
    hose.sil.setAttribute("d", poly(hull(ringAt(P, top, ZC).concat(ringAt(P, disc(tx + 1.5 * Math.cos(a), ty + 1.5 * Math.sin(a), RH), (ZC + ZH) / 2), ringAt(P, bot, ZH)))));
    hose.cr.setAttribute("d", "");
    nozzle.setAttribute("d", open(ringAt(P, run(disc(tx + 3 * Math.cos(a), ty + 3 * Math.sin(a), RH), front), ZH + 5)));
    const b = tx + ty < 0;
    if (b !== behind) { behind = b; if (b) colG.before(hoseG); else colG.after(hoseG); }
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function aim(p) {
    let t = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], ZC);
      const d = Math.hypot(wx, wy);
      if (d > 12 && d < L * 1.9) {
        let diff = Math.atan2(wy, wx) - REST;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        t = REST + clamp(diff, -reach, reach);
      } else p = null;
    }
    th.t = t;
    const on = !!p;
    if (on !== act) { act = on; arm.sil.classList.toggle("hi", on); hose.sil.classList.toggle("hi", !on); }
    read.textContent = on ? "arm " + Math.round(((t * 180) / Math.PI + 360) % 360) + "°" : "rest";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = rad(v); }, destroy: bag.dispose };
}

hairline({
  name: "watercrane",
  means: "A railway water crane: the long arm on top of the column swings round to face the pointer, its hose swinging with it.",
  rules: [1, 3, 6, 8],
  range: [30, 110, 170],
  tour: [[80, 163], [80, 44], [354, 146], null],
  mount,
});
