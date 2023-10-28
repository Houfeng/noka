set -e

CWD=$PWD;

# cli
cd $CWD
CLI=./packages/noka-cli
echo ------------------------------------------------------
echo PROJECT: $CLI
echo ------------------------------------------------------
rm -rf $CLI/dist/
tsc -p $CLI/tsconfig.json
copyfiles --up 3 $CLI/src/**/*.txt $CLI/dist/
cd $CLI
pnpm link --global
