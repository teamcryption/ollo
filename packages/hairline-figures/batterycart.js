/**
 * Battery swap: a swap station, a plinth with a back wall and three tall
 * battery packs standing in their bays, each with a terminal on top and a
 * charge seam. The pointer picks a bay: that pack slides out toward you on
 * the 700ms ease, its neighbours ease out a little after it, and it is bright.
 * At rest the middle pack stands half drawn, bright. The slider is how far
 * a chosen pack slides.
 *
 * The pattern: a discrete pick by screen x (rest centres), staggered tweens.
 */
const {
  Cam, facing, fit, prism, proj, rings, seg, unproj, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [-24, 0, 24], REST = [3, 13, 0], FAV = 1, OUT = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-42, -24, 0], [42, -24, 44], [42, 18 + OUT * 1.4, 0], [-42, 18 + OUT * 1.4, 36], [-42, -24, 44]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [w0, w1] = rings(-40, -24, 40, -18, 2.5, 1);
  put(solid(g), prism(P, front, w0, w1, 0, 44));
  const [b0, b1] = rings(-40, -18, 40, 18, 4, 1.6);
  put(solid(g), prism(P, front, b0, b1, 0, 4));
  const packs = XS.map((cx, i) => {
    const grp = mk("g", {}, g);
    return { i, cx, s: solid(grp), cap: solid(grp), seam: mk("path", { class: "nf lo" }, grp), tw: tween(REST[i]), drawn: NaN };
  });

  function draw(p, now) {
    const y = tval(p.tw, now);
    if (Math.abs(y - p.drawn) < 1e-3) return;
    p.drawn = y;
    const [r0, r1] = rings(p.cx - 9, y - 12, p.cx + 9, y + 12, 3, 1.2);
    put(p.s, prism(P, front, r0, r1, 4, 36));
    const [t0, t1] = rings(p.cx - 3, y - 5, p.cx + 3, y + 5, 1.5, 0.6);
    put(p.cap, prism(P, front, t0, t1, 36, 38.5));
    p.seam.setAttribute("d", seg(P(p.cx + 9, y + 12, 12), P(p.cx - 9, y + 12, 12)) + seg(P(p.cx + 9, y + 12, 12), P(p.cx + 9, y - 12, 12)));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const p of packs) { draw(p, now); if (!tdone(p.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let pick = null;
  function retarget() {
    const now = performance.now();
    for (const p of packs) {
      const d = pick ? Math.abs(p.i - pick.i) : 0;
      const to = pick ? [OUT * value, 7, 2][d] : REST[p.i];
      tset(p.tw, to, now, pick ? d * 45 : 0);
      p.s.sil.classList.toggle("hi", pick ? p === pick : p.i === FAV);
    }
    read.textContent = pick ? "bay " + (pick.i + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      let near = null, bd = Infinity;
      for (const p of packs) { const d = Math.abs(P(p.cx, 0, 20)[0] - q[0]); if (d < bd) { bd = d; near = p; } }
      const [x, y] = unproj(C, q[0], q[1], 20);
      const nxt = Math.abs(x) > 60 || Math.abs(y) > 70 ? null : near;
      if (nxt !== pick) { pick = nxt; retarget(); }
    },
    leave: () => { pick = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { value = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "batterycart",
  means: "A battery swap station: the pack under the pointer slides out of its bay toward you, neighbours easing after it.",
  rules: [1, 2, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[187, 127], [289, 178], [238, 152], null],
  mount,
});
