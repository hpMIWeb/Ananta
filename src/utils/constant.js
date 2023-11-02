export const HIDE_LAYOUT_ROUTES = ["/login", "/reset-password"];

export const firmTypes = [
    {
        value: "proprietor",
        label: "Proprietor",
    },
    {
        value: "partnership",
        label: "Partnership",
    },
    {
        value: "LLP",
        label: "LLP",
    },
    {
        value: "company",
        label: "Company",
    },
    {
        value: "BOI",
        label: "BOI",
    },
    {
        value: "AOP",
        label: "AOP",
    },
    {
        value: "trust",
        label: "Trust",
    },
    {
        value: "HUF",
        label: "HUF",
    },
    {
        value: "govtLocalAuthority",
        label: "Govt. & Local Authority",
    },
    {
        value: "cooperativeSociety",
        label: "Co-operative Society",
    },
];

export const adminClientTypeOption = [
    { value: "ca", label: "CA" },
    {
        value: "accountant",
        label: "Accountant",
    },
    {
        value: "tax_consultant",
        label: "Tax Consultant",
    },
    {
        value: "business_enterprise",
        label: "Business Enterprise",
    },
];

export const caClientTypeOption = [
    {
        value: "regular",
        label: "Regular",
    },
    {
        value: "non_regular",
        label: "Non Regular",
    },
];

export const ClientType = {
    CA: "ca",
    Accountant: "accountant",
    TaxConsultant: "tax_consultant",
    BusinessEnterprise: "business_enterprise",
};

export const RoleTypes = {
    SuperAdmin: "superadmin",
    CAAdmin: "client",
};
