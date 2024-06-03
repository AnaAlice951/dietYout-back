import z from 'zod';

export const SignInCredentialsSchema = z.object({
  email: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .email({
      message: 'Email inválido',
    }),

  password: z.string({
    required_error: 'Campo obrigatório',
  }),
});

export type SignInCredentials = z.infer<typeof SignInCredentialsSchema>;
