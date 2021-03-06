import jsonImporter from '../src/index';
import sass         from 'node-sass';
import {expect}     from 'chai';
import {resolve}    from 'path';

const EXPECTATION1 = 'body {\n  color: #c33; }\n';
const EXPECTATION2 = 'p::after {\n  color: black;\n  content: "Ashness Pier, Derwentwater, Lake District, Cumbria, UK."; }\n';
const EXPECTATION3 = '.color-red {\n  color: #c33; }\n';

describe('Import type test', function() {

  it('imports strings', function() {
    let result = sass.renderSync({
      file: './test/fixtures/strings/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it('imports *.js', function() {
    let result = sass.renderSync({
      file: './test/fixtures/js/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it('pass arguments when importing as query string', function() {
    let result = sass.renderSync({
      file: './test/fixtures/query/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it('import spesific key by passing `path` as query sting key', function() {
    let result = sass.renderSync({
      file: './test/fixtures/queryPath/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it('generate getter functions by passing `getter` as query sting key', function() {
    let result = sass.renderSync({
      file: './test/fixtures/queryGetter/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });
  it('generate getter functions by passing `withKeys` as query sting key', function() {
    let result = sass.renderSync({
      file: './test/fixtures/queryGetter/styleWithKeys.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION3);
  });

  // Added as failing test for: https://github.com/Updater/node-sass-json-importer/pull/5
  it('imports strings with spaces and/or commas but without parentheses', function() {
    let result = sass.renderSync({
      file: './test/fixtures/strings/content.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION2);
  });

  it('imports lists', function() {
    let result = sass.renderSync({
      file: './test/fixtures/lists/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it('imports maps', function() {
    let result = sass.renderSync({
      file: './test/fixtures/maps/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it('finds imports via includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures/include-paths/style.scss',
      includePaths: ['./test/fixtures/include-paths/variables'],
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it('finds imports via multiple includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures/include-paths/style.scss',
      includePaths: ['./test/fixtures/include-paths/variables', './some/other/path/'],
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION1);
  });

  it(`throws when an import doesn't exist`, function() {
    function render() {
      sass.renderSync({
        file: './test/fixtures/include-paths/style.scss',
        includePaths: ['./test/fixtures/include-paths/foo'],
        importer: jsonImporter
      });
    }

    expect(render).to.throw(
      'Unable to find "variables.json" from the following path(s): ' +
      `${resolve(process.cwd(), 'test/fixtures/include-paths')}, ./test/fixtures/include-paths/foo. ` +
      'Check includePaths.'
    );
  });
});
