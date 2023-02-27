# chillidonut.com

welcome to the public repository of my portfolio/site

## code

It's been variously prodded at over the past couple of years. Compatible to
IE 9, maybe earlier. Powered by jQuery, built by ~Jekyll~ hugo.

## build

`git submodule init && git submodule update`

Install hugo, run hugo, get website.

`hugo && hugo deploy`

## videos

converted to mp4 with ffmpeg:

`ffmpeg -i fmf15-2.mov -vcodec h264 -vf fps=24,scale=1280:-1 future-video.mp4`

if you get a complaint about "height not divisible by 2":

`ffmpeg -i fmf15-2.mov -vcodec h264 -vf fps=24,scale=1280:-1,crop=in_w:in_h-1 future-video.mp4`

and increase the `in_h-1` til it works

## license

MIT. Learn what you can, reuse and improve upon it.
