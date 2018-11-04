// MIT License

// Copyright (c) 2016-2018 David Betz

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict"

const fs = require('fs')
const path = require('path')
const debug = require('debug')('econtent')

const beginre = /@@begin\|([0-9a-zA-Z_]+)\:([0-9a-zA-Z_]+)@@/
const subre = /^@@([0-9a-zA-Z_]+)\:([0-9a-zA-Z_]+)@@/
const startmetare = /^@([0-9a-zA-Z_\|]+)@(.*)/
const metare = /@@([0-9a-zA-Z_]+)\|([0-9a-zA-Z_]+)@@/

const read = function (input) {
    input = input.replace(/\r\n/g, '\n')
    let obj = {}
    let body = []
    let index = 0
    let section_data
    let content = {}
    let format_content
    let format_index
    for (let line of input.split('\n')) {
        if (line.length == 0)
            continue
        if (line.startsWith('@@')) {
            if (line.startsWith('@@begin|')) {
                let beginresult = beginre.exec(line)
                if (beginresult != null) {
                    let [, type, code] = beginresult
                    content[index] = body.join('\n')
                    index = index + 1
                    body = []
                    section_data = { 'type': type, 'code': code }

                    format_index = 0
                    format_content = {}
                }
            }
            /* istanbul ignore next */
            else if (typeof section_data !== 'undefined' && line.startsWith('@@')) {
                if (line == '@@end@@') {
                    /* istanbul ignore next */
                    if (typeof format_content === 'undefined') {
                        /* istanbul ignore next */
                        throw new Error('unknown scenario')
                    }
                    else {
                        format_content[format_index] = {
                            '_': body.join('\n')
                        }
                        if(typeof format_content[format_index] !== 'undefined') {
                            format_content[format_index][section_data['type']] = section_data['code']
                        }
                        content[index] = format_content
                    }

                    index = index + 1
                    body = []
                    section_data = undefined
                    format_content = undefined
                }
                else {
                    let switchresult = subre.exec(line)
                    if (switchresult != null) {
                        let [, type, code] = switchresult
                        // if (format_content == null) {
                        //     format_content = {}
                        //     format_index = 0
                        // }
                        format_content[format_index] = {
                            '_': body.join('\n')
                        }
                        format_content[format_index][section_data['type']] = section_data['code']
                        section_data = { 'type': type, 'code': code }
                        format_index = format_index + 1
                        body = []
                    }
                }
            }
        }
        else if (line[0] == '@') {
            let startmetaresult = startmetare.exec(line)
            if (startmetaresult != null) {
                let [, tag_type, tag_content] = startmetaresult
                tag_content = tag_content.trim()
                if (tag_type.indexOf('|') > -1) {
                    let [bar_left, bar_right] = tag_type.split('|')
                    obj[bar_left] = { }
                    obj[bar_left][bar_right] = tag_content

                }
                else {
                    //+ don't save most stuff with prefix; it's my universal code for disabled (or system)
                    //+   it's VERY common to overwrite _created and _modified (since they are often killed
                    //+   when they go across FTP; but you can't mess with immutable stuff (e.g. filename)
                    /* istanbul ignore next */
                    if (!tag_type.startsWith('_') || tag_type == '_created' || tag_type == '_modified') {
                        obj[tag_type] = tag_content
                    }
                }
            }
        }
        else {
            // let metaresult = metare.exec(line)
            // if (metaresult != null) {
            //     let [, type, code] = metaresult
            //     //+ don't really do anything; just good to know about
            // }

            body.push(line)
        }
    }

    if (body.length > 0) {
        content[index] = body.join('\n')
        obj['_'] = content
    }

    return obj
}

const readFile = function (filepath) {
    debug('readFile', filepath)
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', function (err, data) {
            if (err) return reject(err)

            let obj = read(data)

            fs.stat(filepath, (err, file_data) => {
                //+ due to a file system design flaw, not all file systems have a file created date
                if (!obj['_created']) {
                    obj['_created'] = file_data.ctime
                }
                if (!obj['_modified']) {
                    obj['_modified'] = file_data.mtime
                }
                obj['_filename'] = path.basename(filepath)

                const _filename = obj['_filename']
                let lio = _filename.lastIndexOf('.')
                if (lio == -1) {
                    obj['_extension'] = ''
                    obj['_basename'] = _filename
                }
                else {
                    const first = _filename.substring(0, lio)
                    const second = _filename.substring(lio + 1, _filename.length)
                    obj['_extension'] = second
                    obj['_basename'] = first
                }

                return resolve(obj)
            })
        })
    })
}

module.exports = {
    read,
    readFile
}