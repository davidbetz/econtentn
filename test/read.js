"use strict"

const expect = require('chai').expect
const assert = require('chai').assert

const fs = require('fs')
const path = require('path')

const econtent = require('../econtent')

const CURRENT_PATH = __dirname
const SAMPLE_PATH = path.join(CURRENT_PATH, '../sample')
const ITEM01_PATH = path.join(SAMPLE_PATH, 'item01.txt')
const ITEM02_PATH = path.join(SAMPLE_PATH, 'item02.txt')
const ITEM03_PATH = path.join(SAMPLE_PATH, 'item03.txt')
const ITEM04_PATH = path.join(SAMPLE_PATH, 'item04-noext')
const ITEM05_PATH = path.join(SAMPLE_PATH, 'item05.txt')
const MANIFEST_PATH = path.join(SAMPLE_PATH, '.manifest')

const ITEM01_EXPECTED = {
    '_': {
        0: 'hollow unbraced needs mineral high fingerd strings red tragical having definement invisible@@footnote|78@@. flames grow pranks obey hearsed variable grandsire bodykins possessd worser oerthrown oerweigh healthful kingly wise faculty loggats best.\n\nunfortified chopine hill witchcraft countries toward nerve grief duty rivals.',
        1: {
            0: {
                '_': "    alert((function() {\n      var item = 'item01'\n      return item.split('').reverse()\n    })())",
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
    '_basename': 'item01'
}

const ITEM02_EXPECTED = {
    '_': {
        0: 'hollow unbraced needs mineral high fingerd strings red tragical having definement invisible@@footnote|78@@. flames grow pranks obey hearsed variable grandsire bodykins possessd worser oerthrown oerweigh healthful kingly wise faculty loggats best.\n\nunfortified chopine hill witchcraft countries toward nerve grief duty rivals.',
        1: {
            0: {
                '_': "    alert((function() {\n      var item = 'item01'\n      return item.split('').reverse()\n    })())",
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
    '_filename': 'item02.txt',
    '_extension': 'txt',
    '_basename': 'item02'
}

const ITEM03_EXPECTED = {
    '_': {
        0: 'hollow unbraced needs mineral high fingerd strings red tragical having definement invisible@@footnote|78@@. flames grow pranks obey hearsed variable grandsire bodykins possessd worser oerthrown oerweigh healthful kingly wise faculty loggats best.\n\nunfortified chopine hill witchcraft countries toward nerve grief duty rivals.',
        1: {
            0: {
                '_': "    alert((function() {\n      var item = 'item01'\n      return item.split('').reverse()\n    })())",
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
    '_filename': 'item03.txt',
    '_extension': 'txt',
    '_basename': 'item03'
}

const ITEM04_EXPECTED = {
    '_': {
        0: 'hollow unbraced needs mineral high fingerd strings red tragical having definement invisible@@footnote|78@@. flames grow pranks obey hearsed variable grandsire bodykins possessd worser oerthrown oerweigh healthful kingly wise faculty loggats best.\n\nunfortified chopine hill witchcraft countries toward nerve grief duty rivals.',
        1: {
            0: {
                '_': "    alert((function() {\n      var item = 'item01'\n      return item.split('').reverse()\n    })())",
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
    '_filename': 'item04-noext',
    '_extension': '',
    '_basename': 'item04-noext'
}

const ITEM05_EXPECTED = {
    '_': {
        0: 'hollow unbraced needs mineral high fingerd strings red tragical having definement invisible@@footnote|78@@. flames grow pranks obey hearsed variable grandsire bodykins possessd worser oerthrown oerweigh healthful kingly wise faculty loggats best.\n\nunfortified chopine hill witchcraft countries toward nerve grief duty rivals.',
        1: {
            0: {
                '_': "    alert((function() {\n      var item = 'item01'\n      return item.split('').reverse()\n    })())",
                'format': 'javascript'
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
    '_filename': 'item05.txt',
    '_extension': 'txt',
    '_basename': 'item05'
}

const MANIFEST_EXPECTED = {
    'author': 'Billy Speareshakes',
    'title': 'Thy Wonderful Randomious',
    'page': '728',
    '_created': '2016-07-27T19:38:10Z',
    '_modified': '2016-07-27T19:38:10Z',
    '_filename': '.manifest',
    '_extension': 'manifest',
    '_basename': ''
}

describe("econtent", function () {
    it("tests parse", function (done) {
        fs.readFile(ITEM01_PATH, 'utf8', function (err, data) {
            let result = econtent.read(data)

            check(ITEM01_EXPECTED, result)
            done()
        })
    })

    it("tests file parse", async () => {
        const result = await econtent.readFile(ITEM01_PATH)
        check(ITEM01_EXPECTED, result)
        checkfs(ITEM01_EXPECTED, result)
        check_file_data(ITEM01_EXPECTED, result)
    })

    it("tests parse (single block)", async () => {
        const result = await econtent.readFile(ITEM05_PATH)
        check(ITEM05_EXPECTED, result, true)
        check_file_data(ITEM05_EXPECTED, result)
    })

    it("tests file parse (missing file)", async () => {
        try {
            await econtent.readFile('asfa')
            expect(1).to.eq(0)
        }
        catch(ex) {
            expect(ex.message.indexOf('no such file or directory')).to.greaterThan(-1)
        }
    })

    it("tests file parse (missing mod time)", function (done) {
        econtent.readFile(ITEM02_PATH)
            .then(result => {
                check(ITEM02_EXPECTED, result)
                check_file_data(ITEM02_EXPECTED, result)

                expect(ITEM02_EXPECTED['_created']).to.equal(result['_created'])

                fs.stat(ITEM02_PATH, (err, file_data) => {
                    if (err) throw reject(err)
                    expect(file_data.mtime.getTime()).to.equal(result['_modified'].getTime())
                    done()
                })
            })
    })

    it("tests file parse (missing create time)", function (done) {
        econtent.readFile(ITEM03_PATH)
            .then(result => {
                check(ITEM03_EXPECTED, result)
                
                check_file_data(ITEM03_EXPECTED, result)

                expect(ITEM03_EXPECTED['_modified']).to.equal(result['_modified'])

                fs.stat(ITEM03_PATH, (err, file_data) => {
                    if (err) throw reject(err)
                    expect(file_data.ctime.getTime()).to.equal(result['_created'].getTime())
                    done()
                })
            })
    })

    it("tests file parse (no extension)", async () => {
        const result = await econtent.readFile(ITEM04_PATH)
        check(ITEM04_EXPECTED, result)
        checkfs(ITEM04_EXPECTED, result)
        check_file_data(ITEM04_EXPECTED, result)
    })

    it("tests parse manifest", async () => {
        const result = await econtent.readFile(MANIFEST_PATH)
        expect(result['_']).to.equal(undefined)

        expect(MANIFEST_EXPECTED['author']).to.equal(result['author'])
        expect(MANIFEST_EXPECTED['title']).to.equal(result['title'])
        expect(MANIFEST_EXPECTED['page']).to.equal(result['page'])
        expect(MANIFEST_EXPECTED['_created']).to.equal(result['_created'])
        expect(MANIFEST_EXPECTED['_modified']).to.equal(result['_modified'])

        check_file_data(MANIFEST_EXPECTED, result)
    })

    function check_file_data(expected, result) {
        expect(expected['_filename']).to.equal(result['_filename'])
        expect(expected['_extension']).to.equal(result['_extension'])
        expect(expected['_basename']).to.equal(result['_basename'])
    }

    function checkfs(expected, result) {
        expect(expected['_created']).to.equal(result['_created'])
        expect(expected['_modified']).to.equal(result['_modified'])
    }

    function check(expected, result, isSingle = false) {
        expect(expected['_'][0]).to.equal(result['_'][0])
        expect(expected['_'][1][0]['_']).to.equal(result['_'][1][0]['_'])
        expect(expected['_'][1][0]['format']).to.equal(result['_'][1][0]['format'])
        if(isSingle === false) {
            expect(expected['_'][1][1]['_']).to.equal(result['_'][1][1]['_'])
            expect(expected['_'][1][1]['format']).to.equal(result['_'][1][1]['format'])
        }
        expect(expected['_'][2]).to.equal(result['_'][2])
        expect(expected['author']).to.equal(result['author'])
        expect(expected['title']).to.equal(result['title'])
        expect(expected['page']).to.equal(result['page'])
        expect(expected['footnote']).to.eql(result['footnote'])
    }
})
