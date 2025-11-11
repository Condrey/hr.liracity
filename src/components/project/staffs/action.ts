"use server";

import { validateRequest } from "@/auth";
import { Role } from "@/generated/prisma";
import { myPrivileges } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { departmentDataInclude, employeeDataInclude } from "@/lib/types";
import {
  appointmentSchema,
  AppointmentSchema,
  employeeSchema,
  EmployeeSchema,
  employeeStatusSchema,
  EmployeeStatusSchema,
  userSchema,
  UserSchema,
  workInformationSchema,
  WorkInformationSchema,
} from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { cache } from "react";

async function allDepartments() {
  return await prisma.departMent.findMany({
    include: departmentDataInclude,
    orderBy: { name: "asc" },
  });
}
export const getAllDepartments = cache(allDepartments);

export async function upsertStaffEmployee(input: EmployeeSchema) {
  const { user: currentUser } = await validateRequest();
  const isAuthorized =
    !!currentUser && myPrivileges[currentUser.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw Error("Unauthorized!");
  const {
    appointments,
    employeeStatuses,
    personalInformation: {
      id: userId,
      name,
      bio,
      email,
      gender,
      telephone,
      username,
    },
    workInformation: {
      ippsNumber,
      assumedOffice,
      dob,
      fileNumber,
      nationalIdNumber,
      position,
      shortMessageToPublic,
      supplierNumber,
      taxIdentificationNumber,
    },
    id: employeeId,
  } = employeeSchema.parse(input);
  const existingEmployee = await prisma.employee.findFirst({
    where: { ippsNumber: `${ippsNumber}` },
    include: { user: true, departMentalSector: true },
  });
  if (existingEmployee && !employeeId) {
    return `IPPS number already belongs to ${existingEmployee.user.name} in ${existingEmployee.departMentalSector?.name}`;
  }
  return await prisma.$transaction(
    async (tx) => {
      const passwordHash = await hash("Abc@@@123", {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const employee = await tx.employee.upsert({
        where: { id: employeeId },
        create: {
          assumedOffice: assumedOffice!,
          ippsNumber: `${ippsNumber}`,
          dob,
          endedOffice: null,
          fileNumber,
          nationalIdNumber,
          supplierNumber,
          shortMessageToPublic,
          taxIdentificationNumber,
          user: {
            connectOrCreate: {
              where: { id: userId },
              create: {
                name,
                passwordHash,
                role: Role.STAFF,
                bio,
                email,
                gender,
                telephone,
                username,
              },
            },
          },
          position: {
            connect: {
              id: position?.id!,
            },
          },
        },
        update: {},
        include: employeeDataInclude,
      });
      return employee;
    },
    { maxWait: 60000, timeout: 60000 }
  );
}

export async function deleteEmployee(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  return await prisma.employee.delete({
    where: { id },
    include: employeeDataInclude,
  });
}

export async function upsertStaffPersonalInformation(input: UserSchema) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  const { name, avatarUrl, bio, email, gender, id, telephone, username } =
    userSchema.parse(input);
  return await prisma.user.upsert({
    where: { id },
    create: { name, avatarUrl, bio, email, gender, telephone, username },
    update: { name, avatarUrl, bio, email, gender, telephone, username },
  });
}

export async function updateStaffWorkInformation(input: WorkInformationSchema) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  const {
    dob,
    ippsNumber,
    assumedOffice,
    fileNumber,
    id,
    nationalIdNumber,
    position,
    shortMessageToPublic,
    supplierNumber,
    taxIdentificationNumber,
  } = workInformationSchema.parse(input);
  return await prisma.employee.update({
    where: { id },
    data: {
      dob,
      ippsNumber: `${ippsNumber}`,
      assumedOffice: assumedOffice!,
      fileNumber,
      id,
      nationalIdNumber,
      shortMessageToPublic,
      supplierNumber,
      taxIdentificationNumber,
      positionId: position?.id!,
    },
    include: { user: true },
  });
}

export async function upsertStaffAppointment({
  input,
  employeeId,
}: {
  input: AppointmentSchema;
  employeeId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  const {
    appointmentType,
    dateOfAppointment,
    dateOfAssumptionOfDuty,
    dutyStation,
    minuteNumber,
    number,
    organization,
    basicSalary,
    id,
    position,
  } = appointmentSchema.parse(input);
  return await prisma.appointment.upsert({
    where: { id },
    create: {
      appointmentType,
      dateOfAppointment,
      dateOfAssumptionOfDuty,
      dutyStation,
      minuteNumber,
      number,
      organization,
      basicSalary,
      positionId: position?.id!,
      employeeId,
    },
    update: {
      appointmentType,
      dateOfAppointment,
      dateOfAssumptionOfDuty,
      dutyStation,
      minuteNumber,
      number,
      organization,
      basicSalary,
      positionId: position?.id!,
      // employeeId,
    },
  });
}

export async function deleteStaffAppointment(appointmentId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  await prisma.appointment.delete({ where: { id: appointmentId } });
}

export async function upsertStaffStatus({
  input,
}: {
  input: EmployeeStatusSchema;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  const { id, date, employeeId, statusType, minuteNumber, reason } =
    employeeStatusSchema.parse(input);
  return await prisma.employeeStatus.upsert({
    where: { id },
    create: {
      date,
      statusType,
      reason,
      minuteNumber,
      employeeId,
    },
    update: {
      date,
      statusType,
      reason,
      minuteNumber,
      employeeId,
    },
  });
}

export async function deleteStaffStatus(employeeStatusId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  await prisma.employeeStatus.delete({ where: { id: employeeStatusId } });
}

async function allStaffs() {
  return await prisma.employee.findMany({
    orderBy: { user: { name: "asc" } },
    include: employeeDataInclude,
  });
}

async function staffById(id: string) {
  return await prisma.employee.findUnique({
    where: { id },
    include: employeeDataInclude,
  });
}

export const getAllStaffs = cache(allStaffs);
export const getStaffById = cache(staffById);
