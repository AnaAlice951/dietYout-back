import { Router } from 'express';
import { supabaseClient } from '../database/client';

const router = Router();

router.get('', async (req, res) => {
  const { data: recipesData, error: recipesError } = await supabaseClient
    .from('recipes')
    .select('name, ingredients, steps')

  if (recipesError) {
    return res.status(500).json({ error: 'Error fetching recipes' });
  }
  return res.status(200).json(recipesData);
});

export default router;
