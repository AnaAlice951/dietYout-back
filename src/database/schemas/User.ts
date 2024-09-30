import z from 'zod';

export const UserSchema = z.object({
  id: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .uuid({
      message: 'O campo precisa ser um UUID',
    }),
  email: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .email({
      message: 'Email inválido',
    }),
  created_at: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .datetime({
      message: 'A data precisa estar no formato ISO',
    }),
  password: z.string({
    required_error: 'Campo obrigatório',
  }),
  name: z.string({
    required_error: 'Campo obrigatório',
  }),
});

export type User = z.infer<typeof UserSchema>;
