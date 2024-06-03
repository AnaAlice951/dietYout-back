import { Router } from 'express';
import { v4 } from 'uuid';

import { User } from '../database/schemas/User';
import { supabaseClient } from '../database/client';
import {
  SignUpCredentials,
  SignUpCredentialsSchema,
} from '../database/schemas/SignUpCredentials';
import { UpdateUser, UpdateUserSchema } from '../database/schemas/UpdateUser';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabaseClient.from('students').select();

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json(data);
});

router.post('/', async (req, res) => {
  const credentials: SignUpCredentials = req.body;

  const validation = await SignUpCredentialsSchema.safeParseAsync(credentials);

  if (validation.error) {
    return res.status(400).json(validation.error.errors);
  }

  const user: User = {
    ...credentials,
    created_at: new Date().toISOString(),
    id: v4(),
  };

  const { error } = await supabaseClient.from('students').insert(user);

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(201).json(user);
});

router.put('/:id', async (req, res) => {
  const updateData: UpdateUser = req.body;
  const { id } = req.params as { id: string };

  const validation = await UpdateUserSchema.safeParseAsync(updateData);

  if (validation.error) {
    return res.status(400).json(validation.error.errors);
  }

  const { error: searchUserError, status } = await supabaseClient
    .from('students')
    .select('*')
    .eq('id', id);

  if (searchUserError && status === 404) {
    return res.status(404).send({
      message: 'Usuário não encontrado',
    });
  }

  if (searchUserError) {
    return res.status(500).json(searchUserError);
  }

  const { data, error } = await supabaseClient
    .from('students')
    .update(updateData)
    .eq('id', id)
    .order('id', { ascending: false })
    .select()
    .limit(1)
    .single();

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json(data);
});

export default router;
