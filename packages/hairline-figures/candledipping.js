/**
 * Candle dipping rack: a hanger bar with five half-made tapers on their
 * wicks, held over a vat of wax. The pointer over the vat lowers the rack
 * and the tapers sink into the wax, cut off at its surface. At rest the
 * rack hangs high, its bar bright. The slider is how deep the rack dips.
 *
 * The pattern: one part lowering into another (open, clipped at a surface).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, ringAt, seg, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid, open,
} = HL;

const Z1 = 30, L = 46, TOP = Z1 + 10 + L, XS = [8, 24, 40, 56, 72], CY = 2;
const disc = (x, y, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-8, -12, 0], [88, 16, 0], [88, -12, 0], [-8, 16, 0], [40, CY, TOP + 26]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the vat: a rounded tank full to the brim, its wax surface the crease
  const [vr, vi] = rings(-8, -12, 88, 16, 8, 2.2);
  put(solid(g), prism(P, front, vr, vi, 0, Z1));

  const rack = mk("g", {}, g);
  const bar = solid(rack), hook = mk("path", { class: "nf" }, rack), wicks = mk("path", { class: "lo nf" }, rack);
  const tapers = XS.map(() => solid(rack));
  bar.sil.classList.add("hi");
  const [br, bi] = rings(-4, CY - 2.5, 84, CY + 2.5, 2.5, 0.8);
  const [hr, hi] = rings(37, CY - 2, 43, CY + 2, 2, 0.6);

  const dz = tween(0);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const top = TOP - d;
    put(bar, prism(P, front, br, bi, top, top + 4));
    // the hanger: a short post and a loop to lift it by
    const loop = [];
    for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI * 2; loop.push(P(40 + 7 * Math.cos(a), CY, top + 19 + 7 * Math.sin(a))); }
    hook.setAttribute("d", seg(P(40, CY, top + 4), P(40, CY, top + 12)) + " " + open(loop));
    let w = "";
    XS.forEach((x, k) => {
      const z1 = top - 6, z0 = Math.max(top - L + (k % 2) * 4, Z1);
      w += seg(P(x, CY, top), P(x, CY, z1)) + " ";
      const ok = z1 > z0 + 0.5;
      if (!ok) put(tapers[k], { sil: "", crease: "" });
      if (ok) put(tapers[k], prism(P, front, disc(x, CY, 4.2), disc(x, CY, 2.6), z0, z1));
    });
    wicks.setAttribute("d", w);
  }
  draw(0);

  const B = register(stage, (_dt, now) => { draw(tval(dz, now)); return !tdone(dz, now); });
  bag.add(B.unregister);

  // static hit box: the rack and vat in their rest pose
  const box = [P(-8, 16, 0), P(88, -12, 0), P(-8, -12, TOP + 26), P(88, 16, TOP + 26)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inBox = ([x, y]) => x > Math.min(...xs) && x < Math.max(...xs) && y > Math.min(...ys) && y < Math.max(...ys);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(dz, v ? depth : 0, performance.now(), 0);
    read.textContent = v ? "dip " + Math.round(depth) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inBox(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { depth = v; if (on) { tset(dz, v, performance.now(), 0); read.textContent = "dip " + Math.round(v); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "candledipping",
  means: "A rack of tapers on wicks over a vat of wax: the pointer lowers the rack and the candles sink into the wax.",
  rules: [1, 4, 5, 6, 8],
  range: [14, 30, 44],
  tour: [[200, 193], [168, 150], [236, 214], null],
  mount,
});
