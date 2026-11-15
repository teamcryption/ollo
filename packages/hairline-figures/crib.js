/**
 * Crib: a baby cot on four posts, slatted sides front and back, a mattress
 * inside and a mobile hung over it from the back post. The pointer over the
 * cot lowers the front drop-side between its posts and turns the mobile; at
 * rest the drop-side sits a little low, its top rail bright. The slider is
 * how far the side drops.
 *
 * The pattern: one part answering (drop and turn).
 */
const {
  Cam, fit, facing, prism, proj, rings, rrect, ringAt, poly, hull, seg, clamp, unproj, rad,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 84, Y1 = 46, PH = 50, RT = 40, RB = 14, MZ = 74;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dmax = 6 + value * 22;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-3, -3, 0], [X1 + 3, Y1 + 3, 0], [X1 + 3, -3, 0], [-3, Y1 + 3, 0], [X1, 0, MZ + 4], [X1 / 2, Y1 / 2, MZ + 4], [0, Y1, PH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, y) => { const [r, i] = rings(x - 2.6, y - 2.6, x + 2.6, y + 2.6, 1.4, 0.7); put(solid(g), prism(P, front, r, i, 0, PH)); };
  const rail = (par, x0, x1, y, z0, z1) => { const [r, i] = rings(x0, y - 1.3, x1, y + 1.3, 1.2, 0.5); const s = solid(par); put(s, prism(P, front, r, i, z0, z1)); return s; };
  const slats = (y, d) => { let s = ""; for (let x = 8; x < X1 - 4; x += 6) s += seg(P(x, y, RB + 3 - d), P(x, y, RT - d)); return s; };

  // back: posts, side, mattress
  post(0, 0); post(X1, 0);
  rail(g, 2, X1 - 2, 0, RB, RB + 3); mk("path", { d: slats(0, 0), class: "lo nf" }, g); rail(g, 2, X1 - 2, 0, RT, RT + 3);
  const [mr, mi] = rings(3, 3, X1 - 3, Y1 - 3, 4, 1.6);
  put(solid(g), prism(P, front, mr, mi, RB - 2, RB + 6));
  post(0, Y1);

  // front drop-side, redrawn as it slides
  const fg = mk("g", {}, g);
  const fb = solid(fg), fs = mk("path", { class: "lo nf" }, fg), ft = solid(fg);
  post(X1, Y1);

  // the mobile: an arm from the back post, four toys on threads
  const ax = X1 / 2, ay = Y1 / 2;
  mk("path", { d: seg(P(X1, 0, PH), P(X1, 0, MZ)) + seg(P(X1, 0, MZ), P(ax, ay, MZ)), class: "nf" }, g);
  const mob = mk("g", {}, g);
  const thr = mk("path", { class: "lo nf" }, mob);
  const toys = [0, 1, 2, 3].map(() => mk("path", {}, mob));

  const sp = spring(0.25);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const d = p * dmax;
    const [br, bi] = rings(3, Y1 - 1.3, X1 - 3, Y1 + 1.3, 1.2, 0.5);
    put(fb, prism(P, front, br, bi, RB - d, RB + 3 - d));
    fs.setAttribute("d", slats(Y1, d));
    put(ft, prism(P, front, br, bi, RT - d, RT + 3 - d));
    const a0 = rad(20 + p * 120);
    let th = "";
    toys.forEach((t, k) => {
      const a = a0 + k * Math.PI / 2, x = ax + 14 * Math.cos(a), y = ay + 14 * Math.sin(a), z = MZ - 10 - (k % 2) * 5;
      th += seg(P(ax, ay, MZ), P(x, y, MZ - 3)) + seg(P(x, y, MZ - 3), P(x, y, z + 4));
      const ring = rrect(x - 3, y - 3, x + 3, y + 3, 3, 4);
      t.setAttribute("d", poly(hull(ringAt(P, ring, z - 3).concat(ringAt(P, ring, z + 3)))));
    });
    thr.setAttribute("d", th);
    // nearer toys paint last
    toys.map((t, k) => [t, Math.cos(a0 + k * Math.PI / 2) + Math.sin(a0 + k * Math.PI / 2)]).sort((u, v) => u[1] - v[1]).forEach(([t]) => mob.appendChild(t));
  }
  ft.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(sp.x);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, RT * 0.6);
    const inside = x > -8 && x < X1 + 8 && y > -8 && y < Y1 + 8;
    sp.t = inside ? clamp(0.55 + (y / Y1) * 0.45, 0.55, 1) : 0.25;
    read.textContent = inside ? "drop " + Math.round(sp.t * dmax) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = 0.25; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { dmax = 6 + v * 22; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "crib",
  means: "A baby cot with slatted sides: over it, the front drop-side slides down between its posts and the mobile above turns.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[190, 144], [215, 190], [175, 176], null],
  mount,
});
