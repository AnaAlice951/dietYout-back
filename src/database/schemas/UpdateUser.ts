import z from 'zod';

export const UpdateUserSchema = z.object({
  name: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .nullable(),
  age: z
    .number({
      required_error: 'Campo obrigatório',
      invalid_type_error: 'A idade precisa ser um número',
    })
    .nullable(),
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
    })
    .nullable(),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
