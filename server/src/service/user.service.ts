import { omit } from "lodash";
import { PrismaClient, User } from "../generated";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function comparePassword(
  newPassword: string,
  oldPassword: string
) {
  try {
    const isValid = await bcrypt.compare(newPassword, oldPassword);
    if (!isValid) throw new Error("Incorrect password!");
    return isValid;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createUser(input: User) {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  try {
    // check if user exists
    const isExists = await findUserByEmail(input.email);

    if (isExists) throw new Error("User already exists!");

    const newUser = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        username: input.username || input.email.split("@")[0],
        image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${
          input.username || input.email.split("@")[0]
        }`,
      },
    });

    return newUser;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (e: any) {
    throw new Error(e);
  }
}
export async function createSession(body: { email: string; password: string }) {
  try {
    const user = await findUserByEmail(body.email);
    if (!user) throw new Error("User not found!");
    if (!body.password) throw new Error("Please enter password!");
    const isMatch = await comparePassword(body.password, user.password);
    if (!isMatch) throw new Error("Invalid password entered.");

    return user;
  } catch (e: any) {
    // console.log(e.message);
    throw new Error(e);
  }
}

export async function getAllUsers() {
  try {
    const users = prisma.user.findMany();
    return users;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function updateUserCredential(
  userId: string | undefined,
  body: {
    email?: string;
    username?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    currentPassword?: string;
  }
) {
  try {
    if (!userId) throw new Error("User ID is required.");
    const user = await getUserById(userId);

    if (!user) throw new Error("User not found.");
    const updatedData: any = {};

    if (body.email) {
      if (!body.currentPassword)
        throw new Error("Current password is required to update an Email.");

      const isMatched = await comparePassword(
        body.currentPassword,
        user.password
      );

      if (!isMatched) throw new Error("Current password is incorrect.");
      updatedData.email = body.email.trim().toLowerCase();
    }
    if (body.username) {
      if (!body.currentPassword) throw new Error("New username is required.");
      const isMatched = await comparePassword(
        body.currentPassword,
        user.password
      );
      if (!isMatched) throw new Error("Current password is incorrect.");
      updatedData.username = body.username.trim().toLowerCase();
    }
    if (body.newPassword) {
      if (!body.currentPassword || !body.confirmNewPassword)
        throw new Error(
          "Current and confirm password is required to update password."
        );

      const isMatched = await comparePassword(
        body.currentPassword,
        user.password
      );
      if (!isMatched) throw new Error("Passwords not matched.");

      if (body.newPassword !== body.confirmNewPassword)
        throw new Error("New passwords do not matched.");
      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      updatedData.password = hashedPassword;
    }

    // Object.keys(updateData) returns an array of all the keys (properties) in the object.
    // .length === 0 checks if the array is empty — meaning, no fields were added to the updateData object.
    // If no fields were added, it means the user didn't actually request any valid update (like no email, no username, no password).
    // So it throws an error to inform the user: "You haven't provided any valid data to update."
    if (Object.keys(updatedData).length === 0)
      throw new Error("No valid fields provided for update.");

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedData,
    });

    return omit(updatedUser, "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function deleteUser(userId: string, currentPassword: string) {
  try {
    const user = await getUserById(userId);
    if (!user) return null;

    const isMatched = await comparePassword(currentPassword, user.password);
    if (!isMatched) throw new Error("Invalid password entered.");

    // Mark user's data as deleted inside DB.
    await prisma.shortUrl.updateMany({
      where: { userId, isDeleted: false },
      data: { isDeleted: true },
    });
    // console.log("urls marked as deleted.");

    // Mark user as deleted inside DB.
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });
    // console.log("user marked as deleted.");
    return deletedUser;
  } catch (e: any) {
    // console.log(e.message);
    throw new Error(e);
  }
}
