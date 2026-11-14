/**
 * Calculator: a desk calculator, a rounded slab with a recessed display and
 * nineteen keys, a wide zero and a tall equals among them. The pointer picks
 * a key on the plane of the resting key tops: it presses down, and the keys
 * around it give a little, staggered from it. At rest one key sits half
 * pressed and the equals key is bright. The slider is the stagger.
 *
 * The pattern: a grid on a face plane (depositboxes); keys only go down, so
 * one fixed plane through their resting tops is the hit.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, ringAt, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 64, BY = 96, BZ = 7, KH = 5.5, CW = 13.5, RH = 12.5, KX0 = 5.5, KY0 = 33;
const LABELS = [["C", "±", "%", "÷"], ["7", "8", "9", "×"], ["4", "5", "6", "−"], ["1", "2", "3", "+"]];
const FAV_LABEL = "=", HALF = "5";

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, BZ + KH], [0, BY, 0], [0, 0, BZ + KH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the slab, with its recessed display along the far end
  const body = solid(g);
  const [ring, inner] = rings(0, 0, BX, BY, 9, 1.8);
  put(body, prism(P, front, ring, inner, 0, BZ));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(6, 7, BX - 6, 26, 2.5, 4), BZ)) }, body.g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(8, 9, BX - 8, 24, 1.5, 4), BZ)) }, body.g);

  // the keys: four rows of four, then a wide zero, a point, and a tall equals in the last column
  const keys = [];
  LABELS.forEach((row, r) => row.forEach((l, c) => { if (!(r === 3 && c === 3)) keys.push({ c0: c, c1: c, r0: r, r1: r, l }); }));
  keys.push({ c0: 0, c1: 1, r0: 4, r1: 4, l: "0" }, { c0: 2, c1: 2, r0: 4, r1: 4, l: "." }, { c0: 3, c1: 3, r0: 3, r1: 4, l: "=" });
  keys.forEach((k) => {
    k.x0 = KX0 + k.c0 * CW; k.x1 = KX0 + k.c1 * CW + CW - 2.5;
    k.y0 = KY0 + k.r0 * RH; k.y1 = KY0 + k.r1 * RH + RH - 2.5;
    k.cx = (k.x0 + k.x1) / 2; k.cy = (k.y0 + k.y1) / 2;
    k.rest = k.l === HALF ? KH * 0.4 : KH;
  });
  keys.sort((a, b) => a.cx + a.cy - (b.cx + b.cy));
  keys.forEach((k) => {
    k.s = solid(g);
    k.rr = rings(k.x0, k.y0, k.x1, k.y1, 2.2, 0.8);
    k.h = tween(k.rest);
    k.last = NaN;
  });
  const fav = keys.findIndex((k) => k.l === FAV_LABEL);

  function draw(k, h) {
    if (h === k.last) return;
    k.last = h;
    put(k.s, prism(P, front, k.rr[0], k.rr[1], BZ, BZ + Math.max(0.5, h)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    keys.forEach((k) => { draw(k, tval(k.h, now)); if (!tdone(k.h, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the plane of the resting key tops, the key it lands in or nearest
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ + KH);
    if (x < 1 || x > BX - 1 || y < KY0 - 3 || y > BY - 1) return -1;
    let best = -1, bd = 1e9;
    keys.forEach((k, i) => {
      const dx = Math.max(0, Math.abs(x - k.cx) - (k.x1 - k.x0) / 2), dy = Math.max(0, Math.abs(y - k.cy) - (k.y1 - k.y0) / 2);
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const A = a >= 0 ? keys[a] : null;
    keys.forEach((k, i) => {
      let h = k.rest;
      if (A) {
        const d = Math.hypot((k.cx - A.cx) / CW, (k.cy - A.cy) / RH);
        h = i === a ? 0.6 : KH - clamp(3.2 - d * 1.1, 0, 2.6);
      }
      const F = from >= 0 ? keys[from] : null;
      const dl = F ? Math.round(Math.hypot((k.cx - F.cx) / CW, (k.cy - F.cy) / RH)) * stag : 0;
      tset(k.h, h, now, dl);
      k.s.sil.classList.toggle("hi", i === (a < 0 ? fav : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + keys[a].l;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "calculator",
  means: "A desk calculator: the key under the pointer presses down and the keys around it give a little after it.",
  rules: [1, 2, 4, 5],
  range: [0, 40, 80],
  tour: [[180, 166], [283, 166], [130, 190], null],
  mount,
});
