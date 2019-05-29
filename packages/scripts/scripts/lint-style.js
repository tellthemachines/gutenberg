/**
 * External dependencies
 */
const minimist = require( 'minimist' );
const { sync: spawn } = require( 'cross-spawn' );
const { sync: resolveBin } = require( 'resolve-bin' );

/**
 * Internal dependencies
 */
const {
	fromConfigRoot,
	getCliArgs,
	hasCliArg,
	hasProjectFile,
	hasPackageProp,
} = require( '../utils' );

const args = getCliArgs();

const hasFiles = minimist( args )._.length > 0;
const defaultFilesArgs = ! hasFiles ? [ '**/*.{css,scss}' ] : [];

const hasStylelintConfig = hasCliArg( '--config' ) ||
	hasProjectFile( '.stylelintrc' ) ||
	hasProjectFile( '.stylelintrc.js' ) ||
	hasProjectFile( '.stylelintrc.json' ) ||
	hasProjectFile( '.stylelintrc.yaml' ) ||
	hasProjectFile( '.stylelintrc.yml' ) ||
	hasProjectFile( '.stylelint.config.js' ) ||
	hasPackageProp( 'stylelint' );

const defaultConfigArgs = ! hasStylelintConfig ?
	[ '--config', fromConfigRoot( '.stylelintrc.json' ) ] :
	[];

const result = spawn(
	resolveBin( 'stylelint' ),
	[ ...defaultConfigArgs, ...args, ...defaultFilesArgs ],
	{ stdio: 'inherit' }
);

process.exit( result.status );
