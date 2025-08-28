'use server';

import {
  generateEcoProfileDescription,
  type GenerateEcoProfileDescriptionInput,
} from '@/ai/flows/generate-eco-profile-description';
import { z } from 'zod';

const FormSchema = z.object({
  userName: z.string().min(1, 'Username is required.'),
  country: z.string().min(1, 'Country is required.'),
  ecoPoints: z.coerce.number().min(0, 'EcoPoints must be a positive number.'),
  badges: z.string().min(1, 'Please list at least one badge.'),
  contributions: z
    .string()
    .min(10, 'Contributions summary must be at least 10 characters.'),
});

type State = {
  description?: string | null;
  error?: string | null;
  fieldErrors?: {
    [key: string]: string[];
  };
};

export async function createDescription(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    userName: formData.get('userName'),
    country: formData.get('country'),
    ecoPoints: formData.get('ecoPoints'),
    badges: formData.get('badges'),
    contributions: formData.get('contributions'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { userName, country, ecoPoints, badges, contributions } = validatedFields.data;

  const input: GenerateEcoProfileDescriptionInput = {
    userName,
    country,
    ecoPoints,
    badges: badges.split(',').map((b) => b.trim()),
    contributions,
  };

  try {
    const result = await generateEcoProfileDescription(input);
    if (result.description) {
      return { description: result.description, error: null };
    } else {
      return {
        description: null,
        error: 'Failed to generate description. The AI returned an empty response.',
      };
    }
  } catch (e: any) {
    console.error(e);
    return {
      description: null,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}
