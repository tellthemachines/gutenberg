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
	hasPackageProp,
	hasProjectFile,
} = require( '../utils' );

const args = getCliArgs();

const hasFiles = minimist( args )._.length > 0;
const defaultFilesArgs = ! hasFiles ? [ '.' ] : [];

const hasLintConfig = hasCliArg( '-c' ) ||
	hasCliArg( '--config' ) ||
	hasProjectFile( '.eslintrc.js' ) ||
	hasProjectFile( '.eslintrc.yaml' ) ||
	hasProjectFile( '.eslintrc.yml' ) ||
	hasProjectFile( '.eslintrc.json' ) ||
	hasProjectFile( '.eslintrc' ) ||
	hasPackageProp( 'eslintConfig' );

// When a configuration is not provided by the project, use from the default
// provided with the scripts module. Instruct ESLint to avoid discovering via
// the `--no-eslintrc` flag, as otherwise it will still merge with inherited.
const defaultConfigArgs = ! hasLintConfig ?
	[ '--no-eslintrc', '--config', fromConfigRoot( '.eslintrc.js' ) ] :
	[];

const result = spawn(
	resolveBin( 'eslint' ),
	[ ...defaultConfigArgs, ...args, ...defaultFilesArgs ],
	{ stdio: 'inherit' }
);

process.exit( result.status );
