export const DNS_RECORD_TYPES = {
  A: { label: 'A', description: 'IPv4 Address', placeholder: 'IP V4 Address' },
  AAAA: { label: 'AAAA', description: 'IPv6 Address', placeholder: 'IP V6 Address' },
  CNAME: { label: 'CNAME', description: 'Canonical Name', placeholder: 'example.com' },
  MX: { label: 'MX', description: 'Mail Exchange', hasPriority: true, placeholder: 'mail.example.com' },
  TXT: { label: 'TXT', description: 'Text Record', placeholder: 'text value' },
  NS: { label: 'NS', description: 'Name Server', placeholder: 'example.com' },
  CAA: { label: 'CAA', description: 'Certificate Authority', hasFlags: true, hasTag: true, placeholder: 'value' },
  SRV: { label: 'SRV', description: 'Service Record', hasPriority: true, hasWeight: true, hasPort: true, placeholder: 'target' },
  //   HTTPS: { label: 'HTTPS', description: 'HTTPS Record', hasComplexFields: true, placeholder: 'example.com' },
  SOA: { label: 'SOA', description: 'Start of Authority', hasSOAFields: true },
};

export const TTL_OPTIONS = [
  { value: 300, label: '5 min' },
  { value: 1800, label: '30 min' },
  { value: 3600, label: '1 hour' },
  { value: 21600, label: '6 hours' },
  { value: 86400, label: '1 day' },
];

export const CAA_TAG_OPTIONS = [
  { value: 'issue', label: 'issue' },
  { value: 'issuewild', label: 'issuewild' },
  { value: 'iodef', label: 'iodef' },
];

export const TYPE_CHIP_COLORS = {
  A: "primary",
  AAAA: "secondary",
  CNAME: "success",
  MX: "warning",
  TXT: "default",
  NS: "error",
  CAA: "info",
  SRV: "info",
};

export const buildRecordName = (hostInput, domain) => {
  const h = (hostInput || '').trim();
  if (!h || h === '@' || h === domain) return domain;
  if (h.endsWith(`.${domain}`)) return h;
  return `${h}.${domain}`;
};

export const buildContentByType = (type, formData) => {
  switch (type) {
    case "SRV":
      return `${formData.weight || 0} ${formData.priority || 0} ${formData.port || 0} ${formData.value}`;

    case "CAA":
      return `${formData.flags || 0} ${formData.tag} "${formData.value}"`;

    case "SOA":
      return `${formData.primary} ${formData.admin} ${formData.serial} ${formData.refresh} ${formData.retry} ${formData.expire} ${formData.minimum}`;

    case "MX":
      return `${formData.value}`;

    default:
      return formData.value || "";
  }
};

export const parseContentFields = (type, content = '', prio) => {
        const parts = content.split(' ');
        switch (type) {
            case 'MX':
                return { value: content, priority: prio ?? 10 };
            case 'SRV': {
                // format: <weight> <priority> <port> <target>
                const [weight, priority, port, ...rest] = parts;
                return { weight, priority, port, value: rest.join(' ') };
            }
            case 'CAA': {
                // format: <flags> <tag> "<value>"
                const [flags, tag, ...rest] = parts;
                return { flags, tag, value: rest.join(' ').replace(/"/g, '') };
            }
            case 'SOA': {
                // format: <primary> <admin> <serial> <refresh> <retry> <expire> <minimum>
                const [primary, admin, serial, refresh, retry, expire, minimum] = parts;
                return { primary, admin, serial, refresh, retry, expire, minimum, value: content };
            }
            default:
                return { value: content };
        }
    };