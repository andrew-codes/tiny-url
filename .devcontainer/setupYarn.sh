
corepack enable
corepack use yarn

yarn
cypressVersion=$(cat package.json | jq '.devDependencies.cypress'| tr -d '"')
yarn dlx cypress@${cypressVersion} install || true
