/**
 * Cement mixer: a site mixer, its bellied drum hung between the arms of a yoke
 * on two wheels, fins spiralling inside its mouth. The drum tilts toward the
 * pointer on a spring, mouth swinging down to pour, and its fins turn while
 * the pointer stays. At rest the drum sits half raised, bright. The slider is
 * how far it may tip.
 *
 * The pattern: a continuous aim (a spring on one angle), the hull of a tilted
 * drum; the hit is a fixed band round the pivot, which never moves.
 */
const { Cam, clamp, fit, hull, open, poly, proj, seg, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const V = [0.612, 0.612, 0.5], PIV = [0, 0, 30], REST = 35;
const PROF = [[-15, 7], [-5, 14], [5, 14.5], [17, 7.5]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const at = (c, ax, u, w, s, r, a) => [0, 1, 2].map((i) => c[i] + ax[i] * s + r * (Math.cos(a) * u[i] + Math.sin(a) * w[i]));
const frame = (th) => { const t = th * Math.PI / 180; return [[Math.sin(t), 0, Math.cos(t)], [Math.cos(t), 0, -Math.sin(t)], [0, 1, 0]]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = clamp(60 * value, 36, 78);
  const C = Cam(45, 0.5, 3.9);
  const ext = [];
  for (const th of [12, 78]) { const [ax, u, w] = frame(th); for (const [s, r] of PROF) for (let i = 0; i < 12; i++) ext.push(at(PIV, ax, u, w, s, r, i * Math.PI / 6)); }
  ext.push([-6, -17, 0], [-6, 17, 0], [-14, 17, 8], [2, 17, 16]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const wheel = (y, near) => {
    const el = solid(g), pts = [];
    for (const dy of [-1.5, 1.5]) for (let i = 0; i < 32; i++) { const a = i * Math.PI / 16; pts.push(P(-6 + 8 * Math.cos(a), y + dy, 8 + 8 * Math.sin(a))); }
    el.sil.setAttribute("d", poly(hull(pts)));
    const rim = [];
    for (let i = 0; i <= 32; i++) { const a = i * Math.PI / 16; rim.push(P(-6 + 5.5 * Math.cos(a), y + (near ? 1.5 : -1.5), 8 + 5.5 * Math.sin(a))); }
    el.cr.setAttribute("d", near ? open(rim) : "");
  };
  const yoke = (y) => mk("path", { class: "nf sil", d: seg(P(0, y, 30), P(-6, y, 8)) + seg(P(0, y, 30), P(14, y * 0.7, 0)) + seg(P(-6, y, 8), P(14, y * 0.7, 0)) }, g);
  wheel(-17, false); yoke(-16);
  const drum = solid(g), mouth = mk("path", { class: "nf lo" }, drum.g), fins = mk("path", { class: "nf lo" }, drum.g);
  yoke(16); wheel(17, true);
  drum.sil.classList.add("hi");

  const sp = spring(REST);
  let phase = 0.4, over = false, drawn = "";
  function draw() {
    const key = sp.x.toFixed(3) + "," + phase.toFixed(3);
    if (key === drawn) return;
    drawn = key;
    const [ax, u, w] = frame(sp.x), pts = [];
    for (const [s, r] of PROF) for (let i = 0; i < 36; i++) pts.push(P(...at(PIV, ax, u, w, s, r, i * Math.PI / 18)));
    drum.sil.setAttribute("d", poly(hull(pts)));
    const lip = [];
    for (let i = 0; i < 36; i++) lip.push(P(...at(PIV, ax, u, w, 17, 6, i * Math.PI / 18)));
    let band = "";
    for (let i = 0; i < 36; i++) {
      const a = i * Math.PI / 18, b = a + Math.PI / 18, n = (q) => [0, 1, 2].map((k) => Math.cos(q) * u[k] + Math.sin(q) * w[k]);
      if (dot3(n(a), V) > 0 && dot3(n(b), V) > 0) band += seg(P(...at(PIV, ax, u, w, 0, 14.3, a)), P(...at(PIV, ax, u, w, 0, 14.3, b)));
    }
    mouth.setAttribute("d", poly(lip) + band);
    let f = "";
    for (let k = 0; k < 3; k++) {
      const a0 = phase + k * Math.PI * 2 / 3;
      for (let j = 0; j < 6; j++) {
        const t0 = j / 6, t1 = (j + 1) / 6, q0 = a0 + t0 * 1.1, q1 = a0 + t1 * 1.1;
        const nn = [0, 1, 2].map((m) => Math.cos(q0) * u[m] + Math.sin(q0) * w[m]);
        if (dot3(nn, ax) * 0 + dot3(nn, V) < 0) continue;
        f += seg(P(...at(PIV, ax, u, w, -2 + t0 * 17, 13.6 - t0 * 6, q0)), P(...at(PIV, ax, u, w, -2 + t1 * 17, 13.6 - t1 * 6, q1)));
      }
    }
    fins.setAttribute("d", f);
  }

  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    if (over) phase += dt * 2.2;
    draw();
    return m || over;
  });
  bag.add(B.unregister);
  const pv = P(...PIV);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      over = Math.hypot(sx - pv[0], sy - pv[1]) < 115;
      sp.t = over ? 15 + (maxT - 15) * clamp((sx - pv[0] + 70) / 140, 0, 1) : REST;
      read.textContent = over ? "tilt " + Math.round(sp.t) + "°" : "rest";
      B.wake();
    },
    leave: () => { over = false; sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return { set: (v) => { maxT = clamp(60 * v, 36, 78); }, destroy: bag.dispose };
}

hairline({
  name: "cementmixer",
  means: "A site cement mixer: its drum tilts toward the pointer to pour, and the fins inside turn while it is there.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.3],
  tour: [[154, 115], [209, 95], [265, 170], null],
  mount,
});
