'use server';

/**
 * @fileOverview Generates a personalized description for a user's Eco-Profile,
 * highlighting their contributions and impact with location-specific and timely information.
 *
 * - generateEcoProfileDescription - A function that handles the generation of the Eco-Profile description.
 * - GenerateEcoProfileDescriptionInput - The input type for the generateEcoProfileDescription function.
 * - GenerateEcoProfileDescriptionOutput - The return type for the generateEcoProfileDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEcoProfileDescriptionInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  country: z.string().describe('The country of the user.'),
  ecoPoints: z.number().describe('The number of eco points the user has.'),
  badges: z.array(z.string()).describe('The badges the user has earned.'),
  contributions: z.string().describe('A summary of the user\'s contributions to sustainability efforts.'),
});
export type GenerateEcoProfileDescriptionInput = z.infer<typeof GenerateEcoProfileDescriptionInputSchema>;

const GenerateEcoProfileDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated Eco-Profile description.'),
});
export type GenerateEcoProfileDescriptionOutput = z.infer<typeof GenerateEcoProfileDescriptionOutputSchema>;

export async function generateEcoProfileDescription(
  input: GenerateEcoProfileDescriptionInput
): Promise<GenerateEcoProfileDescriptionOutput> {
  return generateEcoProfileDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEcoProfileDescriptionPrompt',
  input: {schema: GenerateEcoProfileDescriptionInputSchema},
  output: {schema: GenerateEcoProfileDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in creating engaging and personalized Eco-Profile descriptions for users of a sustainability app.

  Given the following information about the user, generate a short and compelling description for their profile.
  Include location-specific and timely information to make the description more engaging. Keep it to under 100 words.

  User Name: {{{userName}}}
  Country: {{{country}}}
  EcoPoints: {{{ecoPoints}}}
  Badges: {{#each badges}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Contributions: {{{contributions}}}

  Example:
  "Meet [User Name], a sustainability champion from [Country]! With [EcoPoints] EcoPoints and badges like [Badges], they're making a real difference. [He/She/They] have significantly contributed to [contributions]. Join [him/her/them] in creating a greener future!"
  `,
});

const generateEcoProfileDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEcoProfileDescriptionFlow',
    inputSchema: GenerateEcoProfileDescriptionInputSchema,
    outputSchema: GenerateEcoProfileDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
