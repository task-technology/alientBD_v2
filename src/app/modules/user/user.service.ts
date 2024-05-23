import { Power, User } from "@prisma/client";
import bcrypt from 'bcrypt';
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { CreateUserInput } from "../Employee/employee.interface";

const insertIntoDB = async (data: CreateUserInput, role: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash('123456', Number(config.bcrypt_salt_rounds));
  const result = await prisma.user.create({
    data: {
      email: data.email,
      role: role,
      password: hashedPassword,
      details: {
        create: {
          email: data.email,
          name: data.name,
          contactNo: data.contactNo,
          designation: data.designation,
          profileImage: data.profileImage,
          role: role,
          powers: {
            connect: data.powerId.map(id => ({ id }))
          }
        },
      },
    },
    include: {
      details: true,
    },
  });
  return result;
};




const createPower = async (name: string): Promise<Power> => {
  const result = await prisma.power.create({
    data: {
      name: name,
    },
  });
  
  return result;
};


export const userService = {
  insertIntoDB,
  createPower
}
