/**
 * Gas meter: a squat meter box with two pipes rising from its back and a row
 * of four round index dials set into its top. The pointer picks a dial by
 * where it stands on the top: that dial's needle swings to point at the
 * pointer, and its neighbours turn part of the way, less with distance. At
 * rest the needles sit at uneven readings, one dial bright. The slider is how
 * far the neighbours follow.
 *
 * The pattern: one of many in a single row, aimed by a spring.
 */
const {
  Cam, circ, fit, facing, fillet, poly, prism, proj, rings, ringAt, unproj, clamp, lerp,
  disposer, mk, pointer, put, register, solid, spring, stepS, seg, tween, tset, tval, tdone, flatDot, place,
} = HL;

const W = 122, D = 60, H = 50, R = 12, DY = 40, FAV = 1, LIFT = 10;
const DX = [19, 47, 75, 103], REST = [0.7, 2.5, -1.3, 1.6];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let follow = value / 100;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + 26], [W, 0, H + 26], [0, D, H + LIFT + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the index window on the front face
  const win = [[34, 16], [88, 16], [88, 34], [34, 34]].map(([x, z]) => P(x, D, z));
  mk("path", { d: poly(fillet(win, [3, 3, 3, 3])), class: "lo" }, g);
  // the inlet and outlet pipes, with a union nut each
  for (const x of [14, W - 14]) {
    put(solid(g), prism(P, front, disc(x, 12, 6, 24), disc(x, 12, 4.6, 24), H, H + 22));
    put(solid(g), prism(P, front, disc(x, 12, 8, 24), disc(x, 12, 6.4, 24), H + 8, H + 13));
  }

  const dials = DX.map((x, k) => {
    const grp = mk("g", {}, g), s = solid(grp);
    const ticks = mk("path", { class: "nf lo" }, grp), needle = mk("path", { class: "nf" }, grp);
    const hub = flatDot(grp, C, 1.8, "dot m");
    return { k, x, s, ticks, needle, hub, a: spring(REST[k]), z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN, lz: NaN };
  });

  function draw(d, lz) {
    const a = d.a.x, x = d.x;
    if (a === d.last && lz === d.lz) return;
    if (lz !== d.lz) {
      d.lz = lz;
      put(d.s, prism(P, front, disc(x, DY, R), disc(x, DY, R - 1.8), H, H + 1.4 + lz));
      let t = "";
      for (let i = 0; i < 10; i++) {
        const q = (i / 10) * Math.PI * 2, c = Math.cos(q), sn = Math.sin(q);
        t += seg(P(x + c * 8, DY + sn * 8, H + 1.4 + lz), P(x + c * 9.6, DY + sn * 9.6, H + 1.4 + lz));
      }
      d.ticks.setAttribute("d", t);
      place(d.hub, P(x, DY, H + 1.4 + lz));
    }
    d.last = a;
    const c = Math.cos(a), sn = Math.sin(a), z = H + 1.6 + lz;
    d.needle.setAttribute("d", seg(P(x - c * 3, DY - sn * 3, z), P(x + c * 9, DY + sn * 9, z)));
  }

  const B = register(stage, (dt, now) => {
    let moving = false;
    for (const d of dials) { if (stepS(d.a, dt)) moving = true; if (!tdone(d.z, now)) moving = true; draw(d, tval(d.z, now)); }
    return moving;
  });
  bag.add(B.unregister);
  dials.forEach((d) => draw(d, tval(d.z, performance.now())));

  const near = (from, to) => { let t = to; while (t - from > Math.PI) t -= Math.PI * 2; while (t - from < -Math.PI) t += Math.PI * 2; return t; };
  let act = -2;
  function aim(p) {
    let a = -1, w = null;
    if (p) {
      w = unproj(C, p[0], p[1], H);
      if (w[1] > -4 && w[1] < D + 10 && w[0] > -6 && w[0] < W + 6) {
        let bd = Infinity;
        DX.forEach((x, k) => { const dd = Math.abs(x - w[0]); if (dd < bd) { bd = dd; a = k; } });
      }
    }
    dials.forEach((d, k) => {
      const rest = REST[k];
      if (a < 0) { d.a.t = near(d.a.x, rest); return; }
      const dist = Math.abs(k - a), f = dist === 0 ? 1 : clamp(follow * Math.pow(0.5, dist - 1), 0, 1);
      const toward = near(rest, Math.atan2(w[1] - DY, w[0] - d.x));
      d.a.t = near(d.a.x, lerp(rest, toward, f));
    });
    if (a !== act) {
      const now = performance.now(), from = a >= 0 ? a : act;
      act = a;
      dials.forEach((d, k) => {
        const on = k === (a < 0 ? FAV : a);
        tset(d.z, a < 0 ? (on ? LIFT * 0.6 : 0) : on ? LIFT : 0, now, from < 0 ? 0 : Math.abs(k - from) * 40);
        d.s.sil.classList.toggle("hi", on);
      });
    }
    if (a < 0) read.textContent = "rest";
    else {
      const t = dials[a].a.t, frac = ((t % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      read.textContent = "dial " + (a + 1) + "·" + (Math.round((frac / (Math.PI * 2)) * 10) % 10);
    }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { follow = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "gasmeter",
  means: "A gas meter with four index dials on top: the dial under the pointer rises and swings its needle at it; neighbours follow part way.",
  rules: [1, 3, 5, 8],
  range: [0, 50, 100],
  tour: [[130, 125], [168, 144], [243, 182], null],
  mount,
});
