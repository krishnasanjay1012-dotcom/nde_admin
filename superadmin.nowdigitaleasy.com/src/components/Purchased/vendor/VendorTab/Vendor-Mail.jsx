import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetVendorInfo } from '../../../../hooks/Vendor/Vendor-hooks';
import CommonSendEmail from '../../../common/NDE-CommonSendEmail';


const VendorMail = () => {
    const navigate = useNavigate();
    const { vendorId } = useParams();

    const { data } = useGetVendorInfo(vendorId);
    const vendorList = data?.data || {};

    const userList = vendorList?.recipients || [];
    const vendorName = `${vendorList?.first_name || ''} ${vendorList?.last_name || ''}`.trim();



    const objectToFormData = (obj, formData = new FormData(), parentKey = "") => {
        Object.entries(obj || {}).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (value instanceof File) {
                formData.append(formKey, value);
                return;
            }

            if (Array.isArray(value)) {
                value.forEach((item) => {
                    if (item instanceof File) {
                        formData.append(formKey, item);
                    } else if (typeof item === "object") {
                        formData.append(formKey, JSON.stringify(item));
                    } else {
                        formData.append(formKey, item);
                    }
                });
                return;
            }

            if (typeof value === "object") {
                objectToFormData(value, formData, formKey);
                return;
            }

            formData.append(formKey, value);
        });

        return formData;
    };

    return (
        <Box>
            <CommonSendEmail
                fromEmail={{
                    name: vendorList?.from_emails?.[0]?.username || "",
                    email: vendorList?.from_emails?.[0]?.hostname || "",
                }}
                subject={vendorList?.subject || ""}
                html={vendorList?.body || ""}
                userList={userList}
                vendorName={vendorName}
                extraValues={{
                    vendorId,
                    invoice_name: vendorList?.file_name_without_extension || "",
                    email_config: vendorList?.from_emails?.[0]?._id || "",
                }}
                // isLoading={isPending}
                onSubmit={async (payload) => {
                    try {
                        const formData = objectToFormData(payload);
                        // await mutateAsync(formData);
                        navigate(-1);
                    } catch (error) {
                        console.error("Email send failed:", error);
                    }
                }}
                extraComponents={
                    <>
                        {/* Uncomment when ready */}
                        {/* <AttachCustomerStatement /> */}
                        {/* <AttachInvoice /> */}
                    </>
                }
                // attachmentsComponent={
                //     // <AttachmentUploader />
                // }
                onCancel={() => navigate(-1)}
            />
        </Box>
    );
};

export default VendorMail;