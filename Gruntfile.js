module.exports = function(grunt) {
  grunt.initConfig({
    // load package
    
    pkg: grunt.file.readJSON('package.json'),

    // define tasks
    concat: {
      js: {
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        files: [{
          src: [
            'src/**/*.js'
          ],
          dest: 'dist/logic.js'
        }]
      }
    },

    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: 'concat:js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat:js', 'watch']);
}
