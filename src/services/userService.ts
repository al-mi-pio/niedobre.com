"use server";
import auth from "@/utils/auth";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import { User } from "@/types/User";

export const createUser = async (
  login: string,
  password: string,
  email?: string
): Promise<boolean> => {
  const userId = randomUUID();
  const folderPath = path.join(process.cwd(), "src", "data", "users", login);
  const hashedPassowrd = await auth.hashPassword(password);
  const user: User = {
    id: userId,
    login,
    email,
    password: hashedPassowrd,
  };
  try {
    fs.mkdirSync(folderPath, { recursive: true });
  } catch (error) {
    throw new Error("User with login: " + login + " already exists");
  }
  const filePath = path.join(folderPath, "user.json");
  fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");

  //add session

  return new Promise((resolve) => {
    resolve(true);
  });
};

export const getUser = async (): Promise<User> => {
  const userLogin = "test"; //swap this to login from cookies
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "users",
    userLogin,
    "user.json"
  );
  let data;
  try {
    data = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    throw new Error("Unexpected error");
  }
  const user: User = JSON.parse(data);

  return new Promise((resolve, reject) => {
    //check is session and user is correct, reject if its inwalid
    resolve(user);
  });
};

export const deleteUser = async (): Promise<Boolean> => {
  const userLogin = "test2"; //swap this to user id from cookies
  const folderPath = path.join(
    process.cwd(),
    "src",
    "data",
    "users",
    userLogin
  );
  try {
    fs.rmdirSync(folderPath, { recursive: true });
  } catch (error) {
    throw new Error("Unexpected error");
  }

  return new Promise((resolve) => {
    resolve(true);
  });
};

export const patchUser = async (
  login?: string,
  password?: string,
  email?: string
): Promise<boolean> => {
  const userLogin = "test"; //swap this to login from cookies
  let filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "users",
    userLogin,
    "user.json"
  );

  let user: User = await getUser();

  if (login != undefined) {
    user.login = login;
    const oldFolderPath = path.join("src", "data", "users", userLogin);

    const newFolderPath = path.join(
      process.cwd(),
      "src",
      "data",
      "users",
      login
    );
    const newFilePath = path.join(newFolderPath, "user.json");

    try {
      fs.renameSync(oldFolderPath, newFolderPath);
    } catch (error) {
      throw new Error("User with login: " + login + " already exists");
    }
    filePath = newFilePath;

    //change userLogin in session
  }

  if (password != undefined) {
    const hashedPassowrd = await auth.hashPassword(password);
    user.password = hashedPassowrd;
  }

  if (email != undefined) {
    user.email = email;
  }

  fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");

  return new Promise((resolve) => {
    resolve(true);
  });
};
