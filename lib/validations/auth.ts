import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

export const authSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password is required and must be at least 6 characters long.'),
});

export type AuthFormValues = z.infer<typeof authSchema>;
export const authResolver = zodResolver(authSchema);
