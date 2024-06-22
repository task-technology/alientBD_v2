/*
  Warnings:

  - Added the required column `email` to the `userDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userDetails" ADD COLUMN     "email" TEXT NOT NULL;
