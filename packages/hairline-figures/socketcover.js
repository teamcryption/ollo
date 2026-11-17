/**
 * Floor socket: a square brass plate set in the floor, a recessed socket
 * face with two round pin holes and an earth slot, under a flat lid hinged
 * at its far edge. The pointer over it flips the lid up on its hinge to bare
 * the socket. At rest the lid sits a little ajar, bright. The slider is how
 * far the lid swings.
 *
 * The pattern: one part tilting about a fixed hinge.
 */
const { Cam, clamp, fit, hull, poly, proj, rad, rrect, ringAt, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const H = 36, L = 31, ZT = 5, TH = 2.6;
const disc = (x, y, r, n = 20) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(t), y + r * Math.sin(t)]); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-H, -H, 0], [H, H, 0], [-H, H, 0], [H, -H, 0], [-54, -L, 66], [-54, L, 66], [-L, L, 8]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // the plate set in the floor, with its recessed face
  const base = solid(g);
  base.sil.setAttribute("d", poly(hull(ringAt(P, rrect(-H, -H, H, H, 6, 6), 0).concat(ringAt(P, rrect(-H, -H, H, H, 6, 6), ZT)))));
  base.cr.setAttribute("d", poly(ringAt(P, rrect(-H + 2, -H + 2, H - 2, H - 2, 4.5, 6), ZT)));
  const face = [poly(ringAt(P, rrect(-19, -21, 21, 21, 7, 6), ZT)), poly(ringAt(P, rrect(-17, -19, 19, 19, 5.5, 6), ZT))];
  for (const s of [-1, 1]) face.push(poly(disc(4, s * 9, 3.6).map(([x, y]) => P(x, y, ZT))));
  face.push(poly(ringAt(P, rrect(-12, -2.2, -7, 2.2, 1.2, 3), ZT)));
  mk("path", { class: "nf lo", d: face.join("") }, g);

  // the lid: a thin plate turning about the hinge line x = -L, z = ZT
  const lg = mk("g", {}, g);
  const knuck = mk("path", { class: "nf" }, lg);
  const lid = solid(lg);
  lid.sil.classList.add("hi");
  const ring = rrect(-L, -L, L, L, 5, 6), inn = rrect(-L + 2.4, -L + 2.4, L - 2.4, L - 2.4, 3.5, 6);
  const notch = rrect(L - 9, -6, L - 3, 6, 2.5, 4);
  const notchEl = mk("path", { class: "nf lo" }, lg);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(lerp(10, clamp(96 * amp, 20, 112), t)), ca = Math.cos(a), sa = Math.sin(a);
    const W = (x, y, z) => { const dx = x + L, dz = z - ZT; return P(-L + dx * ca - dz * sa, y, ZT + dx * sa + dz * ca); };
    const R = (r, z) => r.map((q) => W(q.u, q.v, z));
    lid.sil.setAttribute("d", poly(hull(R(ring, ZT + 0.2).concat(R(ring, ZT + TH)))));
    // the crease on whichever face of the lid looks at us
    const up = -0.61 * sa + 0.5 * ca > 0, zc = up ? ZT + TH : ZT + 0.2;
    lid.cr.setAttribute("d", poly(R(inn, zc)));
    notchEl.setAttribute("d", poly(R(notch, zc)));
    knuck.setAttribute("d", poly(hull(R(rrect(-L - 2, -14, -L + 4, 14, 2.5, 4), ZT).concat(R(rrect(-L - 2, -14, -L + 4, 14, 2.5, 4), ZT + TH + 1)))));
  }
  const lerp = (x, y, t) => x + (y - x) * t;
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, ZT);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 80), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "socketcover",
  means: "A floor socket under a hinged lid: the pointer flips the lid up on its far hinge to bare the pin holes, and it drops back on leaving.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.15],
  tour: [[212, 228], [160, 236], [262, 246], null],
  mount,
});
