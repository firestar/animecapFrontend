// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  animecap_api : window.location.hostname=="animecap.com"?"api.animecap.com":"localhost:8080",
  animecap_remote : window.location.hostname=="animecap.com"?"rmt.animecap.com":"localhost:8081",
  animecap_group : window.location.hostname=="animecap.com"?"grp.animecap.com":"localhost:8082"
}
console.log(environment.animecap_api)
