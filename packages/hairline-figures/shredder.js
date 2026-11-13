/**
 * Shredder: a paper shredder on its bin, a head with a feed slot along its top
 * and a power dot, a window in the bin's front, and three sheets standing in
 * the slot, waiting. The pointer is a field along the slot: the sheet under it
 * feeds down into the slot on a spring, and its neighbours shift aside. At
 * rest the sheets wait at uneven depths, the middle one tall and bright. The
 * slider is how deep a sheet feeds.
 *
 * The pattern: a field on springs (terrain); the hit is on a fixed plane
 * through the sheets' resting middles.
 */
const {
  Cam, clamp, facing, fillet, fit, open, poly, prism, proj, rrect, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 64, D = 36, BH = 50, TOP = 60, YS = 17, H = 34, SWD = 15;
const CX = [15, 32, 49], REST = [6, 0, 11], FAV = 1, SHIFT = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let deep = 26 * value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, YS, TOP + H], [W, YS, TOP + H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the bin, its window on the near face, and the head above it with the slot
  const bin = solid(g);
  put(bin, prism(P, front, rrect(0, 0, W, D, 5, 12), rrect(1.4, 1.4, W - 1.4, D - 1.4, 3.6, 12), 0, BH));
  mk("path", { class: "nf lo", d: poly(rrect(12, 10, W - 12, 34, 3, 4).map((q) => P(q.u, D, q.v))) }, bin.g);
  const head = solid(g);
  put(head, prism(P, front, rrect(-1.5, -1.5, W + 1.5, D + 1.5, 6, 12), rrect(-0.3, -0.3, W + 0.3, D + 0.3, 4.8, 12), BH, TOP));
  mk("path", { class: "nf lo", d: poly(rrect(5, YS - 2, W - 5, YS + 2, 1.5, 4).map((q) => P(q.u, q.v, TOP))) }, head.g);
  const power = flatDot(head.g, C, 1.6, "dot off");
  place(power, P(W - 7, D - 6, TOP));

  // a sheet: a flat page in the x–z plane, standing in the slot, two faint fold lines
  const sheets = CX.map((c, k) => {
    const grp = mk("g", {}, g);
    return { k, c, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp),
      z: spring(REST[k]), x: spring(0), last: "" };
  });
  function draw(s) {
    const key = s.z.x.toFixed(2) + "," + s.x.x.toFixed(2);
    if (key === s.last) return;
    s.last = key;
    const x0 = s.c + s.x.x - SWD / 2, x1 = x0 + SWD, zt = TOP + H - s.z.x;
    const pts = fillet([[x0, TOP], [x1, TOP], [x1, zt], [x0, zt]], [0, 0, 1.2, 1.2], 3);
    s.sil.setAttribute("d", poly(pts.map(([x, z]) => P(x, YS, z))));
    const ln = (dz, w) => (zt - dz > TOP + 1 ? seg(P(x0 + 3, YS, zt - dz), P(x0 + 3 + w, YS, zt - dz)) : "");
    s.cr.setAttribute("d", ln(9, 9) + ln(13, 6));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of sheets) { if (stepS(s.z, dt)) m = true; if (stepS(s.x, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = -1, bd = 10;
    sheets.forEach((s, k) => { if (over !== null && Math.abs(over - s.c) < bd) { bd = Math.abs(over - s.c); near = k; } });
    sheets.forEach((s, k) => {
      if (over === null) { s.z.t = REST[k]; s.x.t = 0; }
      else {
        const d = Math.abs(over - s.c), f = Math.exp(-((d / 11) ** 2));
        s.z.t = clamp(Math.max(REST[k] * 0.4, deep * f), 0, H - 6);
        s.x.t = k === near ? 0 : Math.sign(s.c - over) * SHIFT * Math.max(0.3, Math.exp(-((d / 22) ** 2)));
      }
      s.sil.classList.toggle("hi", k === (over === null ? FAV : near));
    });
    read.textContent = near < 0 ? "rest" : "sheet " + (near + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, TOP + H / 2);
      over = x > 2 && x < W - 2 && Math.abs(y - YS) < 16 ? x : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { deep = 26 * v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "shredder",
  means: "A paper shredder with three sheets waiting: the sheet under the pointer feeds down into the slot, and its neighbours shift aside.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.75, 1],
  tour: [[150, 100], [200, 125], [250, 150], null],
  mount,
});
