import * as yup from "yup";

const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\.?$/;

export const VARIABLE_META = {
    DOMAIN: { label: "Domain", placeholder: "example.com", helper: "Root domain (no www)" },
    IP: { label: "IPv4 Address", placeholder: "192.168.1.100", helper: "Server IPv4 address" },
    IP6: { label: "IPv6 Address", placeholder: "2001:db8::1", helper: "Server IPv6 address" },
    MAIL_SERVER: { label: "Mail Server", placeholder: "mail.example.com.", helper: "Fully qualified mail hostname (trailing dot)" },
    NSDOMAIN: { label: "Nameserver Domain", placeholder: "example.com", helper: "Domain used for NS records" },
};

const shape = {};
Object.entries(VARIABLE_META).forEach(([key, meta]) => {
    if (key === "DOMAIN") return;
    let validator = yup.string().required(`${meta.label} is required`);

    if (key === "IP") {
        validator = validator.matches(ipv4Regex, "Invalid IPv4 Address");
    } else if (key === "IP6") {
        validator = validator.matches(ipv6Regex, "Invalid IPv6 Address");
    } else if (key === "MAIL_SERVER" || key === "NSDOMAIN") {
        validator = validator.matches(domainRegex, "Invalid Domain format");
    }
    shape[key] = validator;
});

export const TemplateValueSchema = yup.object().shape({ variables: yup.object().shape(shape) });


/** Extract all {{VAR}} tokens from a string */
export const extractVarNames = (str = "") => {
    const found = new Set();
    const rx = /\{\{([^}]+)\}\}/g;
    let m;
    while ((m = rx.exec(str)) !== null) found.add(m[1].trim().toUpperCase());
    return found;
};

/** Build SOA content string from its three parts */
export const buildSOAContent = (mname, rname, serial) =>
    `${mname} ${rname} ${serial} 3600 600 86400 3600`;




