#!/bin/bash

version=`node -v`
wget https://npm.taobao.org/mirrors/node/$version/node-$version.tar.gz
rm -rf ~/.node-gyp
mkdir ~/.node-gyp
tar -xzvf node-$version.tar.gz -C ~/.node-gyp
cd ~/.node-gyp
echo 9 > node-$version/installVersion
mv node-$version ${version#v}
