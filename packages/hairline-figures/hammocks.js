/**
 * Hammocks: two hammocks slung between three posts on a deck, each hung from
 * a fan of strings at both ends, sagging in the middle. The pointer picks a
 * hammock by where it hangs: it swings toward the reader, and the other
 * swings a little after it. At rest one hammock is swung out, bright. The
 * slider is how far the chosen one swings.
 *
 * The pattern: one of many in a single row (riffle); the pick is the hammock
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SPAN = 64, H = 31, PH = 38, SAG = 15, WID = 8, END = 7, FAV = 0, REST = [6, -5];
const PX = [0, SPAN, 2 * SPAN];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-14, -24, -4], [2 * SPAN + 14, 28, -4], [2 * SPAN + 14, -24, -4], [-14, 28, -4], [0, 0, PH], [2 * SPAN, 0, PH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-14, -24, 2 * SPAN + 14, 28, 5, 2);
  put(solid(g), prism(P, front, dr, di, -4, 0));
  mk("path", { class: "nf lo", d: [-14, -5, 4, 13, 22].map((y) => seg(P(-12, y, 0), P(2 * SPAN + 12, y, 0))).join("") }, g);
  const post = (x) => { const [r, i] = rings(x - 2.6, -2.6, x + 2.6, 2.6, 1.2, 0.6); put(solid(g), prism(P, front, r, i, 0, PH)); };

  const hams = [];
  for (let k = 0; k < 2; k++) {
    post(PX[k]);
    const grp = mk("g", {}, g);
    const strings = mk("path", { class: "nf" }, grp), cloth = mk("path", { class: "sil" }, grp), mid = mk("path", { class: "nf lo" }, grp);
    hams.push({ k, a: PX[k], strings, cloth, mid, th: tween(REST[k]), last: NaN });
  }
  post(PX[2]);

  function pt(h, s, w, th) {
    const p = Math.sin(Math.PI * s), d = SAG * Math.pow(p, 0.8), ww = WID * Math.pow(p, 0.5) * w;
    const c = Math.cos(rad(th)), sn = Math.sin(rad(th));
    return P(h.a + END + s * (SPAN - 2 * END), ww * c + d * sn, H - d * c + ww * sn);
  }
  function draw(h, th) {
    if (th === h.last) return;
    h.last = th;
    const near = [], far = [], ctr = [];
    for (let i = 0; i <= 20; i++) { const s = 0.04 + (i / 20) * 0.92; near.push(pt(h, s, 1, th)); far.push(pt(h, s, -1, th)); ctr.push(pt(h, s, 0, th)); }
    h.cloth.setAttribute("d", poly(near.concat(far.reverse())));
    h.mid.setAttribute("d", open(ctr));
    let d = "";
    for (const [x, s] of [[h.a + 2.4, 0.04], [h.a + SPAN - 2.4, 0.96]]) for (const w of [-1, 0, 1]) d += seg(P(x, 0, H + 1.5), pt(h, s, w, th));
    h.strings.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const h of hams) { draw(h, tval(h.th, now)); if (!tdone(h.th, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  const mids = hams.map((h) => P(h.a + SPAN / 2, 0, H - SAG / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 60 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    hams.forEach((h, k) => {
      const th = a < 0 ? REST[k] : k === a ? swing : swing * 0.3;
      tset(h.th, th, now, from < 0 ? 0 : Math.abs(k - from) * 60);
      h.cloth.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hammock " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "hammocks",
  means: "Two hammocks slung between three posts on a deck: the one under the pointer swings toward you, the other a little.",
  rules: [1, 2, 5, 8],
  range: [25, 40, 55],
  tour: [[162, 130], [243, 170], [190, 140], null],
  mount,
});
