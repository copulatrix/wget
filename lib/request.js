'use strict';

var EventEmitter = require('events').EventEmitter;
var UrlParser = require('url').parse;

var http = require('http');
var https = require('https');

var ReqProtos = {
    'http:': http,
    'https:': https
};

var SocksProxyAgent = require('socks-proxy-agent').SocksProxyAgent;

var ProxProtos = {
    'socks5:': SocksProxyAgent
};

class request{
    constructor(url, options = {}){
        this.Events = new EventEmitter();
        this.Url = url;
        this.Options = options;
    }

    on(event, callback){
        this.Events.on(event, callback);
    }
    emit(event, msg = null){
        this.Events.emit('event', event, msg);
        this.Events.emit(event, msg);
    }

    request(){
        this.emit('request', null);

        var Url = UrlParser(this.Url);

        
        var RequestOptions = {};

        if(this.Options.proxy){
            var Proxy = UrlParser(this.Options.proxy);
            if(ProxProtos[Proxy.protocol]){
                RequestOptions.agent = new ProxProtos[Proxy.protocol](Proxy.href);
            }else{
                this.emit('error', `${Proxy.protocol} proxy is not supported!`)
            }
        }

        if(ReqProtos[Url.protocol]){
            var Request = this.Request = ReqProtos[Url.protocol].request(Url.href, RequestOptions, (Response) => {
                var Filesize = Number(Response.headers['content-length']);
                if(isNaN(Filesize) === true){Filesize = null;}

                var DownloadedSize = 0;

                this.emit('statuscode', Response.statusCode);
                this.emit('filesize', Filesize);
                this.emit('headers', Response.headers);

                Response.on('data', (chunk) => {
                    DownloadedSize += chunk.length;
                    this.emit('progress', this.calculateProgress(Filesize, DownloadedSize));
                    this.emit('bytes', DownloadedSize);
                    this.emit('chunk', chunk);
                });

                Response.on('end', () => {
                    this.emit('progress', this.calculateProgress(1, 1));
                    this.emit('filesize', DownloadedSize);
                    this.emit('end', DownloadedSize);
                });

                if(this.Stream){
                    Response.pipe(this.Stream)
                }
            });
            Request.on('error', (error) => {this.emit('error', error);});
            Request.end();
        }else{
            this.emit('error', 'Your URL must use either HTTP or HTTPS.')
        }
    }

    calculateProgress(Filesize, TotalDownloaded){
        if(Filesize === null){
            var Length = String(TotalDownloaded).length;
            Filesize = Math.pow(10, Length) + 1;
        }
    
        return parseFloat(((TotalDownloaded / Filesize)*100).toFixed(2));
    }

    pipe(Stream){
        this.Stream = Stream;
    }
    abort(){
        if(this.Request){
            this.Request.abort();
            this.emit('aborted', null);
        }
    }
}

module.exports = (...args) => {
    return new request(...args);
};