/**
 * Rising bollard: three steel posts set in sleeves across a road, a dashed
 * lane line running through them. As the pointer comes up the road toward
 * the barrier line, the posts rise out of their sleeves, the one in the
 * pointer's lane first and highest. At rest they stand at uneven heights,
 * the middle one bright. The slider is the full rise.
 *
 * The pattern: a barrier answering how near the pointer is (spring).
 */
const {
  Cam, circ, clamp, fit, facing, open, poly, prism, proj, rings, ringAt, run,
  disposer, mk, pointer, put, register, solid, spring, stepS, unproj,
} = HL;

const SZ = 6, BX = 70, YS = [14, 40, 66], R = 8, REST = [10, 24, 6], FAV = 1;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let H = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [140, 80, 0], [140, 0, 0], [0, 80, 0], [BX, YS[0], SZ + 52], [BX, YS[2], SZ + 52]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(0, 0, 140, 80, 8, 2);
  put(solid(g), prism(P, front, rr, ri, 0, SZ));
  for (let x = 8; x < 132; x += 16) mk("path", { d: open([P(x, 40, SZ), P(Math.min(x + 9, 132), 40, SZ)]), class: "nf lo" }, g);
  mk("path", { d: open([P(BX - 12, 4, SZ), P(BX - 12, 76, SZ)]), class: "dash" }, g);

  const posts = YS.map((y, k) => {
    const grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(BX, y, R + 3), SZ)), class: "nf" }, grp);
    mk("path", { d: poly(ringAt(P, disc(BX, y, R + 1), SZ)), class: "nf lo" }, grp);
    const s = solid(grp), band = mk("path", { class: "nf lo" }, grp);
    return { y, k, s, band, h: spring(REST[k]), last: NaN };
  });
  function draw(p) {
    const h = Math.max(p.h.x, 0.5);
    if (Math.abs(h - p.last) < 0.01) return;
    p.last = h;
    put(p.s, prism(P, front, disc(BX, p.y, R), disc(BX, p.y, R - 1.6), SZ, SZ + h));
    p.band.setAttribute("d", h > 9 ? open(ringAt(P, run(disc(BX, p.y, R), front), SZ + h - 6)) : "");
  }
  posts.forEach(draw);

  const B = register(stage, (dt) => {
    let m = false;
    for (const p of posts) { if (stepS(p.h, dt)) m = true; draw(p); }
    return m;
  });
  bag.add(B.unregister);

  let lit = -2;
  function aim(pt) {
    let a = -1, f = 0;
    if (pt) {
      const [x, y] = unproj(C, pt[0], pt[1], SZ);
      if (x > -10 && x < 150 && y > -10 && y < 90) {
        f = 1 - clamp((Math.abs(x - BX) - 8) / 62, 0, 0.92);
        let bd = Infinity;
        YS.forEach((yy, k) => { const d = Math.abs(y - yy); if (d < bd) { bd = d; a = k; } });
      }
    }
    posts.forEach((p, k) => {
      p.h.t = a < 0 ? REST[k] : H * f * (k === a ? 1 : 0.62 + 0.1 * (2 - Math.abs(k - a))) + 4;
    });
    const hi = a < 0 ? FAV : a;
    if (hi !== lit) { lit = hi; posts.forEach((p, k) => p.s.sil.classList.toggle("hi", k === hi)); }
    read.textContent = a < 0 ? "rest" : "lane " + (a + 1) + " " + Math.round(f * 100) + "%";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { H = v; }, destroy: bag.dispose };
}

hairline({
  name: "bollardpost",
  means: "Three road bollards in their sleeves: as the pointer nears the barrier line they rise, the one in its lane highest.",
  rules: [1, 3, 4, 8],
  range: [24, 44, 48],
  tour: [[159, 114], [207, 179], [248, 241], null],
  mount,
});
