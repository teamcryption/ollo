/**
 * Pirate ship: a deep hull with a raised stern castle, a bowsprit and one
 * tall mast carrying two square sails and a pennant. The pointer braces the
 * yards round: the sails turn on the mast to face the side the pointer is
 * on. At rest they hang braced a little, the topsail bright. The slider is
 * how far the yards can swing.
 */
const {
  Cam, fit, hull, open, poly, proj, clamp, fillet, rad, rings, prism, facing, ringAt, run, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 120, W = 34, HZ = 16, MX = 64, MY = 17, REST = 0.3;
const SAILS = [[34, 62, 30, 26], [66, 90, 22, 18]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, W, 0], [L + 22, MY, 34], [MX, MY, 104], [MX - 30, MY - 30, 34], [MX + 30, MY + 30, 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the hull: a narrower keel under a wide deck
  const hl = solid(g);
  const foot = rrect(10, 7, L - 14, W - 7, 8, 10), top = rrect(0, 0, L, W, 15, 10), inner = rrect(2, 2, L - 2, W - 2, 13, 10);
  put(hl, { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, HZ)))), crease: open(ringAt(P, run(inner, front), HZ)) });
  mk("path", { class: "nf lo", d: seg(P(14, W, 10), P(L - 18, W, 10)) }, hl.g);
  // the stern castle and the bowsprit
  const cs = solid(g);
  const [cr, ci] = rings(3, 3, 28, W - 3, 6, 1.2);
  put(cs, prism(P, front, cr, ci, HZ, HZ + 14));
  mk("path", { class: "nf lo", d: seg(P(28, 8, HZ + 9), P(28, W - 8, HZ + 9)) }, cs.g);
  mk("path", { class: "nf", d: seg(P(L - 4, MY, HZ + 2), P(L + 22, MY, 34)) }, g);
  // the mast and its pennant
  const ms = solid(g);
  const [mr, mi] = rings(MX - 2, MY - 2, MX + 2, MY + 2, 2, 0.6);
  put(ms, prism(P, front, mr, mi, HZ, 100));
  mk("path", { d: poly(fillet([P(MX, MY, 100), P(MX - 22, MY, 96), P(MX, MY, 92)], [0.6, 1, 0.6])) }, g);

  // the sails: plates turned about the mast, the foot bellied forward
  const sails = SAILS.map(() => { const s = solid(g); s.yard = mk("path", { class: "nf" }, s.g); return s; });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const dx = -Math.sin(a), dy = Math.cos(a), nx = Math.cos(a) * 6, ny = Math.sin(a) * 6;
    SAILS.forEach(([z0, z1, w0, w1], k) => {
      const at = (u, z, b) => P(MX + dx * u + nx * b, MY + dy * u + ny * b, z);
      const pts = [at(-w1, z1, 0), at(w1, z1, 0), at(w0, z0, 0.4), at(0, z0 + 2, 1), at(-w0, z0, 0.4)];
      sails[k].sil.setAttribute("d", poly(fillet(pts, [1.5, 1.5, 2, 6, 2])));
      sails[k].cr.setAttribute("d", open([at(0, z1 - 1, 0.2), at(0, (z0 + z1) / 2, 0.8), at(0, z0 + 3, 1)]));
      sails[k].cr.setAttribute("class", "nf lo");
      sails[k].yard.setAttribute("d", seg(at(-w1 - 4, z1 + 1, 0), at(w1 + 4, z1 + 1, 0)));
    });
  }
  const sp = spring(REST);
  const Bk = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(Bk.unregister);

  // the hit: a fixed patch of sea round the ship; its side picks the brace
  function aim(t) {
    const on = t !== null;
    sp.t = on ? t : REST;
    sails[0].sil.classList.toggle("hi", on);
    sails[1].sil.classList.toggle("hi", true);
    read.textContent = on ? Math.round((t * 180) / Math.PI) + "°" : "rest";
    Bk.wake();
  }
  aim(null);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      if (x < -30 || x > L + 40 || y < -70 || y > W + 70) return aim(null);
      aim(clamp((y - MY) / 45, -1, 1) * rad(amp));
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 20, 70); }, destroy: bag.dispose };
}

hairline({
  name: "pirateship",
  means: "A pirate ship with two square sails on one tall mast: the pointer braces the yards round, the sails turning to face its side.",
  rules: [1, 3, 5, 8],
  range: [20, 55, 70],
  tour: [[125, 250], [330, 236], [210, 190], null],
  mount,
});
