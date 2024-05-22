import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';



export async function isUserExist(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        // select: { email: true, password: true, role: true },
    });
}


export async function isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
}