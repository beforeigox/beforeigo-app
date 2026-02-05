import { Question, StorytellerRole } from './types';
import masterData from './data/before_i_go_questions_master.json';

export const questions: Question[] = [];

if (masterData?.roles) {
  let questionIdCounter = 1;

  masterData.roles.forEach((roleData: any) => {
    const role = roleData.id as StorytellerRole;

    roleData.categories.forEach((category: any) => {
      const categoryName = category.name;
      const categoryQuote = category.quote;

      category.questions.forEach((q: any) => {
        questions.push({
          id: `q${questionIdCounter}`,
          role: role,
          category: categoryName,
          categoryQuote: categoryQuote,
          question: q.question,
          placeholder: q.placeholder
        });
        questionIdCounter++;
      });
    });
  });
}
