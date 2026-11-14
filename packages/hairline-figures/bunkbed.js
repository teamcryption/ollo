/**
 * Bunk bed: two mattresses stacked on four posts, a ladder up the near side.
 * The pointer picks a bunk by where it stands on that bunk's own mattress:
 * its pillow lifts off as if plumped, and the other settles. At rest the top
 * pillow sits a little raised, bright. The slider is how high a pillow lifts.
 *
 * The pattern: stepped parts picked on their own rest tops (rule 01).
 */
const {
  Cam, circ, fit, facing, open, prism, proj, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 110, W = 46, Z = [12, 58], MT = 10, TOP = 96;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [0, 0, TOP + 2], [L, W + 6, TOP], [L, 0, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, y) => { const [a, b] = [disc(x, y, 3), disc(x, y, 2)]; put(solid(g), prism(P, front, a, b, 0, TOP)); };
  post(3, 3); post(L - 3, 3); post(3, W - 3);
  const bunks = [];
  for (let k = 0; k < 2; k++) {
    const z = Z[k], grp = mk("g", {}, g);
    const [r0, i0] = rings(2, 2, L - 2, W - 2, 4, 1.4);
    put(solid(grp), prism(P, front, r0, i0, z, z + 4));
    const [r1, i1] = rings(5, 5, L - 5, W - 5, 6, 2);
    put(solid(grp), prism(P, front, r1, i1, z + 4, z + MT));
    if (k === 1) { // guard rail on the top bunk
      mk("path", { d: open([P(3, W - 1, z + 18), P(L - 40, W - 1, z + 18)]), class: "nf" }, grp);
      mk("path", { d: open([P(L - 40, W - 1, z + 4), P(L - 40, W - 1, z + 18)]), class: "nf" }, grp);
    }
    const pil = solid(grp);
    pil.sil.classList.add("sil");
    bunks.push({ k, z: z + MT, pil, t: tween(k === 1 ? 5 : 0), last: NaN });
  }
  post(L - 3, W - 3);
  // the ladder, on the near side at the foot
  const lg = mk("g", {}, g), lx0 = L - 32, lx1 = L - 14, ly = W + 4;
  mk("path", { d: open([P(lx0, ly, 0), P(lx0, ly, Z[1] + MT + 8)]), class: "nf" }, lg);
  mk("path", { d: open([P(lx1, ly, 0), P(lx1, ly, Z[1] + MT + 8)]), class: "nf" }, lg);
  for (let i = 1; i <= 5; i++) { const z = i * 13, y = ly; mk("path", { d: open([P(lx0, y, z), P(lx1, y, z)]), class: "nf lo" }, lg); }

  function draw(b, h) {
    if (h === b.last) return;
    b.last = h;
    const [r, i] = rings(10, 9, 32, W - 9, 5, 1.5);
    put(b.pil, prism(P, front, r, i, b.z + h, b.z + h + 6));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const b of bunks) { draw(b, tval(b.t, now)); if (!tdone(b.t, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    for (const k of [1, 0]) {
      const [x, y] = unproj(C, sx, sy, Z[k] + MT);
      if (x > 0 && x < L && y > 0 && y < W + 4) return k;
    }
    return -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    bunks.forEach((b) => {
      tset(b.t, a < 0 ? (b.k === 1 ? 5 : 0) : b.k === a ? lift : 0, now, 0);
      b.pil.sil.classList.toggle("hi", b.k === (a < 0 ? 1 : a));
    });
    read.textContent = a < 0 ? "rest" : a === 1 ? "top" : "bottom";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; const a = act; act = -2; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "bunkbed",
  means: "Two bunks stacked on four posts with a ladder: the pointer picks a bunk on its own mattress and that pillow lifts off.",
  rules: [1, 4, 5, 6],
  range: [8, 20, 24],
  tour: [[205, 144], [230, 174], [205, 204], null],
  mount,
});
