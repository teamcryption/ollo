"use strict";
(() => {
  // src/code.ts
  var LIBRARY_PAGE = "ollo icons";
  figma.showUI(__html__, { width: 400, height: 700, themeColors: true });
  async function libraryPage() {
    let page = figma.root.children.find((p) => p.name === LIBRARY_PAGE);
    if (!page) {
      page = figma.createPage();
      page.name = LIBRARY_PAGE;
    }
    await page.loadAsync();
    return page;
  }
  function nextSpot(page) {
    const sets = page.children;
    if (!sets.length) return { x: 0, y: 0 };
    const last = sets[sets.length - 1];
    const row = sets.filter((n) => Math.abs(n.y - last.y) < 1);
    if (row.length < 6) return { x: Math.max(...row.map((n) => n.x + n.width)) + 40, y: last.y };
    return { x: 0, y: Math.max(...sets.map((n) => n.y + n.height)) + 40 };
  }
  async function insert(msg) {
    var _a, _b;
    const page = await libraryPage();
    const ordered = [...msg.variants].sort((a, b) => a.label === msg.pick ? -1 : b.label === msg.pick ? 1 : 0);
    let set = (_a = page.children.find((n) => n.type === "COMPONENT_SET" && n.name === msg.name)) != null ? _a : null;
    const have = new Set(set ? set.children.map((c) => c.name.split("=")[1]) : []);
    const fresh = [];
    for (const v of ordered) {
      if (have.has(v.label)) continue;
      const frame = figma.createNodeFromSvg(v.svg);
      frame.resize(msg.size, msg.size);
      const comp = figma.createComponentFromNode(frame);
      comp.fills = [];
      comp.name = `${msg.prop}=${v.label}`;
      comp.description = `${msg.title} ${msg.kind}, ${v.label}. ollo library.`;
      if (msg.kind === "icon") for (const n of comp.findAll((x) => x.type === "VECTOR")) n.name = msg.name;
      fresh.push(comp);
    }
    if (!set) {
      const spot = nextSpot(page);
      for (const c of fresh) page.appendChild(c);
      set = figma.combineAsVariants(fresh, page);
      set.name = msg.name;
      set.description = `${msg.title} from the ollo library. Switch ${msg.prop} to change the variant.`;
      set.layoutMode = "HORIZONTAL";
      set.itemSpacing = 16;
      set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16;
      set.primaryAxisSizingMode = "AUTO";
      set.counterAxisSizingMode = "AUTO";
      set.x = spot.x;
      set.y = spot.y;
    } else {
      for (const c of fresh) set.appendChild(c);
    }
    const variant = (_b = set.children.find((c) => c.type === "COMPONENT" && c.name === `${msg.prop}=${msg.pick}`)) != null ? _b : set.children.find((c) => c.type === "COMPONENT");
    const instance = variant.createInstance();
    instance.name = msg.name;
    const center = figma.viewport.center;
    instance.x = Math.round(center.x - instance.width / 2);
    instance.y = Math.round(center.y - instance.height / 2);
    figma.currentPage.appendChild(instance);
    figma.currentPage.selection = [instance];
  }
  figma.ui.onmessage = async (msg) => {
    try {
      if (msg.type === "insert") await insert(msg);
      else if (msg.type === "get-plan") figma.ui.postMessage({ type: "plan", pro: await figma.clientStorage.getAsync("ollo-pro") === true });
      else if (msg.type === "set-plan") await figma.clientStorage.setAsync("ollo-pro", msg.pro);
      else if (msg.type === "notify") figma.notify(msg.text);
    } catch (e) {
      figma.notify(`ollo: ${e.message}`, { error: true });
    }
  };
})();
