/**
 * Lock cylinder: a euro-profile lock cylinder standing on end, its round
 * plug flush in the top face and a key home in the keyway, bow up. The
 * pointer is the hand on the key: over the lock, the key and plug turn,
 * further the further round the pointer goes. At rest the key sits a little
 * off square, its bow bright. The slider is how far the plug can turn.
 */
const {
  Cam, fit, prism, proj, facing, circ, rings, rrect, hull, poly, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const R = Math.PI / 180, H = 26, REST = 18, TURN = 90;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-17, -17, 0], [17, 34, 0], [17, -17, 0], [-17, 34, 0], [-22, 0, H + 41], [22, 0, H + 41], [0, -22, H + 41], [0, 22, H + 41]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(-6, 0, 6, 32, 5, 1.2);
  put(solid(g), prism(P, front, lr, li, 0, H));
  put(solid(g), prism(P, front, circ(16, 48), circ(14.8, 48), 0, H));
  put(solid(g), prism(P, front, circ(10, 40), circ(9, 40), H, H + 0.8));
  const slot = mk("path", { class: "nf lo" }, g);
  const key = mk("g", {}, g);
  const shank = mk("path", { class: "sil" }, key), bow = mk("path", { class: "sil hi" }, key), face = mk("path", { class: "nf lo" }, key), hole = mk("path", { class: "nf" }, key);
  const BOW = rrect(-21, 0, 21, 28, 12, 6), HOLE = circ(4, 24);
  const ang = spring(REST);
  let drawn = NaN;

  const plate = (shape, a, z0, t, ox = 0) => {
    const c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
    const pts = (k) => shape.map((q) => P((q.u + ox) * c + nx * k, (q.u + ox) * s + ny * k, z0 + q.v));
    return [pts(-t), pts(t)];
  };
  function draw() {
    if (Math.abs(ang.x - drawn) < 1e-3) return;
    drawn = ang.x;
    const a = ang.x * R, c = Math.cos(a), s = Math.sin(a);
    slot.setAttribute("d", poly([[-7, -1], [7, -1], [7, 1], [-7, 1]].map(([u, v]) => P(u * c - v * s, u * s + v * c, H + 0.85))));
    const [s0, s1] = plate(rrect(-4, -4, 4, 12, 1.5, 3), a, H, 1.4);
    shank.setAttribute("d", poly(hull(s0.concat(s1))));
    const [b0, b1] = plate(BOW, a, H + 12, 1.8);
    bow.setAttribute("d", poly(hull(b0.concat(b1))));
    const near = Math.cos(a) * 0 + (-s + c) >= 0 ? b1 : b0;
    face.setAttribute("d", poly(near));
    const [h0, h1] = plate(HOLE.map((q) => ({ u: q.u, v: q.v + 19 })), a, H + 12, 1.9);
    hole.setAttribute("d", poly(near === b1 ? h1 : h0));
  }
  const Bk = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(Bk.unregister);

  function set(t) {
    ang.t = t == null ? REST : REST + clamp(t, 0, 1) * TURN * value;
    read.textContent = t == null ? "rest" : Math.round(ang.t - REST) + "°";
    Bk.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], H);
      if (Math.hypot(x, y) > 46) return set(null);
      set(0.35 + 0.65 * clamp((x - y + 30) / 60, 0, 1));
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "lockpin",
  means: "A lock cylinder with its key home: over the lock, the key and plug turn, further as the pointer goes round.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[205, 165], [267, 171], [235, 140], null],
  mount,
});
