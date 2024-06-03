import { Router } from 'express';
import { supabaseClient } from '../database/client';

const router = Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabaseClient
    .from('exercises')
    .select()
    .eq('id', id)
    .limit(1)
    .single();

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json(data);
});

export default router;
