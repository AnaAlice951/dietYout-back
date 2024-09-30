import { Router } from 'express';
import { supabaseClient } from '../database/client';
const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabaseClient.from('accounts').select();

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json(data);
});


export default router;
