import { Router } from 'express';
import { supabaseClient } from '../database/client';

const router = Router();

type RecipeItem = {
  item: string;
  detalhes: string;
};

type Meal = {
  itens: RecipeItem[];
  codigo: number;
  refeicao: string;
};

type Recipe = {
  itens: {
    refeicoes: Meal[];
  };
};

type DietDays = {
  [key: string]: number;
};

interface Result {
  [key: string]: Recipe['itens'] | null;
}

interface FormattedResult {
  [key: string]: {
    refeicoes: Meal[];
  };
}

router.get('/:account_id', async (req, res) => {
  const accountId = req.params.account_id;

  const { data: weekData, error: weekError } = await supabaseClient
    .from('week_days')
    .select('diet_days')
    .eq('account_id', accountId)
    .single();

  if (weekError) {
    return res.status(500).json({ error: 'Error fetching week days' });
  }

  const dietDays = weekData?.diet_days;

  if (!dietDays) {
    return res.status(404).json({ error: 'Diet days not found' });
  }

  const recipeIds = Object.values(dietDays);

  const { data: mealsData, error: mealsError } = await supabaseClient
    .from('meals')
    .select('id, itens')
    .in('id', recipeIds);

  if (mealsError) {
    return res.status(500).json({ error: 'Error fetching meals' });
  }

  let result: Result = {};

  for (const day of Object.keys(dietDays)) {
    const recipeId = dietDays[day];
    const recipe = mealsData.find((r) => r.id === recipeId);

    if (recipe) {
      result[day] = recipe.itens;
    } else {
      result[day] = null;
    }
  }

  const formattedResult: FormattedResult = {}; 
  for (const day in result) {
    formattedResult[day] = {
      refeicoes: result[day] ? result[day].refeicoes : [],
    };
  }

  return res.status(200).json(formattedResult);
});

export default router;
