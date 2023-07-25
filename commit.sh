#!/bin/sh
npm run build
rm -Rf docs
mv build docs
cp .well-known docs/. -R
cp _config.yml docs/.
cp CNAME docs/.
git add *
TEXT="New post"
if [ $# -gt 0 ]
then
    TEXT=$1
fi
git commit -m "$TEXT"
git push origin master