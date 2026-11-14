/**
 * Film camera: a boxy cine camera on a low plinth, a lens barrel facing the
 * viewer and two film reels standing on its top. The pointer's place across
 * the stage winds the reels: their spokes turn on a spring and the lens
 * racks out, the front reel lighting up as it runs. At rest the lens hood is the bright mark and the
 * reels sit part-wound. The slider is how far one sweep winds them.
 *
 * The pattern: a continuous input turning parts (spin).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, seg, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 60, BY = 26, Z0 = 3, BZ = 44, RR = 15, RW = 7, LR = 9;
const REELS = [[15, 13], [45, 13]];
const REST = 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-6, -6, 0], [BX + 6, BY + 18, 0], [BX + 6, -6, 0], [-6, BY + 18, 0], [BX / 2, BY + 25, 4], [0, BY / 2, BZ + 2 * RR + 2], [BX, BY / 2, BZ + 2 * RR + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, BX + 6, BY + 18, 5, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));
  const [br, bi] = rings(0, 0, BX, BY, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, Z0, BZ));
  // a door seam on the side and a small finder on top
  mk("path", { d: open([P(BX, 4, Z0 + 6), P(BX, 4, BZ - 6)]) + seg(P(BX, 22, Z0 + 6), P(BX, 22, BZ - 6)), class: "nf lo" }, g);
  const [fr, fi] = rings(24, 2, 36, 9, 2, 0.8);

  // a disc standing in the x-z plane, centre (x, y, z): points at depth y
  const vcirc = (x, y, z, r, n = 36) => circ(r, n).map((q) => P(x + q.u, y, z + q.v));
  const ycirc = (x, z, y, r, n = 36) => circ(r, n).map((q) => P(x + q.u, y, z + q.v));

  put(solid(g), prism(P, front, fr, fi, BZ, BZ + 5));
  // reels, back to front (ascending x)
  const reels = REELS.map(([x, y], k) => {
    const cz = BZ + RR + 1, grp = mk("g", {}, g);
    // the arm that holds the reel
    put(solid(grp), prism(P, front, ...rings(x - 2, y - 2, x + 2, y + 2, 1, 0.6), BZ, cz));
    const sil = mk("path", { d: poly(hull(vcirc(x, y - RW / 2, cz, RR).concat(vcirc(x, y + RW / 2, cz, RR)))), class: "sil" }, grp);
    mk("path", { d: poly(vcirc(x, y + RW / 2, cz, RR - 1.6)), class: "nf lo" }, grp);
    const spokes = mk("path", { class: "nf" }, grp);
    mk("path", { d: poly(vcirc(x, y + RW / 2, cz, 2.4, 16)) }, grp);
    return { x, y, cz, sil, spokes, k };
  });

  // the lens barrel along +y, then its hood
  const lg = mk("g", {}, g), LX = BX / 2, LZ = (Z0 + BZ) / 2 - 2;
  const barrel = mk("path", { class: "sil" }, lg), hood = mk("path", { class: "sil" }, lg);
  const hr = mk("path", { class: "nf lo" }, lg), glass = mk("path", { class: "nf lo" }, lg);
  function lens(e) {
    barrel.setAttribute("d", poly(hull(ycirc(LX, LZ, BY, LR).concat(ycirc(LX, LZ, BY + 10 + e, LR)))));
    hood.setAttribute("d", poly(hull(ycirc(LX, LZ, BY + 10 + e, LR + 3).concat(ycirc(LX, LZ, BY + 15 + e, LR + 4)))));
    hr.setAttribute("d", poly(ycirc(LX, LZ, BY + 15 + e, LR + 2.6)));
    glass.setAttribute("d", poly(ycirc(LX, LZ, BY + 13 + e, LR - 2.5)));
  }
  const ext = spring(0);

  const ang = spring(REST);
  let lastA = NaN;
  let lastE = NaN;
  function draw(a, e) {
    if (e !== lastE) { lastE = e; lens(e); }
    if (a === lastA) return;
    lastA = a;
    for (const r of reels) {
      let d = "";
      for (let s = 0; s < 4; s++) {
        const t = a * (r.k ? 1 : 1.3) + (s * Math.PI) / 2;
        const c = Math.cos(t), sn = Math.sin(t);
        d += seg(P(r.x + 3 * c, r.y + RW / 2, r.cz + 3 * sn), P(r.x + (RR - 2.5) * c, r.y + RW / 2, r.cz + (RR - 2.5) * sn));
      }
      r.spokes.setAttribute("d", d);
    }
  }
  draw(REST, 0);

  const B = register(stage, (dt) => {
    const m = stepS(ang, dt), n = stepS(ext, dt);
    draw(ang.x, ext.x);
    return m || n;
  });
  bag.add(B.unregister);

  let on = null;
  function set(active, sx) {
    if (active) ang.t = REST + ((sx - 200) / 200) * Math.PI * gain;
    else ang.t = REST;
    ext.t = active ? 9 : 0;
    if (on !== active) {
      on = active;
      hood.classList.toggle("hi", !active);
      reels[1].sil.classList.toggle("hi", active);
    }
    const f = Math.round(((ang.t - REST) / (2 * Math.PI)) * 24);
    read.textContent = active ? "fr " + (f < 0 ? "−" : "+") + String(Math.abs(f)).padStart(2, "0") : "rest";
    B.wake();
  }
  set(false, 200);
  bag.add(pointer(stage, { move: ([sx]) => set(true, sx), leave: () => set(false, 200) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "filmcamera",
  means: "A cine camera with two film reels: moving across it winds the reels and racks the lens out; at rest the lens hood leads.",
  rules: [3, 4, 5, 8],
  range: [0.5, 1.5, 3],
  tour: [[230, 126], [150, 190], [271, 101], null],
  mount,
});
