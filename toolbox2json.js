import createSpinner from 'ora';

export default function toolbox2json(filePath) {

  if (!filePath) {
    throw new TypeError(`Please provide a <filePath> argument containing the path to the Toolbox file.`);
  }

  const spinner = createSpinner(`Converting Toolbox file.`);

  spinner.start();
  spinner.succeed(`Toolbox file converted.`);

  return ``;

}
