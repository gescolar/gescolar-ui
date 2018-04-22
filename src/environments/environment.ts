// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  fotoAlunoDefault: 'https://s3-sa-east-1.amazonaws.com/gescolar/232f56b8-0a40-41a4-a712-2733fa80fcf8_.jpg',
  fotoProfessor: 'https://s3-sa-east-1.amazonaws.com/gescolar/c55f57dd-ee54-41f1-9024-2128d1913b39_.jpg'
};
