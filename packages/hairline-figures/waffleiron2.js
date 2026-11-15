/**
 * Panini press: a ridged base plate with a sandwich on it and a heavy lid
 * hinged along the back edge. The pointer lifts the lid: the higher it is on
 * the stage, the wider the lid swings open on a spring, showing the ridges
 * under it. At rest the lid sits ajar over the sandwich, bright.
 */
const {
  Cam, facing, fit, prism, proj, rrect, rings, hull, poly, open, seg, spring, stepS, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 38, D = 28, HB = 14, T = 9, REST = 14, MAX = 108;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.4);
  const L = (u, v, w, th) => [u, -D + v * Math.cos(th) - w * Math.sin(th), HB + v * Math.sin(th) + w * Math.cos(th)];
  const ext = [[-W - 2, -D - 12, 0], [W + 2, D + 4, 0], [-W, D, 0], [W, -D - 12, 0]];
  [REST, 60, MAX].forEach((d) => [[-W, 62, T], [W, 62, T], [W, 0, T], [-W, 62, 0]].forEach(([u, v, w]) => ext.push(L(u, v, w, rad(d)))));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // base and its ridges, then the sandwich
  const BR = rings(-W, -D, W, D, 6, 1.6);
  put(solid(g), prism(P, front, BR[0], BR[1], 0, HB));
  let rid = "";
  for (let i = 0; i < 7; i++) { const y = -D + 6 + i * 7.3; rid += seg(P(-W + 6, y, HB), P(W - 6, y, HB)); }
  mk("path", { class: "nf lo", d: rid }, g);
  const SR = rings(-24, -16, 22, 18, 5, 1.2);
  put(solid(g), prism(P, front, SR[0], SR[1], HB, HB + 4.5));
  // the lid
  const lid = solid(g), under = mk("path", { class: "nf lo", d: "" }, g);
  lid.sil.classList.add("hi");
  const LR = rrect(-W, 0, W, 62, 6, 6), LI = rrect(-W + 1.8, 1.8, W - 1.8, 60.2, 4.2, 6);
  const sp = spring(rad(REST), { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const th = sp.x;
    if (Math.abs(th - drawn) < 1e-4) return;
    drawn = th;
    const bot = LR.map((q) => P(...L(q.u, q.v, 0, th))), top = LR.map((q) => P(...L(q.u, q.v, T, th)));
    lid.sil.setAttribute("d", poly(hull(bot.concat(top))));
    const showTop = 0.5 * Math.cos(th) - 0.61 * Math.sin(th) > 0;
    if (showTop) {
      lid.cr.setAttribute("d", poly(LI.map((q) => P(...L(q.u, q.v, T, th)))));
      under.setAttribute("d", "");
      lid.g.after(under);
    } else {
      lid.cr.setAttribute("d", poly(LI.map((q) => P(...L(q.u, q.v, 0, th)))));
      let d = "";
      for (let i = 0; i < 7; i++) { const v = 8 + i * 7.6; d += seg(P(...L(-W + 6, v, 0, th)), P(...L(W - 6, v, 0, th))); }
      under.setAttribute("d", d);
      lid.g.after(under);
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const t = clamp((250 - p[1]) / 170, 0, 1), deg = REST + t * (MAX - REST);
      sp.t = rad(deg);
      read.textContent = "open " + Math.round(deg) + "°";
      B.wake();
    },
    leave: () => { sp.t = rad(REST); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "waffleiron2",
  means: "A panini press: the lid swings open on its back hinge as the pointer rises, showing the ridged plates and the sandwich.",
  rules: [3, 5, 6, 8],
  range: [0.5, 1, 1.6],
  tour: [[248, 48], [180, 219], [200, 306], null],
  mount,
});
