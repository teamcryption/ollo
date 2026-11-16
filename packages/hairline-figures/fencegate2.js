/**
 * Field gate: a five-bar timber gate hung on a hinge post, with a diagonal
 * brace, swinging shut against a latch post. The pointer swings it: the
 * further right the pointer stands, the wider the gate opens on its hinge.
 * At rest it hangs ajar, its latch stile bright. The slider is how far it
 * may open.
 *
 * The pattern: a continuous aim on one hinge (a spring on an angle); the hit
 * is the pointer's screen x, which never moves with the gate.
 */
const { Cam, fit, hull, poly, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const L = 64, H = 30, REST = 24;
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
// the leaf's parts, in the hinge's frame: two stiles, five bars, the brace
const LEAF = [box(1.5, -1.2, 2, 4.5, 1.2, H)];
for (const z of [3, 9, 15, 21, 27]) LEAF.push(box(3, -0.8, z, L - 3, 0.8, z + 2.6));
const BRACE = [];
for (let i = 0; i <= 8; i++) { const t = i / 8; BRACE.push([4 + t * (L - 12), -1, 4 + t * 22], [4 + t * (L - 12), 1, 4 + t * 22]); }
const STILE = box(L - 5, -1.4, 2, L - 2, 1.4, H + 1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-6, -6, 0], [L + 8, -6, 0], [-6, L + 4, 0], [L + 8, 6, H + 6], [0, 0, H + 6], [0, L, H + 2]], 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const draw0 = (pts, cls) => mk("path", { d: poly(hull(pts.map((p) => P(...p)))), class: cls }, g);
  // the ground strip and the two posts
  mk("path", { d: poly([P(-8, -8, 0), P(L + 10, -8, 0), P(L + 10, 8, 0), P(-8, 8, 0)]), class: "nf dash" }, g);
  draw0(box(L + 1, -2.6, 0, L + 6, 2.6, H + 5), "sil");
  draw0(box(-4.5, -2.8, 0, 1.2, 2.8, H + 6), "sil");
  draw0(box(-5.2, -3.4, H + 6, 1.9, 3.4, H + 7.4), "");
  const leaf = mk("g", {}, g);
  const parts = LEAF.map(() => mk("path", { class: "sil" }, leaf));
  const brace = mk("path", { class: "sil" }, leaf);
  const stile = mk("path", { class: "sil" }, leaf);
  const sp = spring(rad(REST), { k: 90, c: 16 });
  let last = NaN;
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt), a = sp.x;
    if (a !== last) {
      last = a;
      const c = Math.cos(a), s = Math.sin(a);
      const T = (pts) => poly(hull(pts.map(([x, y, z]) => P(x * c - y * s, x * s + y * c, z))));
      LEAF.forEach((b, i) => parts[i].setAttribute("d", T(b)));
      brace.setAttribute("d", T(BRACE));
      stile.setAttribute("d", T(STILE));
    }
    return m;
  });
  bag.add(B.unregister);
  function aim(deg, on) {
    sp.t = rad(deg);
    stile.classList.toggle("hi", true);
    read.textContent = on ? Math.round(deg) + "\u00b0" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(clamp((sx - 110) / 190, 0, 1) * (40 + 50 * reach), true),
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "fencegate2",
  means: "A five-bar field gate on its hinge post: the pointer swings it open, further the further right it stands.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[321, 162], [150, 150], [260, 170], null],
  mount,
});
