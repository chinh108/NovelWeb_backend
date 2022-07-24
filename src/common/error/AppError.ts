import { HttpStatus } from "@nestjs/common";

export const AppError: (error: any) => [string, number] = (error: any) => [error.response ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR]