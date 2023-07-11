import { getProjects } from '../../api';

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();

  return projects
    .map(
      (repo) =>
        `<a class="text-light-blue dark:text-dark-blue underline" href="${repo.link}" target="_blank">${repo.name}</a> - <span class="text-[${repo.color}]">${repo.description}</span>`,
    )
    .join('\n');
};
