import * as yup from "yup";

let ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
let ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
let domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
let hostnameRegex = /^(@|\*|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+)$/;


export const createDnsRecordSchema = (recordType) => {
    let schema = {
        host: yup
            .string()
            .nullable()
            .notRequired()
            .test(
                "valid-host",
                "Invalid hostname. Use @ for root, * for wildcard, or valid subdomain",
                (value) => {
                    // explicitly allow completely empty strings
                    if (value === "" || value === null || value === undefined) return true;
                    return hostnameRegex.test(value);
                }
            )
            .max(63, 'Hostname must be less than 63 characters'),

        ttl: yup
            .number()
            .required('TTL is required')
            .min(60, 'TTL must be at least 60 seconds')
            .max(86400, 'TTL must be less than 1 day'),
    };

    switch (recordType) {
        case 'A':
            schema.value = yup
                .string()
                .required('IPv4 address is required')
                .matches(ipv4Regex, 'Invalid IPv4 address format (e.g., 192.168.0.1)');
            break;

        case 'AAAA':
            schema.value = yup
                .string()
                .required('IPv6 address is required')
                .matches(ipv6Regex, 'Invalid IPv6 address format (e.g., 2001:0db8::1)');
            break;

        case 'CNAME':
            schema.value = yup
                .string()
                .required('Target domain is required')
                .matches(domainRegex, 'Invalid domain format (e.g., example.com)');
            break;

        case 'MX':
            schema.value = yup
                .string()
                .required('Mail server is required')
                .matches(domainRegex, 'Invalid mail server domain');
            schema.priority = yup
                .number()
                .required('Priority is required')
                .min(0, 'Priority must be 0 or greater')
                .max(65535, 'Priority must be less than 65536');
            break;

        case 'TXT':
            schema.value = yup
                .string()
                .required('Text value is required')
                .max(255, 'TXT record must be less than 255 characters');
            break;

        case 'NS':
            schema.value = yup
                .string()
                .required('Nameserver is required')
                .matches(domainRegex, 'Invalid nameserver domain');
            break;

        case 'CAA':
            schema.flags = yup
                .number()
                .required('Flags are required')
                .min(0, 'Flags must be 0 or greater')
                .max(255, 'Flags must be less than 256');
            schema.tag = yup
                .string()
                .required('Tag is required')
                .oneOf(['issue', 'issuewild', 'iodef'], 'Invalid CAA tag');
            schema.value = yup
                .string()
                .required('CA domain is required');
            break;

        case 'SRV':
            schema.priority = yup
                .number()
                .required('Priority is required')
                .min(0, 'Priority must be 0 or greater');
            schema.weight = yup
                .number()
                .required('Weight is required')
                .min(0, 'Weight must be 0 or greater');
            schema.port = yup
                .number()
                .required('Port is required')
                .min(1, 'Port must be 1 or greater')
                .max(65535, 'Port must be less than 65536');
            schema.value = yup
                .string()
                .required('Target is required')
                .matches(domainRegex, 'Invalid target domain');
            break;

        case 'HTTPS':
            schema.port = yup
                .string()
                .required('Port is required');
            schema.scheme = yup
                .string()
                .required('Scheme is required');
            schema.value = yup
                .string()
                .required('Hostname is required')
                .matches(domainRegex, 'Invalid hostname');
            schema.parameters = yup
                .string();
            break;

        case 'SOA':
            schema.primary = yup
                .string()
                .required('Primary nameserver is required')
                .matches(domainRegex, 'Invalid primary nameserver domain');
            schema.admin = yup
                .string()
                .required('Admin nameserver is required')
                .matches(domainRegex, 'Invalid admin nameserver domain');
            schema.serial = yup
                .number()
                .required('Serial is required');
            schema.refresh = yup
                .number()
                .required('Refresh is required');
            schema.retry = yup
                .number()
                .required('Retry is required');
            schema.expire = yup
                .number()
                .required('Expire is required');
            schema.minimum = yup
                .number()
                .required('Minimum is required');
            break;

        default:
            schema.value = yup
                .string()
                .required('Value is required');
    }

    return yup.object().shape(schema);
}


/**
 * Validate single fields 
 */
export const validateField = async (recordType, fieldName, value, allValues) => {
    try {
        const schema = createDnsRecordSchema(recordType);
        await schema.validateAt(fieldName, { ...allValues, [fieldName]: value })
        return null;
    } catch (error) {
        return error.message;
    }
}


/**
 * Validate entire fields
 */
export const validateRecord = async (record) => {
    try {
        const schema = createDnsRecordSchema(record.type);
        await schema.validate(record, { abortEarly: false });
        return {}; // No errors
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => {
            errors[err.path] = err.message;
        });
        return errors;
    }
};

export const removeTrailingDot = (name) => {
    if (!name) return name;
    return name.replace(/\.+$/, '');
};