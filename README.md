# Extended Content Reader (JavaScript)

Copyright (c) 2016-2018 David Betz

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Build Status](https://travis-ci.org/davidbetz/econtentjs.svg?branch=master)](https://travis-ci.org/davidbetz/econtentjs)
[![npm version](https://badge.fury.io/js/econtent.svg)](https://badge.fury.io/js/econtent)
[![coverage](https://img.shields.io/codecov/c/github/davidbetz/econtentjs.svg)](https://img.shields.io/codecov/c/github/davidbetz/econtentjs.svg)
[![Say Thanks!](https://img.shields.io/badge/Say%20Thanks-!-1EAEDB.svg)](https://saythanks.io/to/davidbetz)

## Installation

    npm install econtent

Home:

* [https://www.npmjs.com/package/econtent](https://www.npmjs.com/package/econtent)

* [https://github.com/davidbetz/econtentjs](https://github.com/davidbetz/econtentjs)

Related project:

* [https://www.npmjs.com/package/etitle](https://www.npmjs.com/package/etitle)

* [https://github.com/davidbetz/etitlejs](https://github.com/davidbetz/etitlejs)

## Purpose

Files have content and metadata. Markdown has already helps us go from boring text files to rich text (without RTF or proprietary voodoo), but it's not enough. My content needs sections and it needs metadata. They already have a create date and a modified date, but I often need to overwrite these. That's where this component comes in. It's been helping me for a few years now (well, this is the Node.JS refactor/port of the [Python edition](https://github.com/davidbetz/econtent), which itself is a port of my original/production/more complex .NET version).

It's easier to following if you just look at the example...

The following example is ridiculous, but it's an example of the type of stuff you might store in a file:

### item01.txt

    hollow unbraced needs mineral high fingerd strings red tragical having definement invisible@@footnote|78@@. flames grow pranks obey hearsed variable grandsire bodykins possessd worser oerthrown oerweigh healthful kingly wise faculty loggats best.

    unfortified chopine hill witchcraft countries toward nerve grief duty rivals.

    @@begin|format:javascript@@
        alert((function() {
          var item = 'item01';
          return item.split('').reverse()
        })());
    @@format:python@@
        print('item01'[::-1])
    @@end@@

    patience unhouseld pours lapsed would passion point blastments lady spectators.

    @author@ Billy Speareshakes
    @title@ Thy Wonderful Randomious
    @page@ 728
    @footnote|78@ nose thee something disclaiming wrung antiquity rend illume halt osric list
    @_created@ 2016-07-27T19:38:10Z
    @_modified@ 2016-07-27T19:38:10Z

There are two paragraphs, followed by a block of JavaScript, then a block of Python, then another paragraph, then a bunch of metadata. It's a rediclous example because it combines concepts from both research website (citations and footnotes) and my [netfxharmonics.com](netfxharmonics.com) website (the javascript section, which in that context in final rendering would be rendered with JavaScript colored syntax).

The current project reads that file as the following object:

    {
        '_': {
            0: 'hollow unbraced needs mineral high fingerd strings red tragical having definement invisible@@footnote|78@@. flames grow pranks obey hearsed variable grandsire bodykins possessd worser oerthrown oerweigh healthful kingly wise faculty loggats best.\n\nunfortified chopine hill witchcraft countries toward nerve grief duty rivals.',
            1: {
                0: {
                    '_': "    alert((function() {\n      var item = 'item01';\n      return item.split('').reverse()\n    })());",
                    'format': 'javascript'
                },
                1: {
                    '_': "    print('item01'[::-1])",
                    'format': 'python'
                }
            },
            2: 'patience unhouseld pours lapsed would passion point blastments lady spectators.',
        },
        'author': 'Billy Speareshakes',
        'title': 'Thy Wonderful Randomious',
        'page': '728',
        'footnote': {
            78: 'nose thee something disclaiming wrung antiquity rend illume halt osric list',        
        },
        '_created': '2016-07-27T19:38:10Z',
        '_modified': '2016-07-27T19:38:10Z',
        '_filename': 'item01.txt',
        '_extension': 'txt',
        '_basename': 'item01',
    }

That's really useful information without the needs to play around with parsing file internals.

The created, modified, filename, extension, and basename are read from the file metadata, but created and modified can be overwritten using @_created@ and @_modified@ tokens.

But, it's not just metadata. On my technical website, I require color syntax for various programming languages. Preformatting makes the code unreadable. So, I need sections(@@begin...@@/@@end@@. On my research website, I require extensive citations and footnotes. So, I need linkable content (@@XXXX@@).

See test_read.py for usage.

## Use Cases

* one entry == blog entry
* one entry == one quote (with citation data)
* one entry == one podcast mp3; you would use something like @audio@ which would tell your custom system that this entry is describing that particular mp3
