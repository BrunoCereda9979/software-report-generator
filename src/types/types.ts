interface Item {
  id: number;
  name: string;
}

interface Division {
  id: number;
  name: string;
}

interface NewDivision {
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface NewDepartment {
  name: string;
}

interface Vendor {
  id: number;
  name: string;
}

interface NewVendor {
  name: string;
}

interface ContactPerson {
  id: number;
  contact_name: string;
  contact_lastname: string;
  contact_email?: string;
  contact_phone_number?: number;
  public_id: string
}

interface NewContactPerson {
  contact_name: string;
  contact_lastname: string;
  contact_email?: string;
  contact_phone_number: number | null | undefined;
}

interface GlAccount {
  id: number;
  name: string;
}

interface NewGlAccount {
  name: string;
}

interface SoftwareToOperate {
  id: number;
  name: string;
}

interface NewSoftwareToOperate {
  name: string;
}

interface HardwareToOperate {
  id: number;
  name: string;
}

interface NewHardwareToOperate {
  name: string;
}

// Main interfaces
interface Software {
  id: number;
  software_name: string;
  software_description: string;
  software_department: Department[];
  software_version?: string;
  software_years_of_use?: number;
  software_last_updated: string; // ISO string
  software_expiration_date: string;
  software_is_hosted: string;
  software_is_tech_supported: string;
  software_is_cloud_based?: string;
  software_maintenance_support: string;
  software_vendor: Vendor[];
  software_department_contact_people: ContactPerson[];
  software_divisions_using: Division[];
  software_comments?: string;
  software_number_of_licenses: number;
  software_to_operate: SoftwareToOperate[];
  hardware_to_operate: HardwareToOperate[];
  software_gl_accounts: GlAccount[];
  software_operational_status: string;
  software_annual_amount?: number;
}

interface NewSoftware {
  software_name: string;
  software_description: string;
  software_department: Item[];
  software_version?: string;
  software_years_of_use?: number;
  software_last_updated?: string; // ISO date string
  software_expiration_date?: string | null;
  software_is_hosted: string;
  software_is_tech_supported: string;
  software_is_cloud_based?: string;
  software_maintenance_support: string;
  software_vendor: Item[];
  software_department_contact_people: ContactPerson[];
  software_divisions_using: Item[];
  software_comments?: string;
  software_number_of_licenses: number;
  software_to_operate: Item[];
  hardware_to_operate: Item[];
  software_gl_accounts: Item[];
  software_operational_status: string;
  software_annual_amount?: number;
}

interface Comment {
  id: number;
  user_id: number;
  user_name: string,
  software_id: number;
  content: string;
  satisfaction_rate: number
  created_at: string;
  updated_at: string;
}

interface CommentToAdd {
  user_id: number;
  user_name: string,
  software_id: number | undefined;
  content: string;
  satisfaction_rate: number
  created_at: string;
  updated_at: string;
}

interface CommentUpdate {
  content?: string;
}

// Error interface
interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Type for API Response
interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
}

export type {
  Department,
  NewDepartment,
  Vendor,
  ContactPerson,
  Division,
  GlAccount,
  SoftwareToOperate,
  NewSoftwareToOperate,
  HardwareToOperate,
  NewHardwareToOperate,
  Software,
  NewSoftware,
  NewContactPerson,
  Comment,
  CommentToAdd,
  CommentUpdate,
  ApiError,
  ApiResponse,
  Item
};

