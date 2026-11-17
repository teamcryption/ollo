/**
 * Jack stand: a tapered four-footed base, a toothed column through its top
 * and a cradle saddle on the column, with a ratchet lever on the side. The
 * pointer racks the column up, more notches the nearer it is, and the lever
 * swings up to let it pass. At rest the column sits low, its lever bright.
 */
const { Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, clamp, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const B0 = 28, BT = 32, LIFT = 28, CH = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-B0, -B0, 0], [B0, B0, 0], [B0, -B0, 0], [-B0, B0, 0], [0, 0, BT + CH + LIFT + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const foot = rrect(-B0, -B0, B0, B0, 5, 6), top = rrect(-8, -8, 8, 8, 3, 6), inner = rrect(-6.8, -6.8, 6.8, 6.8, 2, 6);
  const base = solid(g);
  base.sil.setAttribute("d", poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, BT)))));
  base.cr.setAttribute("d", open(ringAt(P, run(inner, front), BT)));
  const col = solid(g), teeth = mk("path", { class: "lo nf" }, g), saddle = solid(g), cradle = mk("path", { class: "lo nf" }, g);
  const lever = mk("path", { class: "sil nf" }, g);
  const [cr, ci] = rings(-4, -4, 4, 4, 1.2, 0.6), [sr, si] = rings(-11, -5, 11, 5, 2.5, 1.2);
  const amt = spring(0.12, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = null;

  function draw() {
    if (Math.abs(amt.x - drawn) < 1e-4) return;
    drawn = amt.x;
    const zt = BT + 4 + CH * 0.5 + LIFT * amt.x;
    put(col, prism(P, front, cr, ci, BT - 1, zt));
    let t = "";
    for (let z = BT + 3; z < zt - 2; z += 4) t += seg(P(4, -3, z), P(4, 3, z - 1.2));
    teeth.setAttribute("d", t);
    put(saddle, prism(P, front, sr, si, zt, zt + 5));
    cradle.setAttribute("d", open([P(-11, 0, zt + 5), P(-4, 0, zt + 2.5), P(4, 0, zt + 2.5), P(11, 0, zt + 5)]));
    const a = 0.25 + amt.x * 0.9;
    lever.setAttribute("d", seg(P(0, 8, BT - 2), P(0, 8 + 22 * Math.cos(a), BT - 2 + 22 * Math.sin(a))));
  }

  const L = register(stage, (dt) => { const m = stepS(amt, dt); draw(); return m; });
  bag.add(L.unregister);

  function retarget() {
    amt.t = over ? clamp(Math.round((1.2 - over / 70) * 6) / 6, 0.34, 1) : 0.12;
    saddle.sil.classList.toggle("hi", !!over);
    col.sil.classList.toggle("hi", !!over);
    lever.classList.toggle("hi", !over);
    read.textContent = over ? "notch " + Math.round(amt.t * 6) : "rest";
    L.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > B0 + 40 ? null : Math.max(r, 1);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { amt.k = 100 * v; amt.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "jackstand",
  means: "A jack stand: the pointer racks its toothed column up notch by notch, and the ratchet lever swings up to let it pass.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 190], [200, 300], [200, 197], null],
  mount,
});
