import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { supabaseClient } from '../database/client';
import {
  SignInCredentials,
  SignInCredentialsSchema,
} from '../database/schemas/SignInCredentials';

const router = Router();

router.post('/signin', async (req, res) => {
  const credentials: SignInCredentials = req.body;

  const validation = await SignInCredentialsSchema.safeParseAsync(credentials);

  if (validation.error) {
    return res.status(400).json(validation.error.message);
  }

  const { data, error, status } = await supabaseClient
    .from('students')
    .select('*')
    .eq('email', credentials.email)
    .limit(1)
    .single();

  if (error && status === 404) {
    return res.status(404).send({
      message: 'Usuário não encontrado',
    });
  }

  if (error) {
    return res.status(500).json(error);
  }

  if (data && data.password !== credentials.password) {
    return res.status(400).json({
      error: 'Senha incorreta',
    });
  }

  const token = jwt.sign(
    { data, password: undefined },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    }
  );

  return res.json({
    token,
  });
});

router.post('/me', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return res.json(decoded);
  } catch (err) {
    return res.status(401).send();
  }
});

router.get('/training', async (req, res) => {
  const { students_id, day } = req.query;

  const validDays = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];

  if (!students_id) {
    return res.status(400).json({
      error: 'O parâmetro "students_id" é obrigatório.',
    });
  }

  if (day && !validDays.includes(day as string)) {
    return res.status(400).json({
      error:
        'O parâmetro "day" deve ser um dia da semana válido em inglês (e.g., "monday").',
    });
  }

  let query = supabaseClient
    .from('training')
    .select('*')
    .eq('students_id', students_id);

  if (day) {
    query = query.eq('day', day);
  }

  const { data, error, status } = await query;

  if (error && status === 404) {
    return res.status(404).send({
      message: 'Error',
    });
  }

  if (error) {
    return res.status(500).json(error);
  }

  return res.json(data);
});

export default router;
