export const DNS_RECORD_TYPES = {
    A: { label: 'A', description: 'IPv4 Address', placeholder: 'IP V4 Address' },
    AAAA: { label: 'AAAA', description: 'IPv6 Address', placeholder: 'IP V6 Address' },
    CNAME: { label: 'CNAME', description: 'Canonical Name', placeholder: 'example.com' },
    MX: { label: 'MX', description: 'Mail Exchange', hasPriority: true, placeholder: 'mail.example.com' },
    TXT: { label: 'TXT', description: 'Text Record', placeholder: 'text value' },
    NS: { label: 'NS', description: 'Name Server', placeholder: 'example.com' },
    CAA: { label: 'CAA', description: 'Certificate Authority', hasFlags: true, hasTag: true, placeholder: 'value' },
    SRV: { label: 'SRV', description: 'Service Record', hasPriority: true, hasWeight: true, hasPort: true, placeholder: 'target'},
    HTTPS: { label: 'HTTPS', description: 'HTTPS Record', hasComplexFields: true, placeholder: 'example.com' },
};

export const TTL_OPTIONS = [
    { value: 300, label: '5 min' },
    { value: 1800, label: '30 min' },
    { value: 3600, label: '1 hour' },
    { value: 21600, label: '6 hours' },
    { value: 86400, label: '1 day' },
];

export const CAA_TAG_OPTIONS = ['issue', 'issuewild', 'iodef'];

export const TYPE_CHIP_COLORS = {
  A:     "primary",
  AAAA:  "secondary",
  CNAME: "success",
  MX:    "warning",
  TXT:   "default",
  NS:    "error",
  CAA:   "info",
  SRV:   "info",
};