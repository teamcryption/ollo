/**
 * Steel drum: a steel pan, a deep skirted bowl with hammered note fields,
 * hung on a tripod stand with two mallets resting across its face. The pan
 * swings on its stand to tip the note under the pointer toward the player,
 * and that note is bright. At rest the pan leans a little forward with the
 * centre note bright. The slider is how far the pan can swing.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, seg, unproj, spring, stepS, disposer, mk, pointer, register } = HL;

const R = 50, Z0 = 62, D = 22, MAX = 0.42, REST = [0.1, 0.14];
const NOTES = [[0, 0, 9]].concat(Array.from({ length: 6 }, (_, i) => { const t = (i / 6) * Math.PI * 2 + 0.4; return [Math.cos(t) * 30, Math.sin(t) * 30, 8]; }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-R - 8, -R - 8, 0], [R + 8, R + 8, 0], [-R, R, Z0 + 20], [R, -R, Z0 + 20], [0, 0, Z0 + 24]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const legs = mk("path", { class: "nf sil" }, g);
  let ld = seg(P(0, 0, Z0 - D - 2), P(0, 0, Z0 - D - 16));
  for (let k = 0; k < 3; k++) { const a = 0.9 + k * 2.094; ld += seg(P(Math.cos(a) * 46, Math.sin(a) * 46, 0), P(0, 0, Z0 - D - 16)); }
  legs.setAttribute("d", ld);
  const body = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf" }, g), bowl = mk("path", { class: "nf lo" }, g);
  const notes = NOTES.map(() => mk("path", { class: "nf lo" }, g));
  const sticks = mk("path", { class: "nf sil" }, g), tips = [mk("path", {}, g), mk("path", {}, g)];
  const tx = spring(REST[0]), ty = spring(REST[1]);
  let lim = MAX * value, last = "", pick = 0;
  function draw() {
    const key = tx.x.toFixed(3) + ty.x.toFixed(3);
    if (key === last) return;
    last = key;
    const a = tx.x, b = ty.x;
    const T = (x, y, z) => {
      const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a);
      const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
      return P(x1, y2, Z0 + z2);
    };
    const ring = (r, z, cx = 0, cy = 0, n = 48) => circ(r, n).map((q) => T(cx + q.u, cy + q.v, z));
    body.setAttribute("d", poly(hull(ring(R, 0).concat(ring(R, -D), ring(R - 4, -D - 3)))));
    top.setAttribute("d", poly(ring(R, 0)));
    bowl.setAttribute("d", poly(ring(R - 3, -0.5)));
    NOTES.forEach(([x, y, r], i) => notes[i].setAttribute("d", poly(ring(r, -3, x, y, 24).map((p, j) => p))));
    const S = [[[-34, 8, 1], [20, 40, 1]], [[-30, 22, 1], [34, 30, 1]]];
    sticks.setAttribute("d", S.map(([p, q]) => seg(T(...p), T(...q))).join(""));
    S.forEach(([p], i) => tips[i].setAttribute("d", poly(ring(4, 3, p[0], p[1], 20))));
  }
  const B = register(stage, (dt) => { const m1 = stepS(tx, dt), m2 = stepS(ty, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);
  function aim(t, k) {
    tx.t = t[0]; ty.t = t[1];
    pick = k;
    notes.forEach((n, i) => { n.classList.toggle("hi", i === k); n.classList.toggle("lo", i !== k); });
    read.textContent = t === REST ? "rest" : "note " + (k + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], Z0), r = Math.hypot(x, y);
      if (r > R + 30) return aim(REST, 0);
      let k = 0, bd = Infinity;
      NOTES.forEach(([nx, ny], i) => { const d = Math.hypot(x - nx, y - ny); if (d < bd) { bd = d; k = i; } });
      if (r < 6) return aim([REST[0], REST[1] + 0.001], 0);
      const m = clamp(r / R, 0, 1) * lim;
      aim([-(x / r) * m, (y / r) * m], k);
    },
    leave: () => aim(REST, 0),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(REST, 0);
  return { set: (v) => { lim = MAX * v; }, destroy: bag.dispose };
}

hairline({
  name: "steeldrum",
  means: "A steel pan on its stand: the pan swings to tip the note under the pointer up, and that note is bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[228, 122], [140, 70], [262, 128], null],
  mount,
});
