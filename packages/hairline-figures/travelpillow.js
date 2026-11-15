/**
 * Seat recline: a row of three airplane seats on one rail, each a cushion on a
 * pedestal with a tall backrest and headrest hinged at its rear edge. The
 * pointer picks a seat by its rest centre: that seat tips its back all the way
 * down and goes bright, its neighbours straighten up for it, nearest first.
 * At rest the backs sit at uneven angles, the middle one bright. The slider is
 * how far the chosen back reclines.
 */
const {
  Cam, facing, fit, prism, proj, rings, unproj, hull, fillet, poly, open, seg,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid, clamp,
} = HL;

const XS = [-27, 0, 27], HW = 11, Z0 = 15, PY = -10, BH = 34, TH = 4.5;
const REST = [14, 6, 24], FAV = 1;
const deg = Math.PI / 180;

function backPts(cx, a, h0, h1, w) {
  const out = [], s = Math.sin(a), c = Math.cos(a);
  for (const u of [cx - w, cx + w]) for (const t of [0, TH]) for (const h of [h0, h1]) {
    out.push([u, PY - t * c - h * s, Z0 - t * s + h * c]);
  }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  const ext = [];
  for (const x of XS) ext.push(...backPts(x, 46 * deg, 0, BH + 8, HW), [x - HW, 12, 0], [x + HW, 12, 0]);
  fit(C, ext, 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rail the row stands on
  put(solid(g), prism(P, front, ...rings(-42, -6, 42, 2, 2, 0.8), 0, 2));
  const seats = XS.map((cx, k) => {
    const grp = mk("g", {}, g);
    const back = solid(grp), head = solid(grp);
    put(solid(grp), prism(P, front, ...rings(cx - 3, -5, cx + 3, 1, 1.5, 0.6), 2, Z0 - 3));
    put(solid(grp), prism(P, front, ...rings(cx - HW, PY, cx + HW, 10, 4, 1.4), Z0 - 3, Z0));
    const arm = mk("path", { class: "nf lo" }, grp);
    arm.setAttribute("d", seg(P(cx + HW, PY, Z0 + 6), P(cx + HW, 6, Z0 + 6)) + seg(P(cx + HW, 6, Z0 + 6), P(cx + HW, 6, Z0)));
    return { k, cx, back, head, tw: tween(REST[k] * deg), drawn: NaN };
  });

  function plate(sol, pts) {
    const sp = pts.map((q) => P(...q)), h = hull(sp);
    sol.sil.setAttribute("d", poly(fillet(h, h.map(() => 2.5))));
    sol.cr.setAttribute("d", open([sp[1], sp[3], sp[7], sp[5]].map((q, i) => q)));
  }

  function draw(s, now) {
    const a = tval(s.tw, now);
    if (Math.abs(a - s.drawn) < 1e-4) return;
    s.drawn = a;
    plate(s.back, backPts(s.cx, a, 0, BH, HW));
    plate(s.head, backPts(s.cx, a, BH + 1, BH + 8, HW - 3));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const s of seats) { draw(s, now); if (!tdone(s.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let amt = value, cur = undefined;
  function choose(i) {
    if (i === cur) return;
    cur = i;
    const now = performance.now();
    for (const s of seats) {
      const t = i == null ? REST[s.k] : s.k === i ? 18 + 28 * amt : 2;
      tset(s.tw, t * deg, now, i == null ? 0 : Math.abs(s.k - i) * 45);
      const on = i == null ? s.k === FAV : s.k === i;
      s.back.sil.classList.toggle("hi", on);
      s.head.sil.classList.toggle("hi", on);
    }
    read.textContent = i == null ? "rest" : "seat " + (i + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], Z0);
      if (Math.abs(x) > 48 || y < -48 || y > 22) return choose(null);
      let bi = 0, bd = Infinity;
      for (const s of seats) { const d = Math.abs(P(s.cx, 0, Z0)[0] - p[0]); if (d < bd) { bd = d; bi = s.k; } }
      choose(bi);
    },
    leave: () => choose(null),
  }));
  bag.add(() => svg.replaceChildren());
  choose(null);
  return {
    set: (v) => { amt = v; const i = cur; cur = undefined; choose(i); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "travelpillow",
  means: "Three airplane seats in a row: the one under the pointer reclines its back and goes bright, the others straighten up.",
  rules: [1, 2, 5, 8],
  range: [0.3, 1, 1],
  tour: [[123, 176], [172, 200], [220, 225], null],
  mount,
});
