import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmails, createEmail, updateEmail,getAllEmailTemplates,deleteEmail,enableEmail,getBulkMail,getEmailConfig,getEmailCampaignNames,getEmailGroups,sendNewsletter, getEmailTemplateById, updateEmailTemplate, addEmailTemplate } from "../../services/setting/email-service";

// Fetch emails
export const useEmails = () => {
  return useQuery({
    queryKey: ["emails"],
    queryFn: getEmails,
    staleTime: 5 * 60 * 1000,
  });
};

// Create email
export const useCreateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emails"] }),
  });
};

// Update email
export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateEmail(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emails"] }),
  });
};

// Delete email
export const useDeleteEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emails"] }),
  });
};

// 
export const useEnableEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enableEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] }); 
    },
  });
};

//

export const useBulkMail = ({
  filter = "all",
  page = 1,
  limit = 10,
  campaignId = "",
}) => {
    return useQuery({
    queryKey: ["bulkMail", filter, page, limit, campaignId], 
    queryFn: () => getBulkMail({ filter, page, limit, campaignId }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};


export const useEmailConfig = () => {
  return useQuery({
    queryKey: ["emailConfig"],
    queryFn: getEmailConfig,
    staleTime: 5 * 60 * 1000,
  });
};


export const useEmailGroups = () => {
  return useQuery({
    queryKey: ["emailGroups"],
    queryFn: getEmailGroups,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSendNewsletter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendNewsletter,
    onSuccess: () => {
      // Invalidate email-related queries if needed
      queryClient.invalidateQueries({ queryKey: ["emailConfig", "emailGroups"] });
    },
  });
};

// Hook to fetch email campaign names
export const useEmailCampaignNames = () => {
  return useQuery({
    queryKey: ["emailCampaignNames"],
    queryFn: getEmailCampaignNames,
    staleTime: 5 * 60 * 1000, 
  });
};

// Hook to fetch all email templates
export const useAllEmailTemplates = () => {
  return useQuery({
    queryKey: ["emailTemplates"],
    queryFn: getAllEmailTemplates,
    staleTime: 5 * 60 * 1000,
  });
};

export const useEmailTemplateById = (templateId) => {
  return useQuery({
    queryKey: ["emailTemplate", templateId],
    queryFn: () => getEmailTemplateById(templateId),
    enabled: !!templateId,
    staleTime: 5 * 60 * 1000,
  });
};

//  Update email template
export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplate"] });
    },
  });
};

export const useAddEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
    },
  });
};