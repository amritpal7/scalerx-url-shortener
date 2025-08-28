// utils/pickUserFields.ts
import { User } from "../../generated";

type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt">;

export function pickUserFields(body: any): Partial<UserCreateInput> {
  const allowedFields: (keyof UserCreateInput)[] = [
    "age",
    "gender",
    "phone",
    "birthDate",
    "bloodGroup",
    "height",
    "weight",
    "eyeColor",
    "ip",
    "macAddress",
    "university",
    "company",
    "address",
  ];

  const picked: Partial<UserCreateInput> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      picked[field] = body[field];
    }
  }

  return picked;
}
