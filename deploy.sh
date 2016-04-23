#!/bin/sh
jekyll build --config _config.yml,_config.prod.yml && chmod -cR +r _site && rm -vr /sites/chillidonut/assets/ && cp -r _site/* /sites/chillidonut/ -v
