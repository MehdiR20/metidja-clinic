import "server-only";
import { cache } from "react";
import { prisma } from "./prisma";

// Request-scoped memoised reads for public pages

export const getDepartments = cache(() =>
  prisma.department.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
);

export const getDepartmentsWithServices = cache(() =>
  prisma.department.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: { services: { where: { isActive: true }, orderBy: [{ order: "asc" }, { priceDzd: "asc" }] } },
  }),
);

export const getDoctors = cache((departmentSlug?: string) =>
  prisma.doctor.findMany({
    where: { isActive: true, ...(departmentSlug ? { department: { slug: departmentSlug } } : {}) },
    include: { department: true },
    orderBy: [{ department: { order: "asc" } }, { name: "asc" }],
  }),
);

export const getDoctorBySlug = cache((slug: string) =>
  prisma.doctor.findFirst({ where: { slug, isActive: true }, include: { department: true } }),
);
