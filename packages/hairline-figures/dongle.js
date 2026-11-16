/**
 * USB stick: a flat drive body with its plug, under a metal swivel cover pinned at the back end. The pointer over it swings the cover round on its pin to bare the plug; at rest the cover sits a little askew and the plug is bright. The slider is how far it swings.
 */
const SP = {"mode":"open","readOn":"open","joints":[{"ax":"z","p":[6,11,0],"rest":18}],"fitA":[[18],[50],[80],[100],[120]],"parts":[{"b":[0,0,0,62,22,7],"j":-1,"d":[{"r":[10,6,40,16]}]},{"b":[62,5,1.5,80,17,5.5],"j":-1,"d":[{"r":[66,8,74,10],"hi":true},{"r":[66,12,74,14],"hi":true}]},{"b":[-3,-2,7.5,72,24,10],"j":0,"ans":true,"d":[{"c":[6,11,2.6]},{"r":[24,5,56,19]}]}],"bw":396,"bh":306};
const { Cam, clamp, fit, hull, lerp, poly, proj, rad, tween, tset, tval, tdone, spring, stepS, unproj, mk, solid, flatDot, place, pointer, register, disposer } = HL;

/** Turns q about the joint's axis (through its pivot when piv). */
function rot(j, a, q, piv) {
  const c = Math.cos(a), s = Math.sin(a), [px, py, pz] = piv ? j.p : [0, 0, 0];
  const dx = q[0] - px, dy = q[1] - py, dz = q[2] - pz;
  if (j.ax === "z") return [px + dx * c - dy * s, py + dx * s + dy * c, q[2]];
  if (j.ax === "x") return [q[0], py + dy * c + dz * s, pz - dy * s + dz * c];
  return [px + dx * c - dz * s, q[1], pz + dx * s + dz * c];
}
// the six faces of a box: outward normal, then four corners as [i, j, k] of x, y, z
const FACES = [[[0, 0, 1], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], [[0, 0, -1], [0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]],
  [[1, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], [[-1, 0, 0], [0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]],
  [[0, 1, 0], [0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], [[0, -1, 0], [0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const W = (pt, part, a) => (part.j >= 0 ? rot(SP.joints[part.j], a[part.j], pt, true) : pt);
  const corners = (b) => { const r = []; for (const i of [0, 1]) for (const j of [0, 1]) for (const k of [0, 1]) r.push([b[i ? 3 : 0], b[j ? 4 : 1], b[k ? 5 : 2]]); return r; };
  // fit the camera to every pose the figure can take, then scale it to the frame
  const ext = [];
  for (const A of SP.fitA) {
    for (const part of SP.parts) for (const q of corners(part.b)) ext.push(W(q, part, A.map(rad)));
    if (SP.laser) ext.push(rot(SP.joints[0], rad(A[0]), SP.laser, true));
  }
  let C = Cam(45, 0.5, 1); fit(C, ext, 200, 160);
  const P0 = proj(C), xs = ext.map((q) => P0(...q));
  const w = Math.max(...xs.map((p) => p[0])) - Math.min(...xs.map((p) => p[0])), h = Math.max(...xs.map((p) => p[1])) - Math.min(...xs.map((p) => p[1]));
  C = Cam(45, 0.5, Math.min(SP.bw / w, SP.bh / h)); fit(C, ext, 200, 160);
  const P = proj(C), o = P(0, 0, 0), up = unproj(C, o[0], o[1], 1), T = [up[0], up[1], 1];
  const g = mk("g", {}, svg);
  const els = SP.parts.map((part) => {
    const s = solid(g);
    const ds = (part.d || []).map(() => mk("path", { class: "nf lo" }, s.g));
    return { part, s, ds };
  });
  const dot = SP.laser ? flatDot(g, C, 2.2, "dot m") : null;
  // the hit area: the hull of the rest pose, which never moves
  const restA = SP.joints.map((j) => rad(j.rest)), restPts = [];
  for (const part of SP.parts) for (const q of corners(part.b)) restPts.push(P(...W(q, part, restA)));
  const H = hull(restPts);
  const inside = (p) => {
    let s0 = 0;
    for (let i = 0; i < H.length; i++) {
      const a = H[i], b = H[(i + 1) % H.length], c = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
      if (c !== 0) { if (s0 && Math.sign(c) !== s0) return false; s0 = Math.sign(c); }
    }
    return true;
  };

  function draw(A) {
    const a = A.map(rad);
    for (const e of els) {
      const pt = e.part, b = pt.b, cs = corners(b).map((q) => P(...W(q, pt, a)));
      let cr = "", topVis = false;
      for (const f of FACES) {
        const n = pt.j >= 0 ? rot(SP.joints[pt.j], a[pt.j], f[0], false) : f[0];
        if (n[0] * T[0] + n[1] * T[1] + n[2] * T[2] <= 1e-6) continue;
        if (f[0][2] === 1) topVis = true;
        cr += poly(f.slice(1).map(([i, j, k]) => cs[i * 4 + j * 2 + k]));
      }
      e.s.sil.setAttribute("d", poly(hull(cs)));
      e.s.cr.setAttribute("d", cr);
      e.ds.forEach((el, i) => {
        const d = pt.d[i];
        let loc;
        if (d.c) { loc = []; for (let t = 0; t < 20; t++) loc.push([d.c[0] + d.c[2] * Math.cos(t * Math.PI / 10), d.c[1] + d.c[2] * Math.sin(t * Math.PI / 10)]); }
        else loc = [[d.r[0], d.r[1]], [d.r[2], d.r[1]], [d.r[2], d.r[3]], [d.r[0], d.r[3]]];
        el.setAttribute("d", topVis ? poly(loc.map(([u, v]) => P(...W([u, v, b[5]], pt, a)))) : "");
      });
    }
    if (dot) place(dot, P(...rot(SP.joints[0], a[0], SP.laser, true)));
  }

  const tw = tween(0), sp = spring(SP.joints[0].rest);
  let last = "", on = false;
  const angles = (now) => (SP.mode === "aim" ? [sp.x] : SP.joints.map((j) => lerp(j.rest, amt, tval(tw, now))));
  const B = register(stage, (dt, now) => {
    const moving = SP.mode === "aim" ? stepS(sp, dt) : !tdone(tw, now);
    const A = angles(now), key = A.map((v) => v.toFixed(2)).join();
    if (key !== last) { draw(A); last = key; }
    return moving;
  });
  bag.add(B.unregister);
  // one bright place: the rest mark, or the part that answers
  function hiOn(act) {
    for (const e of els) {
      e.s.sil.classList.toggle("hi", act && !!e.part.ans && e.part.ans !== 2);
      e.ds.forEach((el, i) => el.classList.toggle("hi", !act && !!e.part.d[i].hi));
    }
  }
  function move(p) {
    if (SP.mode === "aim") {
      const q = unproj(C, p[0], p[1], 0), j = SP.joints[0];
      const ang = Math.atan2(q[1] - j.p[1], q[0] - j.p[0]) * 180 / Math.PI;
      sp.t = clamp(ang, j.rest - amt, j.rest + amt);
      read.textContent = Math.round(sp.t - j.rest) + "°";
      hiOn(true); B.wake(); return;
    }
    const act = inside(p);
    if (act === on) return;
    on = act; tset(tw, act ? 1 : 0, performance.now(), 0);
    read.textContent = act ? SP.readOn : "rest"; hiOn(act); B.wake();
  }
  function leave() {
    if (SP.mode === "aim") sp.t = SP.joints[0].rest; else { on = false; tset(tw, 0, performance.now(), 0); }
    read.textContent = "rest"; hiOn(false); B.wake();
  }
  hiOn(false); read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "dongle",
  means: "A USB stick under its swivel cover: the pointer swings the metal cover round on its pin, baring the plug.",
  rules: [1, 4, 5, 8],
  range: [60,110,120],
  tour: [[290,154],[250,170],[200,140],null],
  mount,
});
