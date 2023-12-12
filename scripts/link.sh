set -e

CWD=$PWD;


# cli
cd $CWD
P=./packages/noka-cli
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
rm -rf $P/dist/
tsc -p $P/tsconfig.json
copyfiles --up 3 $P/src/**/*.txt $P/dist/
cd $P
pnpm link --global
