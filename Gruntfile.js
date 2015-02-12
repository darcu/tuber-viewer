module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['main.js']
		},
		browserify: {
			client: {
				src: ['./lib/js/script.js'],
				dest: './lib/js/main.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: true
			},
			build: {
				src: './lib/js/main.js',
				dest: './bin/main.min.js'
			}
		},
		copy: {
			target: {
				files: [{
					expand: true,
					cwd: 'lib/html',
					src: 'index.html',
					dest: 'bin/',
					filter: 'isFile'
				}, {
					expand: true,
					cwd: 'lib/img',
					src: ['**'],
					dest: 'bin/img',
					filter: 'isFile'
				}]
			}
		},
		less: {
			development: {
				options: {
					compress: true,
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
					'bin/css/style.css': 'lib/css/style.less'
				}
			}
		},
		compress: {
			options: {
				archive: function() {
					// var version =
					// return 'build/build.' + Date.now() + '.tar.gz';
					return 'build/build.tar.gz';
				},
				mode: 'tgz'
			},
			def: {
				expand: true,
				cwd: 'bin/',
				src: ['**/*'],
				dest: '/'
			}
		},
		shell: {
			options: {
				stderr: false
			},
			scp: {
				command: 'scp build/* drc@128.199.61.92:/home/drc/tuberViewer'
			},
			version: {
				command: 'cat package.json | grep version| sed -s "s/[^0-9\.]//g"'
			},
			del: {
				command: 'rm -rf build/*'
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-shell');

	// Default task(s).
	grunt.registerTask('default', ['less', 'browserify', 'uglify', 'copy']);
	grunt.registerTask('deploy', ['default', 'shell:del', 'compress', 'shell:scp']);
};
