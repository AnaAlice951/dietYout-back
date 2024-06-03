import z from 'zod';

export const SignUpCredentialsSchema = z.object({
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
  name: z.string({
    required_error: 'Campo obrigatório',
  }),
  age: z.number({
    required_error: 'Campo obrigatório',
    invalid_type_error: 'A idade precisa ser um número',
  }),
  weight: z
    .number({
      invalid_type_error: 'O peso precisa ser um número',
    })
    .nullable(),
  height: z
    .number({
      invalid_type_error: 'A altura precisa ser um número',
    })
    .nullable(),
  goal: z.string().nullable(),
  personal_id: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .uuid({
      message: 'O campo precisa ser um UUID',
    }),
});

export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;
