cat .vscode/extensions.json | jq -r '.recommendations[]' | xargs -L 1 code  --force --install-extension
