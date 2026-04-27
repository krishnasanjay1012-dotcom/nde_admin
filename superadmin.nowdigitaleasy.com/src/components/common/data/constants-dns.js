
// ─── Constants ────────────────────────────────────────────────────────────────

export const CATEGORY_RECORD_TYPES = {
  DEFAULT: ["A", "AAAA", "CNAME", "NS", "SOA", "MX", "TXT"],
  WEB_SERVER: ["A", "AAAA", "CNAME", "NS", "SOA", "MX", "TXT"],
  CUSTOM: ["A", "AAAA", "CNAME", "NS", "SOA", "MX", "TXT"],
};

// Predefined variables with metadata
export const VARIABLE_OPTIONS = [
  { name: "DOMAIN", description: "Domain name" },
  { name: "IP", description: "IPv4 address" },
  { name: "IP6", description: "IPv6 address" },
  { name: "MAIL_SERVER", description: "Mail server hostname" },
  { name: "NSDOMAIN", description: "Nameserver domain" },
  { name: "SERIAL", description: "SOA serial number" },
];

export const VARIABLE_MAP = Object.fromEntries(
  VARIABLE_OPTIONS.map((v) => [v.name, v])
);

// Per-type auto-fill defaults
export const TYPE_DEFAULTS = {
  A: { name: "{{DOMAIN}}", content: "{{IP}}", hint: "{{IP}}", prio: null },
  AAAA: { name: "{{DOMAIN}}", content: "{{IP6}}", hint: "{{IP6}}", prio: null },
  CNAME: { name: "www.{{DOMAIN}}", content: "{{DOMAIN}}.", hint: "{{DOMAIN}}.", prio: null },
  MX: { name: "{{DOMAIN}}", content: "{{MAIL_SERVER}}.", hint: "{{MAIL_SERVER}}.", prio: "10" },
  TXT: { name: "{{DOMAIN}}", content: "v=spf1 include:{{DOMAIN}} ~all", hint: "v=spf1 ...", prio: null },
  NS: { name: "{{DOMAIN}}", content: "ns1.{{NSDOMAIN}}.", hint: "ns1.{{NSDOMAIN}}.", prio: null },
  SOA: { name: "{{DOMAIN}}", content: "", hint: "", prio: null },
};

export const DEFAULT_RECORD = {
  name: "{{DOMAIN}}",
  type: "A",
  content: "{{IP}}",
  ttl: 3600,
  prio: null,
  soa_mname: "ns1.{{NSDOMAIN}}.",
  soa_rname: "admin.{{NSDOMAIN}}.",
  soa_serial: "{{SERIAL}}",
};