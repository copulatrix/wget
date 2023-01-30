# @copulatrix/wget

## Purpose
A simple [wget-like](https://www.gnu.org/software/wget/) package to download files.
With built in support for Socks5 proxies, allowing to download files from [Tor](https://www.torproject.org/).

Inspired by [bearjaws/node-wget](https://github.com/bearjaws/node-wget)

## Features
- [X] Socks Proxy Support

## Todo
- [ ] HTTP/HTTPS Proxy Support
- [ ] CI Tests
- [ ] Improve Documentation
- [ ] Infinite Loop Detection
- [ ] Custom Request Header Support

## Install
`npm install @copulatrix/wget`

## wget(`<url>`, `<destination>`, `<options>`)
```js
var wget = require('@copulatrix/wget');

var download = wget.wget('http://ftp.iinet.net.au/pub/test/5meg.test1', '5meg.test', {
    proxy: 'socks://127.0.0.1:9050/' // optional
});

download.on('error', (error) => {
    console.log(error);
});

download.on('wget', () => {
    console.log('call added to stack');
});

download.on('statuscode', (statuscode) => {
    console.log(statuscode);
});

download.on('filesize', (filesize) => {
    console.log(filesize);
});

download.on('headers', (headers) => {
    console.log(headers);
    // request.abort(); if you just want the headers.
});

download.on('progress', (progress) => {
    console.log(progress);
});

download.on('bytes', (bytes) => {
    console.log(bytes);
});

download.on('chunk', (chunk) => {
    console.log(chunk);
});

download.on('aborted', (aborted) => {
    console.log(aborted);
});

download.on('end', (end) => {
    console.log(end);
});

download.on('complete', (filesize) => {
    console.log(filesize);
});

download.wget();
```


## request(`<url>`, `<options>`)
```js
var wget = require('@copulatrix/wget');

var request = wget.request('http://ftp.iinet.net.au/pub/test/5meg.test1', {
    proxy: 'socks://127.0.0.1:9050/' // optional
});

request.on('error', (error) => {
    console.log(error);
});

request.on('request', () => {
    console.log('call added to stack');
});

request.on('statuscode', (statuscode) => {
    console.log(statuscode);
});

request.on('filesize', (filesize) => {
    console.log(filesize);
});

request.on('headers', (headers) => {
    console.log(headers);
    // request.abort(); if you just want the headers.
});

request.on('progress', (progress) => {
    console.log(progress);
});

request.on('bytes', (bytes) => {
    console.log(bytes);
});

request.on('chunk', (chunk) => {
    console.log(chunk);
});

request.on('aborted', (aborted) => {
    console.log(aborted);
});

request.on('end', (end) => {
    console.log(end);
});

request.wget();
```

## Aborting the Connection
Calling `.abort()` on `wget.request` or `wget.request` will abort the connection.<br>
This is useful if you just want to receive the `headers`.

## Events
|Event|wget.wget|wget.request|Trigger|Message|
|-|-|-|-|-|
|`wget`|✅|❌|When call has been added to the stack.|`NULL`|
|`request`|❌|✅|When call has been added to the stack.|`NULL`|
|`error`|✅|✅|When an error has occurred.|`Error`|
|`statuscode`|✅|✅|When the headers have been received.|`Int` HTTP Status Code|
|`filesize`|✅|✅|When the headers have been received.|`Int` Content-Length header value ***or*** `NULL`|
|`headers`|✅|✅|When the headers have been received.|`JSON Object` HTTP Response Headers|
|`progress`|✅|✅|When a `chunk` has been received.|`Float`|
|`bytes`|✅|✅|When a `chunk` has been received.|`Int`|
|`chunk`|✅|✅|When a `chunk` has been received.|`Object`|
|`aborted`|✅|✅|When the request has been aborted.|`NULL`|
|`end`|✅|✅|When the request has completed.|`Int` Response in bytes.|
|`complete`|✅|❌|When an file has finished writing to disk.|`Int` Saved file's size in bytes.|
|`event`|✅|✅|When an event has been triggered.|[`String`, `Mixed`]|