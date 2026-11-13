/**
 * Valves: a pipe manifold on a plinth, a flanged header on two saddles with
 * four risers, each capped by a valve bonnet, a threaded stem and a spoked
 * hand-wheel. The pointer is the hand on a wheel: the wheel under it turns on
 * a spring and its stem rises, the neighbours turn a little. At rest the
 * wheels sit at uneven turns and stem heights, valve 2 bright. The slider is
 * how quickly the wheels follow.
 *
 * The pattern: a single row picked by world x on the wheels' rest plane,
 * which never moves; springs on each wheel's angle and lift.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [-48, -16, 16, 48], HZ = 9, WZ = 30, R = 11, FAV = 1;
const REST_A = [0.3, 1.1, -0.4, 0.7], REST_L = [1, 4, 0, 2], FALL = [1, 0.28, 0.1, 0.04];
const at = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

/** A round bar from a to b along x, radius r: the hull of its two end rings. */
function xbar(P, x0, x1, y, z, r, n = 20) {
  const ring = (x) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(x, y + r * Math.cos(t), z + r * Math.sin(t)); });
  return poly(hull(ring(x0).concat(ring(x1))));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-74, -20, -3], [74, 20, -3], [74, -20, -3], [-74, 20, -3], [-60, -12, WZ + 10], [60, 12, WZ + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-74, -20, 74, 20, 5, 2), -3, 0));
  for (const x of [-34, 34]) put(solid(g), prism(P, front, ...rings(x - 4, -6, x + 4, 6, 1.6, 0.8), 0, HZ - 3));
  mk("path", { class: "sil", d: xbar(P, -66, 66, 0, HZ, 4.5) }, g);
  for (const x of [-66, 66]) mk("path", { class: "sil", d: xbar(P, x - 1.2 * Math.sign(x), x + 1.2 * Math.sign(x), 0, HZ, 6.5) }, g);

  const o = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const valves = XS.map((x, i) => {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, at(circ(2.8, 20), x, 0), null, HZ, 18));
    put(solid(grp), prism(P, front, ...rings(x - 6, -6, x + 6, 6, 2.2, 1), 17, 20));
    put(solid(grp), prism(P, front, at(circ(4.2, 24), x, 0), at(circ(3.4, 24), x, 0), 20, 25));
    const stem = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf sil" }, grp);
    const inner = mk("path", { class: "nf lo" }, grp), spokes = mk("path", { class: "nf" }, grp), hub = solid(grp);
    return { i, x, stem, rim, inner, spokes, hub, sa: spring(REST_A[i], o), sl: spring(REST_L[i], o), drawn: "" };
  });

  function draw(v) {
    const a = v.sa.x, l = v.sl.x, key = a.toFixed(4) + "," + l.toFixed(3);
    if (key === v.drawn) return;
    v.drawn = key;
    const z = WZ + l, x = v.x;
    v.stem.setAttribute("d", poly(hull(ringAt(P, at(circ(1.1, 12), x, 0), 25).concat(ringAt(P, at(circ(1.1, 12), x, 0), z + 4)))));
    v.rim.setAttribute("d", poly(hull(ringAt(P, at(circ(R, 48), x, 0), z).concat(ringAt(P, at(circ(R, 48), x, 0), z + 1.8)))));
    v.inner.setAttribute("d", poly(ringAt(P, at(circ(R - 1.8, 48), x, 0), z + 1.8)));
    let d = "";
    for (let k = 0; k < 3; k++) {
      const t = a + (k * Math.PI * 2) / 3, c = Math.cos(t), s = Math.sin(t);
      d += seg(P(x + 2 * c, 2 * s, z + 1.2), P(x + (R - 1.6) * c, (R - 1.6) * s, z + 1.2));
    }
    v.spokes.setAttribute("d", d);
    put(v.hub, prism(P, front, at(circ(2.2, 16), x, 0), null, z, z + 2.4));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const v of valves) { if (stepS(v.sa, dt)) m = true; if (stepS(v.sl, dt)) m = true; draw(v); }
    return m;
  });
  bag.add(B.unregister);

  let over = -1;
  function retarget() {
    for (const v of valves) {
      const f = over < 0 ? 0 : FALL[Math.abs(v.i - over)];
      v.sa.t = REST_A[v.i] + f * Math.PI * 1.6;
      v.sl.t = clamp(REST_L[v.i] + f * 7, 0, 10);
      v.rim.classList.toggle("hi", over < 0 ? v.i === FAV : v.i === over);
    }
    read.textContent = over < 0 ? "rest" : "valve " + (over + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], WZ);
      let k = -1;
      if (Math.abs(y) < 26 && x > -74 && x < 74) {
        let bd = Infinity;
        XS.forEach((xx, i) => { if (Math.abs(x - xx) < bd) { bd = Math.abs(x - xx); k = i; } });
      }
      if (k !== over) { over = k; retarget(); }
    },
    leave: () => { over = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const w of valves) for (const s of [w.sa, w.sl]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "valves",
  means: "A pipe manifold with four hand-wheel valves: the wheel under the pointer turns and its stem rises, neighbours turn a little.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[223, 149], [130, 103], [270, 172], null],
  mount,
});
