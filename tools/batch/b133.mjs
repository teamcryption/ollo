const PAGE = `body('M5.5 5.5A2.5 2.5 0 0 1 8 3h5.5L18.5 8v10.5A2.5 2.5 0 0 1 16 21H8a2.5 2.5 0 0 1-2.5-2.5Z'), line('M13.5 3.2V6.5A1.5 1.5 0 0 0 15 8h3.3')`;
const FOLDER = `body('M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z')`;
const HEART = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const G = {
  gear: `accent(gear(12, 14.5, 3.6, 2.7, 8, 0.3))`,
  link: `accent('M11 13.5l2-2a1.8 1.8 0 0 1 2.5 2.5l-2 2M13 15.5l-2 2a1.8 1.8 0 0 1-2.5-2.5l2-2M11 15l2-2')`,
  pin: `accent('M12 18.5s-3-3-3-5.2a3 3 0 0 1 6 0c0 2.2-3 5.2-3 5.2ZM12 13.3h.01')`,
  cloud: `accent('M9.5 17.5h5.3a2.2 2.2 0 0 0 .2-4.4 3 3 0 0 0-5.7.8 1.8 1.8 0 0 0 .2 3.6Z')`,
  bolt: `accent('M12.8 10.5 9.5 15h3l-1 3.5 3.5-4.8h-3Z')`,
  question: `accent('M10.3 12.3a1.8 1.8 0 1 1 2.6 1.6c-.6.3-.9.8-.9 1.4v.4M12 18h.01')`,
  pen: `accent('M9.5 17.5l.5-2 4.3-4.3 1.5 1.5-4.3 4.3Z')`,
  eye: `accent('M8.5 14.5c1-1.8 2.2-2.7 3.5-2.7s2.5.9 3.5 2.7c-1 1.8-2.2 2.7-3.5 2.7s-2.5-.9-3.5-2.7ZM12 14.5h.01')`,
  sync: `accent('M9 13.5a3 3 0 0 1 5.5-1.3M15 15.5a3 3 0 0 1-5.5 1.3M14.5 10.8v1.4h-1.4M9.5 18.2v-1.4h1.4')`,
  tag: `accent('M9 12.5v-2h2l4 4-2 2Z')`,
  percent: `accent('M14.5 11.5l-5 6M10 12h.01M14 17h.01')`,
  font: `accent('M9.5 18l2.5-6.5 2.5 6.5M10.4 16h3.2')`,
  share: `accent('M14.5 11.5h.01M9.5 14.5h.01M14.5 17.5h.01M10.3 14l3.4-2M10.3 15l3.4 2')`,
  key: `accent('M10.5 15.5a2 2 0 1 1 1.6-.8l3 3M14 16.5l1-1')`,
  mail: `accent('M9 12h6v4.5H9ZM9 12l3 2.2 3-2.2')`,
  calendar: `accent('M9 12h6v5H9ZM9 13.8h6M10.5 11v1.5M13.5 11v1.5')`,
};
const up = (g, dy = -1) => g.replace(/^accent\((.*)\)$/, `accent(translateD($1, 0, ${dy}))`);
const F = {
  heart: `accent(translateD(scaleD('${HEART}', 0.4), 0, 1.5))`,
  user: `accent(translateD('M12 10.3a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM8.8 18.3a3.2 3.2 0 0 1 6.4 0', 0, -1))`,
  music: `accent('M11 16.5a1.5 1.5 0 1 1-1.5-1.5H11v-5l4-1v4.5')`,
  video: `accent(poly([[10.5, 10.5], [15, 13.3], [10.5, 16]], 0.6, true))`,
  chart: `accent('M9.5 16.5v-2M12 16.5v-5M14.5 16.5V13')`,
  upload: `accent('M12 16.5v-6M9.5 13 12 10.5l2.5 2.5')`,
};
const file = (k, title, tags) => `icon('file-${k}', '${title}', ${JSON.stringify(tags).replace(/"/g, "'")}, [${PAGE}, ${G[k]}])`;
const folder = (k, title, tags, g) => `icon('folder-${k}', '${title}', ${JSON.stringify(tags).replace(/"/g, "'")}, [${FOLDER}, ${g}])`;
export default {
  files: [
    file('gear', 'File Settings', ['document settings', 'configure file', 'properties', 'options']),
    file('link', 'Linked File', ['file link', 'shared link', 'url', 'attachment']),
    file('pin', 'File Location', ['file pin', 'location', 'map document', 'place']),
    file('cloud', 'Cloud File', ['online file', 'cloud document', 'synced file', 'drive']),
    file('bolt', 'Quick File', ['fast file', 'instant', 'power document', 'flash']),
    file('question', 'Unknown File', ['file help', 'unknown type', 'missing', 'question']),
    file('pen', 'Edit File', ['edit document', 'write', 'draft', 'modify']),
    file('eye', 'Preview File', ['view document', 'read only', 'preview', 'visible']),
    file('sync', 'Sync File', ['file sync', 'update document', 'refresh', 'versioning']),
    file('tag', 'Tagged File', ['file label', 'tag document', 'category', 'metadata']),
    file('percent', 'Rate Document', ['tax file', 'discount sheet', 'percentage', 'rates']),
    file('font', 'Font File', ['typeface', 'font document', 'ttf', 'typography']),
    file('share', 'Shared File', ['share document', 'collaborate', 'send file', 'distribute']),
    file('key', 'Key File', ['license key', 'credentials', 'certificate', 'secret']),
    file('mail', 'Mail File', ['email attachment', 'eml', 'message file', 'letter']),
    file('calendar', 'Calendar File', ['ics', 'event file', 'schedule', 'invite']),
    folder('heart', 'Favourite Folder', ['liked folder', 'favorites', 'saved', 'love'], F.heart),
    folder('user', 'User Folder', ['personal folder', 'home directory', 'profile', 'my files'], F.user),
    folder('cloud', 'Cloud Folder', ['online folder', 'drive', 'synced folder', 'storage'], up(G.cloud)),
    folder('link', 'Linked Folder', ['shortcut', 'alias', 'symlink', 'shared link'], up(G.link)),
    folder('pin', 'Pinned Folder', ['location folder', 'places', 'map folder', 'pinned'], up(G.pin)),
    folder('sync', 'Sync Folder', ['synced folder', 'backup', 'refresh', 'mirror'], up(G.sync)),
    folder('music', 'Music Folder', ['audio folder', 'songs', 'library', 'playlist'], F.music),
    folder('video', 'Video Folder', ['movies', 'clips', 'media folder', 'films'], F.video),
    folder('key', 'Key Folder', ['secrets', 'credentials', 'keys', 'restricted'], up(G.key)),
    folder('bolt', 'Quick Access Folder', ['fast access', 'favourite', 'instant', 'power'], up(G.bolt)),
    folder('chart', 'Reports Folder', ['analytics folder', 'reports', 'charts', 'statistics'], F.chart),
    folder('upload', 'Folder Upload', ['upload folder', 'send', 'export', 'publish'], F.upload),
    folder('mail', 'Mail Folder', ['email folder', 'mailbox', 'messages', 'archive'], up(G.mail)),
    folder('question', 'Unknown Folder', ['folder help', 'missing', 'unknown', 'question'], up(G.question)),
    folder('eye', 'Visible Folder', ['view folder', 'preview', 'public', 'watch'], up(G.eye)),
  ],
};
