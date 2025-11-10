"use server";

import { validateRequest } from "@/auth";
import { Role } from "@/generated/prisma";
import { myPrivileges } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { departmentDataInclude, employeeDataInclude } from "@/lib/types";
import { departmentSchema, DepartmentSchema } from "@/lib/validation";
import { cache } from "react";

async function departmentAndEmployeesByDepartmentId(id: string) {
  const [department, staffs] = await Promise.all([
    await prisma.departMent.findUnique({
      where: { id },
      include: departmentDataInclude,
    }),
    await prisma.employee.findMany({
      where: { departMentalSector: { departMentId: id } },
      orderBy: { user: { name: "asc" } },
      include: employeeDataInclude,
    }),
  ]);
  return { department, staffs };
}

export const getDepartmentAndEmployeesByDepartmentId = cache(
  departmentAndEmployeesByDepartmentId
);

async function allDepartments() {
  return await prisma.departMent.findMany();
}

const getAllDepartments = cache(allDepartments);

export async function upsertDepartment(formData: DepartmentSchema) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Forbidden!");

  const { name, headOfDepartmentId, about, id } =
    departmentSchema.parse(formData);
  const data = await prisma.departMent.upsert({
    where: { id },
    create: {
      name,
      about,
      headOfDepartmentId,
    },
    update: { name, about, headOfDepartmentId },
    include: departmentDataInclude,
  });
  return data;
}

export async function deleteDepartment(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized!");
  const isAuthorized = myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) throw new Error("Unauthorized!");
  return await prisma.departMent.delete({
    where: { id },
    include: departmentDataInclude,
  });
}
