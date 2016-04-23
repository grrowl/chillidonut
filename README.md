# chillidonut.com

welcome to the public repository of my portfolio/site

## code

It's been variously prodded at over the past couple of years. Compatible to
IE 9, maybe earlier. Powered by jQuery, built by Jekyll.

## build

Built with jekyll, so generating a fresh version is as easy as: `jekyll build`

Install dependencies with `bundle && npm install`, requires ruby 2.2+

## css slideshow notes:

```
4 slides @ 5 seconds each = 20s duration

base:  0s  --> in 0-1, out 5-6, nothing -20

0s  0%    0
1s  5%    1
5s  25%   1
6s  30%   0
20s 100%  0
```

If there's not enough slides, it'll "hang" on the first slide (which never fades)
before repeating

## license

MIT. Learn what you can, reuse and improve upon it.
