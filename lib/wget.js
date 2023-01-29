'use strict';

var FS = require('fs');
var EventEmitter = require('events').EventEmitter;

var Requester = require('./request.js');

class wget{
    constructor(url, destination, options = {}, Events){
        this.Url = url;
        this.Destination = destination;
        this.Options = options;
        this.Events = Events;
    }

    on(event, callback){
        this.Events.on(event, callback);
    }
    emit(event, msg = null){
        this.Events.emit('event', event, msg);
        this.Events.emit(event, msg);
    }

    wget(){
        this.emit('wget', null);

        var WriteStream = FS.createWriteStream(this.Destination, {
            flags: 'w+',
            encoding: 'binary'
        });

        var Request = this.Request = Requester(this.Url, this.Options);

        Request.on('error', (error) => {
            WriteStream.end();
            this.emit(error);
        });

        WriteStream.on('finish', () => {
            FS.stat(this.Destination, (error, stats) => {
                if(error){
                    this.emit('error', error);
                }else{
                    this.emit('complete', stats.size);
                }
            });
            WriteStream.end();
        });

        Request.on('statuscode', (statuscode) => {
            this.emit('statuscode', statuscode);
        });

        Request.on('filesize', (filesize) => {
            this.emit('filesize', filesize);
        });

        Request.on('headers', (headers) => {
            this.emit('headers', headers);
        });

        Request.on('progress', (progress) => {
            this.emit('progress', progress);
        });

        Request.on('bytes', (bytes) => {
            this.emit('bytes', bytes);
        });

        Request.on('chunk', (chunk) => {
            this.emit('chunk', typeof chunk);
        });

        Request.on('aborted', (aborted) => {
            this.emit('aborted', aborted);
        });

        Request.on('end', (end) => {
            this.emit('end', end);
        });

        Request.pipe(WriteStream);
        Request.request();
    }
    abort(){
        if(this.Request){
            this.Request.abort();
        }
    }
}

module.exports = (...args) => {
    var Events = new EventEmitter();

    return new wget(...args, Events);
};