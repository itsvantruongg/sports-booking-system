const fs = require('fs');
const path = require('path');

const designDir = path.join(__dirname, 'design-assets', 'stitch_sportcourt_booking_system');
const appDir = path.join(__dirname, 'app');

const mapping = {
  'admin_master_dashboard':    { out: 'admin/page.tsx',               role: 'admin' },
  'admin_c_i_t_h_th_ng':       { out: 'admin/settings/page.tsx',      role: 'admin' },
  'admin_qu_n_l_ng_i_d_ng':    { out: 'admin/users/page.tsx',         role: 'admin' },
  'admin_th_m_i_t_c_m_i':      { out: 'admin/add-partner/page.tsx',   role: 'admin' },
  'owner_dashboard_t_ng_quan':  { out: 'owner/page.tsx',              role: 'owner' },
  'owner_b_o_c_o_doanh_thu':    { out: 'owner/revenue/page.tsx',      role: 'owner' },
  'owner_i_m_t_kh_u_b_t_bu_c': { out: 'owner/change-password/page.tsx', role: 'owner' },
  'owner_qu_n_l_danh_m_c_s_n': { out: 'owner/courts/page.tsx',       role: 'owner' },
  'owner_qu_n_l_kh_ch_h_ng':   { out: 'owner/customers/page.tsx',    role: 'owner' },
  'owner_qu_n_l_l_ch_timeline': { out: 'owner/timeline/page.tsx',    role: 'owner' },
  'trang_ch_home_page':         { out: 'user/page.tsx',               role: 'user' },
  'danh_s_ch_s_n_field_list':   { out: 'user/fields/page.tsx',        role: 'user' },
  'chi_ti_t_s_n_field_detail':  { out: 'user/fields/detail/page.tsx', role: 'user' },
  't_l_ch_booking_form':        { out: 'user/book/page.tsx',          role: 'user' },
  'l_ch_s_t_s_n':               { out: 'user/history/page.tsx',       role: 'user' },
  'h_s_c_nh_n':                 { out: 'user/profile/page.tsx',       role: 'user' },
};

function convertStyleAttr(styleStr) {
  const props = [];
  for (const part of styleStr.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key   = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();
    if (!key || value === '') continue;
    const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const safeValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    props.push(`${camelKey}: "${safeValue}"`);
  }
  return `style={{ ${props.join(', ')} }}`;
}

// Replace <a href="#"> by matching the icon inside
function replaceHrefByIcon(jsx, iconRoutes) {
  return jsx.replace(/<a(\s[^>]*href="#"[^>]*)>([\s\S]*?)<\/a>/g, (match, attrs, content) => {
    const m = content.match(/material-symbols-outlined[^>]*>\s*([a-z_]+)\s*</);
    if (m && iconRoutes[m[1].trim()] !== undefined) {
      return `<a${attrs.replace('href="#"', `href="${iconRoutes[m[1].trim()]}"`)}>` + content + '</a>';
    }
    return match;
  });
}

function fixNavLinks(jsx, role) {
  let r = jsx;

  if (role === 'owner') {
    r = replaceHrefByIcon(r, {
      dashboard: '/owner', stadium: '/owner/courts', calendar_today: '/owner/timeline',
      payments: '/owner/revenue', group: '/owner/customers', settings: '#',
      logout: '/', help: '#',
    });
    r = r.replace(/href="#"([^>]*)>\s*Sign Out\s*<\/a>/g, `href="/"$1>Sign Out</a>`);
    // "Add New Court" button → link
    r = r.replace(
      /<button([^>]*?)>\s*Add New Court\s*<\/button>/g,
      `<a href="/owner/courts"$1 style={{ display: "block", textAlign: "center" }}>Add New Court</a>`
    );
    // "Manage Venue" buttons
    r = r.replace(
      /<button([^>]*?)>\s*(Manage Venue|View All)\s*<\/button>/g,
      `<a href="/owner/courts"$1 style={{ display: "block", textAlign: "center" }}>$2</a>`
    );
  }

  if (role === 'admin') {
    r = replaceHrefByIcon(r, {
      dashboard: '/admin', group: '/admin/users', add_business: '/admin/add-partner',
      handshake: '/admin/add-partner', settings: '/admin/settings',
      logout: '/', help: '#',
    });
    r = r.replace(/href="#"([^>]*)>\s*Sign Out\s*<\/a>/g, `href="/"$1>Sign Out</a>`);
    r = r.replace(
      /<button([^>]*?)>\s*\+\s*Add New Court\s*<\/button>/g,
      `<a href="/admin/add-partner"$1 style={{ display: "block", textAlign: "center" }}>+ Add New Court</a>`
    );
    r = r.replace(
      /<button([^>]*?)>\s*Add New Court\s*<\/button>/g,
      `<a href="/admin/add-partner"$1 style={{ display: "block", textAlign: "center" }}>Add New Court</a>`
    );
  }

  if (role === 'user') {
    // Top nav text links
    r = r.replace(/href="#"([^>]*)>\s*Explore\s*<\/a>/g,      `href="/user"$1>Explore</a>`);
    r = r.replace(/href="#"([^>]*)>\s*My Bookings\s*<\/a>/g,  `href="/user/history"$1>My Bookings</a>`);
    r = r.replace(/href="#"([^>]*)>\s*Venues\s*<\/a>/g,       `href="/user/fields"$1>Venues</a>`);
    r = r.replace(/href="#"([^>]*)>\s*Xem tất cả\s*<\/a>/g,   `href="/user/fields"$1>Xem tất cả</a>`);
    // Profile icon button → link
    r = r.replace(
      /<button([^>]*)>\s*(<span[^>]*>account_circle<\/span>)\s*<\/button>/g,
      `<a href="/user/profile"$1>$2</a>`
    );
    // "Find a Court" button → link
    r = r.replace(
      /<button([^>]*bg-primary[^>]*)>\s*Find a Court\s*<\/button>/g,
      `<a href="/user/fields"$1 style={{ display: "inline-block", textAlign: "center" }}>Find a Court</a>`
    );
    // Field cards "Xem chi tiết" buttons → link to detail
    r = r.replace(
      /<button([^>]*)>\s*Xem chi tiết\s*<\/button>/g,
      `<a href="/user/fields/detail"$1 style={{ display: "block", textAlign: "center" }}>Xem chi tiết</a>`
    );
    // "Đặt sân" / "Book Now" buttons → link to /user/book
    r = r.replace(
      /<button([^>]*)>\s*(Đặt ngay|Book Now|Đặt sân ngay|Đặt Sân Ngay)\s*<\/button>/g,
      `<a href="/user/book"$1 style={{ display: "block", textAlign: "center" }}>$2</a>`
    );
    // Back to home link
    r = r.replace(/href="#"([^>]*)>\s*Back\s*<\/a>/g, `href="/user"$1>Back</a>`);
    // Back to fields
    r = r.replace(/href="#"([^>]*)>\s*Back to Search\s*<\/a>/g, `href="/user/fields"$1>Back to Search</a>`);
  }

  return r;
}

function convertHtmlToJsx(html) {
  let bodyClass = 'min-h-screen';
  const bodyTagMatch = html.match(/<body([^>]*)>/i);
  if (bodyTagMatch) {
    const m = bodyTagMatch[1].match(/class="([^"]*)"/i);
    if (m) bodyClass = m[1];
  }

  let body = html;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) body = bodyMatch[1];

  let jsx = body
    .replace(/\bclass=/g, 'className=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\bonclick=/gi, 'onClick=')
    .replace(/<script[^>]*tailwind[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')
    .replace(/<(img|input|br|hr|link|meta|area|base|col|embed|param|source|track|wbr)(\s[^>]*)?\s*\/?>/gi,
      (m, tag, attrs = '') => `<${tag}${attrs.replace(/\s*\/\s*$/, '')} />`)
    .replace(/style="([^"]*)"/g, (_, s) => convertStyleAttr(s))
    .replace(/\b(checked|disabled|readonly|multiple)\b(?!=)/gi, (m) => `${m}={true}`)
    .replace(/\b(checked|disabled|readonly|selected|multiple)=""/gi, (m, p1) => `${p1}={true}`)
    .replace(/<option([^>]*)selected(?:={true}|="")?([^>]*)>/gi, '<option$1$2>')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<link[^>]*\/>/gi, '');

  return { jsx, bodyClass };
}

// Strip the nav/header already embedded in the Stitch HTML since layouts now handle it
function stripEmbeddedNav(jsx, role) {
  if (role === 'owner' || role === 'admin') {
    // Remove fixed sidebar <nav>
    jsx = jsx.replace(/<nav\b[^>]*fixed[^>]*>[\s\S]*?<\/nav>/i, '');
    // Remove the outer flex h-screen wrapper - keep only inner content
    jsx = jsx.replace(/className="flex h-screen overflow-hidden(\s[^"]*)?"/, 'className="flex-1"');
    // Remove ml-72 from main (layout already has it)
    jsx = jsx.replace(/\bml-72\b\s*/g, '');
    // Remove h-screen from remaining divs (layout manages height)
    jsx = jsx.replace(/\bh-screen\b\s*/g, '');
  }
  if (role === 'user') {
    // Remove sticky top header
    jsx = jsx.replace(/<header\b[^>]*>[\s\S]*?<\/header>/i, '');
    // Remove sticky top nav (some pages use <nav> instead of <header>)
    jsx = jsx.replace(/<nav\b[^>]*sticky[^>]*>[\s\S]*?<\/nav>/i, '');
  }
  return jsx;
}


Object.entries(mapping).forEach(([srcFolder, { out: targetPath, role }]) => {
  const htmlPath       = path.join(designDir, srcFolder, 'code.html');
  const fullTargetPath = path.join(appDir, targetPath);

  if (!fs.existsSync(htmlPath)) { console.log(`❌ Missing: ${srcFolder}`); return; }

  const html = fs.readFileSync(htmlPath, 'utf8');
  let { jsx, bodyClass } = convertHtmlToJsx(html);
  jsx = stripEmbeddedNav(jsx, role);
  jsx = fixNavLinks(jsx, role);

  const componentName = targetPath
    .replace('/page.tsx', '').split('/')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase()))
    .join('') + 'Page';

  const finalComponent =
`"use client";
import Link from "next/link";

export default function ${componentName}() {
  return (
    <div className="${bodyClass}">
      ${jsx.trim()}
    </div>
  );
}
`;

  const dir = path.dirname(fullTargetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullTargetPath, finalComponent, 'utf8');
  console.log(`✅  ${srcFolder}  →  ${targetPath}`);
});

console.log('\nDone! Run: npm run dev');
