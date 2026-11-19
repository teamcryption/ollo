/**
 * Waltzer: one car of the fairground ride, a round tub on its turning
 * platform, a high curved back shell round half the tub and a hand wheel in
 * the middle of the open half. The pointer sets the tub spinning: it turns
 * on the platform, the back shell sweeping round, the wheel with it.
 * At rest the back shell is bright. The slider is how far the tub spins.
 *
 * The pattern: one part turning about its own axis (spin).
 */
const { Cam, circ, fit, facing, hull, open, poly, prism, proj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BR = 36, TR = 24, Z0 = 6, Z1 = 20, Z2 = 44, A0 = 225;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [-BR, BR, 0], [BR, -BR, 0], [-TR, -TR, Z2], [TR, TR, Z2], [TR, -TR, Z2], [-TR, TR, Z2]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the platform and its rim, then the tub on it
  put(solid(g), prism(P, front, circ(BR, 64), circ(BR - 3, 64), 0, Z0 - 2));
  put(solid(g), prism(P, front, circ(8, 32), circ(6, 32), Z0 - 2, Z0));
  put(solid(g), prism(P, front, circ(TR, 64), circ(TR - 2.5, 64), Z0, Z1));
  mk("path", { d: poly(circ(TR - 6, 48).map((q) => P(q.u, q.v, Z1 - 3))), class: "nf lo" }, g);
  const top = mk("g", {}, g);
  const back = solid(top), wheel = mk("g", {}, top);
  const post = mk("path", { class: "nf lo" }, wheel), rimW = solid(wheel), spoke = mk("path", { class: "nf lo" }, wheel);
  back.sil.classList.add("hi");

  // the back shell: a D of the tub's outline, raised over one half
  const shell = (a, r) => { const o = []; for (let i = 0; i <= 18; i++) { const t = a + (i / 18 - 0.5) * Math.PI * 0.72; o.push([r * Math.cos(t), r * Math.sin(t)]); } return o; };
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    const key = t * 10 + amp;
    if (key === last) return;
    last = key;
    const a = ((A0 + t * (60 + 240 * amp)) * Math.PI) / 180;
    const outer = shell(a, TR - 0.5), inner = shell(a, TR - 3);
    back.sil.setAttribute("d", poly(hull(outer.map(([x, y]) => P(x, y, Z1 - 1)).concat(outer.map(([x, y]) => P(x, y, Z2))))));
    back.cr.setAttribute("d", open(inner.slice(2, -2).map(([x, y]) => P(x, y, Z2 - 0.5))));
    const wx = -10 * Math.cos(a), wy = -10 * Math.sin(a);
    post.setAttribute("d", "M" + P(wx, wy, Z1 - 3).join(",") + "L" + P(wx, wy, 28).join(","));
    put(rimW, prism(P, front, disc(wx, wy, 6), disc(wx, wy, 4.5), 28, 30));
    const s1 = P(wx - 5 * Math.cos(a), wy - 5 * Math.sin(a), 30), s2 = P(wx + 5 * Math.cos(a), wy + 5 * Math.sin(a), 30);
    spoke.setAttribute("d", "M" + s1.join(",") + "L" + s2.join(","));
    // the shell behind the wheel when it stands on the far side, in front when near
    if (Math.cos(a) + Math.sin(a) > 0) top.appendChild(back.g); else top.appendChild(wheel);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, Z1);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? "spin" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 110;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "waltzer",
  means: "A waltzer car on its platform: over it, the tub spins round, its high back shell sweeping about the hand wheel.",
  rules: [1, 4, 5, 8],
  range: [0.2, 0.6, 1],
  tour: [[200, 56], [200, 150], [129, 229], null],
  mount,
});
