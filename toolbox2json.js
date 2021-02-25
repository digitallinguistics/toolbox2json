import createSpinner from 'ora';

export default function toolbox2json() {

  const spinner = createSpinner(`Converting Toolbox file.`);

  spinner.start();
  spinner.succeed(`Toolbox file converted.`);

  return ``;

}
