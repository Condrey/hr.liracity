import {
  AppointmentType,
  EventStatus,
  NewsArticleStatus,
  StatusType,
} from "@/generated/prisma";
import { z } from "zod";

const requiredString = z
  .string({ error: "This field should have a value" })
  .min(1, "required")
  .trim();

// Signup
export const signUpSchema = z.object({
  email: z
    .email()
    .min(1, "Please an email is required")
    .describe("Email for signing up"),
  username: requiredString
    .min(1, "You need a username")
    .describe("User username for the user.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
  password: requiredString
    .min(8, "Password must be at least 8 characters")
    .describe("Password for the user."),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

// Login
export const loginSchema = z.object({
  username: requiredString.min(
    1,
    "Please input your username or email that you registered with."
  ),
  password: requiredString
    .min(1, "Password is required to login")
    .describe("Password that you registered with."),
});
export type LoginValues = z.infer<typeof loginSchema>;
export const staffLoginSchema = z.object({
  ippsNumber: z
    .number()
    .min(1, "Please input your staff assigned IPPS number."),
  password: requiredString
    .min(1, "Password is required to login")
    .describe("Password that you registered with."),
});
export type StaffLoginValues = z.infer<typeof staffLoginSchema>;

//User
export const userSchema = z.object({
  name: requiredString
    .min(1, "Name must be provided.")
    .transform((val) =>
      val.trim().replace(/\b\w/g, (char) => char.toUpperCase())
    ),
  id: z.string().optional(),
  username: z.string().optional().nullable(),
  email: z.email().optional().nullable(),
  telephone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+\d{1,3}\d{7,14}$/.test(val), {
      message:
        "Telephone number must start with a '+' followed by country code and number.",
    }),
  gender: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});
export type UserSchema = z.infer<typeof userSchema>;

export const verifyUserSchema = z.object({
  name: requiredString
    .min(1, "Name must be provided.")
    .transform((val) =>
      val.trim().replace(/\b\w/g, (char) => char.toUpperCase())
    ),
  id: requiredString.min(1, "User id is missing"),
  username: requiredString
    .min(1, "Please add a user name")
    .describe("User username for the user.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
  email: z.email().min(1, "A working email is required"),
  telephone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\+\d{1,3}\d{7,14}$/.test(val), {
      message:
        "Telephone number must start with a '+' followed by country code and number.",
    }),
  password: requiredString
    .min(8, "Password must be at least 8 characters")
    .describe("Password for the user."),
});
export type VerifyUserSchema = z.infer<typeof verifyUserSchema>;

// string array schema

export const stringArraySchema = z.object({
  id: z.string().optional().describe("this should be a random uuid() number"),
  value: z.string(),
});
export type StringArraySchema = z.infer<typeof stringArraySchema>;

// position
export const positionSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  departmentalMandate: z
    .string()
    .min(10, "Departmental mandate must be at least 10 characters"),
  reportsToId: z.string().optional(),
  salaryScale: z.string().min(1, "Salary scale is required"),
  duties: z.array(stringArraySchema),
});
export type PositionSchema = z.infer<typeof positionSchema>;

//Work information
export const workInformationSchema = z.object({
  id: z.string().optional(),
  assumedOffice: z
    .number({
      error: "Please enter year staff assumed office.",
    })
    .optional(),
  position: positionSchema.optional(),
  shortMessageToPublic: z.string().optional().nullable(),
  dob: z
    .date()
    .nullable()
    .transform((d) =>
      d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000) : null
    ), // Convert to UTC/ Convert to UTC
  nationalIdNumber: z.string().optional().nullable(),
  fileNumber: z.string().optional().nullable(),
  taxIdentificationNumber: z.string().optional().nullable(),
  supplierNumber: z.string().optional().nullable(),
  ippsNumber: z.number({ error: "IPPS number is a must" }),
});
export type WorkInformationSchema = z.infer<typeof workInformationSchema>;

// Employee
export const employeeStatusSchema = z.object({
  id: z.string().optional(),
  statusType: z.enum(StatusType, { error: "You need to choose a type" }),
  date: z
    .date({ error: "Please select occurrence date" })
    .transform((d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000)), // Convert to UTC
  minuteNumber: requiredString.optional().nullable(),
  reason: z.string().optional().nullable(),
  employeeId: requiredString,
});
export type EmployeeStatusSchema = z.infer<typeof employeeStatusSchema>;

export const appointmentSchema = z.object({
  id: z.string().optional(),
  number: z.number({ error: "Please enter a valid number" }),
  position: positionSchema.optional(),
  basicSalary: z.number().optional().nullable(),
  organization: requiredString,
  dateOfAppointment: z
    .date({ error: "Please select appointment date" })
    .transform((d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000)), // Convert to UTC
  dateOfAssumptionOfDuty: z
    .date({ error: "Select date of assumption of duty" })
    .transform((d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000)), // Convert to UTC
  dutyStation: z
    .string({ error: "A duty station is a must" })
    .min(1, "A duty station is a must"),
  minuteNumber: requiredString,
  appointmentType: z.enum(AppointmentType, { error: "Please choose a type" }),
});
export type AppointmentSchema = z.infer<typeof appointmentSchema>;

export const employeeSchema = z.object({
  id: z.string().optional(),
  personalInformation: userSchema,
  workInformation: workInformationSchema,
  employeeStatuses: z.array(employeeStatusSchema),
  appointments: z.array(appointmentSchema),
});
export type EmployeeSchema = z.infer<typeof employeeSchema>;

// NewsLetter
export const newsLetterSubscriptionSchema = z.object({
  email: z.email().min(1, "An email is required."),
  name: requiredString.min(1, "Please enter your full name"),
});
export type NewsLetterSubscriptionSchema = z.infer<
  typeof newsLetterSubscriptionSchema
>;
export const newsLetterSchema = z.object({
  name: requiredString,
  email: z.email(),
});
export type NewsLetterSchema = z.infer<typeof newsLetterSchema>;

// Department
export const departmentSchema = z.object({
  id: z.string().optional(),
  name: requiredString
    .min(1, "Department name is missing")
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1)),
  about: z.string().max(350, "Write within 350 characters").optional(),
  headOfDepartmentId: z.string().optional(),
});
export type DepartmentSchema = z.infer<typeof departmentSchema>;

// Departmental sector
export const departmentalSectorSchema = z.object({
  id: z.string().optional(),
  name: requiredString
    .min(1, "Departmental Sector name is missing")
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1)),
  description: z.string().max(350, "Write within 350 characters").optional(),
  hierarchy: z.number(),
  departMentId: requiredString.min(1, "Please choose a department"),
});
export type DepartmentalSectorSchema = z.infer<typeof departmentalSectorSchema>;

// Tag
export const tagSchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Please provide a category"),
});
export type TagSchema = z.infer<typeof tagSchema>;

// News article
export const newsArticleSchema = z.object({
  id: z.string().optional(),
  title: requiredString.min(1, "Please add a title"),
  slug: z.string().optional(),
  coverImageId: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  publishedAt: z
    .date()
    .optional()
    .nullable()
    .transform((d) =>
      d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000) : null
    ), // Convert to UTC
  status: z.enum(NewsArticleStatus),
  content: requiredString,
  authorId: requiredString,
  categoryId: requiredString,
  tags: z.array(tagSchema).optional(),
  location: z.string().trim().optional().nullable(),
});
export type NewsArticleSchema = z.infer<typeof newsArticleSchema>;

// News article category
export const newsArticleCategorySchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Please provide a category"),
});
export type NewsArticleCategorySchema = z.infer<
  typeof newsArticleCategorySchema
>;

// Event
export const eventSchema = z.object({
  id: z.string().optional(),
  title: requiredString.min(1, "Please add a title"),
  slug: z.string().optional(),
  coverImageId: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  status: z.enum(EventStatus),
  description: requiredString,
  authorId: requiredString,
  categoryId: requiredString,
  location: requiredString,
  startDate: z
    .date()
    .transform((d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000)), // Convert to UTC

  endDate: z
    .date()
    .optional()
    .nullable()
    .transform((d) =>
      d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000) : null
    ), // Convert to UTC
});
export type EventSchema = z.infer<typeof eventSchema>;

// Event  category
export const eventCategorySchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Please provide a category"),
});
export type EventCategorySchema = z.infer<typeof eventCategorySchema>;

// miscellaneous
export const emailSchema = z.object({ email: z.email().trim() });
export type EmailSchema = z.infer<typeof emailSchema>;

export const singleContentSchema = z.object({ singleContent: requiredString });
export type SingleContentSchema = z.infer<typeof singleContentSchema>;
