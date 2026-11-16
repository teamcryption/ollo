/**
 * Marble tray: a round solitaire board with thirty-two marbles in a cross of
 * holes, the centre hole empty. The board tilts down toward the pointer and
 * the marbles slide a little in their holes; the marble nearest the pointer
 * goes bright. At rest the marble that would jump first is bright.
 */
const { Cam, fit, proj, unproj, hull, poly, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;
const R = 64, T = 7, G = 14, MR = 5.4, S = 2.05;
const holes = [];
for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (Math.abs(i) <= 1 || Math.abs(j) <= 1) holes.push([i, j]);
holes.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
const ring = (cx, cy, r, z, n = 40) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return o; };
const FAV = holes.findIndex((h) => h[0] === 2 && h[1] === 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = rad(value);
  const C = Cam(45, 0.5, S);
  fit(C, [[-R, -R, -12], [R, R, -12], [R, -R, 22], [-R, R, 22], [0, 0, 26]], 200, 160);
  const P = proj(C);
  const ax = spring(0), ay = spring(0);
  const tf = ([x, y, z]) => { z -= T; let c = Math.cos(ax.x), s = Math.sin(ax.x); [y, z] = [y * c - z * s, y * s + z * c]; c = Math.cos(ay.x); s = Math.sin(ay.x); [x, z] = [x * c + z * s, -x * s + z * c]; return P(x, y, z + T); };
  const g = mk("g", {}, svg);
  const base = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g);
  const hs = holes.map(() => mk("path", { class: "nf lo" }, g));
  const ms = holes.map(([i, j]) => (i === 0 && j === 0 ? null : mk("ellipse", { rx: MR * S, ry: MR * S }, g)));
  function draw() {
    base.setAttribute("d", poly(hull(ring(0, 0, R, 0).concat(ring(0, 0, R, T)).map(tf))));
    top.setAttribute("d", poly(ring(0, 0, R - 4, T).map(tf)));
    const dx = clamp(ay.x / 0.25, -1, 1) * 1.6, dy = clamp(-ax.x / 0.25, -1, 1) * 1.6;
    holes.forEach(([i, j], k) => {
      hs[k].setAttribute("d", poly(ring(i * G, j * G, 3.6, T, 16).map(tf)));
      if (!ms[k]) return;
      const [sx, sy] = tf([i * G + dx, j * G + dy, T + MR * 0.55]);
      ms[k].setAttribute("cx", sx.toFixed(2)); ms[k].setAttribute("cy", sy.toFixed(2));
    });
  }
  const B = register(stage, (dt) => { const a = stepS(ax, dt), b = stepS(ay, dt); draw(); return a || b; });
  bag.add(B.unregister);
  let act = -2;
  function aim(px, py, k) {
    const d = Math.hypot(px, py) || 1, f = clamp(d / R, 0, 1);
    ax.t = (-py / d) * max * f; ay.t = (px / d) * max * f;
    if (k !== act) {
      act = k;
      ms.forEach((m, q) => m && m.classList.toggle("hi", q === (k < 0 ? FAV : k)));
      const h = holes[k < 0 ? FAV : k];
      read.textContent = k < 0 ? "rest" : "abcdefg"[h[0] + 3] + (h[1] + 4);
    }
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, T);
    if (Math.hypot(x, y) > R + 8) return aim(2 * G, 0, -1);
    let best = -1, bd = Infinity;
    holes.forEach(([i, j], k) => { if (!ms[k]) return; const dd = Math.hypot(i * G - x, j * G - y); if (dd < bd) { bd = dd; best = k; } });
    aim(x, y, best);
  }
  aim(2 * G * 0.5, 0, -1);
  bag.add(pointer(stage, { move, leave: () => aim(2 * G * 0.5, 0, -1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = rad(v); }, destroy: bag.dispose };
}

hairline({
  name: "boulecase",
  means: "A round marble solitaire board: it tilts down toward the pointer and the nearest marble goes bright.",
  rules: [1, 3, 4, 5],
  range: [4, 10, 16],
  tour: [[150, 120], [250, 200], [200, 150], null],
  mount,
});
