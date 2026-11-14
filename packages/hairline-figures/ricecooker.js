/**
 * Rice cooker: a rounded body with a domed lid hinged at the back, a pot rim
 * inside, a handle and a switch on the front. The pointer over the cooker
 * swings the lid open on its hinge and steam rises from the pot in dashed
 * wisps. At rest the lid sits a little ajar, bright. The slider is how far
 * the lid opens.
 *
 * The pattern: one part swinging on a hinge; the hit is the body's rest top.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rrect, ringAt, run, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 17, H = 22, LT = 3, DOME = 6, HY = -R;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 4.4);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, -R - 8, H + 2 * R], [0, 0, H + 26]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, with the pot rim on its top, a handle and a switch on the near faces
  const body = solid(g);
  put(body, prism(P, front, rrect(-R, -R, R, R, 13, 14), rrect(-R + 1.4, -R + 1.4, R - 1.4, R - 1.4, 11.6, 14), 0, H));
  mk("path", {
    class: "nf lo",
    d: poly(ringAt(P, rrect(-R + 4, -R + 4, R - 4, R - 4, 9, 14), H)) +
      seg(P(-5, R, 14), P(5, R, 14)),
  }, body.g);

  // the lid: a plate and a dome, hinged along x at the back edge
  const foot = rrect(-R, -R, R, R, 13, 14), top = rrect(-R + 5, -R + 5, R - 5, R - 5, 8, 14), inner = rrect(-R + 6.4, -R + 6.4, R - 6.4, R - 6.4, 6.6, 14);
  const steam = mk("path", { class: "nf dash" }, g);
  const lid = solid(g);
  const ang = tween(8);
  let last = NaN;
  function lidPts(ring, z, a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return ring.map((p) => { const dy = p.v - HY, dz = z - H; return P(p.u, HY + dy * c - dz * s, H + dy * s + dz * c); });
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = lidPts(foot, H, a).concat(lidPts(foot, H + LT, a), lidPts(top, H + LT + DOME, a));
    lid.sil.setAttribute("d", poly(hull(pts)));
    lid.cr.setAttribute("d", open(lidPts(run(inner, front), H + LT + DOME, a)) + open(lidPts(run(foot, front), H + LT, a)));
    const k = clamp((a - 20) / 50, 0, 1);
    let d = "";
    if (k > 0.02) for (let i = -1; i <= 1; i++) {
      const w = [];
      for (let j = 0; j <= 8; j++) w.push(P(i * 6 + 2.2 * Math.sin(j * 0.9 + i), i * 3, H + 2 + j * 3.2 * k));
      d += open(w);
    }
    steam.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return Math.abs(x) < R + 3 && Math.abs(y) < R + 3;
  }
  let on = null;
  function setOpen(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? maxA : 8, performance.now(), 0);
    lid.sil.classList.add("hi");
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOpen(false);
  bag.add(pointer(stage, { move: (p) => setOpen(hit(p)), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "ricecooker",
  means: "A rice cooker: over it the lid swings open on its back hinge and steam rises from the pot.",
  rules: [1, 3, 5, 6],
  range: [40, 75, 95],
  tour: [[200, 160], [215, 170], [185, 150], null],
  mount,
});
